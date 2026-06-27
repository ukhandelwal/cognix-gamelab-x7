import React from 'react';
import { AppProvider } from './context/AppContext';
import AppShell from './components/layout/AppShell';
import './App.css';

function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

export default App;
