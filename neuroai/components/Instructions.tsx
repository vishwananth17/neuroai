'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Instructions() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-4 left-4 right-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 shadow-lg max-w-2xl mx-auto z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              🚀 Your NeuroAI Application is Working!
            </h3>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <p><strong>✅ Search Bar:</strong> Type any research topic and click search to see results</p>
              <p><strong>✅ DeepSeek AI:</strong> Scroll down to test paper summarization, code analysis, and AI chat</p>
              <p><strong>✅ Semantic Scholar:</strong> Access 200M+ research papers and datasets</p>
              <p><strong>✅ Status Indicator:</strong> Check the bottom-right corner for system status</p>
            </div>
            <div className="mt-3 text-xs text-blue-700 dark:text-blue-300">
              <p><strong>💡 Tip:</strong> Try searching for "neural networks" or "machine learning" to see results!</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
} 