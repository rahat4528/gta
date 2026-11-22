import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDrivingStore } from '../../stores/useDrivingStore';

interface TrafficProps {
  vehicleRef: React.RefObject<THREE.Group | null>;
}

interface TrafficCar {
  id: number;
  laneX: number;
  zRel: number;
  speedKmh: number;
  model: 'coupe' | 'truck' | 'sedan';
  color: string;
  tailLightColor: string;
}

const TRAFFIC_COUNT = 9;
const LANES = [-6.2, -2.1, 2.1, 6.2];

export function Traffic({ vehicleRef }: TrafficProps) {
  const lowEnd = useDrivingStore((state) => state.settings.lowEndPerformance);
  const isPaused = useDrivingStore((state) => state.settings.isPaused);
  const playerSpeed = useDrivingStore((state) => state.telemetry.speed);

  const trafficGroupRef = useRef<THREE.Group>(null);

  const cars = useMemo<TrafficCar[]>(() => {
    const count = lowEnd ? 4 : TRAFFIC_COUNT;
    const list: TrafficCar[] = [];
    const colors = ['#1a233a', '#2d1b36', '#142828', '#252528', '#38161f'];
    const models: ('coupe' | 'truck' | 'sedan')[] = ['coupe', 'truck', 'sedan'];

    for (let i = 0; i < count; i++) {
      const lane = LANES[i % LANES.length];
      const zRel = -60 - i * 45 - Math.random() * 20;
      const speedKmh = 105 + Math.random() * 35; // 105 - 140 km/h cruising speed

      list.push({
        id: i,
        laneX: lane,
        zRel,
        speedKmh,
        model: models[i % models.length],
        color: colors[i % colors.length],
        tailLightColor: Math.random() > 0.3 ? '#ff0033' : '#ff5500',
      });
    }
    return list;
  }, [lowEnd]);

  // Traffic vehicles mesh references
  const carRefs = useRef<(THREE.Group | null)[]>([]);

  useFrame((_, delta) => {
    if (isPaused || !vehicleRef.current) return;
    const playerZ = vehicleRef.current.position.z;

    for (let i = 0; i < cars.length; i++) {
      const car = cars[i];
      const group = carRefs.current[i];
      if (!group) return;

      // Relative motion: player speed vs traffic car speed
      // Convert km/h difference to m/s
      const relSpeedKmh = playerSpeed - car.speedKmh;
      const relSpeedMs = (relSpeedKmh * 1000) / 3600;

      // If player is faster, traffic moves closer (zRel increases toward 0 and past)
      car.zRel += relSpeedMs * delta;

      // Wrap traffic car forward if far behind player, or backward if far ahead
      if (car.zRel > 50) {
        // Player overtook car -> respawn far ahead
        car.zRel = -280 - Math.random() * 80;
        car.laneX = LANES[Math.floor(Math.random() * LANES.length)];
      } else if (car.zRel < -380) {
        // Car too far ahead -> respawn closer ahead
        car.zRel = -120 - Math.random() * 60;
        car.laneX = LANES[Math.floor(Math.random() * LANES.length)];
      }

      // Position traffic car in world coordinates
      const worldZ = playerZ + car.zRel;
      group.position.set(car.laneX, 0, worldZ);
    }
  });

  return (
    <group ref={trafficGroupRef}>
      {cars.map((car, idx) => (
        <group
          key={car.id}
          ref={(el: THREE.Group | null) => {
            carRefs.current[idx] = el;
          }}
        >
          {/* Main Car Body */}
          <mesh position={[0, car.model === 'truck' ? 0.8 : 0.45, 0]}>
            <boxGeometry
              args={[
                car.model === 'truck' ? 2.3 : 1.9,
                car.model === 'truck' ? 1.4 : 0.55,
                car.model === 'truck' ? 5.8 : 4.2,
              ]}
            />
            <meshStandardMaterial
              color={car.color}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>

          {/* Cabin Glass */}
          <mesh position={[0, car.model === 'truck' ? 1.3 : 0.85, -0.2]}>
            <boxGeometry
              args={[
                car.model === 'truck' ? 1.9 : 1.4,
                0.45,
                car.model === 'truck' ? 2.5 : 1.8,
              ]}
            />
            <meshStandardMaterial
              color="#020408"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>

          {/* Glowing Red Taillights (Facing the player) */}
          <mesh position={[0, car.model === 'truck' ? 0.7 : 0.52, car.model === 'truck' ? 2.92 : 2.12]}>
            <boxGeometry args={[car.model === 'truck' ? 1.9 : 1.6, 0.12, 0.05]} />
            <meshBasicMaterial color={car.tailLightColor} />
          </mesh>

          {/* Headlights (Front) */}
          <mesh position={[0, car.model === 'truck' ? 0.6 : 0.4, car.model === 'truck' ? -2.92 : -2.12]}>
            <boxGeometry args={[1.6, 0.08, 0.05]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* Underglow accent */}
          <mesh
            position={[0, 0.08, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[1.6, 3.5]} />
            <meshBasicMaterial
              color={car.tailLightColor}
              transparent
              opacity={0.35}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
