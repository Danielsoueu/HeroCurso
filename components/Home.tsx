import React, { useEffect, useState } from 'react';
import { PlayCircle, Clock, ChevronRight, Lock, TrendingUp, ShieldCheck, Award } from 'lucide-react';
import { courses } from '../data';
import { Course } from '../types';

interface HomeProps {
  onSelectCourse: (courseId: string) => void;
  completedModules: number[];
  totalModules: number;
}

export const Home: React.FC<HomeProps> = ({ onSelectCourse, completedModules, totalModules }) => {
  // Calculate general progress for the visual card
  const progress = Math.round((completedModules.length / totalModules) * 100);
  
  // Animation state
  const [visualProgress, setVisualProgress] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisualProgress(progress);
    }, 300);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="flex-1 bg-white overflow-y-auto">
      {/* Hero Section - Clean Light Theme */}
      <div className="relative overflow-hidden bg-white pt-16 pb-12 lg:pt-24 lg:pb-20 border-b border-slate-50">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-hero-50 text-hero-600 text-[10px] font-extrabold uppercase tracking-widest mb-6 border border-hero-100">
                <span className="w-1.5 h-1.5 rounded-full bg-hero-600"></span>
                Hero Academy
              </span>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
                Conhecimento que gera <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-hero-600 to-hero-500">
                  Resultados Reais.
                </span>
              </h1>
              <p className="text-lg text-slate-500 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Domine a cultura e os processos da Company Hero. 
                Treinamento especializado para elevar o padrão do nosso time financeiro.
              </p>
            </div>

            {/* Visual Decoration - Resultados Hero Card */}
            <div className="flex-1 w-full max-w-lg lg:max-w-none relative flex justify-center lg:justify-end">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-hero-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
               
               <div className="relative bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 max-w-sm w-full">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-full bg-hero-50 flex items-center justify-center text-hero-600 shadow-sm">
                      <TrendingUp className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg leading-tight">Resultados Hero</h3>
                      <p className="text-xs text-slate-400 font-medium">Impacto direto no cliente</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    {/* Pink Bar (Primary) */}
                    <div className="h-2 bg-slate-50 rounded-full w-full overflow-hidden">
                      <div 
                        className="h-full bg-hero-500 rounded-full transition-all duration-[1500ms] ease-out shadow-[0_0_10px_rgba(230,0,90,0.2)]" 
                        style={{ width: `${Math.max(visualProgress, 10)}%` }} // Min 10% for visuals
                      ></div> 
                    </div>
                    {/* Purple Bar (Secondary) */}
                    <div className="h-2 bg-slate-50 rounded-full w-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full transition-all duration-[1500ms] ease-out delay-100" 
                        style={{ width: `${Math.max(visualProgress * 0.7, 5)}%` }} // Slightly smaller
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end pt-2">
                     <span className="text-xs font-bold text-slate-400">Conhecimento Técnico</span>
                     <span className="text-xl font-bold text-slate-900">{progress}%</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="bg-slate-50/50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Trilhas de Conhecimento</h2>
              <p className="text-slate-500">
                Selecione um módulo para iniciar ou continuar seus estudos.
              </p>
            </div>
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
                    group bg-white rounded-2xl p-8 border border-slate-100 shadow-soft hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300
                    flex flex-col relative overflow-hidden
                    ${course.status !== 'active' ? 'opacity-75 grayscale-[0.5]' : 'cursor-pointer hover:-translate-y-1 ring-1 ring-transparent hover:ring-hero-100'}
                  `}
                >
                  {/* Status Badge */}
                  {course.status !== 'active' && (
                    <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      <Lock className="w-3 h-3" />
                      Em Breve
                    </div>
                  )}

                  {course.status === 'active' && isCompleted && (
                    <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-green-50 text-green-600 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-green-100">
                      <Award className="w-3 h-3" />
                      Concluído
                    </div>
                  )}

                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 shadow-sm
                    ${course.status === 'active' 
                      ? 'bg-gradient-to-br from-hero-50 to-white text-hero-600 border border-hero-100 group-hover:scale-110 group-hover:shadow-md' 
                      : 'bg-slate-50 text-slate-400 border border-slate-100'}
                  `}>
                    {course.icon}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-hero-600 transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                    {course.description}
                  </p>

                  {/* Progress Section inside Card */}
                  {course.status === 'active' && (
                    <div className="mt-auto">
                      <div className="flex justify-between items-center mb-2 text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-slate-400">Progresso</span>
                        <span className="text-hero-600">{courseProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
                        <div 
                          className="h-full bg-gradient-to-r from-hero-500 to-hero-600 rounded-full transition-all duration-1000 ease-out relative" 
                          style={{ width: `${courseProgress}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                    {course.status === 'active' ? (
                      <>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>4h estimado</span>
                        </div>
                        <span className={`text-sm font-bold flex items-center gap-1 transition-all ${hasStarted ? 'text-hero-600 group-hover:gap-2' : 'text-slate-900 group-hover:text-hero-600 group-hover:gap-2'}`}>
                          {hasStarted ? 'Continuar' : 'Iniciar'}
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-medium text-slate-400 flex items-center gap-2 w-full justify-center opacity-70">
                        Disponível em breve
                      </span>
                    )}
                  </div>
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
             <div className="w-1 h-6 bg-hero-600 rounded-full"></div>
             <span className="font-bold text-slate-900 tracking-tight text-lg">COMPANY <span className="text-hero-600">HERO</span></span>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            © 2024 Hero Academy. Uso interno exclusivo.
          </p>
        </div>
      </div>
    </div>
  );
};