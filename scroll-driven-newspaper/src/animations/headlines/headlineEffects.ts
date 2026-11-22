import gsap from 'gsap';
import { initScrollTrigger } from '../scroll/initScrollTrigger';

export type HeadlineEffect = 'reveal' | 'stagger-fade' | 'tracking-in' | 'ink-bleed';

export function animateHeadline(
  element: HTMLElement,
  effect: HeadlineEffect = 'reveal',
  reducedMotion = false
): gsap.core.Tween | gsap.core.Timeline | null {
  if (typeof window === 'undefined' || !element) return null;

  initScrollTrigger();

  if (reducedMotion) {
    gsap.set(element, { clearProps: 'all', opacity: 1, y: 0, scale: 1 });
    return null;
  }

  switch (effect) {
    case 'reveal': {
      // Broadsheet mask clip-path reveal from bottom up
      return gsap.fromTo(
        element,
        {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          y: 35,
          opacity: 0.2,
        },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    case 'tracking-in': {
      // Letter spacing compresses from wide teletype to tight broadsheet
      return gsap.fromTo(
        element,
        {
          letterSpacing: '0.22em',
          opacity: 0,
          y: 20,
        },
        {
          letterSpacing: '-0.02em',
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    case 'ink-bleed': {
      // Ink press simulation: slight blur clearing with rich contrast
      return gsap.fromTo(
        element,
        {
          filter: 'blur(6px)',
          opacity: 0,
          scale: 0.98,
        },
        {
          filter: 'blur(0px)',
          opacity: 1,
          scale: 1,
          duration: 1.0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    case 'stagger-fade':
    default: {
      return gsap.fromTo(
        element,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }
}
