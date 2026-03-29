'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import TrendingPapers from '@/components/TrendingPapers';
import SemanticScholarDatasets from '@/components/SemanticScholarDatasets';
import DeepSeekDemo from '@/components/DeepSeekDemo';

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-black dark:text-white mb-6">
                Discover Research with{' '}
                <span className="bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  AI
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Search through millions of research papers, get AI-powered insights, and stay updated with the latest breakthroughs in neuroscience and artificial intelligence.
              </p>
            </motion.div>

            {/* Search Section */}
            <motion.div 
              id="search" 
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <SearchBar />
            </motion.div>

            {/* Features Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div 
                className="text-center p-6"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                  Smart Search
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Find relevant papers using advanced AI-powered search algorithms
                </p>
              </motion.div>

              <motion.div 
                className="text-center p-6"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                  AI Insights
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get intelligent summaries and key insights from research papers
                </p>
              </motion.div>

              <motion.div 
                className="text-center p-6"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                  Trending Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Discover the latest trends and most cited papers in your field
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trending Papers Section */}
      <TrendingPapers />

      {/* Semantic Scholar Datasets Section */}
      <SemanticScholarDatasets />

      {/* DeepSeek AI Integration Section */}
      <DeepSeekDemo />

      {/* About Section */}
      <section id="about" className="py-16 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-6">
              About NeuroAI
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              NeuroAI is your intelligent research companion, designed to help researchers, students, and AI enthusiasts discover, understand, and stay current with the latest developments in neuroscience and artificial intelligence. Our platform combines the power of AI with comprehensive access to research databases to provide you with the most relevant and up-to-date information.
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Done by Vishwananth B
            </div>
          </motion.div>
        </div>
      </section>
      
      </main>
  );
}
