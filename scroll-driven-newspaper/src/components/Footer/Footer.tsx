'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '../../data/categories';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-paper-200 border-t-4 border-ink-900 text-ink-900 pt-12 pb-8 mt-20 select-none">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Colophon & Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b-2 border-ink-900">
          <div className="md:col-span-2">
            <h3 className="text-3xl font-serif font-black uppercase tracking-tight mb-2">
              The Los Santos Chronicle
            </h3>
            <p className="text-xs font-serif text-ink-700 max-w-md leading-relaxed mb-4">
              Published continuously since 1904. Printing presses operating round the clock at 1200 Vinewood Blvd, Los Santos, SA. Registered as a broadsheet publication under San Andreas Press Bureau Regulation #440-A.
            </p>
            <div className="font-mono text-[10px] text-ink-600 uppercase">
              Member: Associated Press of San Andreas • Reuters Teletype Bureau
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase font-bold tracking-wider mb-3 border-b border-ink-900 pb-1">
              Sections
            </h4>
            <ul className="space-y-1.5 text-xs font-serif">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="hover:text-crime-red transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase font-bold tracking-wider mb-3 border-b border-ink-900 pb-1">
              Editorial Board
            </h4>
            <div className="space-y-2 text-xs font-serif text-ink-700">
              <div>
                <span className="font-bold">Chester Callahan</span> — Chief Editor
              </div>
              <div>
                <span className="font-bold">Marjorie Vance</span> — Civic Affairs
              </div>
              <div>
                <span className="font-bold">Cruz Morales</span> — Culture & Nightlife
              </div>
              <div>
                <span className="font-bold">Brock Henderson</span> — Sports Desk
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Return to Top */}
        <div className="pt-6 flex flex-wrap items-center justify-between text-[11px] font-mono text-ink-600">
          <div>
            © 2026 The Los Santos Chronicle Publishing Co. All Rights Reserved.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 font-bold uppercase hover:text-crime-red transition-colors p-1 border border-ink-900/30 rounded"
          >
            <span>Return To Top Of Broadsheet</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
