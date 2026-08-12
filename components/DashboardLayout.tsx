import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, LayoutDashboard, Users, User, Shield, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'users';
  onTabChange: (tab: 'dashboard' | 'users') => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { profile, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 shrink-0 ${isCollapsed ? 'w-16' : 'w-64'}`}>
        {/* Header */}
        <div className={`h-16 flex items-center border-b border-slate-200 px-3 ${isCollapsed ? 'justify-center' : 'justify-between px-5'}`}>
          {!isCollapsed && (
            <div className="font-bold text-lg text-slate-900 flex items-center gap-2 overflow-hidden whitespace-nowrap">
              <span className="w-8 h-8 rounded-lg bg-[#FF0066]/10 text-[#FF0066] flex items-center justify-center shrink-0">
                <Shield size={18} />
              </span>
              <span>Hero App</span>
            </div>
          )}
          
          <button
            onClick={toggleCollapse}
            title={isCollapsed ? "Expandir menu" : "Recolher menu"}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-2 flex flex-col gap-2">
          <button
            onClick={() => onTabChange('dashboard')}
            title="Dashboard"
            className={`flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isCollapsed ? 'justify-center px-0' : 'px-4'
            } ${
              activeTab === 'dashboard'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <LayoutDashboard size={18} className="shrink-0" />
            {!isCollapsed && <span className="truncate">Dashboard</span>}
          </button>
          
          {profile?.role === 'admin' && (
            <button
              onClick={() => onTabChange('users')}
              title="Gestão de Usuários"
              className={`flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isCollapsed ? 'justify-center px-0' : 'px-4'
              } ${
                activeTab === 'users'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <Users size={18} className="shrink-0" />
              {!isCollapsed && <span className="truncate">Gestão de Usuários</span>}
            </button>
          )}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200">
          {!isCollapsed ? (
            <>
              <div className="flex items-center justify-between mb-4 px-1">
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
              
              <div className="flex items-center gap-3 px-1 mb-4">
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
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} className="shrink-0" />
                <span>Sair</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 py-1">
              <button
                onClick={() => {
                  const nextLang = language === 'pt' ? 'en' : language === 'en' ? 'es' : 'pt';
                  setLanguage(nextLang);
                }}
                title={`Idioma: ${language.toUpperCase()} (Clique para alternar)`}
                className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs uppercase flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                {language}
              </button>

              <div 
                className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0"
                title={`${profile?.email} (${profile?.role})`}
              >
                <User size={16} />
              </div>

              <button
                onClick={logout}
                title="Sair"
                className="w-9 h-9 flex items-center justify-center rounded-xl text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto min-w-0">
        {children}
      </main>
    </div>
  );
};
