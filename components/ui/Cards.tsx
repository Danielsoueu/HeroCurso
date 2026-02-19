import React from 'react';
import { AlertCircle, CheckCircle, XCircle, MessageSquare, Info } from 'lucide-react';

// Fix: Made children optional to prevent TypeScript errors in usage
export const InfoBox = ({ title, children, type = 'info' }: { title?: string, children?: React.ReactNode, type?: 'info' | 'warning' | 'success' | 'error' | 'hero' }) => {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    hero: "bg-hero-50 border-hero-200 text-hero-900"
  };

  const icons = {
    info: <Info className="w-5 h-5 text-blue-600" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />,
    hero: <MessageSquare className="w-5 h-5 text-hero-600" />
  };

  return (
    <div className={`p-4 rounded-xl border ${styles[type]} flex gap-3 shadow-sm`}>
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        {title && <h4 className="font-bold text-sm uppercase tracking-wider mb-1 opacity-90">{title}</h4>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

export const ScriptCard = ({ title, script }: { title: string, script: string }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-hero-100 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="absolute top-0 left-0 w-1 h-full bg-hero-500"></div>
      <div className="p-5">
        <h5 className="flex items-center gap-2 text-xs font-bold text-hero-600 uppercase tracking-widest mb-3">
          <MessageSquare className="w-3 h-3" />
          {title}
        </h5>
        <div className="relative bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 italic text-sm leading-relaxed font-serif">
          <span className="absolute -top-2 -left-1 text-4xl text-gray-200 pointer-events-none">“</span>
          {script.split('\n').map((line, i) => (
             <React.Fragment key={i}>
               {line}
               {i < script.split('\n').length - 1 && <br />}
             </React.Fragment>
          ))}
          <span className="absolute -bottom-4 -right-1 text-4xl text-gray-200 pointer-events-none">”</span>
        </div>
      </div>
    </div>
  );
};

export const ComparisonRow = ({ wrong, right }: { wrong: string, right: string }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-2 text-red-600 bg-red-50/50 p-2 rounded">
        <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span className="text-sm line-through decoration-red-300">{wrong}</span>
      </div>
      <div className="flex items-start gap-2 text-green-700 bg-green-50/50 p-2 rounded">
        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span className="text-sm font-medium">{right}</span>
      </div>
    </div>
  );
};