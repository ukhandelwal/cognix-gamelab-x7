import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { ChevronLeft, RefreshCw, CreditCard, Landmark, CircleAlert } from 'lucide-react';

const Withdraw = () => {
  const { user, setTab, withdrawMoney, showToast } = useContext(AppContext);
  const [method, setMethod] = useState('Bank'); // Bank or USDT
  const [amount, setAmount] = useState('');
  
  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (isNaN(parsed)) {
      showToast("Please enter a valid amount", "error");
      return;
    }
    if (parsed < 110 || parsed > 10000) {
      showToast("Amount must be between ₹110 and ₹10000", "error");
      return;
    }
    const success = withdrawMoney(parsed);
    if (success) {
      setAmount('');
    }
  };

  const fillAllBalance = () => {
    if (user.balance < 110) {
      showToast("Available balance is less than the minimum withdrawal (₹110)", "error");
      return;
    }
    setAmount(String(Math.min(user.balance, 10000)));
  };

  const parsedAmount = parseFloat(amount) || 0;
  const canWithdraw = parsedAmount >= 110 && parsedAmount <= 10000 && parsedAmount <= user.balance;

  return (
    <div style={{ backgroundColor: '#141a23', minHeight: '100%', paddingBottom: '30px' }}>
      
      {/* Header bar */}
      <div className="header-bar">
        <button className="header-action-btn" onClick={() => setTab('Wallet')}>
          <ChevronLeft size={20} />
        </button>
        <span className="header-title">Withdraw</span>
        <button 
          className="header-action-btn" 
          onClick={() => alert("Withdrawal history: Open logs in wallet history tab")}
          style={{ fontSize: '12px', color: 'var(--text-secondary)' }}
        >
          Withdrawal history
        </button>
      </div>

      {/* Credit Card Balance Display */}
      <div 
        style={{
          margin: '12px',
          borderRadius: 'var(--border-radius-md)',
          background: 'linear-gradient(135deg, #13b367 0%, #0c7241 100%)',
          padding: '20px',
          boxShadow: '0 4px 15px rgba(19, 179, 103, 0.25)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
          <span>💳</span>
          <span>Available Balance</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0 20px 0' }}>
          <h2 style={{ fontSize: '28px', color: '#fff', fontWeight: '800' }}>₹{user.balance.toFixed(2)}</h2>
          <RefreshCw size={14} color="#fff" style={{ cursor: 'pointer' }} onClick={() => showToast("Balance Refreshed", "success")} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.7)', letterSpacing: '2px' }}>
          <span>CHIP LINK</span>
          <span>**** **** ****</span>
        </div>
      </div>

      {/* Payment option selector cards */}
      <div style={{ display: 'flex', gap: '12px', padding: '0 12px 12px 12px' }}>
        
        {/* Bank card */}
        <div 
          onClick={() => setMethod('Bank')}
          style={{
            flex: 1,
            background: method === 'Bank' ? 'var(--gold-gradient)' : 'var(--bg-card)',
            color: method === 'Bank' ? '#1e2531' : 'var(--text-secondary)',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.03)'
          }}
        >
          <CreditCard size={18} />
          <span style={{ fontSize: '12px', fontWeight: '800' }}>Bank Card</span>
        </div>

        {/* USDT card */}
        <div 
          onClick={() => setMethod('USDT')}
          style={{
            flex: 1,
            background: method === 'USDT' ? 'var(--gold-gradient)' : 'var(--bg-card)',
            color: method === 'USDT' ? '#1e2531' : 'var(--text-secondary)',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.03)'
          }}
        >
          <span style={{ fontSize: '18px', fontWeight: '800' }}>₮</span>
          <span style={{ fontSize: '12px', fontWeight: '800' }}>USDT</span>
        </div>

      </div>

      {/* Linked Bank Card detail box */}
      {method === 'Bank' ? (
        <div 
          className="card" 
          style={{ 
            background: '#252d3a', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            border: '1px solid rgba(255,255,255,0.03)',
            padding: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(243, 168, 59, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Landmark size={20} color="var(--primary-gold)" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>HDFC Bank</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Verified Account</div>
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#fff', fontWeight: '600', letterSpacing: '1px' }}>
            50100580609223
          </div>
        </div>
      ) : (
        <div className="card" style={{ background: '#252d3a', padding: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>₮</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>TRC20 Wallet Address</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>TWR8hJ7h...K89H2g7s</div>
            </div>
          </div>
        </div>
      )}

      {/* Inputs Form */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <form onSubmit={handleWithdrawSubmit}>
          <div className="input-group" style={{ marginBottom: '12px' }}>
            <div className="input-wrapper">
              <span className="input-icon" style={{ left: '14px', color: 'var(--primary-gold)', fontWeight: 'bold' }}>₹</span>
              <input
                type="number"
                placeholder="Please enter the amount"
                className="custom-input"
                style={{ paddingLeft: '32px' }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="110"
                max="10000"
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            <div>
              <div>Minimum Amount: <span style={{ color: 'var(--primary-gold)' }}>₹ 110</span></div>
              <div style={{ marginTop: '2px' }}>Maximum Amount: <span style={{ color: 'var(--primary-gold)' }}>₹ 10000</span></div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                type="button"
                onClick={fillAllBalance}
                style={{
                  background: 'none',
                  border: '1px solid var(--primary-gold-dark)',
                  color: 'var(--primary-gold)',
                  borderRadius: '6px',
                  padding: '2px 8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                All
              </button>
              <span style={{ color: 'var(--color-green)', fontWeight: '700', fontSize: '12px' }}>
                ₹{parsedAmount}
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            className="gold-btn" 
            disabled={!canWithdraw}
            style={{ 
              background: canWithdraw ? 'var(--gold-gradient)' : 'var(--text-muted)',
              color: canWithdraw ? 'var(--bg-main)' : 'rgba(255,255,255,0.3)',
              cursor: canWithdraw ? 'pointer' : 'not-allowed'
            }}
          >
            Withdraw
          </button>
        </form>
      </div>

      {/* Rules list */}
      <div className="card" style={{ background: '#1c222c', fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4 style={{ color: '#fff', fontSize: '12px', fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CircleAlert size={14} color="var(--primary-gold)" />
          Withdrawal Regulations
        </h4>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ color: 'var(--primary-gold)' }}>♦</span>
          <span>Need to bet <span style={{ color: 'var(--color-red)' }}>₹243.85</span> to be able to withdraw safely.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ color: 'var(--primary-gold)' }}>♦</span>
          <span>Withdraw Hour <span style={{ color: 'var(--primary-gold)' }}>12:00 AM - 11:00 PM</span>.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ color: 'var(--primary-gold)' }}>♦</span>
          <span>Daily Withdrawal Times Limits: <span style={{ color: 'var(--primary-gold)' }}>3</span> times max.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ color: 'var(--primary-gold)' }}>♦</span>
          <span>Withdrawal amount range: <span style={{ color: 'var(--primary-gold)' }}>₹110 - ₹10000</span>.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ color: 'var(--primary-gold)' }}>♦</span>
          <span>Please confirm your beneficial bank account details carefully. Settlement is irreversible.</span>
        </div>
      </div>

    </div>
  );
};

export default Withdraw;
