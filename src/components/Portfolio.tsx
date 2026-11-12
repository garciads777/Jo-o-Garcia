import React, { useState } from 'react';
import { Sparkles, Film, Smartphone, Video, Camera } from 'lucide-react';
import { Project, ProjectCategory } from '../types';
import { PROJECTS, MAKING_OF_PHOTOS, SHOWS_PHOTOS, MODA_PHOTOS, FOODS_AND_DRINKS_PHOTOS } from '../data/projects';
import { MotionCarousel } from './MotionCarousel';
import { PhotoSlider } from './PhotoSlider';

interface PortfolioProps {
  onSelectProject: (project: Project) => void;
  onOpenContact?: (serviceType?: string) => void;
}

interface SectionConfig {
  id: 'motion' | 'social-media' | 'fotos' | 'music-art' | 'premiere-filmes';
  title: string;
  tagline: string;
}

const SECTIONS: SectionConfig[] = [
  {
    id: 'motion',
    title: 'Motion Design',
    tagline: 'Identidades visuais em movimento, aberturas cinemáticas e interfaces dinâmicas.'
  },
  {
    id: 'social-media',
    title: 'Social Media',
    tagline: 'Formatos verticais (9:16), fashion films e campanhas dinâmicas para redes sociais.'
  },
  {
    id: 'fotos',
    title: 'Fotos',
    tagline: 'Fotografia de cena, still cinematográfico e registros autorais de bastidores.'
  },
  {
    id: 'music-art',
    title: 'Vídeo Clipes e Arte',
    tagline: 'Videoclipes autorais, registros documentais e narrativas visuais contemporâneas.'
  },
  {
    id: 'premiere-filmes',
    title: 'Premiere - Filmes',
    tagline: 'Aftermovies cinematográficos, coberturas dinâmicas de eventos e filmes de alta energia.'
  }
];

export const Portfolio: React.FC<PortfolioProps> = ({ onSelectProject, onOpenContact }) => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');

  const filterTabs: { id: ProjectCategory; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'Todos os Projetos' },
    { id: 'motion', label: 'Motion Design', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'social-media', label: 'Social Media', icon: <Smartphone className="w-3.5 h-3.5" /> },
    { id: 'fotos', label: 'Fotos', icon: <Camera className="w-3.5 h-3.5" /> },
    { id: 'music-art', label: 'Vídeo Clipes e Arte', icon: <Film className="w-3.5 h-3.5" /> },
    { id: 'premiere-filmes', label: 'Premiere - Filmes', icon: <Video className="w-3.5 h-3.5" /> },
  ];

  const visibleSections = activeCategory === 'all'
    ? SECTIONS
    : SECTIONS.filter((s) => s.id === activeCategory);

  return (
    <section id="portfolio" className="py-24 max-w-7xl mx-auto px-6 md:px-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-400 mb-2">
            <span>Trabalhos Selecionados</span>
            <span className="text-zinc-600">/</span>
            <span>2024 — 2026</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Portfólio em Movimento
          </h2>
        </div>

        <p className="text-sm text-zinc-400 max-w-md">
          Projetos audiovisuais e gráficos concebidos com rigor estético, ritmo e precisão narrativa para marcas e líderes de mercado.
        </p>
      </div>

      {/* Interactive Category Filter Tabs (Single-line controls) */}
      <div className="pt-8 pb-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-lg w-fit shrink-0">
          {filterTabs.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Structured Sections with Explicit Section Titles Before Videos */}
      <div className="space-y-20 pt-6">
        {visibleSections.map((section) => {
          if (section.id === 'fotos') {
            return (
              <section
                key={section.id}
                aria-labelledby={`section-title-${section.id}`}
                className="space-y-16"
              >
                {/* Individual Section Title Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-white/10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                        Seção Fotográfica
                      </span>
                    </div>
                    <h3
                      id={`section-title-${section.id}`}
                      className="text-2xl sm:text-3xl font-bold tracking-tight text-white"
                    >
                      {section.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
                    {section.tagline}
                  </p>
                </div>

                {/* Subseção 1: Making Of */}
                <PhotoSlider
                  subsectionTitle="Making Of"
                  tagBadge="Veludo Vermelho"
                  tagline="Registros de set, direção de fotografia, iluminação cênica e preparação de figurino rococó nos bastidores."
                  badgeColor="amber"
                  photos={MAKING_OF_PHOTOS}
                />

                {/* Subseção 2: Shows */}
                <PhotoSlider
                  subsectionTitle="Shows"
                  tagBadge="Live Concerts"
                  tagline="Fotografia de alta voltagem em apresentações ao vivo: crowdsurf, stage dive, energia visceral e iluminação de espetáculo."
                  badgeColor="rose"
                  photos={SHOWS_PHOTOS}
                />

                {/* Subseção 3: Moda */}
                <PhotoSlider
                  subsectionTitle="Moda"
                  tagBadge="Esto Club · Streetwear"
                  tagline="Editorial de moda e lookbook streetwear: caimento oversized, tipografia de estampas e fotografia urbana autêntica."
                  badgeColor="emerald"
                  photos={MODA_PHOTOS}
                />

                {/* Subseção 4: Foods & Drinks */}
                <PhotoSlider
                  subsectionTitle="Foods & Drinks"
                  tagBadge="Gastronomia & Mixologia"
                  tagline="Fotografia gastronômica comercial e coquetelaria autoral: drinks clássicos e autorais, hambúrgueres artesanais, cortes nobres e petiscos."
                  badgeColor="orange"
                  photos={FOODS_AND_DRINKS_PHOTOS}
                />
              </section>
            );
          }

          const sectionProjects = PROJECTS.filter((p) => p.category === section.id);
          if (sectionProjects.length === 0) return null;

          return (
            <section
              key={section.id}
              aria-labelledby={`section-title-${section.id}`}
              className="space-y-8"
            >
              {/* Individual Section Title Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                      Seção Audiovisual
                    </span>
                  </div>
                  <h3
                    id={`section-title-${section.id}`}
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-white"
                  >
                    {section.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
                  {section.tagline}
                </p>
              </div>

              {/* Video Sections rendered as Instagram-style carousel slider */}
              <MotionCarousel
                sectionLabel={section.title}
                projects={sectionProjects}
                onSelectProject={onSelectProject}
                onOpenContact={onOpenContact}
              />
            </section>
          );
        })}

      </div>
    </section>
  );
};
