import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Trophy, Gift, Home, Wallet, User } from 'lucide-react';

// Import pages
import HomeView from '../pages/Home';
import ActivityView from '../pages/Activity';
import PromotionView from '../pages/Promotion';
import WalletView from '../pages/Wallet';
import AccountView from '../pages/Account';
import LoginView from '../pages/Login';
import RegisterView from '../pages/Register';
import WinGoView from '../games/WinGo';
import K3LotteryView from '../games/K3Lottery';
import Lotre5DView from '../games/Lotre5D';
import AviatorView from '../games/Aviator';
import ChickenView from '../games/Chicken';
import DepositView from '../pages/Deposit';
import WithdrawView from '../pages/Withdraw';
import SettingsView from '../pages/Settings';

const AppShell = () => {
  const { user, currentTab, setTab, toast } = useContext(AppContext);

  // Auth routing guard
  if (!user.isLoggedIn) {
    if (currentTab === 'Register') {
      return (
        <div className="app-container">
          <RegisterView />
          {toast && <div className={`toast-msg ${toast.type}`}>{toast.message}</div>}
        </div>
      );
    }
    return (
      <div className="app-container">
        <LoginView />
        {toast && <div className={`toast-msg ${toast.type}`}>{toast.message}</div>}
      </div>
    );
  }

  // Render view depending on current tab/route state
  const renderView = () => {
    switch (currentTab) {
      case 'Home':
        return <HomeView />;
      case 'Activity':
        return <ActivityView />;
      case 'Promotion':
        return <PromotionView />;
      case 'Wallet':
        return <WalletView />;
      case 'Account':
        return <AccountView />;
      case 'WinGo':
        return <WinGoView />;
      case 'K3':
        return <K3LotteryView />;
      case '5D':
        return <Lotre5DView />;
      case 'Aviator':
        return <AviatorView />;
      case 'Chicken':
        return <ChickenView />;
      case 'Deposit':
        return <DepositView />;
      case 'Withdraw':
        return <WithdrawView />;
      case 'Settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  const showTabBar = ['Home', 'Activity', 'Promotion', 'Wallet', 'Account'].includes(currentTab);

  return (
    <div className="app-container">
      {/* Toast System */}
      {toast && <div className={`toast-msg ${toast.type}`}>{toast.message}</div>}

      {/* Main Content Area */}
      <div className="app-content" style={{ paddingBottom: showTabBar ? '75px' : '0' }}>
        {renderView()}
      </div>

      {/* Persistent Bottom Nav Bar */}
      {showTabBar && (
        <nav className="bottom-nav">
          <button 
            className={`nav-item ${currentTab === 'Promotion' ? 'active' : ''}`}
            onClick={() => setTab('Promotion')}
          >
            <Trophy size={20} />
            <span>Promotion</span>
          </button>

          <button 
            className={`nav-item ${currentTab === 'Activity' ? 'active' : ''}`}
            onClick={() => setTab('Activity')}
          >
            <Gift size={20} />
            <span>Activity</span>
          </button>

          {/* Raised Home Center Button */}
          <div className="nav-item-home">
            <div className="home-btn-container">
              <button 
                className="home-btn"
                onClick={() => setTab('Home')}
              >
                <Home size={24} />
              </button>
            </div>
          </div>

          <button 
            className={`nav-item ${currentTab === 'Wallet' ? 'active' : ''}`}
            onClick={() => setTab('Wallet')}
          >
            <Wallet size={20} />
            <span>Wallet</span>
          </button>

          <button 
            className={`nav-item ${currentTab === 'Account' ? 'active' : ''}`}
            onClick={() => setTab('Account')}
          >
            <User size={20} />
            <span>Account</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default AppShell;
