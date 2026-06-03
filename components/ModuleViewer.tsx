import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, CheckCircle, ArrowLeft, Award, Sparkles, Play, Pause, Volume2, VolumeX, Maximize2, Settings, X, Info, RotateCcw } from 'lucide-react';
import { Module } from '../types';
import confetti from 'canvas-confetti';

interface ModuleViewerProps {
  module: Module;
  isCompleted: boolean;
  onComplete: () => void;
  onNext: () => void;
  isLastModule: boolean;
  onFinishCourse: () => void;
  courseId?: string;
}

export const ModuleViewer: React.FC<ModuleViewerProps> = ({ 
  module, 
  isCompleted, 
  onComplete, 
  onNext,
  isLastModule,
  onFinishCourse,
  courseId
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // States for intro video modal
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useState(() => {
    return localStorage.getItem('hero_academy_intro_seen') === 'true';
  });

  // Custom Video Player States
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoVolume, setVideoVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  // Default beautiful workspace video
  const [videoUrl, setVideoUrl] = useState(() => {
    return localStorage.getItem('hero_academy_custom_video_url') || 'https://drive.google.com/file/d/19TdrrggCq2GRmpQtuD4eIoDf5MRvkL04/view?usp=sharing';
  });

  // Scroll top on module change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [module.id]);

  // Handle Play/Pause for custom HTML5 player
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => console.log('Playback error:', err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVideoVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = vol === 0;
    }
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleSkipIntro = () => {
    setHasSeenIntro(true);
    localStorage.setItem('hero_academy_intro_seen', 'true');
    triggerConfetti();
  };

  const handleFinishVideo = () => {
    // If HTML5 video is playing, pause it
    if (videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setShowVideoModal(false);
    setHasSeenIntro(true);
    localStorage.setItem('hero_academy_intro_seen', 'true');
    triggerConfetti();
  };

  const saveCustomVideoUrl = (newUrl: string) => {
    setVideoUrl(newUrl);
    localStorage.setItem('hero_academy_custom_video_url', newUrl);
    setShowConfig(false);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#e6005a', '#f43f78', '#fb7199', '#ffffff']
    });
  };

  // Generate dynamic, beautiful subtitles matching the custom narration timeline
  const getSubtitle = (time: number) => {
    if (time >= 0 && time < 4.5) return "Bem-vindo à trilha de negociação e cobrança da Company Hero! 🌸";
    if (time >= 4.5 && time < 13.5) return "Esta trilha foi criada para transformar a forma como você se comunica com o cliente, conduz negociações difíceis e protege a receita da empresa...";
    if (time >= 13.5 && time < 17.5) return "...sempre com muita empatia, clareza e com o nosso Jeito Hero! ☑️";
    if (time >= 17.5 && time < 25.0) return "Ao longo de 8 módulos você vai compreender a operação e o impacto que ela gera para os clientes e para o negócio!";
    if (time >= 25.0 && time < 32.0) return "E agora, vamos te mostrar o que você vai encontrar em cada etapa dessa jornada! Vamos começar? 🚀";
    return "";
  };

  // Extract Youtube ID if it is a Youtube link
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Extract Google Drive ID if it is a Google Drive link
  const getGoogleDriveId = (url: string) => {
    const regExp = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/(?:file\/d\/))([a-zA-Z0-9_-]{25,50})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const youtubeId = getYouTubeId(videoUrl);
  const driveId = getGoogleDriveId(videoUrl);

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden relative" ref={contentRef}>
      
      {/* Header - Premium & Sticky */}
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
             <span>{module.category}</span>
             <ChevronRight className="w-3 h-3 text-slate-300" />
             <span className="text-hero-600">Módulo {module.id}</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-5">
               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-hero-50 to-white border border-hero-100 text-hero-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                 {module.icon}
               </div>
               <div>
                 <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                   {module.title}
                 </h2>
                 <div className="flex items-center gap-3 text-sm text-slate-500 mt-2">
                    <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-xs font-bold text-slate-600">{module.duration}</span>
                    {isCompleted && (
                      <span className="text-green-600 text-xs font-bold flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                        <CheckCircle className="w-3 h-3"/> Concluído
                      </span>
                    )}
                 </div>
               </div>
            </div>

            <div className="flex items-center gap-2">
               {/* Assistir Apresentação button - only for Module 1 of financeiro course */}
               {courseId === 'financeiro' && module.id === 1 && hasSeenIntro && (
                 <button 
                   onClick={() => setShowVideoModal(true)}
                   className="px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 border bg-white border-slate-200 hover:border-hero-200 hover:text-hero-600 text-slate-600 hover:shadow-md"
                 >
                   <Play className="w-3.5 h-3.5" /> Assistir Apresentação
                 </button>
               )}

               <button 
                 onClick={onComplete}
                 className={`
                   px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 border shadow-sm
                   ${isCompleted 
                     ? 'bg-green-50 border-green-200 text-green-700' 
                     : 'bg-white border-slate-200 text-slate-600 hover:border-hero-200 hover:text-hero-600 hover:shadow-md'}
                 `}
               >
                 {isCompleted ? (
                   <><CheckCircle className="w-4 h-4" /> Lido</>
                 ) : (
                   <><div className="w-4 h-4 rounded-full border-2 border-slate-300 group-hover:border-hero-500"></div> Marcar como lido</>
                 )}
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-12">
          
          {courseId === 'financeiro' && module.id === 1 && !hasSeenIntro ? (
            // INTRO SPLASH BLOCKER (Only shown on Module 1 the first time, preventing material from showing beforehand)
            <div className="py-12 md:py-20 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-2xl mx-auto">
              <div className="relative mb-10 group">
                <div className="absolute -inset-4 rounded-full bg-hero-100 animate-pulse opacity-50 blur-xl"></div>
                <button 
                  onClick={() => setShowVideoModal(true)}
                  className="relative flex items-center justify-center w-28 h-28 bg-gradient-to-tr from-hero-600 to-hero-500 rounded-full text-white shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-300 shadow-hero-500/30"
                >
                  <Play className="w-10 h-10 ml-2 text-white fill-current animate-bounce shrink-0" />
                </button>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-hero-50 border border-hero-100 text-hero-600 text-[10px] font-extrabold uppercase tracking-widest mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-hero-600 animate-spin" />
                <span>Vídeo de Boas-vindas</span>
              </span>

              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-5">
                Alavanque seu Aprendizado!
              </h1>

              <p className="text-slate-500 leading-relaxed font-semibold text-base mb-10 text-center max-w-lg">
                Preparamos uma introdução especial em vídeo para alinhar nosso Tom de Voz e os múltiplos aprendizados desta jornada. Assista ao vídeo antes de prosseguir para o material ilustrativo.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                 <button 
                   onClick={() => setShowVideoModal(true)}
                   className="w-full sm:w-auto px-10 py-4 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg transition-transform hover:scale-[1.03] active:scale-95 text-sm flex items-center justify-center gap-2"
                 >
                   ▶ Iniciar com Vídeo
                 </button>
                 <button 
                   onClick={handleSkipIntro}
                   className="w-full sm:w-auto px-10 py-4 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-2xl shadow-sm transition-transform hover:scale-[1.03] active:scale-95 text-sm"
                 >
                   Pular Introdução
                 </button>
              </div>
            </div>
          ) : (
            // REGULAR CORE LESSON MATERIAL
            <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
              {module.content}
            </div>
          )}

          {/* Footer Navigation Area */}
          <div className="mt-20 pt-10 border-t border-slate-100">
             <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                    {isLastModule ? <Sparkles className="w-6 h-6" /> : <Award className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">
                      {isLastModule 
                        ? (isCompleted ? "Curso Finalizado!" : "Última etapa!") 
                        : (isCompleted ? "Módulo Finalizado!" : "Finalize este módulo")}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {isLastModule 
                         ? "Parabéns! Você completou toda a trilha de conhecimento." 
                         : (isCompleted ? "Continue avançando para dominar o conteúdo." : "Marque como lido para prosseguir.")}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (!isCompleted) onComplete();
                    if (isLastModule) {
                      onFinishCourse();
                    } else {
                      onNext();
                    }
                  }}
                  className={`
                    group relative overflow-hidden text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] w-full md:w-auto text-center
                    ${isLastModule ? 'bg-gradient-to-r from-hero-600 to-hero-500 shadow-hero-600/30' : 'bg-hero-600 hover:bg-hero-700 shadow-hero-600/30'}
                  `}
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {isLastModule ? (
                      <>
                        <Award className="w-4 h-4" />
                        Concluir Curso
                      </>
                    ) : (
                      <>
                        Próximo Módulo
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
             </div>
          </div>
          
          <div className="h-20"></div>
        </div>
      </div>

      {/* MULTIMODAL VIDEO PRESENTATION POP-UP MODAL */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl relative w-full max-w-2xl overflow-hidden flex flex-col animate-in scale-in-95 duration-500">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hero-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-hero-600"></span>
                </span>
                <span className="font-extrabold text-sm text-slate-800 uppercase tracking-widest">Apresentação da Trilha</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowConfig(!showConfig)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-hero-600 hover:bg-hero-50 transition-colors"
                  title="Configurar Link do Vídeo"
                >
                  <Settings className="w-4.5 h-4.5" />
                </button>
                <button 
                  onClick={handleFinishVideo}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player Display */}
            <div className="relative aspect-video bg-slate-950 group/player overflow-hidden">
              {youtubeId ? (
                // IF YOUTUBE LINK IS PROVIDED
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=1&rel=0&modestbranding=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : driveId ? (
                // IF GOOGLE DRIVE LINK IS PROVIDED
                <iframe
                  className="absolute inset-0 w-full h-full animate-fade-in"
                  src={`https://drive.google.com/file/d/${driveId}/preview`}
                  title="Google Drive video player"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              ) : (
                // PREMIUM CUSTOM HTML5 VIDEO PLAYER WITH CONTROLS
                <>
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    onClick={togglePlay}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleFinishVideo}
                    autoPlay
                  />

                  {/* Subtitle Overlay (Track audio narration) */}
                  {isPlaying && getSubtitle(currentTime) && (
                    <div className="absolute bottom-16 left-6 right-6 text-center z-10 pointer-events-none">
                      <span className="inline-block bg-black/75 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold tracking-wide text-white leading-relaxed max-w-full shadow-lg border border-white/10 backdrop-blur-sm animate-in fade-in duration-200">
                        {getSubtitle(currentTime)}
                      </span>
                    </div>
                  )}

                  {/* Big Play Overlay on Pause */}
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-xs pointer-events-none transition-all duration-300">
                      <button 
                        onClick={togglePlay}
                        className="p-5 rounded-full bg-hero-600 text-white shadow-xl scale-110 pointer-events-auto"
                      >
                        <Play className="w-8 h-8 ml-1" />
                      </button>
                    </div>
                  )}

                  {/* Custom Controls Bar (Shows on Hover) */}
                  <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between px-4 opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 z-20">
                     <div className="flex items-center gap-3">
                       <button onClick={togglePlay} className="text-white hover:text-hero-400 transition-colors">
                         {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                       </button>
                       <span className="text-[10px] font-semibold text-slate-300 select-none">
                         {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')} / {Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}
                       </span>
                     </div>

                     {/* Progress Scrubber */}
                     <input 
                       type="range"
                       min="0"
                       max={duration || 100}
                       step="0.1"
                       value={currentTime}
                       onChange={handleSeek}
                       className="flex-1 mx-4 h-1.5 bg-white/20 rounded-lg cursor-pointer accent-hero-500 hover:accent-hero-400 focus:outline-none"
                     />

                     <div className="flex items-center gap-3">
                        <button onClick={toggleMute} className="text-white hover:text-hero-400 transition-colors">
                          {isMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
                        </button>
                        <input 
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={isMuted ? 0 : videoVolume}
                          onChange={handleVolumeChange}
                          className="w-16 h-1 bg-white/30 rounded-lg cursor-pointer accent-hero-400"
                        />
                        <button onClick={handleFullscreen} className="text-white hover:text-hero-400 transition-colors">
                          <Maximize2 className="w-4.5 h-4.5" />
                        </button>
                     </div>
                  </div>
                </>
              )}
            </div>

            {/* Custom URL Configuration Drawer (Hidden by default, allows changes on the Go) */}
            {showConfig && (
              <div className="p-5 bg-slate-50 border-b border-slate-100 animate-in slide-in-from-top-4 duration-300">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 animate-spin text-hero-500" />
                  Configurar Link de Exibição
                </h4>
                <p className="text-xs text-slate-500 mb-4">Insira abaixo o link direto de um vídeo (.mp4 ou link do YouTube) para alterar o vídeo do pop-up:</p>
                <div className="flex gap-2">
                   <input 
                     type="text" 
                     id="custom-url-input"
                     defaultValue={videoUrl}
                     placeholder="Cole link do MP4 ou YouTube..." 
                     className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-hero-500 font-medium"
                   />
                   <button 
                     onClick={() => {
                       const input = document.getElementById('custom-url-input') as HTMLInputElement;
                       if (input) saveCustomVideoUrl(input.value.trim());
                     }}
                     className="bg-hero-600 hover:bg-hero-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                   >
                     Salvar
                   </button>
                </div>
              </div>
            )}

            {/* Modal Actions / Audio Translation */}
            <div className="p-6 bg-slate-50 flex flex-col gap-4 relative z-10">
              
              {/* Narration script block matching screencast summary exactly */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-[11px] text-slate-500 leading-relaxed max-h-24 overflow-y-auto">
                <p className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1.5 text-hero-600">
                  <Info className="w-3.5 h-3.5" />
                  Transcrição da Narrativa
                </p>
                "Bem-vindo à trilha de negociação e cobrança da Company Hero. Esta trilha foi criada para transformar a forma como você se comunica com o cliente, conduz negociações difíceis e protege a receita da empresa, sempre com empatia e clareza. Ao longo de 8 módulos você vai compreender não só como funciona a operação, mas principalmente o impacto que ela gera para o cliente e para o seu negócio. E agora, eu vou te mostrar de forma rápida o que você encontrará em cada etapa dessa jornada..."
              </div>

              <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-200/50">
                <span className="text-[11px] text-slate-400 font-semibold italic">Duração: ~32 segundos</span>
                <button 
                  onClick={handleFinishVideo}
                  className="px-6 py-2.5 bg-hero-600 hover:bg-hero-700 text-white font-bold rounded-xl text-xs shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  Concluir e Liberar Módulo 🚀
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
