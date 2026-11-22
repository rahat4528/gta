import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDrivingStore } from '../../stores/useDrivingStore';

interface CameraControllerProps {
  vehicleRef: React.RefObject<THREE.Group | null>;
}

export function CameraController({ vehicleRef }: CameraControllerProps) {
  const cameraView = useDrivingStore((state) => state.settings.cameraView);
  const speed = useDrivingStore((state) => state.telemetry.speed);
  const steering = useDrivingStore((state) => state.telemetry.steering);
  const isNitro = useDrivingStore((state) => state.telemetry.isNitro);

  // Smooth lerp positions
  const currentPos = useRef(new THREE.Vector3(0, 3, 7));
  const currentLookAt = useRef(new THREE.Vector3(0, 1, -10));

  useFrame((state, delta) => {
    if (!vehicleRef.current) return;

    const carPos = vehicleRef.current.position;
    const speedKmh = Math.abs(speed);
    const speedRatio = Math.min(speedKmh / 240, 1.2);

    // Speed shake calculation
    const shakeIntensity = speedKmh > 120 ? ((speedKmh - 120) / 120) * 0.04 : 0;
    const shakeX = (Math.random() - 0.5) * shakeIntensity;
    const shakeY = (Math.random() - 0.5) * shakeIntensity * 0.6;

    // FOV adjustment based on speed (speed tunnel effect)
    const baseFov = cameraView === 'cockpit' ? 70 : 60;
    const nitroFov = isNitro ? 12 : 0;
    const targetFov = baseFov + speedRatio * 18 + nitroFov;
    
    if (state.camera instanceof THREE.PerspectiveCamera) {
      state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, targetFov, delta * 3.5);
      state.camera.updateProjectionMatrix();
    }

    const targetPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();

    switch (cameraView) {
      case 'cockpit': {
        // Inside cockpit: looking forward out of windshield
        targetPos.set(carPos.x - 0.35, carPos.y + 0.95, carPos.z - 0.2);
        targetLookAt.set(carPos.x - 0.35 + steering * 0.5, carPos.y + 0.9, carPos.z - 25);
        break;
      }
      case 'hood': {
        // Mounted on front hood, very low and fast
        targetPos.set(carPos.x, carPos.y + 0.7, carPos.z - 1.8);
        targetLookAt.set(carPos.x + steering * 1.0, carPos.y + 0.6, carPos.z - 40);
        break;
      }
      case 'cinematic': {
        // Dramatic low side 3/4 angle
        const orbitAngle = Math.sin(state.clock.elapsedTime * 0.3) * 0.4;
        targetPos.set(
          carPos.x + 3.8 * Math.cos(orbitAngle),
          carPos.y + 1.2 + Math.sin(state.clock.elapsedTime * 0.4) * 0.4,
          carPos.z + 4.5
        );
        targetLookAt.set(carPos.x, carPos.y + 0.8, carPos.z - 15);
        break;
      }
      case 'chase':
      default: {
        // Smooth 3rd person follow cam with lateral sway
        const chaseDist = 5.8 + speedRatio * 1.5;
        const chaseHeight = 2.4 - speedRatio * 0.3;
        const lateralOffset = steering * -0.6; // subtle counter-lean
        
        targetPos.set(
          carPos.x + lateralOffset,
          carPos.y + chaseHeight,
          carPos.z + chaseDist
        );
        targetLookAt.set(
          carPos.x + steering * 0.8,
          carPos.y + 0.9,
          carPos.z - 20
        );
        break;
      }
    }

    // Apply speed shake
    targetPos.x += shakeX;
    targetPos.y += shakeY;

    // Smooth interpolation with delta time
    const lerpSpeed = cameraView === 'cockpit' || cameraView === 'hood' ? 18 : 8;
    currentPos.current.lerp(targetPos, Math.min(delta * lerpSpeed, 1));
    currentLookAt.current.lerp(targetLookAt, Math.min(delta * lerpSpeed, 1));

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentLookAt.current);
  });

  return null;
}
