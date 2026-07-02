import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Volume2, ChevronRight, X, Download, Star, ShieldAlert } from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    title: "LATEST AGENT MECHANISM",
    subtitle: "O INVESTMENT, O RISK, HIGH RETURN!",
    desc: "Anyone Can Be An Agent And Earn Millions Monthly!",
    bg: "linear-gradient(135deg, #1b382b 0%, #102018 100%)",
    accent: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 2,
    title: "FIRST DEPOSIT BONUS",
    subtitle: "CLAIM IT RIGHT AWAY UP-TO ₹8,888",
    desc: "More recharge, more bonus! Automated settlements instantly.",
    bg: "linear-gradient(135deg, #3d1b1b 0%, #201010 100%)",
    accent: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=200&q=80"
  }
];

const WINNERS = [
  { user: "Mem***PXX", amount: 980.00, game: "Win Go" },
  { user: "Mem***OQQ", amount: 1540.00, game: "K3 Lottery" },
  { user: "Mem***KKL", amount: 340.00, game: "5D Lotre" },
  { user: "Mem***HJJ", amount: 4900.00, game: "Win Go" },
  { user: "Mem***TTR", amount: 120.00, game: "Win Go" }
];

const Home = () => {
  const { setTab, user } = useContext(AppContext);
  const [activeBanner, setActiveBanner] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Lobby');
  const [showDesktopBanner, setShowDesktopBanner] = useState(true);
  const [showLuckyWheel, setShowLuckyWheel] = useState(false);
  const [spinDegree, setSpinDegree] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  // Auto rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner(prev => (prev + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const degrees = 1440 + Math.floor(Math.random() * 360);
    setSpinDegree(degrees);
    setTimeout(() => {
      setIsSpinning(false);
      alert("Congratulations! You won ₹10 bonus!");
      setSpinDegree(0);
      setShowLuckyWheel(false);
    }, 4000);
  };

  const gameCategories = ['Lobby', 'Lottery', 'Mini games', 'Popular', 'Slots', 'Fishing'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', position: 'relative' }}>
      
      {/* Header View */}
      <div className="header-bar" style={{ position: 'relative', top: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', background: 'var(--gold-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#1e2531' }}>C</div>
          <span style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '1px', background: 'var(--gold-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>COGNIX</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="header-action-btn" style={{ color: 'var(--primary-gold)' }} title="Install App">
            <Download size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#252d3a', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>
            <span>🇮🇳</span>
            <span>EN</span>
          </div>
        </div>
      </div>

      {/* Banner Carousel */}
      <div style={{ height: '160px', margin: '12px', borderRadius: 'var(--border-radius-md)', overflow: 'hidden', position: 'relative' }}>
        {BANNERS.map((banner, idx) => (
          <div
            key={banner.id}
            style={{
              width: '100%',
              height: '100%',
              background: banner.bg,
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: idx === activeBanner ? 1 : 0,
              transition: 'opacity 0.6s ease-in-out',
              zIndex: idx === activeBanner ? 1 : 0
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ maxWidth: '60%' }}>
                <span style={{ fontSize: '10px', background: 'var(--gold-gradient)', color: '#1e2531', padding: '2px 6px', borderRadius: '4px', fontWeight: '800', display: 'inline-block', marginBottom: '8px' }}>COGNIX OFFICIAL</span>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', lineHeight: '1.2', marginBottom: '4px' }}>{banner.title}</h3>
                <p style={{ fontSize: '11px', color: 'var(--primary-gold)', fontWeight: '600', marginBottom: '6px' }}>{banner.subtitle}</p>
                <p style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>{banner.desc}</p>
              </div>
              <img src={banner.accent} alt="banner-accent" style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
            </div>
          </div>
        ))}
        {/* Slider Dots */}
        <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 2 }}>
          {BANNERS.map((_, idx) => (
            <div
              key={idx}
              onClick={() => setActiveBanner(idx)}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: idx === activeBanner ? 'var(--primary-gold-dark)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </div>

      {/* Notice Ticker */}
      <div style={{ background: '#252d3a', margin: '0 12px 12px 12px', padding: '8px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Volume2 size={16} color="var(--primary-gold)" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', height: '18px' }}>
          <div style={{
            position: 'absolute',
            whiteSpace: 'nowrap',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            animation: 'marquee 15s linear infinite'
          }}>
            Thank you for your cooperation and enjoy the games! Refer your friends to earn up to 5% commission!
          </div>
        </div>
        <button 
          onClick={() => alert("Notification details: System Upgrade successfully completed. Payout processing remains 24/7.")}
          style={{ fontSize: '10px', background: 'var(--gold-gradient)', color: '#1e2531', fontWeight: '700', padding: '4px 10px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}
        >
          Detail
        </button>
      </div>

      {/* CSS Animation for notice marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(100%, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes marquee-vertical {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
      `}</style>

      {/* Winner notification board */}
      <div className="card" style={{ padding: '12px', margin: '0 12px 12px 12px', border: '1px solid rgba(243, 168, 59, 0.15)' }}>
        <h4 style={{ fontSize: '12px', color: 'var(--primary-gold)', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Star size={14} fill="var(--primary-gold)" />
          Winning Information
        </h4>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {WINNERS.map((win, idx) => (
            <div key={idx} style={{ background: '#1c222c', padding: '8px 12px', borderRadius: '8px', minWidth: '130px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '11px', color: '#fff', fontWeight: '600' }}>{win.game}</span>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{win.user}</span>
              <span style={{ fontSize: '12px', color: 'var(--color-green)', fontWeight: '700' }}>₹{win.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Tabs */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '0 12px 12px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        {gameCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: '15px',
              border: 'none',
              background: activeCategory === cat ? 'var(--gold-gradient)' : '#252d3a',
              color: activeCategory === cat ? '#1e2531' : 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Desktop Helper Banner */}
      {showDesktopBanner && (
        <div style={{ background: '#1c222c', margin: '12px 12px 0 12px', padding: '10px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>📱</span>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#fff' }}>Add to Desktop</div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Quick shortcut to play and prediction checks</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button style={{ background: 'var(--gold-gradient)', color: '#1e2531', border: 'none', borderRadius: '10px', padding: '4px 10px', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>Add</button>
            <X size={16} color="var(--text-secondary)" onClick={() => setShowDesktopBanner(false)} style={{ cursor: 'pointer' }} />
          </div>
        </div>
      )}

      {/* Game Cards Section */}
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* Lottery Section */}
        {(activeCategory === 'Lobby' || activeCategory === 'Lottery' || activeCategory === 'Popular') && (
          <>
            <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', paddingLeft: '4px' }}>Lottery</h4>
            
            {/* Win Go Card */}
            <div 
              onClick={() => setTab('WinGo')}
              style={{ background: 'linear-gradient(135deg, #2a2e43 0%, #1b1e2c 100%)', borderRadius: 'var(--border-radius-md)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, #e83d3d, #8a3ffc, #13b367)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff', fontSize: '18px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>W</div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>Win Go</h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Color prediction game with 30s/1m/3m/5m cycles</p>
                </div>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </div>

            {/* K3 Lottery Card */}
            <div 
              onClick={() => setTab('K3')}
              style={{ background: 'linear-gradient(135deg, #3d2a43 0%, #291b2c 100%)', borderRadius: 'var(--border-radius-md)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, #f3a83b, #e83d3d)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff', fontSize: '18px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>K3</div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>K3 Lottery</h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Sum values prediction, same digits, diff digits</p>
                </div>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </div>

            {/* 5D Lotre Card */}
            <div 
              onClick={() => setTab('5D')}
              style={{ background: 'linear-gradient(135deg, #2a3d43 0%, #1b292c 100%)', borderRadius: 'var(--border-radius-md)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, #13b367, #2a85ff)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff', fontSize: '18px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>5D</div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>5D Lotre</h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>A, B, C, D, E rows prediction. High multipliers</p>
                </div>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </div>
          </>
        )}

        {/* Mini Games Section */}
        {(activeCategory === 'Lobby' || activeCategory === 'Mini games' || activeCategory === 'Popular') && (
          <>
            <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', paddingLeft: '4px', marginTop: '8px' }}>Mini Games</h4>
            
            {/* Aviator Card */}
            <div 
              onClick={() => setTab('Aviator')}
              style={{ background: 'linear-gradient(135deg, #432a2a 0%, #2c1b1b 100%)', borderRadius: 'var(--border-radius-md)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff', fontSize: '18px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>✈️</div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>Aviator</h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Crash multiplier game. Cash out before plane flies away</p>
                </div>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </div>

            {/* Chicken Card */}
            <div 
              onClick={() => setTab('Chicken')}
              style={{ background: 'linear-gradient(135deg, #43392a 0%, #2c241b 100%)', borderRadius: 'var(--border-radius-md)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff', fontSize: '18px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>🍗</div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>Chicken</h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Dome mines game. Reveal plates, find chicken & avoid bones</p>
                </div>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </div>
          </>
        )}
      </div>

      {/* Floating Buttons Sidebar (matching screenshot overlay widgets) */}
      <div className="floating-sidebar">
        {/* Telegram Link (mock) */}
        <div 
          onClick={() => alert("Redirecting to Telegram Support Group...")}
          style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2a85ff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', transition: 'transform 0.2s' }}
          className="float-icon-btn"
        >
          <span style={{ fontSize: '16px', color: '#fff', fontWeight: 'bold' }}>TG</span>
        </div>

        {/* Lucky Wheel Spinner Icon */}
        <div 
          onClick={() => setShowLuckyWheel(true)}
          style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'conic-gradient(red, yellow, green, blue, red)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
        >
          <span style={{ fontSize: '16px' }}>🎡</span>
        </div>

        {/* Chat Customer support */}
        <div 
          onClick={() => alert("Opening Customer Service Chat Live...")}
          style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ffaa00', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
        >
          <span style={{ fontSize: '16px' }}>💬</span>
        </div>
      </div>

      {/* Lucky Wheel Modal */}
      {showLuckyWheel && (
        <div className="captcha-overlay">
          <div className="captcha-box" style={{ background: '#1e2531', border: '2px solid var(--primary-gold-dark)' }}>
            <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>Lucky Spin Wheel</h3>
            <div 
              style={{ 
                width: '180px', 
                height: '180px', 
                borderRadius: '50%', 
                border: '8px solid var(--bg-card)', 
                background: 'conic-gradient(#e83d3d 0deg 45deg, #13b367 45deg 90deg, #8a3ffc 90deg 135deg, #2a85ff 135deg 180deg, #f3a83b 180deg 225deg, #e83d3d 225deg 270deg, #13b367 270deg 315deg, #8a3ffc 315deg 360deg)',
                transform: `rotate(${spinDegree}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
                position: 'relative',
                marginBottom: '20px'
              }}
            >
              {/* Center pointer pin */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.5)', zIndex: 10 }}></div>
            </div>
            
            <button className="gold-btn" onClick={handleSpinWheel} disabled={isSpinning}>
              {isSpinning ? "Spinning..." : "SPIN NOW (Free)"}
            </button>

            <button 
              onClick={() => setShowLuckyWheel(false)}
              style={{ marginTop: '16px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
