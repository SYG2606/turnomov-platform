import React, { useState, useEffect, createContext, useContext } from 'react';

const TenantContext = createContext(null);

export const useTenant = () => useContext(TenantContext);

export const TenantProvider = ({ children }) => {
  const [tenant, setTenant] = useState(null);
  const [isLanding, setIsLanding] = useState(true);
  // 1. AGREGAMOS ESTADO DE CARGA (CRUCIAL)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hostname = window.location.hostname;
    console.log("📍 Detectando entorno:", hostname);

    // 2. DEFINICIÓN EXACTA DE QUIÉN ES LANDING
    // Agrega aquí todos los dominios que deben mostrar la portada
    const LANDING_DOMAINS = [
      'turnomov.com.ar',
      'www.turnomov.com.ar',
      'localhost',       // Para pruebas locales en la raíz
      '127.0.0.1'
    ];

    // Lógica de detección
    if (LANDING_DOMAINS.includes(hostname)) {
      // ES LANDING PAGE
      setIsLanding(true);
      setTenant(null);
    } else {
      // ES UN SUBDOMINIO (APPS DE CLIENTES)
      // Ej: "bicper.turnomov.com.ar" -> toma "bicper"
      const parts = hostname.split('.');
      const subdomain = parts[0];

      setIsLanding(false);
      
      // Aquí asignamos el ID del taller basado en el subdominio
      setTenant({
        id: subdomain,
        name: subdomain.charAt(0).toUpperCase() + subdomain.slice(1), // Capitaliza (bicper -> Bicper)
      });
    }

    // 3. FINALIZAMOS LA CARGA
    setLoading(false);

  }, []);

  const value = { isLanding, tenant, loading };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};