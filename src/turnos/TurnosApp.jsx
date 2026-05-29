// src/turnos/TurnosApp.jsx
import React, { useState, useEffect, useMemo } from 'react';
import bcrypt from 'bcryptjs'; 


// 1. LIMPIEZA: Quitamos initializeApp de aquí
import { signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut } from 'firebase/auth'; // Quitamos getAuth
import { collection, addDoc, query, onSnapshot, doc, updateDoc, deleteDoc, runTransaction, where, getDocs, setDoc } from 'firebase/firestore'; // Quitamos getFirestore

import { useTenant } from '../saas/TenantProvider'; 

// 2. CONEXIÓN CENTRAL: Esto es lo único que necesitamos
import { db, auth } from '../firebase/config';

// SECCIÓN DE ICONOS
import { 
  Calendar, Clock, Wrench, User, LogOut, CheckCircle, XCircle, AlertCircle, 
  Bike, ClipboardList, Plus, Loader2, MessageCircle, Shield, Users, Lock, 
  Sun, Moon, Search, Settings, BarChart3, Printer, FileText, Timer, Store, 
  RotateCcw, Eye, EyeOff, Edit, History, Trash2, Image as ImageIcon, Upload, 
  ArrowRight, Filter, Layout, List, CalendarX, Mail, FileClock, Save,
  Smartphone, Cpu, Laptop, Scissors, Sparkles, Gem, Dumbbell, Trophy, Activity, 
  Stethoscope, Heart, Pill, Car, Key, PawPrint, Bone 
} from 'lucide-react';

// --- 3. BORRAR EL BLOQUE DE CONFIGURACIÓN ---
// (Aquí borré const firebaseConfig = { ... } y el bloque try/catch de inicialización)
// Ya no son necesarios porque db y auth vienen importados arriba.

// --- 2. CONFIGURACIÓN MAESTRA (ESTO SE QUEDA AFUERA) ---
const INDUSTRIES = {
  bikes: {
    label: "Taller de Bicicletas",
    itemLabel: "Modelo de Bici",
    staffLabel: "Mecánico",
    placeLabel: "Taller",
    actionLabel: "Reparar",
    defaultServices: ["Service 30 dias postcompra", "Mantenimiento General", "Revisión 7 dias", "Cambio de partes"],
    icons: { item: 'Bike', staff: 'Wrench' },
    statusLabels: { pending: 'En Espera', received: 'En Taller', process: 'En Reparación', ready: 'Listo para Retirar',delivered: 'Entregado' },
    disclaimer: "AUTORIZO LA REPARACIÓN. EL TALLER NO SE RESPONSABILIZA POR EFECTOS PERSONALES DEJADOS EN LA UNIDAD."
  },
  tech: {
    label: "Servicio Técnico",
    itemLabel: "Dispositivo",
    staffLabel: "Técnico",
    placeLabel: "Laboratorio",
    actionLabel: "Reparar",
    defaultServices: ["Diagnóstico", "Cambio Pantalla", "Formateo", "Limpieza Hardware"],
    icons: { item: 'Smartphone', staff: 'Cpu' },
    statusLabels: { pending: 'En Espera', received: 'Ingresado', process: 'En Diagnóstico/Rep', ready: 'Listo para Retirar' },
    disclaimer: "AUTORIZO EL DIAGNÓSTICO Y REPARACIÓN. LA EMPRESA NO SE RESPONSABILIZA POR LA PÉRDIDA DE DATOS NO RESGUARDADOS."
  },
  beauty: {
    label: "Estética y Belleza",
    itemLabel: "Cliente",
    staffLabel: "Estilista",
    placeLabel: "Salón",
    actionLabel: "Atender",
    defaultServices: ["Corte", "Color", "Manicura", "Tratamiento Facial"],
    icons: { item: 'Sparkles', staff: 'Scissors' },
    statusLabels: { pending: 'Reservado', received: 'En Sala de Espera', process: 'Siendo Atendido', ready: 'Finalizado' },
    disclaimer: "EL CLIENTE ACEPTA LOS PROCEDIMIENTOS ESTÉTICOS A REALIZAR Y SUS POSIBLES CUIDADOS POSTERIORES."
  },
  sports: {
    label: "Complejo Deportivo",
    itemLabel: "Cancha",
    staffLabel: "Admin",
    placeLabel: "Club",
    actionLabel: "Jugar",
    defaultServices: ["Cancha 60min", "Cancha 90min", "Clase Grupal"],
    icons: { item: 'Trophy', staff: 'User' },
    statusLabels: { pending: 'Reservado', received: 'Check-in Realizado', process: 'Jugando', ready: 'Turno Finalizado' },
    disclaimer: "EL USUARIO SE COMPROMETE A CUIDAR LAS INSTALACIONES. EL CLUB NO SE RESPONSABILIZA POR LESIONES DEPORTIVAS."
  },
  cars: {
    label: "Taller Automotriz",
    itemLabel: "Vehículo",
    staffLabel: "Mecánico",
    placeLabel: "Taller",
    actionLabel: "Reparar",
    defaultServices: ["Cambio de Aceite", "Alineación y Balanceo", "Frenos", "Diagnóstico Computarizado"],
    icons: { item: 'Car', staff: 'Wrench' },
    statusLabels: { pending: 'Turno Solicitado', received: 'Vehículo Ingresado', process: 'En Reparación', ready: 'Listo para Retirar' },
    disclaimer: "AUTORIZO EL TRABAJO MECÁNICO. EL TALLER NO SE RESPONSABILIZA POR OBJETOS DE VALOR DEJADOS EN EL VEHÍCULO."
  },
  pets: {
    label: "Clínica Veterinaria",
    itemLabel: "Mascota",
    staffLabel: "Veterinario",
    placeLabel: "Clínica",
    actionLabel: "Atender",
    defaultServices: ["Consulta General", "Vacunación", "Desparasitación", "Control"],
    icons: { item: 'PawPrint', staff: 'Stethoscope' },
    statusLabels: { pending: 'Cita Agendada', received: 'En Sala de Espera', process: 'En Consulta', ready: 'Alta Médica' },
    disclaimer: "EL DUEÑO AUTORIZA LOS PROCEDIMIENTOS VETERINARIOS NECESARIOS PARA EL BIENESTAR DE LA MASCOTA."
  },
  health: {
    label: "Consultorio Médico",
    itemLabel: "Paciente",
    staffLabel: "Doctor",
    placeLabel: "Consultorio",
    actionLabel: "Atender",
    defaultServices: ["Consulta", "Control", "Certificado", "Aptitud Física"],
    icons: { item: 'Heart', staff: 'Stethoscope' },
    statusLabels: { pending: 'Turno Confirmado', received: 'En Recepción', process: 'En Consultorio', ready: 'Atendido' },
    disclaimer: "LA INFORMACIÓN MÉDICA ES CONFIDENCIAL Y ESTÁ PROTEGIDA POR EL SECRETO PROFESIONAL."
  }
};

const IconMap = {
  Bike, Wrench, Smartphone, Cpu, Scissors, Sparkles, Dumbbell, Trophy, 
  Stethoscope, Heart, Car, Key, PawPrint, Bone 
};
const themeClasses = {
  light: {
    app: "bg-slate-100 text-slate-800",
    header: "bg-white border-b border-slate-200",
    card: "bg-white border border-slate-200 shadow-sm"
  },
  dark: {
    app: "bg-slate-950 text-white",
    header: "bg-slate-900 border-b border-slate-800",
    card: "bg-slate-800 border border-slate-700 shadow-xl"
  }
};


const GENERIC_PASS = "Turno2026";
const formatDateForQuery = (d) => d.toISOString().split('T')[0];
const formatDisplayDate = (d) => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return { dayName: days[d.getDay()], date: `${d.getDate()}/${d.getMonth()+1}` };
};

// Componentes UI simples (fuera para no recrearlos en cada render)
const Button = ({ children, variant='primary', theme, className='', ...props }) => {

  const styles = {

    primary:
      theme === "light"
        ? "bg-blue-600 hover:bg-blue-700 text-white"
        : "bg-orange-600 hover:bg-orange-700 text-white",

    secondary:
      theme === "light"
        ? "bg-white border border-slate-300 text-slate-800 hover:bg-slate-100"
        : "bg-slate-800 border border-slate-700 text-white hover:bg-slate-700",

    ghost:
      theme === "light"
        ? "text-slate-600 hover:bg-slate-100"
        : "text-slate-400 hover:bg-slate-800"

  };

  return (
    <button
      {...props}
      className={`
        px-4 py-2 rounded-lg font-medium
        transition-all duration-200
        ${styles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );

};

const Card = ({ children, className = '', onClick, theme = "dark" }) => {

  const base =
    theme === "light"
      ? "bg-white border border-slate-200 shadow-sm text-slate-800"
      : "bg-slate-800 border border-slate-700 shadow-xl text-white";

  return (
    <div
      onClick={onClick}
      className={`
        ${base}
        rounded-2xl p-6
        transition-all duration-200
        ${onClick ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
const Badge = ({ status, labels }) => {
  const styles = {
    'pendiente': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    'recibido': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'en-proceso': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'listo': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'retirado': 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  };

  const defaultLabels = { 'pendiente': 'Pendiente', 'recibido': 'Recibido', 'en-proceso': 'En Proceso', 'listo': 'Listo' };
  const currentLabels = labels || defaultLabels;
  const statusKeyMap = { 'pendiente': 'pending', 'recibido': 'received', 'en-proceso': 'process', 'listo': 'ready', 'retirado': 'delivered' };
  const displayText = currentLabels[statusKeyMap[status]] || status;

  return <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles['pendiente']}`}>{displayText}</span>;
};

// --- COMPONENTE MULTISELECT (AHORA ESTÁ BIEN UBICADO AFUERA) ---
const MultiSelectFilter = ({ label, options, selectedValues, onToggle, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative space-y-1">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-transparent border-b p-1 text-sm text-left flex justify-between items-center transition-colors ${
          theme === 'light' ? 'border-slate-200 text-slate-800' : 'border-slate-700 text-white'
        }`}
      >
        <span className="truncate whitespace-nowrap">
          {selectedValues.length === 0 ? "Todos" : `${selectedValues.length} seleccionados`}
        </span>
        <Filter size={12} className={selectedValues.length > 0 ? "text-blue-500" : "opacity-40"} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className={`absolute z-50 mt-1 w-64 max-h-60 overflow-y-auto rounded-xl border shadow-2xl p-2 animate-in fade-in zoom-in duration-150 ${
            theme === 'light' ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900 border-slate-700 shadow-2xl'
          }`}>
            {options.map((opt) => (
              <label key={opt.id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-800'
              }`}>
                <input
                  type="checkbox"
                  checked={selectedValues.includes(opt.id)}
                  onChange={() => onToggle(opt.id)}
                  className="w-4 h-4 rounded border-slate-500 text-blue-600"
                />
                <span className={`text-sm ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
const capitalizeName = (str = '') =>
  str
    .toLowerCase()
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
//--------------------------------------------------
const getWeekDays = () => {
  const start = new Date();
  start.setDate(start.getDate() - start.getDay() + 1); // lunes

  return Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

// --- 3. APP PRINCIPAL (EL COMPONENTE) ---
// Cambiamos el nombre a TurnosApp para no confundir con el wrapper
export default function TurnosApp() { 
  // --- AQUI DENTRO VA EL HOOK (ESTA ERA LA FALLA) ---
  const { tenant } = useTenant();
  
  // Variables dependientes del tenant
  const appId = tenant?.id;
  const sessionKey = appId ? `bikes_app_user_${appId}` : null;

  // Estados
  const [user, setUser] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
// ----------------------------
// TEMA VISUAL (CLARO / OSCURO)
// ----------------------------
const [theme, setTheme] = useState(() => {
  const saved = localStorage.getItem("turnos_theme");
  return saved || "light";
});
//---------------------------------------------------
const [filters, setFilters] = useState({
  startDate: '',
  endDate: '',
  services: [], // Ahora es array
  statuses: [], // Nuevo y array
  mechanics: [], // Ahora es array
  searchTerm: ''
});

// Estado para controlar qué dropdown está abierto
const [openDropdown, setOpenDropdown] = useState(null);
const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

useEffect(() => {
  localStorage.setItem("turnos_theme", theme);
}, [theme]);

const toggleTheme = () => {
  setTheme(prev => prev === "light" ? "dark" : "light");
};

  // Configuración Principal
  const [shopConfig, setShopConfig] = useState({ 
    workDays: [1, 3, 5], 
    shopName: 'Cargando...', 
    shopAddress: '...', 
    shopPhone: '', 
    maxPerDay: 4, 
    logoUrl: '', 
    lastOrderNumber: 1000,
    blockedDates: [],
    implementationDate: '', 
    scheduleMode: 'blocks',
    slotDuration: 60,
    openHour: 9, 
    closeHour: 18, 
    industry: 'bikes' 
  });

  // Variables dinámicas (Seguras con fallback)
  const activeIndustry = INDUSTRIES[shopConfig.industry] || INDUSTRIES.bikes;
  const availableServices = shopConfig.customServices || activeIndustry.defaultServices;
  const ItemIcon = IconMap[activeIndustry.icons.item] || Bike;
  const StaffIcon = IconMap[activeIndustry.icons.staff] || Wrench;
    useEffect(() => {
  const newIndustry = INDUSTRIES[shopConfig.industry] || INDUSTRIES.bikes;
  setServiceType(newIndustry.defaultServices[0]);
}, [shopConfig.industry]);


  const [configSuccess, setConfigSuccess] = useState(false);
  const [dateToBlock, setDateToBlock] = useState('');

  // Nav & Auth
  const [view, setView] = useState('login'); 
  const [subView, setSubView] = useState('dashboard'); 
  const [dashboardMode, setDashboardMode] = useState('list');
  const [clientsViewMode, setClientsViewMode] = useState('cards');
  const [isStaffLogin, setIsStaffLogin] = useState(false);
  const [loginStep, setLoginStep] = useState(1);
  const [loginDni, setLoginDni] = useState('');
  const [loginPassword, setLoginPassword] = useState(''); 
  const [loginError, setLoginError] = useState('');
  const [loginForm, setLoginForm] = useState({ name: '', phone: '', bikeModel: '', email: '' });
  const [showPassword, setShowPassword] = useState(false);
  
  // Force Change Password
  const [tempStaffId, setTempStaffId] = useState(null);
  const [newPasswordForm, setNewPasswordForm] = useState({ new: '', confirm: '' });

  // Forms
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeBlock, setSelectedTimeBlock] = useState(null);
  const [apptNotes, setApptNotes] = useState('');
  const [clientBikeModel, setClientBikeModel] = useState('');
  const [serviceType, setServiceType] = useState(availableServices[0]);
  
  // Admin Appt Form State
  const [adminApptStep, setAdminApptStep] = useState(1);
  const [adminDniSearch, setAdminDniSearch] = useState('');
  const [isNewClient, setIsNewClient] = useState(false);
  const [adminFormData, setAdminFormData] = useState({ 
    name: '', bikeModel: '', phone: '', date: '', 
    serviceType: availableServices[0], 
    notes: '' 
  });
  const [showAdminApptModal, setShowAdminApptModal] = useState(false);
  
  // Modals
  const [editingClient, setEditingClient] = useState(null); 
  const [clientHistoryModal, setClientHistoryModal] = useState(null); 
  const [receptionModal, setReceptionModal] = useState(null); 
  const [confirmModal, setConfirmModal] = useState(null);
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [selectedApptModal, setSelectedApptModal] = useState(null);

  // Filters & Stats
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilterStart, setDateFilterStart] = useState('');
  const [statsPeriod, setStatsPeriod] = useState('month'); 

  // Staff Form
  const [newMechDni, setNewMechDni] = useState('');
  const [newMechName, setNewMechName] = useState('');
  const [newMechPassword, setNewMechPassword] = useState(GENERIC_PASS);
  const [newMechIsAdmin, setNewMechIsAdmin] = useState(false);

 
//
const timeoutsRef = React.useRef([]);

const safeTimeout = (fn, delay) => {
  const id = setTimeout(fn, delay);
  timeoutsRef.current.push(id);
};

useEffect(() => {
  return () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };
}, []);

//
  // Init Auth
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth Error", err);
        try {
          await signInAnonymously(auth);
        } catch (e) {
          if (isMounted) {
            setAuthError(`No se pudo conectar con la base de datos. (${err.code || e.code})`);
            setLoading(false);
          }
        }
      }
    };

    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!isMounted) return;

      setUser(u);

      if (!sessionKey) {
        // Aún no tenemos el tenant ID listo, seguimos cargando
        return;
      }

      if (u) {
        const savedUser = localStorage.getItem(sessionKey);
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed?.dni) {
            setAppUser(parsed);
            setView(parsed.role === 'mechanic'
              ? 'mechanic-dashboard'
              : 'client-dashboard'
            );
            if (parsed.role === 'client') {
              setClientBikeModel(parsed.bikeModel || '');
            }
          }
        }
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [sessionKey]);

