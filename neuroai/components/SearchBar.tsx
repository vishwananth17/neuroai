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

      if (data.success) {
        setResults(data.data?.papers || []);
      } else {
        setError(data.error || 'Search failed. Please try again.');
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
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
          </motion.div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for research papers, topics, or authors..."
            className="w-full pl-12 pr-20 py-4 text-lg bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-black dark:focus:border-white focus:outline-none transition-all duration-200 shadow-lg dark:shadow-gray-900/20"
          />
          
          <motion.button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute inset-y-0 right-0 px-6 flex items-center bg-black dark:bg-white text-white dark:text-black rounded-r-2xl hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSearching ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <SparklesIcon className="h-5 w-5" />
              </motion.div>
            ) : (
              <span className="font-medium">Search</span>
            )}
          </motion.button>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <motion.div
          className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <motion.div
          className="mt-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Found {results.length} papers
          </h3>
          {results.map((paper, index) => (
                         <motion.div
               key={paper.id}
               className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.1 }}
               onClick={() => window.open(paper.url, '_blank')}
             >
               <h4 className="font-semibold text-black dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                 {paper.title}
               </h4>
               <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                 {paper.abstract}
               </p>
               <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                 <span>Authors: {paper.authors.join(', ')}</span>
                 <span>Year: {paper.year}</span>
                 <span>Citations: {paper.citations.toLocaleString()}</span>
               </div>
               <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                 Click to view paper →
               </div>
             </motion.div>
          ))}
        </motion.div>
      )}

      {/* Search suggestions */}
      <motion.div 
        className="mt-4 flex flex-wrap gap-2 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="text-sm text-gray-500 dark:text-gray-400">Popular searches:</span>
        {['neural networks', 'machine learning', 'deep learning', 'AI ethics'].map((suggestion, index) => (
          <motion.button
            key={suggestion}
            onClick={() => setQuery(suggestion)}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
          >
            {suggestion}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
} 