import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { ProjectModal } from './components/ProjectModal';
import { ShowreelModal } from './components/ShowreelModal';
import { Bio } from './components/Bio';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Project } from './types';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isShowreelOpen, setIsShowreelOpen] = useState(false);
  const [prefilledService, setPrefilledService] = useState('');

  const scrollToContact = (serviceType = '') => {
    if (serviceType) {
      setPrefilledService(serviceType);
    }
    const element = document.getElementById('contato');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPortfolio = () => {
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#08090b] text-[#f1f5f9] selection:bg-white selection:text-black">
      {/* Primary Top Bar */}
      <Navbar onOpenContact={() => scrollToContact()} />

      {/* Main Content Sections */}
      <main>
        {/* Section 1: Hero */}
        <Hero
          onScrollToPortfolio={scrollToPortfolio}
          onOpenContact={() => scrollToContact()}
          onPlayShowreel={() => setIsShowreelOpen(true)}
        />

        {/* Section 2: Portfólio */}
        <Portfolio
          onSelectProject={(project) => setSelectedProject(project)}
          onOpenContact={(serviceType) => scrollToContact(serviceType)}
        />

        {/* Section 3: Bio */}
        <Bio />

        {/* Section 4: Contato */}
        <Contact initialServiceType={prefilledService} />
      </main>

      {/* Minimalist Footer */}
      <Footer />

      {/* Interactive Lightbox Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onStartProject={(serviceType) => scrollToContact(serviceType)}
      />

      <ShowreelModal
        isOpen={isShowreelOpen}
        onClose={() => setIsShowreelOpen(false)}
        onStartProject={() => scrollToContact('Showreel / Comercial Completo')}
      />
    </div>
  );
}
