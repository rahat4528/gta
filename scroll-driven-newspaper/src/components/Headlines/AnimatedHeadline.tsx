'use client';

import React, { useEffect, useRef } from 'react';
import { animateHeadline, HeadlineEffect } from '../../animations/headlines/headlineEffects';

interface AnimatedHeadlineProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  className?: string;
  effect?: HeadlineEffect;
  reducedMotion?: boolean;
}

export const AnimatedHeadline: React.FC<AnimatedHeadlineProps> = ({
  children,
  as: Component = 'h2',
  className = '',
  effect = 'reveal',
  reducedMotion = false,
}) => {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    const tween = animateHeadline(headingRef.current, effect, reducedMotion);

    return () => {
      if (tween) {
        tween.kill();
      }
    };
  }, [effect, reducedMotion]);

  return (
    <Component
      ref={headingRef}
      className={`font-serif font-black tracking-tight leading-none ${className}`}
    >
      {children}
    </Component>
  );
};
