import React from 'react';
import { Eye, ShieldCheck } from 'lucide-react';

export const Bio: React.FC = () => {
  return (
    <section id="bio" className="py-24 border-t border-white/10 bg-[#090b0e]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-400 mb-4">
          <span>Trajetória & Filosofia</span>
          <span className="text-zinc-600">/</span>
          <span>Mais de 15 Anos</span>
        </div>

        {/* 2-Column Split: Verbatim Bio + Portrait */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left 7 Columns: Verbatim Text & Philosophical Clarity */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              A intersecção entre o rigor gráfico e o ritmo que prende.
            </h2>

            {/* Verbatim Text Required by User */}
            <div className="space-y-6 text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
              <p>
                Com formação em Design Gráfico e há mais de 15 anos de experiência na área visual, minha trajetória foi moldada pela bagagem em agências de publicidade e pela atuação em Direção de Arte. Movido pelo universo audiovisual, especializei-me na criação de movimento e ritmo visual através da edição de vídeo e do motion design, somados à fotografia e ao filmmaking.
              </p>
              <p>
                Hoje, atuando de forma independente, colaboro com grandes marcas na construção de projetos audiovisuais e gráficos que conectam, comunicando mensagens de forma clara, interessante e verdadeira.
              </p>
            </div>

            {/* Executive Commitment Highlights */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                    Parceria Direta com a Liderança
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Comunicação ágil e sem ruídos burocráticos. Trabalho direto com CEOs, CMOs e fundadores.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-start gap-3">
                <Eye className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                    Atenção Obsessiva ao Detalhe
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Da tipografia microscópica à gradação de cor de cada frame em resoluções 4K master.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Visual Monograph Portrait */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-xl overflow-hidden border border-white/15 bg-[#0e1117] shadow-2xl">
              <div className="aspect-[4/5] w-full relative overflow-hidden bg-black">
                <img
                  src="/assets/foto_bio_site.jpg"
                  alt="João Garcia – Diretor de Arte & Motion Designer"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                
                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-transparent opacity-90" />

                {/* Profile Caption Tag */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 space-y-1">
                  <div className="text-sm font-bold tracking-tight text-white">
                    João Garcia
                  </div>
                  <div className="text-xs text-zinc-400">
                    Diretor de Arte · Motion Designer · Filmmaker
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
