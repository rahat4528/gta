export type Gear = 'P' | 'R' | 'N' | 'D' | '1' | '2' | '3' | '4' | '5' | '6';

export type EnvironmentPreset = 'cyberpunk' | 'synthwave' | 'bladerunner' | 'midnight';

export type WeatherType = 'rain' | 'heavy-rain' | 'storm' | 'clear-mist';

export type CameraView = 'chase' | 'cockpit' | 'hood' | 'cinematic';

export interface VehicleTelemetry {
  speed: number;          // Current speed in km/h
  targetSpeed: number;    // Target speed requested by input
  rpm: number;            // 800 - 8500 RPM
  gear: Gear;             // Current gear
  steering: number;       // -1.0 to 1.0 (left to right)
  distanceTraveled: number; // Meters
  acceleration: number;   // -1 (braking) to +1 (full throttle)
  driftAngle: number;     // Lateral slip angle in radians
  turboPressure: number;  // 0.0 to 1.8 bar
  isBraking: boolean;
  isNitro: boolean;
  headlights: boolean;
}

export interface SimulationSettings {
  isPaused: boolean;
  isAutoDrive: boolean;
  preset: EnvironmentPreset;
  weather: WeatherType;
  rainIntensity: number; // 0 to 1
  cameraView: CameraView;
  showHUD: boolean;
  audioMuted: boolean;
  audioVolume: number;
  lowEndPerformance: boolean;
  postProcessingEnabled: boolean;
}

export interface HighwayLane {
  index: number;
  offset: number; // X coordinate offset
}

export interface TrafficVehicle {
  id: string;
  lane: number;
  zOffset: number;
  speed: number;
  color: string;
  modelType: 'sedan' | 'cyber-truck' | 'hover-pod' | 'sports';
  tailLightColor: string;
}

export interface BuildingData {
  id: string;
  x: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  color: string;
  neonColor: string;
  windowGlowColor: string;
  hasAntenna: boolean;
  hasAdScreen: boolean;
}
