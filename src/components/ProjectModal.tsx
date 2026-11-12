import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Check, ArrowRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onStartProject: (serviceType: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onStartProject
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // When project changes, reset state and attempt autoplay
  useEffect(() => {
    setIsPlaying(false);
    setHasStarted(false);

    if (project?.videoSrc && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasStarted(true);
          })
          .catch(() => {
            setIsPlaying(false);
            setHasStarted(false);
          });
      }
    }
  }, [project]);

  if (!project) return null;

  const isVertical = project.aspectRatio === '9:16';

  const handleStartPlay = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = false;
    videoRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      })
      .catch(() => {
        // Fallback with muted if unmuted play is prevented by browser
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().then(() => {
            setIsPlaying(true);
            setHasStarted(true);
          });
        }
      });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/90 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#0d0f14] border border-white/20 rounded-xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090b0e]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
              {project.category === 'music-art'
                ? 'Videoclipes e Arte'
                : project.category === 'social-media'
                ? 'Social Media'
                : project.category === 'premiere-filmes'
                ? 'Premiere - Filmes'
                : 'Motion Design'}
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-semibold text-white">
              {project.client}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Main Video Presentation Container */}
          <div className="flex justify-center bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            {project.vimeoId ? (
              /* Vimeo Embed Player */
              <div
                className={`relative w-full ${
                  isVertical
                    ? 'max-w-xs sm:max-w-sm aspect-[9/16] mx-auto'
                    : 'aspect-video min-h-[260px] sm:min-h-[460px]'
                } bg-black overflow-hidden`}
              >
                <iframe
                  src={`https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
                  title={project.title}
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  allowFullScreen
                  className="w-full h-full border-0 absolute inset-0"
                />
              </div>
            ) : project.youtubeId ? (
              /* YouTube Embed Player */
              <div
                className={`relative w-full ${
                  isVertical
                    ? 'max-w-xs sm:max-w-sm aspect-[9/16] mx-auto'
                    : 'aspect-video min-h-[260px] sm:min-h-[460px]'
                } bg-black overflow-hidden`}
              >
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0 absolute inset-0"
                />
              </div>
            ) : project.videoSrc ? (
              /* Real HTML5 Video Player with Native Controls and 1-Click Play Overlay */
              <div
                className={`relative w-full ${
                  isVertical
                    ? 'max-w-xs sm:max-w-sm aspect-[9/16]'
                    : 'aspect-video'
                } bg-black flex items-center justify-center overflow-hidden group`}
              >
                <video
                  key={project.id}
                  ref={videoRef}
                  src={project.videoSrc}
                  poster={project.posterSrc}
                  controls
                  playsInline
                  preload="auto"
                  onPlay={() => {
                    setIsPlaying(true);
                    setHasStarted(true);
                  }}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full h-full object-contain bg-black z-10"
                />

                {/* Big Center Play Button Overlay before video starts */}
                {!hasStarted && (
                  <div
                    onClick={handleStartPlay}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[2px] transition-all cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all">
                      <Play className="w-9 h-9 fill-black ml-1" />
                    </div>
                    <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-white bg-black/80 px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
                      Clique para Assistir
                    </span>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Project Details Columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
            
            {/* Left 7 Columns: Context, Challenge, Solution */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    O Desafio Estratégico
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {project.challenge}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    A Solução Audiovisual & Motion
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Metadata, Deliverables, Tools, Action */}
            <div className="md:col-span-5 space-y-6 md:border-l md:border-white/10 md:pl-8">
              
              {/* Disciplines & Roles */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
                  Atuações & Créditos
                </span>
                <div className="space-y-1.5 text-xs text-zinc-300">
                  {project.roles.map((role, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                      <span>{role}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
                  Entregáveis Produzidos
                </span>
                <div className="space-y-1 text-xs text-zinc-300">
                  {project.deliverables.map((del, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools Used */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
                  Suíte de Produção
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-400">
                  {project.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded bg-black/40 border border-white/10"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Action */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onStartProject(project.roles[0]);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-black bg-white rounded-md hover:bg-zinc-200 transition-colors shadow-md cursor-pointer"
                >
                  <span>Iniciar Projeto Similar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
