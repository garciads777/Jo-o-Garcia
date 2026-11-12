import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Camera,
  ZoomIn,
  Share2,
  Check
} from 'lucide-react';
import { PhotoItem } from '../types';

interface PhotoSliderProps {
  subsectionTitle: string;
  tagBadge: string;
  tagline: string;
  badgeColor?: 'amber' | 'rose' | 'red' | 'purple' | 'cyan' | 'emerald' | 'orange';
  photos: PhotoItem[];
}

export const PhotoSlider: React.FC<PhotoSliderProps> = ({
  subsectionTitle,
  tagBadge,
  tagline,
  badgeColor = 'amber',
  photos
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Mouse drag-to-scroll state
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Style color variables
  let dotColorClass = 'bg-amber-400 shadow-amber-400/30';
  let badgeBorderClass = 'text-amber-400/90 bg-amber-950/60 border-amber-500/30';
  let indicatorDotClass = 'bg-amber-400';
  let hoverTextClass = 'group-hover:text-amber-300';
  let iconColorClass = 'text-amber-400';

  if (badgeColor === 'red' || badgeColor === 'rose') {
    dotColorClass = 'bg-rose-500 shadow-rose-500/30';
    badgeBorderClass = 'text-rose-400/90 bg-rose-950/60 border-rose-500/30';
    indicatorDotClass = 'bg-rose-500';
    hoverTextClass = 'group-hover:text-rose-300';
    iconColorClass = 'text-rose-400';
  } else if (badgeColor === 'emerald') {
    dotColorClass = 'bg-emerald-400 shadow-emerald-400/30';
    badgeBorderClass = 'text-emerald-300/90 bg-emerald-950/60 border-emerald-500/30';
    indicatorDotClass = 'bg-emerald-400';
    hoverTextClass = 'group-hover:text-emerald-300';
    iconColorClass = 'text-emerald-400';
  } else if (badgeColor === 'cyan') {
    dotColorClass = 'bg-cyan-400 shadow-cyan-400/30';
    badgeBorderClass = 'text-cyan-300/90 bg-cyan-950/60 border-cyan-500/30';
    indicatorDotClass = 'bg-cyan-400';
    hoverTextClass = 'group-hover:text-cyan-300';
    iconColorClass = 'text-cyan-400';
  } else if (badgeColor === 'orange') {
    dotColorClass = 'bg-orange-500 shadow-orange-500/30';
    badgeBorderClass = 'text-orange-300/90 bg-orange-950/60 border-orange-500/30';
    indicatorDotClass = 'bg-orange-500';
    hoverTextClass = 'group-hover:text-orange-300';
    iconColorClass = 'text-orange-400';
  }

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
  }, [updateScrollState, photos]);

  const scrollTo = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = Math.min(el.clientWidth * 0.75, 500);
    const targetScroll =
      direction === 'left' ? el.scrollLeft - scrollAmount : el.scrollLeft + scrollAmount;

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

  // Drag handlers
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

  const handlePhotoClick = (photo: PhotoItem, index: number) => {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }
    setSelectedPhoto(photo);
    setSelectedPhotoIndex(index);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!selectedPhoto) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhoto(null);
      } else if (e.key === 'ArrowRight') {
        const nextIdx = (selectedPhotoIndex + 1) % photos.length;
        setSelectedPhotoIndex(nextIdx);
        setSelectedPhoto(photos[nextIdx]);
      } else if (e.key === 'ArrowLeft') {
        const prevIdx = (selectedPhotoIndex - 1 + photos.length) % photos.length;
        setSelectedPhotoIndex(prevIdx);
        setSelectedPhoto(photos[prevIdx]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, selectedPhotoIndex, photos]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative w-full space-y-6">
      {/* Subsection Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${indicatorDotClass}`} />
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
              Subseção
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>{subsectionTitle}</span>
              <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded border ${badgeBorderClass}`}>
                {tagBadge}
              </span>
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            {tagline}
          </p>
        </div>

        {/* Counter and Navigation Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
            <span className={`w-2 h-2 rounded-full ${indicatorDotClass} animate-pulse`} />
            <span>
              {String(activeIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollTo('left')}
              disabled={!canScrollLeft}
              aria-label="Foto anterior"
              className={`p-2 rounded-full border transition-all cursor-pointer ${
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
              aria-label="Próxima foto"
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                canScrollRight
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white hover:text-black shadow-lg hover:scale-105 active:scale-95'
                  : 'bg-white/5 border-white/5 text-zinc-600 cursor-not-allowed opacity-40'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* The Horizontal Photo Slider Track (Preserving Original Image Sizes & Proportions) */}
      <div className="relative -mx-6 md:-mx-12 px-6 md:px-12">
        {/* Subtle Vignettes on edges */}
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
          className="flex gap-6 overflow-x-auto snap-x snap-start scroll-smooth pb-8 pt-2 no-scrollbar select-none cursor-grab active:cursor-grabbing items-stretch"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {photos.map((photo, idx) => {
            const isHorizontal = photo.width > photo.height;
            const isCurrent = activeIndex === idx;

            return (
              <div
                key={photo.id}
                onClick={() => handlePhotoClick(photo, idx)}
                className={`shrink-0 snap-start flex flex-col justify-between rounded-2xl bg-[#0c0e14] border transition-all duration-300 overflow-hidden shadow-2xl group cursor-pointer ${
                  isCurrent
                    ? 'border-white/35 ring-1 ring-white/20'
                    : 'border-white/10 hover:border-white/30'
                } ${
                  isHorizontal
                    ? 'w-[85vw] sm:w-[580px] md:w-[680px]'
                    : 'w-[75vw] sm:w-[360px] md:w-[400px]'
                }`}
              >
                {/* 1. Photo Top Bar */}
                <div className="p-3.5 flex items-center justify-between border-b border-white/10 bg-[#090b10]">
                  <div className="flex items-center gap-2 min-w-0">
                    <Camera className={`w-3.5 h-3.5 shrink-0 ${iconColorClass}`} />
                    <span className="text-xs font-semibold text-zinc-200 truncate">
                      {photo.category || subsectionTitle}
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-[11px] font-mono text-zinc-400 shrink-0">
                      {photo.aspectRatioLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pl-2">
                    <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      {photo.date || '2024'}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-black transition-all">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* 2. Photo Viewport (Preserving Natural Size and Aspect Ratio) */}
                <div className="relative w-full h-[320px] sm:h-[420px] md:h-[460px] bg-black/80 flex items-center justify-center overflow-hidden p-2 group/img">
                  {/* Subtle ambient blur from the photo */}
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-20 scale-125 pointer-events-none"
                    style={{ backgroundImage: `url(${photo.src})` }}
                  />

                  {/* Pristine Original Photo - Perfectly preserved without cropping */}
                  <img
                    src={photo.src}
                    alt={photo.title}
                    loading="lazy"
                    className="relative z-10 max-h-full max-w-full w-auto h-auto object-contain rounded-lg shadow-2xl transition-transform duration-500 ease-out group-hover:scale-[1.015]"
                  />

                  {/* Hover Overlay with Zoom Prompt */}
                  <div className="absolute inset-0 z-20 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/30 text-white text-xs font-semibold shadow-2xl">
                      <Maximize2 className={`w-3.5 h-3.5 ${iconColorClass}`} />
                      <span>Clique para Ampliar em Alta Resolução</span>
                    </div>
                  </div>
                </div>

                {/* 3. Photo Caption & Metadata */}
                <div className="p-3.5 bg-[#090b10] border-t border-white/10 flex items-center justify-between gap-2">
                  <h5 className={`text-sm font-semibold tracking-tight text-white transition-colors truncate ${hoverTextClass}`}>
                    {photo.title}
                  </h5>
                  <span className="text-[11px] font-mono text-zinc-500 shrink-0">
                    {photo.width} × {photo.height}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 pt-1">
        {photos.map((_, i) => {
          const isActive = activeIndex === i;
          return (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`Ir para foto ${i + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                isActive
                  ? `w-6 h-2 ${dotColorClass} shadow-md`
                  : 'w-2 h-2 bg-white/20 hover:bg-white/50'
              }`}
            />
          );
        })}
      </div>

      {/* Fullscreen High-Resolution Lightbox Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-6 md:p-8 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Top Bar with Title and Close Button */}
          <div
            className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between z-50 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-0.5">
              <span className={`text-[11px] font-mono uppercase tracking-widest ${iconColorClass} block`}>
                {subsectionTitle} · {tagBadge}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {selectedPhoto.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all cursor-pointer relative"
                aria-label="Compartilhar foto"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
                {copied && (
                  <span className="absolute -bottom-8 right-0 text-[10px] bg-emerald-500 text-black px-2 py-0.5 rounded shadow whitespace-nowrap">
                    Link copiado!
                  </span>
                )}
              </button>

              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/15 transition-all cursor-pointer shadow-lg"
                aria-label="Fechar visualização"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Left Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const prevIdx = (selectedPhotoIndex - 1 + photos.length) % photos.length;
              setSelectedPhotoIndex(prevIdx);
              setSelectedPhoto(photos[prevIdx]);
            }}
            aria-label="Foto anterior"
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/60 hover:bg-white text-white hover:text-black border border-white/20 transition-all cursor-pointer shadow-2xl backdrop-blur-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const nextIdx = (selectedPhotoIndex + 1) % photos.length;
              setSelectedPhotoIndex(nextIdx);
              setSelectedPhoto(photos[nextIdx]);
            }}
            aria-label="Próxima foto"
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/60 hover:bg-white text-white hover:text-black border border-white/20 transition-all cursor-pointer shadow-2xl backdrop-blur-md"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Full-Size Photo Display - 100% Preserved Size & Natural Aspect Ratio */}
          <div
            className="relative max-w-6xl max-h-[82vh] flex flex-col items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.title}
              className="max-h-[75vh] max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl border border-white/15"
            />

            {/* Bottom Caption Overlay */}
            <div className="mt-4 px-4 py-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 max-w-xl text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-zinc-300">
                <span className={`${iconColorClass} font-semibold`}>{selectedPhoto.subtitle}</span>
                <span className="text-zinc-600">·</span>
                <span>{selectedPhoto.aspectRatioLabel}</span>
                <span className="text-zinc-600">·</span>
                <span>{selectedPhotoIndex + 1} de {photos.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
