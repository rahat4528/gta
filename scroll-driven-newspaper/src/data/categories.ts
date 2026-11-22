import { CategoryInfo } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'front-page',
    name: 'Front Page',
    slug: 'front-page',
    description: 'Top investigative headlines, major metropolitan bulletins, and front-page coverage.',
    headlineLead: 'THE PULSE OF SAN ANDREAS — EXCLUSIVE INVESTIGATIONS',
  },
  {
    id: 'crime',
    name: 'Crime & Vice',
    slug: 'crime',
    description: 'Police scanner dispatches, cartel movements, federal probes, and underground syndicates.',
    headlineLead: 'DISPATCH FROM THE STREETS: LSPD BEAT & SPECIAL INVESTIGATIONS',
  },
  {
    id: 'city-hall',
    name: 'City Hall',
    slug: 'city-hall',
    description: 'Mayoral decrees, municipal council corruption, urban zoning, and infrastructure bills.',
    headlineLead: 'CORRIDORS OF POWER: CIVIC AFFAIRS & TAXPAYER DOLLARS',
  },
  {
    id: 'nightlife',
    name: 'Nightlife & Culture',
    slug: 'nightlife',
    description: 'Vinewood red carpets, underground warehouse raves, celebrity scandals, and gourmet joints.',
    headlineLead: 'AFTER DARK IN LOS SANTOS: THE SOUNDS, GLAMOUR, AND EXCESS',
  },
  {
    id: 'sports',
    name: 'Sports',
    slug: 'sports',
    description: 'Los Santos Panic basketball, Stock Car racing at Maze Bank Arena, golf, and extreme stunts.',
    headlineLead: 'THE ARENA: CHAMPIONSHIPS, DERBIES, AND HIGH-OCTANE DRAMA',
  },
  {
    id: 'weather',
    name: 'Weather & Smog',
    slug: 'weather',
    description: 'Microclimate forecasts across the Pacific Basin, Vinewood Hills, and Sandy Shores desert.',
    headlineLead: 'METEOROLOGICAL OUTLOOK: SUNSHINE, OFFSHORE SQUALLS, AND SMOG INVERSIONS',
  },
  {
    id: 'classifieds',
    name: 'Classifieds',
    slug: 'classifieds',
    description: 'Private armory liquidation, executive safehouses, unmarked transport, and mercenary bounties.',
    headlineLead: 'PUBLIC MARKETPLACE: DISCREET LISTINGS & OPPORTUNITIES',
  },
];
