import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Scroll-Driven Newspaper - Editorial Engine & Architecture', () => {
  const MOCK_ARTICLES = [
    { id: '1', slug: 'union-depository', title: 'Union Depository Audit', category: 'front-page', isFeatured: true },
    { id: '2', slug: 'cranley-transit', title: 'Cranley Mass Transit', category: 'municipal', isFeatured: false },
    { id: '3', slug: 'del-perro-surge', title: 'Del Perro Power Surge', category: 'crime', isFeatured: false },
    { id: '4', slug: 'pillbox-health', title: 'Pillbox Hill Medical Centre', category: 'investigations', isFeatured: false },
  ];

  it('filters articles by category slug with fallback to broadsheet catalog', () => {
    function getArticlesByCategory(categorySlug) {
      if (!categorySlug || categorySlug === 'front-page') {
        return MOCK_ARTICLES;
      }
      return MOCK_ARTICLES.filter((a) => a.category === categorySlug);
    }

    assert.equal(getArticlesByCategory('front-page').length, 4);
    assert.equal(getArticlesByCategory('municipal').length, 1);
    assert.equal(getArticlesByCategory('crime')[0].slug, 'del-perro-surge');
    assert.equal(getArticlesByCategory('non-existent').length, 0);
  });

  it('calculates rotating breaking ticker index cyclically', () => {
    const TICKER_COUNT = 5;

    function getNextTickerIndex(currentIndex) {
      return (currentIndex + 1) % TICKER_COUNT;
    }

    assert.equal(getNextTickerIndex(0), 1);
    assert.equal(getNextTickerIndex(3), 4);
    assert.equal(getNextTickerIndex(4), 0, 'Ticker must wrap around to index 0');
  });

  it('validates article reading time and pinned statistical indicators', () => {
    const article = {
      title: 'High-Level Wiretaps',
      pinnedStats: [
        { label: 'Signal Bandwidth', value: '4.8 GHz', delta: '+12% variance' },
        { label: 'NOOSE Intercepts', value: '142', delta: 'Active' },
      ],
      leadParagraph: 'Federal agents in unmarked surveillance vans intercepted cellular broadcasts...',
    };

    assert.ok(article.pinnedStats.length >= 2);
    assert.equal(article.pinnedStats[0].value, '4.8 GHz');
    assert.ok(article.leadParagraph.length > 20);
  });

  it('handles reduced-motion state transitions cleanly for accessibility', () => {
    let reducedMotion = false;
    let lenisAlive = true;

    function toggleReducedMotion() {
      reducedMotion = !reducedMotion;
      if (reducedMotion) {
        // Accessibility trigger: teardown smooth physics and pins
        lenisAlive = false;
      } else {
        lenisAlive = true;
      }
      return { reducedMotion, lenisAlive };
    }

    const state1 = toggleReducedMotion();
    assert.equal(state1.reducedMotion, true);
    assert.equal(state1.lenisAlive, false, 'Smooth scroll engine must be destroyed in reduced motion');

    const state2 = toggleReducedMotion();
    assert.equal(state2.reducedMotion, false);
    assert.equal(state2.lenisAlive, true, 'Smooth scroll re-enables when motion enabled');
  });
});
