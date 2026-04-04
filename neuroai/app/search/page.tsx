'use client';

import { useState, useEffect, FormEvent, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SearchBar from '@/components/SearchBar';

interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  externalIds?: {
    PaperId?: string;
    ArxivId?: string;
    DOI?: string;
  };
  fieldsOfStudy?: string[];
  venue?: string;
}

interface SearchResponse {
  papers: Paper[];
  total: number;
  error?: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(!!initialQuery);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  // Fetch results when query changes
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/papers/search?q=${encodeURIComponent(searchQuery)}`);
      const data: SearchResponse = await response.json();

      if (!response.ok) {
        setError(data.error || 'Search failed. Please try again.');
        setResults([]);
        return;
      }

      setResults(data.papers || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performSearch(query);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse duration-7000" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse duration-7000 animation-delay-2000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">NeuroAI</h1>
              <span className="text-sm text-slate-400">Research Papers</span>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-sm text-slate-300 hover:text-white transition"
            >
              Home
            </Link>
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search research papers..."
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </header>

      {/* Main content */}
      <div className="relative max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-500/15 border border-red-500/30 rounded-lg text-red-200"
          >
            {error}
          </motion.div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="p-6 bg-white/5 border border-white/10 rounded-lg animate-pulse"
              >
                <div className="h-6 bg-white/10 rounded w-3/4 mb-3" />
                <div className="h-4 bg-white/10 rounded w-full mb-2" />
                <div className="h-4 bg-white/10 rounded w-5/6" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && results.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {query ? 'No papers found' : 'Start searching'}
            </h2>
            <p className="text-slate-400 mb-8">
              {query
                ? `Try different keywords or browse recent papers`
                : `Enter a search query above to find research papers`}
            </p>
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setResults([]);
                  setError('');
                }}
                className="px-4 py-2 text-indigo-300 hover:text-indigo-200 transition"
              >
                ← Clear search
              </button>
            )}
          </motion.div>
        )}

        {/* Results grid */}
        {!loading && results.length > 0 && (
          <>
            <motion.div
              className="mb-6 text-sm text-slate-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Found {total} {total === 1 ? 'paper' : 'papers'}
            </motion.div>

            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {results.map((paper) => (
                <motion.div
                  key={paper.id}
                  variants={itemVariants}
                  className="group"
                >
                  <Link href={`/paper/${paper.id}`}>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition cursor-pointer">
                      {/* Title */}
                      <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition mb-2 line-clamp-2">
                        {paper.title}
                      </h3>

                      {/* Authors */}
                      <p className="text-sm text-slate-400 mb-3">
                        {paper.authors?.slice(0, 3).join(', ')}
                        {paper.authors && paper.authors.length > 3 && ` +${paper.authors.length - 3}`}
                      </p>

                      {/* Abstract preview */}
                      <p className="text-sm text-slate-300 line-clamp-2 mb-4">
                        {paper.abstract}
                      </p>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-3 items-center">
                        {paper.year && (
                          <span className="px-2 py-1 text-xs bg-indigo-500/20 text-indigo-300 rounded">
                            {paper.year}
                          </span>
                        )}
                        {paper.venue && (
                          <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded">
                            {paper.venue}
                          </span>
                        )}
                        {paper.fieldsOfStudy && paper.fieldsOfStudy.length > 0 && (
                          <span className="text-xs text-slate-400">
                            {paper.fieldsOfStudy.slice(0, 2).join(' • ')}
                          </span>
                        )}
                      </div>

                      {/* Action hint */}
                      <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-400 group-hover:text-indigo-300 transition">
                        View details →
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
      <SearchContent />
    </Suspense>
  );
}
