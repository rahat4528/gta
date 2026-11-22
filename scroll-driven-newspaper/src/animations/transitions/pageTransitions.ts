import { refreshScrollTrigger, killAllScrollTriggers } from '../scroll/initScrollTrigger';

export function handleRouteChange() {
  if (typeof window === 'undefined') return;
  
  // Kill old page triggers before new page mounts to avoid scroll jump conflicts
  killAllScrollTriggers();

  // Refresh after layout repaint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      refreshScrollTrigger();
    });
  });
}
