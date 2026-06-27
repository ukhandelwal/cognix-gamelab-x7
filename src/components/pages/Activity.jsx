import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Award, UserPlus, Percent, Trophy, Gift, Calendar, CheckCircle } from 'lucide-react';

const Activity = () => {
  const { user, showToast, depositMoney } = useContext(AppContext);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftCode, setGiftCode] = useState('');
  const [checkedDays, setCheckedDays] = useState([false, false, false, false, false, false, false]);

  const handleGiftRedeem = (e) => {
    e.preventDefault();
    if (giftCode.trim().toUpperCase() === "DEMO100") {
      depositMoney(100, "Gift Code");
      showToast("₹100 Gift Code redeemed successfully!", "success");
      setShowGiftModal(false);
      setGiftCode('');
    } else {
      showToast("Invalid gift redemption code!", "error");
    }
  };

  const handleCheckIn = (dayIdx) => {
    if (checkedDays[dayIdx]) return;
    const updated = [...checkedDays];
    updated[dayIdx] = true;
    setCheckedDays(updated);
    
    // Add bonus balance
    const bonus = dayIdx === 6 ? 100 : 5; // 7th day gives ₹100, other days give ₹5
    depositMoney(bonus, "Daily Check-in");
    showToast(`Checked in for Day ${dayIdx + 1}! Earned ₹${bonus} bonus!`, "success");
  };

  const menuItems = [
    { icon: <Award size={22} color="#ff7043" />, label: "Activity Reward" },
    { icon: <UserPlus size={22} color="#29b6f6" />, label: "Invitation Bonus" },
    { icon: <Percent size={22} color="#ffa726" />, label: "Betting Rebate" },
    { icon: <Trophy size={22} color="#26a69a" />, label: "Super Jackpot" },
    { icon: <Gift size={22} color="#ab47bc" />, label: "First Gift" }
  ];

  return (
    <div style={{ padding: '16px', backgroundColor: '#141a23', minHeight: '100%' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <div style={{ width: '28px', height: '28px', background: 'var(--gold-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#1e2531' }}>C</div>
        <span style={{ fontSize: '15px', fontWeight: '800', letterSpacing: '1px', background: 'var(--gold-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>COGNIX</span>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>Activity</h2>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Please remember to follow the event page.<br />
          We will launch user feedback activities from time to time.
        </p>
      </div>

      {/* Button Row Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', marginBottom: '20px' }}>
        {menuItems.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#252d3a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.icon}
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: '1.2' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Gift Code and Attendance Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {/* Gift code panel */}
        <div 
          onClick={() => setShowGiftModal(true)}
          style={{ background: '#252d3a', borderRadius: 'var(--border-radius-md)', padding: '12px', border: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer' }}
        >
          <div style={{ height: '70px', borderRadius: '8px', background: 'linear-gradient(135deg, #e83d3d, #ab47bc)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
            <Gift size={32} color="#fff" />
          </div>
          <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Gifts</h4>
          <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Enter the redemption code to receive gift rewards</p>
        </div>

        {/* Attendance panel (Check in) */}
        <div 
          style={{ background: '#252d3a', borderRadius: 'var(--border-radius-md)', padding: '12px', border: '1px solid rgba(255,255,255,0.03)' }}
        >
          <div style={{ height: '70px', borderRadius: '8px', background: 'linear-gradient(135deg, #2a85ff, #26a69a)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
            <Calendar size={32} color="#fff" />
          </div>
          <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Attendance bonus</h4>
          <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>The more consecutive days you sign in, the higher the reward</p>
        </div>
      </div>

      {/* 7-Days Check-in row */}
      <div className="card" style={{ margin: '0 0 20px 0' }}>
        <h4 style={{ fontSize: '13px', color: 'var(--primary-gold)', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={14} />
          7-Days Attendance Check-in
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '8px' }}>
          {[0, 1, 2, 3].map(day => (
            <button
              key={day}
              onClick={() => handleCheckIn(day)}
              disabled={checkedDays[day]}
              style={{
                background: checkedDays[day] ? 'rgba(19, 179, 103, 0.15)' : '#1c222c',
                border: checkedDays[day] ? '1px solid var(--color-green)' : '1px solid rgba(255,255,255,0.03)',
                borderRadius: '8px',
                padding: '8px 4px',
                color: checkedDays[day] ? 'var(--color-green)' : '#fff',
                fontSize: '11px',
                cursor: checkedDays[day] ? 'default' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Day {day + 1}</span>
              {checkedDays[day] ? <CheckCircle size={12} /> : <span style={{ color: 'var(--primary-gold)', fontWeight: '700' }}>₹5</span>}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {[4, 5, 6].map(day => (
            <button
              key={day}
              onClick={() => handleCheckIn(day)}
              disabled={checkedDays[day]}
              style={{
                background: checkedDays[day] ? 'rgba(19, 179, 103, 0.15)' : '#1c222c',
                border: checkedDays[day] ? '1px solid var(--color-green)' : '1px solid rgba(255,255,255,0.03)',
                borderRadius: '8px',
                padding: '8px 4px',
                color: checkedDays[day] ? 'var(--color-green)' : '#fff',
                fontSize: '11px',
                cursor: checkedDays[day] ? 'default' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Day {day + 1}</span>
              {checkedDays[day] ? <CheckCircle size={12} /> : <span style={{ color: 'var(--primary-gold)', fontWeight: '700' }}>{day === 6 ? '₹100' : '₹5'}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Event Promotion Banner card */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #1f2735 0%, #151a24 100%)', 
          borderRadius: 'var(--border-radius-md)', 
          padding: '16px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px', 
          border: '1px solid rgba(243, 168, 59, 0.15)' 
        }}
      >
        <span style={{ fontSize: '10px', background: 'var(--gold-gradient)', color: '#1e2531', padding: '2px 8px', borderRadius: '4px', fontWeight: '800', width: 'fit-content' }}>HOT PROMOTION</span>
        <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>Deposit Bonus</h4>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Get up to ₹8,888 extra bonus on your first deposit! Recharges instantly credited to your wallet balance.</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '10px' }}>
          <span style={{ fontSize: '12px', color: 'var(--primary-gold)', fontWeight: '700' }}>Active Now</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ends in 3 days</span>
        </div>
      </div>

      {/* Gift Code Modal */}
      {showGiftModal && (
        <div className="captcha-overlay">
          <div className="captcha-box" style={{ background: '#1e2531' }}>
            <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', width: '100%' }}>Redeem Gift Code</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '14px', width: '100%' }}>Enter a valid gift promotion code to claim instant cash bonus (Use code: <b>DEMO100</b>)</p>
            <form onSubmit={handleGiftRedeem} style={{ width: '100%' }}>
              <input
                type="text"
                className="custom-input"
                placeholder="Please enter gift code"
                style={{ paddingLeft: '12px', marginBottom: '16px' }}
                value={giftCode}
                onChange={(e) => setGiftCode(e.target.value)}
                required
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button" 
                  className="gold-outline-btn" 
                  onClick={() => setShowGiftModal(false)}
                  style={{ padding: '8px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="gold-btn"
                  style={{ padding: '8px' }}
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Activity;
