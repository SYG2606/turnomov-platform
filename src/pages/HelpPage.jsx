import React, { useState } from 'react';
import { 
  User, Calendar, CheckCircle, Shield, Clock, FileText, 
  Wrench, MessageCircle, ChevronRight, HelpCircle, Search, 
  ArrowRight, Layout, Smartphone, LogIn
} from 'lucide-react';

// Componentes UI simples para esta página
const SectionTitle = ({ children, subtitle }) => (
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{children}</h2>
    <p className="text-slate-400 max-w-2xl mx-auto">{subtitle}</p>
  </div>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all duration-300 hover:shadow-xl ${className}`}>
    {children}
  </div>
);

const StepNumber = ({ num, color }) => (
  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-4 ${color === 'orange' ? 'bg-orange-600 text-white' : 'bg-blue-600 text-white'}`}>
    {num}
  </div>
);

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState('client'); // 'client' | 'admin'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-orange-500/30">
      
      {/* --- HERO HEADER --- */}
      <div className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-slate-950 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-400 mb-6">
            <HelpCircle size={14} /> Centro de Ayuda TurnoMov
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            ¿Cómo podemos <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">ayudarte?</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            Guías rápidas y visuales para gestionar tus turnos sin complicaciones.
          </p>
          
          {/* Tabs Selector */}
          <div className="inline-flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
            <button 
              onClick={() => setActiveTab('client')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'client' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <User size={18} /> Soy Cliente
            </button>
            <button 
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'admin' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <Shield size={18} /> Soy Negocio
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-16">
        
        {/* --- CONTENIDO CLIENTES --- */}
        {activeTab === 'client' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <SectionTitle subtitle="Reservar un turno nunca fue tan fácil. Sigue estos 3 pasos simples desde tu celular o computadora.">
              Tu Turno en 3 Pasos
            </SectionTitle>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Conector visual (línea) para desktop */}
              <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-orange-900/0 via-orange-900/50 to-orange-900/0 border-t border-dashed border-slate-700 -z-10" />

              <Card className="relative bg-gradient-to-b from-slate-800 to-slate-900">
                <StepNumber num="1" color="orange" />
                <div className="mb-4 bg-orange-500/10 w-16 h-16 rounded-2xl flex items-center justify-center text-orange-500">
                  <LogIn size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ingreso Rápido</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Ingresa solo con tu DNI. Si es tu primera vez, el sistema te pedirá tu nombre y teléfono para crear tu perfil automáticamente.
                </p>
              </Card>

              <Card className="relative bg-gradient-to-b from-slate-800 to-slate-900">
                <StepNumber num="2" color="orange" />
                <div className="mb-4 bg-orange-500/10 w-16 h-16 rounded-2xl flex items-center justify-center text-orange-500">
                  <Calendar size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Elige Horario</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Selecciona el día en el calendario. Elige si prefieres venir por la <b>Mañana</b> o por la <b>Tarde</b> (o una hora exacta si está disponible).
                </p>
              </Card>

              <Card className="relative bg-gradient-to-b from-slate-800 to-slate-900">
                <StepNumber num="3" color="orange" />
                <div className="mb-4 bg-orange-500/10 w-16 h-16 rounded-2xl flex items-center justify-center text-orange-500">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">¡Listo!</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Confirmas y tu lugar está asegurado. Podrás ver el estado de tu servicio (En Espera, En Reparación, Listo) en tiempo real.
                </p>
              </Card>
            </div>

            <div className="mt-12 p-6 bg-orange-900/10 border border-orange-500/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
              <div className="flex items-center gap-4">
                <div className="bg-orange-600 p-3 rounded-full text-white"><Layout size={24}/></div>
                <div>
                  <h4 className="font-bold text-white">¿Necesitas ver tus turnos?</h4>
                  <p className="text-sm text-slate-400">Ingresa tu DNI en la portada y verás tu panel personal.</p>
                </div>
              </div>
              <a href="/" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2">
                Ir a Reservar <ArrowRight size={18}/>
              </a>
            </div>
          </div>
        )}

        {/* --- CONTENIDO ADMIN/NEGOCIO --- */}
        {activeTab === 'admin' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
             <SectionTitle subtitle="Entiende el ciclo de vida de un turno para gestionar tu negocio de forma eficiente.">
              Flujo de Trabajo del Staff
            </SectionTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Estado 1 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-slate-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
                <Card className="h-full border-slate-700">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-slate-700 text-slate-300 p-2 rounded-lg"><Clock size={24}/></div>
                    <span className="text-xs font-bold uppercase bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">Paso 1</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-200 mb-2">Pendiente</h3>
                  <p className="text-xs text-slate-400">El cliente reservó desde la web. Esperando que llegue al local.</p>
                </Card>
              </div>

              {/* Estado 2 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-amber-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
                <Card className="h-full border-amber-500/30 bg-amber-900/5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-amber-600 text-white p-2 rounded-lg shadow-lg shadow-amber-900/40"><FileText size={24}/></div>
                    <span className="text-xs font-bold uppercase bg-amber-900/30 text-amber-400 px-2 py-1 rounded border border-amber-500/30">Paso 2</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Recibido</h3>
                  <p className="text-xs text-slate-400">Cliente en mostrador. Haces click en <b>Recepcionar</b>. Se imprime el ticket y entra en cola.</p>
                </Card>
              </div>

               {/* Estado 3 */}
               <div className="group relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
                <Card className="h-full border-blue-500/30 bg-blue-900/5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-600 text-white p-2 rounded-lg shadow-lg shadow-blue-900/40"><Wrench size={24}/></div>
                    <span className="text-xs font-bold uppercase bg-blue-900/30 text-blue-400 px-2 py-1 rounded border border-blue-500/30">Paso 3</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">En Proceso</h3>
                  <p className="text-xs text-slate-400">El staff inicia el trabajo. Click en <b>Iniciar</b> para marcar quién lo está atendiendo.</p>
                </Card>
              </div>

               {/* Estado 4 */}
               <div className="group relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
                <Card className="h-full border-emerald-500/30 bg-emerald-900/5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-emerald-600 text-white p-2 rounded-lg shadow-lg shadow-emerald-900/40"><MessageCircle size={24}/></div>
                    <span className="text-xs font-bold uppercase bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30">Paso 4</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Listo</h3>
                  <p className="text-xs text-slate-400">Trabajo finalizado. Click en el <b>botón WhatsApp</b> para avisar al cliente que retire.</p>
                </Card>
              </div>
            </div>

            {/* Admin Tips */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-start gap-4">
                    <div className="bg-slate-800 p-2 rounded-lg text-slate-400"><Layout size={20}/></div>
                    <div>
                        <h4 className="font-bold text-white">Tablero Kanban</h4>
                        <p className="text-sm text-slate-500 mt-1">Usa la vista de columnas (ícono al lado del buscador) para arrastrar tarjetas visualmente.</p>
                    </div>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-start gap-4">
                    <div className="bg-slate-800 p-2 rounded-lg text-slate-400"><Smartphone size={20}/></div>
                    <div>
                        <h4 className="font-bold text-white">App Móvil</h4>
                        <p className="text-sm text-slate-500 mt-1">El sistema funciona perfecto en el celular. Los mecánicos pueden cambiar estados desde su móvil.</p>
                    </div>
                </div>
            </div>

          </div>
        )}

        {/* --- FAQ SECTION --- */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Preguntas Frecuentes</h3>
          <div className="space-y-4">
            <FaqItem question="¿Cómo cambio mi contraseña de Staff?">
              Al ingresar por primera vez con la clave genérica, el sistema te pedirá automáticamente que crees una nueva. Si la olvidaste, pide al administrador que la resetee.
            </FaqItem>
            <FaqItem question="¿Puedo cancelar un turno?">
              Si eres cliente, solo puedes reprogramar con 48hs de anticipación. Para cancelar definitivamente, debes contactar al local. Si eres admin, usa el ícono de basura en la tarjeta del turno.
            </FaqItem>
            <FaqItem question="¿El sistema envía WhatsApp automático?">
              No envía mensajes automáticos por sí solo (para evitar spam), pero te genera el mensaje listo y abre la App de WhatsApp con un solo clic para que tú le des "Enviar".
            </FaqItem>
          </div>
        </div>

      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 text-center">
        <p className="text-slate-500 mb-4">TurnoMov SaaS © 2026</p>
        <div className="flex justify-center gap-6 text-sm font-medium">
            <a href="/" className="text-slate-400 hover:text-white transition">Ir a la App</a>
            <span className="text-slate-700">•</span>
            <a href="#" className="text-slate-400 hover:text-white transition">Soporte Técnico</a>
        </div>
      </footer>
    </div>
  );
}

// Componente FAQ Simple
const FaqItem = ({ question, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900/30 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left font-semibold text-slate-200 hover:bg-slate-800 transition"
      >
        {question}
        <ChevronRight size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 pt-0 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50">
          {children}
        </div>
      </div>
    </div>
  );
};