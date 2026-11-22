import { useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useDrivingStore, PRESET_CONFIGS } from '../../stores/useDrivingStore';

interface HighwayChunkProps {
  positionZ: number;
  length?: number;
  width?: number;
  chunkIndex: number;
  roadMaterial: THREE.ShaderMaterial;
}

export function HighwayChunk({
  positionZ,
  length = 100,
  width = 24,
  chunkIndex,
  roadMaterial,
}: HighwayChunkProps) {
  const presetKey = useDrivingStore((state) => state.settings.preset);
  const config = PRESET_CONFIGS[presetKey];

  // Streetlamp positions for this chunk (spaced every 33m)
  const lampPositions = useMemo(() => [-33, 0, 33], []);

  // Whether this chunk has an overhead gantry
  const hasGantry = chunkIndex % 2 === 0;
  const gantrySignText = useMemo(() => {
    const signs = [
      '// 2077 HIGHWAY // SECTOR 04',
      'SPEED CAMERA ENFORCED // 240 KM/H',
      'NEO TOKYO EXPRESS // LANE 1-4',
      'ACID RAIN WARNING // CAUTION WET',
      'AUTOPILOT CONNECTED // AI GRID',
      'CYBER TOLLWAY // CLEARANCE 4.8M',
    ];
    return signs[Math.abs(chunkIndex) % signs.length];
  }, [chunkIndex]);

  return (
    <group position={[0, 0, positionZ]}>
      {/* Wet Asphalt Highway Road Surface */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        material={roadMaterial}
      >
        <planeGeometry args={[width, length, 1, 1]} />
      </mesh>

      {/* Left Concrete Barrier */}
      <mesh position={[-width / 2 - 0.4, 0.45, 0]}>
        <boxGeometry args={[0.8, 0.9, length]} />
        <meshStandardMaterial color="#1a1c24" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Left Barrier Neon Edge Strip */}
      <mesh position={[-width / 2 - 0.05, 0.9, 0]}>
        <boxGeometry args={[0.1, 0.1, length]} />
        <meshBasicMaterial color={config.primaryNeon} />
      </mesh>

      {/* Right Concrete Barrier */}
      <mesh position={[width / 2 + 0.4, 0.45, 0]}>
        <boxGeometry args={[0.8, 0.9, length]} />
        <meshStandardMaterial color="#1a1c24" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Right Barrier Neon Edge Strip */}
      <mesh position={[width / 2 + 0.05, 0.9, 0]}>
        <boxGeometry args={[0.1, 0.1, length]} />
        <meshBasicMaterial color={config.primaryNeon} />
      </mesh>

      {/* Street Lamps along the barriers */}
      {lampPositions.map((zOffset, i) => (
        <group key={i} position={[0, 0, zOffset]}>
          {/* Left Lamp Post */}
          <group position={[-width / 2 - 0.8, 0, 0]}>
            {/* Vertical Pole */}
            <mesh position={[0, 4, 0]}>
              <cylinderGeometry args={[0.1, 0.15, 8, 8]} />
              <meshStandardMaterial color="#0f1118" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Horizontal Arm */}
            <mesh position={[1.2, 7.8, 0]} rotation={[0, 0, -Math.PI / 6]}>
              <cylinderGeometry args={[0.08, 0.08, 2.8, 8]} />
              <meshStandardMaterial color="#0f1118" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Glowing Lamp Head */}
            <mesh position={[2.3, 7.1, 0]}>
              <boxGeometry args={[0.6, 0.2, 0.4]} />
              <meshBasicMaterial color={config.secondaryNeon} />
            </mesh>
          </group>

          {/* Right Lamp Post */}
          <group position={[width / 2 + 0.8, 0, 0]}>
            {/* Vertical Pole */}
            <mesh position={[0, 4, 0]}>
              <cylinderGeometry args={[0.1, 0.15, 8, 8]} />
              <meshStandardMaterial color="#0f1118" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Horizontal Arm */}
            <mesh position={[-1.2, 7.8, 0]} rotation={[0, 0, Math.PI / 6]}>
              <cylinderGeometry args={[0.08, 0.08, 2.8, 8]} />
              <meshStandardMaterial color="#0f1118" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Glowing Lamp Head */}
            <mesh position={[-2.3, 7.1, 0]}>
              <boxGeometry args={[0.6, 0.2, 0.4]} />
              <meshBasicMaterial color={config.secondaryNeon} />
            </mesh>
          </group>
        </group>
      ))}

      {/* Overhead Cyber Gantry (Optional per chunk) */}
      {hasGantry && (
        <group position={[0, 0, 0]}>
          {/* Left Gantry Pillar */}
          <mesh position={[-width / 2 - 1.2, 4.5, 0]}>
            <boxGeometry args={[0.8, 9, 0.8]} />
            <meshStandardMaterial color="#111420" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Right Gantry Pillar */}
          <mesh position={[width / 2 + 1.2, 4.5, 0]}>
            <boxGeometry args={[0.8, 9, 0.8]} />
            <meshStandardMaterial color="#111420" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Overhead Truss Beam */}
          <mesh position={[0, 8.8, 0]}>
            <boxGeometry args={[width + 3.2, 1.2, 1.2]} />
            <meshStandardMaterial color="#111420" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Digital LED Sign Face (Front) */}
          <mesh position={[0, 8.8, 0.65]}>
            <planeGeometry args={[width * 0.75, 0.9]} />
            <meshBasicMaterial color="#000" />
          </mesh>
          {/* Digital 3D Text on Gantry Sign */}
          <Text
            position={[0, 8.8, 0.68]}
            fontSize={0.45}
            color={config.primaryNeon}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.08}
          >
            {gantrySignText}
          </Text>
          {/* Gantry Border Neon Accent */}
          <mesh position={[0, 9.45, 0.66]}>
            <boxGeometry args={[width * 0.76, 0.08, 0.05]} />
            <meshBasicMaterial color={config.primaryNeon} />
          </mesh>
          <mesh position={[0, 8.15, 0.66]}>
            <boxGeometry args={[width * 0.76, 0.08, 0.05]} />
            <meshBasicMaterial color={config.primaryNeon} />
          </mesh>
          {/* Speed / Lane Indicator Neon Lights */}
          {[-7.5, -2.5, 2.5, 7.5].map((laneX, idx) => (
            <mesh key={idx} position={[laneX, 8.8, 0.7]}>
              <circleGeometry args={[0.25, 16]} />
              <meshBasicMaterial color={config.secondaryNeon} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
