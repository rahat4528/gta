import * as THREE from 'three';
import { Rain } from './Rain';
import { TireSpray } from './TireSpray';
import { SpeedLines } from './SpeedLines';
import { PostProcessing } from './PostProcessing';

interface EffectsProps {
  vehicleRef: React.RefObject<THREE.Group | null>;
}

export function Effects({ vehicleRef }: EffectsProps) {
  return (
    <group>
      <Rain vehicleRef={vehicleRef} />
      <TireSpray vehicleRef={vehicleRef} />
      <SpeedLines vehicleRef={vehicleRef} />
      <PostProcessing />
    </group>
  );
}
