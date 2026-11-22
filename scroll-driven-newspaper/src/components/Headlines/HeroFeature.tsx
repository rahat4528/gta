'use client';

import React from 'react';
import Link from 'next/link';
import { Article } from '../../types';
import { AnimatedHeadline } from './AnimatedHeadline';
import { Clock, ShieldAlert, ArrowRight, User } from 'lucide-react';

interface HeroFeatureProps {
  article: Article;
  reducedMotion?: boolean;
}

export const HeroFeature: React.FC<HeroFeatureProps> = ({ article, reducedMotion = false }) => {
  return (
    <article className="border-b-4 border-ink-900 pb-8 mb-8">
      {/* Top Kicker & Stamp */}
      <div className="flex items-center justify-between border-b border-ink-900/40 pb-2 mb-4 text-xs font-mono">
        <span className="font-bold text-crime-red uppercase tracking-widest flex items-center space-x-1.5">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{article.kicker}</span>
        </span>
        <span className="text-ink-600 uppercase tracking-wider">{article.edition}</span>
      </div>

      {/* Main Front-Page Mega Headline */}
      <Link href={`/articles/${article.slug}`} className="block group">
        <AnimatedHeadline
          as="h1"
          effect="reveal"
          reducedMotion={reducedMotion}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase text-ink-900 group-hover:text-crime-darkRed transition-colors mb-4"
        >
          {article.title}
        </AnimatedHeadline>
      </Link>

      {/* Deck / Subtitle */}
      <p className="text-lg sm:text-2xl font-serif text-ink-700 leading-snug font-medium mb-6 italic max-w-5xl">
        {article.subtitle}
      </p>

      {/* Hero Layout: Photo & Multi-column Lead Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Full Visual Frame */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="relative border-2 border-ink-900 bg-paper-300 overflow-hidden shadow-newsprint group">
            {/* Newsprint Halftone Pattern Simulation */}
            <div className="aspect-[16/9] w-full bg-gradient-to-tr from-paper-800 via-ink-800 to-paper-900 flex items-center justify-center relative p-6">
              {/* Fallback Graphic Simulation */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="relative z-10 text-center text-paper-100 max-w-md">
                <div className="font-mono text-xs uppercase tracking-widest text-accent-gold mb-2 border-b border-accent-gold/40 pb-1">
                  OFFICIAL EVIDENCE ARCHIVE // NOOSE 04-92
                </div>
                <div className="text-xl sm:text-2xl font-serif font-black tracking-tight uppercase leading-tight mb-2">
                  UNION DEPOSITORY SUB-LEVEL GOLD CONVOY
                </div>
                <div className="text-xs font-serif italic text-paper-200">
                  Six Hundred Metric Tons Of Bullion Inspected Under Classified Federal Security Quarantine
                </div>
              </div>

              {/* Verified Stamp */}
              <div className="absolute bottom-3 right-3 border-2 border-crime-red text-crime-red font-mono text-[10px] font-black px-2 py-0.5 uppercase rotate-[-6deg] bg-paper-100/90 shadow-sm">
                CONFIDENTIAL RECORD
              </div>
            </div>

            <div className="p-3 bg-paper-100 border-t-2 border-ink-900 text-xs font-serif text-ink-700 flex items-start justify-between">
              <span>{article.image.caption}</span>
              <span className="font-mono text-[10px] text-ink-500 uppercase ml-4 flex-shrink-0">
                {article.image.credit}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Broadsheet Columns & Byline */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Byline & Metadata */}
            <div className="flex items-center space-x-3 border-y border-ink-900/30 py-2.5 mb-4 text-xs font-mono">
              <div className="w-8 h-8 rounded-full bg-ink-900 text-paper-50 flex items-center justify-center font-bold font-serif text-sm">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-ink-900 uppercase">{article.author.name}</div>
                <div className="text-ink-600 text-[11px]">{article.author.role}</div>
              </div>
              <div className="flex items-center space-x-1 text-ink-600 text-[11px]">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime}</span>
              </div>
            </div>

            {/* Drop-cap Lead Paragraph */}
            <p className="font-serif text-base text-ink-900 leading-relaxed text-justify mb-4">
              <span className="float-left text-5xl font-black font-serif pr-3 pt-1 text-ink-900 leading-none">
                {article.leadParagraph.charAt(0)}
              </span>
              {article.leadParagraph.slice(1)}
            </p>

            {/* Subsequent paragraph snippet */}
            {article.body[0] && (
              <p className="font-serif text-sm text-ink-800 leading-relaxed text-justify">
                {article.body[0].text}
              </p>
            )}
          </div>

          {/* Read Full Story Button */}
          <div className="mt-6 pt-4 border-t-2 border-dashed border-ink-900/40">
            <Link
              href={`/articles/${article.slug}`}
              className="inline-flex items-center space-x-2 bg-ink-900 text-paper-50 px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-bold rounded shadow-newsprint hover:bg-crime-red transition-all group"
            >
              <span>Continue Reading Investigation</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
