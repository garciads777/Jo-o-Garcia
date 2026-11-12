import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, ArrowRight } from 'lucide-react';

interface ShowreelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartProject: () => void;
}

export const ShowreelModal: React.FC<ShowreelModalProps> = ({
  isOpen,
  onClose,
  onStartProject
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/90 backdrop-blur-lg"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#090b0e] border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#060709]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-white">
              João Garcia · Showreel Oficial
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fechar showreel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real Video Player Container */}
        <div className="relative aspect-[16/9] w-full bg-black overflow-hidden flex flex-col justify-between">
          <video
            ref={videoRef}
            poster="/assets/joao_garcia_herobanner_v01.jpg"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onError={() => {}}
            className="w-full h-full object-contain bg-black"
          >
            <source src="/assets/joao_garcia_herobanner_v01_compress.webm" type="video/webm" />
            <source src="/assets/joao_garcia_herobanner_v01_compress.mp4" type="video/mp4" />
          </video>

          {/* Top Info Bar */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-xs font-mono text-zinc-400 pointer-events-none">
            <span className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 text-white">
              4K MASTER REEL · 24 FPS
            </span>
            <span className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 text-white">
              {formatTime(currentTime)} / {formatTime(duration || 0)}
            </span>
          </div>

          {/* Bottom Player Controls */}
          <div className="absolute bottom-4 left-4 right-4 z-10 p-3 bg-black/80 backdrop-blur-md rounded-xl border border-white/15">
            {/* Timeline Bar */}
            <div
              className="w-full h-2 bg-white/20 rounded-full mb-3 cursor-pointer overflow-hidden group/bar"
              onClick={handleScrub}
            >
              <div
                className="h-full bg-white transition-all duration-75 group-hover/bar:bg-zinc-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-1.5 rounded text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
                  aria-label={isMuted ? 'Desmutar' : 'Mutar'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span className="text-[11px] font-mono text-zinc-300">
                    {isMuted ? 'Mudo' : 'Áudio Ativo'}
                  </span>
                </button>

                <span className="font-mono text-zinc-300 text-xs ml-2">
                  {formatTime(currentTime)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title="Tela cheia"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onStartProject();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  <span>Iniciar Projeto</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
