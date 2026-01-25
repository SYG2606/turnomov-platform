import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// 1. IMPORTA TU PROVIDER
import { TenantProvider } from './saas/TenantProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
  
    
    <TenantProvider>
      <App />
    </TenantProvider>
  
);