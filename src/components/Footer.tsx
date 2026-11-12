import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-[#060709] py-12 text-xs text-zinc-400">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 flex items-center justify-center">
              <img
                src="/assets/joao_garcia_logo.png"
                alt="João Garcia"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-semibold text-white tracking-tight">João Garcia</span>
          </div>

          <span className="hidden sm:inline text-zinc-600">·</span>

          {/* User requirement exact copyright */}
          <span className="text-zinc-400">
            © 2026 João Garcia. Todos os direitos reservados.
          </span>
        </div>

        {/* Center / Right: Social Links & Back to top */}
        <div className="flex items-center gap-6">
          <a
            href="https://www.linkedin.com/in/garciads777"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://www.instagram.com/garciads777/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://www.behance.net/garciads"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Behance
          </a>

          <span className="text-zinc-700">|</span>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Voltar ao topo"
          >
            <span>Topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
