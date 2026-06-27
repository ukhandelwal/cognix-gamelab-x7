import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { ChevronLeft } from 'lucide-react';

const Lotre5D = () => {
  const { user, setTab, showToast, depositMoney } = useContext(AppContext);
  const [selectedDigit, setSelectedDigit] = useState('Row A - Digit 5');

  const handleMockBet = () => {
    if (user.balance < 10) {
      showToast("Insufficient balance to bet on 5D!", "error");
      return;
    }
    // Simulate placing a bet and winning!
    showToast("5D Bet placed successfully!", "success");
    setTimeout(() => {
      depositMoney(90, "5D Win Payout");
      showToast("Congratulations! You won ₹90 on 5D Exact Row prediction!", "success");
    }, 2000);
  };

  return (
    <div style={{ backgroundColor: '#141a23', minHeight: '100%', paddingBottom: '30px' }}>
      
      {/* Header bar */}
      <div className="header-bar">
        <button className="header-action-btn" onClick={() => setTab('Home')}>
          <ChevronLeft size={20} />
        </button>
        <span className="header-title">5D Lotre</span>
        <div></div>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '30px 16px' }}>
        <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>🔮🔮🔮</span>
        <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>5D Number Columns</h3>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>
          Select matching digits across rows A, B, C, D, and E. Settle games instantly with 9x multiplier returns.
        </p>

        <div style={{ background: '#1c222c', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span>Bet Row</span>
            <span style={{ color: 'var(--primary-gold)', fontWeight: 'bold' }}>{selectedDigit}</span>
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

      {/* Row Selectors details grid */}
      <div style={{ padding: '0 12px' }}>
        <h4 style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '8px', paddingLeft: '4px' }}>Bet Rows</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
          {['A', 'B', 'C', 'D', 'E'].map(row => (
            <button
              key={row}
              onClick={() => setSelectedDigit(`Row ${row} - Digit 5`)}
              style={{
                height: '34px',
                background: selectedDigit.includes(`Row ${row}`) ? 'var(--gold-gradient)' : '#252d3a',
                color: selectedDigit.includes(`Row ${row}`) ? '#1e2531' : '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {row}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Lotre5D;
