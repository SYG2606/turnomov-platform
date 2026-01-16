// src/saas/TenantProvider.jsx
import React, { useState, useEffect, createContext, useContext } from 'react';

const TenantContext = createContext(null);

export const useTenant = () => useContext(TenantContext);

export const TenantProvider = ({ children }) => {
  const [tenant, setTenant] = useState(null);
  const [isLanding, setIsLanding] = useState(true);

  useEffect(() => {
    // Lógica de detección de subdominio
    const hostname = window.location.hostname; 
    const parts = hostname.split('.');
    const subdomain = parts[0];
    
    // Lista blanca de Landing Pages
    const landingIdentifiers = ['www', 'localhost', '127', 'turnos-bikes-app', 'turnosbikes', 'turnomov'];

    const isLandingPage = landingIdentifiers.includes(subdomain);
    setIsLanding(isLandingPage);

    if (isLandingPage) {
      setTenant(null);
    } else {
      setTenant({
        id: subdomain, // El ID del taller es el subdominio
        name: subdomain.charAt(0).toUpperCase() + subdomain.slice(1),
      });
    }
  }, []);

  const value = { isLanding, tenant };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};