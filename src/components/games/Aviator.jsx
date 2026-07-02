import React, { useState, useEffect, useRef, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { ChevronLeft, Play, X, ShieldAlert, Award, User, Volume2, VolumeX } from 'lucide-react';

// Web Audio API synthesizer for premium game sound effects without external files
const playSynthSound = (type, volumeOn) => {
  if (!volumeOn) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (type === 'engine') {
      // Propeller engine hum
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 4);
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 4);
    } else if (type === 'cashout') {
      // High-pitched win notification chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc1.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      osc1.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
      
      osc2.frequency.setValueAtTime(1046.50, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.6);
      osc2.stop(ctx.currentTime + 0.6);
    } else if (type === 'crash') {
      // White noise explosion / pitch dive
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.8);
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    }
  } catch (e) {
    console.error("Audio synth error:", e);
  }
};

const Aviator = () => {
  const { user, setTab, deductBalance, addWinningsAndRecordBet } = useContext(AppContext);
  const [soundOn, setSoundOn] = useState(true);

  // Betting states
  const [betAmount, setBetAmount] = useState(100);
  const [hasBet, setHasBet] = useState(false);
  const [autoCashout, setAutoCashout] = useState(false);
  const [autoCashoutValue, setAutoCashoutValue] = useState(2.0);
  
  // Game Loop States
  // 'waiting' (5s countdown), 'running' (plane climbing), 'crashed' (flew away)
  const [gameState, setGameState] = useState('waiting'); 
  const [waitingCountdown, setWaitingCountdown] = useState(5.0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [history, setHistory] = useState([1.52, 2.80, 1.12, 10.45, 1.23, 4.50, 1.05, 8.42, 1.95, 3.20]);
  const [flewAwayMultiplier, setFlewAwayMultiplier] = useState(null);

  // Live bets simulation
  const [liveBets, setLiveBets] = useState([]);

  // Animation frame reference
  const requestRef = useRef();
  const startTimeRef = useRef();
  const crashPointRef = useRef(2.5); // Random crash point generated when round starts
  const isCashedOutRef = useRef(false);

  // Generate live users list
  useEffect(() => {
    const dummyNames = ["Rahul_k", "Anjali_S", "Vijay99", "Vikram_b", "Karan_Verma", "Priya_12", "Amit_Roy", "Neha_G", "Sanjay_D", "Rohan_M"];
    const initialBets = dummyNames.map((name, i) => ({
      username: name,
      amount: Math.floor(50 + Math.random() * 1500),
      cashoutAt: (1.2 + Math.random() * 4).toFixed(2),
      cashedOut: false,
      payout: 0
    }));
    setLiveBets(initialBets);
  }, [gameState === 'waiting']);

  // Handle main game cycles
  useEffect(() => {
    let timer;
    if (gameState === 'waiting') {
      isCashedOutRef.current = false;
      // Generate next crash point. Standard crash distributions (mostly low multipliers, occasionally very high)
      const r = Math.random();
      let crashPoint = 1.00;
      if (r > 0.08) {
        // Log-normal distribution approximation
        crashPoint = parseFloat((1.00 + Math.pow(Math.E, Math.random() * 1.8) - 1).toFixed(2));
      }
      crashPointRef.current = Math.max(1.00, crashPoint);
      
      setWaitingCountdown(5.0);
      
      const countdownInterval = setInterval(() => {
        setWaitingCountdown(prev => {
          if (prev <= 0.1) {
            clearInterval(countdownInterval);
            setGameState('running');
            return 0;
          }
          return parseFloat((prev - 0.1).toFixed(1));
        });
      }, 100);

      return () => clearInterval(countdownInterval);
    }

    if (gameState === 'running') {
      playSynthSound('engine', soundOn);
      startTimeRef.current = performance.now();
      
      const updateMultiplier = (nowTime) => {
        const elapsed = (nowTime - startTimeRef.current) / 1000; // in seconds
        
        // Multiplier grows exponentially over time
        // t = 0 -> 1.00
        // t = 5 -> ~2.00
        // t = 10 -> ~4.50
        const multiplier = parseFloat((1.00 * Math.exp(elapsed * 0.15)).toFixed(2));
        
        // Auto-cashout trigger
        if (hasBet && !isCashedOutRef.current && autoCashout && multiplier >= autoCashoutValue) {
          handleCashout(multiplier);
        }

        // Simulating dummy players cashing out
        setLiveBets(prev => prev.map(b => {
          if (!b.cashedOut && multiplier >= parseFloat(b.cashoutAt) && parseFloat(b.cashoutAt) < crashPointRef.current) {
            return { ...b, cashedOut: true, payout: Math.floor(b.amount * parseFloat(b.cashoutAt)) };
          }
          return b;
        }));

        if (multiplier >= crashPointRef.current) {
          // Crash the plane!
          playSynthSound('crash', soundOn);
          setCurrentMultiplier(crashPointRef.current);
          setFlewAwayMultiplier(crashPointRef.current);
          setHistory(prev => [crashPointRef.current, ...prev.slice(0, 9)]);
          setGameState('crashed');
          setHasBet(false);
        } else {
          setCurrentMultiplier(multiplier);
          requestRef.current = requestAnimationFrame(updateMultiplier);
        }
      };

      requestRef.current = requestAnimationFrame(updateMultiplier);
      return () => cancelAnimationFrame(requestRef.current);
    }

    if (gameState === 'crashed') {
      timer = setTimeout(() => {
        setGameState('waiting');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  // Bet placement
  const handlePlaceBet = () => {
    if (hasBet) {
      // Cancel bet before round starts
      if (gameState === 'waiting') {
        // Refund
        addWinningsAndRecordBet("Aviator", betAmount, 0, "Refund", "Success", betAmount);
        setHasBet(false);
      }
      return;
    }

    if (betAmount <= 0) return;
    const success = deductBalance(betAmount);
    if (success) {
      setHasBet(true);
    }
  };

  // Cashout action
  const handleCashout = (multiplier = currentMultiplier) => {
    if (isCashedOutRef.current || !hasBet || gameState !== 'running') return;
    isCashedOutRef.current = true;
    setHasBet(false);
    playSynthSound('cashout', soundOn);
    
    const payout = betAmount * multiplier;
    addWinningsAndRecordBet("Aviator", betAmount, multiplier, `Cashout @ ${multiplier}x`, "Success", payout);
  };

  // Format crash history bubbles
  const getMultiplierColor = (mult) => {
    if (mult < 1.2) return '#8c9ab0'; // grey
    if (mult < 2.0) return '#3b82f6'; // blue
    if (mult < 10.0) return '#c084fc'; // purple
    return '#ef4444'; // red
  };

  return (
    <div style={{ backgroundColor: '#10141b', minHeight: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header */}
      <div className="header-bar" style={{ background: '#181f29', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button className="header-action-btn" onClick={() => setTab('Home')}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '15px', fontWeight: '800', letterSpacing: '1px', color: '#e42b44' }}>AVIATOR</span>
          <span style={{ fontSize: '10px', background: '#e42b44', color: '#fff', padding: '1px 5px', borderRadius: '4px', fontWeight: '800' }}>PRO</span>
        </div>
        <button className="header-action-btn" onClick={() => setSoundOn(!soundOn)}>
          {soundOn ? <Volume2 size={18} color="#e42b44" /> : <VolumeX size={18} color="var(--text-muted)" />}
        </button>
      </div>

      {/* History multi-strip */}
      <div style={{ background: '#141a23', padding: '8px 12px', display: 'flex', gap: '8px', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        {history.map((mult, idx) => (
          <span 
            key={idx} 
            style={{ 
              fontSize: '11px', 
              fontWeight: '700', 
              color: getMultiplierColor(mult), 
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${getMultiplierColor(mult)}40`,
              padding: '2px 8px', 
              borderRadius: '10px',
              whiteSpace: 'nowrap'
            }}
          >
            {mult.toFixed(2)}x
          </span>
        ))}
      </div>

      {/* Sky/Flying Visual Screen */}
      <div style={{ 
        height: '240px', 
        margin: '12px', 
        background: 'linear-gradient(180deg, #161c28 0%, #0d1118 100%)', 
        borderRadius: '12px', 
        position: 'relative', 
        overflow: 'hidden',
        border: '1px solid rgba(228, 43, 68, 0.15)',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
      }}>
        {/* Radar/Grid background overlay */}
        <div style={{ 
          position: 'absolute', 
          width: '100%', 
          height: '100%', 
          backgroundImage: 'linear-gradient(rgba(228, 43, 68, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(228, 43, 68, 0.05) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          opacity: 0.8
        }} />

        {/* Display Info / Multipliers */}
        {gameState === 'waiting' && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            {/* Spinning propeller spinner */}
            <div style={{
              width: '45px',
              height: '45px',
              border: '3px solid rgba(228, 43, 68, 0.2)',
              borderTop: '3px solid #e42b44',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '12px'
            }} />
            <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Waiting for next round</div>
            <div style={{ fontSize: '32px', color: '#fff', fontWeight: '900', marginTop: '4px' }}>{waitingCountdown.toFixed(1)}s</div>
            {hasBet && (
              <div style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 10px', borderRadius: '10px', marginTop: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                Bet Accepted (₹{betAmount})
              </div>
            )}
          </div>
        )}

        {gameState === 'running' && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <div style={{ fontSize: '56px', color: '#fff', fontWeight: '900', textShadow: '0 0 20px rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
              {currentMultiplier.toFixed(2)}x
            </div>
            {isCashedOutRef.current && (
              <div style={{ fontSize: '14px', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 14px', borderRadius: '20px', fontWeight: '700', border: '1px solid #10b981' }}>
                Cashed Out!
              </div>
            )}
          </div>
        )}

        {gameState === 'crashed' && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, background: 'rgba(228, 43, 68, 0.05)' }}>
            <div style={{ fontSize: '24px', color: '#ef4444', fontWeight: '900', letterSpacing: '1.5px', textTransform: 'uppercase', textShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}>
              Flew Away!
            </div>
            <div style={{ fontSize: '42px', color: '#ef4444', fontWeight: '900', fontFamily: 'monospace', marginTop: '4px' }}>
              {flewAwayMultiplier?.toFixed(2)}x
            </div>
          </div>
        )}

        {/* Plane Flying Graph Canvas/SVG */}
        {gameState === 'running' && (
          <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%' }}>
            {/* Red glow trailing curve */}
            <path 
              d={`M 0,240 Q ${Math.min(150, currentMultiplier * 45)},${Math.max(160, 240 - currentMultiplier * 20)} ${Math.min(300, currentMultiplier * 50)},${Math.max(40, 240 - (currentMultiplier - 1) * 45)}`}
              fill="none" 
              stroke="#e42b44" 
              strokeWidth="4"
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0px 0px 8px #e42b44)' }}
            />
            {/* Animated SVG Plane Icon at the end of the line */}
            <g transform={`translate(${Math.min(300, currentMultiplier * 50) - 10}, ${Math.max(40, 240 - (currentMultiplier - 1) * 45) - 10})`}>
              <path 
                d="M3 13h6l3 7h2l-2-7h6l2 2h1.5v-6H20l-2 2h-6l2-7h-2l-3 7H3v2z" 
                fill="#e42b44" 
                transform="rotate(-15)"
                style={{ filter: 'drop-shadow(0px 0px 4px #e42b44)', transformOrigin: 'center' }}
              />
            </g>
          </svg>
        )}
      </div>

      {/* Control Panel Card */}
      <div className="card" style={{ margin: '0 12px 12px 12px', background: '#181f29', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        
        {/* Bet inputs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
          
          {/* Bet Amount Panel */}
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Bet Amount</span>
            <div style={{ display: 'flex', alignItems: 'center', background: '#10141b', borderRadius: '10px', padding: '4px' }}>
              <button 
                onClick={() => setBetAmount(prev => Math.max(10, prev - 50))} 
                disabled={hasBet && gameState === 'running'}
                style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#252d3a', color: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
              >
                -
              </button>
              <input 
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 0))}
                disabled={hasBet && gameState === 'running'}
                style={{ flex: 1, border: 'none', background: 'transparent', color: '#fff', textAlign: 'center', fontWeight: '700', fontSize: '14px', width: '40px' }}
              />
              <button 
                onClick={() => setBetAmount(prev => prev + 50)} 
                disabled={hasBet && gameState === 'running'}
                style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#252d3a', color: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
              >
                +
              </button>
            </div>
            {/* Quick selectors */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginTop: '6px' }}>
              {[10, 50, 100, 500].map(v => (
                <button
                  key={v}
                  onClick={() => setBetAmount(v)}
                  disabled={hasBet && gameState === 'running'}
                  style={{ border: 'none', background: '#252d3a', color: '#9ca3af', borderRadius: '6px', padding: '4px 0', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}
                >
                  ₹{v}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Cashout Options */}
          <div style={{ flex: 1, borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Auto Cashout</span>
              <input 
                type="checkbox"
                checked={autoCashout}
                onChange={(e) => setAutoCashout(e.target.checked)}
                disabled={hasBet && gameState === 'running'}
                style={{ accentColor: '#e42b44', width: '15px', height: '15px', cursor: 'pointer' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', background: autoCashout ? '#10141b' : 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '4px', opacity: autoCashout ? 1 : 0.5 }}>
              <button 
                onClick={() => setAutoCashoutValue(prev => Math.max(1.01, parseFloat((prev - 0.1).toFixed(2))))} 
                disabled={!autoCashout || (hasBet && gameState === 'running')}
                style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#252d3a', color: '#fff', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
              >
                -
              </button>
              <input 
                type="number"
                step="0.1"
                value={autoCashoutValue}
                onChange={(e) => setAutoCashoutValue(Math.max(1.01, parseFloat(e.target.value) || 0))}
                disabled={!autoCashout || (hasBet && gameState === 'running')}
                style={{ flex: 1, border: 'none', background: 'transparent', color: '#fff', textAlign: 'center', fontWeight: '700', fontSize: '14px', width: '40px' }}
              />
              <button 
                onClick={() => setAutoCashoutValue(prev => parseFloat((prev + 0.1).toFixed(2)))} 
                disabled={!autoCashout || (hasBet && gameState === 'running')}
                style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#252d3a', color: '#fff', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
              >
                +
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginTop: '6px', opacity: autoCashout ? 1 : 0.5 }}>
              {[1.2, 1.5, 2.0, 5.0].map(v => (
                <button
                  key={v}
                  onClick={() => autoCashout && setAutoCashoutValue(v)}
                  disabled={!autoCashout || (hasBet && gameState === 'running')}
                  style={{ border: 'none', background: '#252d3a', color: '#9ca3af', borderRadius: '6px', padding: '4px 0', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}
                >
                  {v}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        {gameState === 'running' && hasBet ? (
          <button
            onClick={() => handleCashout()}
            disabled={isCashedOutRef.current}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              background: 'linear-gradient(90deg, #ffaa00, #ff8c00)',
              border: 'none',
              color: '#fff',
              fontSize: '18px',
              fontWeight: '900',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255, 140, 0, 0.4)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span>CASH OUT</span>
            <span style={{ fontSize: '12px', fontWeight: '600', marginTop: '2px' }}>
              ₹{(betAmount * currentMultiplier).toFixed(2)}
            </span>
          </button>
        ) : (
          <button
            onClick={handlePlaceBet}
            disabled={gameState === 'running' && !hasBet}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              background: hasBet ? '#ef4444' : '#10b981',
              border: 'none',
              color: '#fff',
              fontSize: '18px',
              fontWeight: '900',
              cursor: 'pointer',
              boxShadow: hasBet ? '0 4px 15px rgba(239, 68, 68, 0.3)' : '0 4px 15px rgba(16, 185, 129, 0.3)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: (gameState === 'running' && !hasBet) ? 0.5 : 1
            }}
          >
            {hasBet ? (
              <>
                <span>CANCEL BET</span>
                <span style={{ fontSize: '10px', fontWeight: '500', marginTop: '2px' }}>Waiting for next round...</span>
              </>
            ) : (
              <>
                <span>PLACE BET</span>
                <span style={{ fontSize: '10px', fontWeight: '500', marginTop: '2px' }}>
                  {gameState === 'running' ? 'Wait for next round' : 'Accepted immediately'}
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {/* User Stats/Live Bets Drawer */}
      <div style={{ flex: 1, margin: '0 12px 12px 12px', background: '#181f29', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ background: '#131922', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#fff' }}>LIVE BETS</span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Total players: {liveBets.length + (hasBet ? 1 : 0)}</span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '180px', padding: '6px 12px' }}>
          {hasBet && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }} />
                <span style={{ fontSize: '11px', color: 'var(--primary-gold)', fontWeight: '700' }}>You ({user.phone.substring(0, 3)}***)</span>
              </div>
              <div style={{ display: 'flex', gap: '20px', fontSize: '11px' }}>
                <span style={{ color: '#fff', fontWeight: '600' }}>₹{betAmount}</span>
                {isCashedOutRef.current ? (
                  <span style={{ color: '#10b981', fontWeight: '700' }}>{currentMultiplier.toFixed(2)}x</span>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>Flying...</span>
                )}
              </div>
            </div>
          )}

          {liveBets.map((player, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={10} color="var(--text-muted)" />
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{player.username}</span>
              </div>
              <div style={{ display: 'flex', gap: '20px', fontSize: '11px' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>₹{player.amount}</span>
                {player.cashedOut ? (
                  <span style={{ color: '#10b981', fontWeight: '600' }}>{player.cashoutAt}x</span>
                ) : gameState === 'crashed' ? (
                  <span style={{ color: '#ef4444' }}>Crashed</span>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>Flying...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inline styles for custom spinning animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Aviator;
