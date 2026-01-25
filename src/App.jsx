// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTenant } from './saas/TenantProvider';
import { Loader2 } from 'lucide-react';

import LandingPage from './landing/LandingPage';
import TurnosApp from './turnos/TurnosApp';
import HelpPage from './pages/HelpPage';
import ChatBot from './components/ChatBot';

const HomeRoute = () => {
  const { isLanding, loading } = useTenant();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-orange-500">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="text-slate-400 text-sm animate-pulse">Conectando...</p>
      </div>
    );
  }

  if (isLanding) {
    return <LandingPage />;
  }

  return <TurnosApp />;
};

export default function App() {
  return (
    <BrowserRouter>
      <ChatBot />
      <Routes>
        <Route path="/ayuda" element={<HelpPage />} />
        <Route path="/" element={<HomeRoute />} />
        <Route path="*" element={<HomeRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
