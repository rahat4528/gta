'use client';

import React from 'react';
import { Article } from '../../types';
import { NewsCard } from './NewsCard';
import { Newspaper } from 'lucide-react';

interface NewsGridProps {
  articles: Article[];
  title?: string;
}

export const NewsGrid: React.FC<NewsGridProps> = ({
  articles,
  title = 'Metropolitan Dispatches & Investigations',
}) => {
  return (
    <section className="my-10">
      <div className="flex items-center justify-between border-b-2 border-ink-900 pb-2 mb-6">
        <div className="flex items-center space-x-2">
          <Newspaper className="w-5 h-5 text-crime-red" />
          <h2 className="text-xl sm:text-2xl font-serif font-black uppercase tracking-tight text-ink-900">
            {title}
          </h2>
        </div>
        <span className="text-xs font-mono text-ink-600 uppercase hidden sm:inline">
          {articles.length} Stories Filed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, idx) => (
          <NewsCard
            key={article.id}
            article={article}
            featured={idx === 0}
          />
        ))}
      </div>
    </section>
  );
};
