import React, { createContext, useState, useEffect, useRef } from 'react';

export const AppContext = createContext();

const DEFAULT_USER = {
  isLoggedIn: true, // Default logged in for demo convenience
  phone: "4545454545",
  uid: "10398",
  balance: 0.75,
  deposit: 34500,
  withdraw: 0,
  lastLogin: new Date().toLocaleString(),
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150",
  vipLevel: 0
};

// Help generate unique period IDs based on current time + counter
const getPeriodId = (secondsInterval) => {
  const now = new Date();
  const dateString = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  
  // Calculate total seconds today
  const totalSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const periodCounter = Math.floor(totalSeconds / secondsInterval);
  return dateString + "1000" + String(periodCounter).padStart(5, '0');
};

const COLORS = {
  green: [1, 3, 7, 9],
  red: [2, 4, 6, 8],
  violet: [0, 5]
};

export const AppProvider = ({ children }) => {
  // Navigation / Router Tab
  const [currentTab, setTab] = useState('Home'); // Home, Activity, Promotion, Wallet, Account, WinGo, K3, 5D, Deposit, Withdraw, Settings
  const [toast, setToast] = useState(null);
  
  // Load State from LocalStorage or Defaults
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cognix_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [bets, setBets] = useState(() => {
    const saved = localStorage.getItem('cognix_bets');
    return saved ? JSON.parse(saved) : [
      {
        id: "bet_1",
        game: "Win Go",
        mode: "30Sec",
        period: "20260627100051463",
        time: "2026-06-26 13:46:53",
        selection: "Big",
        amount: 161.7,
        status: "Failed", // Success, Failed, Pending
        resultNumber: 2,
        payout: 0
      }
    ];
  });

  const [deposits, setDeposits] = useState(() => {
    const saved = localStorage.getItem('cognix_deposits');
    return saved ? JSON.parse(saved) : [
      { id: "dep_1", amount: 34500, time: "2026-06-25 15:30:12", channel: "Super-QR", status: "Success" }
    ];
  });

  const [withdrawals, setWithdrawals] = useState(() => {
    const saved = localStorage.getItem('cognix_withdrawals');
    return saved ? JSON.parse(saved) : [];
  });

  // Simulated Game Histories for intervals: 30s, 1m, 3m, 5m
  const [wingoHistory, setWingoHistory] = useState(() => {
    const saved = localStorage.getItem('cognix_wingo_history');
    if (saved) return JSON.parse(saved);

    // Seed initial data
    const modes = ["30Sec", "1Min", "3Min", "5Min"];
    const history = {};
    modes.forEach(mode => {
      history[mode] = [];
      const interval = mode === "30Sec" ? 30 : mode === "1Min" ? 60 : mode === "3Min" ? 180 : 300;
      // Pre-populate 15 records
      for (let i = 15; i >= 1; i--) {
        const num = Math.floor(Math.random() * 10);
        let color = 'green';
        if (num === 0) color = 'red-violet';
        else if (num === 5) color = 'green-violet';
        else if (COLORS.red.includes(num)) color = 'red';
        
        const bigSmall = num >= 5 ? 'Big' : 'Small';
        const now = new Date(Date.now() - i * interval * 1000);
        const periodCounter = Math.floor((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / interval);
        const dateString = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
        const periodId = dateString + "1000" + String(periodCounter).padStart(5, '0');

        history[mode].push({ period: periodId, number: num, bigSmall, color });
      }
    });
    return history;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('cognix_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cognix_bets', JSON.stringify(bets));
  }, [bets]);

  useEffect(() => {
    localStorage.setItem('cognix_deposits', JSON.stringify(deposits));
  }, [deposits]);

  useEffect(() => {
    localStorage.setItem('cognix_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem('cognix_wingo_history', JSON.stringify(wingoHistory));
  }, [wingoHistory]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Auth Operations
  const login = (phone, password) => {
    if (phone === "4545454545" && password === "Demo1234@") {
      setUser(prev => ({
        ...prev,
        isLoggedIn: true,
        phone,
        lastLogin: new Date().toLocaleString()
      }));
      showToast("Login successful!", "success");
      setTab('Home');
      return true;
    }
    showToast("Invalid credentials!", "error");
    return false;
  };

  const register = (phone, password) => {
    if (phone.length < 10) {
      showToast("Phone number must be at least 10 digits", "error");
      return false;
    }
    setUser(prev => ({
      ...prev,
      isLoggedIn: true,
      phone,
      balance: 0.00,
      deposit: 0,
      withdraw: 0,
      lastLogin: new Date().toLocaleString()
    }));
    showToast("Account registered successfully!", "success");
    setTab('Home');
    return true;
  };

  const logout = () => {
    setUser(prev => ({ ...prev, isLoggedIn: false }));
    showToast("Logged out successfully");
    setTab('Login');
  };

  // Wallet Operations
  const depositMoney = (amount, channel) => {
    if (amount <= 0) return false;
    setUser(prev => ({
      ...prev,
      balance: parseFloat((prev.balance + amount).toFixed(2)),
      deposit: prev.deposit + amount
    }));
    const newDep = {
      id: "dep_" + Date.now(),
      amount,
      time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      channel,
      status: "Success"
    };
    setDeposits(prev => [newDep, ...prev]);
    showToast(`Successfully deposited ₹${amount}!`, "success");
    return true;
  };

  const withdrawMoney = (amount) => {
    if (amount < 110) {
      showToast("Minimum withdrawal amount is ₹110", "error");
      return false;
    }
    if (amount > user.balance) {
      showToast("Insufficient balance", "error");
      return false;
    }
    setUser(prev => ({
      ...prev,
      balance: parseFloat((prev.balance - amount).toFixed(2)),
      withdraw: prev.withdraw + amount
    }));
    const newWith = {
      id: "with_" + Date.now(),
      amount,
      time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: "Success"
    };
    setWithdrawals(prev => [newWith, ...prev]);
    showToast(`Withdrawal of ₹${amount} initiated successfully!`, "success");
    return true;
  };

  // Betting Operations
  const placeBet = (game, mode, period, selection, amount, multiplier) => {
    const totalAmount = amount * multiplier;
    if (totalAmount > user.balance) {
      showToast("Insufficient balance to place bet!", "error");
      return false;
    }

    // Deduct Balance
    setUser(prev => ({
      ...prev,
      balance: parseFloat((prev.balance - totalAmount).toFixed(2))
    }));

    // Add bet in pending state
    const newBet = {
      id: "bet_" + Date.now(),
      game,
      mode,
      period,
      time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      selection,
      amount: totalAmount,
      status: "Pending",
      resultNumber: null,
      payout: 0
    };

    setBets(prev => [newBet, ...prev]);
    showToast("Bet placed successfully!", "success");
    return true;
  };

  // Game loop tickers for Win Go (30s, 1m, 3m, 5m)
  useEffect(() => {
    const timers = {};
    const intervals = {
      "30Sec": 30,
      "1Min": 60,
      "3Min": 180,
      "5Min": 300
    };

    const runRound = (mode) => {
      const seconds = intervals[mode];
      const periodId = getPeriodId(seconds);

      // Generate a new outcome
      const num = Math.floor(Math.random() * 10);
      let color = 'green';
      if (num === 0) color = 'red-violet';
      else if (num === 5) color = 'green-violet';
      else if (COLORS.red.includes(num)) color = 'red';
      
      const bigSmall = num >= 5 ? 'Big' : 'Small';

      const outcome = { period: periodId, number: num, bigSmall, color };

      // Update history for this mode
      setWingoHistory(prev => {
        const modeHistory = [...prev[mode]];
        // Avoid duplicate period entry
        if (modeHistory.length > 0 && modeHistory[0].period === periodId) {
          return prev;
        }
        const updated = [outcome, ...modeHistory];
        if (updated.length > 100) updated.pop(); // limit to 100 records
        return {
          ...prev,
          [mode]: updated
        };
      });

      // Settle Bets matching this period and mode
      setBets(prevBets => {
        let balanceGained = 0;
        const settled = prevBets.map(bet => {
          if (bet.game === "Win Go" && bet.mode === mode && bet.period === periodId && bet.status === "Pending") {
            let win = false;
            let multiplierRatio = 1.96; // Standard payout ratio minus commissions

            // Check Win Condition
            const select = bet.selection;
            if (select === 'Big' || select === 'Small') {
              win = (bigSmall === select);
            } else if (select === 'Green') {
              win = COLORS.green.includes(num) || num === 5;
              if (num === 5) multiplierRatio = 1.5; // partial win on Violet split
            } else if (select === 'Red') {
              win = COLORS.red.includes(num) || num === 0;
              if (num === 0) multiplierRatio = 1.5; // partial win on Violet split
            } else if (select === 'Violet') {
              win = COLORS.violet.includes(num);
              multiplierRatio = 4.41;
            } else {
              // Exact number bet (0-9)
              const numVal = parseInt(select);
              win = (numVal === num);
              multiplierRatio = 9.0;
            }

            const payout = win ? parseFloat((bet.amount * multiplierRatio).toFixed(2)) : 0;
            if (win) {
              balanceGained += payout;
            }

            return {
              ...bet,
              status: win ? "Success" : "Failed",
              resultNumber: num,
              payout
            };
          }
          return bet;
        });

        if (balanceGained > 0) {
          setUser(prev => ({
            ...prev,
            balance: parseFloat((prev.balance + balanceGained).toFixed(2))
          }));
          setTimeout(() => showToast(`Congratulations! You won ₹${balanceGained}!`, "success"), 1000);
        }

        return settled;
      });
    };

    // Set up ticking timeouts
    const tick = () => {
      const now = new Date();
      const currentSeconds = now.getSeconds();
      const currentMs = now.getMilliseconds();

      // Tick for 30Sec mode (triggers at :00 and :30 of every minute)
      const sec30TimeLeft = 30 - (currentSeconds % 30);
      if (sec30TimeLeft === 30 && currentMs < 1000) {
        runRound("30Sec");
      }

      // Tick for 1Min mode (triggers at :00 of every minute)
      const sec60TimeLeft = 60 - currentSeconds;
      if (sec60TimeLeft === 60 && currentMs < 1000) {
        runRound("1Min");
      }

      // Tick for 3Min mode
      const totalSecondsToday = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      if (totalSecondsToday % 180 === 0 && currentMs < 1000) {
        runRound("3Min");
      }

      // Tick for 5Min mode
      if (totalSecondsToday % 300 === 0 && currentMs < 1000) {
        runRound("5Min");
      }
    };

    const intervalId = setInterval(tick, 500);

    return () => clearInterval(intervalId);
  }, []);

  const deductBalance = (amount) => {
    if (amount > user.balance) {
      showToast("Insufficient balance to place bet!", "error");
      return false;
    }
    setUser(prev => ({
      ...prev,
      balance: parseFloat((prev.balance - amount).toFixed(2))
    }));
    return true;
  };

  const addWinningsAndRecordBet = (game, betAmount, multiplier, selection, status, payout) => {
    const newBet = {
      id: "bet_" + Date.now(),
      game,
      mode: "Instant",
      period: "INST-" + Math.floor(100000 + Math.random() * 900000),
      time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      selection,
      amount: betAmount,
      status, // "Success" or "Failed"
      resultNumber: multiplier.toFixed(2) + "x",
      payout: parseFloat(payout.toFixed(2))
    };

    setBets(prev => [newBet, ...prev]);

    if (payout > 0) {
      setUser(prev => ({
        ...prev,
        balance: parseFloat((prev.balance + payout).toFixed(2))
      }));
      showToast(`Congratulations! You won ₹${payout.toFixed(2)}!`, "success");
    } else {
      showToast("Bet settled. Better luck next time!", "info");
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      currentTab,
      setTab,
      bets,
      deposits,
      withdrawals,
      wingoHistory,
      toast,
      showToast,
      login,
      register,
      logout,
      depositMoney,
      withdrawMoney,
      placeBet,
      getPeriodId,
      deductBalance,
      addWinningsAndRecordBet
    }}>
      {children}
    </AppContext.Provider>
  );
};