useEffect(() => {
  if (!user || !tenant || !appId) return;

  let isMounted = true;
  const basePath = ['artifacts', appId, 'public', 'data'];

  const unsub = onSnapshot(
    doc(db, ...basePath, 'config', 'main'),
    snap => {
      if (!isMounted) return;
      if (snap.exists()) {
        setShopConfig(p => ({ ...p, ...snap.data() }));
      }
    },
    err => {
      console.warn('Config snapshot:', err.code);
    }
  );

  return () => {
    isMounted = false;
    unsub();
  };
}, [user, tenant, appId]);


useEffect(() => {
  if (!user || !tenant || !appId) return;

  let isMounted = true;

  const colTurnos = collection(
    db,
    'artifacts',
    appId,
    'public',
    'data',
    'turnos'
  );

  const unsub = onSnapshot(
    colTurnos,
    snap => {
      if (!isMounted) return;
      setAppointments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    },
    err => {
      if (err.code === 'permission-denied') {
        console.warn('Sin permisos para turnos');
      }
    }
  );

  return () => {
    isMounted = false;
    unsub();
  };
}, [user, tenant, appId]);

useEffect(() => {
  if (!user || !tenant || !appId) return;

  let isMounted = true;

  const colMechanics = collection(
    db,
    'artifacts',
    appId,
    'public',
    'data',
    'mechanics'
  );

  const unsub = onSnapshot(
    colMechanics,
    snap => {
      if (!isMounted) return;
      setMechanics(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    },
    err => {
      console.warn('Mechanics snapshot:', err.code);
    }
  );

  return () => {
    isMounted = false;
    unsub();
  };
}, [user, tenant, appId]);


// --- AGREGAR ESTO JUNTO A LOS OTROS useEffect ---
useEffect(() => {
  if (!user || !tenant || !appId) return;

  let isMounted = true;

  const colClients = collection(
    db,
    'artifacts',
    appId,
    'public',
    'data',
    'clients'
  );

  const unsub = onSnapshot(
    colClients,
    snap => {
      if (!isMounted) return;
      // Esto llenará el estado que usas en el subView === 'clients'
      setClients(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    },
    err => {
      console.warn('Error cargando clientes:', err.code);
    }
  );

  return () => {
    isMounted = false;
    unsub();
  };
}, [user, tenant, appId]);

// Sustituye tu bloque actual por esta versión optimizada y segura
const filteredAppts = useMemo(() => {
  if (!appointments || appointments.length === 0) return [];

  const term = filters.searchTerm?.toLowerCase().trim() || '';

  return appointments
    .filter((appt) => {
      // 1. Búsqueda Global (ID, Cliente, DNI, Modelo)
      const matchesSearch = !term || [
        appt.orderId?.toString(),
        appt.clientName,
        appt.clientDni,
        appt.bikeModel
      ].some(field => field?.toLowerCase().includes(term));

      if (!matchesSearch) return false;

      // 2. MULTISELECCIÓN: Estado (Si el array tiene algo, comparamos con .includes)
      // Nota: filters.statuses debe ser un array ahora
      if (filters.statuses?.length > 0 && !filters.statuses.includes(appt.status)) {
        return false;
      }

      // 3. MULTISELECCIÓN: Servicio
      if (filters.services?.length > 0 && !filters.services.includes(appt.serviceType)) {
        return false;
      }

      // 4. MULTISELECCIÓN: Responsable (Mecánico)
      if (filters.mechanics?.length > 0 && !filters.mechanics.includes(appt.mechanicId)) {
        return false;
      }

      // 5. Rango de Fechas
      if (filters.startDate || filters.endDate) {
        const apptTime = new Date(appt.date).getTime();
        if (filters.startDate) {
          const start = new Date(`${filters.startDate}T00:00:00`).getTime();
          if (apptTime < start) return false;
        }
        if (filters.endDate) {
          const end = new Date(`${filters.endDate}T23:59:59`).getTime();
          if (apptTime > end) return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      const timeA = new Date(a.date).getTime() || 0;
      const timeB = new Date(b.date).getTime() || 0;
      return timeB - timeA; // Más recientes arriba
    });
}, [appointments, filters]);
// 2. Función de Impresión Profesional (SaaS Ready)
const printAdvancedReport = () => {
  const win = window.open('', '_blank');
  
  // Estilos base para reporte A4
  const styles = `
    <style>
      @media print { @page { size: landscape; margin: 1cm; } }
      body { font-family: 'Segoe UI', Tahoma, sans-serif; color: #334155; font-size: 12px; }
      .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #f8fafc; text-align: left; padding: 12px; border: 1px solid #e2e8f0; font-size: 10px; text-transform: uppercase; }
      td { padding: 10px; border: 1px solid #e2e8f0; }
      .badge { padding: 4px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; background: #f1f5f9; }
      .footer { margin-top: 20px; text-align: right; font-weight: bold; font-size: 14px; }
    </style>
  `;

  const content = `
    <html>
      <head>${styles}</head>
      <body>
        <div class="header">
          <div>
            <h1 style="margin:0; color:#1e293b;">${shopConfig.shopName}</h1>
            <p style="margin:2px 0;">Reporte de Turnos Filtrados</p>
          </div>
          <div style="text-align:right">
            <p>Generado: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
            <p>Registros: ${filteredAppts.length}</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Orden</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>DNI</th>
              <th>${activeIndustry.itemLabel}</th>
              <th>Servicio</th>
              <th>Estado</th>
              <th>Responsable</th>
            </tr>
          </thead>
          <tbody>
            ${filteredAppts.map(a => `
              <tr>
                <td>#${a.orderId}</td>
                <td>${new Date(a.date).toLocaleDateString()}</td>
                <td>${a.clientName}</td>
                <td>${a.clientDni}</td>
                <td>${a.bikeModel}</td>
                <td>${a.serviceType}</td>
                <td><span class="badge">${(activeIndustry.statusLabels[a.status] || a.status).toUpperCase()}</span></td>
                <td>${a.mechanicName || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">Total de servicios: ${filteredAppts.length}</div>
      </body>
    </html>
  `;

  win.document.write(content);
  win.document.close();
  win.print();
};


  


  const handleLogout = () => {
      setAppUser(null);
      localStorage.removeItem(sessionKey);
      setLoginDni(''); setLoginPassword(''); setLoginStep(1); setLoginError('');
      setView('login');
  };

  const saveConfig = async (newConfig = null) => {
      const configToSave = newConfig || shopConfig;
      try {
          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'config', 'main'), configToSave, { merge: true });
         setConfigSuccess(true);
        safeTimeout(() => setConfigSuccess(false), 3000);

      } catch (e) { alert("Error al guardar: " + e.message); }
  };

  const handleBlockDate = () => {
    if(!dateToBlock) return;
    const currentBlocked = shopConfig.blockedDates || [];
    if(!currentBlocked.includes(dateToBlock)){
        const updated = {...shopConfig, blockedDates: [...currentBlocked, dateToBlock].sort()};
        setShopConfig(updated);
        saveConfig(updated);
    }
    setDateToBlock('');
  };

  const handleUnblockDate = (dateToRemove) => {
      const updated = {...shopConfig, blockedDates: (shopConfig.blockedDates || []).filter(d => d !== dateToRemove)};
      setShopConfig(updated);
      saveConfig(updated);
  };

  const handleLogoUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 500 * 1024) { alert("Máximo 500KB."); return; }
      const reader = new FileReader();
      reader.onloadend = () => { setShopConfig(prev => ({ ...prev, logoUrl: reader.result })); };
      reader.readAsDataURL(file);
  };

  const generateOrderNumber = async () => {
      const ref = doc(db, 'artifacts', appId, 'public', 'data', 'config', 'main');
      try {
          return await runTransaction(db, async (t) => {
              const docSnap = await t.get(ref);
              const next = (docSnap.exists() ? (docSnap.data().lastOrderNumber || 1000) : 1000) + 1;
              t.set(ref, { lastOrderNumber: next }, { merge: true });
              return next;
          });
      } catch (e) { return Math.floor(Math.random()*9000)+1000; }
  };

  
const createClientAppointment = async () => {
  if (isSubmitting) return;
  if (!user || !appUser?.dni) return alert("Error: Sesión no válida o DNI faltante.");
  if (!selectedDate || !selectedTimeBlock) return alert("Por favor, selecciona fecha y hora.");

  setIsSubmitting(true);

  try {
    const dateStr = formatDateForQuery(selectedDate);
    const turnosRef = collection(db, 'artifacts', appId, 'public', 'data', 'turnos');

    // --- CAMBIO 1: VALIDACIÓN DE CUPO DIARIO (OVERBOOKING) ---
    const qDia = query(
      turnosRef, 
      where('dateString', '==', dateStr),
      where('status', '!=', 'cancelado') 
    );
    
    const snapDia = await getDocs(qDia);
    
    if (snapDia.size >= Number(shopConfig.maxPerDay)) {
      alert(`Cupo completo: Lo sentimos, ya no quedan lugares para el día ${dateStr}.`);
      setIsSubmitting(false);
      return;
    }

    // --- CAMBIO 2: VALIDACIÓN DE TURNOS POR CLIENTE (ABUSO) ---
    const clientDniStr = String(appUser.dni).trim();
    const qUser = query(
      turnosRef,
      where('clientDni', '==', clientDniStr),
      where('status', 'in', ['pendiente', 'recibido', 'en-proceso'])
    );
    const snapUser = await getDocs(qUser);

    if (snapUser.size >= 2) {
      alert("Límite de usuario: Ya tienes 2 turnos activos. Debes completar tus servicios actuales para pedir uno nuevo.");
      setIsSubmitting(false);
      return;
    }

    // --- LÓGICA DE REGISTRO ---
    const appointmentDate = new Date(selectedDate);
    if (shopConfig.scheduleMode === 'slots') {
      const [h, m] = selectedTimeBlock.split(':').map(Number);
      appointmentDate.setHours(h, m, 0, 0);
    } else {
      appointmentDate.setHours(selectedTimeBlock === 'morning' ? 9 : 18, 0, 0, 0);
    }

    const orderNum = await generateOrderNumber();

    await addDoc(turnosRef, {
      orderId: orderNum,
      clientId: user.uid,
      clientName: appUser.name,
      clientDni: clientDniStr,
      clientPhone: appUser.phone || '',
      bikeModel: clientBikeModel || appUser.bikeModel || 'No especificada',
      serviceType: serviceType,
      date: appointmentDate.toISOString(),
      dateString: dateStr,
      timeBlock: selectedTimeBlock,
      notes: apptNotes.trim(),
      status: 'pendiente',
      createdBy: 'client',
      createdAt: new Date().toISOString(),
      tenantId: appId // Aislamiento Multi-tenant
    });

    alert(`¡Turno #${orderNum} reservado correctamente!`);
    
    // Cleanup UI
    setSelectedDate(null);
    setSelectedTimeBlock(null);
    setApptNotes('');

  } catch (e) {
    console.error("Error crítico en reserva:", e);
    alert("Error de conexión con el servidor. Intente nuevamente.");
  } finally {
    setIsSubmitting(false);
  }
};
  const triggerResetPassword = async (id, name) => {
      if (!window.confirm(`¿Resetear clave de ${name} a "${GENERIC_PASS}"?`)) return;
      try {
          const hashedPassword = await bcrypt.hash(GENERIC_PASS, 10);
          await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'mechanics', id), {
              password: hashedPassword,
              forcePasswordChange: true
          });
          alert("Clave reseteada correctamente.");
      } catch (e) {
          alert("Error: " + e.message);
      }
  };
  
  const triggerRemoveMechanic = async (id, name) => {
      if (!window.confirm(`¿Seguro que quieres eliminar a ${name}? Esta acción no se puede deshacer.`)) return;
      try {
          await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'mechanics', id));
          alert("Usuario eliminado.");
      } catch (e) {
          alert("Error: " + e.message);
      }
  };

  const generateTimeSlots = () => {
    const slots = [];
    let currentTime = new Date();
    currentTime.setHours(shopConfig.openHour, 0, 0, 0);
    const endTime = new Date();
    endTime.setHours(shopConfig.closeHour, 0, 0, 0);    
    while (currentTime < endTime) {
      const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      slots.push(timeString);
      currentTime.setMinutes(currentTime.getMinutes() + shopConfig.slotDuration);
    }
    return slots;
  };

  const handleAdminDniSearch = async (e) => {
      e.preventDefault();
      if(!adminDniSearch) return;
      const foundClient = clients.find(c => c.dni === adminDniSearch);
      if (foundClient) {
          setIsNewClient(false);
          setAdminFormData(prev => ({ ...prev, name: foundClient.name, phone: foundClient.phone, bikeModel: foundClient.bikeModel || '' }));
      } else {
          setIsNewClient(true);
          setAdminFormData(prev => ({ ...prev, name: '', phone: '', bikeModel: '' }));
      }
      setAdminApptStep(2);
  };

  const createAdminAppointment = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!user) return alert("Error: Sin conexión a base de datos.");
    if (!adminFormData.date || !adminFormData.phone || !adminFormData.bikeModel) return alert("Faltan datos");
    
    setIsSubmitting(true);

