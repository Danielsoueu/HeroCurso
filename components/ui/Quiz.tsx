import React, { useState } from 'react';
import { CheckCircle, XCircle, Trophy, ArrowRight, RefreshCw, BrainCircuit } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizProps {
  questions: Question[];
  onExit?: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onExit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return; // Prevent multiple clicks

    const correct = index === questions[currentQuestion].correctIndex;
    setSelectedOption(index);
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = "";
    let color = "";

    if (percentage === 100) {
      message = "Mestre da Retenção! 🏆";
      color = "text-yellow-600 bg-yellow-50 border-yellow-200";
    } else if (percentage >= 70) {
      message = "Mandou muito bem! 👏";
      color = "text-green-600 bg-green-50 border-green-200";
    } else {
      message = "Precisa revisar a FAQ! 📚";
      color = "text-hero-600 bg-hero-50 border-hero-200";
    }

    return (
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-gradient-to-br from-hero-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-hero-500/30">
          <Trophy className="w-12 h-12 text-white" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Quiz Finalizado!</h2>
        <div className={`inline-block px-6 py-2 rounded-full font-bold text-lg mb-6 border ${color}`}>
          {message}
        </div>

        <div className="flex justify-center items-center gap-12 mb-10">
          <div className="text-center">
            <div className="text-4xl font-black text-slate-900">{score}/{questions.length}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Acertos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-slate-900">{percentage}%</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score</div>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={handleRestart}
            className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <RefreshCw className="w-5 h-5" />
            Tentar Novamente
          </button>
          {onExit && (
            <button 
              onClick={onExit}
              className="flex-1 bg-white text-slate-600 border border-slate-200 font-bold py-4 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              Voltar para FAQ
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentQData = questions[currentQuestion];
  const colors = [
    'bg-red-500 hover:bg-red-600 border-red-700',      // Kahoot Red
    'bg-blue-500 hover:bg-blue-600 border-blue-700',    // Kahoot Blue
    'bg-yellow-500 hover:bg-yellow-600 border-yellow-700', // Kahoot Yellow
    'bg-green-500 hover:bg-green-600 border-green-700'   // Kahoot Green
  ];

  const shapes = ["▲", "◆", "●", "■"];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
          <span>Questão {currentQuestion + 1} de {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-hero-600 transition-all duration-500 ease-out" 
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden mb-6">
        <div className="p-8 text-center bg-slate-50 border-b border-slate-100">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight">
            {currentQData.question}
          </h2>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQData.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === currentQData.correctIndex;
            
            // Logic for visual state
            let buttonClass = `
              relative p-6 rounded-xl text-white font-bold text-left transition-all duration-200 transform
              shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1
              flex items-center gap-4 min-h-[100px]
            `;

            if (selectedOption === null) {
              // Default state
              buttonClass += ` ${colors[idx]} hover:-translate-y-1 cursor-pointer`;
            } else {
              // Revealed state
              if (isCorrectOption) {
                buttonClass += " bg-green-500 border-green-700 opacity-100 ring-4 ring-green-300 ring-offset-2";
              } else if (isSelected && !isCorrectOption) {
                buttonClass += " bg-red-500 border-red-700 opacity-100 ring-4 ring-red-300 ring-offset-2";
              } else {
                buttonClass += " bg-slate-300 border-slate-400 opacity-40 cursor-not-allowed";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={selectedOption !== null}
                className={buttonClass}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-black/20 rounded flex items-center justify-center text-sm">
                  {shapes[idx]}
                </div>
                <span className="text-sm md:text-base leading-snug shadow-black drop-shadow-md">
                  {option}
                </span>
                {selectedOption !== null && isCorrectOption && (
                   <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white animate-bounce" />
                )}
                {selectedOption !== null && isSelected && !isCorrectOption && (
                   <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback & Next Button */}
      {selectedOption !== null && (
        <div className={`
          rounded-xl p-6 border-l-4 shadow-lg animate-in slide-in-from-bottom-2 fade-in duration-300
          ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}
        `}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className={`font-bold text-lg mb-1 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? 'Correto! 🎉' : 'Ops, não foi dessa vez... 😅'}
              </h3>
              <p className="text-slate-600 text-sm">
                {currentQData.explanation}
              </p>
            </div>
            <button 
              onClick={handleNext}
              className="px-8 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg"
            >
              {currentQuestion < questions.length - 1 ? 'Próxima' : 'Ver Resultado'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};