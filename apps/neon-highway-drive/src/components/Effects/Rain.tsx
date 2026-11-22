import { useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RainVertexShader, RainFragmentShader } from '../../shaders/rainShader';
import { useDrivingStore, PRESET_CONFIGS } from '../../stores/useDrivingStore';

interface RainProps {
  vehicleRef: React.RefObject<THREE.Group | null>;
}

export function Rain({ vehicleRef }: RainProps) {
  const rainIntensity = useDrivingStore((state) => state.settings.rainIntensity);
  const lowEnd = useDrivingStore((state) => state.settings.lowEndPerformance);
  const speed = useDrivingStore((state) => state.telemetry.speed);
  const presetKey = useDrivingStore((state) => state.settings.preset);
  const config = PRESET_CONFIGS[presetKey];

  const count = lowEnd ? 1200 : 3500;

  // Rain material
  const rainMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: RainVertexShader,
      fragmentShader: RainFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: 0 },
        uCarPos: { value: new THREE.Vector3() },
        uRainIntensity: { value: rainIntensity },
        uRainColor: { value: new THREE.Color(config.primaryNeon) },
      },
      transparent: true,
      depthWrite: false,
    });
  }, [config.primaryNeon, rainIntensity]);

  useEffect(() => {
    rainMaterial.uniforms.uRainColor.value.set(config.primaryNeon);
  }, [config, rainMaterial]);

  // Instanced rain geometry
  const geometry = useMemo(() => {
    const geom = new THREE.InstancedBufferGeometry();

    // Base vertical line segment (2 vertices)
    const basePositions = new Float32Array([0, 0, 0, 0, -1.2, 0]);
    geom.setAttribute('position', new THREE.BufferAttribute(basePositions, 3));

    const offsets = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const lengths = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      offsets[i * 3 + 0] = (Math.random() - 0.5) * 40;
      offsets[i * 3 + 1] = Math.random() * 25;
      offsets[i * 3 + 2] = (Math.random() - 0.5) * 90;

      speeds[i] = 0.8 + Math.random() * 0.4;
      lengths[i] = 0.8 + Math.random() * 0.8;
    }

    geom.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 3));
    geom.setAttribute('aSpeed', new THREE.InstancedBufferAttribute(speeds, 1));
    geom.setAttribute('aLength', new THREE.InstancedBufferAttribute(lengths, 1));

    return geom;
  }, [count]);

  useFrame((state) => {
    rainMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    rainMaterial.uniforms.uSpeed.value = speed;
    rainMaterial.uniforms.uRainIntensity.value = rainIntensity;

    if (vehicleRef.current) {
      rainMaterial.uniforms.uCarPos.value.copy(vehicleRef.current.position);
    }
  });

  if (rainIntensity <= 0.05) return null;

  return (
    <lineSegments
      args={[geometry, rainMaterial]}
      frustumCulled={false}
    />
  );
}
