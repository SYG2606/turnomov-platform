import { Bike, LogOut } from 'lucide-react';
import { Button } from './UI';

const Header = ({ appUser, shopConfig, onLogout }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl w-10 h-10 flex items-center justify-center shadow-lg ${
              appUser.role === 'mechanic'
                ? 'bg-gradient-to-br from-blue-600 to-blue-700'
                : 'bg-gradient-to-br from-orange-600 to-orange-700'
            }`}
          >
            {shopConfig.logoUrl ? (
              <img
                src={shopConfig.logoUrl}
                alt="logo"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Bike size={22} className="text-white" />
            )}
          </div>

          <div>
            <h1 className="text-lg font-bold text-white leading-tight">
              {shopConfig.shopName}
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">
              {appUser.role === 'client'
                ? 'Cliente'
                : appUser.isAdmin
                ? 'Admin'
                : 'Mecánico'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm text-white font-medium">{appUser.name}</p>
            <p className="text-xs text-slate-500">{appUser.dni}</p>
          </div>

          <Button variant="ghost" onClick={onLogout}>
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
