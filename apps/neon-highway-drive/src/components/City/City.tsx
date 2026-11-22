import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDrivingStore, PRESET_CONFIGS } from '../../stores/useDrivingStore';

interface CityProps {
  vehicleRef: React.RefObject<THREE.Group | null>;
}

const BUILDING_COUNT = 90;
const CITY_SPAN = 750;

interface BuildingData {
  id: number;
  x: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  color: THREE.Color;
  neonColor: THREE.Color;
  antennaHeight: number;
  hasAdScreen: boolean;
}

export function City({ vehicleRef }: CityProps) {
  const presetKey = useDrivingStore((state) => state.settings.preset);
  const lowEnd = useDrivingStore((state) => state.settings.lowEndPerformance);
  const config = PRESET_CONFIGS[presetKey];

  // Instanced mesh refs
  const buildingMeshRef = useRef<THREE.InstancedMesh>(null);
  const windowMeshRef = useRef<THREE.InstancedMesh>(null);
  const adScreenMeshRef = useRef<THREE.InstancedMesh>(null);
  const antennaMeshRef = useRef<THREE.InstancedMesh>(null);

  // Flying hovercar spinners in the distance
  const hoverCarsRef = useRef<THREE.Group>(null);

  // Seeded building distribution
  const buildings = useMemo<BuildingData[]>(() => {
    const list: BuildingData[] = [];
    const count = lowEnd ? 45 : BUILDING_COUNT;

    for (let i = 0; i < count; i++) {
      // Half left, half right side of highway (highway width is ~24)
      const isLeft = i % 2 === 0;
      const xDistance = 22 + Math.random() * 80;
      const x = isLeft ? -xDistance : xDistance;
      const z = -(i / count) * CITY_SPAN;

      const width = 14 + Math.random() * 26;
      const depth = 14 + Math.random() * 26;
      const height = 40 + Math.random() * 180;

      // Dark slate/cyber building base colors
      const baseColors = ['#0a0d16', '#080a12', '#0c101d', '#111625', '#06080e'];
      const color = new THREE.Color(baseColors[Math.floor(Math.random() * baseColors.length)]);

      // Alternate primary and secondary neon colors
      const neonColor = new THREE.Color(
        Math.random() > 0.5 ? config.primaryNeon : config.secondaryNeon
      );

      list.push({
        id: i,
        x,
        z,
        width,
        height,
        depth,
        color,
        neonColor,
        antennaHeight: Math.random() > 0.4 ? 12 + Math.random() * 25 : 0,
        hasAdScreen: Math.random() > 0.6,
      });
    }
    return list;
  }, [config, lowEnd]);

  // Matrix dummy for instance updates
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Update building positions and wrap around endless highway
  useFrame((state) => {
    if (!vehicleRef.current) return;
    const carZ = vehicleRef.current.position.z;

    const bMesh = buildingMeshRef.current;
    const wMesh = windowMeshRef.current;
    const aMesh = adScreenMeshRef.current;
    const antMesh = antennaMeshRef.current;

    if (!bMesh) return;

    let adIndex = 0;
    let antIndex = 0;

    for (let i = 0; i < buildings.length; i++) {
      const b = buildings[i];

      // Wrap building forward if it falls behind car
      while (b.z > carZ + 80) {
        b.z -= CITY_SPAN;
      }
      while (b.z < carZ - CITY_SPAN + 80) {
        b.z += CITY_SPAN;
      }

      // Main Building Body
      dummy.position.set(b.x, b.height / 2, b.z);
      dummy.scale.set(b.width, b.height, b.depth);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      bMesh.setMatrixAt(i, dummy.matrix);
      bMesh.setColorAt(i, b.color);

      // Window Matrix Strip on facade facing highway
      if (wMesh) {
        const facingDirection = b.x > 0 ? -1 : 1;
        dummy.position.set(b.x + (b.width / 2 + 0.1) * facingDirection, b.height / 2, b.z);
        dummy.scale.set(0.1, b.height * 0.85, b.depth * 0.7);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        wMesh.setMatrixAt(i, dummy.matrix);
        // Window glow tint
        wMesh.setColorAt(i, b.neonColor);
      }

      // Billboard Ad Screens on select skyscrapers
      if (aMesh && b.hasAdScreen && adIndex < buildings.length) {
        const facingDirection = b.x > 0 ? -1 : 1;
        const adY = b.height * 0.65;
        dummy.position.set(b.x + (b.width / 2 + 0.3) * facingDirection, adY, b.z);
        dummy.scale.set(0.2, 12, b.depth * 0.6);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        aMesh.setMatrixAt(adIndex, dummy.matrix);
        // Flashing neon ad colors
        const flash = Math.sin(state.clock.elapsedTime * 2 + i) > 0;
        aMesh.setColorAt(adIndex, flash ? b.neonColor : new THREE.Color(config.primaryNeon));
        adIndex++;
      }

      // Rooftop Antennas
      if (antMesh && b.antennaHeight > 0 && antIndex < buildings.length) {
        dummy.position.set(b.x, b.height + b.antennaHeight / 2, b.z);
        dummy.scale.set(0.4, b.antennaHeight, 0.4);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        antMesh.setMatrixAt(antIndex, dummy.matrix);
        antMesh.setColorAt(antIndex, new THREE.Color('#ff0033'));
        antIndex++;
      }
    }

    bMesh.instanceMatrix.needsUpdate = true;
    if (bMesh.instanceColor) bMesh.instanceColor.needsUpdate = true;

    if (wMesh) {
      wMesh.instanceMatrix.needsUpdate = true;
      if (wMesh.instanceColor) wMesh.instanceColor.needsUpdate = true;
    }
    if (aMesh) {
      aMesh.instanceMatrix.needsUpdate = true;
      if (aMesh.instanceColor) aMesh.instanceColor.needsUpdate = true;
    }
    if (antMesh) {
      antMesh.instanceMatrix.needsUpdate = true;
      if (antMesh.instanceColor) antMesh.instanceColor.needsUpdate = true;
    }

    // Animate flying spinner traffic in distance
    if (hoverCarsRef.current && vehicleRef.current) {
      hoverCarsRef.current.position.z = carZ;
    }
  });

  return (
    <group>
      {/* Instanced Skyscraper Main Bodies */}
      <instancedMesh
        ref={buildingMeshRef}
        args={[undefined, undefined, buildings.length]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          roughness={0.7}
          metalness={0.4}
        />
      </instancedMesh>

      {/* Instanced Glowing Windows Facade Strips */}
      <instancedMesh
        ref={windowMeshRef}
        args={[undefined, undefined, buildings.length]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial transparent opacity={0.65} />
      </instancedMesh>

      {/* Instanced Giant Neon Ad Screens */}
      <instancedMesh
        ref={adScreenMeshRef}
        args={[undefined, undefined, buildings.length]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial />
      </instancedMesh>

      {/* Instanced Rooftop Antennas */}
      <instancedMesh
        ref={antennaMeshRef}
        args={[undefined, undefined, buildings.length]}
      >
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshBasicMaterial color="#ff1133" />
      </instancedMesh>

      {/* Flying Sky Spinners (Distant Sky Traffic) */}
      <group ref={hoverCarsRef}>
        {[
          { x: -60, y: 70, zRel: -150, speed: 45, color: config.primaryNeon },
          { x: 55, y: 95, zRel: -220, speed: -35, color: config.secondaryNeon },
          { x: -90, y: 120, zRel: -300, speed: 60, color: config.primaryNeon },
          { x: 75, y: 60, zRel: -100, speed: -50, color: '#ffff00' },
        ].map((spinner, idx) => (
          <mesh
            key={idx}
            position={[spinner.x, spinner.y, spinner.zRel]}
          >
            <boxGeometry args={[3.5, 0.8, 7]} />
            <meshBasicMaterial color={spinner.color} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
