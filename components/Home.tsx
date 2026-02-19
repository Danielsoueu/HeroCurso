import React, { useEffect, useState } from 'react';
import { PlayCircle, Clock, ChevronRight, Lock, TrendingUp, ShieldCheck, Award, Star, Sparkles } from 'lucide-react';
import { courses } from '../data';
import { Course } from '../types';

interface HomeProps {
  onSelectCourse: (courseId: string) => void;
  completedModules: number[];
  totalModules: number;
}

export const Home: React.FC<HomeProps> = ({ onSelectCourse, completedModules, totalModules }) => {
  // Cap progress at 100 to prevent overflow (e.g., 113%)
  const progress = Math.min(100, Math.round((completedModules.length / totalModules) * 100));
  const [visualProgress, setVisualProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setVisualProgress(progress), 300);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="flex-1 bg-white overflow-y-auto">
      {/* Hero Section with Pattern Background */}
      <div className="relative overflow-hidden pt-20 pb-20 lg:pt-32 lg:pb-28">
        {/* Background Gradients */}
        <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-hero-50/60 via-white to-white pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-hero-100/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white border border-hero-100 text-hero-600 text-[11px] font-extrabold uppercase tracking-widest mb-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Sparkles className="w-3.5 h-3.5 fill-hero-600" />
                <span>Hero Academy</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.05]">
                Potencialize sua <br className="hidden lg:block"/>
                <span className="relative whitespace-nowrap">
                   <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-hero-600 to-hero-400">Jornada Hero</span>
                   <svg className="absolute -bottom-2 left-0 w-full h-3 text-hero-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                     <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                   </svg>
                </span>
              </h1>
              
              <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                A plataforma oficial de treinamento da Company Hero. 
                Desenvolva habilidades técnicas, domine nossa cultura e alcance novos níveis de performance.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                 <button 
                   onClick={() => document.getElementById('trilhas')?.scrollIntoView({ behavior: 'smooth' })}
                   className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all hover:scale-105 shadow-lg shadow-slate-900/20 flex items-center gap-2"
                 >
                   Explorar Trilhas
                   <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
            </div>

            {/* Right Visual - Refined Card */}
            <div className="flex-1 w-full flex justify-center lg:justify-end relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-hero-100 to-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
               
               <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/50 p-8 transform rotate-2 hover:rotate-0 transition-all duration-700 max-w-md w-full">
                  <div className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-lg border border-slate-50 animate-bounce delay-700">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  </div>

                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-hero-500 to-hero-600 flex items-center justify-center text-white shadow-lg shadow-hero-500/30">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xl leading-tight">Resultados Hero</h3>
                      <p className="text-sm text-slate-500 font-medium mt-1">Impacto direto no cliente</p>
                    </div>
                  </div>
                  
                  <div className="space-y-5 mb-8">
                    {/* Primary Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <span>Performance</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full w-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-hero-500 to-hero-400 rounded-full transition-all duration-[1500ms] ease-out shadow-[0_0_15px_rgba(230,0,90,0.4)] relative" 
                          style={{ width: `${Math.max(visualProgress, 10)}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div> 
                      </div>
                    </div>
                    
                    {/* Secondary Bar */}
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <span>Soft Skills</span>
                        <span>{(visualProgress * 0.8).toFixed(0)}%</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full w-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-[1500ms] ease-out delay-100" 
                          style={{ width: `${Math.max(visualProgress * 0.7, 5)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-slate-100/50">
                     <div className="flex-1">
                        <div className="text-xs font-bold text-slate-400 uppercase">Time</div>
                        <div className="text-slate-900 font-bold">Hero</div>
                     </div>
                     <ShieldCheck className="w-8 h-8 text-hero-200" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div id="trilhas" className="bg-slate-50 py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Trilhas de Conhecimento</h2>
            <p className="text-lg text-slate-500">
              Selecione sua área de atuação para iniciar a jornada de aprendizado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const isFinanceiro = course.id === 'financeiro';
              const courseProgress = isFinanceiro ? progress : 0;
              const hasStarted = courseProgress > 0;
              const isCompleted = courseProgress === 100;

              return (
                <div 
                  key={course.id}
                  onClick={() => course.status === 'active' && onSelectCourse(course.id)}
                  className={`
                    group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500
                    flex flex-col relative overflow-hidden isolate
                    ${course.status !== 'active' ? 'opacity-80' : 'cursor-pointer hover:-translate-y-2'}
                  `}
                >
                  {/* Hover Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 -z-10`}></div>

                  {/* Top Badge */}
                  <div className="flex justify-between items-start mb-8">
                     <div className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500
                        ${course.status === 'active' 
                          ? 'bg-white border border-slate-100 text-hero-600 shadow-lg group-hover:scale-110 group-hover:rotate-3' 
                          : 'bg-slate-50 text-slate-300 border border-slate-100'}
                      `}>
                        {course.icon}
                     </div>

                     {course.status !== 'active' && (
                        <div className="flex items-center gap-1.5 bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                          <Lock className="w-3 h-3" />
                          Em Breve
                        </div>
                      )}

                      {course.status === 'active' && isCompleted && (
                        <div className="flex items-center gap-1.5 bg-green-50 text-green-600 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-green-100">
                          <Award className="w-3 h-3" />
                          Concluído
                        </div>
                      )}
                  </div>

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-hero-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  {/* Progress Section inside Card */}
                  {course.status === 'active' ? (
                    <div className="mt-auto pt-6 border-t border-slate-50">
                      {hasStarted ? (
                        <div className="space-y-3">
                           <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                            <span className="text-slate-400">Seu Progresso</span>
                            <span className="text-hero-600">{courseProgress}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-hero-500 to-hero-600 rounded-full" 
                              style={{ width: `${courseProgress}%` }}
                            ></div>
                          </div>
                          <div className="pt-2 flex items-center text-hero-600 font-bold text-sm gap-2 group-hover:translate-x-2 transition-transform">
                             Continuar Trilha <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">
                              <Clock className="w-3.5 h-3.5" />
                              <span>4h estimado</span>
                           </div>
                           <button className="w-10 h-10 rounded-full bg-hero-50 text-hero-600 flex items-center justify-center group-hover:bg-hero-600 group-hover:text-white transition-all duration-300">
                              <PlayCircle className="w-5 h-5" />
                           </button>
                        </div>
                      )}
                    </div>
                  ) : (
                     <div className="mt-auto pt-6 border-t border-slate-50">
                        <span className="text-sm font-medium text-slate-400 flex items-center gap-2">
                          Disponível em breve
                        </span>
                     </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
             <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">CH</div>
             <span className="font-bold text-slate-900 tracking-tight text-sm">COMPANY <span className="text-hero-600">HERO</span></span>
          </div>
          <p className="text-slate-400 text-xs font-medium">
            © 2024 Hero Academy. Uso interno exclusivo.
          </p>
        </div>
      </div>
    </div>
  );
};