import { create } from 'zustand';
import {
  ScreenState,
  AppId,
  OSNotification,
  DynamicIslandAlert,
  NoteItem,
  MusicTrack,
  CalendarEvent,
  PhotoItem,
  AlarmItem,
} from '../types';
import { soundEffects } from '../utils/sound';

interface OSState {
  // Screen & Navigation
  screenState: ScreenState;
  activeAppId: AppId | null;
  isNotificationCenterOpen: boolean;
  isControlCenterOpen: boolean;
  isAppSwitcherOpen: boolean;
  currentPage: number;

  // System Hardware Toggles
  isDarkMode: boolean;
  wallpaperId: string;
  brightness: number; // 10 to 100
  volume: number; // 0 to 100
  isMuted: boolean;
  isFlashlightOn: boolean;
  wifi: boolean;
  bluetooth: boolean;
  airplaneMode: boolean;
  cellularSignal: number;
  batteryLevel: number;
  isCharging: boolean;
  isLowPowerMode: boolean;

  // Dynamic Island
  activeIsland: DynamicIslandAlert | null;

  // Notifications
  notifications: OSNotification[];

  // App States
  notes: NoteItem[];
  activeNoteId: string | null;

  tracks: MusicTrack[];
  currentTrackIndex: number;
  isPlayingMusic: boolean;
  musicCurrentTime: number;

  alarms: AlarmItem[];
  timerRemaining: number | null;
  isTimerRunning: boolean;

  events: CalendarEvent[];
  selectedCalendarDate: string;

  photos: PhotoItem[];
  activePhotoId: string | null;

  // Actions
  unlockPhone: () => void;
  lockPhone: () => void;
  goHome: () => void;
  openApp: (appId: AppId) => void;
  closeApp: () => void;
  setCurrentPage: (page: number) => void;

  toggleNotificationCenter: () => void;
  setNotificationCenter: (open: boolean) => void;
  toggleControlCenter: () => void;
  setControlCenter: (open: boolean) => void;
  toggleAppSwitcher: () => void;

  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notification: Omit<OSNotification, 'id' | 'read' | 'timestamp' | 'timeAgo'>) => void;

  setBrightness: (brightness: number) => void;
  setVolume: (volume: number) => void;
  toggleFlashlight: () => void;
  toggleWifi: () => void;
  toggleBluetooth: () => void;
  toggleAirplaneMode: () => void;
  toggleLowPowerMode: () => void;
  toggleCharging: () => void;
  setWallpaper: (id: string) => void;
  toggleDarkMode: () => void;

  setDynamicIsland: (alert: DynamicIslandAlert | null) => void;

  // Notes Actions
  createNote: () => string;
  updateNote: (id: string, title: string, body: string) => void;
  deleteNote: (id: string) => void;
  setActiveNoteId: (id: string | null) => void;

  // Music Actions
  playTrack: (index: number) => void;
  togglePlayPauseMusic: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setMusicCurrentTime: (time: number) => void;

  // Clock Actions
  toggleAlarm: (id: string) => void;
  addAlarm: (alarm: Omit<AlarmItem, 'id'>) => void;
  deleteAlarm: (id: string) => void;
  setTimerRemaining: (seconds: number | null) => void;
  setIsTimerRunning: (running: boolean) => void;

  // Calendar Actions
  setSelectedCalendarDate: (date: string) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;

  // Gallery Actions
  setActivePhotoId: (id: string | null) => void;
  toggleFavoritePhoto: (id: string) => void;
}

const INITIAL_NOTIFICATIONS: OSNotification[] = [
  {
    id: 'n-1',
    appId: 'calendar',
    title: 'Product Review Meeting',
    message: 'Starting in 15 minutes in Conference Room A',
    timestamp: '10:45 AM',
    timeAgo: '15m ago',
    read: false,
  },
  {
    id: 'n-2',
    appId: 'notes',
    title: 'Shared Note Updated',
    message: '"WWDC 2026 Keynote Predictions" was edited by Sarah',
    timestamp: '9:30 AM',
    timeAgo: '1h ago',
    read: false,
  },
  {
    id: 'n-3',
    appId: 'music',
    title: 'New Release Radar',
    message: 'Synthwave Odyssey - Neon Dreams Vol. 2 is now streaming',
    timestamp: '8:15 AM',
    timeAgo: '2h ago',
    read: false,
  },
];

