import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useDrivingStore, PRESET_CONFIGS } from '../../stores/useDrivingStore';

export function Environment() {
  const { scene } = useThree();
  const presetKey = useDrivingStore((state) => state.settings.preset);
  const rainIntensity = useDrivingStore((state) => state.settings.rainIntensity);
  const config = PRESET_CONFIGS[presetKey];

  useEffect(() => {
    // Dynamic exponential fog based on preset and rain
    const fogDensity = 0.004 + rainIntensity * 0.003;
    const fogColor = new THREE.Color(config.fogColor);
    scene.fog = new THREE.FogExp2(fogColor, fogDensity);
    scene.background = new THREE.Color(config.skyColor);

    return () => {
      scene.fog = null;
    };
  }, [scene, config, rainIntensity]);

  return (
    <group>
      {/* Ambient Cyberpunk Glow */}
      <ambientLight color={config.ambientColor} intensity={0.8} />

      {/* Main Overhead Directional Light (Distant City / Moon) */}
      <directionalLight
        position={[20, 50, -20]}
        intensity={1.2}
        color={config.primaryNeon}
        castShadow={false}
      />

      {/* Secondary Rim Fill Light */}
      <directionalLight
        position={[-30, 40, 10]}
        intensity={0.6}
        color={config.secondaryNeon}
      />

      {/* Distant Cyberpunk Grid Floor in the Horizon */}
      <mesh position={[0, -2, -600]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1200, 1200, 40, 40]} />
        <meshBasicMaterial
          color={config.skyColor}
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>
    </group>
  );
}
