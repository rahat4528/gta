import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HighwayChunk } from './HighwayChunk';
import { createRoadMaterial } from '../../shaders/roadShader';
import { useDrivingStore, PRESET_CONFIGS } from '../../stores/useDrivingStore';

interface HighwayProps {
  vehicleRef: React.RefObject<THREE.Group | null>;
}

const CHUNK_COUNT = 7;
const CHUNK_LENGTH = 100;

export function Highway({ vehicleRef }: HighwayProps) {
  const presetKey = useDrivingStore((state) => state.settings.preset);
  const rainIntensity = useDrivingStore((state) => state.settings.rainIntensity);
  const speed = useDrivingStore((state) => state.telemetry.speed);
  const config = PRESET_CONFIGS[presetKey];

  // Shared road ShaderMaterial instance
  const roadMaterial = useMemo(() => createRoadMaterial(), []);

  // Update material colors on preset change
  useEffect(() => {
    roadMaterial.uniforms.uPrimaryNeon.value.set(config.primaryNeon);
    roadMaterial.uniforms.uSecondaryNeon.value.set(config.secondaryNeon);
  }, [roadMaterial, config]);

  // Initial chunks positions: [0, -100, -200, -300, -400, -500, -600]
  const chunks = useRef(
    Array.from({ length: CHUNK_COUNT }, (_, i) => ({
      id: i,
      z: -i * CHUNK_LENGTH,
      chunkIndex: i,
    }))
  );

  useFrame((state) => {
    // Update Shader uniforms
    roadMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    roadMaterial.uniforms.uRainIntensity.value = rainIntensity;
    roadMaterial.uniforms.uSpeed.value = speed;

    if (vehicleRef.current) {
      const carZ = vehicleRef.current.position.z;
      roadMaterial.uniforms.uCarPos.value.copy(vehicleRef.current.position);

      // Recycle chunks behind the vehicle
      // Find the furthest forward chunk (smallest Z)
      let minZ = chunks.current[0].z;
      for (let i = 1; i < CHUNK_COUNT; i++) {
        if (chunks.current[i].z < minZ) {
          minZ = chunks.current[i].z;
        }
      }

      // Check if any chunk is behind car by more than 1 chunk length
      for (let i = 0; i < CHUNK_COUNT; i++) {
        const chunk = chunks.current[i];
        if (chunk.z > carZ + CHUNK_LENGTH) {
          chunk.z = minZ - CHUNK_LENGTH;
          chunk.chunkIndex = Math.floor(Math.abs(chunk.z) / CHUNK_LENGTH);
          minZ = chunk.z;
        }
      }
    }
  });

  return (
    <group>
      {chunks.current.map((chunk) => (
        <HighwayChunk
          key={chunk.id}
          positionZ={chunk.z}
          length={CHUNK_LENGTH}
          width={24}
          chunkIndex={chunk.chunkIndex}
          roadMaterial={roadMaterial}
        />
      ))}
    </group>
  );
}
