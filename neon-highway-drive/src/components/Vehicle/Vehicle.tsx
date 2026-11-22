import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useKeyboardControls } from '../../hooks/useKeyboardControls';
import { useDrivingStore, PRESET_CONFIGS } from '../../stores/useDrivingStore';
import { soundEngine } from '../../utils/audio';
import { Gear } from '../../types';

interface VehicleProps {
  vehicleRef: React.RefObject<THREE.Group | null>;
}

// Highway physical half-width constraint
const MAX_X = 10.5;

export function Vehicle({ vehicleRef }: VehicleProps) {
  const controls = useKeyboardControls();

  const isPaused = useDrivingStore((state) => state.settings.isPaused);
  const isAutoDrive = useDrivingStore((state) => state.settings.isAutoDrive);
  const presetKey = useDrivingStore((state) => state.settings.preset);
  const rainIntensity = useDrivingStore((state) => state.settings.rainIntensity);
  const audioVolume = useDrivingStore((state) => state.settings.audioVolume);
  const audioMuted = useDrivingStore((state) => state.settings.audioMuted);
  const updateTelemetry = useDrivingStore((state) => state.updateTelemetry);
  const headlights = useDrivingStore((state) => state.telemetry.headlights);

  const config = PRESET_CONFIGS[presetKey];

  // Wheel refs for spinning and steering
  const wheelFL = useRef<THREE.Group>(null);
  const wheelFR = useRef<THREE.Group>(null);
  const wheelRL = useRef<THREE.Group>(null);
  const wheelRR = useRef<THREE.Group>(null);
  const nitroFlamesRef = useRef<THREE.Group>(null);
  const taillightMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  // Vehicle Simulation State
  const sim = useRef({
    x: 0,
    z: 0,
    speed: 0,          // in km/h
    targetSpeed: 0,
    heading: 0,        // Yaw angle
    steering: 0,       // -1 to 1
    rpm: 800,
    gear: 'N' as Gear,
    turbo: 0,
    driftAngle: 0,
    distanceTraveled: 0,
    isBraking: false,
    isNitro: false,
    autoLaneTarget: 0,
    autoTimer: 0,
  });

  // Calculate gear and RPM from speed
  const calculateGearAndRpm = (speedKmh: number, throttle: number) => {
    const absSpeed = Math.abs(speedKmh);
    if (speedKmh < -0.1) {
      const rpm = 800 + (absSpeed / 45) * 4500;
      return { gear: 'R' as Gear, rpm: Math.min(rpm, 5500) };
    }
    if (absSpeed < 1.0 && throttle === 0) {
      return { gear: 'N' as Gear, rpm: 800 + Math.random() * 50 };
    }

    let gear: Gear = '1';
    let minSpeed = 0;
    let maxSpeed = 55;

    if (absSpeed < 55) {
      gear = '1';
      minSpeed = 0;
      maxSpeed = 55;
    } else if (absSpeed < 95) {
      gear = '2';
      minSpeed = 50;
      maxSpeed = 95;
    } else if (absSpeed < 145) {
      gear = '3';
      minSpeed = 90;
      maxSpeed = 145;
    } else if (absSpeed < 195) {
      gear = '4';
      minSpeed = 140;
      maxSpeed = 195;
    } else if (absSpeed < 250) {
      gear = '5';
      minSpeed = 190;
      maxSpeed = 250;
    } else {
      gear = '6';
      minSpeed = 245;
      maxSpeed = 340;
    }

    const gearRatio = (absSpeed - minSpeed) / (maxSpeed - minSpeed);
    const baseRpm = 2200 + gearRatio * 5800;
    const throttleBoost = throttle * 600;
    const finalRpm = Math.min(Math.max(baseRpm + throttleBoost, 900), 8600);

    return { gear, rpm: finalRpm };
  };

  // Initialize sound engine on first user action
  useEffect(() => {
    const handleInteract = () => {
      soundEngine.init();
      soundEngine.resume();
      window.removeEventListener('keydown', handleInteract);
      window.removeEventListener('click', handleInteract);
    };
    window.addEventListener('keydown', handleInteract);
    window.addEventListener('click', handleInteract);
    return () => {
      window.removeEventListener('keydown', handleInteract);
      window.removeEventListener('click', handleInteract);
    };
  }, []);

  useFrame((_state, delta) => {
    if (isPaused || !vehicleRef.current) return;

    const dt = Math.min(delta, 0.1);
    const s = sim.current;
    const input = controls.current;

    // Auto-Drive AI Pilot Logic
    if (isAutoDrive) {
      s.autoTimer += dt;
      // Change lanes every 8 seconds
      if (s.autoTimer > 8) {
        s.autoTimer = 0;
        const lanes = [-6, -2, 2, 6];
        s.autoLaneTarget = lanes[Math.floor(Math.random() * lanes.length)];
      }

      // Cruise speed target
      const targetCruise = 185;
      if (s.speed < targetCruise) {
        input.forward = true;
        input.backward = false;
        input.brake = false;
      } else {
        input.forward = false;
      }

      // Smooth steering toward target lane
      const laneDiff = s.autoLaneTarget - s.x;
      if (laneDiff > 0.4) {
        input.right = true;
        input.left = false;
      } else if (laneDiff < -0.4) {
        input.left = true;
        input.right = false;
      } else {
        input.left = false;
        input.right = false;
      }
    }

    // Nitro handling
    s.isNitro = input.nitro && s.speed > 30;

    // Throttle & Acceleration
    let throttle = 0;
    if (input.forward) throttle += 1;
    if (input.backward && s.speed > 5) {
      // Foot brake
      s.isBraking = true;
    } else if (input.backward) {
      // Reverse gear
      throttle -= 0.6;
      s.isBraking = false;
    } else {
      s.isBraking = input.brake;
    }

    // Nitro power multiplier
    const power = s.isNitro ? 1.6 : 1.0;
    const maxForwardSpeed = s.isNitro ? 320 : 255;
    const maxReverseSpeed = -50;

    // Speed physics: acceleration, aerodynamic drag, rolling resistance
    if (input.brake) {
      s.isBraking = true;
      // Hard brake deceleration
      const brakeForce = 130 * dt;
      if (s.speed > 0) s.speed = Math.max(s.speed - brakeForce, 0);
      else if (s.speed < 0) s.speed = Math.min(s.speed + brakeForce, 0);
    } else if (s.isBraking) {
      // Standard brake deceleration
      const brakeForce = 90 * dt;
      s.speed = Math.max(s.speed - brakeForce, 0);
    } else if (throttle > 0) {
      // Acceleration curve drops at higher speeds
      const accelFactor = Math.max(1.0 - s.speed / maxForwardSpeed, 0.15);
      const accelForce = 65 * power * accelFactor * dt;
      s.speed = Math.min(s.speed + accelForce, maxForwardSpeed);
    } else if (throttle < 0) {
      // Reverse acceleration
      const accelForce = 35 * dt;
      s.speed = Math.max(s.speed - accelForce, maxReverseSpeed);
    } else {
      // Coasting / aerodynamic drag
      const drag = 12 * dt + (s.speed * s.speed * 0.00018) * dt;
      if (s.speed > 0) s.speed = Math.max(s.speed - drag, 0);
      else if (s.speed < 0) s.speed = Math.min(s.speed + drag, 0);
    }

    // Steering input interpolation
    let targetSteering = 0;
    if (input.left) targetSteering -= 1;
    if (input.right) targetSteering += 1;

    // Speed-sensitive steering damping (sharper at slow speeds, smoother at high)
    const steerSpeed = 6.5;
    s.steering = THREE.MathUtils.lerp(s.steering, targetSteering, steerSpeed * dt);

    // Lateral displacement & Drift
    const speedMs = (s.speed * 1000) / 3600;
    const lateralSpeed = s.steering * (8.5 + Math.min(s.speed * 0.05, 12));
    s.x += lateralSpeed * dt;

    // Clamp inside highway barriers with bounce
    if (s.x > MAX_X) {
      s.x = MAX_X;
      s.speed *= 0.95; // Scrape wall
    } else if (s.x < -MAX_X) {
      s.x = -MAX_X;
      s.speed *= 0.95; // Scrape wall
    }

    // Drift angle calculation
    const targetDrift = input.brake && Math.abs(s.steering) > 0.3
      ? s.steering * 0.45
      : s.steering * (Math.abs(s.speed) / 250) * 0.18;
    s.driftAngle = THREE.MathUtils.lerp(s.driftAngle, targetDrift, 8 * dt);

    // Forward translation in negative Z
    const distanceStep = speedMs * dt;
    s.z -= distanceStep;
    s.distanceTraveled += distanceStep;

    // Body roll / tilt
    const bodyRoll = -s.steering * 0.08 * (Math.abs(s.speed) / 100);
    const bodyPitch = input.brake
      ? -0.05
      : throttle > 0
      ? 0.03 * power
      : 0;

    // Apply transform to vehicle root
    vehicleRef.current.position.set(s.x, 0, s.z);
    vehicleRef.current.rotation.set(bodyPitch, -s.driftAngle, bodyRoll);

    // Wheel rotation (spin based on forward motion)
    const wheelRotDelta = (distanceStep / 0.34); // Wheel radius ~ 0.34m
    if (wheelFL.current) {
      wheelFL.current.rotation.x += wheelRotDelta;
      wheelFL.current.rotation.y = s.steering * -0.55;
    }
    if (wheelFR.current) {
      wheelFR.current.rotation.x += wheelRotDelta;
      wheelFR.current.rotation.y = s.steering * -0.55;
    }
    if (wheelRL.current) wheelRL.current.rotation.x += wheelRotDelta;
    if (wheelRR.current) wheelRR.current.rotation.x += wheelRotDelta;

    // Nitro flames visibility
    if (nitroFlamesRef.current) {
      nitroFlamesRef.current.visible = s.isNitro;
      if (s.isNitro) {
        const flicker = 0.8 + Math.random() * 0.4;
        nitroFlamesRef.current.scale.set(flicker, flicker, flicker * 1.5);
      }
    }

    // Taillight glow color: bright glowing red on brake, normal red otherwise
    if (taillightMaterialRef.current) {
      if (s.isBraking) {
        taillightMaterialRef.current.color.set('#ff0011');
      } else {
        taillightMaterialRef.current.color.set('#aa0022');
      }
    }

    // Gear & RPM
    const { gear, rpm } = calculateGearAndRpm(s.speed, throttle);
    s.gear = gear;
    s.rpm = rpm;

    // Turbo pressure simulation
    if (throttle > 0.5 && s.speed > 50) {
      s.turbo = Math.min(s.turbo + 0.9 * dt, s.isNitro ? 1.8 : 1.4);
    } else {
      s.turbo = Math.max(s.turbo - 2.2 * dt, 0);
    }

    // Sound engine audio sync
    soundEngine.update({
      rpm: s.rpm,
      speed: s.speed,
      throttle: Math.max(throttle, 0),
      driftAngle: s.driftAngle,
      turboPressure: s.turbo,
      rainIntensity,
      volume: audioVolume,
      muted: audioMuted,
    });

    // Update telemetry for HUD (throttled slightly or every frame)
    updateTelemetry({
      speed: Math.round(s.speed),
      targetSpeed: Math.round(maxForwardSpeed),
      rpm: Math.round(s.rpm),
      gear: s.gear,
      steering: s.steering,
      distanceTraveled: Math.round(s.distanceTraveled),
      acceleration: throttle,
      driftAngle: s.driftAngle,
      turboPressure: parseFloat(s.turbo.toFixed(2)),
      isBraking: s.isBraking,
      isNitro: s.isNitro,
    });
  });

  // Cyberpunk Car Geometry & Meshes
  const carBodyColor = useMemo(() => new THREE.Color('#0c0f17'), []);
  const rimColor = useMemo(() => new THREE.Color(config.primaryNeon), [config]);

  return (
    <group ref={vehicleRef} position={[0, 0, 0]}>
      {/* VEHICLE CHASSIS / LOWER BODY */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.9, 0.45, 4.4]} />
        <meshStandardMaterial
          color={carBodyColor}
          metalness={0.88}
          roughness={0.22}
        />
      </mesh>

      {/* AERODYNAMIC HOOD / FRONT WEDGE */}
      <mesh position={[0, 0.32, -1.9]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[1.75, 0.22, 1.2]} />
        <meshStandardMaterial
          color={carBodyColor}
          metalness={0.88}
          roughness={0.22}
        />
      </mesh>

      {/* FRONT SPLITTER (CARBON FIBER) */}
      <mesh position={[0, 0.16, -2.4]}>
        <boxGeometry args={[1.95, 0.06, 0.4]} />
        <meshStandardMaterial color="#050608" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* COCKPIT / CABIN ROOF (GLASS TINT) */}
      <mesh position={[0, 0.82, -0.2]}>
        <boxGeometry args={[1.35, 0.42, 2.0]} />
        <meshStandardMaterial
          color="#050811"
          metalness={0.95}
          roughness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* REAR SPOILER / WING */}
      <group position={[0, 0.9, 1.8]}>
        {/* Left Strut */}
        <mesh position={[-0.65, -0.2, 0]}>
          <boxGeometry args={[0.06, 0.4, 0.2]} />
          <meshStandardMaterial color="#050608" metalness={0.8} />
        </mesh>
        {/* Right Strut */}
        <mesh position={[0.65, -0.2, 0]}>
          <boxGeometry args={[0.06, 0.4, 0.2]} />
          <meshStandardMaterial color="#050608" metalness={0.8} />
        </mesh>
        {/* Horizontal Wing Blade */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[1.8, 0.06, 0.45]} />
          <meshStandardMaterial color="#050608" metalness={0.8} />
        </mesh>
      </group>

      {/* REAR DIFFUSER */}
      <mesh position={[0, 0.2, 2.15]}>
        <boxGeometry args={[1.7, 0.15, 0.3]} />
        <meshStandardMaterial color="#050608" metalness={0.7} />
      </mesh>

      {/* DUAL EXHAUST PIPES */}
      <group position={[0, 0.28, 2.22]}>
        <mesh position={[-0.45, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 12]} />
          <meshStandardMaterial color="#333" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.45, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 12]} />
          <meshStandardMaterial color="#333" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* NITRO FLAMES (Visible when boosting) */}
      <group ref={nitroFlamesRef} position={[0, 0.28, 2.5]} visible={false}>
        <mesh position={[-0.45, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.14, 0.9, 12]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
        <mesh position={[0.45, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.14, 0.9, 12]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      </group>

      {/* HEADLIGHTS (Horizontal LED Cyber Strips) */}
      <group position={[0, 0.4, -2.25]}>
        {/* Left Headlight Strip */}
        <mesh position={[-0.65, 0, 0]}>
          <boxGeometry args={[0.45, 0.08, 0.05]} />
          <meshBasicMaterial color={headlights ? '#ffffff' : '#444'} />
        </mesh>
        {/* Right Headlight Strip */}
        <mesh position={[0.65, 0, 0]}>
          <boxGeometry args={[0.45, 0.08, 0.05]} />
          <meshBasicMaterial color={headlights ? '#ffffff' : '#444'} />
        </mesh>
        {/* Center Accent Neon Line */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.7, 0.03, 0.05]} />
          <meshBasicMaterial color={config.primaryNeon} />
        </mesh>

        {/* Real Headlight Spotlights onto Highway */}
        {headlights && (
          <>
            <spotLight
              position={[-0.65, 0.2, -0.2]}
              target-position={[-0.65, 0, -25]}
              color="#dffff"
              intensity={2.8}
              angle={0.45}
              penumbra={0.6}
              distance={65}
            />
            <spotLight
              position={[0.65, 0.2, -0.2]}
              target-position={[0.65, 0, -25]}
              color="#dffff"
              intensity={2.8}
              angle={0.45}
              penumbra={0.6}
              distance={65}
            />
          </>
        )}
      </group>

      {/* TAILLIGHTS (Full Width Neon Cyber Bar) */}
      <group position={[0, 0.52, 2.22]}>
        <mesh>
          <boxGeometry args={[1.75, 0.1, 0.05]} />
          <meshBasicMaterial ref={taillightMaterialRef} color="#ff0022" />
        </mesh>
      </group>

      {/* NEON UNDERGLOW (Pulsing underneath chassis) */}
      <group position={[0, 0.08, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.7, 3.8]} />
          <meshBasicMaterial
            color={config.primaryNeon}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>

      {/* 4 WHEELS */}
      {/* Front-Left Wheel */}
      <group ref={wheelFL} position={[-0.98, 0.32, -1.35]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 0.3, 20]} />
          <meshStandardMaterial color="#111" roughness={0.8} />
        </mesh>
        {/* Glowing Rim Edge */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.15, 0, 0]}>
          <ringGeometry args={[0.22, 0.26, 20]} />
          <meshBasicMaterial color={rimColor} />
        </mesh>
      </group>

      {/* Front-Right Wheel */}
      <group ref={wheelFR} position={[0.98, 0.32, -1.35]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 0.3, 20]} />
          <meshStandardMaterial color="#111" roughness={0.8} />
        </mesh>
        {/* Glowing Rim Edge */}
        <mesh rotation={[0, 0, -Math.PI / 2]} position={[0.15, 0, 0]}>
          <ringGeometry args={[0.22, 0.26, 20]} />
          <meshBasicMaterial color={rimColor} />
        </mesh>
      </group>

      {/* Rear-Left Wheel */}
      <group ref={wheelRL} position={[-0.98, 0.34, 1.35]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.36, 0.36, 0.36, 20]} />
          <meshStandardMaterial color="#111" roughness={0.8} />
        </mesh>
        {/* Glowing Rim Edge */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.18, 0, 0]}>
          <ringGeometry args={[0.24, 0.28, 20]} />
          <meshBasicMaterial color={rimColor} />
        </mesh>
      </group>

      {/* Rear-Right Wheel */}
      <group ref={wheelRR} position={[0.98, 0.34, 1.35]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.36, 0.36, 0.36, 20]} />
          <meshStandardMaterial color="#111" roughness={0.8} />
        </mesh>
        {/* Glowing Rim Edge */}
        <mesh rotation={[0, 0, -Math.PI / 2]} position={[0.18, 0, 0]}>
          <ringGeometry args={[0.24, 0.28, 20]} />
          <meshBasicMaterial color={rimColor} />
        </mesh>
      </group>
    </group>
  );
}
