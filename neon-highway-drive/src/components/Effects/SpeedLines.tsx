import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDrivingStore, PRESET_CONFIGS } from '../../stores/useDrivingStore';

interface SpeedLinesProps {
  vehicleRef: React.RefObject<THREE.Group | null>;
}

const LINE_COUNT = 45;

export function SpeedLines({ vehicleRef }: SpeedLinesProps) {
  const speed = useDrivingStore((state) => state.telemetry.speed);
  const isNitro = useDrivingStore((state) => state.telemetry.isNitro);
  const presetKey = useDrivingStore((state) => state.settings.preset);
  const lowEnd = useDrivingStore((state) => state.settings.lowEndPerformance);
  const config = PRESET_CONFIGS[presetKey];

  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, lineData } = useMemo(() => {
    const count = lowEnd ? 20 : LINE_COUNT;
    // Each line has 2 vertices = 6 floats
    const pos = new Float32Array(count * 6);
    const data = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 22,
      y: 0.5 + Math.random() * 6.5,
      zRel: -Math.random() * 80,
      length: 6 + Math.random() * 12,
      speedMult: 1.2 + Math.random() * 0.8,
    }));

    return { positions: pos, lineData: data };
  }, [lowEnd]);

  useFrame((_, delta) => {
    if (!linesRef.current || !vehicleRef.current) return;

    const absSpeed = Math.abs(speed);
    const active = absSpeed > 150 || isNitro;
    linesRef.current.visible = active;

    if (!active) return;

    const carZ = vehicleRef.current.position.z;
    const geom = linesRef.current.geometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;

    const streamSpeed = (absSpeed / 100) * 80;

    for (let i = 0; i < lineData.length; i++) {
      const line = lineData[i];
      line.zRel += streamSpeed * line.speedMult * delta;

      // Wrap lines forward
      if (line.zRel > 15) {
        line.zRel = -75 - Math.random() * 20;
        line.x = (Math.random() - 0.5) * 20;
        line.y = 0.5 + Math.random() * 5.5;
      }

      const worldZ = carZ + line.zRel;
      // Start vertex
      positions[i * 6 + 0] = line.x;
      positions[i * 6 + 1] = line.y;
      positions[i * 6 + 2] = worldZ;

      // End vertex (stretched backward along Z)
      positions[i * 6 + 3] = line.x;
      positions[i * 6 + 4] = line.y;
      positions[i * 6 + 5] = worldZ + line.length * (isNitro ? 2.2 : 1.2);
    }

    posAttr.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef} visible={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={config.primaryNeon}
        transparent
        opacity={isNitro ? 0.85 : 0.45}
      />
    </lineSegments>
  );
}
