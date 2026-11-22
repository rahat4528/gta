'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initScrollTrigger } from '../../animations/scroll/initScrollTrigger';
import { ShieldCheck, FileText, AlertTriangle, Database, Lock } from 'lucide-react';

interface PinnedInvestigativeProps {
  reducedMotion?: boolean;
}

export const PinnedInvestigative: React.FC<PinnedInvestigativeProps> = ({ reducedMotion = false }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinnedColRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current || !pinnedColRef.current) return;

    initScrollTrigger();

    if (reducedMotion) {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === containerRef.current) st.kill();
      });
      return;
    }

    // Pinned section trigger: Pin the left evidence board while right editorial narrative scrolls
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const pinTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top+=80',
        end: 'bottom bottom-=40',
        pin: pinnedColRef.current,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      return () => {
        pinTrigger.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={containerRef}
      className="my-16 border-y-4 border-ink-900 bg-paper-200 p-6 sm:p-10 relative overflow-hidden"
    >
      {/* Background Section Stamp */}
      <div className="absolute right-6 top-6 text-ink-900/10 font-mono text-8xl font-black select-none pointer-events-none uppercase">
        DOSSIER
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative">
        {/* Left Column: Stays Pinned on Large Screens */}
        <div ref={pinnedColRef} className="lg:col-span-5 flex flex-col justify-between">
          <div className="bg-paper-100 border-2 border-ink-900 p-6 shadow-newsprint-lg">
            <div className="flex items-center space-x-2 text-crime-red font-mono text-xs font-bold uppercase tracking-widest border-b-2 border-ink-900 pb-2 mb-4">
              <Lock className="w-4 h-4" />
              <span>SPECIAL INQUIRY BOARD // EVIDENCE FILE</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-black uppercase text-ink-900 leading-tight mb-3">
              The Subterranean Gold Transfer Audit
            </h3>

            <p className="text-xs font-serif text-ink-700 leading-relaxed mb-6 italic">
              "When hundreds of tons of sovereign bullion move in the dark, the question is never what was moved — but who held the keys to the rail switches."
            </p>

            {/* Pinned Real-time Telemetry Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-paper-50 border border-ink-900/30 p-2.5">
                <div className="text-[10px] font-mono text-ink-500 uppercase">Estimated Reserve</div>
                <div className="text-xl font-mono font-black text-ink-900">$84.2 BILLION</div>
                <div className="text-[9px] font-mono text-emerald-700 font-bold">VERIFIED FEDERAL CUSTODY</div>
              </div>

              <div className="bg-paper-50 border border-ink-900/30 p-2.5">
                <div className="text-[10px] font-mono text-ink-500 uppercase">Auxiliary Bore Depth</div>
                <div className="text-xl font-mono font-black text-crime-red">-140 FEET</div>
                <div className="text-[9px] font-mono text-ink-600">BELOW MAZE BANK FOUNDATION</div>
              </div>

              <div className="bg-paper-50 border border-ink-900/30 p-2.5">
                <div className="text-[10px] font-mono text-ink-500 uppercase">Subway Overlap</div>
                <div className="text-xl font-mono font-black text-ink-900">12 METERS</div>
                <div className="text-[9px] font-mono text-ink-600">ZERO PASSENGER STOPS</div>
              </div>

              <div className="bg-paper-50 border border-ink-900/30 p-2.5">
                <div className="text-[10px] font-mono text-ink-500 uppercase">LSPD Tactical Detail</div>
                <div className="text-xl font-mono font-black text-accent-gold">NOOSE TAC-4</div>
                <div className="text-[9px] font-mono text-ink-600">FULL LEVEL-4 AIRSPACE LOCK</div>
              </div>
            </div>

            {/* Evidence Tag */}
            <div className="border-t border-dashed border-ink-900/40 pt-3 flex items-center justify-between text-[11px] font-mono text-ink-700">
              <span className="flex items-center space-x-1">
                <Database className="w-3.5 h-3.5 text-crime-red" />
                <span>CASE IDENT: #LS-NOOSE-9941</span>
              </span>
              <span className="bg-ink-900 text-paper-50 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                PINNED EVIDENCE
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Chapter Scrollable Narrative */}
        <div className="lg:col-span-7 space-y-8">
          {/* Chapter 1 */}
          <div className="bg-paper-50 border-2 border-ink-900 p-6 shadow-newsprint">
            <div className="flex items-center justify-between border-b border-ink-900/20 pb-2 mb-3 text-xs font-mono">
              <span className="font-bold text-crime-red uppercase">CHAPTER I // THE 02:00 HOURS LOCKDOWN</span>
              <span className="text-ink-500">TRANSCRIPT ENTRY #01</span>
            </div>
            <h4 className="text-xl font-serif font-black uppercase text-ink-900 mb-2">
              Sealed Intersections and Silent Transponders
            </h4>
            <p className="font-serif text-sm text-ink-800 leading-relaxed text-justify mb-3">
              At precisely twenty minutes past midnight, three automated signals tripped at the municipal traffic management center on Strawberry Avenue. Traffic lights along Olympic Freeway and Alta Street locked permanently onto green for westbound utility traffic while civilian on-ramps were sealed with magnetic gates.
            </p>
            <p className="font-serif text-sm text-ink-800 leading-relaxed text-justify">
              Emergency responders attempting to answer routine 911 dispatches reported their CAD radios cycling through scrambled error frequencies as high-frequency military jammers blanketed a 1,200-meter radius around the Union Depository courtyard.
            </p>
          </div>

          {/* Chapter 2 */}
          <div className="bg-paper-50 border-2 border-ink-900 p-6 shadow-newsprint">
            <div className="flex items-center justify-between border-b border-ink-900/20 pb-2 mb-3 text-xs font-mono">
              <span className="font-bold text-crime-red uppercase">CHAPTER II // THE CUTTER SPECIFICATIONS</span>
              <span className="text-ink-500">TRANSCRIPT ENTRY #02</span>
            </div>
            <h4 className="text-xl font-serif font-black uppercase text-ink-900 mb-2">
              High-Torque Diamond Drill Bits in Freight Elevator 3
            </h4>
            <p className="font-serif text-sm text-ink-800 leading-relaxed text-justify mb-3">
              Freight manifests stamped by the Port of Los Santos Customs Bureau confirm the arrival of specialized diamond-tipped circular cutters manufactured in Munich, rated for reinforced ballistic granite. The consignee was listed as an anonymous LLC sharing an address with a municipal equipment leasing yard in Murrieta Heights.
            </p>
            <div className="border-l-4 border-crime-red pl-4 py-1 italic font-serif text-sm text-ink-700 my-3">
              "Those cutters don't repair water mains. Those cutters slice through three-inch manganese alloy vault plates like hot wire through butter."
            </div>
          </div>

          {/* Chapter 3 */}
          <div className="bg-paper-50 border-2 border-ink-900 p-6 shadow-newsprint">
            <div className="flex items-center justify-between border-b border-ink-900/20 pb-2 mb-3 text-xs font-mono">
              <span className="font-bold text-crime-red uppercase">CHAPTER III // THE MAYORAL SILENCE</span>
              <span className="text-ink-500">TRANSCRIPT ENTRY #03</span>
            </div>
            <h4 className="text-xl font-serif font-black uppercase text-ink-900 mb-2">
              City Hall Committee Records Redacted In Full
            </h4>
            <p className="font-serif text-sm text-ink-800 leading-relaxed text-justify mb-3">
              When the City Oversight Committee convened in emergency session at 08:00 hours, sixteen pages of the subterranean transit corridor contract had been redacted with black grease pencil under Section 9B executive privilege.
            </p>
            <p className="font-serif text-sm text-ink-800 leading-relaxed text-justify">
              Neither the Director of Public Works nor the Port Authority Commissioner agreed to testify on the record, both citing federal national defense non-disclosure agreements signed under executive oversight.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
