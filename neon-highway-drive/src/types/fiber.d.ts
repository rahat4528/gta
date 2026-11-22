declare module '@react-three/fiber' {
  import React from 'react';
  import * as THREE from 'three';

  export type RootState = {
    gl: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.Camera;
    raycaster: THREE.Raycaster;
    size: { width: number; height: number; top: number; left: number };
    viewport: { width: number; height: number; factor: number; distance: number; aspect: number };
    clock: THREE.Clock;
    pointer: THREE.Vector2;
    events: any;
    invalidate: () => void;
    advance: (timestamp: number, runGlobalEffects?: boolean) => void;
    setSize: (width: number, height: number) => void;
    setDpr: (dpr: number) => void;
    setFrameloop: (frameloop?: 'always' | 'demand' | 'never') => void;
  };

  export type RenderCallback = (state: RootState, delta: number, xrFrame?: any) => void;
  export function useFrame(callback: RenderCallback, renderPriority?: number): void;
  export function useThree<T = RootState>(selector?: (state: RootState) => T, equals?: (a: any, b: any) => boolean): T;
  export const Canvas: React.FC<any>;
  export function extend(objects: any): void;
  export function createPortal(children: React.ReactNode, container: any, state?: any): React.ReactNode;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
