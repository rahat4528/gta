export type ScreenState = 'locked' | 'home' | 'app';

export type AppId =
  | 'clock'
  | 'calculator'
  | 'notes'
  | 'settings'
  | 'gallery'
  | 'calendar'
  | 'music';

export interface AppMetadata {
  id: AppId;
  name: string;
  iconBg: string;
  iconColor: string;
  badge?: number;
  category: 'system' | 'productivity' | 'media' | 'utility';
  page: number; // 0 or 1
}

export interface OSNotification {
  id: string;
  appId: AppId;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  timeAgo: string;
}

export interface DynamicIslandAlert {
  id: string;
  type: 'music' | 'timer' | 'charging' | 'silent' | 'airdrop';
  title: string;
  subtitle?: string;
  leadingIcon?: string;
  trailingIcon?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  body: string;
  updatedAt: string;
  isPinned?: boolean;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverGradient: string;
  bpm: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  color: string;
  location?: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  url: string;
  category: 'abstract' | 'city' | 'nature';
  date: string;
  location: string;
  isFavorite: boolean;
  aspectRatio: string;
}

export interface AlarmItem {
  id: string;
  time: string; // HH:mm
  label: string;
  isEnabled: boolean;
  days: string[];
}
