export interface Wallpaper {
  id: string;
  name: string;
  category: 'gradient' | 'nebula' | 'sunset' | 'aurora' | 'oled';
  gradient: string;
  previewColor: string;
  textColor: 'light' | 'dark';
}

export const WALLPAPERS: Wallpaper[] = [
  {
    id: 'nebula-cosmic',
    name: 'Cosmic Nebula',
    category: 'nebula',
    gradient: 'radial-gradient(ellipse at 80% 20%, #4c1d95 0%, #1e1b4b 45%, #09090b 100%)',
    previewColor: '#4c1d95',
    textColor: 'light',
  },
  {
    id: 'titanium-sunset',
    name: 'Titanium Sunset',
    category: 'sunset',
    gradient: 'linear-gradient(135deg, #f97316 0%, #be185d 40%, #1e1b4b 100%)',
    previewColor: '#f97316',
    textColor: 'light',
  },
  {
    id: 'northern-aurora',
    name: 'Northern Aurora',
    category: 'aurora',
    gradient: 'linear-gradient(160deg, #059669 0%, #0284c7 45%, #0f172a 100%)',
    previewColor: '#059669',
    textColor: 'light',
  },
  {
    id: 'cyber-neon',
    name: 'Neon Mirage',
    category: 'gradient',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #d946ef 55%, #18181b 100%)',
    previewColor: '#d946ef',
    textColor: 'light',
  },
  {
    id: 'minimal-obsidian',
    name: 'Pure Obsidian',
    category: 'oled',
    gradient: 'radial-gradient(circle at 50% 30%, #27272a 0%, #18181b 50%, #09090b 100%)',
    previewColor: '#27272a',
    textColor: 'light',
  },
  {
    id: 'silk-dawn',
    name: 'Silk Dawn',
    category: 'sunset',
    gradient: 'linear-gradient(180deg, #fdba74 0%, #f472b6 40%, #818cf8 100%)',
    previewColor: '#fdba74',
    textColor: 'dark',
  },
];
