import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Sparkles,
  Maximize2,
  Check
} from 'lucide-react';
import { Project } from '../types';

export interface VideoCarouselProps {
  sectionLabel?: string;
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenContact?: (serviceType?: string) => void;
}

export type MotionCarouselProps = VideoCarouselProps;

export const VideoCarousel: React.FC<VideoCarouselProps> = ({
  sectionLabel,
  projects,
  onSelectProject,
  onOpenContact
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse drag-to-scroll state
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Interactive micro-interactions for Instagram-like feel
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedId(project.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);

    // Calculate nearest active slide
    const children = Array.from(el.children) as HTMLElement[];
    if (children.length === 0) return;

    const containerCenter = scrollLeft + clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    children.forEach((child, index) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, projects]);

  const scrollTo = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;

    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 24
      : 360;

    const targetScroll =
      direction === 'left' ? el.scrollLeft - cardWidth : el.scrollLeft + cardWidth;

    el.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const children = Array.from(el.children) as HTMLElement[];
    if (children[index]) {
      children[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDownRef.current) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 6) {
      hasDraggedRef.current = true;
    }
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDownRef.current = false;
  };

  const handleCardClick = (project: Project) => {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }
    onSelectProject(project);
  };

  return (
    <div className="relative w-full space-y-6">
      {/* Top Carousel Navigation Controls & Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          {/* Active slide counter pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>
              {String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
          </div>

          <span className="hidden sm:inline-block text-xs text-zinc-400">
            Arraste para os lados ou use as setas
          </span>
        </div>

        {/* Navigation Buttons (Left / Right) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollTo('left')}
            disabled={!canScrollLeft}
            aria-label="Vídeo anterior"
            className={`p-2.5 rounded-full border transition-all cursor-pointer ${
              canScrollLeft
                ? 'bg-white/10 border-white/20 text-white hover:bg-white hover:text-black shadow-lg hover:scale-105 active:scale-95'
                : 'bg-white/5 border-white/5 text-zinc-600 cursor-not-allowed opacity-40'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => scrollTo('right')}
            disabled={!canScrollRight}
            aria-label="Próximo vídeo"
            className={`p-2.5 rounded-full border transition-all cursor-pointer ${
              canScrollRight
                ? 'bg-white/10 border-white/20 text-white hover:bg-white hover:text-black shadow-lg hover:scale-105 active:scale-95'
                : 'bg-white/5 border-white/5 text-zinc-600 cursor-not-allowed opacity-40'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* The Instagram-Style Slider Track */}
      <div className="relative -mx-6 md:-mx-12 px-6 md:px-12">
        {/* Subtle Side Vignettes */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-20 bg-gradient-to-r from-[#08090b] to-transparent" />
        )}
        {canScrollRight && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-20 bg-gradient-to-l from-[#08090b] to-transparent" />
        )}

        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 pt-2 no-scrollbar select-none cursor-grab active:cursor-grabbing"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {projects.map((project, idx) => {
            const isVertical = project.aspectRatio === '9:16';
            const isLiked = !!likedMap[project.id];
            const isSaved = !!savedMap[project.id];
            const isCopied = copiedId === project.id;
            const isCurrent = activeIndex === idx;

            return (
              <article
                key={project.id}
                onClick={() => handleCardClick(project)}
                className={`w-[84vw] sm:w-[350px] md:w-[390px] h-[520px] sm:h-[580px] shrink-0 snap-center rounded-2xl relative overflow-hidden border transition-all duration-300 flex flex-col justify-between group select-none cursor-pointer shadow-2xl ${
                  isCurrent
                    ? 'border-white/40 ring-1 ring-white/25 shadow-cyan-950/30'
                    : 'border-white/15 hover:border-white/35'
                }`}
              >
                {/* --- 1. FULL-BLEED THUMBNAIL BACKGROUND (Tela Cheia) --- */}
                {project.posterSrc ? (
                  <img
                    src={project.posterSrc}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover object-center filter contrast-105 transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${project.posterGradient} flex items-center justify-center`}
                  >
                    <Sparkles className="w-16 h-16 text-white/20" />
                  </div>
                )}

                {/* --- 2. CINEMATIC GRADIENT VIGNETTES --- */}
                {/* Top dark gradient for header legibility */}
                <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-none z-10" />

                {/* Bottom dark gradient for caption & actions legibility */}
                <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black/95 via-black/75 to-transparent pointer-events-none z-10" />

                {/* Subtle overall dark scrim that lightens/deepens on hover */}
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors pointer-events-none z-10" />

                {/* --- 3. PERFECTLY CENTER-ALIGNED PLAY BUTTON ON ALL CARDS --- */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-black/50 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-2xl transition-all duration-300 group-hover:scale-115 group-hover:bg-white group-hover:text-black group-hover:border-white">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                  </div>
                  <span className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-white bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 opacity-90 group-hover:opacity-100 transition-opacity shadow-lg">
                    Reproduzir Vídeo
                  </span>
                </div>

                {/* --- 4. TOP OVERLAY: INSTAGRAM HEADER (Z-30) --- */}
                <div className="relative z-30 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Creator Avatar with story ring */}
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-md">
                        <img
                          src="/assets/joao_garcia_avatar_v01.jpg"
                          alt="João Garcia"
                          className="w-full h-full rounded-full object-cover border border-black"
                        />
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0a0d13]" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white tracking-tight drop-shadow-md truncate">
                        {project.client}
                      </div>
                      <div className="text-[11px] text-zinc-300/90 drop-shadow-sm truncate">
                        {sectionLabel || project.roles[0] || 'Audiovisual'}
                      </div>
                    </div>
                  </div>

                  {/* Format & Duration Pill */}
                  <div className="flex items-center gap-1.5 shrink-0 pl-2">
                    <span
                      className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded backdrop-blur-md border shadow-sm ${
                        isVertical
                          ? 'bg-purple-950/80 text-purple-200 border-purple-400/40'
                          : 'bg-cyan-950/80 text-cyan-200 border-cyan-400/40'
                      }`}
                    >
                      {project.aspectRatio}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-200 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/20 shadow-sm">
                      {project.duration}
                    </span>
                  </div>
                </div>

                {/* --- 5. BOTTOM OVERLAY: ACTIONS & CAPTION (Z-30) --- */}
                <div className="relative z-30 p-4 space-y-2.5">
                  {/* Action Icons Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Heart / Like */}
                      <button
                        onClick={(e) => toggleLike(e, project.id)}
                        className="group/btn text-white hover:text-rose-400 transition-colors cursor-pointer drop-shadow"
                        aria-label="Curtir projeto"
                      >
                        <Heart
                          className={`w-5 h-5 transition-transform duration-200 group-active/btn:scale-125 ${
                            isLiked
                              ? 'fill-rose-500 text-rose-500 scale-110'
                              : 'text-white group-hover/btn:text-rose-400'
                          }`}
                        />
                      </button>

                      {/* Comment / Direct message */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenContact) {
                            onOpenContact(`Projeto: ${project.title}`);
                          } else {
                            onSelectProject(project);
                          }
                        }}
                        className="text-white hover:text-cyan-300 transition-colors cursor-pointer drop-shadow"
                        aria-label="Solicitar orçamento"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>

                      {/* Share / Copy Link */}
                      <button
                        onClick={(e) => handleShare(e, project)}
                        className="text-white hover:text-cyan-300 transition-colors relative cursor-pointer drop-shadow"
                        aria-label="Compartilhar projeto"
                      >
                        {isCopied ? (
                          <Check className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Share2 className="w-5 h-5" />
                        )}
                        {isCopied && (
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-sans font-semibold bg-emerald-500 text-black px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                            Copiado!
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Bookmark / Save */}
                    <button
                      onClick={(e) => toggleSave(e, project.id)}
                      className="text-white hover:text-amber-400 transition-colors cursor-pointer drop-shadow"
                      aria-label="Salvar projeto"
                    >
                      <Bookmark
                        className={`w-5 h-5 ${
                          isSaved ? 'fill-amber-400 text-amber-400' : 'text-white'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Likes count & year */}
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 drop-shadow">
                    <span>{isLiked ? '84 curtidas' : '83 curtidas'}</span>
                    <span className="text-zinc-400">·</span>
                    <span className="text-[11px] font-normal text-zinc-300">
                      Ano {project.year}
                    </span>
                  </div>

                  {/* Caption */}
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-200 line-clamp-2 leading-relaxed drop-shadow">
                      <span className="font-semibold text-white">{project.title}: </span>
                      <span className="text-zinc-300">{project.description}</span>
                    </p>
                  </div>

                  {/* Hashtags & CTA Footer */}
                  <div className="pt-1 flex items-center justify-between gap-2 border-t border-white/10">
                    <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-5">
                      {project.roles.slice(0, 2).map((role, rIdx) => (
                        <span
                          key={rIdx}
                          className="text-[10px] font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
                        >
                          #{role.toLowerCase().replace(/[^a-z0-9]/g, '')}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(project);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white text-black text-[11px] font-semibold hover:bg-zinc-200 transition-all cursor-pointer shadow-md shrink-0"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Abrir</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* 6. Instagram-Style Pagination Dots */}
      <div className="flex items-center justify-center gap-2 pt-2">
        {projects.map((_, i) => {
          const isActive = activeIndex === i;
          return (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`Ir para o vídeo ${i + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                isActive
                  ? 'w-6 h-2 bg-white shadow-md'
                  : 'w-2 h-2 bg-white/20 hover:bg-white/50'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export const MotionCarousel = VideoCarousel;