try {

  let finalClientId = 'admin-created';

  if (isNewClient) {

    const normalizedName = capitalizeName(adminFormData.name);

    const clientDoc = await addDoc(
      collection(db, 'artifacts', appId, 'public', 'data', 'clients'),
      {
        dni: adminDniSearch.trim(),
        name: normalizedName,
        phone: adminFormData.phone.trim(),
        bikeModel: capitalizeName(adminFormData.bikeModel),
        createdAt: new Date().toISOString()
      }
    );

    finalClientId = clientDoc.id;

  } else {

    const existing = clients.find(c => c.dni === adminDniSearch);

    if (existing) finalClientId = existing.id;
  }

  const d = new Date(adminFormData.date);
  const orderNum = await generateOrderNumber();

  await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'turnos'), {
    orderId: orderNum,
    clientId: finalClientId,
    clientName: adminFormData.name,
    clientDni: adminDniSearch,
    clientPhone: adminFormData.phone,
    bikeModel: adminFormData.bikeModel,
    serviceType: adminFormData.serviceType,
    date: d.toISOString(),
    dateString: formatDateForQuery(d),
    notes: adminFormData.notes || 'Agendado por Staff',
    status: 'pendiente',
    createdBy: 'mechanic',
    createdAt: new Date().toISOString()
  });

  alert(`Turno #${orderNum} creado.`);
  setShowAdminApptModal(false);
  setAdminApptStep(1);
  setAdminDniSearch('');
  setAdminFormData({
    name: '',
    bikeModel: '',
    phone: '',
    date: '',
    serviceType: availableServices[0],
    notes: ''
  });

} catch (e) {
  alert("Error al crear: " + e.message);
} finally {
  setIsSubmitting(false);
}

  };

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginDni || !loginPassword) return setLoginError("Faltan datos");
    setLoading(true);
    
    if (mechanics.length === 0) {
        const hashedPassword = await bcrypt.hash(loginPassword, 10);
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'mechanics'), { 
            dni: loginDni, 
            name: 'Admin Inicial', 
            password: hashedPassword,
            isAdmin: true, 
            forcePasswordChange: false, 
            createdAt: new Date().toISOString() 
        });
        finalizeLogin({ name: 'Admin Inicial', dni: loginDni, role: 'mechanic', isAdmin: true });
        return;
    }

    const mech = mechanics.find(m => m.dni === loginDni);
    if (mech) {
        const isValid = await bcrypt.compare(loginPassword, mech.password);
        if (isValid) {
            if (mech.forcePasswordChange) {
                setTempStaffId(mech.id); 
                setAppUser({ name: mech.name, role: 'mechanic', isAdmin: !!mech.isAdmin }); 
                setView('force-change-password'); 
                setLoading(false);
                return;
            }
            finalizeLogin({ name: mech.name, dni: loginDni, role: 'mechanic', isAdmin: !!mech.isAdmin });
        } else {
            setLoginError("Credenciales inválidas");
            setLoading(false);
        }
    } else { 
        setLoginError("Credenciales inválidas"); 
        setLoading(false); 
    }
  };

  const handleChangePassword = async (e) => {
      e.preventDefault();
      if (newPasswordForm.new !== newPasswordForm.confirm) return alert("No coinciden");
      
      const hashedPassword = await bcrypt.hash(newPasswordForm.new, 10);
      
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'mechanics', tempStaffId), { 
          password: hashedPassword,
          forcePasswordChange: false 
      });
      alert("Clave actualizada."); finalizeLogin({ ...appUser, dni: loginDni });
  };

  const handleDniSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    const snap = await getDocs(query(collection(db, 'artifacts', appId, 'public', 'data', 'clients'), where('dni', '==', loginDni)));
    if (!snap.empty) finalizeLogin({ ...snap.docs[0].data(), role: 'client' });
    else { setLoginStep(2); setLoading(false); }
  };

  const handleRegisterSubmit = async (e) => {
      e.preventDefault(); setLoading(true);
      const normalizedName = capitalizeName(loginForm.name);

await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'clients'), {
  dni: loginDni,
  name: normalizedName,
  phone: loginForm.phone,
  bikeModel: loginForm.bikeModel,
  email: loginForm.email,
  createdAt: new Date().toISOString()
});

