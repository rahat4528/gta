'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTICLES } from '../../../data/articles';
import { Header } from '../../../components/Header/Header';
import { BreakingTicker } from '../../../components/Navigation/BreakingTicker';
import { Navigation } from '../../../components/Navigation/Navigation';
import { Footer } from '../../../components/Footer/Footer';
import { SearchModal } from '../../../components/Search/SearchModal';
import { SubscriptionModal } from '../../../components/Subscription/SubscriptionModal';
import { useLenisScroll } from '../../../hooks/useLenisScroll';
import { ArrowLeft, Clock, ShieldAlert, Printer } from 'lucide-react';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = use(params);
  const article = ARTICLES.find((a) => a.slug === slug);

  const [reducedMotion, setReducedMotion] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  useLenisScroll(reducedMotion);

  if (!article) {
    notFound();
  }

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

      <main className="max-w-4xl mx-auto px-4 py-10 flex-1 w-full">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs font-mono mb-6 text-ink-600">
          <Link href="/" className="hover:text-crime-red flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>FRONT PAGE</span>
          </Link>
          <span>/</span>
          <span className="uppercase text-crime-red font-bold">{article.category}</span>
        </div>

        {/* Headline Header */}
        <header className="border-b-4 border-ink-900 pb-6 mb-8">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-crime-red mb-3">
            <ShieldAlert className="w-4 h-4" />
            <span>{article.kicker}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-black uppercase text-ink-900 leading-tight mb-4">
            {article.title}
          </h1>

          <p className="text-lg sm:text-xl text-ink-700 italic font-serif leading-snug mb-6">
            {article.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-ink-900/30 text-xs font-mono text-ink-600">
            <div>
              <span className="font-bold text-ink-900 uppercase">By {article.author.name}</span>
              <span className="mx-2">•</span>
              <span>{article.date}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime}</span>
              </span>
              <button
                onClick={() => window.print()}
                className="hover:text-crime-red transition-colors flex items-center space-x-1"
                title="Print broadsheet page"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PRINT</span>
              </button>
            </div>
          </div>
        </header>

        {/* Lead Narrative & Pinned Stats */}
        {article.pinnedStats && article.pinnedStats.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-paper-200 border-2 border-ink-900 shadow-newsprint mb-8 font-mono">
            {article.pinnedStats.map((stat, idx) => (
              <div key={idx} className="border-r border-ink-900/20 last:border-r-0 pr-2">
                <div className="text-[10px] text-ink-600 uppercase">{stat.label}</div>
                <div className="text-lg font-black text-ink-900">{stat.value}</div>
                <div className="text-[10px] text-crime-red font-bold">{stat.delta}</div>
              </div>
            ))}
          </div>
        )}

        {/* Article Body */}
        <div className="prose prose-lg max-w-none text-ink-800 leading-relaxed font-serif space-y-6">
          <p className="text-xl font-bold leading-relaxed first-letter:text-5xl first-letter:font-black first-letter:mr-2 first-letter:float-left first-letter:leading-none">
            {article.leadParagraph}
          </p>

          {article.body.map((block, idx) => {
            if (block.type === 'paragraph') {
              return <p key={idx}>{block.text}</p>;
            }
            if (block.type === 'subheading') {
              return (
                <h2
                  key={idx}
                  className="text-2xl font-serif font-black uppercase text-ink-900 pt-6 pb-2 border-b-2 border-ink-900"
                >
                  {block.text}
                </h2>
              );
            }
            if (block.type === 'callout') {
              return (
                <blockquote
                  key={idx}
                  className="p-4 my-6 bg-paper-300 border-l-4 border-crime-red font-mono text-xs text-ink-900 shadow-inner"
                >
                  {block.text}
                </blockquote>
              );
            }
            return null;
          })}
        </div>

        {/* Back Link */}
        <div className="pt-10 mt-12 border-t-2 border-ink-900">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-ink-900 text-paper-50 font-mono text-xs uppercase font-bold hover:bg-crime-red transition-colors shadow-newsprint"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Broadsheet Front Page</span>
          </Link>
        </div>
      </main>

      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <SubscriptionModal isOpen={isSubscribeOpen} onClose={() => setIsSubscribeOpen(false)} />
    </div>
  );
}
