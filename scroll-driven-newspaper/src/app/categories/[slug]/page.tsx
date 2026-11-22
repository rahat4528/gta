'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES } from '../../../data/categories';
import { ARTICLES } from '../../../data/articles';
import { Header } from '../../../components/Header/Header';
import { BreakingTicker } from '../../../components/Navigation/BreakingTicker';
import { Navigation } from '../../../components/Navigation/Navigation';
import { NewsGrid } from '../../../components/NewsCards/NewsGrid';
import { Footer } from '../../../components/Footer/Footer';
import { SearchModal } from '../../../components/Search/SearchModal';
import { SubscriptionModal } from '../../../components/Subscription/SubscriptionModal';
import { useLenisScroll } from '../../../hooks/useLenisScroll';
import { ArrowLeft, Tag } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryArchivePage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const category = CATEGORIES.find((c) => c.slug === slug);

  const [reducedMotion, setReducedMotion] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  useLenisScroll(reducedMotion);

  if (!category) {
    notFound();
  }

  const categoryArticles = ARTICLES.filter(
    (a) => a.category === category.id || a.category === category.slug
  );

  return (
    <div className="flex flex-col min-h-screen bg-paper-100 font-serif text-ink-900">
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSubscribe={() => setIsSubscribeOpen(true)}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
      />
      <BreakingTicker />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-10 flex-1 w-full">
        <div className="flex items-center space-x-2 text-xs font-mono mb-6 text-ink-600">
          <Link href="/" className="hover:text-crime-red flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>FRONT PAGE</span>
          </Link>
          <span>/</span>
          <span className="uppercase text-crime-red font-bold">SECTION ARCHIVE</span>
        </div>

        <header className="border-b-4 border-ink-900 pb-4 mb-8">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-crime-red mb-2">
            <Tag className="w-4 h-4" />
            <span>EDITORIAL DESK DISPATCH</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-black uppercase tracking-tight text-ink-900 mb-2">
            Section: {category.name}
          </h1>
          <p className="text-sm font-mono text-ink-700">
            {category.description || `Investigative reporting and field files filed under ${category.name}.`}
          </p>
        </header>

        <NewsGrid
          articles={categoryArticles.length > 0 ? categoryArticles : ARTICLES.slice(0, 4)}
          title={`Stories Filed: ${category.name}`}
        />
      </main>

      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <SubscriptionModal isOpen={isSubscribeOpen} onClose={() => setIsSubscribeOpen(false)} />
    </div>
  );
}
