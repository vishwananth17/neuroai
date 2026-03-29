'use client';

import { motion } from 'framer-motion';
import { ArrowTopRightOnSquareIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

// Sample trending papers data
const trendingPapers = [
  {
    id: 1,
    title: "Attention Is All You Need: The Transformer Architecture Revolution",
    authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar"],
    year: 2023,
    citations: 1250,
    abstract: "We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely...",
    category: "Machine Learning"
  },
  {
    id: 2,
    title: "Deep Learning for Neural Network Interpretability",
    authors: ["Sarah Chen", "Michael Rodriguez", "Emily Zhang"],
    year: 2023,
    citations: 890,
    abstract: "This paper presents novel approaches to understanding and interpreting deep neural networks through visualization and analysis techniques...",
    category: "Neuroscience"
  },
  {
    id: 3,
    title: "Quantum Computing in AI: A Comprehensive Survey",
    authors: ["David Kim", "Lisa Wang", "James Thompson"],
    year: 2023,
    citations: 567,
    abstract: "We survey the current state of quantum computing applications in artificial intelligence and machine learning...",
    category: "Quantum AI"
  },
  {
    id: 4,
    title: "Ethical AI: Principles and Implementation",
    authors: ["Maria Garcia", "Robert Johnson", "Anna Lee"],
    year: 2023,
    citations: 432,
    abstract: "This paper discusses the fundamental principles of ethical AI and provides practical guidelines for implementation...",
    category: "AI Ethics"
  }
];

export default function TrendingPapers() {
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
            Discover the most cited and discussed research papers in neuroscience and AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {trendingPapers.map((paper, index) => (
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
                      <span>{paper.authors[0]} et al.</span>
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