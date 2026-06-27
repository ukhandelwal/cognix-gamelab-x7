import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { ChevronLeft, RefreshCw, QrCode, ArrowRight, ShieldCheck, X } from 'lucide-react';

const QUICK_AMOUNTS = [100, 500, 800, 1000, 2000, 3000, 5000, 10000, 20000, 30000, 40000, 50000];
const CHANNELS = ["Super-QR", "ARpay-QR", "OoPay-QR", "Paile-QR", "7Day-QR", "FFPay-QR", "WPay-QR", "Happy-QR"];

const Deposit = () => {
  const { user, setTab, depositMoney, showToast } = useContext(AppContext);
  const [payMethod, setPayMethod] = useState('UPI'); // UPI or USDT
  const [selectedChannel, setSelectedChannel] = useState('Super-QR');
  const [amount, setAmount] = useState('100');
  const [showQRModal, setShowQRModal] = useState(false);

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      showToast("Please enter a valid deposit amount", "error");
      return;
    }
    // Open high fidelity QR mockup payment simulation
    setShowQRModal(true);
  };

  const completeSimulation = () => {
    const parsed = parseFloat(amount);
    depositMoney(parsed, selectedChannel);
    setShowQRModal(false);
  };

  return (
    <div style={{ backgroundColor: '#141a23', minHeight: '100%', paddingBottom: '30px' }}>
      
      {/* Header Bar */}
      <div className="header-bar">
        <button className="header-action-btn" onClick={() => setTab('Home')}>
          <ChevronLeft size={20} />
        </button>
        <span className="header-title">Deposit</span>
        <button 
          className="header-action-btn" 
          onClick={() => alert(`Deposit History:\n${user.deposit ? 'Simulated logs stored in wallet history' : 'No deposits recorded yet'}`)}
          style={{ fontSize: '12px', color: 'var(--text-secondary)' }}
        >
          Deposit history
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
          <span>Balance</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0 20px 0' }}>
          <h2 style={{ fontSize: '28px', color: '#fff', fontWeight: '800' }}>₹{user.balance.toFixed(2)}</h2>
          <RefreshCw size={14} color="#fff" style={{ cursor: 'pointer' }} onClick={() => showToast("Updated", "success")} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.7)', letterSpacing: '2px' }}>
          <span>CHIP LINK</span>
          <span>**** **** ****</span>
        </div>
      </div>

      {/* Method selector */}
      <div style={{ display: 'flex', gap: '12px', padding: '0 12px 12px 12px' }}>
        
        {/* UPI option */}
        <div 
          onClick={() => setPayMethod('UPI')}
          style={{
            flex: 1,
            background: payMethod === 'UPI' ? 'var(--gold-gradient)' : 'var(--bg-card)',
            color: payMethod === 'UPI' ? '#1e2531' : 'var(--text-secondary)',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            position: 'relative',
            border: '1px solid rgba(255,255,255,0.03)'
          }}
        >
          <span style={{ fontSize: '18px' }}>⚡</span>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800' }}>UPI x QR</div>
          </div>
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--color-red)', color: '#fff', fontSize: '9px', fontWeight: '800', padding: '1px 6px', borderRadius: '8px' }}>5%</span>
        </div>

        {/* USDT option */}
        <div 
          onClick={() => setPayMethod('USDT')}
          style={{
            flex: 1,
            background: payMethod === 'USDT' ? 'var(--gold-gradient)' : 'var(--bg-card)',
            color: payMethod === 'USDT' ? '#1e2531' : 'var(--text-secondary)',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            position: 'relative',
            border: '1px solid rgba(255,255,255,0.03)'
          }}
        >
          <span style={{ fontSize: '18px' }}>₮</span>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800' }}>USDT</div>
          </div>
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--color-red)', color: '#fff', fontSize: '9px', fontWeight: '800', padding: '1px 6px', borderRadius: '8px' }}>5%</span>
        </div>

      </div>

      {/* Select Channel Section */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h4 style={{ fontSize: '13px', color: 'var(--primary-gold)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>💳</span>
          Select channel
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {CHANNELS.map(ch => (
            <div
              key={ch}
              onClick={() => setSelectedChannel(ch)}
              style={{
                background: selectedChannel === ch ? 'var(--gold-gradient)' : '#1c222c',
                color: selectedChannel === ch ? '#1e2531' : 'var(--text-secondary)',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: '700',
                border: '1px solid rgba(255,255,255,0.03)'
              }}
            >
              <div>{ch}</div>
              <div style={{ fontSize: '9px', opacity: 0.8, marginTop: '2px' }}>Balance: 100 - 50K</div>
            </div>
          ))}
        </div>
      </div>

      {/* Amount Input and Selector */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h4 style={{ fontSize: '13px', color: 'var(--primary-gold)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>💰</span>
          Deposit amount
        </h4>

        {/* Quick Amount Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {QUICK_AMOUNTS.map(amt => (
            <button
              key={amt}
              onClick={() => setAmount(String(amt))}
              style={{
                height: '38px',
                background: '#1c222c',
                border: amount === String(amt) ? '1px solid var(--primary-gold-dark)' : '1px solid rgba(255,255,255,0.03)',
                borderRadius: '8px',
                color: amount === String(amt) ? 'var(--primary-gold)' : '#fff',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              ₹ {amt >= 1000 ? `${amt / 1000}K` : amt}
            </button>
          ))}
        </div>

        {/* Input box */}
        <form onSubmit={handleDepositSubmit}>
          <div className="input-group" style={{ marginBottom: '16px' }}>
            <div className="input-wrapper">
              <span className="input-icon" style={{ left: '14px', color: 'var(--primary-gold)', fontWeight: 'bold' }}>₹</span>
              <input
                type="number"
                placeholder="Please enter the amount"
                className="custom-input"
                style={{ paddingLeft: '32px' }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="100"
                max="50000"
                required
              />
            </div>
          </div>

          <button type="submit" className="gold-btn">
            Deposit
          </button>
        </form>
      </div>

      {/* Instructions list */}
      <div className="card" style={{ background: '#1c222c', fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4 style={{ color: '#fff', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Recharge Instructions</h4>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ color: 'var(--primary-gold)' }}>♦</span>
          <span>If the transfer time is up, please fill out the deposit form again.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ color: 'var(--primary-gold)' }}>♦</span>
          <span>The transfer amount must match the order you created, or the system cannot credit successfully.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ color: 'var(--primary-gold)' }}>♦</span>
          <span>Please do not save the QR code for multiple recharges. Single-use only.</span>
        </div>
      </div>

      {/* Payment Simulator QR Modal */}
      {showQRModal && (
        <div className="captcha-overlay">
          <div className="captcha-box" style={{ background: '#1e2531', maxWidth: '350px', border: '2px solid var(--primary-gold-dark)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px', marginBottom: '15px' }}>
              <span style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>Deposit Simulation Portal</span>
              <X size={18} color="var(--text-secondary)" onClick={() => setShowQRModal(false)} style={{ cursor: 'pointer' }} />
            </div>

            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <div style={{ fontSize: '20px', color: 'var(--primary-gold)', fontWeight: '800', marginBottom: '4px' }}>₹{amount}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Pending Payment Process</div>
            </div>

            <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', marginBottom: '15px' }}>
              <QrCode size={180} color="#000" />
            </div>

            <p style={{ fontSize: '10px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '20px', lineHeight: '1.4' }}>
              Scan this mockup QR Code to simulate your UPI transaction. Click the button below to confirm successful simulator payment credit.
            </p>

            <button className="gold-btn" onClick={completeSimulation}>
              Simulate Payment Success
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Deposit;
