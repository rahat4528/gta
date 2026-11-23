'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ARTICLES } from '../../data/articles';
import { Search, X, Clock } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredArticles = query.trim()
    ? ARTICLES.filter(
        (art) =>
          art.title.toLowerCase().includes(query.toLowerCase()) ||
          art.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          art.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
          art.category.toLowerCase().includes(query.toLowerCase())
      )
    : ARTICLES.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-ink-900/80 backdrop-blur-sm select-none">
      <div className="bg-paper-100 border-4 border-ink-900 max-w-2xl w-full p-6 shadow-newsprint-lg relative text-ink-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-paper-300 rounded border border-ink-900 text-ink-900"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 border-b-2 border-ink-900 pb-3 mb-4">
          <Search className="w-5 h-5 text-crime-red" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news archives, cartels, public contracts, scandals..."
            className="w-full bg-transparent text-lg font-serif font-bold text-ink-900 placeholder:text-ink-400 focus:outline-none"
          />
        </div>

        <div className="text-[10px] font-mono uppercase text-ink-600 mb-3 flex items-center justify-between">
          <span>{query ? `Results for "${query}" (${filteredArticles.length})` : 'Recent Front Page Stories'}</span>
          <span className="hidden sm:inline">ESC to close</span>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-8 text-sm font-serif italic text-ink-600">
              No matching dispatches found in the chronicle archives.
            </div>
          ) : (
            filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                onClick={onClose}
                className="block p-3 border border-ink-900/30 bg-paper-50 hover:border-crime-red hover:bg-paper-200 transition-colors group"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-crime-red uppercase font-bold mb-1">
                  <span>{article.category.replace('-', ' ')}</span>
                  <div className="flex items-center space-x-1 text-ink-500">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
                <h4 className="text-base font-serif font-black uppercase text-ink-900 group-hover:text-crime-darkRed transition-colors leading-tight">
                  {article.title}
                </h4>
                <p className="text-xs font-serif text-ink-700 line-clamp-1 mt-1">
                  {article.subtitle}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
