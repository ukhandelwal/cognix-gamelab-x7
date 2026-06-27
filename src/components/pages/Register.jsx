import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Smartphone, Lock, Eye, EyeOff, Tag, ShieldCheck } from 'lucide-react';

const Register = () => {
  const { register, setTab } = useContext(AppContext);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('740514332172');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agree) {
      alert("Please agree to the privacy agreement.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    register(phone, password);
  };

  return (
    <div style={{ backgroundColor: '#141a23', minHeight: '100%', padding: '16px 20px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <div style={{ width: '32px', height: '32px', background: 'var(--gold-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#1e2531', fontSize: '18px' }}>C</div>
        <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '1px', background: 'var(--gold-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>COGNIX</span>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>Register</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Please register using your mobile phone number.</p>
      </div>

      <form onSubmit={handleSubmit}>
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

        <div className="input-group">
          <label className="input-label">Set Password</label>
          <div className="input-wrapper">
            <Lock className="input-icon" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Set password (6-20 characters)"
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

        <div className="input-group">
          <label className="input-label">Confirm Password</label>
          <div className="input-wrapper">
            <Lock className="input-icon" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="custom-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Invite Code</label>
          <div className="input-wrapper">
            <Tag className="input-icon" size={18} />
            <input
              type="text"
              placeholder="Please enter invitation code"
              className="custom-input"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', margin: '20px 0 24px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <input 
            type="checkbox" 
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            style={{ accentColor: 'var(--primary-gold-dark)', marginTop: '2px' }} 
          />
          <span>I have read and agree to the <span style={{ color: 'var(--primary-gold)', cursor: 'pointer' }}>[Privacy Agreement]</span></span>
        </div>

        <button type="submit" className="gold-btn" style={{ marginBottom: '16px' }}>
          Register
        </button>

        <button
          type="button"
          onClick={() => setTab('Login')}
          className="gold-outline-btn"
        >
          Already have an account? Log in
        </button>
      </form>
    </div>
  );
};

export default Register;
