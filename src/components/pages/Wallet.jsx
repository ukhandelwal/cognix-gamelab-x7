import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Wallet as WalletIcon, ArrowLeftRight, Download, Upload, Clock, History } from 'lucide-react';

const Wallet = () => {
  const { user, setTab, deposits, withdrawals } = useContext(AppContext);

  return (
    <div style={{ backgroundColor: '#141a23', minHeight: '100%', paddingBottom: '20px' }}>
      
      {/* Header bar */}
      <div className="header-bar">
        <div></div>
        <span className="header-title">Wallet</span>
        <div></div>
      </div>

      {/* Main Balance Display */}
      <div 
        className="card" 
        style={{ 
          background: 'linear-gradient(135deg, #252d3a 0%, #1c222c 100%)', 
          border: '1px solid rgba(255,255,255,0.03)',
          textAlign: 'center',
          padding: '24px 16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(243, 168, 59, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <WalletIcon size={22} color="var(--primary-gold)" />
          </div>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>₹{user.balance.toFixed(2)}</h2>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Total balance</div>
        
        <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '16px' }}>
          <div style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: '15px', color: '#fff', fontWeight: '700' }}>₹{user.withdraw.toFixed(2)}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Total withdrawal amount</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '15px', color: '#fff', fontWeight: '700' }}>₹{user.deposit.toFixed(2)}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Total deposit amount</div>
          </div>
        </div>
      </div>

      {/* Circular details card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {/* Main wallet circle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid var(--primary-gold-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'var(--primary-gold)', fontWeight: 'bold' }}>
              100%
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: '#fff', fontWeight: '700' }}>₹{user.balance.toFixed(2)}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Main wallet</div>
            </div>
          </div>

          {/* Third party wallet circle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
              0%
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: '#fff', fontWeight: '700' }}>₹0.00</div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>3rd party wallet</div>
            </div>
          </div>
        </div>

        <button 
          className="gold-btn" 
          onClick={() => alert("Transferred 3rd party game balances back to main wallet successfully!")}
          style={{ padding: '10px' }}
        >
          <ArrowLeftRight size={16} />
          Main wallet transfer
        </button>

        {/* Quick action buttons row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '16px' }}>
          
          <div 
            onClick={() => setTab('Deposit')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f3a83b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Download size={16} color="#1e2531" />
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Deposit</span>
          </div>

          <div 
            onClick={() => setTab('Withdraw')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#2a85ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload size={16} color="#fff" />
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Withdraw</span>
          </div>

          <div 
            onClick={() => alert(`Deposits Log:\n${deposits.map(d => `${d.time}: ₹${d.amount} (${d.channel}) - ${d.status}`).join('\n') || 'No records yet.'}`)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e83d3d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={16} color="#fff" />
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Deposit history</span>
          </div>

          <div 
            onClick={() => alert(`Withdrawals Log:\n${withdrawals.map(w => `${w.time}: ₹${w.amount} - ${w.status}`).join('\n') || 'No records yet.'}`)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#13b367', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <History size={16} color="#fff" />
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Withdrawal History</span>
          </div>

        </div>
      </div>

      {/* Game Wallets Breakdown list grid */}
      <div style={{ padding: '0 12px' }}>
        <h4 style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '8px', paddingLeft: '4px' }}>Game Wallets</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          <div style={{ background: '#252d3a', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>₹{user.balance.toFixed(2)}</div>
            <div style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '2px' }}>LOTTERY</div>
          </div>
          <div style={{ background: '#252d3a', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>₹0.00</div>
            <div style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '2px' }}>CQ9</div>
          </div>
          <div style={{ background: '#252d3a', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>₹0.00</div>
            <div style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '2px' }}>MG</div>
          </div>
          <div style={{ background: '#252d3a', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>₹0.00</div>
            <div style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '2px' }}>JDB</div>
          </div>
          <div style={{ background: '#252d3a', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>₹0.00</div>
            <div style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '2px' }}>EVO_Video</div>
          </div>
          <div style={{ background: '#252d3a', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>₹0.00</div>
            <div style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '2px' }}>JILI</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Wallet;
