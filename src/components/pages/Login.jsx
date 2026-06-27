import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { Smartphone, Lock, Eye, EyeOff, MessageSquare, ShieldQuestion, Globe } from 'lucide-react';

const Login = () => {
  const { login, setTab } = useContext(AppContext);
  const [phone, setPhone] = useState('4545454545');
  const [password, setPassword] = useState('Demo1234@');
  const [showPassword, setShowPassword] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('phone'); // phone or email
  const [showCaptcha, setShowCaptcha] = useState(false);
  
  // Slider states
  const [sliderX, setSliderX] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const startDragX = useRef(0);
  const targetX = 200; // Match target coordinates

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!phone || !password) return;
    // Show high fidelity captcha slider
    setShowCaptcha(true);
    setSliderX(0);
  };

  const handleMouseDown = (e) => {
    setIsSliding(true);
    startDragX.current = e.clientX || (e.touches && e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isSliding) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const deltaX = clientX - startDragX.current;
    const newX = Math.min(Math.max(0, deltaX), 260); // Constrain slide boundary
    setSliderX(newX);
  };

  const handleMouseUp = () => {
    if (!isSliding) return;
    setIsSliding(false);
    
    // Check if slider is close to target (tolerance of +/- 10 pixels)
    if (Math.abs(sliderX - targetX) < 10) {
      setShowCaptcha(false);
      login(phone, password);
    } else {
      // Reset
      setSliderX(0);
    }
  };

  useEffect(() => {
    if (isSliding) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isSliding, sliderX]);

  return (
    <div style={{ backgroundColor: '#141a23', minHeight: '100%', padding: '16px 20px', display: 'flex', flexDirection: 'column' }}>
      {/* Header section matching actual page */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--gold-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#1e2531', fontSize: '18px' }}>C</div>
          <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '1px', background: 'var(--gold-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>COGNIX</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#252d3a', padding: '6px 12px', borderRadius: '15px', fontSize: '12px', color: '#fff', cursor: 'pointer' }}>
          <Globe size={14} color="#fad38a" />
          <span>EN</span>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>Log in</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Please login with your phone number or email.<br />
          If you forget your password, please contact customer service.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveSubTab('phone')}
          style={{
            flex: 1,
            padding: '12px 0',
            background: 'none',
            border: 'none',
            borderBottom: activeSubTab === 'phone' ? '3px solid var(--primary-gold-dark)' : 'none',
            color: activeSubTab === 'phone' ? 'var(--primary-gold)' : 'var(--text-secondary)',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Smartphone size={16} />
          phone number
        </button>
        <button
          onClick={() => setActiveSubTab('email')}
          style={{
            flex: 1,
            padding: '12px 0',
            background: 'none',
            border: 'none',
            borderBottom: activeSubTab === 'email' ? '3px solid var(--primary-gold-dark)' : 'none',
            color: activeSubTab === 'email' ? 'var(--primary-gold)' : 'var(--text-secondary)',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          Email Login
        </button>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLoginSubmit}>
        {activeSubTab === 'phone' ? (
          <div className="input-group">
            <label className="input-label">Phone Number</label>
            <div className="input-wrapper">
              <Smartphone className="input-icon" size={18} />
              <div style={{ position: 'absolute', left: '40px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500' }}>+91</div>
              <input
                type="tel"
                placeholder="Please enter the phone number"
                className="custom-input"
                style={{ paddingLeft: '75px' }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
        ) : (
          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-wrapper">
              <span className="input-icon" style={{ left: '12px', fontSize: '18px', color: 'var(--text-muted)' }}>@</span>
              <input
                type="email"
                placeholder="Please enter email"
                className="custom-input"
                required
              />
            </div>
          </div>
        )}

        <div className="input-group">
          <label className="input-label">Password</label>
          <div className="input-wrapper">
            <Lock className="input-icon" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Please enter password"
              className="custom-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 24px 0', fontSize: '13px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input type="checkbox" style={{ accentColor: 'var(--primary-gold-dark)' }} defaultChecked />
            <span>Remember password</span>
          </label>
        </div>

        <button type="submit" className="gold-btn" style={{ marginBottom: '16px' }}>
          Log in
        </button>

        <button
          type="button"
          onClick={() => setTab('Register')}
          className="gold-outline-btn"
          style={{ marginBottom: '32px' }}
        >
          Register
        </button>
      </form>

      {/* Footer widgets */}
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-around', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#252d3a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={18} color="var(--primary-gold)" />
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Forgot password</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#252d3a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={18} color="var(--primary-gold)" />
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Customer Service</span>
        </div>
      </div>

      {/* High Fidelity Captcha overlay */}
      {showCaptcha && (
        <div className="captcha-overlay">
          <div className="captcha-box">
            <div className="captcha-title">Hold and slide</div>
            <div className="captcha-canvas-container">
              <img 
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80" 
                alt="captcha-bg" 
                className="captcha-bg-img" 
              />
              <div className="captcha-puzzle-slot"></div>
              <div 
                className="captcha-puzzle-piece" 
                style={{ transform: `translateX(${sliderX}px)` }}
              ></div>
            </div>
            
            <div className="captcha-slider-track">
              <div 
                className="captcha-slider-btn" 
                style={{ transform: `translateX(${sliderX}px)` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
              >
                &raquo;
              </div>
              <span className="captcha-slider-text">Drag slider to match piece</span>
            </div>
            
            <button 
              onClick={() => setShowCaptcha(false)}
              style={{ marginTop: '16px', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
