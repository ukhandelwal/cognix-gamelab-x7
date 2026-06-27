# Implementation Plan - Cognix Lottery Portal Clone (React + Vite)

We will develop a pixel-perfect, premium, and responsive clone of the Cognix Lottery and Color Prediction game portal. 
As selected, the application will be built using the modern **React + Vite** tech stack. It will adopt a mobile-first design, showing as a centered container on desktop viewports and occupying full screen on mobile devices.

---

## Technical Stack & Configuration

1. **Framework**: React (using React Hooks, functional components)
2. **Build Tool**: Vite
3. **Styling**: Vanilla CSS (CSS variables, rich dark-theme gradients, glassmorphism)
4. **Icons**: Lucide React
5. **State Management**: React Context + custom localStorage hook for state persistence (credentials, wallet balance, transaction logs, bet history).

---

## User Review Required

Please review the proposed design changes:
1. **Directory Structure**: We will initialize Vite in the current directory and clean up default assets to create a structured React layout.
2. **Local Storage Database**: All balances (deposit history, withdrawal history, bet outcomes) will be simulated client-side via a mock backend system integrated into a React Context (`AppContext.jsx`).
3. **Game Loop**: A custom hook/service (`useGameLoop`) will run in the background to handle 30s/1m/3m/5m/10m lottery countdowns, automatically settle bets, add win/loss results to player history, and dynamically redraw the SVG trend charts.

---

## Proposed Changes

### [Core Files]

#### [NEW] [Vite App Scaffold](file:///Users/udit/Documents/demo/game_demo)
We will run `npx -y create-vite@latest ./ --template react --overwrite --no-interactive` to scaffold the React application.

#### [NEW] [src/context/AppContext.jsx](file:///Users/udit/Documents/demo/game_demo/src/context/AppContext.jsx)
- Centralized state provider:
  - User details (UID, phone number, login status).
  - Wallet balances (total balance, deposit total, withdrawal total).
  - Transaction logs (bets, deposits, withdrawals).
  - Current active tab/route.
- Helper functions to execute betting, simulate deposits, and process withdrawals.

#### [NEW] [src/components/layout/AppShell.jsx](file:///Users/udit/Documents/demo/game_demo/src/components/layout/AppShell.jsx)
- Responsive layout container (`.mobile-viewport`).
- Persistent bottom navigation bar (Home, Activity, Promotion, Wallet, Account).
- Dynamic modal/toast overlay controller.

#### [NEW] [src/components/games/WinGo.jsx](file:///Users/udit/Documents/demo/game_demo/src/components/games/WinGo.jsx)
- Game interface showing:
  - Mode selection tabs (30s, 1m, 3m, 5m, 10m).
  - Countdown timer + Period ID.
  - Betting action panel (Green/Violet/Red buttons, 0-9 number grid, Big/Small choices).
  - Bet placement confirmation dialog.
  - Trend charts (custom SVG rendering that plots past numbers and draws connecting line path).
  - Detailed histories (Game History, Chart view, My History).

#### [NEW] [src/components/pages/](file:///Users/udit/Documents/demo/game_demo/src/components/pages/)
- [NEW] `Login.jsx` / `Register.jsx`: Auth forms with mobile tabs and slider puzzle captcha mockup.
- [NEW] `Home.jsx`: Banner image carousel, winner marquee, game category tabs, and game links.
- [NEW] `Activity.jsx`: Check-in panel, gift code redeemer, and promotional boxes.
- [NEW] `Promotion.jsx`: Affiliate metrics, direct/team subordinates stats, referral link copier.
- [NEW] `Wallet.jsx`: Balance cards, quick links (Deposit, Withdraw, History), game wallet breakdown.
- [NEW] `Account.jsx`: User details, profile banner, setting buttons, language details.
- [NEW] `Deposit.jsx` / `Withdraw.jsx`: Simulator screens for payment routes (UPI, USDT), amount inputs, bank cards details.

#### [NEW] [src/App.css](file:///Users/udit/Documents/demo/game_demo/src/App.css)
- Premium dark-theme variable system.
- Colors:
  - Background: `#1e2531` (shell) / `#141a23` (page backgrounds).
  - Cards: `#252d3a`.
  - Gold gradient: `linear-gradient(90deg, #fad38a, #f3a83b)`.
  - Win Go hues: Green (`#13b367`), Violet (`#8a3ffc`), Red (`#e83d3d`).

---

## Verification Plan

### Automated Tests
- Build verification via `npm run build`.

### Manual Verification
- Launch local development server (`npm run dev`).
- Test all key flows:
  - Captcha slider matching.
  - Switch tabs on bottom nav.
  - Place a Win Go bet, watch timer count down, check balance settlement on zero, verify entry in "My History".
  - Verify trend lines plot correctly.
  - Mock deposit and withdrawal processes.
