import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let isRegistered = false;

export function initScrollTrigger() {
  if (typeof window !== 'undefined' && !isRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    isRegistered = true;
  }
  return ScrollTrigger;
}

export function refreshScrollTrigger() {
  if (typeof window !== 'undefined' && isRegistered) {
    ScrollTrigger.refresh();
  }
}

export function killAllScrollTriggers() {
  if (typeof window !== 'undefined' && isRegistered) {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }
}
