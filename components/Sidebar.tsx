import React, { useState, useEffect } from 'react';
import { CheckCircle, PlayCircle, ArrowLeft, Lock, Medal, RotateCcw } from 'lucide-react';
import { Module } from '../types';

interface SidebarProps {
  activeModule: number;
  completedModules: string[];
  setActiveModule: (id: number) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  onBackToHome: () => void;
  onResetCourse: () => void;
  modules: Module[];
  courseId: string;
  courseTitle: string;
  courseSubtitle: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeModule, 
  completedModules, 
  setActiveModule, 
  isOpen,
  onCloseMobile,
  onBackToHome,
  onResetCourse,
  modules,
  courseId,
  courseTitle,
  courseSubtitle
}) => {
  // Ensure we only count valid modules that exist in the current course list to prevent > 100%
  const validCompletedCount = completedModules.filter(key => key.startsWith(`${courseId}_`)).length;
  
  // Calculate the actual progress value, capped at 100
  const targetProgress = Math.min(100, Math.round((validCompletedCount / modules.length) * 100));
  const isFinished = targetProgress === 100;
  
  // Use local state to control the visual width for animation purposes
  const [visualProgress, setVisualProgress] = useState(0);

  useEffect(() => {
    // Add a small delay to ensure the transition triggers visually after mount/update
    const timer = setTimeout(() => {
      setVisualProgress(targetProgress);
    }, 200);

    return () => clearTimeout(timer);
  }, [targetProgress]);

  // Group modules by category
  const groupedModules = modules.reduce((acc, module) => {
    const cat = module.category || "Geral";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(module);
    return acc;
  }, {} as Record<string, typeof modules>);

  // Render Title cleanly
  const renderTitle = () => {
    if (courseTitle.includes('&')) {
      const parts = courseTitle.split('&');
      return (
        <h1 className="font-extrabold text-2xl text-slate-900 leading-none tracking-tight">
          {parts[0]} &<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-hero-600 to-hero-500">
            {parts[1].trim()}
          </span>
        </h1>
      );
    }
    return (
      <h1 className="font-extrabold text-2xl text-slate-900 leading-none tracking-tight">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-hero-600 to-hero-500">
          {courseTitle}
        </span>
      </h1>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onCloseMobile}
        ></div>
      )}

      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-80 bg-white border-r border-slate-100 flex flex-col h-full
        transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header Branding */}
        <div className="p-6 border-b border-slate-100 bg-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-hero-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
           
           <button 
             onClick={onBackToHome}
             className="relative z-10 group flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-hero-600 transition-colors mb-6 uppercase tracking-wider"
           >
             <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
             Voltar ao Início
           </button>
           
           <div className="relative z-10">
             {renderTitle()}
             <p className="text-xs text-slate-400 mt-2 font-medium">{courseSubtitle}</p>
           </div>
           
           {/* Modern Progress Card */}
           {isFinished ? (
              <div className="mt-6 bg-green-50 border border-green-100 rounded-2xl p-4 relative overflow-hidden group animate-in fade-in slide-in-from-bottom-2 duration-700">
                 <div className="flex items-center gap-4 relative z-10">
                   <div className="w-10 h-10 rounded-full bg-white border border-green-200 flex items-center justify-center text-green-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                       <Medal className="w-5 h-5 fill-current" />
                   </div>
                   <div>
                       <div className="text-[10px] font-bold text-green-800 uppercase tracking-widest font-mono">Parabéns!</div>
                       <div className="text-xs font-bold text-green-600">Trilha Concluída</div>
                   </div>
                 </div>
                 
                 {/* Restart Button */}
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     onResetCourse();
                   }}
                   className="mt-3 w-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-green-700 bg-white/60 hover:bg-white border border-green-200 rounded-lg py-1.5 transition-all hover:shadow-sm relative z-10 font-mono"
                 >
                   <RotateCcw className="w-3 h-3" />
                   Reiniciar Trilha
                 </button>

                 {/* Sparkle effect */}
                 <div className="absolute right-0 top-0 w-20 h-20 bg-green-200/20 rounded-full blur-xl -mr-6 -mt-6"></div>
                 <div className="absolute bottom-0 left-0 w-full h-1 bg-green-200"></div>
              </div>
           ) : (
             <div className="mt-6 relative z-10">
               <div className="flex justify-between items-end mb-2">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Seu Progresso</span>
                 <span className="text-xs font-bold text-hero-600 bg-hero-50 px-2 py-0.5 rounded-full border border-hero-100 font-mono">{targetProgress}%</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-hero-500 to-hero-600 h-1.5 rounded-full transition-all duration-[1500ms] ease-out shadow-[0_0_10px_rgba(230,0,90,0.3)] relative" 
                    style={{ width: `${visualProgress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
               </div>
             </div>
           )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 custom-scrollbar bg-slate-50/50">
          {Object.entries(groupedModules).map(([category, categoryModules]) => (
            <div key={category}>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-4 flex items-center gap-2 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-hero-300"></span>
                {category}
              </h3>
              <div className="space-y-1">
                {categoryModules.map((module) => {
                  const index = modules.indexOf(module);
                  const isActive = activeModule === index;
                  const isCompleted = completedModules.includes(`${courseId}_${index}`);

                  return (
                    <button
                      key={module.id}
                      onClick={() => {
                        setActiveModule(index);
                        onCloseMobile();
                      }}
                      className={`
                        w-full text-left px-4 py-3.5 rounded-xl flex items-center justify-between group transition-all duration-200 relative overflow-hidden
                        ${isActive 
                          ? 'bg-white shadow-sm border border-slate-100 z-10' 
                          : 'text-slate-500 hover:bg-white hover:text-slate-700 hover:shadow-sm border border-transparent'}
                      `}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-hero-600 rounded-l-xl"></div>
                      )}
                      
                      <div className="flex items-center gap-3.5">
                        <div className={`
                            flex-shrink-0 transition-all duration-300
                            ${isCompleted ? 'text-green-500' : isActive ? 'text-hero-600 scale-110' : 'text-slate-300'}
                          `}>
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 fill-green-50" />
                          ) : isActive ? (
                            <PlayCircle className="w-5 h-5 fill-hero-50" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-200 group-hover:border-slate-300 flex items-center justify-center text-[10px] font-bold font-mono">
                              {index + 1}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-sm leading-tight transition-colors ${isActive ? 'font-bold text-slate-900' : 'font-medium'}`}>
                            {module.title}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-1 font-medium flex items-center gap-1 font-mono">
                            {module.duration}
                          </span>
                        </div>
                      </div>
                      
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-hero-500 shadow-lg shadow-hero-500/50"></div>
                      )}
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
