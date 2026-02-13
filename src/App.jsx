import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTenant } from './saas/TenantProvider';
import { Loader2 } from 'lucide-react';

// --- TUS COMPONENTES EXISTENTES ---
import LandingPage from './landing/LandingPage';
import TurnosApp from './turnos/TurnosApp';
import HelpPage from './pages/HelpPage'; // Tu Ayuda existente
import ChatBot from './components/ChatBot';

// --- NUEVO COMPONENTE SEO ---
import SistemaDeTurnos from './pages/SistemaDeTurnos'; 

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

  // Si estamos en el dominio principal (turnomov.com.ar), cargamos la Landing
  if (isLanding) {
    return <LandingPage />;
  }

  // Si estamos en un subdominio (negocio.turnomov.com.ar), cargamos la App de turnos
  return <TurnosApp />;
};

export default function App() {
  return (
    <BrowserRouter>
      {/* El ChatBot suele ir solo en la Landing, podrías condicionarlo si quieres */}
      <ChatBot /> 
      
      <Routes>
        {/* PÁGINAS ESTRATÉGICAS (Visibles en el dominio principal) */}
        <Route path="/ayuda" element={<HelpPage />} />
        <Route path="/sistema-de-turnos" element={<SistemaDeTurnos />} />

        {/* LÓGICA DE TENANT (Landing vs App de Turnos) */}
        <Route path="/" element={<HomeRoute />} />
        
        {/* CATCH-ALL: Si no existe la ruta, manejamos con HomeRoute o 404 */}
        <Route path="*" element={<HomeRoute />} />
      </Routes>
    </BrowserRouter>
  );
}