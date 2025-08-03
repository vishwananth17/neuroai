'use client';
import { motion } from 'framer-motion';
import { ArrowTopRightOnSquareIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

const trendingPapers = [
  {
    id: '1',
    title: 'Advanced Neural Network Architectures for Natural Language Processing',
    authors: ['Zhang, L.', 'Kumar, R.', 'Smith, J.'],
    abstract: 'This paper presents novel neural network architectures that significantly improve performance in natural language processing tasks, achieving state-of-the-art results on multiple benchmarks.',
    year: 2024,
    citations: 234,
    category: 'AI Research'
  },
  {
    id: '2',
    title: 'Machine Learning Applications in Healthcare: A Comprehensive Review',
    authors: ['Anderson, P.', 'Garcia, M.', 'Lee, S.'],
    abstract: 'A thorough analysis of machine learning applications in healthcare, covering diagnostic tools, treatment optimization, and patient care systems.',
    year: 2024,
    citations: 189,
    category: 'Healthcare AI'
  },
  {
    id: '3',
    title: 'AI Ethics and Responsible Development: Current Challenges and Future Directions',
    authors: ['Wilson, K.', 'Taylor, L.', 'Brown, M.'],
    abstract: 'An examination of ethical considerations in AI development, including bias mitigation, transparency, and accountability frameworks.',
    year: 2024,
    citations: 156,
    category: 'AI Ethics'
  },
  {
    id: '4',
    title: 'Quantum Computing and Artificial Intelligence: Synergies and Applications',
    authors: ['Patel, N.', 'Singh, A.', 'White, E.'],
    abstract: 'Exploring the intersection of quantum computing and AI, including quantum machine learning algorithms and their potential applications.',
    year: 2023,
    citations: 134,
    category: 'Quantum AI'
  }
];

export default function TrendingPapers() {
  return (
    <section id="trending" className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trending Papers
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover the most cited and discussed research papers in neuroscience and AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trendingPapers.map((paper, index) => (
            <motion.div
              key={paper.id}
              className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-black">
                    {paper.category}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                  </motion.button>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">
                  {paper.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {paper.abstract}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-400">
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
                    <span className="font-medium text-white">
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
            className="inline-flex items-center px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-lg"
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