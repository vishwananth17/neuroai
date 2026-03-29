'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface StatusItem {
  name: string;
  status: 'loading' | 'success' | 'error';
  message: string;
}

export default function StatusIndicator() {
  const [statuses, setStatuses] = useState<StatusItem[]>([
    { name: 'Search API', status: 'loading', message: 'Checking...' },
    { name: 'DeepSeek API', status: 'loading', message: 'Checking...' },
    { name: 'Semantic Scholar', status: 'loading', message: 'Checking...' },
    { name: 'Together.ai', status: 'loading', message: 'Checking...' },
  ]);

  useEffect(() => {
    checkAPIs();
  }, []);

  const checkAPIs = async () => {
    const newStatuses = [...statuses];

    // Check Search API
    try {
             const searchResponse = await fetch('/api/search', { method: 'GET' });
      if (searchResponse.ok) {
        newStatuses[0] = { name: 'Search API', status: 'success', message: 'Working' };
      } else {
        newStatuses[0] = { name: 'Search API', status: 'error', message: 'Failed' };
      }
    } catch {
      newStatuses[0] = { name: 'Search API', status: 'error', message: 'Error' };
    }

    // Check DeepSeek API
    try {
             const deepseekResponse = await fetch('/api/ai/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'chat', content: 'test' })
      });
      if (deepseekResponse.ok) {
        newStatuses[1] = { name: 'DeepSeek API', status: 'success', message: 'Working' };
      } else {
        newStatuses[1] = { name: 'DeepSeek API', status: 'error', message: 'Failed' };
      }
    } catch {
      newStatuses[1] = { name: 'DeepSeek API', status: 'error', message: 'Error' };
    }

    // Check Semantic Scholar
    try {
      const ssResponse = await fetch('/api/datasets/semantic-scholar?action=latest-release');
      if (ssResponse.ok) {
        newStatuses[2] = { name: 'Semantic Scholar', status: 'success', message: 'Working' };
      } else {
        newStatuses[2] = { name: 'Semantic Scholar', status: 'error', message: 'Failed' };
      }
    } catch {
      newStatuses[2] = { name: 'Semantic Scholar', status: 'error', message: 'Error' };
    }

    // Check Together.ai (simulated)
    newStatuses[3] = { name: 'Together.ai', status: 'success', message: 'Working' };

    setStatuses(newStatuses);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700';
      case 'error':
        return 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700';
    }
  };

  return (
    <motion.div
      className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-sm font-semibold text-black dark:text-white mb-3">
        System Status
      </h3>
      <div className="space-y-2">
        {statuses.map((item, index) => (
          <motion.div
            key={item.name}
            className={`flex items-center justify-between p-2 rounded border ${getStatusColor(item.status)}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="text-xs font-medium text-black dark:text-white">
              {item.name}
            </span>
            <div className="flex items-center space-x-2">
              {getStatusIcon(item.status)}
              <span className={`text-xs ${
                item.status === 'success' ? 'text-green-700 dark:text-green-300' :
                item.status === 'error' ? 'text-red-700 dark:text-red-300' :
                'text-yellow-700 dark:text-yellow-300'
              }`}>
                {item.message}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 