const INITIAL_TRACKS: MusicTrack[] = [
  {
    id: 't-1',
    title: 'Chillwave Odyssey',
    artist: 'Neon Arcade',
    album: 'Sunset Blvd 2026',
    duration: 184,
    coverGradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    bpm: 85,
  },
  {
    id: 't-2',
    title: 'Midnight Rain',
    artist: 'Cyber Lofi Project',
    album: 'Tokyo Drifting',
    duration: 210,
    coverGradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    bpm: 78,
  },
  {
    id: 't-3',
    title: 'Solar Flare',
    artist: 'Kavinsky Wave',
    album: 'Outrun Echoes',
    duration: 165,
    coverGradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    bpm: 96,
  },
  {
    id: 't-4',
    title: 'Aura Bloom',
    artist: 'Ambient Mind',
    album: 'Quiet Horizons',
    duration: 240,
    coverGradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    bpm: 72,
  },
];

const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'App Architecture Checklist',
    body: '- React Three Fiber shader integration\n- Multi-page home screen gesture thresholds\n- Audio haptics with Web Audio API\n- Light/dark mode theme tokens',
    updatedAt: 'Today, 10:20 AM',
    isPinned: true,
  },
  {
    id: 'note-2',
    title: 'Workout Routine & Goals',
    body: 'Monday: Push (Bench press, incline DB, lateral raises)\nWednesday: Pull (Deadlifts, pullups, rows)\nFriday: Legs (Squats, RDLs, calf raises)',
    updatedAt: 'Yesterday',
    isPinned: false,
  },
  {
    id: 'note-3',
    title: 'Book Recommendations',
    body: '1. Designing Data-Intensive Applications\n2. The Pragmatic Programmer\n3. Neuromancer by William Gibson',
    updatedAt: 'Feb 18',
    isPinned: false,
  },
];

const INITIAL_PHOTOS: PhotoItem[] = [
  {
    id: 'p-1',
    title: 'Neon Tokyo Tower',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    category: 'city',
    date: 'February 21, 2026',
    location: 'Minato City, Tokyo',
    isFavorite: true,
    aspectRatio: 'aspect-square',
  },
  {
    id: 'p-2',
    title: 'Mount Fuji Sunrise',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    category: 'nature',
    date: 'February 19, 2026',
    location: 'Yamanashi, Japan',
    isFavorite: true,
    aspectRatio: 'aspect-[4/5]',
  },
  {
    id: 'p-3',
    title: 'Cyberpunk Shinjuku Alley',
    url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
    category: 'city',
    date: 'February 15, 2026',
    location: 'Shinjuku, Tokyo',
    isFavorite: false,
    aspectRatio: 'aspect-square',
  },
  {
    id: 'p-4',
    title: 'Bioluminescent Waves',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    category: 'nature',
    date: 'February 10, 2026',
    location: 'Big Sur, California',
    isFavorite: true,
    aspectRatio: 'aspect-[3/4]',
  },
  {
    id: 'p-5',
    title: 'Prism Light Geometry',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
    category: 'abstract',
    date: 'January 28, 2026',
    location: 'Studio Loft',
    isFavorite: false,
    aspectRatio: 'aspect-square',
  },
  {
    id: 'p-6',
    title: 'Northern Lights Over Fjord',
    url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=800&q=80',
    category: 'nature',
    date: 'January 14, 2026',
    location: 'Tromsø, Norway',
    isFavorite: true,
    aspectRatio: 'aspect-[4/5]',
  },
];

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Design Team Sync',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    color: '#007AFF',
    location: 'Virtual',
  },
  {
    id: 'ev-2',
    title: 'Gym Workout - Push Day',
    date: new Date().toISOString().split('T')[0],
    time: '6:30 PM',
    color: '#FF9500',
    location: 'Equinox Downtown',
  },
  {
    id: 'ev-3',
    title: 'WWDC Architecture Review',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '2:00 PM',
    color: '#AF52DE',
    location: 'Apple Park Infinite',
  },
];

