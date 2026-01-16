import { Loader2 } from 'lucide-react';

/* ---------- BUTTON ---------- */
export const Button = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}) => {
  const variants = {
    primary:
      'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-900/20 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed',
    secondary:
      'bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 hover:border-slate-500 disabled:opacity-50',
    admin:
      'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 disabled:bg-slate-700',
    danger:
      'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20',
    success:
      'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20',
    whatsapp:
      'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20',
    ghost:
      'hover:bg-slate-800 text-slate-400 hover:text-white'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2 active:scale-95 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

/* ---------- CARD ---------- */
export const Card = ({ children, className = '', onClick }) => (
  <div
    onClick={onClick}
    className={`bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl ${className} ${
      onClick
        ? 'cursor-pointer hover:border-slate-600 hover:shadow-2xl hover:-translate-y-0.5 transition-all'
        : ''
    }`}
  >
    {children}
  </div>
);

/* ---------- BADGE ---------- */
export const Badge = ({ status }) => {
  const styles = {
    pendiente: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    recibido: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'en-proceso': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    listo: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  };

  const labels = {
    pendiente: 'Reservado',
    recibido: 'En Taller',
    'en-proceso': 'En Reparación',
    listo: 'Finalizado'
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
        styles[status] || styles.pendiente
      }`}
    >
      {labels[status] || status}
    </span>
  );
};

/* ---------- LOADING ---------- */
export const LoadingScreen = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center text-orange-500 gap-2">
    <Loader2 className="animate-spin" />
    Cargando...
  </div>
);
