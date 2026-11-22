'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORIES } from '../../data/categories';

export const Navigation: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 w-full bg-paper-100 border-y-2 border-ink-900 shadow-newsprint select-none">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto scrollbar-none py-1.5 text-xs font-serif uppercase tracking-widest font-bold">
        <div className="flex items-center space-x-1 sm:space-x-3 min-w-max">
          <Link
            href="/"
            className={`px-2.5 py-1 rounded transition-colors ${
              pathname === '/'
                ? 'bg-ink-900 text-paper-50 shadow-inner'
                : 'text-ink-900 hover:bg-paper-200 hover:text-crime-red'
            }`}
          >
            Front Page
          </Link>

          {CATEGORIES.filter((c) => c.id !== 'front-page').map((category) => {
            const href = `/categories/${category.slug}`;
            const isActive = pathname === href;

            return (
              <Link
                key={category.id}
                href={href}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-ink-900 text-paper-50 shadow-inner'
                    : 'text-ink-800 hover:bg-paper-200 hover:text-crime-red'
                }`}
              >
                {category.name}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center space-x-2 text-[10px] font-mono text-ink-600 pl-4 border-l border-ink-900/30">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>PRESS ROOM LIVE</span>
        </div>
      </div>
    </nav>
  );
};
