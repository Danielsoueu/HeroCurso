import React from 'react';
import { PlayCircle, Clock, ChevronRight, Lock, TrendingUp, ShieldCheck } from 'lucide-react';
import { courses } from '../data';
import { Course } from '../types';

interface HomeProps {
  onSelectCourse: (courseId: string) => void;
  completedModules: number[];
  totalModules: number;
}

export const Home: React.FC<HomeProps> = ({ onSelectCourse, completedModules, totalModules }) => {
  const progress = Math.round((completedModules.length / totalModules) * 100);

  return (
    <div className="flex-1 bg-white overflow-y-auto">
      {/* Hero Section - Clean Light Theme */}
      <div className="relative overflow-hidden bg-white pt-16 pb-12 lg:pt-24 lg:pb-20">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block py-1 px-3 rounded-full bg-hero-50 text-hero-600 text-xs font-bold uppercase tracking-wider mb-6 border border-hero-100">
                Para o time de especialistas
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                Simplifique a sua <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-hero-600 to-hero-500">
                  Jornada de Aprendizado.
                </span>
              </h1>
              <p className="text-lg text-slate-500 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Domine os processos, a cultura e as técnicas da Company Hero. 
                Uma plataforma exclusiva para impulsionar sua performance e carreira.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button className="w-full sm:w-auto px-8 py-4 bg-hero-600 text-white font-bold rounded-full shadow-lg hover:bg-hero-700 transition-all hover:shadow-hero-500/25 active:scale-95 text-sm uppercase tracking-wide">
                  Retomar Trilha
                </button>
                <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-full border border-slate-100">
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Progresso Atual</span>
                    <span className="text-sm font-bold text-slate-900">{progress}% Concluído</span>
                  </div>
                  <div className="w-10 h-10 relative">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="20" cy="20" r="16" stroke="#f1f5f9" strokeWidth="3" fill="none" />
                      <circle cx="20" cy="20" r="16" stroke="#e6005a" strokeWidth="3" fill="none" strokeDasharray="100" strokeDashoffset={100 - progress} className="transition-all duration-1000" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Decoration / Image Placeholder */}
            <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
               <div className="absolute top-0 right-0 w-72 h-72 bg-hero-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
               <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
               <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
               
               <div className="relative bg-white rounded-2xl shadow-card border border-slate-100 p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-hero-50 flex items-center justify-center text-hero-600">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Resultados Hero</h3>
                      <p className="text-xs text-slate-500">Impacto direto no cliente</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-2 bg-slate-100 rounded-full w-full overflow-hidden">
                      <div className="h-full bg-hero-500 w-3/4"></div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full w-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-1/2"></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 font-medium pt-2">
                      <span>Conhecimento Técnico</span>
                      <span>100%</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Trilhas de Conhecimento</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Desenvolva as habilidades essenciais para garantir a melhor experiência para nossos clientes PJ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div 
                key={course.id}
                onClick={() => course.status === 'active' && onSelectCourse(course.id)}
                className={`
                  group bg-white rounded-2xl p-8 border border-slate-100 shadow-soft hover:shadow-card transition-all duration-300
                  flex flex-col relative overflow-hidden
                  ${course.status !== 'active' ? 'opacity-80' : 'cursor-pointer hover:-translate-y-1'}
                `}
              >
                {/* Status Badge for Construction */}
                {course.status !== 'active' && (
                  <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Em Breve
                  </div>
                )}

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${course.status === 'active' ? 'bg-hero-50 text-hero-600 group-hover:bg-hero-600 group-hover:text-white' : 'bg-slate-50 text-slate-400'}`}>
                  {course.icon}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-hero-600 transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                  {course.description}
                </p>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  {course.status === 'active' ? (
                    <>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>4h duração</span>
                      </div>
                      <span className="text-sm font-bold text-hero-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Acessar trilha
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Indisponível
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer styled like Company Hero */}
      <div className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="w-1 h-6 bg-hero-600"></div>
             <span className="font-bold text-slate-900 tracking-tight text-lg">COMPANY <span className="text-hero-600">HERO</span></span>
          </div>
          <p className="text-slate-400 text-sm">
            © 2024 Company Hero. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
             {/* Social placeholders */}
             <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-hero-50 hover:text-hero-600 transition-colors cursor-pointer">
               <ShieldCheck className="w-4 h-4" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};