import React from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Smartphone, 
  Zap, 
  ShieldCheck, 
  Clock, 
  MessageSquare,
  HelpCircle
} from 'lucide-react';

export default function SistemaDeTurnosSEO() {
  const whatsappLink = "https://wa.me/5493855935803?text=Hola!%20Vi%20la%20guía%20de%20Sistema%20de%20Turnos%20y%20quiero%20probarlo.";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-orange-500/30">
      
      {/* --- HERO DE LA PÁGINA SEO --- */}
      <header className="relative pt-24 pb-16 border-b border-slate-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] -z-10"></div>
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Sistema de turnos online: La guía definitiva para digitalizar su negocio en Argentina
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl leading-relaxed">
            Descubra cómo implementar una agenda digital eficiente, reducir el ausentismo y profesionalizar la atención al cliente con TurnoMov.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        
        {/* --- SECCIÓN 1: INTRODUCCIÓN --- */}
        <article className="prose prose-invert max-w-none">
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">¿Qué es un sistema de turnos online y por qué su negocio lo necesita?</h2>
            <p className="text-lg leading-relaxed mb-4">
              Un <strong>sistema de turnos online</strong> es una plataforma tecnológica que permite a los clientes de un negocio reservar citas, servicios o turnos a través de internet, sin necesidad de realizar llamadas telefónicas o enviar mensajes manuales por WhatsApp. 
            </p>
            <p className="text-lg leading-relaxed">
              En el contexto actual de <strong>Argentina y Latinoamérica</strong>, la inmediatez es un factor decisivo. Los negocios que aún dependen de una agenda de papel o de responder mensajes de forma manual pierden, en promedio, un 30% de clientes potenciales que prefieren reservar fuera del horario comercial.
            </p>
          </section>

          {/* --- SECCIÓN 2: BENEFICIOS TÉCNICOS --- */}
          <section className="grid md:grid-cols-2 gap-12 mb-20 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Ventajas de usar una agenda digital</h2>
              <ul className="space-y-4">
                {[
                  "Disponibilidad 24/7: Su negocio recibe reservas mientras usted duerme.",
                  "Reducción del ausentismo: Recordatorios automáticos por WhatsApp.",
                  "Base de datos centralizada: Conozca la historia clínica o técnica de cada cliente.",
                  "Imagen profesional: Un subdominio propio (negocio.turnomov.com.ar) genera confianza.",
                  "Gestión de personal: Controle los horarios de sus empleados de forma independiente."
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <CheckCircle2 className="text-orange-500 shrink-0 mt-1" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-orange-500/20 p-3 rounded-2xl">
                  <Zap className="text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Impacto inmediato</h3>
              </div>
              <p className="text-sm italic">
                "Implementar TurnoMov nos permitió reducir las llamadas telefónicas en un 60% y eliminar por completo los errores de turnos duplicados."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-full"></div>
                <div>
                  <p className="text-white font-bold text-sm">Cliente de Estética</p>
                  <p className="text-xs text-slate-500">Buenos Aires, Argentina</p>
                </div>
              </div>
            </div>
          </section>

          {/* --- SECCIÓN 3: RUBROS (SEO KEYWORDS) --- */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Soluciones para cada sector en LATAM</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  title: "Salud y Consultorios", 
                  desc: "Kinesiología, psicología y medicina privada. Gestión de pacientes y turnos recurrentes." 
                },
                { 
                  title: "Estética y Barberías", 
                  desc: "Peluquerías y centros de estética. Visualización de servicios y selección de profesionales." 
                },
                { 
                  title: "Servicios Técnicos", 
                  desc: "Talleres mecánicos, service de celulares y computación. Seguimiento del estado del trabajo." 
                }
              ].map((rubro, i) => (
                <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                  <h3 className="text-orange-400 font-bold mb-3">{rubro.title}</h3>
                  <p className="text-sm text-slate-400">{rubro.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* --- SECCIÓN 4: PROBLEMAS COMUNES --- */}
          <section className="mb-20 bg-orange-600/5 border border-orange-500/20 p-10 rounded-[2.5rem]">
            <h2 className="text-3xl font-bold text-white mb-6">¿Por qué el WhatsApp personal no es suficiente?</h2>
            <p className="mb-6">
              Muchos emprendedores comienzan gestionando turnos por WhatsApp. Sin embargo, al escalar el negocio, surgen problemas críticos:
            </p>
            <div className="space-y-4 text-slate-300">
              <p><strong>1. Mensajes perdidos:</strong> Las solicitudes quedan abajo en el chat y el cliente se siente ignorado.</p>
              <p><strong>2. Falta de privacidad:</strong> Mezclar la vida personal con la laboral atendiendo clientes un domingo por la noche.</p>
              <p><strong>3. No-shows:</strong> El cliente olvida el turno porque no recibió un recordatorio formal.</p>
              <p><strong>4. Doble turno:</strong> El error humano de agendar a dos personas a la misma hora.</p>
            </div>
          </section>

          {/* --- SECCIÓN 5: FAQ SEO --- */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">Preguntas frecuentes sobre nuestro sistema de turnos</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                   <HelpCircle size={18} className="text-orange-500"/> ¿Es difícil configurar TurnoMov?
                </h3>
                <p>No. El sistema está diseñado para estar listo en menos de 5 minutos. Solo define tus servicios, horarios y ya puedes empezar a recibir reservas en tu subdominio.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                   <HelpCircle size={18} className="text-orange-500"/> ¿Funciona en toda Argentina?
                </h3>
                <p>Sí, TurnoMov está adaptado a los husos horarios y formatos de comunicación de Argentina y toda Latinoamérica.</p>
              </div>
            </div>
          </section>
        </article>

        {/* --- CTA FINAL --- */}
        <section className="text-center py-16 bg-gradient-to-tr from-slate-900 to-slate-800 rounded-3xl border border-slate-700 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">Empiece a organizar su agenda hoy</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto px-6">
            Únase a los cientos de negocios que ya digitalizaron su atención con TurnoMov. Primer mes bonificado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-6">
            <a href={whatsappLink} className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold transition shadow-lg flex items-center justify-center gap-2">
              Quiero probar TurnoMov Gratis
            </a>
            <a href="/" className="bg-slate-950 text-white border border-slate-700 px-8 py-4 rounded-2xl font-bold transition flex items-center justify-center gap-2">
              Volver al inicio
            </a>
          </div>
        </section>
      </main>

      {/* --- FOOTER SIMPLIFICADO --- */}
      <footer className="py-12 border-t border-slate-900 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} TurnoMov - Sistema para Gestión de Turnos Online y Agenda Digital.</p>
      </footer>
    </div>
  );
}