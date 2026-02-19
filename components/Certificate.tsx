import React, { useState } from 'react';
import { Download, ArrowLeft, CheckCircle, Share2, Printer } from 'lucide-react';

interface CertificateProps {
  courseName: string;
  onBack: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({ courseName, onBack }) => {
  const [studentName, setStudentName] = useState('');
  const [role, setRole] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  
  const date = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleGenerate = () => {
    if (studentName.trim()) {
      setIsEditing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* No Print Header */}
      <div className="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center sticky top-0 z-50 no-print">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-hero-600 font-bold text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Home
        </button>
        <div className="flex gap-3">
          {!isEditing && (
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-hero-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-hero-700 transition-colors shadow-md"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Salvar PDF
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto">
        
        {isEditing ? (
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-2">Parabéns!</h2>
            <p className="text-slate-500 text-center mb-8 text-sm">Você concluiu o curso. Preencha seus dados para emitir o certificado oficial.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-hero-500 focus:border-hero-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cargo / Área (Opcional)</label>
                <input 
                  type="text" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ex: Analista Financeiro"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-hero-500 focus:border-hero-500 outline-none transition-all"
                />
              </div>
              <button 
                onClick={handleGenerate}
                disabled={!studentName.trim()}
                className="w-full bg-hero-600 text-white font-bold py-3.5 rounded-xl hover:bg-hero-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-hero-500/30 mt-2"
              >
                Gerar Certificado
              </button>
            </div>
          </div>
        ) : (
          <div className="print-only relative w-full max-w-[1100px] aspect-[1.414/1] bg-white text-slate-900 shadow-2xl overflow-hidden flex flex-col border-[12px] border-double border-hero-600/20 p-12 lg:p-16">
            
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <div className="w-[80%] h-[80%] bg-hero-900 rounded-full blur-3xl"></div>
            </div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>

            {/* Header */}
            <div className="flex justify-between items-start mb-16 relative z-10">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-hero-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">H</div>
                 <div>
                   <h1 className="text-xl font-bold tracking-tight text-slate-900">COMPANY <span className="text-hero-600">HERO</span></h1>
                   <p className="text-[10px] tracking-[0.2em] uppercase text-slate-400 font-bold">Academy</p>
                 </div>
               </div>
               <div className="text-right">
                 <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">Certificado Nº</div>
                 <div className="font-mono text-slate-400 text-sm">{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
               </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
              <h2 className="text-sm font-bold text-hero-600 uppercase tracking-[0.3em] mb-4">Certificado de Conclusão</h2>
              
              <p className="text-2xl lg:text-3xl text-slate-600 font-light mb-8">Certificamos que</p>
              
              <h3 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-4 font-script bg-clip-text text-transparent bg-gradient-to-r from-hero-700 to-hero-500 pb-2">
                {studentName}
              </h3>
              
              {role && <p className="text-lg text-slate-500 font-medium mb-8">({role})</p>}
              
              <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
                concluiu com êxito o curso de qualificação profissional em
              </p>
              
              <div className="mt-6 mb-12">
                 <h4 className="text-3xl font-bold text-slate-900">{courseName}</h4>
                 <div className="h-1 w-24 bg-hero-600 mx-auto mt-4 rounded-full"></div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto flex justify-between items-end relative z-10">
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900">{date}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Data de Emissão</p>
              </div>

              <div className="flex gap-12">
                 <div className="text-center">
                    <div className="w-48 border-b border-slate-300 mb-2">
                      <img src="https://api.dicebear.com/7.x/initials/svg?seed=CH&backgroundColor=transparent" className="h-12 w-auto mx-auto opacity-50 grayscale" alt="Signature" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">Diretoria Hero</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Company Hero</p>
                 </div>
              </div>
            </div>
            
            {/* Bottom Color Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-hero-600 via-hero-500 to-hero-400"></div>
          </div>
        )}
      </div>
    </div>
  );
};