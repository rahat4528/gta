'use client';

import React from 'react';
import Link from 'next/link';
import { Article } from '../../types';
import { Clock, ArrowUpRight } from 'lucide-react';

interface NewsCardProps {
  article: Article;
  featured?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, featured = false }) => {
  return (
    <article
      className={`border-2 border-ink-900 bg-paper-50 p-4 shadow-newsprint flex flex-col justify-between group hover:border-crime-red transition-all ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      <div>
        {/* Category & Timestamp Banner */}
        <div className="flex items-center justify-between text-[11px] font-mono border-b border-ink-900/20 pb-1.5 mb-2.5">
          <span className="font-bold uppercase text-crime-red tracking-wider">
            {article.category.replace('-', ' ')}
          </span>
          <div className="flex items-center space-x-1 text-ink-600">
            <Clock className="w-3 h-3" />
            <span>{article.readTime}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/articles/${article.slug}`} className="block">
          <h3
            className={`font-serif font-black tracking-tight text-ink-900 group-hover:text-crime-darkRed transition-colors leading-tight mb-2 uppercase ${
              featured ? 'text-2xl sm:text-3xl' : 'text-xl'
            }`}
          >
            {article.title}
          </h3>
        </Link>

        {/* Subtitle / Excerpt */}
        <p className="text-xs sm:text-sm font-serif text-ink-700 leading-normal mb-4 line-clamp-3">
          {article.subtitle}
        </p>
      </div>

      {/* Footer Byline */}
      <div className="pt-3 border-t border-dashed border-ink-900/30 flex items-center justify-between text-xs font-mono">
        <span className="text-ink-800 font-bold truncate pr-2">
          BY {article.author.name}
        </span>
        <Link
          href={`/articles/${article.slug}`}
          className="flex items-center space-x-1 text-crime-red font-bold uppercase tracking-wider text-[11px] hover:underline flex-shrink-0"
        >
          <span>Read</span>
          <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  );
};
