'use client';

import React, { useState } from 'react';
import { useLenisScroll } from '../hooks/useLenisScroll';
import { Header } from '../components/Header/Header';
import { BreakingTicker } from '../components/Navigation/BreakingTicker';
import { Navigation } from '../components/Navigation/Navigation';
import { HeroFeature } from '../components/Headlines/HeroFeature';
import { PinnedInvestigative } from '../components/EditorialSections/PinnedInvestigative';
import { LayeredParallaxSection } from '../components/Parallax/LayeredParallaxSection';
import { NewsGrid } from '../components/NewsCards/NewsGrid';
import { Footer } from '../components/Footer/Footer';
import { SearchModal } from '../components/Search/SearchModal';
import { SubscriptionModal } from '../components/Subscription/SubscriptionModal';
import { ARTICLES } from '../data/articles';

export default function NewspaperHomePage() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  // Initialize smooth scroll physics and link with GSAP ScrollTrigger
  useLenisScroll(reducedMotion);

  const heroArticle = ARTICLES.find((a) => a.isFeatured) || ARTICLES[0];
  const gridArticles = ARTICLES.filter((a) => a.id !== heroArticle.id);

  return (
    <div className="flex flex-col min-h-screen bg-paper-100 font-serif text-ink-900">
      {/* Newspaper Header with date, weather, reduced motion toggle */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSubscribe={() => setIsSubscribeOpen(true)}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
      />

      {/* Real-time Urgent Breaking News Bar */}
      <BreakingTicker />

      {/* Sticky Broadsheet Section Navigation */}
      <Navigation />

      {/* Main Front Page Content Container */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Front-Page Hero Investigative Lead */}
        {heroArticle && (
          <HeroFeature
            article={heroArticle}
            reducedMotion={reducedMotion}
          />
        )}

        {/* Pinned Split-Screen Evidence Dossier (ScrollTrigger pin effect) */}
        <PinnedInvestigative reducedMotion={reducedMotion} />

        {/* Layered Multiplane Parallax Skyline & Wiretap Intercept */}
        <LayeredParallaxSection reducedMotion={reducedMotion} />

        {/* Metropolitan Editorial Stories & Investigations Grid */}
        <NewsGrid articles={gridArticles} />
      </main>

      {/* Broadsheet Colophon & Footer */}
      <Footer />

      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <SubscriptionModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
      />
    </div>
  );
}
