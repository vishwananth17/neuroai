'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching?: boolean;
}

export default function SearchBar({ onSearch, isSearching = false }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const popularSearches = {
    lawyer: ['contract law', 'intellectual property', 'criminal defense', 'civil litigation'],
    doctor: ['clinical trials', 'medical imaging', 'drug discovery', 'patient care'],
    all: ['machine learning', 'artificial intelligence', 'neuroscience', 'data science']
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
            placeholder="Search for research papers, legal cases, medical studies..."
            className="w-full pl-12 pr-20 py-4 text-lg bg-gray-900 border-2 border-gray-700 rounded-2xl focus:border-white focus:outline-none transition-all duration-200 shadow-lg text-white placeholder-gray-400"
          />

          <motion.button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute inset-y-0 right-0 px-6 flex items-center bg-white text-black rounded-r-2xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
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
              <span>Search</span>
            )}
          </motion.button>
        </div>
      </form>

      {/* Search suggestions */}
      <motion.div
        className="mt-4 flex flex-wrap gap-2 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="text-sm text-gray-400">Popular searches:</span>
        {popularSearches.all.map((suggestion, index) => (
          <motion.button
            key={suggestion}
            onClick={() => setQuery(suggestion)}
            className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 transition-colors"
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