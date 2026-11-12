import React, { useState } from 'react';
import { Mail, MessageCircle, Send, CheckCircle2, ArrowUpRight, Copy, Check } from 'lucide-react';
import { ContactFormData } from '../types';

interface ContactProps {
  initialServiceType?: string;
}

export const Contact: React.FC<ContactProps> = ({ initialServiceType = '' }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    serviceType: initialServiceType || 'Direção de Arte & Audiovisual Completo',
    budgetRange: 'R$ 15k – R$ 50k',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactEmail = 'garcia.co1992@gmail.com';
  // WhatsApp direct link
  const whatsappUrl = 'https://wa.me/5519996429372?text=Olá,+gostaria+de+saber+mais+sobre+o+seu+trabalho';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate swift professional submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section id="contato" className="py-24 max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left 5 Columns: Direct Executive Inquiries & Channels */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-400 mb-2">
              <span>Contato Direto</span>
              <span className="text-zinc-600">/</span>
              <span>Disponibilidade para Projetos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Vamos construir uma presença visual memorável?
            </h2>
            <p className="mt-4 text-sm text-zinc-300 leading-relaxed">
              Atendimento direto e focado em resultados. Seja para um filme comercial, uma identidade em movimento ou a direção de arte da sua próxima grande campanha.
            </p>
          </div>

          {/* Quick Access Cards */}
          <div className="space-y-4 pt-2">
            
            {/* Email Card with Quick Copy */}
            <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400 block">
                    Email Corporativo
                  </span>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-sm font-semibold text-white hover:underline transition-colors"
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>

              <button
                onClick={handleCopyEmail}
                className="p-2 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Copiar email"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* WhatsApp Direct CTA Card */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-950/20 transition-all flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400 block">
                    WhatsApp Corporativo
                  </span>
                  <span className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                    Iniciar Conversa Rápida
                  </span>
                </div>
              </div>

              <ArrowUpRight className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          </div>

          {/* SLA / Direct Response Note */}
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-zinc-400 space-y-1">
            <span className="text-white font-semibold block">Tempo de Resposta:</span>
            <p>Retorno habitual em até 24 horas úteis diretamente com o João Garcia.</p>
          </div>
        </div>

        {/* Right 7 Columns: Business Briefing Form */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-2xl bg-[#0e1117] border border-white/15 shadow-2xl relative">
            
            {isSubmitted ? (
              <div className="py-12 px-4 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  Mensagem Enviada com Sucesso
                </h3>
                <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                  Obrigado pelo contato, <span className="text-white font-semibold">{formData.name}</span>! Recebi suas informações da <span className="text-white font-semibold">{formData.company || 'sua empresa'}</span> e entrarei em contato em breve.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: '',
                        company: '',
                        email: '',
                        phone: '',
                        serviceType: 'Direção de Arte & Audiovisual Completo',
                        budgetRange: 'R$ 15k – R$ 50k',
                        message: ''
                      });
                    }}
                    className="text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white underline cursor-pointer"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white mb-1">
                    Formulário de Proposta & Briefing
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Preencha os campos abaixo para entendermos a maturidade e os objetivos do seu projeto.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                      Seu Nome *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Ex: Carlos Eduardo"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>

                  {/* Company */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-company" className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                      Empresa / Marca *
                    </label>
                    <input
                      id="contact-company"
                      name="company"
                      type="text"
                      required
                      placeholder="Ex: Aura Motors"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                      Email Corporativo *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      placeholder="nome@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>

                  {/* Service Type Selection */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-service" className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                      Tipo de Demanda
                    </label>
                    <select
                      id="contact-service"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-white/40 transition-colors"
                    >
                      <option value="Direção de Arte & Audiovisual Completo">Direção de Arte & Audiovisual Completo</option>
                      <option value="Motion Design & Tipografia Dinâmica">Motion Design & Tipografia Dinâmica</option>
                      <option value="Edição de Vídeo Comercial (16:9)">Edição de Vídeo Comercial (16:9)</option>
                      <option value="Filmes Verticais & Reels de Alto Impacto (9:16)">Filmes Verticais & Reels (9:16)</option>
                      <option value="Filmmaking & Direção de Fotografia">Filmmaking & Direção de Fotografia</option>
                      <option value="Fotografia de Cena, Still & Making Of">Fotografia de Cena, Still & Making Of</option>
                      <option value="Identidade Visual & Design Gráfico">Identidade Visual & Design Gráfico</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Mensagem / Breve Descrição do Projeto *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Conte um pouco sobre o momento da sua marca, formato desejado (16:9 ou 9:16) e prazos previstos..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-black bg-white rounded-md hover:bg-zinc-200 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Enviando proposta...</span>
                  ) : (
                    <>
                      <span>Enviar Mensagem & Iniciar Conversa</span>
                      <Send className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
