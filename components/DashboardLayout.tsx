import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, LayoutDashboard, Users, User, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'users';
  onTabChange: (tab: 'dashboard' | 'users') => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { profile, logout } = useAuth();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#FF0066]/10 text-[#FF0066] flex items-center justify-center">
              <Shield size={18} />
            </span>
            Hero App
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          
          {profile?.role === 'admin' && (
            <button
              onClick={() => onTabChange('users')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'users'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <Users size={18} />
              Gestão de Usuários
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-4 px-2">
             <div className="flex bg-slate-100 rounded-full p-0.5">
              {(['pt', 'en', 'es'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full transition-colors ${
                    language === lang
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
              <User size={16} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">{profile?.email}</p>
              <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">{profile?.role}</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};
