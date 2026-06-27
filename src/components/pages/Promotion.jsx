import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Trophy, Copy, Users, User, ArrowRight, DollarSign } from 'lucide-react';

const Promotion = () => {
  const { showToast } = useContext(AppContext);
  const inviteCode = "740514332172";
  const inviteLink = `https://plan4.cognixsolutions.shop/register?invite=${inviteCode}`;

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`, "success");
  };

  return (
    <div style={{ backgroundColor: '#141a23', minHeight: '100%', paddingBottom: '20px' }}>
      
      {/* Top Header */}
      <div className="header-bar">
        <div></div>
        <span className="header-title">Agency</span>
        <button className="header-action-btn" onClick={() => alert("Opening Agency Leaderboards...")}>
          <Trophy size={18} color="var(--primary-gold)" />
        </button>
      </div>

      {/* Gold Total Commission Card */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #fad38a 0%, #f3a83b 100%)', 
          color: '#1e2531',
          margin: '12px',
          borderRadius: 'var(--border-radius-md)',
          padding: '24px 16px',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(243, 168, 59, 0.25)'
        }}
      >
        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>0.00</h2>
        <span style={{ fontSize: '11px', background: '#1e2531', color: 'var(--primary-gold)', padding: '4px 12px', borderRadius: '15px', fontWeight: '700', display: 'inline-block', marginBottom: '10px' }}>
          Yesterday's Total commission
        </span>
        <p style={{ fontSize: '11px', fontWeight: '500', opacity: 0.8 }}>Upgrade the level to increase commission income</p>
      </div>

      {/* Subordinates 2-column Table Card */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          
          {/* Direct Subordinates column */}
          <div style={{ borderRight: '1px solid rgba(255,255,255,0.03)', padding: '16px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-gold)', marginBottom: '16px', fontSize: '12px', fontWeight: '700' }}>
              <User size={16} />
              <span>Direct subordinates</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '15px', color: '#fff', fontWeight: '700' }}>0</div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>number of register</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '15px', color: 'var(--color-green)', fontWeight: '700' }}>0</div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Deposit number</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '15px', color: 'var(--primary-gold-dark)', fontWeight: '700' }}>0</div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Deposit amount</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '15px', color: '#fff', fontWeight: '700' }}>0</div>
                <div style={{ fontSize: '9px', color: 'var(--text-secondary)', lineHeight: '1.2' }}>Number of people making first deposit</div>
              </div>
            </div>
          </div>

          {/* Team Subordinates column */}
          <div style={{ padding: '16px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f3a83b', marginBottom: '16px', fontSize: '12px', fontWeight: '700' }}>
              <Users size={16} />
              <span>Team subordinates</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '15px', color: '#fff', fontWeight: '700' }}>0</div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>number of register</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '15px', color: 'var(--color-green)', fontWeight: '700' }}>0</div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Deposit number</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '15px', color: 'var(--primary-gold-dark)', fontWeight: '700' }}>0</div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Deposit amount</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '15px', color: '#fff', fontWeight: '700' }}>0</div>
                <div style={{ fontSize: '9px', color: 'var(--text-secondary)', lineHeight: '1.2' }}>Number of people making first deposit</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Invitation Link Button */}
      <div style={{ padding: '0 12px' }}>
        <button 
          className="gold-btn" 
          onClick={() => copyToClipboard(inviteLink, "Invitation Link")}
          style={{ marginBottom: '12px' }}
        >
          INVITATION LINK
        </button>
      </div>

      {/* Copy invitation code block */}
      <div 
        onClick={() => copyToClipboard(inviteCode, "Invitation Code")}
        style={{ background: 'var(--bg-card)', margin: '0 12px 12px 12px', borderRadius: '12px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.03)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <User size={18} color="var(--primary-gold)" />
          <span style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>Copy invitation code</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>{inviteCode}</span>
          <Copy size={16} color="var(--text-muted)" />
        </div>
      </div>

      {/* List menus */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.03)', margin: '0 12px 12px 12px', borderRadius: '12px', overflow: 'hidden' }}>
        
        <div 
          onClick={() => alert("Subordinate data report: No subordinates recorded yet.")}
          style={{ background: 'var(--bg-card)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={18} color="var(--primary-gold)" />
            <span style={{ fontSize: '13px', color: '#fff' }}>Subordinate data</span>
          </div>
          <ArrowRight size={16} color="var(--text-muted)" />
        </div>

        <div 
          onClick={() => alert("Commission Detail: 5% tier structure active.")}
          style={{ background: 'var(--bg-card)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <DollarSign size={18} color="var(--primary-gold)" />
            <span style={{ fontSize: '13px', color: '#fff' }}>Commission detail</span>
          </div>
          <ArrowRight size={16} color="var(--text-muted)" />
        </div>
      </div>

    </div>
  );
};

export default Promotion;
