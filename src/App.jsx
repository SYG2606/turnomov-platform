// src/App.jsx
import React from 'react';
import { TenantProvider, useTenant } from './saas/TenantProvider';

// Importamos los módulos (que por ahora son archivos grandes, pero separados)
import LandingPage from './landing/LandingPage';
import TurnosApp from './turnos/TurnosApp';

// Un componente interno para manejar el ruteo básico
const MainRouter = () => {
  const { isLanding } = useTenant();

  if (isLanding) {
    return <LandingPage />;
  }

  return <TurnosApp />;
};

export default function App() {
  return (
    <TenantProvider>
       <MainRouter />
    </TenantProvider>
  );
}