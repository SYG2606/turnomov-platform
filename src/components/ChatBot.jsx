// src/components/ChatBot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// ---------- UTILIDADES ----------
const normalize = (text) =>
  text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

const registrarPreguntaFallida = async (pregunta) => {
  try {
    await addDoc(collection(db, 'bot_learning'), {
      pregunta,
      fecha: new Date().toISOString(),
      visto: false,
    });
  } catch (e) {
    console.error('Error guardando pregunta:', e);
  }
};

// ---------- BASE DE CONOCIMIENTO ----------
const KNOWLEDGE_BASE = [
  {
    keywords: ['hola', 'buen', 'dia', 'tarde', 'noche', 'hey', 'comenzar'],
    answer:
      '¡Hola! Soy Tomi. 👋\nSoy el asistente del taller. Puedo ayudarte con dudas sobre roles, contraseñas o turnos.',
  },
  {
    keywords: ['admin', 'mecanico', 'recep', 'dueño', 'jefe', 'rol', 'permiso'],
    answer:
      '👤 **Roles:**\n• **Admins/Dueños:** control total.\n• **Mecánicos/Recepción:** gestionan turnos.',
  },
  {
    keywords: ['reserv', 'turno', 'cita', 'cliente'],
    answer:
      '📅 **Clientes:** Ingresa con DNI, elige día y hora.\n💡 Recepción: usa el botón "+".',
  },
  {
    keywords: ['clave', 'pass', 'olvid', 'reset'],
    answer:
      '🔐 **Acceso Staff:** Usuario DNI. Clave inicial **Turno2026**. Admin puede resetear.',
  },
  {
    keywords: ['ayuda', 'guia', 'manual'],
    answer: 'Te llevo a la guía ahora mismo… {{REDIRECT_AYUDA}}',
  },
  {
    keywords: ['gracias', 'chau', 'cerrar'],
    answer: '¡De nada! 😊 {{CLOSE_CHAT}}',
  },
];

const findAnswer = (input) => {
  const clean = normalize(input);
  const hit = KNOWLEDGE_BASE.find((item) =>
    item.keywords.some((k) => clean.includes(normalize(k)))
  );
  return hit ? hit.answer : null;
};

// ---------- COMPONENTE ----------
export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '¡Hola! Soy Tomi. 🤖\n¿En qué puedo ayudarte?' },
  ]);
  const [inputText, setInputText] = useState('');

  const messagesEndRef = useRef(null);
  const timeoutsRef = useRef([]);
  const navigate = useNavigate();

  // ----- helpers seguros -----
  const safeTimeout = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
  };

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  // cleanup global (CLAVE)
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setMessages((p) => [...p, { role: 'user', text: userText }]);
    setInputText('');
    setIsTyping(true);

    safeTimeout(() => {
      let botResponse = findAnswer(userText);

      if (!botResponse) {
        registrarPreguntaFallida(userText);
        botResponse =
          'Mmm… no estoy seguro 🤔. Anoté tu duda para aprender.\nProbá: "turno", "clave" o "ayuda".';
      }

      if (botResponse.includes('{{REDIRECT_AYUDA}}')) {
        botResponse = botResponse.replace('{{REDIRECT_AYUDA}}', '');
        navigate('/ayuda');
        setIsOpen(false);
      }

      if (botResponse.includes('{{CLOSE_CHAT}}')) {
        botResponse = botResponse.replace('{{CLOSE_CHAT}}', '');
        safeTimeout(() => setIsOpen(false), 2000);
      }

      setMessages((p) => [...p, { role: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 800);
  };

  const formatText = (text) =>
    text.split('\n').map((line, i) => (
      <span key={i} className="block min-h-[1.2em]">
        {line.split(/(\*\*.*?\*\*)/g).map((part, j) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={j} className="text-orange-300 font-bold">
              {part.slice(2, -2)}
            </strong>
          ) : (
            part
          )
        )}
      </span>
    ));

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-2xl transition"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {isOpen && (
        <div className="bg-slate-900 border border-slate-700 w-[360px] h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-slate-800 p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Bot className="text-white" />
              <div>
                <h3 className="text-white text-sm font-bold">Tomi</h3>
                <p className="text-xs text-slate-400">Asistente</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X className="text-slate-400 hover:text-white" size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl text-sm ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  {formatText(m.text)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Loader2 size={14} className="animate-spin" /> Escribiendo…
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 flex gap-2 border-t border-slate-700">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-900 text-white text-sm rounded-lg px-3 py-2 border border-slate-700"
              placeholder="Escribe aquí…"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-lg"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
