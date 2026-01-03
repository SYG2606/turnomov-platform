import React, { useState } from 'react';
import { 
  Calendar, MessageCircle, BarChart3, Users, 
  CheckCircle, ArrowRight, Menu, X, Clock,
  Scissors, Stethoscope, Dumbbell, Briefcase, Zap,
  Printer, Layout, ShieldCheck, Smartphone, 
  Activity, Globe, Hexagon, Layers, Box, Command,
  LogIn, Search
} from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [shopNameInput, setShopNameInput] = useState('');

  // Función para redirigir al subdominio del cliente
  const handleTenantLogin = (e) => {
      e.preventDefault();
      if (!shopNameInput.trim()) return;
      
      // Limpiamos el input (convertir a slug, minúsculas, sin espacios)
      const subdomain = shopNameInput.toLowerCase().replace(/[^a-z0-9-]/g, '');
      
      // En producción esto sería: window.location.href = `https://${subdomain}.turnomov.com.ar`;
      alert(`Redirigiendo a: https://${subdomain}.turnomov.com.ar\n(Simulación SaaS)`);
  };

  const features = [
    {
      icon: <Layout className="w-6 h-6 text-orange-500" />,
      title: "Tablero de Control Visual",
      desc: "Gestioná tus trabajos con un tablero tipo Kanban o Lista. Arrastrá tarjetas desde 'En Espera' a 'En Proceso' y 'Terminado' visualmente."
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-green-500" />,
      title: "WhatsApp Inteligente",
      desc: "No solo recordatorios. Avisá automáticamente al cliente cuando su trabajo está 'Listo para Retirar' con un solo clic y sin agendar el contacto."
    },
    {
      icon: <Printer className="w-6 h-6 text-blue-500" />,
      title: "Impresión de Tickets",
      desc: "Generá órdenes de servicio profesionales en PDF o térmicas. Incluye talón para el cliente y deslinde de responsabilidad legal automáticamente."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-500" />,
      title: "Portal de Clientes",
      desc: "Tus clientes tienen su propio acceso con DNI. Pueden ver el estado de su reparación en tiempo real, historial y reprogramar turnos (con reglas de 48hs)."
    }
  ];

  const rubros = [
    { icon: <Briefcase size={20} />, name: "Servicio Técnico", desc: "Computación, Celulares, Electrodomésticos." },
    { icon: <Scissors size={20} />, name: "Estética y Belleza", desc: "Peluquerías, Barberías, Spas, Uñas." },
    { icon: <Dumbbell size={20} />, name: "Deportes", desc: "Canchas de Pádel, Clases, Gym." },
    { icon: <Stethoscope size={20} />, name: "Salud", desc: "Consultorios, Kinesiología, Nutrición." },
  ];

  const clientLogos = [
    { icon: <Hexagon size={24} />, name: "TechFix Labs" },
    { icon: <Activity size={24} />, name: "Vitality Salud" },
    { icon: <Layers size={24} />, name: "Urban Bikes" },
    { icon: <Box size={24} />, name: "Box Logistic" },
    { icon: <Command size={24} />, name: "Studio Code" },
    { icon: <Globe size={24} />, name: "Global Services" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-orange-500/30">
      
      {/* MODAL LOGIN DE CLIENTE (BUSCADOR DE TENANT) */}
      {showLoginModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl w-full max-w-md relative shadow-2xl">
                <button onClick={()=>setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X /></button>
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-tr from-slate-800 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-600">
                        <Clock size={32} className="text-orange-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Ingresa a tu Taller</h3>
                    <p className="text-slate-400 mt-2">Escribe el nombre de tu negocio para ir a tu panel.</p>
                </div>
                <form onSubmit={handleTenantLogin} className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 text-slate-500" size={20} />
                        <input 
                            autoFocus
                            value={shopNameInput}
                            onChange={(e)=>setShopNameInput(e.target.value)}
                            placeholder="Ej: bicperbanda" 
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                        />
                    </div>
                    <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-orange-900/20">
                        Ir a mi Panel
                    </button>
                    <p className="text-xs text-center text-slate-500 mt-4">
                        ¿Sos cliente final? Pídele el link directo a tu proveedor.
                    </p>
                </form>
            </div>
          </div>
      )}

      {/* NAV */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* LOGO */}
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500 blur-lg opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative w-9 h-9 bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition duration-300">
                   <Clock size={18} className="text-orange-500" strokeWidth={2.5} />
                   <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-slate-900"></div>
                </div>
              </div>
              <div className="flex flex-col justify-center -space-y-1">
                <span className="text-lg font-bold text-white tracking-tight leading-none group-hover:text-orange-500 transition duration-300">Turnomov</span>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Business OS</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#beneficios" className="text-sm font-medium hover:text-white transition">Funcionalidades</a>
              <a href="#rubros" className="text-sm font-medium hover:text-white transition">Rubros</a>
              
              {/* Botón Login para Clientes (Dueños de taller) */}
              <button 
                onClick={() => setShowLoginModal(true)}
                className="text-sm font-bold text-slate-300 hover:text-white transition flex items-center gap-2 px-4 py-2 hover:bg-slate-800 rounded-lg"
              >
                <LogIn size={16} /> Soy Cliente
              </button>

              <button className="bg-slate-100 text-slate-900 px-5 py-2 rounded-full font-bold text-sm hover:bg-white transition hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Empezar Gratis
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-400 hover:text-white">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-4">
            <a href="#beneficios" className="block text-sm font-medium text-slate-400 hover:text-white">Funcionalidades</a>
            <button onClick={() => setShowLoginModal(true)} className="block w-full text-left text-sm font-medium text-slate-400 hover:text-white">Ingresar (Login)</button>
            <button className="w-full bg-orange-600 text-white px-5 py-3 rounded-xl font-bold text-sm">
              Crear Cuenta
            </button>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <div className="relative overflow-hidden pt-20 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-semibold text-orange-400 mb-6 animate-in fade-in slide-in-from-bottom-4 shadow-lg shadow-orange-900/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Plataforma Multi-Cliente 2026
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
            El Sistema Operativo para <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Negocios de Servicios</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Turnomov organiza todo el ciclo de vida de tu servicio. Desde talleres mecánicos hasta consultorios, centraliza tus turnos y clientes en un solo lugar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="w-full sm:w-auto px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold text-lg transition shadow-xl shadow-orange-900/20 flex items-center justify-center gap-2 hover:-translate-y-0.5">
              Crear mi Taller <ArrowRight size={20} />
            </button>
            <button onClick={() => setShowLoginModal(true)} className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-2xl font-bold text-lg transition flex items-center justify-center gap-2 hover:-translate-y-0.5">
              <LogIn size={20} /> Ingresar a mi Cuenta
            </button>
          </div>

          {/* LOGO CLOUD */}
          <div className="mt-16 pt-8 border-t border-slate-800/50">
            <p className="text-sm text-slate-500 mb-6 font-medium">POTENCIANDO A NEGOCIOS LÍDERES</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
              {clientLogos.map((logo, i) => (
                <div key={i} className="flex items-center gap-2 group cursor-default transition-all duration-300 hover:opacity-100 hover:text-white text-slate-500">
                  <div className="group-hover:text-orange-500 transition-colors duration-300">{logo.icon}</div>
                  <span className="font-bold text-lg tracking-tight hidden sm:block">{logo.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* UI PREVIEW MOCKUP */}
          <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-2 shadow-2xl">
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video relative flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
                <div className="absolute inset-0 p-8 opacity-40 blur-sm pointer-events-none flex flex-col gap-4">
                    <div className="flex gap-4">
                        <div className="w-1/4 h-32 bg-slate-800 rounded-xl"></div>
                        <div className="w-1/4 h-32 bg-slate-800 rounded-xl"></div>
                        <div className="w-1/4 h-32 bg-slate-800 rounded-xl"></div>
                        <div className="w-1/4 h-32 bg-slate-800 rounded-xl"></div>
                    </div>
                    <div className="flex-1 bg-slate-800 rounded-xl"></div>
                </div>
                <div className="z-10 text-center space-y-6 max-w-lg">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 text-blue-500 mb-2 shadow-2xl relative group">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/40 transition-all duration-500"></div>
                    <Layout size={40} className="relative z-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Panel de Control en Tiempo Real</h3>
                  <p className="text-slate-400">
                    Visualizá turnos pendientes, trabajos en proceso y servicios terminados en una sola pantalla. Gestión de roles para dueños y empleados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES GRID */}
      <div id="beneficios" className="py-24 bg-slate-900/30 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Funcionalidades Profesionales</h2>
            <p className="text-slate-400">Herramientas diseñadas para la operación real de un negocio de servicios.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-orange-500/30 transition group hover:-translate-y-1 shadow-lg hover:shadow-orange-500/5">
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition border border-slate-800">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OPERATIONAL METRICS SECTION */}
      <div id="metricas" className="py-24 max-w-7xl mx-auto px-4">
         <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 md:p-12 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] group-hover:bg-blue-600/20 transition duration-1000"></div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-xs bg-blue-900/20 px-3 py-1 rounded-full border border-blue-900/30">
                        <BarChart3 size={12}/> Business Intelligence
                    </div>
                    <h2 className="text-3xl font-bold text-white">Tomá decisiones basadas en datos reales</h2>
                    <p className="text-slate-400">
                        Turnomov no solo agenda, mide. Nuestro sistema registra automáticamente cuándo ingresa un trabajo y cuándo se termina.
                    </p>
                </div>
                {/* Stats Preview Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative hover:border-slate-700 transition duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-white font-bold flex items-center gap-2"><Users size={18} className="text-slate-400"/> Productividad del Staff</h4>
                        <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">Este Mes</span>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span>Martín G.</span>
                                <span className="text-green-400 font-bold">24 Servicios</span>
                            </div>
                            <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[85%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 py-12 bg-slate-950 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span className="font-bold text-slate-300">Turnomov.com.ar</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Términos</a>
            <a href="#" className="hover:text-white transition">Privacidad</a>
            <a href="#" className="hover:text-white transition">Soporte</a>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Turnomov Argentina.
          </div>
        </div>
      </footer>
    </div>
  );
}