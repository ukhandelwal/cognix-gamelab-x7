import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { ChevronLeft } from 'lucide-react';

const K3Lottery = () => {
  const { user, setTab, showToast, depositMoney } = useContext(AppContext);
  const [betValue, setBetValue] = useState('Sum 10');

  const handleMockBet = () => {
    if (user.balance < 10) {
      showToast("Insufficient balance to bet on K3!", "error");
      return;
    }
    // Simulate placing a bet and winning!
    showToast("K3 Bet placed successfully!", "success");
    setTimeout(() => {
      depositMoney(18, "K3 Win Payout");
      showToast("Congratulations! You won ₹18 on K3 Sum Prediction!", "success");
    }, 2000);
  };

  return (
    <div style={{ backgroundColor: '#141a23', minHeight: '100%', paddingBottom: '30px' }}>
      
      {/* Header bar */}
      <div className="header-bar">
        <button className="header-action-btn" onClick={() => setTab('Home')}>
          <ChevronLeft size={20} />
        </button>
        <span className="header-title">K3 Lottery</span>
        <div></div>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '30px 16px' }}>
        <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>🎲🎲🎲</span>
        <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>K3 Dice Prediction</h3>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>
          Select sum totals of three rolled dice, triple numbers, or double matching sequences. Real-time settling completes every 1 minute.
        </p>

        <div style={{ background: '#1c222c', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span>Selected Option</span>
            <span style={{ color: 'var(--primary-gold)', fontWeight: 'bold' }}>{betValue}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span>Bet Cost</span>
            <span style={{ color: '#fff' }}>₹10.00</span>
          </div>
        </div>

        <button className="gold-btn" onClick={handleMockBet}>
          Place Bet (₹10)
        </button>
      </div>

      {/* Mock Dice Grid Info */}
      <div style={{ padding: '0 12px' }}>
        <h4 style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '8px', paddingLeft: '4px' }}>Bet Types</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div 
            onClick={() => setBetValue('Sum 3-10 (Small)')}
            style={{ background: '#252d3a', borderRadius: '8px', padding: '12px', textAlign: 'center', cursor: 'pointer', border: betValue.includes('Small') ? '1px solid var(--primary-gold-dark)' : '1px solid transparent' }}
          >
            <div style={{ fontSize: '14px', color: 'var(--color-green)', fontWeight: 'bold' }}>Small</div>
            <div style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '2px' }}>Sum 3-10 (2x)</div>
          </div>
          <div 
            onClick={() => setBetValue('Sum 11-18 (Big)')}
            style={{ background: '#252d3a', borderRadius: '8px', padding: '12px', textAlign: 'center', cursor: 'pointer', border: betValue.includes('Big') ? '1px solid var(--primary-gold-dark)' : '1px solid transparent' }}
          >
            <div style={{ fontSize: '14px', color: 'var(--color-red)', fontWeight: 'bold' }}>Big</div>
            <div style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '2px' }}>Sum 11-18 (2x)</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default K3Lottery;
