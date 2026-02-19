import React from 'react';
import { CheckCircle, PlayCircle, ArrowLeft, ChevronRight } from 'lucide-react';
import { modules } from '../data';

interface SidebarProps {
  activeModule: number;
  completedModules: number[];
  setActiveModule: (id: number) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  onBackToHome: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeModule, 
  completedModules, 
  setActiveModule, 
  isOpen,
  onCloseMobile,
  onBackToHome
}) => {
  const calculateProgress = () => Math.round((completedModules.length / modules.length) * 100);

  // Group modules by category
  const groupedModules = modules.reduce((acc, module) => {
    const cat = module.category || "Geral";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(module);
    return acc;
  }, {} as Record<string, typeof modules>);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        ></div>
      )}

      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-80 bg-white border-r border-slate-200 flex flex-col h-full
        transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header - Simple and Clean */}
        <div className="p-6 border-b border-slate-100">
           <button 
             onClick={onBackToHome}
             className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-hero-600 transition-colors mb-6"
           >
             <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-hero-50 transition-colors">
               <ArrowLeft className="w-3 h-3" />
             </div>
             Voltar ao Início
           </button>
           
           <h1 className="font-extrabold text-xl text-slate-900 leading-tight">
             Cobrança &<br/>
             <span className="text-hero-600">Negociação</span>
           </h1>
           
           {/* Progress Card */}
           <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
             <div className="flex justify-between items-end mb-2">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Seu Progresso</span>
               <span className="text-sm font-bold text-hero-600">{calculateProgress()}%</span>
             </div>
             <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-hero-600 h-1.5 rounded-full transition-all duration-700 ease-out" 
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
             </div>
           </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
          {Object.entries(groupedModules).map(([category, categoryModules]) => (
            <div key={category}>
              <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4 px-3">
                {category}
              </h3>
              <div className="space-y-1">
                {categoryModules.map((module) => {
                  const isActive = activeModule === modules.indexOf(module);
                  const isCompleted = completedModules.includes(modules.indexOf(module));
                  const index = modules.indexOf(module);

                  return (
                    <button
                      key={module.id}
                      onClick={() => {
                        setActiveModule(index);
                        onCloseMobile();
                      }}
                      className={`
                        w-full text-left px-3 py-3 rounded-lg flex items-start justify-between group transition-all duration-200 border
                        ${isActive 
                          ? 'bg-hero-50 border-hero-100 text-hero-900 shadow-sm' 
                          : 'border-transparent text-slate-600 hover:bg-slate-50'}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 transition-colors ${isActive ? 'text-hero-600' : isCompleted ? 'text-green-500' : 'text-slate-300'}`}>
                          {isActive ? (
                            <PlayCircle className="w-5 h-5 fill-hero-100" />
                          ) : isCompleted ? (
                            <CheckCircle className="w-5 h-5 fill-green-50" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-200 group-hover:border-slate-300 flex items-center justify-center text-[10px] font-bold">
                              {module.id}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-sm leading-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                            {module.title}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-1 font-medium">
                            {module.duration}
                          </span>
                        </div>
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4 text-hero-400 mt-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};