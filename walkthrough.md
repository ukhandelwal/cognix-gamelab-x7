# Project Walkthrough - Cognix Portal Replica

This document details the completed replication of the Cognix prediction game portal matching `https://plan4.cognixsolutions.shop`.

---

## 🛠️ Changes Implemented

### 1. Framework Scaffold & Global Context
- Scaffolded standard React + Vite template application with `lucide-react`.
- Created [AppContext.jsx](file:///Users/udit/Documents/demo/game_demo/src/context/AppContext.jsx) simulating the user local database (managed via `localStorage`), user registrations, logins, deposits/withdrawals, multi-cycle timers (30s, 1m, 3m, 5m), automatic outcomes generator, and bet settlements calculations.

### 2. Styling System
- Implemented global theme system in [App.css](file:///Users/udit/Documents/demo/game_demo/src/App.css) containing HSL variables, dark mode styling, mobile responsive viewport containment, puzzle slide captcha styling, and persistent navbars.

### 3. Account Layout Shell
- Configured [AppShell.jsx](file:///Users/udit/Documents/demo/game_demo/src/components/layout/AppShell.jsx) displaying persistent tab switches (Home, Activity, Promotion, Wallet, Account).

### 4. Interactive Pages & Games
- **Lobby View**: Created [Home.jsx](file:///Users/udit/Documents/demo/game_demo/src/components/pages/Home.jsx) with notice tickers, banner carousels, category filters, winner board cards, and floating quick-links (Telegram support, Customer Chat, Lucky Spin Wheel).
- **Activity & Promotion**: Created [Activity.jsx](file:///Users/udit/Documents/demo/game_demo/src/components/pages/Activity.jsx) with an attendance sign-in grid and promotional code modal (redeems code `DEMO100` for ₹100), and [Promotion.jsx](file:///Users/udit/Documents/demo/game_demo/src/components/pages/Promotion.jsx) showing subordinates tables, commissions logs, and referral codes.
- **Wallet & Account**: Created [Wallet.jsx](file:///Users/udit/Documents/demo/game_demo/src/components/pages/Wallet.jsx) displaying sub-wallet balances and [Account.jsx](file:///Users/udit/Documents/demo/game_demo/src/components/pages/Account.jsx) containing VIP ranks, and stats records.
- **Sub-pages (Deposit / Withdraw)**: Created [Deposit.jsx](file:///Users/udit/Documents/demo/game_demo/src/components/pages/Deposit.jsx) showing payment channel selectors and an interactive payment QR scanner modal, and [Withdraw.jsx](file:///Users/udit/Documents/demo/game_demo/src/components/pages/Withdraw.jsx) showing limits checkers and bank coordinates.
- **Win Go color game**: Created [WinGo.jsx](file:///Users/udit/Documents/demo/game_demo/src/components/games/WinGo.jsx) with custom grids (0-9 numbers, red/green/violet selection drawers), and a SVG trend chart overlay.
- **Dice & Rows Lottery**: Built mock games [K3Lottery.jsx](file:///Users/udit/Documents/demo/game_demo/src/components/games/K3Lottery.jsx) and [Lotre5D.jsx](file:///Users/udit/Documents/demo/game_demo/src/components/games/Lotre5D.jsx).

---

## 📷 Verification Screenshots

### Main Lobby / Dashboard View
![Lobby Dashboard](/Users/udit/.gemini/antigravity-ide/brain/9258c718-e1a5-400f-8282-ccbe8f9e13cf/screenshot_replica_dashboard_1782564006531.png)

### Win Go Main Game Board & History Tracker
![Win Go Board](/Users/udit/.gemini/antigravity-ide/brain/9258c718-e1a5-400f-8282-ccbe8f9e13cf/my_history_settlement_reloaded_1782564346621.png)

---

## 🚀 How to Run Locally

1. Navigate to the project root:
   ```bash
   cd /Users/udit/Documents/demo/game_demo
   ```
2. Start the local server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173/` in your browser.
