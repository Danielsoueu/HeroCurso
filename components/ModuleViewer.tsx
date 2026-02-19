import React, { useEffect, useRef } from 'react';
import { ChevronRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { Module } from '../types';

interface ModuleViewerProps {
  module: Module;
  isCompleted: boolean;
  onComplete: () => void;
  onNext: () => void;
  isLastModule: boolean;
}

export const ModuleViewer: React.FC<ModuleViewerProps> = ({ 
  module, 
  isCompleted, 
  onComplete, 
  onNext,
  isLastModule
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll top on module change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [module.id]);

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden relative" ref={contentRef}>
      
      {/* Header - Minimalist */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 mb-4 text-xs font-bold tracking-wider text-hero-600 uppercase">
             <span>{module.category}</span>
             <ChevronRight className="w-3 h-3 text-slate-300" />
             <span className="text-slate-400">Módulo {module.id}</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-hero-50 text-hero-600 flex items-center justify-center flex-shrink-0">
                {module.icon}
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">{module.title}</h2>
                <div className="flex items-center gap-3 text-sm text-slate-500 mt-2">
                   <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold text-slate-600">{module.duration}</span>
                   {isCompleted && <span className="text-green-600 text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5"/> Concluído</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
               <button 
                 onClick={onComplete}
                 className={`
                   px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-2 border
                   ${isCompleted 
                     ? 'bg-green-50 border-green-100 text-green-700 hover:bg-green-100' 
                     : 'bg-white border-slate-200 text-slate-600 hover:border-hero-200 hover:text-hero-600'}
                 `}
               >
                 {isCompleted ? (
                   <><CheckCircle className="w-4 h-4" /> Lido</>
                 ) : (
                   <><div className="w-4 h-4 rounded-full border-2 border-current"></div> Marcar como lido</>
                 )}
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
            {module.content}
          </div>

          {/* Footer Actions */}
          <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="text-sm text-slate-400 font-medium">
               Você finalizou o módulo {module.id} de {isLastModule ? module.id : '...'}.
             </div>
             
             <button 
               onClick={() => {
                 if (!isCompleted) onComplete();
                 if (!isLastModule) onNext();
               }}
               className="group flex items-center gap-2 bg-hero-600 hover:bg-hero-700 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-hero-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
             >
               <span>{isLastModule ? 'Finalizar Curso' : 'Próximo Módulo'}</span>
               {!isLastModule && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
             </button>
          </div>
          
          <div className="h-20"></div> {/* Bottom spacer */}
        </div>
      </div>
    </div>
  );
};