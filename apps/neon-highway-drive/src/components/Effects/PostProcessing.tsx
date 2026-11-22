import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useDrivingStore } from '../../stores/useDrivingStore';

export function PostProcessing() {
  const enabled = useDrivingStore((state) => state.settings.postProcessingEnabled);
  const lowEnd = useDrivingStore((state) => state.settings.lowEndPerformance);
  const isNitro = useDrivingStore((state) => state.telemetry.isNitro);
  const speed = useDrivingStore((state) => state.telemetry.speed);

  if (!enabled || lowEnd) {
    return null;
  }

  // Chromatic aberration intensifies with speed and nitro
  const speedRatio = Math.min(Math.abs(speed) / 240, 1.0);
  const chromaticOffset = isNitro
    ? new THREE.Vector2(0.0035, 0.0035)
    : new THREE.Vector2(0.0008 + speedRatio * 0.0012, 0.0008 + speedRatio * 0.0012);

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={1.2}
        luminanceThreshold={0.45}
        luminanceSmoothing={0.7}
        mipmapBlur
      />
      <ChromaticAberration
        offset={chromaticOffset}
        radialModulation={true}
        modulationOffset={0.2}
      />
      <Vignette eskil={false} offset={0.15} darkness={1.1} />
    </EffectComposer>
  );
}
