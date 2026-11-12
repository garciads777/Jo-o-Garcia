import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play, RotateCcw, ArrowDown } from 'lucide-react';

interface HeroProps {
  onScrollToPortfolio: () => void;
  onOpenContact?: () => void;
  onPlayShowreel?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onScrollToPortfolio,
  onOpenContact,
  onPlayShowreel
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (hasEnded) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setHasEnded(false);
      setIsPlaying(true);
    } else if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
  };

  return (
    <section id="hero" aria-label="Apresentação e Showreel de João Garcia" className="relative w-full bg-[#08090b] pt-16 md:pt-20">
      {/* Primary Semantic H1 for SEO & Accessibility Architecture */}
      <h1 className="sr-only">
        João Garcia – Diretor de Arte, Motion Design & Filmmaking
      </h1>

      {/* Top Hero Video Banner - Occupying the entire top area */}
      <div className="relative w-full overflow-hidden bg-black aspect-video max-h-[88vh] flex items-center justify-center">
        {!hasError ? (
          <video
            ref={videoRef}
            poster="/assets/joao_garcia_herobanner_v01.jpg"
            autoPlay
            muted={isMuted}
            playsInline
            preload="auto"
            onEnded={handleVideoEnded}
            onError={() => {
              setHasError(true);
              setIsPlaying(false);
            }}
            className="w-full h-full object-cover object-center"
          >
            <source src="/assets/joao_garcia_herobanner_v01_compress.webm" type="video/webm" />
            <source src="/assets/joao_garcia_herobanner_v01_compress.mp4" type="video/mp4" />
          </video>
        ) : (
          <img
            src="/assets/joao_garcia_herobanner_v01.jpg"
            alt="João Garcia – Hero Banner"
            className="w-full h-full object-cover object-center"
          />
        )}

        {/* Subtle bottom gradient to blend smoothly into the dark canvas */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#08090b] via-[#08090b]/40 to-transparent pointer-events-none" />

        {/* Floating Minimal Controls (Bottom-Right) */}
        {!hasError && (
          <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2">
          {/* Mute / Unmute Toggle */}
          <button
            onClick={toggleMute}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/15 text-xs text-white transition-all cursor-pointer shadow-lg"
            title={isMuted ? 'Ativar áudio' : 'Desativar áudio'}
            aria-label={isMuted ? 'Ativar áudio' : 'Desativar áudio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="font-mono text-[11px] uppercase tracking-wider hidden sm:inline">
              {isMuted ? 'Sem Som' : 'Áudio Ativo'}
            </span>
          </button>

          {/* Play / Pause / Replay Toggle */}
          <button
            onClick={togglePlay}
            className="p-1.5 rounded-md bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/15 text-white transition-all cursor-pointer shadow-lg flex items-center gap-1"
            title={hasEnded ? 'Repetir vídeo' : isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
            aria-label={hasEnded ? 'Repetir vídeo' : isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
          >
            {hasEnded ? (
              <RotateCcw className="w-3.5 h-3.5" />
            ) : isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-white" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white" />
            )}
            {hasEnded && (
              <span className="font-mono text-[11px] uppercase tracking-wider hidden sm:inline pr-1">
                Replay
              </span>
            )}
          </button>
        </div>
        )}

        {/* Smooth Scroll to Portfolio Indicator (Bottom-Left) */}
        <div className="absolute bottom-5 left-5 z-20 hidden sm:flex items-center gap-2">
          <button
            onClick={onScrollToPortfolio}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/15 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer shadow-lg"
          >
            <span className="text-[11px] uppercase tracking-wider font-semibold">Ver Portfólio</span>
            <ArrowDown className="w-3 h-3 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};
