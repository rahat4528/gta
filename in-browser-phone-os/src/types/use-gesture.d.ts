/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@use-gesture/react' {
  export interface GestureState {
    movement: [number, number];
    velocity: [number, number];
    direction: [number, number];
    down: boolean;
    active: boolean;
    offset: [number, number];
    distance: [number, number];
    cancel: () => void;
    canceled: boolean;
    first: boolean;
    last: boolean;
    memo?: any;
    event?: any;
    [key: string]: any;
  }

  export type Handler = (state: GestureState) => any;
  export function useDrag(handler: Handler, config?: any): any;
  export function usePinch(handler: Handler, config?: any): any;
  export function useWheel(handler: Handler, config?: any): any;
  export function useScroll(handler: Handler, config?: any): any;
  export function useMove(handler: Handler, config?: any): any;
  export function useHover(handler: Handler, config?: any): any;
  export function useGesture(actions: Record<string, Handler>, config?: any): any;
}