const INITIAL_ALARMS: AlarmItem[] = [
  { id: 'al-1', time: '07:00', label: 'Morning Rise', isEnabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  { id: 'al-2', time: '08:30', label: 'Standup Reminder', isEnabled: false, days: ['Everyday'] },
  { id: 'al-3', time: '22:45', label: 'Wind Down', isEnabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Sun'] },
];

export const useOSStore = create<OSState>((set, get) => ({
  // Screen & Navigation
  screenState: 'locked',
  activeAppId: null,
  isNotificationCenterOpen: false,
  isControlCenterOpen: false,
  isAppSwitcherOpen: false,
  currentPage: 0,

  // Hardware Toggles
  isDarkMode: true,
  wallpaperId: 'nebula-cosmic',
  brightness: 92,
  volume: 75,
  isMuted: false,
  isFlashlightOn: false,
  wifi: true,
  bluetooth: true,
  airplaneMode: false,
  cellularSignal: 4,
  batteryLevel: 88,
  isCharging: false,
  isLowPowerMode: false,

  // Dynamic Island
  activeIsland: null,

  // Notifications
  notifications: INITIAL_NOTIFICATIONS,

  // App Data
  notes: INITIAL_NOTES,
  activeNoteId: null,

  tracks: INITIAL_TRACKS,
  currentTrackIndex: 0,
  isPlayingMusic: false,
  musicCurrentTime: 42,

  alarms: INITIAL_ALARMS,
  timerRemaining: null,
  isTimerRunning: false,

  events: INITIAL_EVENTS,
  selectedCalendarDate: new Date().toISOString().split('T')[0],

  photos: INITIAL_PHOTOS,
  activePhotoId: null,

  // Navigation
  unlockPhone: () => {
    soundEffects.playUnlock();
    set({
      screenState: 'home',
      isNotificationCenterOpen: false,
      isControlCenterOpen: false,
    });
  },

  lockPhone: () => {
    soundEffects.playLock();
    set({
      screenState: 'locked',
      activeAppId: null,
      isNotificationCenterOpen: false,
      isControlCenterOpen: false,
      isAppSwitcherOpen: false,
    });
  },

  goHome: () => {
    soundEffects.playTap();
    set({
      screenState: 'home',
      activeAppId: null,
      isNotificationCenterOpen: false,
      isControlCenterOpen: false,
      isAppSwitcherOpen: false,
    });
  },

  openApp: (appId: AppId) => {
    soundEffects.playTap();
    set({
      screenState: 'app',
      activeAppId: appId,
      isNotificationCenterOpen: false,
      isControlCenterOpen: false,
      isAppSwitcherOpen: false,
    });
  },

  closeApp: () => {
    soundEffects.playTap();
    set({
      screenState: 'home',
      activeAppId: null,
      isAppSwitcherOpen: false,
    });
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
  },

  toggleNotificationCenter: () => {
    soundEffects.playTap();
    set((state) => ({
      isNotificationCenterOpen: !state.isNotificationCenterOpen,
      isControlCenterOpen: false,
    }));
  },

  setNotificationCenter: (open: boolean) => {
    set({ isNotificationCenterOpen: open, isControlCenterOpen: false });
  },

  toggleControlCenter: () => {
    soundEffects.playTap();
    set((state) => ({
      isControlCenterOpen: !state.isControlCenterOpen,
      isNotificationCenterOpen: false,
    }));
  },

  setControlCenter: (open: boolean) => {
    set({ isControlCenterOpen: open, isNotificationCenterOpen: false });
  },

  toggleAppSwitcher: () => {
    soundEffects.playTap();
    set((state) => ({
      isAppSwitcherOpen: !state.isAppSwitcherOpen,
    }));
  },

  dismissNotification: (id: string) => {
    soundEffects.playTap();
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAllNotifications: () => {
    soundEffects.playTap();
    set({ notifications: [] });
  },

  addNotification: (item) => {
    soundEffects.playNotification();
    const newNotification: OSNotification = {
      ...item,
      id: `n-${Date.now()}`,
      read: false,
      timestamp: 'Just now',
      timeAgo: 'Now',
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));
  },

  setBrightness: (brightness: number) => {
    set({ brightness: Math.max(10, Math.min(100, brightness)) });
  },

  setVolume: (volume: number) => {
    soundEffects.setMusicVolume(volume / 100);
    set({ volume: Math.max(0, Math.min(100, volume)), isMuted: volume === 0 });
  },

  toggleFlashlight: () => {
    soundEffects.playTap();
    set((state) => ({ isFlashlightOn: !state.isFlashlightOn }));
  },

  toggleWifi: () => {
    soundEffects.playTap();
    set((state) => ({ wifi: !state.wifi }));
  },

  toggleBluetooth: () => {
    soundEffects.playTap();
    set((state) => ({ bluetooth: !state.bluetooth }));
  },

  toggleAirplaneMode: () => {
    soundEffects.playTap();
    set((state) => ({
      airplaneMode: !state.airplaneMode,
      wifi: state.airplaneMode ? state.wifi : false,
      bluetooth: state.airplaneMode ? state.bluetooth : false,
    }));
  },

  toggleLowPowerMode: () => {
    soundEffects.playTap();
    set((state) => ({ isLowPowerMode: !state.isLowPowerMode }));
  },

  toggleCharging: () => {
    soundEffects.playTap();
    const willCharge = !get().isCharging;
    set((state) => ({
      isCharging: willCharge,
      batteryLevel: willCharge ? Math.min(state.batteryLevel + 1, 100) : state.batteryLevel,
    }));
    if (willCharge) {
      get().setDynamicIsland({
        id: 'charging-alert',
        type: 'charging',
        title: 'Charging',
        subtitle: `${get().batteryLevel}%`,
      });
      setTimeout(() => {
        if (get().activeIsland?.id === 'charging-alert') {
          get().setDynamicIsland(null);
        }
      }, 3500);
    }
  },

  setWallpaper: (id: string) => {
    soundEffects.playTap();
    set({ wallpaperId: id });
  },

  toggleDarkMode: () => {
    soundEffects.playTap();
    set((state) => ({ isDarkMode: !state.isDarkMode }));
  },

  setDynamicIsland: (alert: DynamicIslandAlert | null) => {
    set({ activeIsland: alert });
  },

  // Notes
  createNote: () => {
    soundEffects.playTap();
    const newId = `note-${Date.now()}`;
    const newNote: NoteItem = {
      id: newId,
      title: 'New Note',
      body: '',
      updatedAt: 'Just now',
    };
    set((state) => ({
      notes: [newNote, ...state.notes],
      activeNoteId: newId,
    }));
    return newId;
  },

  updateNote: (id: string, title: string, body: string) => {
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, title, body, updatedAt: 'Just now' } : n
      ),
    }));
  },

  deleteNote: (id: string) => {
    soundEffects.playTap();
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
      activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
    }));
  },

  setActiveNoteId: (id: string | null) => {
    soundEffects.playTap();
    set({ activeNoteId: id });
  },

  // Music
  playTrack: (index: number) => {
    const track = get().tracks[index];
    if (!track) return;
    soundEffects.stopMusic();
    soundEffects.startMusic(get().volume / 100, track.bpm);
    set({
      currentTrackIndex: index,
      isPlayingMusic: true,
      musicCurrentTime: 0,
      activeIsland: {
        id: 'music-alert',
        type: 'music',
        title: track.title,
        subtitle: track.artist,
      },
    });
  },

  togglePlayPauseMusic: () => {
    soundEffects.playTap();
    const isPlaying = get().isPlayingMusic;
    const track = get().tracks[get().currentTrackIndex];
    if (isPlaying) {
      soundEffects.stopMusic();
      set({ isPlayingMusic: false });
    } else {
      soundEffects.startMusic(get().volume / 100, track.bpm);
      set({
        isPlayingMusic: true,
        activeIsland: {
          id: 'music-alert',
          type: 'music',
          title: track.title,
          subtitle: track.artist,
        },
      });
    }
  },

  nextTrack: () => {
    soundEffects.playTap();
    const nextIdx = (get().currentTrackIndex + 1) % get().tracks.length;
    get().playTrack(nextIdx);
  },

  prevTrack: () => {
    soundEffects.playTap();
    const prevIdx =
      (get().currentTrackIndex - 1 + get().tracks.length) % get().tracks.length;
    get().playTrack(prevIdx);
  },

  setMusicCurrentTime: (time: number) => {
    set({ musicCurrentTime: time });
  },

  // Clock
  toggleAlarm: (id: string) => {
    soundEffects.playTap();
    set((state) => ({
      alarms: state.alarms.map((a) =>
        a.id === id ? { ...a, isEnabled: !a.isEnabled } : a
      ),
    }));
  },

  addAlarm: (alarm) => {
    soundEffects.playTap();
    const newAlarm: AlarmItem = {
      ...alarm,
      id: `al-${Date.now()}`,
    };
    set((state) => ({
      alarms: [...state.alarms, newAlarm].sort((a, b) => a.time.localeCompare(b.time)),
    }));
  },

  deleteAlarm: (id: string) => {
    soundEffects.playTap();
    set((state) => ({
      alarms: state.alarms.filter((a) => a.id !== id),
    }));
  },

  setTimerRemaining: (seconds: number | null) => {
    set({ timerRemaining: seconds });
    if (seconds !== null && seconds > 0) {
      get().setDynamicIsland({
        id: 'timer-alert',
        type: 'timer',
        title: 'Timer',
        subtitle: `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`,
      });
    } else if (seconds === 0) {
      soundEffects.playNotification();
      get().setDynamicIsland(null);
    }
  },

  setIsTimerRunning: (running: boolean) => {
    set({ isTimerRunning: running });
  },

  // Calendar
  setSelectedCalendarDate: (date: string) => {
    soundEffects.playTap();
    set({ selectedCalendarDate: date });
  },

  addCalendarEvent: (event) => {
    soundEffects.playTap();
    const newEvent: CalendarEvent = {
      ...event,
      id: `ev-${Date.now()}`,
    };
    set((state) => ({
      events: [...state.events, newEvent],
    }));
  },

  // Gallery
  setActivePhotoId: (id: string | null) => {
    if (id) soundEffects.playTap();
    set({ activePhotoId: id });
  },

  toggleFavoritePhoto: (id: string) => {
    soundEffects.playTap();
    set((state) => ({
      photos: state.photos.map((p) =>
        p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
      ),
    }));
  },
}));
