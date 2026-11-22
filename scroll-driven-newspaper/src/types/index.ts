export type ArticleCategory = 
  | 'front-page' 
  | 'crime' 
  | 'city-hall' 
  | 'nightlife' 
  | 'sports' 
  | 'weather' 
  | 'classifieds';

export interface Author {
  name: string;
  role: string;
  avatar: string;
  beat?: string;
}

export interface ArticleBodyBlock {
  type: 'paragraph' | 'quote' | 'subheading' | 'callout' | 'evidence';
  text: string;
  attribution?: string;
  evidenceCode?: string;
}

export interface ArticleImage {
  url: string;
  caption: string;
  credit: string;
  alt: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '21/9';
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  kicker: string;
  author: Author;
  date: string;
  edition: string;
  category: ArticleCategory;
  readTime: string;
  leadParagraph: string;
  body: ArticleBodyBlock[];
  image: ArticleImage;
  tags: string[];
  isFeatured?: boolean;
  isBreaking?: boolean;
  relatedSlugs?: string[];
  pinnedStats?: { label: string; value: string; delta?: string }[];
}

export interface CategoryInfo {
  id: ArticleCategory;
  name: string;
  slug: string;
  description: string;
  headlineLead: string;
  accentColor?: string;
}

export interface BreakingNewsItem {
  id: string;
  title: string;
  timestamp: string;
  urgency: 'FLASH' | 'BULLETIN' | 'UPDATE';
  location: string;
  slug?: string;
}

export interface DistrictWeather {
  district: string;
  temp: number;
  condition: string;
  high: number;
  low: number;
  precipitation: number;
  windSpeed: string;
  humidity: number;
  smogLevel: 'FAIR' | 'HAZY' | 'SEVERE';
}

export interface ClassifiedItem {
  id: string;
  section: 'FOR SALE' | 'SERVICES' | 'PERSONALS' | 'BOUNTIES' | 'REAL ESTATE';
  title: string;
  price: string;
  contact: string;
  description: string;
  date: string;
  verified?: boolean;
}
