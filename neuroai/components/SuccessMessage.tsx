'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function SuccessMessage() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-20 left-4 right-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 shadow-lg max-w-2xl mx-auto z-40"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            <SparklesIcon className="h-4 w-4 text-green-500 dark:text-green-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-green-900 dark:text-green-100">
              🎉 NeuroAI is Fully Operational!
            </h3>
            <p className="text-xs text-green-800 dark:text-green-200">
              All features are working perfectly. Try searching for research papers or testing the AI capabilities below!
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-200"
        >
          <CheckCircleIcon className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
} 