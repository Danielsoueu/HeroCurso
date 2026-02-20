import React, { useState, useMemo } from 'react';
import { Search, MessageCircle, ChevronDown, HelpCircle, Zap, ArrowLeft, Sparkles, BrainCircuit } from 'lucide-react';
import { faqs, quizQuestions } from '../data';
import { Quiz } from './ui/Quiz';

interface WikiProps {
  onBack: () => void;
}

export const Wiki: React.FC<WikiProps> = ({ onBack }) => {
  const [view, setView] = useState<'FAQ' | 'QUIZ'>('FAQ');
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<string | null>(null);

  // Filter FAQs logic
  const filteredFaqs = useMemo(() => {
    if (!faqSearch.trim()) return faqs;
    const query = faqSearch.toLowerCase();
    
    return faqs.map(category => ({
      ...category,
      items: category.items.filter(item => 
        item.q.toLowerCase().includes(query) || 
        item.a.toLowerCase().includes(query)
      )
    })).filter(category => category.items.length > 0);
  }, [faqSearch]);

  const toggleFaq = (id: string) => {
    setOpenFaqIndex(openFaqIndex === id ? null : id);
  };

  if (view === 'QUIZ') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Quiz Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
             <button 
              onClick={() => setView('FAQ')}
              className="flex items-center gap-2 text-slate-500 hover:text-hero-600 font-bold text-sm transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Voltar para FAQ
            </button>
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                  <BrainCircuit className="w-5 h-5" />
               </div>
               <span className="font-bold text-slate-900 text-lg tracking-tight">Quiz de Retenção</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
           <div className="max-w-4xl mx-auto py-8">
              <Quiz questions={quizQuestions} onExit={() => setView('FAQ')} />
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-hero-600 font-bold text-sm transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Voltar ao Início
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-hero-100 rounded-lg flex items-center justify-center text-hero-600">
               <HelpCircle className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">Wiki Hero</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-12">
          
          <div className="text-center mb-12">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-6 shadow-sm">
                <Sparkles className="w-3 h-3 text-hero-500" />
                Base de Conhecimento
             </div>
             <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
               Como podemos <span className="text-transparent bg-clip-text bg-gradient-to-r from-hero-600 to-hero-400">ajudar hoje?</span>
             </h1>
             <p className="text-lg text-slate-500 max-w-xl mx-auto">
               Encontre scripts, regras de negociação e processos internos em segundos.
             </p>
          </div>

          {/* Quiz Call to Action Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 mb-16 text-white shadow-xl shadow-purple-200 relative overflow-hidden group cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-all duration-300" onClick={() => setView('QUIZ')}>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-12 -mb-12 blur-2xl"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center md:text-left">
                   <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                      <BrainCircuit className="w-3.5 h-3.5" />
                      Desafio do Conhecimento
                   </div>
                   <h3 className="text-2xl font-bold mb-2">Está afiado nas regras?</h3>
                   <p className="text-purple-100 text-sm max-w-md">Teste seus conhecimentos sobre retenção, cancelamento e multas com nosso Quiz interativo de 12 perguntas.</p>
                </div>
                <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-purple-50 transition-colors whitespace-nowrap">
                   Iniciar Quiz Agora
                </button>
             </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-16 group sticky top-24 z-20">
             <div className="absolute -inset-1 bg-gradient-to-r from-hero-400 to-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
             <div className="relative bg-white rounded-2xl shadow-xl shadow-slate-200/50 flex items-center p-2 border border-slate-100">
                <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                   <Search className="w-6 h-6" />
                </div>
                <input 
                  type="text" 
                  placeholder="Pesquise por 'Boleto', 'Cancelamento', 'Juros'..." 
                  className="w-full px-4 py-3 bg-transparent text-slate-800 placeholder-slate-400 font-medium outline-none text-lg"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                />
                {faqSearch && (
                  <button onClick={() => setFaqSearch('')} className="mr-3 text-slate-400 hover:text-slate-600 text-xs font-bold uppercase">
                    Limpar
                  </button>
                )}
             </div>
          </div>

          {/* FAQ Content */}
          <div className="space-y-8 pb-20">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((category, catIdx) => (
                <div key={catIdx} className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${catIdx * 100}ms` }}>
                   <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-hero-600 shadow-sm">
                         <Zap className="w-4 h-4 fill-hero-600" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-800">{category.category}</h3>
                   </div>
                   
                   <div className="divide-y divide-slate-50">
                      {category.items.map((item, itemIdx) => {
                         const uniqueId = `${category.category}-${item.q}`;
                         const isOpen = openFaqIndex === uniqueId;

                         return (
                            <div key={itemIdx} className="group">
                               <button 
                                 onClick={() => toggleFaq(uniqueId)}
                                 className={`
                                   w-full text-left px-8 py-5 flex items-start justify-between transition-all duration-300
                                   ${isOpen ? 'bg-hero-50/30' : 'hover:bg-slate-50'}
                                 `}
                               >
                                  <div className="flex items-start gap-4">
                                     <MessageCircle className={`w-5 h-5 mt-0.5 transition-colors ${isOpen ? 'text-hero-600' : 'text-slate-300 group-hover:text-hero-400'}`} />
                                     <span className={`font-medium text-base pr-8 ${isOpen ? 'text-hero-900' : 'text-slate-600'}`}>
                                       {item.q}
                                     </span>
                                  </div>
                                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 text-slate-400 ${isOpen ? 'rotate-180 text-hero-600' : ''}`} />
                               </button>
                               
                               <div 
                                 className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                               >
                                  <div className="px-8 pb-8 pl-[4.5rem] pt-2">
                                     <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-600 leading-relaxed text-sm relative">
                                        <div className="absolute -left-2 top-8 w-2 h-2 bg-slate-200 rotate-45"></div>
                                        {item.a}
                                     </div>
                                  </div>
                               </div>
                            </div>
                         );
                      })}
                   </div>
                </div>
              ))
            ) : (
               <div className="text-center py-20">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                     <Search className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Ops! Nada encontrado.</h3>
                  <p className="text-slate-500">Tente buscar por termos diferentes ou navegue pelas categorias acima.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};