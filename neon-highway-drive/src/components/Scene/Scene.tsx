import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment } from './Environment';
import { CameraController } from './CameraController';
import { Highway } from '../Highway/Highway';
import { Traffic } from '../Highway/Traffic';
import { City } from '../City/City';
import { Vehicle } from '../Vehicle/Vehicle';
import { Effects } from '../Effects/Effects';
import { useDrivingStore } from '../../stores/useDrivingStore';

function FpsTracker() {
  const setFps = useDrivingStore((state) => state.setFps);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useFrame(() => {
    frameCount.current++;
    const now = performance.now();
    if (now - lastTime.current >= 500) {
      const calculatedFps = Math.round((frameCount.current * 1000) / (now - lastTime.current));
      setFps(calculatedFps);
      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  return null;
}

export function Scene() {
  const vehicleRef = useRef<THREE.Group>(null);
  const lowEnd = useDrivingStore((state) => state.settings.lowEndPerformance);

  return (
    <div className="relative w-full h-full bg-[#030408]">
      <Canvas
        shadows={false}
        dpr={lowEnd ? 1.0 : [1, 2]}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 3, 7], fov: 60, near: 0.1, far: 850 }}
      >
        <FpsTracker />
        <Environment />
        <CameraController vehicleRef={vehicleRef} />
        <Highway vehicleRef={vehicleRef} />
        <Traffic vehicleRef={vehicleRef} />
        <City vehicleRef={vehicleRef} />
        <Vehicle vehicleRef={vehicleRef} />
        <Effects vehicleRef={vehicleRef} />
      </Canvas>
    </div>
  );
}
