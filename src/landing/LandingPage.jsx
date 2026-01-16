import React, { useState, useEffect } from 'react';
import { 
  Calendar, MessageCircle, BarChart3, Users, 
  CheckCircle, ArrowRight, Menu, X, Clock,
  Scissors, Stethoscope, Dumbbell, Briefcase, 
  Printer, Layout, ShieldCheck, 
  Globe, LogIn, Search, Loader2, Star, Check
} from 'lucide-react';

// --- IMPORTANTE: Reemplaza estas rutas con la ubicación real de tus imágenes ---
import imgLogin from '../assets/login.png'; 
import imgProfile from '../assets/perfil.png';
import imgMain from '../assets/turno.png';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [shopNameInput, setShopNameInput] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detectar scroll para efectos visuales del Navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- LÓGICA WHATSAPP (MODIFICAR EL NÚMERO AQUÍ) ---
  const whatsappNumber = "5493855935803"; 
  const whatsappMessage = encodeURIComponent("Hola! 👋 Vi TurnoMov y quiero recibir asesoramiento para mi negocio. ¿Cómo funciona el mes gratis?");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // --- LÓGICA DE REDIRECCIÓN A SUBDOMINIO ---
  const handleTenantLogin = (e) => {
      e.preventDefault();
      if (!shopNameInput.trim()) return;
      
      setIsRedirecting(true);
      
      // Limpiamos el input para que sea un subdominio válido
      const subdomain = shopNameInput.toLowerCase().replace(/[^a-z0-9-]/g, '');
      
      // Simulamos pequeña carga y redirigimos
      setTimeout(() => {
          window.location.href = `https://${subdomain}.turnomov.com.ar`;
      }, 800);
  };

  const features = [
    {
      icon: <Layout className="w-6 h-6 text-orange-500" />,
      title: "Tablero de Control Visual",
      desc: "Gestioná tus trabajos con un tablero tipo Kanban o Lista. Arrastrá tarjetas visualmente para cambiar estados."
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-green-500" />,
      title: "WhatsApp Automático",
      desc: "Avisá al cliente cuando su trabajo está 'Listo' con un solo clic. Sin agendar contactos en tu celular."
    },
    {
      icon: <Printer className="w-6 h-6 text-blue-500" />,
      title: "Tickets Profesionales",
      desc: "Imprimí órdenes de servicio y deslindes de responsabilidad legal automáticamente (PDF o Térmica)."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-500" />,
      title: "Portal de Clientes",
      desc: "Tus clientes pueden ver el estado de su reparación y reprogramar turnos ellos mismos con su DNI."
    }
  ];

  const rubros = [
    { icon: <Briefcase size={20} />, name: "Servicio Técnico", desc: "Computación, Celulares." },
    { icon: <Scissors size={20} />, name: "Estética", desc: "Barberías, Peluquerías." },
    { icon: <Dumbbell size={20} />, name: "Deportes", desc: "Canchas, Gym." },
    { icon: <Stethoscope size={20} />, name: "Salud", desc: "Kinesiología, Consultorios." },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-orange-500/30 overflow-x-hidden pb-20 md:pb-0">
      
      {/* --- BOTÓN FLOTANTE DE WHATSAPP (STICKY) --- */}
      <a 
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[100] group flex items-center gap-3 animate-in slide-in-from-bottom-10 duration-700 delay-1000"
      >
        {/* Tooltip del botón */}
        <div className="bg-white text-slate-900 px-4 py-2 rounded-xl shadow-xl font-bold text-sm hidden md:block opacity-0 group-hover:opacity-100 transition-opacity absolute right-16 w-max pointer-events-none">
          ¿Te ayudo a configurar tu cuenta? 👋
        </div>
        
        {/* Icono con animación de pulso */}
        <div className="relative">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping"></span>
            <div className="relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all hover:scale-110 flex items-center justify-center">
                <MessageCircle size={28} fill="white" className="text-white" />
            </div>
        </div>
      </a>

      {/* --- MODAL LOGIN --- */}
      {showLoginModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl w-full max-w-md relative shadow-2xl">
                <button onClick={()=>setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X /></button>
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-tr from-slate-800 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-600">
                        <Clock size={32} className="text-orange-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Ingresa a tu Taller</h3>
                    <p className="text-slate-400 mt-2">Escribe el identificador de tu negocio.</p>
                </div>
                <form onSubmit={handleTenantLogin} className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 text-slate-500" size={20} />
                        <input 
                            autoFocus
                            required
                            value={shopNameInput}
                            onChange={(e)=>setShopNameInput(e.target.value)}
                            placeholder="Ej: demo, bicperbanda" 
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                            disabled={isRedirecting}
                        />
                    </div>
                    <button type="submit" disabled={isRedirecting} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2">
                        {isRedirecting ? <><Loader2 className="animate-spin"/> Entrando...</> : 'Ir a mi Panel'}
                    </button>
                    <div className="text-xs text-center text-slate-500 mt-4 bg-slate-800/50 p-2 rounded border border-slate-800">
                        <p className="font-bold text-slate-400 mb-1">¿Querés probar?</p>
                        Usa el código: <span className="text-orange-400 font-mono cursor-pointer hover:underline" onClick={()=>setShopNameInput('demo')}>demo</span>
                    </div>
                </form>
            </div>
          </div>
      )}

      {/* --- NAV --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800 py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            {/* LOGO */}
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <div className="relative w-9 h-9 bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-white shadow-xl">
                   <Clock size={18} className="text-orange-500" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">TurnoMov</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#beneficios" className="text-sm font-medium hover:text-white transition">Funcionalidades</a>
              <a href="#precios" className="text-sm font-medium hover:text-white transition">Precios</a>
              
              <button 
                onClick={() => setShowLoginModal(true)}
                className="text-sm font-bold text-slate-300 hover:text-white transition flex items-center gap-2 px-4 py-2 hover:bg-slate-800 rounded-lg"
              >
                Soy Cliente
              </button>

              <a href={whatsappLink} target="_blank" rel="noreferrer" className="bg-white text-slate-900 px-5 py-2 rounded-full font-bold text-sm hover:bg-slate-200 transition hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.15)] flex items-center gap-2">
                <Star size={14} className="text-orange-500 fill-orange-500" /> 1 Mes Gratis
              </a>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-400 hover:text-white">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          
          {/* OFERTA BADGE */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-bold text-orange-400 mb-8 animate-in fade-in slide-in-from-bottom-4 shadow-lg shadow-orange-900/10 hover:bg-orange-500/20 transition cursor-default">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            OFERTA LANZAMIENTO: PRIMER MES BONIFICADO
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
            El Sistema Operativo para <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Negocios de Servicios</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Dejá de perder tiempo y clientes coordinando por WhatsApp. Centralizá turnos, órdenes de trabajo y clientes en una sola plataforma.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="w-full sm:w-auto px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold text-lg transition shadow-[0_0_30px_rgba(234,88,12,0.3)] flex items-center justify-center gap-2 hover:-translate-y-1">
              <MessageCircle size={20} /> Pedir mi Mes Gratis
            </a>
            <button onClick={() => setShowLoginModal(true)} className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 rounded-2xl font-bold text-lg transition flex items-center justify-center gap-2 hover:-translate-y-1">
              <LogIn size={20} /> Ya tengo cuenta
            </button>
          </div>
          
          <p className="mt-6 text-sm text-slate-500 flex items-center justify-center gap-2">
             <Check size={14} className="text-green-500" /> Sin tarjeta de crédito
             <span className="mx-2">•</span>
             <Check size={14} className="text-green-500" /> Cancelá cuando quieras
          </p>

          {/* UI PREVIEW */}
          <div className="mt-20 relative max-w-6xl mx-auto">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-500/10 blur-[100px] rounded-full -z-10"></div>
             
             <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-0 perspective-1000">
                {/* 1. Izquierda: Login */}
                <div className="relative w-64 md:w-72 md:-mr-12 md:mt-12 z-10 transition-all duration-500 hover:z-30 hover:scale-105">
                    <img src={imgLogin} alt="App Login" className="w-full h-auto rounded-[2.5rem] border-[6px] border-slate-900 shadow-2xl" />
                </div>
                {/* 2. Centro: Calendario */}
                <div className="relative w-72 md:w-80 z-20 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-105">
                    <img src={imgMain} alt="App Calendar" className="w-full h-auto rounded-[2.5rem] border-[6px] border-slate-800 shadow-2xl" />
                    {/* Badge "Turnos Web" */}
                    <div className="absolute -left-10 top-20 bg-slate-800/90 backdrop-blur border border-slate-700 p-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-right-4 fade-in duration-700 delay-300 hidden md:flex">
                        <div className="bg-orange-500/20 p-2 rounded-lg text-orange-500"><Globe size={20} /></div>
                        <div className="text-left">
                            <p className="text-xs text-slate-400 font-bold uppercase">Tu propia web</p>
                            <p className="text-white font-bold text-sm">tusubdominio.turnomov...</p>
                        </div>
                    </div>
                </div>
                {/* 3. Derecha: Perfil */}
                <div className="relative w-64 md:w-72 md:-ml-12 md:mt-12 z-10 transition-all duration-500 hover:z-30 hover:scale-105">
                     <img src={imgProfile} alt="App Profile" className="w-full h-auto rounded-[2.5rem] border-[6px] border-slate-900 shadow-2xl" />
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* --- RUBROS RAPIDOS --- */}
      <div className="py-10 border-y border-slate-900 bg-slate-950/50 overflow-hidden">
        <div className="flex gap-12 items-center justify-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500 flex-wrap px-4">
             {rubros.map((r,i) => (
                 <div key={i} className="flex items-center gap-2 text-slate-400 font-bold">
                     {r.icon} {r.name}
                 </div>
             ))}
        </div>
      </div>

      {/* --- FEATURES --- */}
      <div id="beneficios" className="py-24 bg-slate-900/30 border-b border-slate-800/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">No es un Excel. Es un Sistema.</h2>
            <p className="text-slate-400">Herramientas diseñadas para que tu negocio funcione aunque vos no estés mirando.</p>
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

      {/* --- PRECIOS & VALOR (MARKETING HOOK) --- */}
      <div id="precios" className="py-24 max-w-5xl mx-auto px-4 scroll-mt-24">
         <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-[2.5rem] border border-slate-800 p-8 md:p-16 text-center relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px]"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">
                Tu tranquilidad cuesta menos <br className="hidden md:block"/>que <span className="text-orange-500">una pizza al mes</span>.
            </h2>
            
            <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto relative z-10">
                ¿Cuánto vale para vos no tener que contestar WhatsApps un domingo? 
                TurnoMov se paga solo con el primer cliente que no perdés por desorganización.
            </p>

            <div className="grid md:grid-cols-3 gap-6 relative z-10">
                {/* Card 1: Gratis */}
                <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center opacity-70 scale-95">
                    <h3 className="text-slate-400 font-bold mb-2">Excel / Papel</h3>
                    <p className="text-2xl font-bold text-slate-500 line-through">$0</p>
                    <p className="text-xs text-slate-500 mt-2">Pero perdés horas de vida</p>
                </div>

                {/* Card 2: Main Offer */}
                <div className="bg-slate-800 border-2 border-orange-500 p-8 rounded-3xl shadow-2xl shadow-orange-900/30 transform md:-translate-y-4 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-b-lg uppercase tracking-wider">
                        Recomendado
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">Suscripción Mensual</h3>
                    <div className="flex items-baseline justify-center gap-1 my-4">
                        <span className="text-4xl font-bold text-white">Consultar</span>
                    </div>
                    <ul className="text-left space-y-3 text-sm text-slate-300 mb-6">
                        <li className="flex gap-2"><CheckCircle size={16} className="text-orange-500 shrink-0"/> Usuarios Ilimitados</li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-orange-500 shrink-0"/> Recordatorios WhatsApp</li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-orange-500 shrink-0"/> Soporte Prioritario</li>
                    </ul>
                    <a href={whatsappLink} target="_blank" rel="noreferrer" className="block w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-xl font-bold transition">
                        Empezar con 1 Mes Gratis
                    </a>
                    <p className="text-[10px] text-slate-500 mt-3">Promo válida por tiempo limitado.</p>
                </div>

                 {/* Card 3: Anual */}
                 <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center hover:bg-slate-900 transition">
                    <h3 className="text-white font-bold mb-2">Plan Semestral</h3>
                    <p className="text-orange-400 font-bold text-sm">20% de Descuento</p>
                    <p className="text-xs text-slate-400 mt-2">Pagás 5 meses, usás 6</p>
                </div>
            </div>
         </div>
      </div>

      {/* --- METRICS --- */}
      <div id="metricas" className="pb-24 max-w-7xl mx-auto px-4">
         <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 md:p-12 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-xs bg-blue-900/20 px-3 py-1 rounded-full border border-blue-900/30">
                        <BarChart3 size={12}/> Rentabilidad
                    </div>
                    <h2 className="text-3xl font-bold text-white">Lo que no se mide, no se puede mejorar.</h2>
                    <p className="text-slate-400">
                        ¿Sabés cuál es tu servicio más rentable? ¿Qué empleado trabaja más rápido? TurnoMov te da las respuestas automáticamente.
                    </p>
                </div>
                {/* Fake Metric Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-white font-bold flex items-center gap-2"><Users size={18} className="text-slate-400"/> Rendimiento</h4>
                        <span className="text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded border border-green-900/30">+12% vs mes anterior</span>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span>Facturación Estimada</span>
                                <span className="text-white font-bold">$ 850.000</span>
                            </div>
                            <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 w-[70%] rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-900 py-12 bg-slate-950 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Clock size={16} className="text-orange-500"/>
                <span className="font-bold text-slate-300">TurnoMov</span>
            </div>
            <p>Santiago del Estero, Argentina.</p>
          </div>
          <div className="flex gap-6">
            <a href={whatsappLink} className="hover:text-green-500 transition flex items-center gap-2"><MessageCircle size={14}/> Contacto Directo</a>
            <button onClick={() => setShowLoginModal(true)} className="hover:text-white transition">Ingresar</button>
          </div>
          <div>
            &copy; {new Date().getFullYear()} TurnoMov.
          </div>
        </div>
      </footer>
    </div>
  );
}