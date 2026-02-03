import React, { useState, useEffect } from 'react';
import { 
  Calendar, MessageCircle, BarChart3, Users, 
  CheckCircle, ArrowRight, Menu, X, Clock,
  Scissors, Stethoscope, Dumbbell, Briefcase, 
  Printer, Layout, ShieldCheck, 
  Globe, LogIn, Search, Loader2, Star, Check,
  HelpCircle
} from 'lucide-react';

// --- REEMPLAZA CON TUS RUTAS REALES ---
import imgLogin from '../assets/login.png'; 
import imgProfile from '../assets/perfil.png';
import imgMain from '../assets/turno.png';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [shopNameInput, setShopNameInput] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentRubro, setCurrentRubro] = useState(0);

  const rubrosRotativos = [
    "Tu Bicicletería", 
    "Tu Taller", 
    "Tu Barbería", 
    "Tu Consultorio", 
    "Tu Gimnasio"
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRubro((prev) => (prev + 1) % rubrosRotativos.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const whatsappNumber = "5493855935803"; 
  const whatsappMessage = encodeURIComponent("Hola! 👋 Vi TurnoMov y quiero recibir asesoramiento para mi negocio. ¿Cómo funciona el mes gratis?");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const handleTenantLogin = (e) => {
      e.preventDefault();
      if (!shopNameInput.trim()) return;
      setIsRedirecting(true);
      const subdomain = shopNameInput.toLowerCase().replace(/[^a-z0-9-]/g, '');
      setTimeout(() => {
          window.location.href = `https://${subdomain}.turnomov.com.ar`;
      }, 800);
  };

  const features = [
    {
      icon: <Layout className="w-6 h-6 text-orange-500" />,
      title: "Tablero de Control Visual",
      desc: "Gestione sus trabajos con un tablero tipo Kanban. Arrastre tarjetas para cambiar estados de reparación o servicio."
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-green-500" />,
      title: "WhatsApp Automático",
      desc: "Notifique a sus clientes cuando su turno o trabajo esté listo con un solo clic, profesionalizando la comunicación."
    },
    {
      icon: <Printer className="w-6 h-6 text-blue-500" />,
      title: "Tickets y Órdenes",
      desc: "Genere órdenes de servicio y deslindes legales automáticamente en PDF o formato para impresora térmica."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-500" />,
      title: "Portal de Autogestión",
      desc: "Sus clientes pueden consultar el estado de su turno y reprogramar de forma autónoma con su DNI."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-orange-500/30 overflow-x-hidden pb-20 md:pb-0">
      
      {/* --- BOTÓN FLOTANTE AYUDA (IZQUIERDA) --- */}
      <div className="fixed bottom-6 left-6 z-[100] hidden md:block animate-in fade-in slide-in-from-left-10 duration-700">
        <a 
          href="/ayuda"
          className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-300 px-4 py-2.5 rounded-full hover:bg-slate-800 hover:text-white transition-all shadow-2xl group"
        >
          <div className="bg-slate-800 p-1 rounded-full group-hover:text-orange-500 transition-colors">
            <HelpCircle size={18} />
          </div>
          <span className="text-sm font-bold">Centro de Ayuda</span>
        </a>
      </div>

      {/* --- BOTÓN FLOTANTE WHATSAPP (DERECHA) --- */}
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-[100] group flex items-center gap-3">
        <div className="bg-white text-slate-900 px-4 py-2 rounded-xl shadow-xl font-bold text-sm hidden md:block opacity-0 group-hover:opacity-100 transition-opacity absolute right-16 w-max pointer-events-none">
          ¿Dudas? Chat directo aquí 👋
        </div>
        <div className="relative">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping"></span>
            <div className="relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center">
                <MessageCircle size={28} fill="white" />
            </div>
        </div>
      </a>

      {/* --- NAV --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800 py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <div className="relative w-9 h-9 bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-white">
                   <Clock size={18} className="text-orange-500" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">TurnoMov</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#beneficios" className="text-sm font-medium hover:text-white transition">Funcionalidades</a>
              <a href="#precios" className="text-sm font-medium hover:text-white transition">Precios</a>
              <a href="/ayuda" className="text-sm font-medium text-slate-400 hover:text-orange-400 transition">Ayuda</a>
              
              <button onClick={() => setShowLoginModal(true)} className="text-sm font-bold text-slate-300 hover:text-white transition flex items-center gap-2 px-4 py-2 hover:bg-slate-800 rounded-lg">
                Soy Cliente
              </button>
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="bg-white text-slate-900 px-5 py-2 rounded-full font-bold text-sm hover:bg-slate-200 transition flex items-center gap-2 shadow-lg">
                <Star size={14} className="text-orange-500 fill-orange-500" /> 1 Mes Gratis
              </a>
            </div>

            <div className="md:hidden flex items-center gap-4">
              <a href="/ayuda" className="text-slate-400"><HelpCircle size={20}/></a>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-400 hover:text-white">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION (H1 SEO) --- */}
      <header className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-bold text-orange-400 mb-8">
            OFERTA LANZAMIENTO: PRIMER MES BONIFICADO
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
            El <span className="text-orange-500">Sistema de turnos online</span> para <br />
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500">
                {rubrosRotativos[currentRubro]}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Gestione su negocio con profesionalismo. Centralice su agenda digital, órdenes de trabajo y comunicación automática con clientes en una plataforma SaaS líder en Argentina.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="w-full sm:w-auto px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold text-lg transition shadow-xl flex items-center justify-center gap-2">
              <MessageCircle size={20} /> Pedir mi Mes Gratis
            </a>
            <button onClick={() => setShowLoginModal(true)} className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 rounded-2xl font-bold text-lg transition flex items-center justify-center gap-2">
              <LogIn size={20} /> Ya tengo cuenta
            </button>
          </div>

          <div className="mt-20 relative max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-center gap-8 md:gap-0">
                <img src={imgLogin} alt="Sistema de turnos online - Pantalla de acceso" className="w-64 md:w-72 md:-mr-12 md:mt-12 rounded-[2.5rem] border-[6px] border-slate-900 shadow-2xl z-10" />
                <div className="relative w-72 md:w-80 z-20 shadow-2xl">
                    <img src={imgMain} alt="Agenda digital TurnoMov - Vista de calendario" className="w-full h-auto rounded-[2.5rem] border-[6px] border-slate-800 shadow-2xl" />
                </div>
                <img src={imgProfile} alt="Perfil de gestión de clientes TurnoMov" className="w-64 md:w-72 md:-ml-12 md:mt-12 rounded-[2.5rem] border-[6px] border-slate-900 shadow-2xl z-10" />
          </div>
        </div>
      </header>

      {/* --- BLOQUE SEO --- */}
      <section className="py-20 bg-slate-950 border-y border-slate-900">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-6">Por qué implementar un sistema de turnos en su negocio</h2>
          <div className="grid md:grid-cols-2 gap-8 text-slate-400 text-sm leading-relaxed">
            <p>
              En <strong>Argentina y Latinoamérica</strong>, un <strong>sistema de turnos online</strong> como TurnoMov permite que su comercio funcione las 24 horas. Sus clientes ya no dependen de un mensaje de WhatsApp; reservan en su propia <strong>agenda digital</strong> personalizada en segundos.
            </p>
            <p>
              Nuestra plataforma SaaS está diseñada para rubros técnicos, estética y salud, ofreciendo recordatorios automáticos que reducen el ausentismo y mejoran la rentabilidad. Profesionalice su atención hoy mismo con TurnoMov.
            </p>
          </div>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section id="beneficios" className="py-24 bg-slate-900/30 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Mucho más que una simple agenda digital</h2>
            <p className="text-slate-400">Herramientas diseñadas para escalar la operatividad de su negocio.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-orange-500/30 transition-all shadow-lg group">
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition border border-slate-800">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRECIOS --- */}
      <section id="precios" className="py-24 max-w-5xl mx-auto px-4 scroll-mt-24">
         <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-[2.5rem] border border-slate-800 p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px]"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Planes adaptados a su crecimiento</h2>
            <div className="grid md:grid-cols-3 gap-6 relative z-10">
                <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-2xl opacity-70 flex flex-col justify-center">
                    <p className="text-slate-400 font-bold mb-2">Agenda Manual</p>
                    <p className="text-2xl font-bold text-slate-500 line-through">$0</p>
                </div>
                <div className="bg-slate-800 border-2 border-orange-500 p-8 rounded-3xl shadow-2xl transform md:-translate-y-4">
                    <h3 className="text-white font-bold text-xl mb-2">Mensual Full</h3>
                    <p className="text-4xl font-bold text-white my-4">Consultar</p>
                    <a href={whatsappLink} className="block w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-xl font-bold transition">Empezar Gratis</a>
                </div>
                <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-2xl flex flex-col justify-center">
                    <p className="text-white font-bold mb-2">Plan Semestral</p>
                    <p className="text-orange-400 font-bold text-sm">20% OFF</p>
                </div>
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-900 py-12 bg-slate-950 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Clock size={16} className="text-orange-500"/>
                <span className="font-bold text-slate-300 text-lg">TurnoMov</span>
            </div>
            <p>El sistema de turnos online más robusto para Argentina y Latinoamérica.</p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <span className="font-bold text-slate-300">Producto</span>
              <a href="#beneficios" className="hover:text-white transition">Funcionalidades</a>
              <a href="#precios" className="hover:text-white transition">Precios</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-bold text-slate-300">Soporte</span>
              <a href="/ayuda" className="text-orange-500/80 hover:text-orange-400 font-bold flex items-center gap-1">
                <HelpCircle size={14}/> Centro de Ayuda
              </a>
              <a href={whatsappLink} className="hover:text-green-500 transition">Contacto Directo</a>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p>&copy; {new Date().getFullYear()} TurnoMov.</p>
            <p className="mt-2">Santiago del Estero, Argentina.</p>
          </div>
        </div>
      </footer>

      {/* MODAL LOGIN (Lógica intacta) */}
      {showLoginModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl w-full max-w-md relative shadow-2xl">
                <button onClick={()=>setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X /></button>
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white">Ingresa a tu Negocio</h3>
                    <p className="text-slate-400 mt-2">Escribe tu identificador (subdominio).</p>
                </div>
                <form onSubmit={handleTenantLogin} className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 text-slate-500" size={20} />
                        <input 
                            autoFocus required value={shopNameInput}
                            onChange={(e)=>setShopNameInput(e.target.value)}
                            placeholder="Ej: nombre-negocio" 
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-orange-500 outline-none"
                        />
                    </div>
                    <button type="submit" disabled={isRedirecting} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
                        {isRedirecting ? <><Loader2 className="animate-spin"/> Entrando...</> : 'Ir a mi Panel'}
                    </button>
                </form>
            </div>
          </div>
      )}
    </div>
  );
}