'use client';

import { useState, useEffect } from 'react';

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [userOverride, setUserOverride] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      if (userOverride !== null) {
        setReducedMotion(userOverride);
      } else {
        setReducedMotion(mediaQuery.matches);
      }
    };

    updatePreference();

    const listener = () => {
      if (userOverride === null) {
        setReducedMotion(mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [userOverride]);

  const toggleReducedMotion = () => {
    setUserOverride((prev) => {
      const next = prev === null ? !reducedMotion : !prev;
      setReducedMotion(next);
      return next;
    });
  };

  return { reducedMotion, toggleReducedMotion, isOverridden: userOverride !== null };
}
