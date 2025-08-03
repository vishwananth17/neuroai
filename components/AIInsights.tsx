'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, LightBulbIcon, ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface AIInsightsProps {
  searchResults: any[];
  onClose: () => void;
}

export default function AIInsights({ searchResults, onClose }: AIInsightsProps) {
  const insights = [
    {
      type: 'key-findings',
      title: 'Key Findings',
      icon: LightBulbIcon,
      content: 'The research shows significant advancements in AI applications across multiple domains, with particular emphasis on practical implementations and real-world impact.'
    },
    {
      type: 'trends',
      title: 'Emerging Trends',
      icon: ChartBarIcon,
      content: 'Machine learning adoption is accelerating in professional fields, with legal and medical sectors showing the highest growth rates in AI integration.'
    },
    {
      type: 'recommendations',
      title: 'AI Recommendations',
      icon: DocumentTextIcon,
      content: 'Consider exploring interdisciplinary approaches and focusing on ethical AI implementation for maximum impact in your research area.'
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">🧠 AI Insights</h2>
              <p className="text-gray-300 mt-1">Intelligent analysis of your search results</p>
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Search Results Summary */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Search Results Summary</h3>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-gray-300">
                  Found <span className="text-white font-semibold">{searchResults.length}</span> relevant papers
                  {searchResults.length > 0 && (
                    <span className="text-gray-300">
                      , with an average of{' '}
                      <span className="text-white font-semibold">
                        {Math.round(searchResults.reduce((acc, paper) => acc + (paper.citations || 0), 0) / searchResults.length)}
                      </span>{' '}
                      citations per paper.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* AI Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {insights.map((insight, index) => (
                <motion.div
                  key={insight.type}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-white rounded-lg mr-3">
                      <insight.icon className="h-6 w-6 text-black" />
                    </div>
                    <h4 className="text-lg font-semibold text-white">{insight.title}</h4>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {insight.content}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Top Papers */}
            {searchResults.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Top Papers from Search</h3>
                <div className="space-y-4">
                  {searchResults.slice(0, 3).map((paper, index) => (
                    <motion.div
                      key={paper.id}
                      className="bg-gray-800 rounded-xl p-4 border border-gray-700"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-white font-medium mb-2">{paper.title}</h4>
                          <p className="text-gray-300 text-sm mb-2">
                            {paper.authors?.join(', ') || 'Unknown Authors'}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-400">
                            <span>{paper.year}</span>
                            <span>{paper.citations} citations</span>
                            <span className="bg-white text-black px-2 py-1 rounded-full text-xs">
                              {paper.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-8 pt-6 border-t border-gray-700">
              <motion.button
                className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Export Insights
              </motion.button>
              <motion.button
                className="px-6 py-3 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
              >
                Close
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 