finalizeLogin({
  dni: loginDni,
  name: normalizedName,
  phone: loginForm.phone,
  bikeModel: loginForm.bikeModel,
  email: loginForm.email,
  role: 'client'
});

  };

  const finalizeLogin = (u) => {
      setAppUser(u); if(u.role === 'client') setClientBikeModel(u.bikeModel || '');
      localStorage.setItem(sessionKey, JSON.stringify(u));
      setView(u.role === 'mechanic' ? 'mechanic-dashboard' : 'client-dashboard');
      setLoading(false);
  };

  const updateStatus = async (id, newStatus, extra = {}) => {
      const data = { status: newStatus, ...extra };
      if (newStatus === 'recibido') { data.arrivedAt = new Date().toISOString(); data.receivedBy = appUser.name; }
      if (newStatus === 'en-proceso') { data.startedAt = new Date().toISOString(); data.mechanicName = appUser.name; data.mechanicId = appUser.dni; }
      if (newStatus === 'listo') data.finishedAt = new Date().toISOString();
      if (newStatus === 'retirado') data.deliveredAt = new Date().toISOString();

      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'turnos', id), data);
  };

  const handleReceptionConfirm = async (e) => {
      e.preventDefault();
      const { id, ...curr } = receptionModal.appt;
      const updates = { bikeModel: receptionModal.bikeModel, serviceType: receptionModal.serviceType, notes: receptionModal.notes };
      await updateStatus(id, 'recibido', updates);
      printServiceOrder({ ...curr, ...updates, id, orderId: receptionModal.appt.orderId, receivedBy: appUser.name });
      const msg = `Hola ${receptionModal.appt.clientName}! 👋\n\nTu bici *${receptionModal.bikeModel}* ingresó al taller *${shopConfig.shopName}*.\n\n📋 Orden: #${receptionModal.appt.orderId}\n🔧 Servicio: ${receptionModal.serviceType}\n\nTe avisaremos cuando esté lista!`;
      const url = `https://wa.me/${receptionModal.appt.clientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
      setReceptionModal(null);
  };

  const handleDeleteAppointment = async (id) => {
      if (!window.confirm("⚠️ ¿ESTÁS SEGURO?\n\nEsta acción eliminará el turno permanentemente.")) return;
      try {
          await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'turnos', id));
          alert("✅ Turno eliminado correctamente.");
      } catch (e) {
          console.error(e);
          alert("❌ Error al borrar: " + e.message);
      }
  };

  const openRescheduleModal = (appt, mode) => {
      if (mode === 'client') {
          const apptDate = new Date(appt.date);
          const now = new Date();
          const diffHours = (apptDate - now) / 36e5;
          if (diffHours < 48) {
              setConfirmModal({
                  title: 'No se puede reprogramar',
                  msg: 'Solo se permiten cambios con 48hs de anticipación. Por favor, contacta al taller.',
                  action: () => setConfirmModal(null)
              });
              return;
          }
      }
      setRescheduleModal({ appt, date: '', timeBlock: '' });
  };

  const handleRescheduleSubmit = async () => {
      if (!rescheduleModal.date || !rescheduleModal.timeBlock) return alert("Selecciona fecha y hora");
      const d = new Date(rescheduleModal.date);
      if (rescheduleModal.timeBlock === 'morning') d.setHours(9); else d.setHours(18);
      
      try {
          await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'turnos', rescheduleModal.appt.id), {
              date: d.toISOString(),
              dateString: formatDateForQuery(d),
              timeBlock: rescheduleModal.timeBlock
          });
          alert("Turno reprogramado correctamente.");
          setRescheduleModal(null);
      } catch (e) { alert("Error: " + e.message); }
  };

  const addMechanic = async (e) => {
      e.preventDefault();
      if(!user) return alert("Sin conexión. Recarga.");
      if(!newMechDni || !newMechName) return alert("Faltan datos");
      if (mechanics.some(m => m.dni === newMechDni)) return alert("DNI ya registrado");

      try {
        const hashedPassword = await bcrypt.hash(newMechPassword, 10);
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'mechanics'), {
            dni: newMechDni, 
            name: newMechName, 
            password: hashedPassword, 
            isAdmin: newMechIsAdmin, 
            forcePasswordChange: true, 
            createdAt: new Date().toISOString()
        });
        setNewMechDni(''); setNewMechName(''); setNewMechPassword(GENERIC_PASS); alert("Staff agregado correctamente.");
      } catch (err) { alert("Error al crear usuario: " + err.message); }
  };

  const handleUpdateClient = async (e) => {
      e.preventDefault();
      if (!editingClient) return;
      try {
          await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'clients', editingClient.id), {
              name: editingClient.name, phone: editingClient.phone, bikeModel: editingClient.bikeModel
          });
          setEditingClient(null);
          alert("Cliente actualizado correctamente.");
      } catch (err) { console.error(err); alert("Error al actualizar cliente."); }
  };

  const printServiceOrder = (appt) => {
    const logoHtml = shopConfig.logoUrl ? `<img src="${shopConfig.logoUrl}" style="max-height:60px;display:block;margin:0 auto 10px"/>` : '';
    const now = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    const win = window.open('','','width=800,height=900');
    
    const styles = `
* {
  box-sizing: border-box;
}

body {
  font-family: monospace;
  width: 76mm;
  margin: 0;
  padding: 4mm;
}

.container {
  width: 100%;
  border: 1px solid #000;
  padding: 4px;
  margin-bottom: 8px;
}

.header {
  text-align: center;
  border-bottom: 1px solid #000;
  padding-bottom: 4px;
  margin-bottom: 6px;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
  font-size: 11px;
}

.title {
  font-weight: bold;
  font-size: 12px;
  margin: 6px 0 3px 0;
  border-bottom: 1px dashed #999;
}

.big-id {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin: 6px 0;
  border: 2px solid #000;
  padding: 3px;
  letter-spacing: 2px;
}

.cut-line {
  border-top: 2px dashed #000;
  margin: 15px 0;
  position: relative;
  text-align: center;
  font-size: 10px;
  page-break-after: always;
}

.cut-line:after {
  content: '✂ CORTAR AQUÍ - COPIA CLIENTE';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 0 8px;
  font-size: 10px;
}

.footer {
  text-align: center;
  font-size: 10px;
  margin-top: 6px;
}

.disclaimer {
  font-size: 10px;
  line-height: 1.3;
  margin-top: 4px;
}

@media print {
  body {
    width: 76mm;
    margin: 0;
  }
}

@page {
  size: 80mm auto;
  margin: 0;
}

`;
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ORDEN:${appt.orderId}`;


    const content = `
      <html><head><title>Orden #${appt.orderId}</title><style>${styles}</style></head>
      <body>
        <div class="container">
            
            
            <div class="big-id">ORDEN #${appt.orderId}</div>
            
            <div class="title">DATOS CLIENTE</div>
            <div class="row"><span>Cliente:</span><strong>${appt.clientName}</strong></div>
            <div class="row"><span>DNI:</span><span>${appt.clientDni}</span></div>
            <div class="row"><span>Teléfono:</span><span>${appt.clientPhone}</span></div>
            
            <div class="title">DETALLE SERVICIO</div>
            <div class="row"><span>${activeIndustry.itemLabel}:</span><strong>${appt.bikeModel}</strong></div>
            <div class="row"><span>Servicio:</span><span>${appt.serviceType}</span></div>
            <div class="row"><span>Ingreso:</span><span>${now} ${time}</span></div>
            <div class="row"><span>Recibió:</span><span>${appt.receivedBy || 'Staff'}</span></div>
            
            <div class="title">NOTAS / ESTADO</div>
            <p style="font-size:11px; margin:0">${appt.notes || 'Sin observaciones.'}</p>
            
            <div class="disclaimer">
                ${activeIndustry.disclaimer}
            </div>
            <br/><br/>
            <div class="row" style="margin-top:20px"><span>________________</span><span>________________</span></div>
            <div class="row"><span>Firma Cliente</span><span>Firma ${activeIndustry.placeLabel}</span></div>
        </div>

        <div class="cut-line"></div>

        <div class="container" style="border-style: dashed;">
            <div class="header" style="border:none; padding-bottom:0">
                <div style="font-size:11px">Comprobante de Recepción</div>
                </div>
            <div class="header">
                ${logoHtml}
                <h2 style="margin:0">${shopConfig.shopName}</h2>
                <div class="row" style="justify-content:center"><span>📞 ${shopConfig.shopPhone}</span></div>
            
                <div style="font-size:10px"> 📍${shopConfig.shopAddress}</div>
            </div>
            </div>
            
            <div class="big-id" style="font-size:18px">#${appt.orderId}</div>
            
            <div class="row"><span>Fecha:</span><span>${now}</span></div>
            <div class="row"><span>Recibimos:</span><strong>${appt.bikeModel}</strong></div>
            <div class="row"><span>Atendido por:</span><span>${appt.receivedBy || 'Staff'}</span></div>
            <br/>
            <div style="text-align:center; font-weight:bold; font-size:12px">
                CONTACTO ${activeIndustry.placeLabel.toUpperCase()}
            
            <div style="text-align:center;margin-top:10px">
            <img src="${qrUrl}" style="width:120px"/>
            </div>

            <div class="footer">Conserve este talón para retirar.</div>
        </div>
        

      </body></html>
    `;
    
    win.document.write(content);
    win.document.close();
    safeTimeout(() => {
        win.print();
        safeTimeout(() => win.close(), 1000);

    }, 500);
  };

  const getStatsAppointments = () => {
      const now = new Date();
      return appointments.filter(a => {
          if (statsPeriod === 'all') return true;
          const apptDate = new Date(a.date);
          if (statsPeriod === 'month') return apptDate.getMonth() === now.getMonth() && apptDate.getFullYear() === now.getFullYear();
          if (statsPeriod === 'week') {
              const diffTime = Math.abs(now - apptDate);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays <= 7;
          }
          return true;
      });
  };

  const renderDateSelector = (onSelect, currentSelected) => {
  const dates = [];
  let d = new Date();

  // ===== FECHA DE ARRANQUE =====
  if (shopConfig.implementationDate) {
    const implDate = new Date(shopConfig.implementationDate + "T00:00:00");
    if (implDate > d) d = implDate;
    else d.setDate(d.getDate() + 1);
  } else {
    d.setDate(d.getDate() + 1);
  }

  // ===== BUSCAR PRÓXIMAS FECHAS CON CUPO REAL =====
  let loops = 0;

  while (dates.length < 6 && loops < 180) {
    const dateStr = formatDateForQuery(d);

    const isBlocked =
      shopConfig.blockedDates &&
      shopConfig.blockedDates.includes(dateStr);

    const count = appointments.filter(
      a => a.dateString === dateStr && a.status !== 'cancelado'
    ).length;

    const full = count >= shopConfig.maxPerDay;

    if (
      shopConfig.workDays.includes(d.getDay()) &&
      !isBlocked &&
      !full
    ) {
      dates.push({
        date: new Date(d),
        isBlocked,
        dateStr
      });
    }

    d.setDate(d.getDate() + 1);
    loops++;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
      {dates.map((item, i) => {
        const { date, dateStr } = item;

        const count = appointments.filter(
          a => a.dateString === dateStr && a.status !== 'cancelado'
        ).length;

        const full = count >= shopConfig.maxPerDay;
        const sel =
          currentSelected &&
          formatDateForQuery(currentSelected) === dateStr;

        const libres = shopConfig.maxPerDay - count;

        return (
          <button
            key={i}
            onClick={() => !full && onSelect(date)}
            disabled={full}
            className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden
              ${full
                ? 'bg-slate-800/50 border-slate-700 opacity-60 cursor-not-allowed'
                : sel
                ? 'bg-orange-600 border-orange-500 ring-2 ring-orange-500/30 shadow-lg'
                : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}
            `}
          >
            <div className="flex justify-between items-start mb-1">
              <span className={`text-sm font-bold ${full ? 'text-slate-500' : 'text-white'}`}>
                {formatDisplayDate(date).dayName}
              </span>

              {full
                ? <XCircle size={14} className="text-red-500"/>
                : <CheckCircle size={14} className="text-emerald-500"/>}
            </div>

            <div className="text-xs text-slate-300">
              {formatDisplayDate(date).date}
            </div>

            <div className={`mt-2 text-xs font-semibold ${full ? 'text-red-400' : 'text-emerald-400'}`}>
              {full ? 'Agotado' : `${libres} libres`}
            </div>
          </button>
        );
      })}
    </div>
  );
};

  const sendWhatsApp = (phone, name, bike, status) => {
    if (!phone) { alert("Sin teléfono."); return; }
    let msg = `Hola ${name}, mensaje de ${shopConfig.shopName} sobre tu ${bike}.`;
    if (status === 'listo') msg = `Hola ${name}! 👋 Tu *${bike}* ya está lista para retirar en ${shopConfig.shopName}. 🚲\nHorarios: Lun a Sabados en nuestros horarios.`;
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

 const printList = () => {
  const list = filteredAppts;

  const content = `
    <html>
      <head>
        <title>Reporte</title>
        <style>
          table { width:100%; border-collapse:collapse; font-family:sans-serif }
          th, td { border:1px solid #ddd; padding:8px }
          th { background-color:#f2f2f2 }
        </style>
      </head>
      <body>
        <h1>Reporte Turnos</h1>
        <table>
          <thead>
            <tr>
              <th>Orden</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Bici</th>
              <th>Servicio</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(a => `
              <tr>
                <td>${a.orderId ? '#' + a.orderId : a.id.slice(0,6)}</td>
                <td>${new Date(a.date).toLocaleDateString()}</td>
                <td>${a.clientName}</td>
                <td>${a.bikeModel}</td>
                <td>${a.serviceType}</td>
                <td>${a.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const win = window.open('', '', 'width=800,height=900');
if (!win) {
  alert('Habilita las ventanas emergentes para imprimir.');
  return;
}

try {
  win.document.open();
  win.document.write(content);
  win.document.close();
} catch (e) {
  console.warn('No se pudo escribir en la ventana de impresión', e);
  return;
}

safeTimeout(() => {
  if (!win || win.closed) return;

  try {
    win.focus();
    win.print();
  } catch (e) {
    console.warn('Error al imprimir', e);
  }
}, 600);
 }
 


  // --- RENDERS DE CARGA ---

  if (!tenant) return <div className="min-h-screen flex items-center justify-center text-slate-400 bg-slate-950">Iniciando aplicación...</div>;

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-orange-500 gap-2"><Loader2 className="animate-spin"/> Cargando...</div>;

  if (authError) return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <AlertCircle size={48} className="text-red-500 mb-4"/>
        <h2 className="text-xl font-bold mb-2">Error de Sistema</h2>
        <p className="text-slate-400 text-center">{authError}</p>
        <p className="text-xs text-slate-600 mt-4 text-center">Verifica que "localhost" o tu dominio estén autorizados en Firebase.</p>
    </div>
  );

  // --- VISTA RESET PASSWORD ---
  if (view === 'force-change-password') return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4"><div className="max-w-md w-full"><div className="text-center mb-8"><div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce shadow-xl shadow-orange-900/40"><Lock size={36} className="text-white"/></div><h1 className="text-2xl font-bold text-white">Cambio Obligatorio</h1><p className="text-slate-400 mt-2">Por seguridad, actualiza tu contraseña temporal.</p></div><Card theme={theme} className="border-orange-500/30"><form onSubmit={handleChangePassword} className="space-y-4"><input type="password" required className="w-full bg-slate-900/50 text-white rounded-lg p-3 border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all" value={newPasswordForm.new} onChange={e=>setNewPasswordForm({...newPasswordForm,new:e.target.value})} placeholder="Nueva Clave" /><input type="password" required className="w-full bg-slate-900/50 text-white rounded-lg p-3 border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all" value={newPasswordForm.confirm} onChange={e=>setNewPasswordForm({...newPasswordForm,confirm:e.target.value})} placeholder="Confirmar" /><Button type="submit" className="w-full mt-4 py-3">Actualizar Clave</Button></form></Card></div></div>
  );

  // --- COMPONENTE HEADER ---
  const Header = () => (
  <header className={`sticky top-0 z-40 transition-all ${themeClasses[theme].header}`}>
    
    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

      {/* LOGO + NOMBRE */}
      <div className="flex items-center gap-3">

        <div className={`p-2 rounded-xl w-10 h-10 flex items-center justify-center overflow-hidden shadow-lg ${
          appUser.role === 'mechanic'
            ? 'bg-gradient-to-br from-blue-600 to-blue-700'
            : 'bg-gradient-to-br from-orange-600 to-orange-700'
        }`}>
          {shopConfig.logoUrl
            ? <img src={shopConfig.logoUrl} className="w-full h-full object-cover"/>
            : <ItemIcon size={24} className="text-white"/>
          }
        </div>

        <div>
          <h1 className="text-lg font-bold leading-tight tracking-tight">
            {shopConfig.shopName}
          </h1>

          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            {appUser.role === 'client'
              ? 'Cliente'
              : (appUser.isAdmin ? 'Admin' : 'Mecánico')}
          </p>
        </div>

      </div>

      {/* LADO DERECHO */}
      <div className="flex items-center gap-4">

        {/* INFO USUARIO */}
        <div className="hidden sm:block text-right">
          <p className="text-sm text-white font-medium">{appUser.name}</p>
          <p className="text-xs text-slate-500">{appUser.dni}</p>
        </div>

        {/* BOTON CAMBIO DE TEMA */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Cambiar tema"
        >
          {theme === "light" ? <Moon size={20}/> : <Sun size={20}/>}
        </button>

        {/* BOTON SALIR */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <LogOut size={20}/>
        </Button>

      </div>

    </div>

  </header>
);

  // --- VISTA LOGIN ---
  if (view === 'login') return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-700 ${isStaffLogin?'bg-slate-950':'bg-slate-900'}`}><div className="max-w-md w-full"><div className="text-center mb-8"><div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl transition-all duration-500 ${isStaffLogin?'bg-blue-600 shadow-blue-900/40':'bg-orange-600 shadow-orange-900/40'} overflow-hidden`}>{shopConfig.logoUrl?<img src={shopConfig.logoUrl} className="w-full h-full object-cover"/>:(isStaffLogin?<Shield size={48} className="text-white"/>:<ItemIcon size={48} className="text-white"/>)}</div><h1 className="text-4xl font-bold text-white mb-2 tracking-tight">{shopConfig.shopName}</h1><p className={`text-sm font-medium tracking-wide uppercase ${isStaffLogin?'text-blue-400':'text-slate-400'}`}>{isStaffLogin?'Acceso Administrativo':'Portal de Clientes'}</p></div><Card theme={theme} className={`${isStaffLogin?'border-blue-500/30':'border-slate-700'}`}>
        {isStaffLogin ? (
            <form onSubmit={handleStaffLogin} className="space-y-4">
                {mechanics.length===0 && <div className="bg-blue-500/10 border border-blue-500/50 p-4 rounded-xl mb-4 text-sm text-blue-200 text-center shadow-lg"><p className="font-bold mb-1">¡Bienvenido!</p>Serás el <strong>Primer Admin</strong>. Esta clave será la definitiva.</div>}
                <div className="space-y-4">
                  <input value={loginDni} onChange={e=>setLoginDni(e.target.value)} type="number" required className="w-full bg-slate-900/50 border-slate-700 border rounded-xl p-3.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600" placeholder="Tu DNI" />
                  <div className="relative"><input value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} type={showPassword?"text":"password"} required className="w-full bg-slate-900/50 border-slate-700 border rounded-xl pl-3.5 pr-12 p-3.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600" placeholder="Tu Contraseña" /><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><Eye size={20}/></button></div>
                </div>
                {loginError && <p className="text-red-400 text-sm text-center font-medium animate-pulse bg-red-900/20 p-2 rounded-lg">{loginError}</p>}
                <Button type="submit" variant="admin" className="w-full py-3.5 text-lg shadow-blue-900/30">Ingresar al Sistema</Button>
            </form>
        ) : loginStep===1 ? (
            <form onSubmit={handleDniSubmit} className="space-y-6">
                <div className="text-center space-y-2"><h2 className="text-xl font-bold text-white">Reserva tú turno👋</h2><p className="text-slate-400 text-sm">Ingresa tu DNI para ver o pedir turnos.</p></div>
                <input value={loginDni} onChange={e=>setLoginDni(e.target.value)} type="number" required className="w-full bg-slate-900/50 border-slate-700 border rounded-xl p-4 text-white text-lg text-center tracking-widest focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder:text-slate-600" placeholder="ej.: 30123456" />
                <Button type="submit" className="w-full py-3.5 text-lg shadow-orange-900/30">Continuar <ArrowRight size={20}/></Button>
            </form>
        ) : (
  <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">

    <div className="text-center mb-2">
      <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
        Crea tu Perfil <ItemIcon size={24} />
      </h2>
      <p className="text-slate-400 text-xs">Solo te pediremos esto una vez.</p>
    </div>

    <input
      value={loginForm.name}
      onChange={e=>setLoginForm({...loginForm,name:e.target.value})}
      required
      className="w-full bg-slate-900/50 border-slate-700 border rounded-xl p-3.5 text-white focus:ring-2 focus:ring-orange-500 outline-none"
      placeholder="Tu Nombre Completo"
    />

    <input
      value={loginForm.phone}
      onChange={e=>setLoginForm({...loginForm,phone:e.target.value})}
      className="w-full bg-slate-900/50 border-slate-700 border rounded-xl p-3.5 text-white focus:ring-2 focus:ring-orange-500 outline-none"
      placeholder="Celular / WhatsApp"
    />

    <input
      value={loginForm.bikeModel}
      onChange={e=>setLoginForm({...loginForm,bikeModel:e.target.value})}
      className="w-full bg-slate-900/50 border-slate-700 border rounded-xl p-3.5 text-white focus:ring-2 focus:ring-orange-500 outline-none"
      placeholder={`${activeIndustry.itemLabel} (Opcional)`}
    />

    <input
      value={loginForm.email}
      onChange={e=>setLoginForm({...loginForm,email:e.target.value})}
      type="email"
      className="w-full bg-slate-900/50 border-slate-700 border rounded-xl p-3.5 text-white focus:ring-2 focus:ring-orange-500 outline-none"
      placeholder="Email (Opcional)"
    />

    <Button type="submit" className="w-full py-3.5 mt-2">
      Registrarme
    </Button>

    {/* CONTROLES DE SALIDA */}

    <div className="flex justify-between pt-2 text-xs">

      {/* volver a DNI */}
      <button
        type="button"
        onClick={()=>{
          setLoginStep(1);
          setLoginForm({name:'',phone:'',bikeModel:'',email:''});
        }}
        className="text-slate-500 hover:text-white"
      >
        ← Cambiar DNI
      </button>

      {/* salir */}
      <button
        type="button"
        onClick={()=>{
          setLoginStep(1);
          setLoginDni('');
          setLoginForm({name:'',phone:'',bikeModel:'',email:''});
          setView('login');
        }}
        className="text-red-400 hover:text-red-300"
      >
        Salir
      </button>

    </div>

  </form>
)
}
        <div className="mt-8 pt-6 border-t border-slate-700/50 flex justify-center"><button onClick={()=>{setIsStaffLogin(!isStaffLogin);setLoginStep(1);setLoginDni('');setLoginPassword('');}} className="text-sm flex items-center gap-2 text-slate-500 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-slate-800">{isStaffLogin?<>Volver al Acceso de Clientes</>:<><Lock size={14}/> Soy Personal del {activeIndustry.placeLabel}</>}</button></div>
    </Card></div></div>
  );

  // --- VISTA DASHBOARD CLIENTE ---
  if (view === 'client-dashboard') return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${themeClasses[theme].app}`}><Header /><main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-0">
        <div className="lg:col-span-2"><h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><span className="bg-orange-600/20 text-orange-500 p-2 rounded-lg"><Plus size={24}/></span> Reservar Nuevo Turno</h2><Card theme={theme}><div className="mb-8"><h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">1. Selecciona un Día</h3>{renderDateSelector(setSelectedDate, selectedDate)}</div>{selectedDate && <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">2. Elige Horario</h3>
                
                {shopConfig.scheduleMode === 'blocks' ? (
                    /* --- MODO CLÁSICO (MAÑANA/TARDE) --- */
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={()=>setSelectedTimeBlock('morning')} className={`p-5 rounded-2xl border flex flex-col items-center gap-2 transition-all duration-300 ${selectedTimeBlock==='morning'?'bg-orange-600 border-orange-500 text-white shadow-orange-900/20 shadow-xl scale-[1.02]':'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750 hover:border-slate-600'}`}>
                            <Sun size={28}/><span>Mañana</span><span className="text-xs opacity-60 font-mono bg-black/20 px-2 py-0.5 rounded">08:00 - 10:00</span>
                        </button>
                        <button onClick={()=>setSelectedTimeBlock('afternoon')} className={`p-5 rounded-2xl border flex flex-col items-center gap-2 transition-all duration-300 ${selectedTimeBlock==='afternoon'?'bg-orange-600 border-orange-500 text-white shadow-orange-900/20 shadow-xl scale-[1.02]':'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750 hover:border-slate-600'}`}>
                            <Moon size={28}/><span>Tarde</span><span className="text-xs opacity-60 font-mono bg-black/20 px-2 py-0.5 rounded">18:00 - 19:00</span>
                        </button>
                    </div>
                ) : (
                    /* --- NUEVO MODO (HORARIOS EXACTOS) --- */
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {generateTimeSlots().map((time) => {
                            const dateStr = formatDateForQuery(selectedDate); 
                            const isTaken = appointments.some(appt => 
                                appt.dateString === dateStr && 
                                appt.timeBlock === time && 
                                appt.status !== 'cancelado'
                            );

                            return (
                                <button 
                                    key={time} 
                                    disabled={isTaken}
                                    onClick={() => setSelectedTimeBlock(time)}
                                    className={`
                                        p-3 rounded-xl border text-sm font-bold transition-all
                                        ${isTaken 
                                            ? 'bg-slate-800/50 border-slate-800 text-slate-600 cursor-not-allowed line-through' 
                                            : selectedTimeBlock === time 
                                                ? 'bg-orange-600 border-orange-500 text-white shadow-lg' 
                                                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-500'
                                        }
                                    `}
                                >
                                    {time}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>}
            {selectedDate && selectedTimeBlock && <div className="animate-in fade-in slide-in-from-top-4 duration-500"><h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">3. Confirmar Reserva</h3><div className="space-y-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 mb-6"><div className="space-y-1"><label className="text-xs text-slate-400 font-semibold uppercase">{activeIndustry.itemLabel} (Puedes editarla):</label><input value={clientBikeModel} onChange={e=>setClientBikeModel(e.target.value)} className="w-full bg-slate-950 border-slate-800 border rounded-xl p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition" placeholder={`Ej: ${activeIndustry.itemLabel}...`} /></div><div className="space-y-1"><label className="text-xs text-slate-400 font-semibold uppercase">Servicio:</label><select value={serviceType} onChange={e=>setServiceType(e.target.value)} className="w-full bg-slate-950 border-slate-800 border rounded-xl p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none">{availableServices.map(s=><option key={s} value={s}>{s}</option>)}</select></div><div className="space-y-1"><label className="text-xs text-slate-400 font-semibold uppercase">Notas Adicionales:</label><textarea value={apptNotes} onChange={e=>setApptNotes(e.target.value)} rows="2" className="w-full bg-slate-950 border-slate-800 border rounded-xl p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none resize-none" placeholder="¿Algún detalle específico?"/></div></div><Button onClick={createClientAppointment} disabled={isSubmitting} className="w-full py-4 text-lg shadow-orange-900/40">{isSubmitting ? <span className="flex items-center gap-2"><Loader2 className="animate-spin"/> Reservando...</span> : 'Confirmar Reserva'}</Button></div>}</Card></div>
        <div className="lg:col-span-1 space-y-6"><h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3"><span className="bg-slate-800 text-slate-400 p-2 rounded-lg"><ClipboardList size={24}/></span> Mis Turnos</h2>{appointments.filter(a=>a.clientDni===appUser.dni).length===0?<div className="text-center py-16 bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-800"><ItemIcon className="mx-auto text-slate-700 mb-4" size={64}/><p className="text-slate-500 font-medium">No tienes turnos activos.</p></div>:appointments.filter(a=>a.clientDni===appUser.dni).map(appt=>{
            const isFuture = new Date(appt.date) > new Date();
            return <Card key={appt.id} className="relative group overflow-hidden"><div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><ItemIcon size={80}/></div><div className="flex flex-col gap-3 relative z-10"><div className="flex justify-between items-center mb-1"><Badge status={appt.status} labels={activeIndustry.statusLabels} /><span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">#{appt.orderId}</span></div><div><h3 className="text-lg font-bold text-white leading-tight">{appt.serviceType}</h3><p className="text-slate-400 text-sm mt-1">{appt.bikeModel}</p></div><div className="flex items-center gap-3 mt-2 bg-slate-900/60 p-3 rounded-xl text-sm text-slate-300 border border-slate-800"><Calendar size={16} className="text-orange-500"/><div className="flex flex-col leading-none"><span className="text-xs text-slate-500 font-bold uppercase">Fecha</span><span>{new Date(appt.date).toLocaleDateString()} • {appt.timeBlock==='morning'?'Mañana':(appt.timeBlock==='afternoon'?'Tarde':appt.timeBlock)}</span></div></div>{(appt.status === 'pendiente' && isFuture) && <Button variant="secondary" onClick={()=>openRescheduleModal(appt, 'client')} className="w-full text-xs mt-2 border-slate-700">Reprogramar (48hs)</Button>}</div></Card>
        })}</div>
        
        {rescheduleModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200"><Card theme={theme} className="w-full max-w-lg relative bg-slate-900 border-slate-700 shadow-2xl"><button onClick={()=>setRescheduleModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><XCircle/></button><h3 className="text-xl font-bold text-white mb-4">Reprogramar Turno</h3><div className="mb-4">{renderDateSelector((d)=>setRescheduleModal({...rescheduleModal, date: d}), rescheduleModal.date)}</div>{rescheduleModal.date && <div className="grid grid-cols-2 gap-4 mb-4"><button onClick={()=>setRescheduleModal({...rescheduleModal, timeBlock:'morning'})} className={`p-3 rounded-xl border text-center ${rescheduleModal.timeBlock==='morning'?'bg-orange-600 text-white border-orange-500':'bg-slate-800 text-slate-400 border-slate-700'}`}>Mañana</button><button onClick={()=>setRescheduleModal({...rescheduleModal, timeBlock:'afternoon'})} className={`p-3 rounded-xl border text-center ${rescheduleModal.timeBlock==='afternoon'?'bg-orange-600 text-white border-orange-500':'bg-slate-800 text-slate-400 border-slate-700'}`}>Tarde</button></div>}<Button onClick={handleRescheduleSubmit} className="w-full">Confirmar Cambio</Button></Card></div>}
        
        {/* === MODAL CONFIRMACIÓN ADMINISTRADOR === */}
        {confirmModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200">
                <Card theme={theme} className="w-full max-w-sm border-red-500/30 bg-slate-900 shadow-2xl">
                    <div className="flex justify-center mb-4 text-red-500">
                        <AlertCircle size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 text-center">{confirmModal.title}</h3>
                    <p className="text-slate-400 mb-6 text-center text-sm">{confirmModal.msg}</p>
                    <div className="flex gap-3">
                        <Button 
                            variant="secondary" 
                            onClick={()=>setConfirmModal(null)} 
                            className="flex-1 py-3"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            variant="danger" 
                            onClick={()=>{confirmModal.action();}} 
                            className="flex-1 py-3"
                        >
                            Confirmar
                        </Button>
                    </div>
                </Card>
            </div>
        )}

        {/* ================= MODAL DETALLE COMPLETO DE TURNO (AHORA ADENTRO DEL MAIN) ================= */}
        {selectedApptModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200">
            <Card theme={theme} className="w-full max-w-lg relative bg-slate-900 border-slate-700 shadow-2xl overflow-hidden text-white">
              
              {/* Botón Cerrar */}
              <button 
                onClick={() => setSelectedApptModal(null)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <XCircle size={24}/>
              </button>

              {/* Indicador de Estado Lateral */}
              <div className={`absolute top-0 left-0 w-1.5 h-full ${
                selectedApptModal.status === 'listo' ? 'bg-emerald-500' :
                selectedApptModal.status === 'en-proceso' ? 'bg-blue-500' :
                selectedApptModal.status === 'recibido' ? 'bg-amber-500' : 'bg-slate-600'
              }`}></div>

              <div className="pl-2">
                {/* Cabecera */}
                <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded">
                      ORDEN #{selectedApptModal.orderId}
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-2 tracking-tight">
                      {selectedApptModal.bikeModel}
                    </h3>
                  </div>
                  <Badge status={selectedApptModal.status} labels={activeIndustry.statusLabels}/>
                </div>

                {/* Información en Cuadrícula */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Cliente</p>
                    <p className="text-sm text-white font-medium">{selectedApptModal.clientName}</p>
                    <p className="text-xs text-slate-400 font-mono">DNI: {selectedApptModal.clientDni}</p>
                    <p className="text-xs text-slate-400">Tel: {selectedApptModal.clientPhone}</p>
                  </div>

                  <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Servicio Asignado</p>
                    <p className="text-sm text-blue-400 font-bold">{selectedApptModal.serviceType}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Calendar size={12}/> {new Date(selectedApptModal.date).toLocaleDateString()}
                    </p>
                    {selectedApptModal.mechanicName && (
                      <p className="text-xs text-emerald-400 mt-1 font-semibold">
                        🔧 {selectedApptModal.mechanicName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Notas / Observaciones */}
                <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 mb-6">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Notas / Diagnóstico</p>
                  <p className="text-xs text-slate-300 italic whitespace-pre-wrap">
                    {selectedApptModal.notes || 'Sin observaciones registradas.'}
                  </p>
                </div>

                {/* Botón de Acción Principal (Cambio de Estado Rápido) */}
                <div className="mb-4">
                  {selectedApptModal.status === 'pendiente' && (
                    <Button variant="secondary" theme={theme} className="w-full py-3 text-sm flex justify-center items-center gap-2"
                      onClick={() => {
                        setReceptionModal({appt: selectedApptModal, bikeModel: selectedApptModal.bikeModel, serviceType: selectedApptModal.serviceType, notes: selectedApptModal.notes || ''});
                        setSelectedApptModal(null);
                      }}>
                      <FileText size={16}/> Recepcionar Unidad
                    </Button>
                  )}

                  {selectedApptModal.status === 'recibido' && (
                    <Button variant="admin" theme={theme} className="w-full py-3 text-sm flex justify-center items-center gap-2"
                      onClick={() => { updateStatus(selectedApptModal.id, 'en-proceso'); setSelectedApptModal(null); }}>
                      <Wrench size={16}/> Iniciar Reparación
                    </Button>
                  )}

                  {selectedApptModal.status === 'en-proceso' && (
                    <Button variant="success" theme={theme} className="w-full py-3 text-sm flex justify-center items-center gap-2"
                      onClick={() => { updateStatus(selectedApptModal.id, 'listo'); setSelectedApptModal(null); }}>
                      <CheckCircle size={16}/> Finalizar Trabajo
                    </Button>
                  )}

                  {selectedApptModal.status === 'listo' && (
                    <div className="flex flex-col gap-2">
                      <Button variant="whatsapp" theme={theme} className="w-full py-3 text-sm flex justify-center items-center gap-2"
                        onClick={() => sendWhatsApp(selectedApptModal.clientPhone, selectedApptModal.clientName, selectedApptModal.bikeModel, 'listo')}>
                        <MessageCircle size={16}/> Enviar Alerta de Retiro (WhatsApp)
                      </Button>
                      <Button variant="success" theme={theme} className="w-full py-3 text-sm flex justify-center items-center gap-2"
                        onClick={() => { updateStatus(selectedApptModal.id, 'retirado', {deliveredAt: new Date().toISOString()}); setSelectedApptModal(null); }}>
                        <CheckCircle size={16}/> Marcar como Entregado
                      </Button>
                    </div>
                  )}
                </div>

                {/* Barra de Herramientas Secundaria */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-800 gap-2">
                  <button
                    type="button"
                    onClick={() => { sendWhatsApp(selectedApptModal.clientPhone, selectedApptModal.clientName, selectedApptModal.bikeModel, selectedApptModal.status); }}
                    className="flex-1 p-2 bg-slate-950 border border-slate-800 text-slate-400 rounded-xl hover:bg-slate-800 text-xs flex justify-center items-center gap-1 transition"
                  >
                    <MessageCircle size={14}/> WhatsApp
                  </button>

                  {selectedApptModal.status !== 'pendiente' && (
                    <button
                      type="button"
                      onClick={() => { printServiceOrder(selectedApptModal); }}
                      className="flex-1 p-2 bg-slate-950 border border-slate-800 text-slate-400 rounded-xl hover:bg-slate-800 text-xs flex justify-center items-center gap-1 transition"
                    >
                      <Printer size={14}/> Ticket
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => { openRescheduleModal(selectedApptModal, 'admin'); setSelectedApptModal(null); }}
                    className="flex-1 p-2 bg-slate-950 border border-slate-800 text-slate-400 rounded-xl hover:bg-slate-800 text-xs flex justify-center items-center gap-1 transition"
                  >
                    <Edit size={14}/> Re-agendar
                  </button>

                  <button
                    type="button"
                    onClick={() => { handleDeleteAppointment(selectedApptModal.id); setSelectedApptModal(null); }}
                    className="p-2 bg-red-950/20 border border-red-900/30 text-red-400 rounded-xl hover:bg-red-900/30 transition"
                  >
                    <Trash2 size={14}/>
                  </button>
                </div>

              </div>
            </Card>
          </div>
        )}

    </main>
  </div>
);
}

  // --- VISTA ADMIN (SUB-VIEWS) ---
  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${themeClasses[theme].app}`}><Header /><div className="max-w-7xl mx-auto px-4 mt-6 border-b border-slate-800 flex flex-wrap gap-2 overflow-x-auto pb-1"><button onClick={()=>setSubView('dashboard')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${subView==='dashboard'?'bg-blue-600 text-white shadow-lg shadow-blue-900/30':'text-slate-400 hover:text-white hover:bg-slate-800'}`}>Panel de Turnos</button>{appUser.isAdmin && <><button onClick={()=>setSubView('clients')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${subView==='clients'?'bg-blue-600 text-white shadow-lg shadow-blue-900/30':'text-slate-400 hover:text-white hover:bg-slate-800'}`}><Users size={16}/> Clientes</button><button onClick={()=>setSubView('stats')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${subView==='stats'?'bg-blue-600 text-white shadow-lg shadow-blue-900/30':'text-slate-400 hover:text-white hover:bg-slate-800'}`}><BarChart3 size={16}/> Estadísticas</button><button onClick={()=>setSubView('config')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${subView==='config'?'bg-blue-600 text-white shadow-lg shadow-blue-900/30':'text-slate-400 hover:text-white hover:bg-slate-800'}`}><Settings size={16}/> Config</button><button onClick={()=>setSubView('mechanics-mgmt')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${subView==='mechanics-mgmt'?'bg-blue-600 text-white shadow-lg shadow-blue-900/30':'text-slate-400 hover:text-white hover:bg-slate-800'}`}><Shield size={16}/> Staff</button></>}</div>
    <main className="max-w-7xl mx-auto px-4 py-8 relative z-0">
        
        {rescheduleModal && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200"><Card theme={theme} className="w-full max-w-lg relative bg-slate-900 border-slate-700 shadow-2xl"><button onClick={()=>setRescheduleModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><XCircle/></button><h3 className="text-xl font-bold text-white mb-4">Reprogramar Turno (Admin)</h3><div className="mb-4">{renderDateSelector((d)=>setRescheduleModal({...rescheduleModal, date: d}), rescheduleModal.date)}</div>{rescheduleModal.date && <div className="grid grid-cols-2 gap-4 mb-4"><button onClick={()=>setRescheduleModal({...rescheduleModal, timeBlock:'morning'})} className={`p-3 rounded-xl border text-center ${rescheduleModal.timeBlock==='morning'?'bg-orange-600 text-white border-orange-500':'bg-slate-800 text-slate-400 border-slate-700'}`}>Mañana</button><button onClick={()=>setRescheduleModal({...rescheduleModal, timeBlock:'afternoon'})} className={`p-3 rounded-xl border text-center ${rescheduleModal.timeBlock==='afternoon'?'bg-orange-600 text-white border-orange-500':'bg-slate-800 text-slate-400 border-slate-700'}`}>Tarde</button></div>}<Button onClick={handleRescheduleSubmit} className="w-full">Confirmar Cambio</Button></Card></div>}

        {showAdminApptModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200"><Card theme={theme} className="w-full max-w-lg relative bg-slate-900 border-slate-700 shadow-2xl"><button onClick={()=>setShowAdminApptModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><XCircle/></button>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Plus className="text-blue-500"/> Nuevo Turno Manual</h3>
            {adminApptStep === 1 ? (
                <form onSubmit={handleAdminDniSearch} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ingrese DNI Cliente</label><div className="flex gap-2"><input autoFocus value={adminDniSearch} onChange={e=>setAdminDniSearch(e.target.value)} type="number" className="w-full bg-slate-950 border-slate-800 border rounded-xl p-3.5 text-white outline-none focus:border-blue-500 transition text-lg tracking-wider" placeholder="Ej: 30123456" /><Button type="submit" variant="admin"><Search size={20}/></Button></div><p className="text-xs text-slate-500 mt-2">Buscará si el cliente existe. Si no, podrás crearlo.</p></div>
                </form>
            ) : (
                <form onSubmit={createAdminAppointment} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 flex justify-between items-center mb-4"><div className="flex items-center gap-2"><User size={16} className="text-blue-400"/><span className="text-white font-bold">{adminDniSearch}</span></div>{isNewClient ? <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded border border-orange-500/30">Nuevo Cliente</span> : <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">Cliente Existente</span>}</div>
                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre Completo</label><input required value={adminFormData.name} onChange={e=>setAdminFormData({...adminFormData, name:e.target.value})} className={`w-full bg-slate-950 border-slate-800 border rounded-xl p-3.5 text-white outline-none focus:border-blue-500 transition ${!isNewClient ? 'opacity-80' : ''}`} placeholder="Nombre y Apellido" /></div>
                    <div className="grid grid-cols-2 gap-4"><div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Teléfono</label><input required value={adminFormData.phone} onChange={e=>setAdminFormData({...adminFormData, phone:e.target.value})} type="tel" className="w-full bg-slate-950 border-slate-800 border rounded-xl p-3.5 text-white outline-none focus:border-blue-500 transition" placeholder="WhatsApp" /></div><div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{activeIndustry.itemLabel}</label><input value={adminFormData.bikeModel} onChange={e=>setAdminFormData({...adminFormData, bikeModel:e.target.value})} className="w-full bg-slate-950 border-slate-800 border rounded-xl p-3.5 text-white outline-none focus:border-blue-500 transition" placeholder={activeIndustry.itemLabel} /></div></div>
                    <div className="grid grid-cols-2 gap-4"><div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</label><input type="datetime-local" required value={adminFormData.date} onChange={e=>setAdminFormData({...adminFormData, date:e.target.value})} className="w-full bg-slate-950 border-slate-800 border rounded-xl p-3.5 text-white [color-scheme:dark] outline-none focus:border-blue-500 transition" /></div><div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Servicio</label><select value={adminFormData.serviceType} onChange={e=>setAdminFormData({...adminFormData, serviceType:e.target.value})} className="w-full bg-slate-950 border-slate-800 border rounded-xl p-3.5 text-white outline-none focus:border-blue-500 transition">{availableServices.map(s=><option key={s} value={s}>{s}</option>)}</select></div></div>
                    <Button type="submit" variant="admin" disabled={isSubmitting} className="w-full py-4 text-lg mt-4">{isSubmitting ? 'Guardando...' : (isNewClient ? 'Crear Cliente y Turno' : 'Agendar Turno')}</Button>
                    <button type="button" onClick={()=>setAdminApptStep(1)} className="w-full text-center text-xs text-slate-500 hover:text-white mt-2">Volver atrás</button>
                </form>
            )}
        </Card></div>}

        {subView === 'dashboard' && <>
            {receptionModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200"><Card theme={theme} className="w-full max-w-lg relative bg-slate-900 border-slate-700 shadow-2xl"><button onClick={()=>setReceptionModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><XCircle/></button><h3 className="text-2xl font-bold text-white mb-2">Recepción de {activeIndustry.itemLabel}</h3><div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl mb-6 flex items-center gap-3"><User className="text-blue-400"/><div className="text-sm"><p className="text-blue-200 font-bold">{receptionModal.appt.clientName}</p><p className="text-blue-400/60">DNI: {receptionModal.appt.clientDni}</p></div></div><form onSubmit={handleReceptionConfirm} className="space-y-5"><div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{activeIndustry.itemLabel} (Verificar)</label><input value={receptionModal.bikeModel} onChange={e=>setReceptionModal({...receptionModal, bikeModel:e.target.value})} className="w-full bg-slate-950 border-slate-800 border rounded-xl p-3.5 text-white outline-none focus:border-blue-500 transition"/></div><div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Servicio a Realizar</label><select value={receptionModal.serviceType} onChange={e=>setReceptionModal({...receptionModal, serviceType:e.target.value})} className="w-full bg-slate-950 border-slate-800 border rounded-xl p-3.5 text-white outline-none focus:border-blue-500 transition">{availableServices.map(s=><option key={s} value={s}>{s}</option>)}</select></div><div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notas / Diagnóstico Visual</label><textarea value={receptionModal.notes} onChange={e=>setReceptionModal({...receptionModal, notes:e.target.value})} rows="3" className="w-full bg-slate-950 border-slate-800 border rounded-xl p-3.5 text-white outline-none focus:border-blue-500 transition resize-none" placeholder="Estado general..."/></div><Button type="submit" className="w-full py-4 text-lg mt-2">Confirmar e Imprimir Orden</Button></form></Card></div>}
            
            {/* --- SECTOR DE FILTROS Y BUSQUEDA --- */}
{/* --- PANEL DE CONTROL: BUSQUEDA Y FILTROS AVANZADOS --- */}
{/* --- PANEL DE CONTROL: BUSQUEDA Y MULTI-FILTROS ESTILO EXCEL --- */}
<div className="space-y-4 mb-8">
    {/* Fila Superior: Búsqueda Global y Modos de Vista */}
    <div className={`p-4 rounded-2xl border grid grid-cols-1 md:grid-cols-12 gap-4 shadow-sm transition-all ${
        theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900/50 border-slate-800'
    }`}>
        <div className="md:col-span-6 relative">
            <Search className="absolute left-4 top-3.5 text-slate-500" size={20}/>
            <input 
                placeholder={`Buscar ID, Cliente, ${activeIndustry.itemLabel}...`} 
                value={filters.searchTerm} 
                onChange={e => setFilters({...filters, searchTerm: e.target.value})} 
                className={`w-full border rounded-xl pl-12 p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-white'
                }`}
            />
        </div>

        <div className="md:col-span-4 flex gap-2">
            {[
                { id: 'list', icon: List, label: 'Cards' },
                { id: 'rows', icon: FileText, label: 'Tabla' },
                { id: 'week', icon: Calendar, label: 'Semana' }
            ].map((mode) => (
                <button 
                    key={mode.id}
                    onClick={() => setDashboardMode(mode.id)} 
                    className={`flex-1 flex items-center justify-center rounded-xl transition-all duration-200 ${
                        dashboardMode === mode.id
                            ? 'bg-blue-600 text-white shadow-lg'
                            : theme === 'light' 
                                ? 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100' 
                                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                >
                    <mode.icon size={20}/>
                </button>
            ))}
        </div>

        <div className="md:col-span-2">
            <Button 
                variant="secondary" 
                theme={theme}
                onClick={printAdvancedReport} 
                className="w-full h-full flex gap-2 items-center justify-center"
            >
                <Printer size={18}/> PDF
            </Button>
        </div>
    </div>

   {/* Fila Inferior: Filtros Multi-selección Estilo Excel */}
    <div className={`p-5 rounded-2xl border transition-all duration-300 ${
        theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/50 border-slate-800'
    }`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            
            {/* Rango de Fechas - Desde */}
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Desde</label>
                <input 
                    type="date" 
                    value={filters.startDate} 
                    onChange={e => setFilters({...filters, startDate: e.target.value})} 
                    className={`w-full bg-transparent border-b p-1 text-sm outline-none focus:border-blue-500 transition-colors ${
                        theme === 'light' ? 'border-slate-200 text-slate-800' : 'border-slate-700 text-white'
                    }`}
                />
            </div>

            {/* Rango de Fechas - Hasta */}
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hasta</label>
                <input 
                    type="date" 
                    value={filters.endDate} 
                    onChange={e => setFilters({...filters, endDate: e.target.value})} 
                    className={`w-full bg-transparent border-b p-1 text-sm outline-none focus:border-blue-500 transition-colors ${
                        theme === 'light' ? 'border-slate-200 text-slate-800' : 'border-slate-700 text-white'
                    }`}
                />
            </div>

            {/* MULTI-SELECT: ESTADOS */}
            <MultiSelectFilter 
                label="Estado"
                theme={theme}
                options={Object.entries(activeIndustry.statusLabels).map(([id, label]) => {
                    const map = { pending: 'pendiente', received: 'recibido', process: 'en-proceso', ready: 'listo', delivered: 'retirado' };
                    return { id: map[id] || id, label };
                })}
                selectedValues={filters.statuses}
                onToggle={(id) => {
                    const statuses = filters.statuses.includes(id) 
                        ? filters.statuses.filter(v => v !== id) 
                        : [...filters.statuses, id];
                    setFilters({...filters, statuses});
                }}
            />

            {/* MULTI-SELECT: SERVICIOS */}
            <MultiSelectFilter 
                label="Servicio"
                theme={theme}
                options={availableServices.map(s => ({ id: s, label: s }))}
                selectedValues={filters.services}
                onToggle={(id) => {
                    const services = filters.services.includes(id) 
                        ? filters.services.filter(v => v !== id) 
                        : [...filters.services, id];
                    setFilters({...filters, services});
                }}
            />

            {/* MULTI-SELECT: RESPONSABLE */}
            <MultiSelectFilter 
                label="Responsable"
                theme={theme}
                options={mechanics.map(m => ({ id: m.dni, label: m.name }))}
                selectedValues={filters.mechanics}
                onToggle={(id) => {
                    const mechanicsList = filters.mechanics.includes(id) 
                        ? filters.mechanics.filter(v => v !== id) 
                        : [...filters.mechanics, id];
                    setFilters({...filters, mechanics: mechanicsList});
                }}
            />

        </div>

        {/* Botón de Limpieza General */}
        <div className="mt-4 flex justify-end">
            <button 
                type="button"
                onClick={() => setFilters({startDate:'', endDate:'', services:[], statuses:[], mechanics:[], searchTerm:''})}
                className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-2 uppercase tracking-widest"
            >
                <RotateCcw size={12}/> Limpiar Filtros
            </button>
        </div>
    </div>
</div>

{/* --- SECTOR DE GRID DE CARDS --- */}
{dashboardMode === 'list' ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* CARD NUEVO TURNO */}
        <div className="group h-full">
            <Card
                theme={theme}
                onClick={() => { setAdminApptStep(1); setShowAdminApptModal(true) }}
                className={`h-full border-2 border-dashed flex flex-col justify-center items-center gap-4 transition-all duration-300 group cursor-pointer ${
                    theme === "light"
                        ? "border-slate-300 bg-white hover:border-blue-500 hover:bg-blue-50/30"
                        : "border-slate-700 bg-slate-800/30 hover:bg-slate-800/80 hover:border-blue-500/50"
                }`}
            >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                    theme === "light"
                        ? "bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white"
                        : "bg-slate-800 text-slate-500 group-hover:bg-blue-600 group-hover:text-white"
                }`}>
                    <Plus size={40}/>
                </div>

                <h3 className={`font-bold transition-colors ${
                    theme === "light" ? "text-slate-500 group-hover:text-blue-600" : "text-slate-400 group-hover:text-white"
                }`}>
                    Nuevo Turno
                </h3>
            </Card>
        </div>
        {/* ... Resto del mapeo de filteredAppts ... */}

{filteredAppts.map(appt => (

<Card
key={appt.id}
theme={theme}
className={`flex flex-col relative overflow-hidden
${theme === "light"
  ? "bg-white border border-slate-200 shadow-sm"
  : ""}
${appt.status==='listo'?'border-emerald-500/30 bg-emerald-900/5':''}
`}>

<div className={`absolute top-0 left-0 w-1 h-full ${
  appt.status==='listo'?'bg-emerald-500':
  appt.status==='en-proceso'?'bg-blue-500':
  appt.status==='recibido'?'bg-amber-500':'bg-slate-600'
}`}></div>

<div className="pl-3">

<div className="flex justify-between items-start mb-3">
  <div>

    <h3 className={`${theme === "light" ? "text-slate-800" : "text-white"} font-bold text-lg`}>
      {appt.bikeModel}
    </h3>

    <div className={`text-xs flex items-center gap-1 ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
      <User size={12}/> {appt.clientName}
    </div>

    <div className={`text-[10px] font-mono ${theme === "light" ? "text-slate-400" : "text-slate-500"}`}>
      #{appt.orderId}
    </div>

  </div>

  <Badge status={appt.status} labels={activeIndustry.statusLabels}/>
</div>


<div className="flex-grow space-y-3 mb-5">


<div
  className={`p-2.5 rounded border ${
    theme === "light"
      ? "bg-slate-100 border-slate-200"
      : "bg-slate-900/50 border-slate-800"
  }`}
>

  <p className="text-xs text-blue-400 font-bold uppercase">
    Servicio
  </p>

  <p
    className={`text-sm ${
      theme === "light" ? "text-slate-700" : "text-slate-300"
    }`}
  >
    {appt.serviceType}
  </p>

</div>


<span className={`text-xs flex items-center gap-1 ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
<Calendar size={12}/> {new Date(appt.date).toLocaleDateString()}
</span>


{appt.mechanicName && (
<div className={`text-xs ${theme === "light" ? "text-blue-600" : "text-blue-400"}`}>
<Wrench size={10}/> {appt.mechanicName}
</div>
)}

</div>


{/* BOTONES GRANDES */}

<div className={`border-t pt-4 grid gap-2 ${theme === "light" ? "border-slate-200" : "border-slate-700"}`}>

{appt.status==='pendiente' &&
<Button variant="secondary" theme={theme} className="text-xs w-full"
onClick={()=>setReceptionModal({appt,bikeModel:appt.bikeModel,serviceType:appt.serviceType,notes:appt.notes||''})}>
<FileText size={14}/> Recepcionar
</Button>}

{appt.status==='recibido' &&
<Button variant="admin" theme={theme} className="text-xs w-full"
onClick={()=>updateStatus(appt.id,'en-proceso')}>
<Wrench size={14}/> Iniciar
</Button>}

{appt.status==='en-proceso' &&
<Button variant="success" theme={theme} className="text-xs w-full"
onClick={()=>updateStatus(appt.id,'listo')}>
<CheckCircle size={14}/> Finalizar
</Button>}

{appt.status==='listo' && (
<>
<Button variant="whatsapp" theme={theme} className="text-xs w-full"
onClick={()=>sendWhatsApp(appt.clientPhone, appt.clientName, appt.bikeModel,'listo')}>
<MessageCircle size={14}/> Avisar Retiro
</Button>

<Button variant="success" theme={theme} className="text-xs w-full"
onClick={()=>updateStatus(appt.id,'retirado',{deliveredAt:new Date().toISOString()})}>
<CheckCircle size={14}/> Marcar Entregado
</Button>
</>
)}

</div>


{/* ICONOS INFERIORES */}

<div className="flex justify-between pt-3 mt-2 gap-2">


<button
onClick={()=>sendWhatsApp(appt.clientPhone, appt.clientName, appt.bikeModel, appt.status)}
className={`p-2 rounded-lg border transition-all duration-200 hover:scale-110 ${
  theme === "light"
    ? "bg-white text-slate-500 border-slate-200 hover:bg-green-100"
    : "bg-slate-800 text-slate-400 border-slate-700"
}`}
title="WhatsApp"
>
<MessageCircle size={16}/>
</button>


{appt.status!=='pendiente' &&
<button
onClick={()=>printServiceOrder(appt)}
className={`p-2 rounded-lg border transition-all duration-200 hover:scale-110 ${
  theme === "light"
    ? "bg-white text-slate-500 border-slate-200 hover:bg-blue-100"
    : "bg-slate-800 text-slate-400 border-slate-700"
}`}
title="Reimprimir"
>
<Printer size={16}/>
</button>}


<button
onClick={()=>updateStatus(appt.id,'pendiente')}
className={`p-2 rounded-lg border transition-all duration-200 hover:scale-110 ${
  theme === "light"
    ? "bg-white text-slate-500 border-slate-200 hover:bg-amber-100"
    : "bg-slate-800 text-slate-400 border-slate-700"
}`}
title="Resetear"
>
<RotateCcw size={16}/>
</button>


<button
onClick={()=>openRescheduleModal(appt,'admin')}
className={`p-2 rounded-lg border transition-all duration-200 hover:scale-110 ${
  theme === "light"
    ? "bg-white text-slate-500 border-slate-200 hover:bg-violet-100"
    : "bg-slate-800 text-slate-400 border-slate-700"
}`}
title="Reprogramar"
>
<Edit size={16}/>
</button>


<button
onClick={()=>handleDeleteAppointment(appt.id)}
className={`p-2 rounded-lg border transition-all duration-200 hover:scale-110 ${
  theme === "light"
    ? "bg-white text-slate-500 border-slate-200 hover:bg-red-100"
    : "bg-slate-800 text-slate-400 border-slate-700"
}`}
title="Eliminar"
>
<Trash2 size={16}/>
</button>

</div>

</div>
</Card>

))}
</div>
) : dashboardMode === 'week' ? (

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">

{getWeekDays().map(day => {

  const dayStr = formatDateForQuery(day);

  const dayAppts = filteredAppts
    .filter(a => a.dateString === dayStr)
    .sort((a,b)=>new Date(a.date)-new Date(b.date));

  return (
    <div key={dayStr} className="bg-slate-900 rounded-xl border border-slate-800 p-3">

      <div className="text-center mb-2">
        <div className="text-sm text-white font-bold">
          {formatDisplayDate(day).dayName}
        </div>
        <div className="text-xs text-slate-400">
          {formatDisplayDate(day).date}
        </div>

        <div className="text-xs mt-1 text-blue-400">
          {dayAppts.length} turnos
        </div>
      </div>

      <div className="space-y-2">

        {dayAppts.length === 0 && (
          <div className="text-xs text-slate-600 text-center py-4">
            Sin ingresos
          </div>
        )}

        {dayAppts.map(a => (
          <div
            key={a.id}
            className="bg-slate-800 p-2 rounded border border-slate-700 text-xs"
          >

            <div className="flex justify-between">
              <span className="text-white font-bold">{a.bikeModel}</span>
              <Badge status={a.status} labels={activeIndustry.statusLabels}/>
            </div>

            <div className="text-slate-400">{a.clientName}</div>
            <div className="text-blue-400">{a.serviceType}</div>

            {a.mechanicName && (
              <div className="text-[10px] text-emerald-400 mt-1">
                🔧 {a.mechanicName}
              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  );

})}

</div>
) : dashboardMode === 'rows' ? (

  <div className="overflow-x-auto">

    <table className="w-full text-sm">

      <thead className={`
  sticky top-0 z-10 uppercase text-[11px] tracking-wider font-bold
  ${theme === "light" ? "bg-slate-100 text-slate-600" : "bg-slate-800 text-slate-400"}
`}>
  <tr>
    <th className="p-4 text-center w-24">Orden</th>
    <th className="p-4 text-center">Fecha</th>
    <th className="p-4 text-left">DNI</th>
    <th className="p-4 text-left">Cliente</th>
    <th className="p-4 text-left">{activeIndustry.itemLabel}</th>
    <th className="p-4 text-left">Servicio</th>
    <th className="p-4 text-center">Estado</th>
    <th className="p-4 text-center">Acciones</th>
  </tr>
</thead>

    <tbody className={
  theme === "light"
  ? "divide-y divide-slate-200 text-slate-800"
  : "divide-y divide-slate-800 text-slate-200"
}>


        {filteredAppts.map(a => (

                      <tr
                key={a.id}
                className={`hover:bg-slate-800/50 border-l-4 ${
                  a.status === 'listo'
                    ? 'border-emerald-500'
                    : a.status === 'en-proceso'
                    ? 'border-blue-500'
                    : a.status === 'recibido'
                    ? 'border-amber-500'
                    : 'border-slate-700'
                }`}
              >

            {/* Reemplaza tu <td> del número de orden por este: */}
<td 
  className="p-3 font-mono text-blue-500 font-bold text-center cursor-pointer hover:underline hover:text-blue-600"
  onClick={() => setSelectedApptModal(a)}
>
  #{a.orderId}
</td>
            <td className="p-4">
  {new Date(a.date).toLocaleDateString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })}
</td>
            <td>{a.clientDni}</td>
            <td>{a.clientName}</td>
            <td>{a.bikeModel}</td>
            <td>{a.serviceType}</td>

            <td>
              <Badge status={a.status} labels={activeIndustry.statusLabels}/>
            </td>
     <td>
  <div className="flex gap-2">

    {/* RECEPCIONAR */}
    {a.status === 'pendiente' && (
      <div className="relative group">
        <button
          onClick={()=>setReceptionModal({
            appt: a,
            bikeModel: a.bikeModel,
            serviceType: a.serviceType,
            notes: a.notes || ''
          })}
          className="p-2 rounded bg-slate-800 text-slate-400 border border-slate-700
          hover:bg-amber-600/20 hover:text-amber-400 hover:border-amber-500/40 transition"
        >
          <FileText size={14}/>
        </button>

        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-xs px-2 py-0.5 rounded text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
          Recepcionar
        </span>
      </div>
    )}

    {/* WHATSAPP */}
    <div className="relative group">
      <button
        onClick={()=>sendWhatsApp(a.clientPhone, a.clientName, a.bikeModel, a.status)}
        className="p-2 rounded bg-slate-800 text-slate-400 border border-slate-700
        hover:bg-green-600/20 hover:text-green-400 hover:border-green-500/40 transition"
      >
        <MessageCircle size={14}/>
      </button>

      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-xs px-2 py-0.5 rounded text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
        WhatsApp
      </span>
    </div>

    {/* ENTREGADO */}
    {a.status === 'listo' && (
      <div className="relative group">
        <button
          onClick={()=>updateStatus(a.id,'retirado',{deliveredAt:new Date().toISOString()})}
          className="p-2 rounded bg-slate-800 text-slate-400 border border-slate-700
          hover:bg-emerald-600/20 hover:text-emerald-400 hover:border-emerald-500/40 transition"
        >
          <CheckCircle size={14}/>
        </button>

        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-xs px-2 py-0.5 rounded text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
          Entregado
        </span>
      </div>
    )}

    {/* REPROGRAMAR */}
    <div className="relative group">
      <button
        onClick={()=>openRescheduleModal(a,'admin')}
        className="p-2 rounded bg-slate-800 text-slate-400 border border-slate-700
        hover:bg-violet-600/20 hover:text-violet-400 hover:border-violet-500/40 transition"
      >
        <Edit size={14}/>
      </button>

      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-xs px-2 py-0.5 rounded text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
        Reprogramar
      </span>
    </div>

  </div>
</td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

) : (

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-x-auto pb-4">
                    <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 min-w-[300px]">
                        <h3 className="text-slate-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-500"></div> En Espera / Recepción</h3>
                        <div className="space-y-3">
                            {filteredAppts.filter(a=>['pendiente','recibido'].includes(a.status)).map(appt=>(
                                <div key={appt.id} className="bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-sm hover:border-slate-500 transition cursor-pointer" onClick={()=>appt.status==='recibido' && updateStatus(appt.id,'en-proceso')}>
                                    <div className="flex justify-between mb-1"><span className="text-white font-bold">{appt.bikeModel}</span><span className="text-xs text-slate-500">#{appt.orderId}</span></div>
                                    <p className="text-xs text-slate-400 mb-2">{appt.clientName}</p>
                                    <Badge status={appt.status} labels={activeIndustry.statusLabels} />
                                    {appt.status==='pendiente' && <div className="mt-2 text-xs text-orange-400 bg-orange-900/20 px-2 py-1 rounded">Esperando Recepción</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-slate-900/50 rounded-2xl p-4 border border-blue-900/30 min-w-[300px]">
                        <h3 className="text-blue-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div> En {activeIndustry.placeLabel} (Proceso)</h3>
                        <div className="space-y-3">
                            {filteredAppts.filter(a=>a.status==='en-proceso').map(appt=>(
                                <div key={appt.id} className="bg-slate-800 p-3 rounded-xl border-l-4 border-l-blue-500 border-y border-r border-slate-700 shadow-lg cursor-pointer" onClick={()=>updateStatus(appt.id,'listo')}>
                                    <div className="flex justify-between mb-1"><span className="text-white font-bold">{appt.bikeModel}</span><span className="text-xs text-slate-500">#{appt.orderId}</span></div>
                                    <p className="text-xs text-slate-400 mb-2">{appt.clientName}</p>
                                    <div className="flex items-center gap-2 text-xs text-blue-300 bg-blue-900/20 px-2 py-1 rounded w-fit"><Wrench size={10}/> {appt.mechanicName || activeIndustry.staffLabel}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-slate-900/50 rounded-2xl p-4 border border-emerald-900/30 min-w-[300px]">
                        <h3 className="text-emerald-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Listos para Retirar</h3>
                        <div className="space-y-3">
                            {filteredAppts.filter(a=>a.status==='listo').map(appt=>(
                                <div key={appt.id} className="bg-slate-800 p-3 rounded-xl border border-emerald-900/50 opacity-80 hover:opacity-100 transition">
                                    <div className="flex justify-between mb-1"><span className="text-white font-bold">{appt.bikeModel}</span><span className="text-xs text-slate-500">#{appt.orderId}</span></div>
                                    <p className="text-xs text-slate-400 mb-2">{appt.clientName}</p>
                                    <button onClick={()=>sendWhatsApp(appt.clientPhone, appt.clientName, appt.bikeModel, appt.status)} className="w-full mt-2 text-xs bg-emerald-600/20 text-emerald-400 py-1.5 rounded hover:bg-emerald-600 hover:text-white transition flex items-center justify-center gap-1"><MessageCircle size={12}/> Avisar</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>}

       
      {subView === 'clients' && appUser.isAdmin && (
  <div className="space-y-6">

    {/* ===== MODAL EDITAR ===== */}
    {editingClient && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
        <Card theme={theme} className="w-full max-w-md relative bg-slate-900 border-slate-700">
          <button onClick={()=>setEditingClient(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><XCircle/></button>

          <h3 className="text-xl font-bold text-white mb-4">Editar Cliente</h3>

          <form onSubmit={handleUpdateClient} className="space-y-3">
            <input value={editingClient.name} onChange={e=>setEditingClient({...editingClient,name:e.target.value})} className="w-full bg-slate-950 p-3 rounded"/>
            <input value={editingClient.phone} onChange={e=>setEditingClient({...editingClient,phone:e.target.value})} className="w-full bg-slate-950 p-3 rounded"/>
            <input value={editingClient.bikeModel} onChange={e=>setEditingClient({...editingClient,bikeModel:e.target.value})} className="w-full bg-slate-950 p-3 rounded"/>
            <Button type="submit" className="w-full">Guardar</Button>
          </form>
        </Card>
      </div>
    )}

    {/* ===== MODAL HISTORIAL ===== */}
    {clientHistoryModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
        <Card theme={theme} className="w-full max-w-4xl relative bg-slate-900 border-slate-700 max-h-[80vh] overflow-hidden flex flex-col">

          <button onClick={()=>setClientHistoryModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><XCircle/></button>

          <h3 className="text-xl font-bold text-white mb-4">{clientHistoryModal.name}</h3>

          <div className="overflow-y-auto flex-1">
            <table className="w-full text-sm text-slate-200">
              <thead className="bg-slate-800 sticky top-0">
                <tr>
                  <th className="p-2">Fecha</th>
                  <th>Orden</th>
                  <th>Servicio</th>
                  <th>{activeIndustry.itemLabel}</th>
                </tr>
              </thead>
              <tbody>
                {appointments
                  .filter(a=>a.clientId===clientHistoryModal.id || a.clientDni===clientHistoryModal.dni)
                  .sort((a,b)=>new Date(b.date)-new Date(a.date))
                  .map(h=>(
                    <tr key={h.id} className="border-b border-slate-800">
                      <td className="p-2">{new Date(h.date).toLocaleDateString()}</td>
                      <td>#{h.orderId}</td>
                      <td>{h.serviceType}</td>
                      <td>{h.bikeModel}</td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>

        </Card>
      </div>
    )}

    {/* ===== TOGGLE ===== */}
    <div className="flex justify-end gap-2">
      <button onClick={()=>setClientsViewMode('cards')} className={`px-3 py-1 rounded ${clientsViewMode==='cards'?'bg-blue-600 text-white':'bg-slate-800 text-slate-300'}`}>Cards</button>
      <button onClick={()=>setClientsViewMode('list')} className={`px-3 py-1 rounded ${clientsViewMode==='list'?'bg-blue-600 text-white':'bg-slate-800 text-slate-300'}`}>Lista</button>
    </div>

    {/* ===== CARDS / TABLA ===== */}
    {clientsViewMode === 'cards' ? (

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {clients.map(client=>{
          const services=appointments.filter(a=>(a.clientId===client.id||a.clientDni===client.dni)&&a.status==='retirado');
          const last=services.length?new Date(Math.max(...services.map(s=>new Date(s.date)))):null;

          return (
            <Card key={client.id} className="bg-slate-900 border-slate-700 p-4">

              <h3 className="text-white font-bold text-lg">{client.name}</h3>
              <p className="text-xs text-slate-400 font-mono">DNI {client.dni}</p>

              <div className="grid grid-cols-2 gap-3 mt-3 text-center">
                <div className="bg-slate-800 p-2 rounded">
                  <div className="text-xs text-slate-400">Servicios</div>
                  <div className="text-xl text-blue-400">{services.length}</div>
                </div>

                <div className="bg-slate-800 p-2 rounded">
                  <div className="text-xs text-slate-400">Último</div>
                  <div className="text-sm text-slate-200">{last?last.toLocaleDateString():'-'}</div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="ghost" theme={theme} onClick={()=>sendWhatsApp(client.phone,client.name,client.bikeModel||'bici')}>
                  <MessageCircle size={14}/>
                </Button>

                <Button variant="ghost" theme={theme} onClick={()=>setClientHistoryModal(client)}>
                  <FileClock size={14}/>
                </Button>

                <Button variant="ghost" theme={theme} onClick={()=>setEditingClient(client)}>
                  <Edit size={14}/>
                </Button>
              </div>

            </Card>
          );
        })}

      </div>

    ) : (

      <table className="w-full text-sm text-slate-200">
        <thead className="bg-slate-800">
          <tr>
            <th className="p-2">Cliente</th>
            <th>DNI</th>
            <th>Servicios</th>
            <th>Último</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {clients.map(client=>{
            const services=appointments.filter(a=>(a.clientId===client.id||a.clientDni===client.dni)&&a.status==='retirado');
            const last=services.length?new Date(Math.max(...services.map(s=>new Date(s.date)))):null;

            return (
              <tr key={client.id} className="border-b border-slate-800">
                <td className="p-2">{client.name}</td>
                <td>{client.dni}</td>
                <td className="text-center">{services.length}</td>
                <td>{last?last.toLocaleDateString():'-'}</td>
                <td>
                  <Button variant="ghost" theme={theme} onClick={()=>setClientHistoryModal(client)}><FileClock size={14}/></Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

    )}

  </div>
)}


        {subView === 'mechanics-mgmt' && appUser.isAdmin && <div className="max-w-3xl mx-auto"><Card theme={theme} className="mb-8 border-blue-500/30 shadow-blue-900/10"><div className="flex items-center gap-3 mb-6"><div className="bg-blue-500/20 p-3 rounded-full"><Shield size={24} className="text-blue-400"/></div><h3 className="text-2xl font-bold text-white">Gestión de {activeIndustry.staffLabel}s</h3></div><form onSubmit={addMechanic} className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-900/50 p-5 rounded-2xl border border-slate-800 mb-4"><div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre</label><input required value={newMechName} onChange={e=>setNewMechName(e.target.value)} className="w-full bg-slate-950 text-white rounded-xl p-3 text-sm border border-slate-800 focus:border-blue-500 outline-none" placeholder="Nombre"/></div><div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">DNI (Usuario)</label><input required value={newMechDni} onChange={e=>setNewMechDni(e.target.value)} type="number" className="w-full bg-slate-950 text-white rounded-xl p-3 text-sm border border-slate-800 focus:border-blue-500 outline-none" placeholder="DNI"/></div><div className="space-y-1 relative"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contraseña</label><input required value={newMechPassword} onChange={e=>setNewMechPassword(e.target.value)} type="text" className="w-full bg-slate-950 text-white rounded-xl p-3 text-sm border border-slate-800 focus:border-blue-500 outline-none" /><div className="absolute top-8 right-3 text-xs text-slate-600 select-none">Default</div></div><div className="md:col-span-3 flex items-center justify-between pt-2"><div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"><input type="checkbox" checked={newMechIsAdmin} onChange={e=>setNewMechIsAdmin(e.target.checked)} className="rounded border-slate-700 bg-slate-800 text-blue-600 w-4 h-4"/><label className="text-sm text-slate-300 font-medium">¿Permisos de Admin?</label></div><Button type="submit" variant="admin" className="px-8"><Plus size={18}/> Crear Usuario</Button></div></form></Card><div className="space-y-3">{mechanics.map(m=><div key={m.id} className="flex justify-between items-center bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700 hover:border-slate-600 transition"><div className="flex items-center gap-4"><div className={`p-3 rounded-full ${m.isAdmin?'bg-blue-500/20 text-blue-400':'bg-slate-700 text-slate-400'}`}>{m.isAdmin?<Shield size={20}/>:<Wrench size={20}/>}</div><div><p className="text-white font-bold flex items-center gap-2 text-lg">{m.name}{m.isAdmin && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 uppercase tracking-wider font-bold">Admin</span>}</p><p className="text-sm text-slate-500 font-mono">DNI: {m.dni}</p></div></div><div className="flex gap-2"><Button variant="secondary" className="p-2.5 h-auto rounded-lg bg-slate-900 border-slate-800 hover:bg-slate-800" onClick={()=>triggerResetPassword(m.id, m.name)} title={`Resetear a ${GENERIC_PASS}`}><RotateCcw size={16}/></Button><Button variant="danger" className="p-2.5 h-auto rounded-lg" onClick={()=>triggerRemoveMechanic(m.id, m.name)}><Trash2 size={16}/></Button></div></div>)}</div></div>}
        
        {subView === 'config' && <div className="max-w-2xl mx-auto space-y-8">
            {/* --- SELECTOR DE INDUSTRIA (NUEVO) --- */}
            <Card theme={theme} className="border-blue-500/30 shadow-blue-900/10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Store size={24} className="text-blue-400"/> Rubro del Negocio
                    </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(INDUSTRIES).map(([key, config]) => {
                        const IndustryIcon = IconMap[config.icons.item] || Store;
                        const isSelected = shopConfig.industry === key;
                        return (
                            <button
                                key={key}
                                onClick={() => {
                                    setShopConfig({ ...shopConfig, industry: key });
                                    
                                }}
                                className={`relative p-4 rounded-xl border flex flex-col items-center gap-3 transition-all duration-300 ${isSelected ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40 scale-105 z-10' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white hover:border-slate-500'}`}
                            >
                                {isSelected && <div className="absolute top-2 right-2"><CheckCircle size={16} className="text-white"/></div>}
                                <div className={`p-3 rounded-full ${isSelected ? 'bg-white/20' : 'bg-slate-900'}`}><IndustryIcon size={24} /></div>
                                <div className="text-center"><span className="block font-bold text-sm">{config.label}</span><span className="text-[10px] opacity-70 uppercase tracking-wider">{config.staffLabel}</span></div>
                            </button>
                        );
                    })}
                </div>
            </Card>

            {/* --- CONFIGURACIÓN DE AGENDA --- */}
            <Card theme={theme} className="mt-8 border-purple-500/30 shadow-purple-900/10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Clock size={24} className="text-purple-400"/> Configuración de Horarios</h3>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Tipo de Agenda</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setShopConfig({...shopConfig, scheduleMode: 'blocks'})} className={`p-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${shopConfig.scheduleMode === 'blocks' ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-800 text-slate-400 border-slate-700'}`}><Sun size={20}/> Por Bloques (Mañana/Tarde)</button>
                            <button onClick={() => setShopConfig({...shopConfig, scheduleMode: 'slots'})} className={`p-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${shopConfig.scheduleMode === 'slots' ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-800 text-slate-400 border-slate-700'}`}><List size={20}/> Horarios Exactos (Turnos)</button>
                        </div>
                    </div>
                    {shopConfig.scheduleMode === 'slots' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4">
                            <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Hora Apertura</label><select value={shopConfig.openHour} onChange={e=>setShopConfig({...shopConfig, openHour: parseInt(e.target.value)})} className="w-full bg-slate-950 border-slate-800 rounded-xl p-3 text-white outline-none">{[8,9,10,11,12,13,14].map(h => <option key={h} value={h}>{h}:00 hs</option>)}</select></div>
                            <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Hora Cierre</label><select value={shopConfig.closeHour} onChange={e=>setShopConfig({...shopConfig, closeHour: parseInt(e.target.value)})} className="w-full bg-slate-950 border-slate-800 rounded-xl p-3 text-white outline-none">{[16,17,18,19,20,21,22,23].map(h => <option key={h} value={h}>{h}:00 hs</option>)}</select></div>
                            <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Duración Turno</label><select value={shopConfig.slotDuration} onChange={e=>setShopConfig({...shopConfig, slotDuration: parseInt(e.target.value)})} className="w-full bg-slate-950 border-slate-800 rounded-xl p-3 text-white outline-none"><option value={30}>30 Minutos</option><option value={45}>45 Minutos</option><option value={60}>1 Hora</option><option value={90}>1 Hora 30min</option></select></div>
                        </div>
                    )}
                </div>
            </Card>
            
            <Card theme={theme}>
                <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4"><h3 className="text-xl font-bold text-white flex items-center gap-2"><Settings size={24} className="text-slate-400"/> Configuración del {activeIndustry.placeLabel}</h3>{configSuccess && <span className="text-emerald-400 text-sm font-bold animate-in fade-in bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-500/20">¡Cambios Guardados!</span>}</div>
                <div className="space-y-8">
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Días Laborables</label>
                        <div className="flex gap-2 flex-wrap">{['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].map((day,idx)=><button key={idx} onClick={()=>{const n=shopConfig.workDays.includes(idx)?shopConfig.workDays.filter(d=>d!==idx):[...shopConfig.workDays,idx];setShopConfig({...shopConfig,workDays:n})}} className={`w-12 h-12 rounded-xl text-sm font-bold transition-all ${shopConfig.workDays.includes(idx)?'bg-orange-600 text-white shadow-lg shadow-orange-900/30 scale-110':'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}>{day.slice(0,3)}</button>)}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Nombre del {activeIndustry.placeLabel}</label><input value={shopConfig.shopName} onChange={e=>setShopConfig({...shopConfig,shopName:e.target.value})} className="w-full bg-slate-950 border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-blue-500 transition" /></div><div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Teléfono</label><input value={shopConfig.shopPhone} onChange={e=>setShopConfig({...shopConfig,shopPhone:e.target.value})} className="w-full bg-slate-950 border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-blue-500 transition" /></div><div className="md:col-span-2"><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Dirección</label><input value={shopConfig.shopAddress} onChange={e=>setShopConfig({...shopConfig,shopAddress:e.target.value})} className="w-full bg-slate-950 border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-blue-500 transition" /></div><div className="md:col-span-2"><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Logo del {activeIndustry.placeLabel}</label><div className="flex items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">{shopConfig.logoUrl && <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700 bg-black"><img src={shopConfig.logoUrl} className="w-full h-full object-cover"/><button onClick={()=>setShopConfig({...shopConfig, logoUrl: ''})} className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-bl hover:bg-red-700 transition"><Trash2 size={12}/></button></div>}<div className="flex-1"><label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition inline-flex items-center gap-2 border border-slate-700"><Upload size={16}/> Subir Imagen <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload}/></label><p className="text-xs text-slate-500 mt-2">Recomendado: 200x200px. Máx 500KB.</p></div></div></div><div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Límite de Turnos por Día</label><div className="flex items-center gap-4"><input type="number" value={shopConfig.maxPerDay} onChange={e=>setShopConfig({...shopConfig,maxPerDay:parseInt(e.target.value)})} className="w-24 bg-slate-900 border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-blue-500 transition text-center font-bold text-lg" /><span className="text-slate-500 text-sm">turnos permitidos por jornada.</span></div></div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Inicio de Implementación</label><input type="date" value={shopConfig.implementationDate} onChange={e=>setShopConfig({...shopConfig,implementationDate:e.target.value})} className="w-full bg-slate-950 border-slate-800 rounded-xl p-3.5 text-white [color-scheme:dark] outline-none focus:border-blue-500 transition" /></div></div>
                    <Button onClick={()=>saveConfig()} className="w-full py-4 text-lg mt-4 shadow-blue-900/30">Guardar Cambios</Button>
                </div>
            </Card>

            <Card theme={theme}>
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-white flex items-center gap-2"><CalendarX size={24} className="text-red-400"/> Gestión de Calendario</h3></div>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 mb-6">
                    <p className="text-sm text-slate-400 mb-4">Bloquea fechas específicas (feriados, vacaciones) para que los clientes no puedan reservar.</p>
                    <div className="flex gap-4">
                        <input type="date" value={dateToBlock} onChange={e=>setDateToBlock(e.target.value)} className="bg-slate-950 border border-slate-800 text-white rounded-xl p-3 outline-none focus:border-red-500" />
                        <Button onClick={handleBlockDate} variant="danger" className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30">Bloquear Fecha</Button>
                    </div>
                </div>
                <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Fechas Bloqueadas Activas</h4>
                    <div className="flex flex-wrap gap-3">
                        {(!shopConfig.blockedDates || shopConfig.blockedDates.length === 0) && <p className="text-sm text-slate-600 italic">No hay fechas bloqueadas.</p>}
                        {(shopConfig.blockedDates || []).map(date => (
                            <div key={date} className="bg-red-900/20 border border-red-500/30 text-red-300 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm">
                                <CalendarX size={14}/>
                                {new Date(date).toLocaleDateString()}
                                <button onClick={()=>handleUnblockDate(date)} className="hover:text-white ml-1"><XCircle size={14}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>}
        
        {subView === 'stats' && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2 flex justify-end gap-2 mb-2">
                <button onClick={() => setStatsPeriod('week')} className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${statsPeriod === 'week' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>Semana</button>
                <button onClick={() => setStatsPeriod('month')} className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${statsPeriod === 'month' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>Mes</button>
                <button onClick={() => setStatsPeriod('all')} className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${statsPeriod === 'all' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>Histórico</button>
            </div>
            <Card theme={theme}><h3 className="text-white font-bold mb-6 flex items-center gap-2 text-lg"><BarChart3 size={24} className="text-blue-500"/> Reparaciones por {activeIndustry.staffLabel}</h3><div className="space-y-6">{mechanics.filter(m=>!m.isAdmin).map(m=>{const count=getStatsAppointments().filter(a=>a.mechanicId===m.dni&&a.status==='listo').length; const active=appointments.filter(a=>a.mechanicId===m.dni&&a.status==='en-proceso').length; return <div key={m.id} className="bg-slate-900/50 p-3 rounded-xl border border-slate-800"><div className="flex justify-between items-center text-sm text-slate-300 mb-2 font-medium"><span>{m.name}</span><div className="flex gap-3"><span className="text-blue-400 text-xs bg-blue-900/20 px-2 py-0.5 rounded border border-blue-900/30">{active} Activas</span><span className="text-emerald-400 font-bold">{count} Finalizadas</span></div></div><div className="h-3 bg-slate-700/50 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000" style={{width:`${Math.min((count/20)*100,100)}%`}}></div></div></div>})}</div></Card><Card theme={theme}><h3 className="text-white font-bold mb-6 flex items-center gap-2 text-lg"><Timer size={24} className="text-emerald-500"/> Eficiencia</h3><div className="flex flex-col items-center justify-center py-10"><div className="text-6xl font-bold text-white mb-2 tracking-tighter">{(() => { const finished = getStatsAppointments().filter(a => a.status === 'listo' && a.startedAt && a.finishedAt); if (!finished.length) return '0h'; const totalMs = finished.reduce((acc, curr) => acc + (new Date(curr.finishedAt) - new Date(curr.startedAt)), 0); const avgMs = totalMs / finished.length; const hrs = Math.floor(avgMs / 3600000); return `${hrs}h ${Math.round((avgMs % 3600000) / 60000)}m`; })()}</div><p className="text-slate-400 text-sm bg-slate-900 px-3 py-1 rounded-full border border-slate-800">Tiempo promedio en {activeIndustry.placeLabel}</p></div></Card></div>}
    </main></div>
  );
}