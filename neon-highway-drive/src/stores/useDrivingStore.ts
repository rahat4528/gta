import { create } from 'zustand';
import { SimulationSettings, VehicleTelemetry, EnvironmentPreset, WeatherType, CameraView } from '../types';

interface DrivingState {
  telemetry: VehicleTelemetry;
  settings: SimulationSettings;
  fps: number;
  
  // Telemetry Actions
  updateTelemetry: (partial: Partial<VehicleTelemetry>) => void;
  resetDistance: () => void;
  setFps: (fps: number) => void;
  
  // Settings Actions
  togglePause: () => void;
  setPaused: (isPaused: boolean) => void;
  toggleAutoDrive: () => void;
  setAutoDrive: (isAutoDrive: boolean) => void;
  setPreset: (preset: EnvironmentPreset) => void;
  setWeather: (weather: WeatherType) => void;
  setRainIntensity: (intensity: number) => void;
  setCameraView: (cameraView: CameraView) => void;
  cycleCameraView: () => void;
  toggleHUD: () => void;
  setShowHUD: (show: boolean) => void;
  toggleAudio: () => void;
  setAudioVolume: (volume: number) => void;
  toggleLowEndMode: () => void;
  togglePostProcessing: () => void;
}

export const PRESET_CONFIGS: Record<EnvironmentPreset, {
  name: string;
  skyColor: string;
  fogColor: string;
  ambientColor: string;
  primaryNeon: string;
  secondaryNeon: string;
  roadAccent: string;
  buildingAccent: string;
}> = {
  cyberpunk: {
    name: 'Neo Shibuya 2077',
    skyColor: '#050714',
    fogColor: '#0a0d24',
    ambientColor: '#12193b',
    primaryNeon: '#00f0ff',
    secondaryNeon: '#ff007f',
    roadAccent: '#00f0ff',
    buildingAccent: '#ff007f',
  },
  synthwave: {
    name: 'Outrun Sunset 1984',
    skyColor: '#1a0826',
    fogColor: '#2b0938',
    ambientColor: '#3d0d4e',
    primaryNeon: '#ff2a85',
    secondaryNeon: '#ff9900',
    roadAccent: '#ff00aa',
    buildingAccent: '#9d00ff',
  },
  bladerunner: {
    name: 'Los Angeles 2049',
    skyColor: '#08080a',
    fogColor: '#141416',
    ambientColor: '#1a1816',
    primaryNeon: '#ffaa00',
    secondaryNeon: '#00d2ff',
    roadAccent: '#ff7700',
    buildingAccent: '#445566',
  },
  midnight: {
    name: 'Tokyo Bay Wangan',
    skyColor: '#020306',
    fogColor: '#050811',
    ambientColor: '#0a1020',
    primaryNeon: '#00ff66',
    secondaryNeon: '#0066ff',
    roadAccent: '#00ff66',
    buildingAccent: '#00ffff',
  },
};

export const useDrivingStore = create<DrivingState>((set) => ({
  telemetry: {
    speed: 0,
    targetSpeed: 0,
    rpm: 800,
    gear: 'N',
    steering: 0,
    distanceTraveled: 0,
    acceleration: 0,
    driftAngle: 0,
    turboPressure: 0,
    isBraking: false,
    isNitro: false,
    headlights: true,
  },
  settings: {
    isPaused: false,
    isAutoDrive: false,
    preset: 'cyberpunk',
    weather: 'rain',
    rainIntensity: 0.8,
    cameraView: 'chase',
    showHUD: true,
    audioMuted: false,
    audioVolume: 0.65,
    lowEndPerformance: false,
    postProcessingEnabled: true,
  },
  fps: 60,

  updateTelemetry: (partial) =>
    set((state) => ({
      telemetry: { ...state.telemetry, ...partial },
    })),

  resetDistance: () =>
    set((state) => ({
      telemetry: { ...state.telemetry, distanceTraveled: 0 },
    })),

  setFps: (fps) => set({ fps }),

  togglePause: () =>
    set((state) => ({
      settings: { ...state.settings, isPaused: !state.settings.isPaused },
    })),

  setPaused: (isPaused) =>
    set((state) => ({
      settings: { ...state.settings, isPaused },
    })),

  toggleAutoDrive: () =>
    set((state) => ({
      settings: { ...state.settings, isAutoDrive: !state.settings.isAutoDrive },
    })),

  setAutoDrive: (isAutoDrive) =>
    set((state) => ({
      settings: { ...state.settings, isAutoDrive },
    })),

  setPreset: (preset) =>
    set((state) => ({
      settings: { ...state.settings, preset },
    })),

  setWeather: (weather) =>
    set((state) => ({
      settings: {
        ...state.settings,
        weather,
        rainIntensity:
          weather === 'heavy-rain'
            ? 1.0
            : weather === 'storm'
            ? 1.2
            : weather === 'rain'
            ? 0.75
            : 0.2,
      },
    })),

  setRainIntensity: (rainIntensity) =>
    set((state) => ({
      settings: { ...state.settings, rainIntensity },
    })),

  setCameraView: (cameraView) =>
    set((state) => ({
      settings: { ...state.settings, cameraView },
    })),

  cycleCameraView: () =>
    set((state) => {
      const views: CameraView[] = ['chase', 'cockpit', 'hood', 'cinematic'];
      const currentIndex = views.indexOf(state.settings.cameraView);
      const nextView = views[(currentIndex + 1) % views.length];
      return {
        settings: { ...state.settings, cameraView: nextView },
      };
    }),

  toggleHUD: () =>
    set((state) => ({
      settings: { ...state.settings, showHUD: !state.settings.showHUD },
    })),

  setShowHUD: (showHUD) =>
    set((state) => ({
      settings: { ...state.settings, showHUD },
    })),

  toggleAudio: () =>
    set((state) => ({
      settings: { ...state.settings, audioMuted: !state.settings.audioMuted },
    })),

  setAudioVolume: (audioVolume) =>
    set((state) => ({
      settings: { ...state.settings, audioVolume },
    })),

  toggleLowEndMode: () =>
    set((state) => ({
      settings: {
        ...state.settings,
        lowEndPerformance: !state.settings.lowEndPerformance,
        postProcessingEnabled: state.settings.lowEndPerformance, // Enable PP when disabling low-end mode
      },
    })),

  togglePostProcessing: () =>
    set((state) => ({
      settings: {
        ...state.settings,
        postProcessingEnabled: !state.settings.postProcessingEnabled,
      },
    })),
}));
