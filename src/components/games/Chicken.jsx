import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { ChevronLeft, Volume2, VolumeX, ShieldAlert, Trophy } from 'lucide-react';

// Web Audio API synthesizer for premium game sound effects without external files
const playChickenSynthSound = (type, volumeOn) => {
  if (!volumeOn) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (type === 'lift') {
      // Metallic dish cover lifting ring
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'chicken') {
      // Happy chime when chicken is found
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25); // A5
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'bone') {
      // Sad buzz when bone is hit
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.4);
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'cashout') {
      // Coins register sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
      osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08); // E6
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {
    console.error("Audio synth error:", e);
  }
};

const Chicken = () => {
  const { user, setTab, deductBalance, addWinningsAndRecordBet } = useContext(AppContext);
  const [soundOn, setSoundOn] = useState(true);

  // Betting states
  const [betAmount, setBetAmount] = useState(100);
  const [bonesCount, setBonesCount] = useState(3); // 1 to 24 bones
  const [isGameActive, setIsGameActive] = useState(false);

  // Grid states
  // 25 tiles. Each is: { id: index, type: 'chicken' | 'bone', isRevealed: bool }
  const [grid, setGrid] = useState([]);
  const [chickensFound, setChickensFound] = useState(0);
  const [outcomeMessage, setOutcomeMessage] = useState(null); // 'win' | 'lose' | null

  // Calculate multipliers based on mine mechanics
  const getMultiplierForRevealed = (revealedCount) => {
    if (revealedCount === 0) return 1.00;
    let mult = 1.0;
    for (let i = 0; i < revealedCount; i++) {
      mult *= (25 - i) / (25 - bonesCount - i);
    }
    // Apply 2.5% house edge for safety
    return parseFloat((mult * 0.975).toFixed(2));
  };

  const currentMultiplier = getMultiplierForRevealed(chickensFound);
  const nextMultiplier = getMultiplierForRevealed(chickensFound + 1);

  // Initialize empty grid on mount
  useEffect(() => {
    resetGrid();
  }, []);

  const resetGrid = () => {
    const emptyGrid = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      type: 'chicken',
      isRevealed: false
    }));
    setGrid(emptyGrid);
    setChickensFound(0);
    setOutcomeMessage(null);
  };

  // Start round
  const handleStartGame = () => {
    if (isGameActive) return;
    if (betAmount <= 0) return;

    const success = deductBalance(betAmount);
    if (!success) return;

    // Generate random layout with chosen number of bones
    const totalCells = Array.from({ length: 25 }, (_, i) => i);
    const boneIndices = new Set();
    while (boneIndices.size < bonesCount) {
      const idx = Math.floor(Math.random() * 25);
      boneIndices.add(idx);
    }

    const newGrid = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      type: boneIndices.has(i) ? 'bone' : 'chicken',
      isRevealed: false
    }));

    setGrid(newGrid);
    setChickensFound(0);
    setIsGameActive(true);
    setOutcomeMessage(null);
  };

  // Click on a tile dome cover
  const handleTileClick = (index) => {
    if (!isGameActive || grid[index].isRevealed) return;

    playChickenSynthSound('lift', soundOn);

    const tile = grid[index];
    const newGrid = [...grid];
    newGrid[index].isRevealed = true;
    setGrid(newGrid);

    if (tile.type === 'bone') {
      // Lost round!
      setIsGameActive(false);
      setOutcomeMessage('lose');
      playChickenSynthSound('bone', soundOn);
      
      // Reveal all tiles
      setGrid(prev => prev.map(t => ({ ...t, isRevealed: true })));
      
      // Record bet
      addWinningsAndRecordBet("Chicken", betAmount, currentMultiplier, `${bonesCount} Bones, hit plate ${index+1}`, "Failed", 0);
    } else {
      // Found chicken!
      const newFoundCount = chickensFound + 1;
      setChickensFound(newFoundCount);
      playChickenSynthSound('chicken', soundOn);

      // Check if all chickens are found (extremely rare)
      if (newFoundCount === (25 - bonesCount)) {
        setIsGameActive(false);
        setOutcomeMessage('win');
        playChickenSynthSound('cashout', soundOn);
        const winMult = getMultiplierForRevealed(newFoundCount);
        const payout = betAmount * winMult;
        addWinningsAndRecordBet("Chicken", betAmount, winMult, `${bonesCount} Bones, fully cleared!`, "Success", payout);
      }
    }
  };

  // Cash out current progress
  const handleCashout = () => {
    if (!isGameActive || chickensFound === 0) return;

    setIsGameActive(false);
    setOutcomeMessage('win');
    playChickenSynthSound('cashout', soundOn);

    const payout = betAmount * currentMultiplier;
    addWinningsAndRecordBet("Chicken", betAmount, currentMultiplier, `${bonesCount} Bones, found ${chickensFound} chickens`, "Success", payout);

    // Reveal all remaining tiles to satisfy user curiosity
    setGrid(prev => prev.map(t => ({ ...t, isRevealed: true })));
  };

  return (
    <div style={{ backgroundColor: '#10141b', minHeight: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header */}
      <div className="header-bar" style={{ background: '#181f29', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button className="header-action-btn" onClick={() => setTab('Home')}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '15px', fontWeight: '800', letterSpacing: '1px', color: '#f3a83b' }}>CHICKEN</span>
          <span style={{ fontSize: '10px', background: '#f3a83b', color: '#1e2531', padding: '1px 5px', borderRadius: '4px', fontWeight: '800' }}>HOT</span>
        </div>
        <button className="header-action-btn" onClick={() => setSoundOn(!soundOn)}>
          {soundOn ? <Volume2 size={18} color="#f3a83b" /> : <VolumeX size={18} color="var(--text-muted)" />}
        </button>
      </div>

      {/* Stats Header Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '12px' }}>
        <div style={{ background: '#181f29', padding: '8px 12px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Current Multiplier</span>
          <span style={{ fontSize: '18px', fontWeight: '900', color: '#10b981' }}>{currentMultiplier.toFixed(2)}x</span>
        </div>
        <div style={{ background: '#181f29', padding: '8px 12px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Next Chicken</span>
          <span style={{ fontSize: '18px', fontWeight: '900', color: '#f3a83b' }}>{nextMultiplier.toFixed(2)}x</span>
        </div>
      </div>

      {/* 5x5 Grid Board Container */}
      <div style={{ padding: '0 12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '8px',
          width: '100%',
          maxWidth: '340px',
          aspectRatio: '1',
          background: '#181f29',
          padding: '12px',
          borderRadius: '16px',
          border: '1px solid rgba(243, 168, 59, 0.15)',
          position: 'relative'
        }}>
          {grid.map((tile, idx) => {
            let tileBg = '#252d3a';
            let overlayIcon = '🍽️'; // Plate/dome dish cover emoji
            
            if (tile.isRevealed) {
              if (tile.type === 'chicken') {
                tileBg = 'rgba(16, 185, 129, 0.15)';
                overlayIcon = '🍗'; // Chicken leg emoji
              } else {
                tileBg = 'rgba(239, 68, 68, 0.15)';
                overlayIcon = '🦴'; // Bone emoji
              }
            }

            return (
              <button
                key={tile.id}
                onClick={() => handleTileClick(idx)}
                disabled={!isGameActive || tile.isRevealed}
                style={{
                  background: tileBg,
                  border: tile.isRevealed ? `1.5px solid ${tile.type === 'chicken' ? '#10b981' : '#ef4444'}` : '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: tile.isRevealed ? '26px' : '22px',
                  cursor: isGameActive && !tile.isRevealed ? 'pointer' : 'default',
                  transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  transform: tile.isRevealed ? 'scale(1)' : 'scale(1.0)',
                  boxShadow: tile.isRevealed ? 'none' : '0 4px 6px rgba(0,0,0,0.15)'
                }}
              >
                <div style={{
                  transform: tile.isRevealed ? 'translateY(0)' : 'translateY(-2px)',
                  transition: 'transform 0.15s ease'
                }}>
                  {overlayIcon}
                </div>
              </button>
            );
          })}

          {/* Outcome Overlays */}
          {outcomeMessage && (
            <div 
              onClick={resetGrid}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(16, 20, 27, 0.9)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                animation: 'fadeIn 0.3s ease-out'
              }}
            >
              {outcomeMessage === 'win' ? (
                <>
                  <div style={{ width: '50px', height: '50px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', border: '2px solid #10b981' }}>
                    <Trophy size={26} color="#10b981" />
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: '#10b981' }}>YOU WON!</div>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#fff', marginTop: '4px' }}>₹{(betAmount * currentMultiplier).toFixed(2)}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>Tap grid to play again</div>
                </>
              ) : (
                <>
                  <div style={{ width: '50px', height: '50px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', border: '2px solid #ef4444' }}>
                    <span style={{ fontSize: '24px' }}>🦴</span>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: '#ef4444' }}>BONE HIT!</div>
                  <div style={{ fontSize: '14px', color: '#fff', marginTop: '4px' }}>Lost ₹{betAmount}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '12px' }}>Tap grid to play again</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Control panel card */}
      <div className="card" style={{ margin: '12px', background: '#181f29', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        
        {/* Bet inputs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
          
          {/* Bet Amount */}
          <div style={{ flex: 1.2 }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Bet Amount</span>
            <div style={{ display: 'flex', alignItems: 'center', background: '#10141b', borderRadius: '10px', padding: '4px' }}>
              <button 
                onClick={() => setBetAmount(prev => Math.max(10, prev - 50))} 
                disabled={isGameActive}
                style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#252d3a', color: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
              >
                -
              </button>
              <input 
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 0))}
                disabled={isGameActive}
                style={{ flex: 1, border: 'none', background: 'transparent', color: '#fff', textAlign: 'center', fontWeight: '700', fontSize: '14px', width: '40px' }}
              />
              <button 
                onClick={() => setBetAmount(prev => prev + 50)} 
                disabled={isGameActive}
                style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#252d3a', color: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
              >
                +
              </button>
            </div>
          </div>

          {/* Bones configuration */}
          <div style={{ flex: 0.8 }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Bones (1-24)</span>
            <div style={{ display: 'flex', alignItems: 'center', background: '#10141b', borderRadius: '10px', padding: '4px' }}>
              <button 
                onClick={() => setBonesCount(prev => Math.max(1, prev - 1))} 
                disabled={isGameActive}
                style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#252d3a', color: '#fff', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
              >
                -
              </button>
              <span style={{ flex: 1, color: '#fff', textAlign: 'center', fontWeight: '700', fontSize: '14px' }}>
                {bonesCount}
              </span>
              <button 
                onClick={() => setBonesCount(prev => Math.min(24, prev + 1))} 
                disabled={isGameActive}
                style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#252d3a', color: '#fff', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Quick multipliers bar for bones */}
        {!isGameActive && (
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '10px' }}>
            {[1, 3, 5, 10, 15, 20].map(b => (
              <button
                key={b}
                onClick={() => setBonesCount(b)}
                style={{
                  border: 'none',
                  background: bonesCount === b ? 'var(--gold-gradient)' : '#252d3a',
                  color: bonesCount === b ? '#1e2531' : 'var(--text-secondary)',
                  borderRadius: '10px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {b} Bones
              </button>
            ))}
          </div>
        )}

        {/* Main Action Button */}
        {isGameActive ? (
          <button
            onClick={handleCashout}
            disabled={chickensFound === 0}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              background: chickensFound === 0 ? '#4b5563' : 'linear-gradient(90deg, #10b981, #059669)',
              border: 'none',
              color: '#fff',
              fontSize: '18px',
              fontWeight: '900',
              cursor: chickensFound === 0 ? 'not-allowed' : 'pointer',
              boxShadow: chickensFound === 0 ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.4)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span>CASH OUT</span>
            <span style={{ fontSize: '12px', fontWeight: '600', marginTop: '2px' }}>
              ₹{(betAmount * currentMultiplier).toFixed(2)} ({currentMultiplier.toFixed(2)}x)
            </span>
          </button>
        ) : (
          <button
            onClick={handleStartGame}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              background: 'var(--gold-gradient)',
              border: 'none',
              color: '#1e2531',
              fontSize: '18px',
              fontWeight: '900',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(243, 168, 59, 0.3)',
              textAlign: 'center'
            }}
          >
            START ROUND
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Chicken;
