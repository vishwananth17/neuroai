'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface SearchResult {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  year: number;
  citations: number;
  url: string;
  tldr?: string | null;
  venue?: string | null;
}

function apiErrorMessage(data: unknown): string {
  if (!data || typeof data !== 'object') return 'Search failed. Please try again.';
  const d = data as Record<string, unknown>;
  const err = d.error;
  if (err && typeof err === 'object' && err !== null && 'message' in err) {
    const e = err as { message?: string; action?: string };
    const base = String(e.message || '');
    const action = e.action ? ` ${e.action}` : '';
    return (base + action).trim() || 'Search failed. Please try again.';
  }
  if (typeof err === 'string') return err;
  return 'Search failed. Please try again.';
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          limit: 10,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(apiErrorMessage(data));
        return;
      }

      if (data.success) {
        setResults(data.data?.papers || []);
      } else {
        setError(apiErrorMessage(data));
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <motion.div
      id="search"
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <motion.div
            className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <MagnifyingGlassIcon className="h-6 w-6 text-[var(--text-muted)]" />
          </motion.div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search papers, topics, authors (e.g. transformer attention GATE)…"
            className="w-full pl-12 pr-24 py-4 text-sm bg-[var(--color-glass)] backdrop-blur-xl border border-[var(--border-glass)] rounded-2xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-glow-cyan)] focus:ring-1 focus:ring-[var(--color-cyan)]/30 transition-all shadow-[var(--glow-indigo-sm)]"
          />

          <motion.button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute inset-y-1.5 right-1.5 px-5 flex items-center rounded-xl bg-[var(--grad-brand)] text-[var(--color-void)] font-semibold text-xs uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSearching ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <SparklesIcon className="h-5 w-5" />
              </motion.div>
            ) : (
              <span>Search</span>
            )}
          </motion.button>
        </div>
      </form>

      {error && (
        <motion.div
          className="mt-4 p-4 rounded-xl border border-[var(--color-rose)]/35 bg-[var(--color-rose)]/10 text-[var(--text-primary)] text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      {results.length > 0 && (
        <motion.div
          className="mt-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-display font-semibold text-[var(--text-star)]">
            {results.length} papers
          </h3>
          {results.map((paper, index) => (
            <motion.div
              key={paper.id}
              className="card p-6 cursor-pointer text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              onClick={() => window.open(paper.url, '_blank')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open(paper.url, '_blank');
                }
              }}
            >
              <h4 className="font-display font-bold text-[var(--text-star)] mb-2 line-clamp-2 hover:text-[var(--color-cyan)] transition-colors">
                {paper.title}
              </h4>
              {paper.tldr && (
                <p className="text-[var(--color-emerald)]/90 text-xs uppercase tracking-widest mb-2 line-clamp-2">
                  {paper.tldr}
                </p>
              )}
              <p className="text-[var(--text-secondary)] text-sm mb-3 line-clamp-3">
                {paper.abstract}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
                <span>
                  {paper.authors?.length
                    ? paper.authors.slice(0, 3).join(', ') +
                      (paper.authors.length > 3 ? '…' : '')
                    : 'Unknown authors'}
                </span>
                <span>{paper.year}</span>
                <span>{paper.citations.toLocaleString()} citations</span>
                {paper.venue && <span className="truncate max-w-[200px]">{paper.venue}</span>}
              </div>
              <div className="mt-3 text-xs text-[var(--color-cyan)]">Open on Semantic Scholar →</div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div
        className="mt-6 flex flex-wrap gap-2 justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
          Try:
        </span>
        {[
          'GATE CSE algorithms',
          'IoT smart agriculture',
          'structural health monitoring',
          'low power VLSI',
        ].map((suggestion, index) => (
          <motion.button
            key={suggestion}
            type="button"
            onClick={() => setQuery(suggestion)}
            className="px-3 py-1.5 text-xs bg-[var(--color-glass)] border border-[var(--border-glass)] text-[var(--text-secondary)] rounded-full hover:border-[var(--border-glow-indigo)] hover:text-[var(--text-primary)] transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.75 + index * 0.05 }}
          >
            {suggestion}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
