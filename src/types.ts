export type ProjectCategory = 'all' | 'commercial' | 'motion' | 'social-media' | 'fotos' | 'vertical' | 'music-art' | 'premiere-filmes' | 'art-direction';

export interface PhotoItem {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  category: string;
  aspectRatioLabel: string;
  width: number;
  height: number;
  description?: string;
  date?: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  year: string;
  category: ProjectCategory;
  aspectRatio: '16:9' | '9:16';
  duration: string;
  roles: string[];
  description: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  tools: string[];
  posterGradient: string;
  accentColor: string;
  videoType: 'brand' | 'motion' | 'commercial' | 'fashion' | 'tech';
  videoSrc?: string;
  posterSrc?: string;
  youtubeId?: string;
  vimeoId?: string;
}

export interface ContactFormData {
  name: string;
  company: string;
  email: string;
  phone?: string;
  serviceType: string;
  budgetRange: string;
  message: string;
}
