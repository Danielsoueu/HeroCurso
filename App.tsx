import React, { useState, useEffect } from 'react';
import { Menu, Search } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Sidebar } from './components/Sidebar';
import { ModuleViewer } from './components/ModuleViewer';
import { Home } from './components/Home';
import { Wiki } from './components/Wiki';
import { modules } from './data';

type ViewState = 'HOME' | 'COURSE' | 'WIKI';

const App = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load state from local storage on mount
  useEffect(() => {
    const savedCompleted = localStorage.getItem('hero_academy_completed');
    if (savedCompleted) {
      setCompletedModules(JSON.parse(savedCompleted));
    }
  }, []);

  // Save state
  useEffect(() => {
    localStorage.setItem('hero_academy_completed', JSON.stringify(completedModules));
  }, [completedModules]);

  const handleComplete = () => {
    if (!completedModules.includes(activeModuleIndex)) {
      setCompletedModules(prev => [...prev, activeModuleIndex]);
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
    if (window.confirm("Tem certeza que deseja reiniciar o progresso do curso? Todo o histórico de conclusão será apagado.")) {
      setCompletedModules([]);
      setActiveModuleIndex(0);
    }
  };

  const handleSelectCourse = (courseId: string) => {
    if (courseId === 'financeiro') {
      setView('COURSE');
    }
  };

  if (view === 'WIKI') {
    return <Wiki onBack={() => setView('HOME')} />;
  }

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
            <div className="flex items-center text-gray-400 bg-gray-50 px-3 py-2 rounded-lg border border-transparent focus-within:border-hero-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-hero-50 transition-all w-96">
              <Search className="w-4 h-4 mr-2" />
              <input 
                type="text" 
                placeholder="Pesquisar conteúdo (ex: Serasa, NF)..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400 text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right hidden xl:block">
                 <div className="text-sm font-bold text-gray-900">Olá, Herói</div>
                 <div className="text-xs text-gray-500">Financeiro & CX</div>
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
            onOpenWiki={() => setView('WIKI')}
            completedModules={completedModules}
            totalModules={modules.length}
          />
        ) : (
          <ModuleViewer 
            module={modules[activeModuleIndex]}
            isCompleted={completedModules.includes(activeModuleIndex)}
            onComplete={handleComplete}
            onNext={handleNext}
            isLastModule={activeModuleIndex === modules.length - 1}
            onFinishCourse={handleFinishCourse}
          />
        )}

      </div>
    </div>
  );
};

export default App;