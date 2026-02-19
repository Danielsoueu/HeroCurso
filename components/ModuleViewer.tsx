import React, { useEffect, useRef } from 'react';
import { ChevronRight, CheckCircle, ArrowLeft, Award, Sparkles } from 'lucide-react';
import { Module } from '../types';

interface ModuleViewerProps {
  module: Module;
  isCompleted: boolean;
  onComplete: () => void;
  onNext: () => void;
  isLastModule: boolean;
  onFinishCourse: () => void;
}

export const ModuleViewer: React.FC<ModuleViewerProps> = ({ 
  module, 
  isCompleted, 
  onComplete, 
  onNext,
  isLastModule,
  onFinishCourse
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
      
      {/* Header - Premium & Sticky */}
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
             <span>{module.category}</span>
             <ChevronRight className="w-3 h-3 text-slate-300" />
             <span className="text-hero-600">Módulo {module.id}</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-hero-50 to-white border border-hero-100 text-hero-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                {module.icon}
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {module.title}
                </h2>
                <div className="flex items-center gap-3 text-sm text-slate-500 mt-2">
                   <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-xs font-bold text-slate-600">{module.duration}</span>
                   {isCompleted && (
                     <span className="text-green-600 text-xs font-bold flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                       <CheckCircle className="w-3 h-3"/> Concluído
                     </span>
                   )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
               <button 
                 onClick={onComplete}
                 className={`
                   px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 border shadow-sm
                   ${isCompleted 
                     ? 'bg-green-50 border-green-200 text-green-700' 
                     : 'bg-white border-slate-200 text-slate-600 hover:border-hero-200 hover:text-hero-600 hover:shadow-md'}
                 `}
               >
                 {isCompleted ? (
                   <><CheckCircle className="w-4 h-4" /> Lido</>
                 ) : (
                   <><div className="w-4 h-4 rounded-full border-2 border-slate-300 group-hover:border-hero-500"></div> Marcar como lido</>
                 )}
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
            {module.content}
          </div>

          {/* Footer Navigation Area */}
          <div className="mt-20 pt-10 border-t border-slate-100">
             <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                    {isLastModule ? <Sparkles className="w-6 h-6" /> : <Award className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">
                      {isLastModule 
                        ? (isCompleted ? "Curso Finalizado!" : "Última etapa!") 
                        : (isCompleted ? "Módulo Finalizado!" : "Finalize este módulo")}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {isLastModule 
                         ? "Parabéns! Você completou toda a trilha de conhecimento." 
                         : (isCompleted ? "Continue avançando para dominar o conteúdo." : "Marque como lido para prosseguir.")}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (!isCompleted) onComplete();
                    if (isLastModule) {
                      onFinishCourse();
                    } else {
                      onNext();
                    }
                  }}
                  className={`
                    group relative overflow-hidden text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] w-full md:w-auto text-center
                    ${isLastModule ? 'bg-gradient-to-r from-hero-600 to-hero-500 shadow-hero-600/30' : 'bg-hero-600 hover:bg-hero-700 shadow-hero-600/30'}
                  `}
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {isLastModule ? (
                      <>
                        <Award className="w-4 h-4" />
                        Concluir Curso
                      </>
                    ) : (
                      <>
                        Próximo Módulo
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
             </div>
          </div>
          
          <div className="h-20"></div>
        </div>
      </div>
    </div>
  );
};