import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronRight, Sparkles, BookOpen, Clock, Tag, X } from 'lucide-react';
import { searchAllModules, SearchSuggestion } from '../searchEngine';

interface GlobalSearchProps {
  onSelectModule: (courseId: string, moduleIndex: number) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ 
  onSelectModule, 
  placeholder = "🔍 Pesquisar em todos os cursos (ex: cancelamento, whatsapp, boletos)...",
  className = "",
  autoFocus = false
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length >= 2) {
      const results = searchAllModules(query);
      setSuggestions(results);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (courseId: string, moduleId: number) => {
    // moduleIndex is (moduleId - 1)
    const index = moduleId - 1;
    onSelectModule(courseId, index);
    setQuery('');
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Field */}
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-400 pointer-events-none">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-hero-100/30 focus:border-hero-500 transition-all font-sans text-slate-800 text-sm font-semibold placeholder:text-slate-400 placeholder:font-medium"
        />
        {query && (
          <button 
            onClick={clearSearch}
            className="absolute right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestion Dropdown Overlay */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-3 bg-white border border-slate-200 rounded-3xl shadow-2xl z-50 overflow-hidden max-h-[480px] flex flex-col divide-y divide-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
          
          {/* Header */}
          <div className="px-5 py-3.5 bg-slate-50 flex items-center justify-between shrink-0">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-hero-500 fill-hero-500" />
              Sugestões Conectadas ({suggestions.length})
            </span>
            <span className="text-[10px] text-slate-400 font-medium font-sans bg-slate-100 px-2 py-0.5 rounded-full">
              Busca Global Unificada
            </span>
          </div>

          {/* Results List */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
            {suggestions.length > 0 ? (
              suggestions.map((item, idx) => {
                const isFinanceiro = item.courseId === 'financeiro';
                
                // Helper to highlight matching text
                const highlightText = (text: string, highlight: string) => {
                  if (!highlight.trim()) return <span>{text}</span>;
                  const regex = new RegExp(`(${highlight.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi');
                  const parts = text.split(regex);
                  return (
                    <span>
                      {parts.map((part, i) => 
                        regex.test(part) ? (
                          <mark key={i} className="bg-amber-100 text-slate-900 font-bold px-0.5 rounded-sm">
                            {part}
                          </mark>
                        ) : (
                          part
                        )
                      )}
                    </span>
                  );
                };

                return (
                  <div 
                    key={idx}
                    onClick={() => handleSelect(item.courseId, item.moduleId)}
                    className="group p-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white transition-all cursor-pointer flex items-start gap-4"
                  >
                    {/* Course Avatar Badge */}
                    <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-transform group-hover:scale-105 border ${
                      isFinanceiro 
                        ? 'bg-purple-50 text-purple-600 border-purple-100/60 shadow-sm' 
                        : 'bg-pink-50 text-pink-600 border-pink-100/60 shadow-sm'
                    }`}>
                      {isFinanceiro ? 'F' : 'R'}
                    </div>

                    {/* Details Column */}
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Course Name */}
                        <span className={`text-[9px] font-extrabold uppercase tracking-wider font-mono ${
                          isFinanceiro ? 'text-purple-600' : 'text-pink-600'
                        }`}>
                          {item.courseTitle}
                        </span>
                        
                        <span className="text-slate-300 text-[10px]">•</span>

                        {/* Category */}
                        <span className="text-[9px] text-slate-400 uppercase font-extrabold font-mono tracking-wider">
                          {highlightText(item.category, query)}
                        </span>

                        <span className="text-slate-300 text-[10px]">•</span>

                        {/* Duration */}
                        <span className="text-[9px] font-medium text-slate-400 flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5 text-slate-300" />
                          {item.duration}
                        </span>
                      </div>

                      {/* Module Title */}
                      <h4 className="text-sm font-extrabold text-slate-950 group-hover:text-hero-600 transition-colors flex items-start justify-between leading-snug">
                        <span className="block break-words pr-2">{highlightText(item.title, query)}</span>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-hero-600 group-hover:translate-x-1.5 transition-all shrink-0 mt-0.5" />
                      </h4>

                      {/* Description excerpt */}
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-2">
                        {highlightText(item.snippet, query)}
                      </p>

                      {/* Highlight matched keywords */}
                      {item.matchType === 'keyword' && (
                        <div className="flex items-center gap-1.5 pt-1">
                          <Tag className="w-3 h-3 text-hero-500" />
                          <span className="text-[9px] text-hero-600 font-extrabold uppercase tracking-wide font-mono">
                            Palavra-chave conectada com seu termo de busca
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-500 space-y-2">
                <p className="text-sm font-semibold">Nenhuma correspondência direta encontrada.</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Tente buscar por termos chaves operacionais como <strong className="text-slate-600">cancelamento</strong>, <strong className="text-slate-600">whatsapp</strong>, <strong className="text-slate-600">boletos</strong>, <strong className="text-slate-600">desconto</strong> ou <strong className="text-slate-600">hubspot</strong>.
                </p>
              </div>
            )}
          </div>

          {/* Quick Footer Guides */}
          <div className="px-5 py-3.5 bg-slate-50 text-[10px] font-bold text-slate-400 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-slate-400" /> CX & Billing Playbooks</span>
            <span>Estude em qualquer ordem clicando no resultado</span>
          </div>
        </div>
      )}
    </div>
  );
};
