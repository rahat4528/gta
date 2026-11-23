'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { initScrollTrigger } from '../../animations/scroll/initScrollTrigger';
import { Layers, Quote } from 'lucide-react';

interface LayeredParallaxSectionProps {
  reducedMotion?: boolean;
}

export const LayeredParallaxSection: React.FC<LayeredParallaxSectionProps> = ({
  reducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bgLayerRef = useRef<HTMLDivElement | null>(null);
  const midLayerRef = useRef<HTMLDivElement | null>(null);
  const foreLayerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !containerRef.current ||
      !bgLayerRef.current ||
      !midLayerRef.current ||
      !foreLayerRef.current
    )
      return;

    initScrollTrigger();

    if (reducedMotion) {
      // Clear parallax offsets if reduced motion requested
      gsap.set([bgLayerRef.current, midLayerRef.current, foreLayerRef.current], {
        clearProps: 'y',
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Background layer moves slowly (0.2x speed)
      gsap.to(bgLayerRef.current, {
        y: 80,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Midground layer moves at moderate speed (0.5x speed)
      gsap.to(midLayerRef.current, {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Foreground layer moves at accelerated speed (0.9x speed)
      gsap.to(foreLayerRef.current, {
        y: -130,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative my-20 min-h-[500px] border-y-4 border-ink-900 bg-paper-900 text-paper-50 overflow-hidden flex items-center justify-center py-20 px-4 select-none"
    >
      {/* Background Layer: Halftone Newsprint Grid & Map Graphic */}
      <div
        ref={bgLayerRef}
        className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px] scale-125"
      ></div>

      {/* Midground Layer: Graphic Broadsheet Architectural Cross-Section */}
      <div
        ref={midLayerRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25"
      >
        <div className="w-[800px] h-[360px] border-2 border-dashed border-accent-gold/60 rounded flex items-center justify-around p-8">
          <div className="text-center font-mono text-xs text-accent-gold">
            <div>ELEVATION PROFILE: -140 FT</div>
            <div className="text-3xl font-black mt-2">DOWNTOWN SECTOR 7</div>
            <div>SEISMIC SENSOR GRID #41</div>
          </div>
          <div className="w-px h-full bg-accent-gold/40"></div>
          <div className="text-center font-mono text-xs text-accent-gold">
            <div>PRIMARY BEDROCK CORE</div>
            <div className="text-3xl font-black mt-2">PACIFIC FAULT ARCHIVE</div>
            <div>TUNNEL AXIS 9.2 MILES</div>
          </div>
        </div>
      </div>

      {/* Foreground Layer: High-Contrast Editorial Quote & Depth Stamp */}
      <div
        ref={foreLayerRef}
        className="relative z-10 max-w-4xl mx-auto text-center px-6"
      >
        <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.25em] text-accent-gold border-b border-accent-gold/40 pb-1 mb-6">
          <Layers className="w-4 h-4" />
          <span>Layered Perspective // Metropolitan Investigation</span>
        </div>

        <Quote className="w-12 h-12 mx-auto text-crime-red mb-4 opacity-80" />

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black uppercase tracking-tight text-white leading-tight mb-6">
          "The surface of Los Santos is just a stage. The real city is forged in concrete, copper, and classified tunnels below."
        </h2>

        <div className="font-mono text-xs text-paper-300 uppercase tracking-widest flex items-center justify-center space-x-3">
          <span>DEPUTY COMMISSIONER ARTHUR PENHALLOW</span>
          <span>•</span>
          <span className="text-crime-red">CONFIDENTIAL MEMORANDUM 2026</span>
        </div>
      </div>
    </div>
  );
};
