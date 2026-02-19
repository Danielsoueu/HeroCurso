import React from 'react';
import { AlertCircle, CheckCircle, XCircle, MessageSquare, Info, Zap, Quote } from 'lucide-react';

export const InfoBox = ({ title, children, type = 'info' }: { title?: string, children?: React.ReactNode, type?: 'info' | 'warning' | 'success' | 'error' | 'hero' }) => {
  const styles = {
    info: {
      bg: "bg-blue-50/50",
      border: "border-blue-100",
      bar: "bg-blue-500",
      text: "text-blue-900",
      icon: "text-blue-600"
    },
    warning: {
      bg: "bg-amber-50/50",
      border: "border-amber-100",
      bar: "bg-amber-500",
      text: "text-amber-900",
      icon: "text-amber-600"
    },
    success: {
      bg: "bg-green-50/50",
      border: "border-green-100",
      bar: "bg-green-500",
      text: "text-green-900",
      icon: "text-green-600"
    },
    error: {
      bg: "bg-rose-50/50",
      border: "border-rose-100",
      bar: "bg-rose-500",
      text: "text-rose-900",
      icon: "text-rose-600"
    },
    hero: {
      bg: "bg-pink-50/30",
      border: "border-pink-100",
      bar: "bg-hero-600",
      text: "text-slate-800",
      icon: "text-hero-600"
    }
  };

  const currentStyle = styles[type];

  const icons = {
    info: <Info className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    hero: <Zap className="w-5 h-5" />
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border ${currentStyle.border} ${currentStyle.bg} shadow-sm group hover:shadow-md transition-shadow duration-300`}>
      {/* Colored Left Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${currentStyle.bar}`}></div>
      
      <div className="p-5 pl-7">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 flex-shrink-0 ${currentStyle.icon}`}>
            {icons[type]}
          </div>
          <div className="flex-1">
            {title && (
              <h4 className={`font-bold text-sm uppercase tracking-wider mb-2 ${currentStyle.text} opacity-90`}>
                {title}
              </h4>
            )}
            <div className={`text-sm leading-relaxed text-slate-600`}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ScriptCard = ({ title, script }: { title: string, script: string }) => {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white shadow-card hover:shadow-lg transition-all duration-300 group overflow-hidden">
      {/* Decorative gradient top bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-hero-500 to-hero-600"></div>
      
      <div className="p-6 relative">
        {/* Background Watermark */}
        <Quote className="absolute top-4 right-4 w-12 h-12 text-slate-50 opacity-50 transform rotate-12 group-hover:rotate-0 transition-transform duration-500" />
        
        <h5 className="flex items-center gap-2 text-xs font-bold text-hero-600 uppercase tracking-widest mb-4 z-10 relative">
          <MessageSquare className="w-3 h-3" />
          {title}
        </h5>
        
        <div className="relative bg-slate-50 p-5 rounded-xl border border-slate-100 text-slate-700 text-sm leading-relaxed font-medium">
          <div className="absolute -left-3 top-6 w-1 h-8 bg-hero-300 rounded-r-full"></div>
          {script.split('\n').map((line, i) => (
             <React.Fragment key={i}>
               {line}
               {i < script.split('\n').length - 1 && <br />}
             </React.Fragment>
          ))}
        </div>
        
        <div className="mt-3 flex justify-end">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider group-hover:text-hero-500 transition-colors">
            Copiar Script
          </span>
        </div>
      </div>
    </div>
  );
};

export const ComparisonRow = ({ wrong, right }: { wrong: string, right: string }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 border-b border-slate-50 last:border-0 group hover:bg-slate-50/50 transition-colors rounded-lg px-2 -mx-2">
      <div className="flex items-start gap-3 text-slate-400">
        <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
           <XCircle className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm line-through decoration-red-300/50 opacity-80">{wrong}</span>
      </div>
      <div className="flex items-start gap-3 text-slate-700">
        <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center shadow-sm">
           <CheckCircle className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-semibold">{right}</span>
      </div>
    </div>
  );
};