import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { RefreshCw, Copy, Wallet, Download, Upload, Shield, Gamepad2, Landmark, Clock, History, Bell, Gift, BarChart2, Globe, Settings as SettingsIcon, LogOut } from 'lucide-react';

const Account = () => {
  const { user, logout, setTab, bets, showToast } = useContext(AppContext);

  const handleCopyUID = () => {
    navigator.clipboard.writeText(user.uid);
    showToast("UID copied to clipboard!", "success");
  };

  return (
    <div style={{ backgroundColor: '#141a23', minHeight: '100%', paddingBottom: '30px' }}>
      
      {/* Profile Header Block */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #1e2531 0%, #171d28 100%)', 
          padding: '24px 16px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.03)'
        }}
      >
        <img 
          src={user.avatar} 
          alt="avatar" 
          style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-gold)' }} 
        />
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>{user.phone === "4545454545" ? "Hamza" : user.phone}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: '#343f52', color: 'var(--primary-gold)', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px' }}>
              <Shield size={10} fill="var(--primary-gold)" />
              <span>VIP {user.vipLevel}</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>UID:</span>
            <span style={{ color: '#fff', fontWeight: '600' }}>{user.uid}</span>
            <Copy size={13} color="var(--primary-gold)" onClick={handleCopyUID} style={{ cursor: 'pointer' }} />
          </div>
          
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Last Login: {user.lastLogin}
          </div>
        </div>
      </div>

      {/* Balance panel card */}
      <div className="card" style={{ marginTop: '-12px', zIndex: 2, position: 'relative' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total balance</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '6px 0 16px 0' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#fff' }}>₹{user.balance.toFixed(2)}</h2>
          <button 
            onClick={() => showToast("Balance refreshed successfully!", "success")}
            style={{ background: 'none', border: 'none', color: 'var(--primary-gold)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '16px', textAlign: 'center' }}>
          
          <div onClick={() => setTab('Wallet')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <Wallet size={18} color="#e83d3d" />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Wallet</span>
          </div>

          <div onClick={() => setTab('Deposit')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <Download size={18} color="#f3a83b" />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Deposit</span>
          </div>

          <div onClick={() => setTab('Withdraw')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <Upload size={18} color="#2a85ff" />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Withdraw</span>
          </div>

          <div onClick={() => alert("VIP System details: Bet more to upgrade level and unlock custom rebates.")} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <Shield size={18} color="#13b367" />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>VIP</span>
          </div>

        </div>
      </div>

      {/* Grid Menu options */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '0 12px 12px 12px' }}>
        
        <div 
          onClick={() => alert(`My Bet History:\n${bets.map(b => `${b.period}: ${b.selection} ₹${b.amount} - ${b.status}`).join('\n')}`)}
          style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <Gamepad2 size={24} color="#2a85ff" />
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#fff' }}>Game History</div>
            <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>My game history</div>
          </div>
        </div>

        <div 
          onClick={() => alert("Transactions Log: Payouts and commission logs are up to date.")}
          style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <Landmark size={24} color="#13b367" />
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#fff' }}>Transaction</div>
            <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>My transaction history</div>
          </div>
        </div>

        <div 
          onClick={() => setTab('Wallet')}
          style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <Clock size={24} color="#e83d3d" />
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#fff' }}>Deposit</div>
            <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>My deposit history</div>
          </div>
        </div>

        <div 
          onClick={() => setTab('Wallet')}
          style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <History size={24} color="#f3a83b" />
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#fff' }}>Withdraw</div>
            <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>My withdraw history</div>
          </div>
        </div>

      </div>

      {/* Settings list options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.03)', margin: '0 12px 16px 12px', borderRadius: '12px', overflow: 'hidden' }}>
        
        <div onClick={() => alert("No new notifications")} style={{ background: 'var(--bg-card)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={18} color="var(--primary-gold)" />
            <span style={{ fontSize: '13px', color: '#fff' }}>Notification</span>
          </div>
          <ChevronRightIcon />
        </div>

        <div onClick={() => setTab('Activity')} style={{ background: 'var(--bg-card)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Gift size={18} color="var(--primary-gold)" />
            <span style={{ fontSize: '13px', color: '#fff' }}>Gifts</span>
          </div>
          <ChevronRightIcon />
        </div>

        <div onClick={() => alert("Bet Statistics: Total Bet Volume ₹243.85")} style={{ background: 'var(--bg-card)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart2 size={18} color="var(--primary-gold)" />
            <span style={{ fontSize: '13px', color: '#fff' }}>Game statistics</span>
          </div>
          <ChevronRightIcon />
        </div>

        <div onClick={() => alert("Selected: English")} style={{ background: 'var(--bg-card)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe size={18} color="var(--primary-gold)" />
            <span style={{ fontSize: '13px', color: '#fff' }}>Language</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>English</span>
            <ChevronRightIcon />
          </div>
        </div>

        <div onClick={() => setTab('Settings')} style={{ background: 'var(--bg-card)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SettingsIcon size={18} color="var(--primary-gold)" />
            <span style={{ fontSize: '13px', color: '#fff' }}>Settings</span>
          </div>
          <ChevronRightIcon />
        </div>

      </div>

      {/* Logout button */}
      <div style={{ padding: '0 12px' }}>
        <button 
          onClick={logout}
          style={{ background: 'rgba(232, 61, 61, 0.1)', border: '1px solid var(--color-red)', color: 'var(--color-red)', borderRadius: '12px', width: '100%', height: '48px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

    </div>
  );
};

const ChevronRightIcon = () => (
  <span style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: 'bold' }}>&rsaquo;</span>
);

export default Account;
