import React, { useState, useEffect } from 'react';
import { Menu, Search } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Sidebar } from './components/Sidebar';
import { ModuleViewer } from './components/ModuleViewer';
import { Home } from './components/Home';
import { Wiki } from './components/Wiki';
import { GlobalSearch } from './components/GlobalSearch';
import { financeiroModules, renovacaoModules, courses } from './data';
import { churnModules } from './data_churn';

type ViewState = 'HOME' | 'COURSE' | 'WIKI';

const App = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [activeCourseId, setActiveCourseId] = useState<string>('financeiro');
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic modules list computed based on current course
  const modules = activeCourseId === 'financeiro' 
    ? financeiroModules 
    : activeCourseId === 'renovacao' 
      ? renovacaoModules 
      : churnModules;

  // Load state from local storage on mount
  useEffect(() => {
    const savedCompleted = localStorage.getItem('hero_academy_completed');
    if (savedCompleted) {
      try {
        const parsed = JSON.parse(savedCompleted);
        // Map any old number arrays (from former course 'financeiro') to string representation
        const sanitized = parsed.map((item: any) => {
          if (typeof item === 'number') {
            return `financeiro_${item}`;
          }
          return String(item);
        });
        setCompletedModules(sanitized);
      } catch (e) {
        setCompletedModules([]);
      }
    }
  }, []);

  // Save state
  useEffect(() => {
    localStorage.setItem('hero_academy_completed', JSON.stringify(completedModules));
  }, [completedModules]);

  const handleComplete = () => {
    const key = `${activeCourseId}_${activeModuleIndex}`;
    if (!completedModules.includes(key)) {
      setCompletedModules(prev => [...prev, key]);
    }
  };

  const handleNext = () => {
    if (activeModuleIndex < modules.length - 1) {
      setActiveModuleIndex(activeModuleIndex + 1);
    }
  };

  const handleFinishCourse = () => {
    // Ensure the last module is marked completed before finishing
    handleComplete();
    
    // Trigger Confetti
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults, 
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#e6005a', '#f43f78', '#fb7199', '#ffffff'] // Hero colors
      });
      confetti({
        ...defaults, 
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#e6005a', '#f43f78', '#fb7199', '#ffffff']
      });
    }, 250);

    // Redirect to home after confetti so user can see "Concluído" badge
    setTimeout(() => {
      setView('HOME');
    }, 3000);
  };

  const handleResetCourse = () => {
    if (window.confirm("Tem certeza que deseja reiniciar o progresso deste curso? Todo o histórico de conclusão deste curso será apagado.")) {
      setCompletedModules(prev => prev.filter(key => !key.startsWith(`${activeCourseId}_`)));
      setActiveModuleIndex(0);
    }
  };

  const handleSelectModule = (courseId: string, moduleIndex: number) => {
    setActiveCourseId(courseId);
    setActiveModuleIndex(moduleIndex);
    setView('COURSE');
  };

  const handleSelectCourse = (courseId: string) => {
    if (courseId === 'financeiro' || courseId === 'renovacao' || courseId === 'churn') {
      setActiveCourseId(courseId);
      setActiveModuleIndex(0);
      setView('COURSE');
    }
  };

  if (view === 'WIKI') {
    return <Wiki onBack={() => setView('HOME')} />;
  }

  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];
  const courseTitle = activeCourse.title; 
  const courseSubtitle = activeCourseId === 'financeiro' 
    ? "Trilha Avançada • Financeiro" 
    : activeCourseId === 'renovacao' 
      ? "Trilha de Sucesso • Renovação"
      : "Trilha Avançada • Retenção";

  return (
    <div className="flex h-screen bg-white font-sans text-gray-800 overflow-hidden selection:bg-hero-100 selection:text-hero-900">
      
      {view === 'COURSE' && (
        <Sidebar 
          activeModule={activeModuleIndex} 
          completedModules={completedModules}
          setActiveModule={setActiveModuleIndex}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          onBackToHome={() => setView('HOME')}
          onResetCourse={handleResetCourse}
          modules={modules}
          courseId={activeCourseId}
          courseTitle={courseTitle}
          courseSubtitle={courseSubtitle}
        />
      )}

      {/* Main Layout */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-gray-50">
        
        {/* Top Mobile Bar (only visible on mobile when inside a course) */}
        {view === 'COURSE' && (
          <div className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-20 shrink-0">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Menu className="w-6 h-6" />
             </button>
             <span className="font-bold text-gray-800">Hero Academy</span>
             <div className="w-10"></div> {/* Spacer */}
          </div>
        )}

        {/* Global Search (Desktop Header - Course View) */}
        {view === 'COURSE' && (
          <div className="hidden lg:flex h-16 bg-white border-b border-gray-200 items-center justify-between px-6 z-20 shrink-0">
            <div className="relative w-96">
              <GlobalSearch 
                onSelectModule={handleSelectModule} 
                placeholder="Busca rápida (ex: cancelamento)..." 
              />
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right hidden xl:block">
                 <div className="text-sm font-bold text-gray-900">Olá, Hero!</div>
                 <div className="text-xs text-slate-500">CX</div>
               </div>
               <div className="w-8 h-8 rounded-full bg-hero-100 border border-hero-200 flex items-center justify-center text-hero-700 font-bold text-xs">
                 CH
               </div>
            </div>
          </div>
        )}

        {view === 'HOME' ? (
          <Home 
            onSelectCourse={handleSelectCourse} 
            onSelectModule={handleSelectModule}
            onOpenWiki={() => setView('WIKI')}
            completedModules={completedModules}
          />
        ) : (
          <ModuleViewer 
            module={modules[activeModuleIndex]}
            isCompleted={completedModules.includes(`${activeCourseId}_${activeModuleIndex}`)}
            onComplete={handleComplete}
            onNext={handleNext}
            isLastModule={activeModuleIndex === modules.length - 1}
            onFinishCourse={handleFinishCourse}
            courseId={activeCourseId}
          />
        )}

      </div>
    </div>
  );
};

export default App;
