import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDrivingStore } from '../../stores/useDrivingStore';

interface TireSprayProps {
  vehicleRef: React.RefObject<THREE.Group | null>;
}

const PARTICLE_COUNT = 80;

export function TireSpray({ vehicleRef }: TireSprayProps) {
  const speed = useDrivingStore((state) => state.telemetry.speed);
  const rainIntensity = useDrivingStore((state) => state.settings.rainIntensity);
  const lowEnd = useDrivingStore((state) => state.settings.lowEndPerformance);

  const particlesRef = useRef<THREE.Points>(null);

  const { positions, velocities, lifetimes } = useMemo(() => {
    const count = lowEnd ? 30 : PARTICLE_COUNT;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const life = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      life[i] = Math.random();
      pos[i * 3 + 1] = -100; // start off-screen
    }

    return { positions: pos, velocities: vel, lifetimes: life };
  }, [lowEnd]);

  useFrame((_, delta) => {
    if (!particlesRef.current || !vehicleRef.current) return;

    const absSpeed = Math.abs(speed);
    const isSpraying = absSpeed > 35 && rainIntensity > 0.1;
    const carPos = vehicleRef.current.position;
    const count = lifetimes.length;

    const geom = particlesRef.current.geometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      lifetimes[i] += delta * 2.5;

      if (lifetimes[i] >= 1.0) {
        if (isSpraying) {
          lifetimes[i] = 0;
          // Spawn near left or right rear tire
          const isLeft = i % 2 === 0;
          const tireX = carPos.x + (isLeft ? -0.9 : 0.9) + (Math.random() - 0.5) * 0.2;
          positions[i * 3 + 0] = tireX;
          positions[i * 3 + 1] = carPos.y + 0.15;
          positions[i * 3 + 2] = carPos.z + 2.0;

          // Velocity: plumes backward and slightly outward and upward
          const spraySpeed = (absSpeed / 100) * 8;
          velocities[i * 3 + 0] = (isLeft ? -1 : 1) * (0.8 + Math.random() * 1.5);
          velocities[i * 3 + 1] = 0.5 + Math.random() * 2.0;
          velocities[i * 3 + 2] = spraySpeed * (0.6 + Math.random() * 0.4);
        } else {
          positions[i * 3 + 1] = -100;
        }
      } else if (positions[i * 3 + 1] > -50) {
        // Integrate physics
        positions[i * 3 + 0] += velocities[i * 3 + 0] * delta;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;
        velocities[i * 3 + 1] += -1.5 * delta; // Gravity
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.65}
        color="#8899aa"
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </points>
  );
}
