import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { ChevronLeft, Shield, Info, PhoneCall, KeyRound } from 'lucide-react';

const Settings = () => {
  const { user, setTab } = useContext(AppContext);

  return (
    <div style={{ backgroundColor: '#141a23', minHeight: '100%' }}>
      
      {/* Header bar */}
      <div className="header-bar">
        <button className="header-action-btn" onClick={() => setTab('Account')}>
          <ChevronLeft size={20} />
        </button>
        <span className="header-title">Settings</span>
        <div></div>
      </div>

      {/* User profile box summary */}
      <div style={{ background: '#252d3a', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <img 
          src={user.avatar} 
          alt="avatar" 
          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} 
        />
        <div>
          <div style={{ fontSize: '15px', color: '#fff', fontWeight: '700' }}>{user.phone === "4545454545" ? "Hamza" : user.phone}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>UID: {user.uid}</div>
        </div>
      </div>

      {/* Menu options list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.03)', margin: '16px 0' }}>
        
        <div 
          onClick={() => alert("Change Password: Feature simulated. Your password remains Demo1234@.")}
          style={{ background: 'var(--bg-card)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <KeyRound size={18} color="var(--primary-gold)" />
            <span style={{ fontSize: '13px', color: '#fff' }}>Change Password</span>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>&rsaquo;</span>
        </div>

        <div 
          onClick={() => alert("Cognix Version: 1.0.4 (Stable Release)")}
          style={{ background: 'var(--bg-card)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Info size={18} color="var(--primary-gold)" />
            <span style={{ fontSize: '13px', color: '#fff' }}>Version</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>1.0.4</span>
            <span style={{ color: 'var(--text-muted)' }}>&rsaquo;</span>
          </div>
        </div>

        <div 
          onClick={() => alert("Privacy Policy: All simulated database storage is stored locally on your browser. Zero remote tracking.")}
          style={{ background: 'var(--bg-card)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield size={18} color="var(--primary-gold)" />
            <span style={{ fontSize: '13px', color: '#fff' }}>Privacy Agreement</span>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>&rsaquo;</span>
        </div>

        <div 
          onClick={() => alert("Support Live Desk: Telegram handle @CognixSupport")}
          style={{ background: 'var(--bg-card)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <PhoneCall size={18} color="var(--primary-gold)" />
            <span style={{ fontSize: '13px', color: '#fff' }}>Contact Us</span>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>&rsaquo;</span>
        </div>

      </div>

    </div>
  );
};

export default Settings;
