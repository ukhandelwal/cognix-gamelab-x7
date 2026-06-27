import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import { ChevronLeft, Volume2, VolumeX, ShieldAlert, Award, FileText, BarChart, History, X, Minus, Plus } from 'lucide-react';

const MULTIPLIERS = [1, 5, 10, 20, 50, 100];
const NUMBER_COLORS = {
  0: 'violet-red', 1: 'green', 2: 'red', 3: 'green', 4: 'red',
  5: 'violet-green', 6: 'red', 7: 'green', 8: 'red', 9: 'green'
};

const WinGo = () => {
  const { user, setTab, bets, wingoHistory, placeBet, getPeriodId } = useContext(AppContext);
  const [gameMode, setGameMode] = useState('30Sec'); // 30Sec, 1Min, 3Min, 5Min
  const [gameTab, setGameTab] = useState('History'); // History, Chart, MyHistory
  const [soundOn, setSoundOn] = useState(true);

  // Countdown timer calculations
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentPeriod, setCurrentPeriod] = useState('');

  // Betting drawer states
  const [showBetDrawer, setShowBetDrawer] = useState(false);
  const [betSelection, setBetSelection] = useState(null);
  const [betUnit, setBetUnit] = useState(1); // 1, 10, 100, 1000
  const [betMultiplier, setBetMultiplier] = useState(1);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const chartContainerRef = useRef(null);
  const [chartLines, setChartLines] = useState([]);

  // Calculate timer intervals
  useEffect(() => {
    const intervals = { "30Sec": 30, "1Min": 60, "3Min": 180, "5Min": 300 };
    const seconds = intervals[gameMode];

    const updateTimer = () => {
      const now = new Date();
      const currentSeconds = now.getSeconds();
      const currentMs = now.getMilliseconds();
      
      let secLeft = 0;
      if (gameMode === '30Sec') {
        secLeft = 30 - (currentSeconds % 30);
      } else if (gameMode === '1Min') {
        secLeft = 60 - currentSeconds;
      } else {
        const totalSecToday = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        secLeft = seconds - (totalSecToday % seconds);
      }
      
      setTimeLeft(secLeft);
      setCurrentPeriod(getPeriodId(seconds));
    };

    updateTimer();
    const ticker = setInterval(updateTimer, 500);
    return () => clearInterval(ticker);
  }, [gameMode]);

  // Recalculate trend lines when history changes or Chart tab is active
  useEffect(() => {
    if (gameTab !== 'Chart' || !wingoHistory[gameMode]) return;
    
    // We will generate the coordinates mapping overlay for the SVG trend line
    // Pre-calculate positions since elements take time to render
    const timer = setTimeout(() => {
      const rows = document.querySelectorAll('.trend-row');
      const lines = [];
      const coords = [];

      rows.forEach((row, rowIdx) => {
        const winningNum = parseInt(row.getAttribute('data-num'));
        const cell = row.querySelector(`.cell-${winningNum}`);
        if (cell) {
          const rect = cell.getBoundingClientRect();
          const parentRect = chartContainerRef.current.getBoundingClientRect();
          
          // Get relative coordinates of center of winning number circle
          const x = rect.left - parentRect.left + (rect.width / 2);
          const y = rect.top - parentRect.top + (rect.height / 2);
          coords.push({ x, y });
        }
      });

      // Construct SVG line segments
      for (let i = 0; i < coords.length - 1; i++) {
        lines.push({
          x1: coords[i].x,
          y1: coords[i].y,
          x2: coords[i + 1].x,
          y2: coords[i + 1].y
        });
      }
      setChartLines(lines);
    }, 100);

    return () => clearTimeout(timer);
  }, [gameTab, wingoHistory, gameMode]);

  const openBettingDrawer = (selection) => {
    setBetSelection(selection);
    setBetMultiplier(1);
    setShowBetDrawer(true);
  };

  const handlePlaceBetSubmit = () => {
    if (!agreeTerms) {
      alert("Please agree to the rule selection.");
      return;
    }
    const success = placeBet("Win Go", gameMode, currentPeriod, betSelection, betUnit, betMultiplier);
    if (success) {
      setShowBetDrawer(false);
    }
  };

  // Format countdown text e.g. 00:20
  const formatTime = (timeSecs) => {
    const mins = Math.floor(timeSecs / 60);
    const secs = timeSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const modeList = [
    { key: "30Sec", label: "Win Go 30Sec" },
    { key: "1Min", label: "Win Go 1Min" },
    { key: "3Min", label: "Win Go 3Min" },
    { key: "5Min", label: "Win Go 5Min" }
  ];

  const currentHistory = wingoHistory[gameMode] || [];
  const filteredBets = bets.filter(b => b.game === 'Win Go' && b.mode === gameMode);

  return (
    <div style={{ backgroundColor: '#141a23', minHeight: '100%', position: 'relative' }}>
      
      {/* Top Header */}
      <div className="header-bar">
        <button className="header-action-btn" onClick={() => setTab('Home')}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '22px', height: '22px', background: 'var(--gold-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#1e2531', fontSize: '12px' }}>C</div>
          <span className="header-title">Win Go</span>
        </div>
        <button className="header-action-btn" onClick={() => setSoundOn(!soundOn)}>
          {soundOn ? <Volume2 size={18} color="var(--primary-gold)" /> : <VolumeX size={18} color="var(--text-muted)" />}
        </button>
      </div>

      {/* Balance panel wrapper */}
      <div className="card" style={{ margin: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '22px', color: '#fff', fontWeight: '800' }}>₹{user.balance.toFixed(2)}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Wallet Balance</div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setTab('Withdraw')} 
            style={{ background: 'var(--color-red)', border: 'none', color: '#fff', borderRadius: '15px', padding: '6px 16px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
          >
            Withdraw
          </button>
          <button 
            onClick={() => setTab('Deposit')} 
            style={{ background: 'var(--color-green)', border: 'none', color: '#fff', borderRadius: '15px', padding: '6px 16px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
          >
            Deposit
          </button>
        </div>
      </div>

      {/* Megaphone announcement ticker */}
      <div style={{ background: '#252d3a', margin: '0 12px 12px 12px', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Volume2 size={14} color="var(--primary-gold)" />
        <div style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', fontSize: '11px', color: 'var(--text-secondary)' }}>
          Welcome! Join the official Telegram channel for daily color predictions.
        </div>
      </div>

      {/* Game Mode Sub Tabs row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', padding: '0 12px 12px 12px' }}>
        {modeList.map(mode => (
          <button
            key={mode.key}
            onClick={() => setGameMode(mode.key)}
            style={{
              padding: '10px 4px',
              borderRadius: '12px',
              border: 'none',
              background: gameMode === mode.key ? 'var(--gold-gradient)' : '#252d3a',
              color: gameMode === mode.key ? '#1e2531' : 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>⏰</span>
            <span>{mode.label.split(' ')[2] || mode.key}</span>
          </button>
        ))}
      </div>

      {/* Status Panel Box */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #1c222c 0%, #252d3a 100%)', border: '1px solid rgba(243, 168, 59, 0.15)', display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
        
        {/* Left side info */}
        <div>
          <button 
            onClick={() => alert("Prediction Rules:\n- Green payouts: 2x\n- Red payouts: 2x\n- Violet payouts: 4.5x\n- Exact Number payouts: 9x\n- Big/Small payouts: 2x")}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--primary-gold)', fontSize: '10px', padding: '4px 10px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' }}
          >
            📖 How to play
          </button>
          
          <div style={{ fontSize: '12px', color: '#fff', fontWeight: '600', margin: '12px 0 6px 0' }}>
            Win Go {gameMode.toLowerCase()}
          </div>
          
          {/* Outcome circles indicator */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {currentHistory.slice(0, 5).map((h, idx) => (
              <div 
                key={idx} 
                style={{
                  width: '18px', 
                  height: '18px', 
                  borderRadius: '50%', 
                  background: h.color.includes('green-violet') ? 'linear-gradient(135deg, var(--color-green) 50%, var(--color-violet) 50%)' : h.color.includes('red-violet') ? 'linear-gradient(135deg, var(--color-red) 50%, var(--color-violet) 50%)' : h.color === 'green' ? 'var(--color-green)' : 'var(--color-red)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '9px', 
                  fontWeight: 'bold', 
                  color: '#fff'
                }}
              >
                {h.number}
              </div>
            ))}
          </div>
        </div>

        {/* Right side countdown timer */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Time Remaining</div>
          
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end', margin: '6px 0' }}>
            {formatTime(timeLeft).split('').map((char, idx) => (
              char === ':' ? (
                <span key={idx} style={{ color: '#fff', fontSize: '18px', alignSelf: 'center' }}>:</span>
              ) : (
                <div key={idx} style={{ background: '#0b0f14', padding: '6px 8px', borderRadius: '4px', color: 'var(--primary-gold)', fontSize: '18px', fontWeight: '800' }}>
                  {char}
                </div>
              )
            ))}
          </div>
          
          <div style={{ fontSize: '12px', color: 'var(--primary-gold-dark)', fontWeight: '700', letterSpacing: '1px' }}>
            {currentPeriod}
          </div>
        </div>

      </div>

      {/* Prediction Color Buttons Row */}
      <div style={{ display: 'flex', gap: '10px', padding: '0 12px 12px 12px' }}>
        <button 
          onClick={() => openBettingDrawer('Green')} 
          style={{ flex: 1, height: '40px', background: 'var(--color-green)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '800', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(19, 179, 103, 0.25)' }}
        >
          Green
        </button>
        <button 
          onClick={() => openBettingDrawer('Violet')} 
          style={{ flex: 1, height: '40px', background: 'var(--color-violet)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '800', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(138, 63, 252, 0.25)' }}
        >
          Violet
        </button>
        <button 
          onClick={() => openBettingDrawer('Red')} 
          style={{ flex: 1, height: '40px', background: 'var(--color-red)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '800', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(232, 61, 61, 0.25)' }}
        >
          Red
        </button>
      </div>

      {/* Numbers Selection Grid */}
      <div className="card" style={{ margin: '0 12px 12px 12px', padding: '12px' }}>
        
        {/* Row 1 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          {[0, 1, 2, 3, 4].map(num => (
            <button
              key={num}
              onClick={() => openBettingDrawer(String(num))}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: 'none',
                background: num === 0 ? 'linear-gradient(135deg, var(--color-red) 50%, var(--color-violet) 50%)' : NUMBER_COLORS[num] === 'green' ? 'var(--color-green)' : 'var(--color-red)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Row 2 */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {[5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => openBettingDrawer(String(num))}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: 'none',
                background: num === 5 ? 'linear-gradient(135deg, var(--color-green) 50%, var(--color-violet) 50%)' : NUMBER_COLORS[num] === 'green' ? 'var(--color-green)' : 'var(--color-red)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {num}
            </button>
          ))}
        </div>

      </div>

      {/* Multipliers selector row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', padding: '0 12px 12px 12px' }}>
        <button 
          onClick={() => openBettingDrawer(String(Math.floor(Math.random() * 10)))}
          style={{ flex: 1.5, height: '32px', background: 'none', border: '1px solid var(--color-red)', borderRadius: '6px', color: 'var(--color-red)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
        >
          RANDOM
        </button>
        {MULTIPLIERS.map(mul => (
          <button
            key={mul}
            onClick={() => { setBetMultiplier(mul); openBettingDrawer(betSelection || 'Green'); }}
            style={{
              flex: 1,
              height: '32px',
              background: '#252d3a',
              border: 'none',
              borderRadius: '6px',
              color: 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            X{mul}
          </button>
        ))}
      </div>

      {/* Big / Small Choice Row */}
      <div style={{ display: 'flex', gap: '12px', padding: '0 12px 16px 12px' }}>
        <button 
          onClick={() => openBettingDrawer('Big')}
          style={{ flex: 1, height: '36px', background: 'var(--gold-gradient)', color: '#1e2531', fontWeight: '800', border: 'none', borderRadius: '18px', fontSize: '13px', cursor: 'pointer' }}
        >
          Big
        </button>
        <button 
          onClick={() => openBettingDrawer('Small')}
          style={{ flex: 1, height: '36px', background: 'var(--color-blue)', color: '#fff', fontWeight: '800', border: 'none', borderRadius: '18px', fontSize: '13px', cursor: 'pointer' }}
        >
          Small
        </button>
      </div>

      {/* Bottom Tabs for Game History / SVG Chart / My bets */}
      <div style={{ display: 'flex', background: 'var(--bg-shell)', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <button 
          onClick={() => setGameTab('History')}
          style={{ flex: 1, padding: '12px 0', border: 'none', background: gameTab === 'History' ? 'var(--gold-gradient)' : 'none', color: gameTab === 'History' ? '#1e2531' : 'var(--text-secondary)', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
        >
          Game History
        </button>
        <button 
          onClick={() => setGameTab('Chart')}
          style={{ flex: 1, padding: '12px 0', border: 'none', background: gameTab === 'Chart' ? 'var(--gold-gradient)' : 'none', color: gameTab === 'Chart' ? '#1e2531' : 'var(--text-secondary)', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
        >
          Chart
        </button>
        <button 
          onClick={() => setGameTab('MyHistory')}
          style={{ flex: 1, padding: '12px 0', border: 'none', background: gameTab === 'MyHistory' ? 'var(--gold-gradient)' : 'none', color: gameTab === 'MyHistory' ? '#1e2531' : 'var(--text-secondary)', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
        >
          My History
        </button>
      </div>

      {/* Tab contents */}
      <div style={{ minHeight: '200px', backgroundColor: '#1c222c', padding: '12px' }}>
        
        {/* Game History List View */}
        {gameTab === 'History' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'center' }}>
            <thead>
              <tr style={{ color: 'var(--primary-gold-dark)', borderBottom: '1px solid rgba(255,255,255,0.05)', height: '28px' }}>
                <th style={{ width: '45%' }}>Period</th>
                <th>Number</th>
                <th>Big Small</th>
                <th>Color</th>
              </tr>
            </thead>
            <tbody>
              {currentHistory.slice(0, 10).map((row, idx) => (
                <tr key={idx} style={{ height: '32px', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-secondary)' }}>
                  <td style={{ fontWeight: '500' }}>{row.period}</td>
                  <td style={{ 
                    fontSize: '13px', 
                    fontWeight: '800', 
                    color: row.color.includes('green') ? 'var(--color-green)' : row.color.includes('violet') ? 'var(--color-violet)' : 'var(--color-red)'
                  }}>
                    {row.number}
                  </td>
                  <td>{row.bigSmall}</td>
                  <td>
                    <span style={{ 
                      display: 'inline-block', 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%',
                      background: row.color.includes('green-violet') ? 'linear-gradient(135deg, var(--color-green) 50%, var(--color-violet) 50%)' : row.color.includes('red-violet') ? 'linear-gradient(135deg, var(--color-red) 50%, var(--color-violet) 50%)' : row.color === 'green' ? 'var(--color-green)' : 'var(--color-red)'
                    }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* SVG Trend Chart View */}
        {gameTab === 'Chart' && (
          <div ref={chartContainerRef} style={{ position: 'relative', overflowX: 'auto' }}>
            
            {/* SVG overlay line drawer */}
            <svg 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                pointerEvents: 'none',
                zIndex: 3
              }}
            >
              {chartLines.map((line, idx) => (
                <line 
                  key={idx} 
                  x1={line.x1} 
                  y1={line.y1} 
                  x2={line.x2} 
                  y2={line.y2} 
                  stroke="var(--color-red)" 
                  strokeWidth="2" 
                  strokeDasharray="1"
                />
              ))}
            </svg>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'center' }}>
              <thead>
                <tr style={{ color: 'var(--primary-gold-dark)', borderBottom: '1px solid rgba(255,255,255,0.05)', height: '28px' }}>
                  <th style={{ width: '30%', textAlign: 'left', paddingLeft: '8px' }}>Period</th>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <th key={i} style={{ width: '7%' }}>{i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentHistory.slice(0, 10).map((row, rowIdx) => (
                  <tr 
                    key={rowIdx} 
                    className="trend-row"
                    data-num={row.number}
                    style={{ height: '32px', borderBottom: '1px solid rgba(255,255,255,0.02)' }}
                  >
                    <td style={{ color: 'var(--text-secondary)', textAlign: 'left', paddingLeft: '8px' }}>
                      {row.period.substring(8)}
                    </td>
                    {Array.from({ length: 10 }).map((_, colNum) => {
                      const isWinner = colNum === row.number;
                      return (
                        <td key={colNum} className={`cell-${colNum}`} style={{ position: 'relative' }}>
                          {isWinner ? (
                            <div 
                              style={{ 
                                width: '16px', 
                                height: '16px', 
                                borderRadius: '50%', 
                                background: row.color.includes('green-violet') ? 'linear-gradient(135deg, var(--color-green) 50%, var(--color-violet) 50%)' : row.color.includes('red-violet') ? 'linear-gradient(135deg, var(--color-red) 50%, var(--color-violet) 50%)' : row.color === 'green' ? 'var(--color-green)' : 'var(--color-red)',
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                color: '#fff', 
                                fontSize: '9px',
                                fontWeight: 'bold',
                                margin: '0 auto',
                                zIndex: 4,
                                position: 'relative'
                              }}
                            >
                              {colNum}
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>{colNum}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* User bets log tab view */}
        {gameTab === 'MyHistory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredBets.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 0', fontSize: '12px' }}>
                No bets recorded in this cycle.
              </div>
            ) : (
              filteredBets.slice(0, 10).map((bet, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    background: 'var(--bg-card)', 
                    borderRadius: '8px', 
                    padding: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderLeft: bet.status === 'Success' ? '4px solid var(--color-green)' : bet.status === 'Failed' ? '4px solid var(--color-red)' : '4px solid var(--primary-gold-dark)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#fff', fontWeight: 'bold', background: '#343f52', padding: '2px 6px', borderRadius: '4px' }}>
                        {bet.selection}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{bet.period}</span>
                    </div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px' }}>{bet.time}</div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: bet.status === 'Success' ? 'var(--color-green)' : bet.status === 'Failed' ? 'var(--color-red)' : '#fff' }}>
                      {bet.status === 'Success' ? `+₹${bet.payout}` : bet.status === 'Failed' ? `-₹${bet.amount.toFixed(2)}` : 'Pending'}
                    </div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Amount: ₹{bet.amount.toFixed(2)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* Prediction dialog Drawer */}
      {showBetDrawer && (
        <div className="captcha-overlay">
          <div className="captcha-box" style={{ background: '#1e2531', maxWidth: '380px', borderTop: '4px solid var(--primary-gold-dark)' }}>
            
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px', marginBottom: '15px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Select: </span>
                <span style={{ color: 'var(--primary-gold)', fontWeight: 'bold', fontSize: '14px' }}>{betSelection}</span>
              </div>
              <X size={18} color="var(--text-secondary)" onClick={() => setShowBetDrawer(false)} style={{ cursor: 'pointer' }} />
            </div>

            {/* Contract Money Units */}
            <div style={{ display: 'flex', gap: '6px', width: '100%', marginBottom: '16px' }}>
              {[1, 10, 100, 1000].map(unit => (
                <button
                  key={unit}
                  onClick={() => setBetUnit(unit)}
                  style={{
                    flex: 1,
                    height: '32px',
                    background: betUnit === unit ? 'var(--gold-gradient)' : '#1c222c',
                    color: betUnit === unit ? '#1e2531' : '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  ₹{unit}
                </button>
              ))}
            </div>

            {/* Multiplier Adjustment counter */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Multiplier</span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button 
                  onClick={() => setBetMultiplier(prev => Math.max(1, prev - 1))}
                  style={{ width: '28px', height: '28px', borderRadius: '4px', background: '#1c222c', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold', width: '25px', textAlign: 'center' }}>
                  {betMultiplier}
                </span>
                <button 
                  onClick={() => setBetMultiplier(prev => prev + 1)}
                  style={{ width: '28px', height: '28px', borderRadius: '4px', background: '#1c222c', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Quick Multipliers grids */}
            <div style={{ display: 'flex', gap: '6px', width: '100%', marginBottom: '20px' }}>
              {MULTIPLIERS.map(mul => (
                <button
                  key={mul}
                  onClick={() => setBetMultiplier(mul)}
                  style={{
                    flex: 1,
                    height: '24px',
                    background: betMultiplier === mul ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.02)',
                    color: betMultiplier === mul ? '#1e2531' : 'var(--text-secondary)',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  X{mul}
                </button>
              ))}
            </div>

            {/* Terms checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{ accentColor: 'var(--primary-gold-dark)' }} 
              />
              <span>I agree to the <span style={{ color: 'var(--primary-gold)' }}>[Rule selection]</span></span>
            </div>

            {/* Total bet amount details and Place button */}
            <div style={{ display: 'flex', width: '100%', gap: '10px' }}>
              <button 
                onClick={() => setShowBetDrawer(false)}
                style={{ flex: 1, height: '42px', border: '1px solid var(--text-muted)', background: 'none', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                Cancel
              </button>
              
              <button 
                onClick={handlePlaceBetSubmit}
                style={{ flex: 1.5, height: '42px', border: 'none', background: 'var(--gold-gradient)', color: '#1e2531', fontWeight: '800', borderRadius: '8px', cursor: 'pointer' }}
              >
                Confirm (₹{betUnit * betMultiplier})
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default WinGo;
