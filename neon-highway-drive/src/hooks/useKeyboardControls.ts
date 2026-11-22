import { useEffect, useRef } from 'react';
import { useDrivingStore } from '../stores/useDrivingStore';

export interface KeyboardControls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
  nitro: boolean;
}

export function useKeyboardControls() {
  const controls = useRef<KeyboardControls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
    nitro: false,
  });

  const {
    togglePause,
    toggleAutoDrive,
    cycleCameraView,
    toggleHUD,
    toggleAudio,
    updateTelemetry,
    telemetry,
  } = useDrivingStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting if focus is in an input field
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          controls.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          controls.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          controls.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          controls.current.right = true;
          break;
        case 'Space':
          controls.current.brake = true;
          e.preventDefault();
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          controls.current.nitro = true;
          break;
        case 'KeyC':
          cycleCameraView();
          break;
        case 'KeyZ':
          toggleAutoDrive();
          break;
        case 'KeyL':
          updateTelemetry({ headlights: !telemetry.headlights });
          break;
        case 'KeyH':
          toggleHUD();
          break;
        case 'KeyM':
          toggleAudio();
          break;
        case 'Escape':
        case 'KeyP':
          togglePause();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          controls.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          controls.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          controls.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          controls.current.right = false;
          break;
        case 'Space':
          controls.current.brake = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          controls.current.nitro = false;
          break;
      }
    };

    const handleBlur = () => {
      // Clear inputs if window loses focus
      controls.current = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        brake: false,
        nitro: false,
      };
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [
    togglePause,
    toggleAutoDrive,
    cycleCameraView,
    toggleHUD,
    toggleAudio,
    updateTelemetry,
    telemetry.headlights,
  ]);

  return controls;
}
