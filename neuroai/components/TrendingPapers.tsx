'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowTopRightOnSquareIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

interface TrendingPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  year: number;
  citations: number;
  url: string;
  category: string;
}

export default function TrendingPapers() {
  const [papers, setPapers] = useState<TrendingPaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch('/api/trending?category=artificial%20intelligence&limit=4');
        const json = await res.json();
        if (json.success) {
          setPapers(json.data.papers);
        }
      } catch (err) {
        console.error('Failed to fetch trending papers', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTrending();
  }, []);

  return (
    <section id="trending" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
            Trending Papers
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Fresh picks from Semantic Scholar — useful for lit surveys, internships, and GATE-aligned deep dives
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-1 md:col-span-2 text-center text-gray-500 py-12">
              Loading real-time trending papers...
            </div>
          ) : papers.map((paper, index) => (
            <motion.div
              key={paper.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-black dark:bg-white text-white dark:text-black">
                    {paper.category}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        if (paper.url) window.open(paper.url, '_blank');
                    }}
                    className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                  </motion.button>
                </div>

                <h3 className="text-lg font-semibold text-black dark:text-white mb-3 line-clamp-2">
                  {paper.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {paper.abstract}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      <span className="truncate max-w-[120px]">{paper.authors && paper.authors.length > 0 ? `${paper.authors[0]} et al.` : 'Unknown'}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{paper.year}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-black dark:text-white">
                      {paper.citations} citations
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="inline-flex items-center px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Trending Papers
            <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-2" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
} 