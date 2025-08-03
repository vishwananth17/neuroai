'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, TrendingUpIcon, TrendingDownIcon, MinusIcon } from '@heroicons/react/24/outline';

interface TrendAnalysisProps {
  category: 'lawyer' | 'doctor' | 'all';
  onClose: () => void;
}

export default function TrendAnalysis({ category, onClose }: TrendAnalysisProps) {
  const getTrendData = () => {
    switch (category) {
      case 'lawyer':
        return {
          title: 'Legal Research Trends',
          description: 'Current trends in legal AI and research',
          trends: [
            { name: 'AI Contract Analysis', change: '+45%', direction: 'up', description: 'Rapid adoption in legal firms' },
            { name: 'Case Prediction Models', change: '+32%', direction: 'up', description: 'Growing interest in outcome prediction' },
            { name: 'Document Automation', change: '+28%', direction: 'up', description: 'Streamlining legal workflows' },
            { name: 'Ethical AI Guidelines', change: '+15%', direction: 'up', description: 'Focus on responsible AI use' }
          ],
          topTopics: ['Contract Analysis', 'Legal Tech', 'AI Ethics', 'Case Prediction', 'Document Review']
        };
      case 'doctor':
        return {
          title: 'Medical Research Trends',
          description: 'Healthcare and medical AI trends',
          trends: [
            { name: 'Medical Imaging AI', change: '+67%', direction: 'up', description: 'Breakthrough in diagnostic accuracy' },
            { name: 'Drug Discovery ML', change: '+54%', direction: 'up', description: 'Accelerating pharmaceutical research' },
            { name: 'Patient Care Systems', change: '+41%', direction: 'up', description: 'Improving healthcare outcomes' },
            { name: 'Telemedicine AI', change: '+23%', direction: 'up', description: 'Remote healthcare solutions' }
          ],
          topTopics: ['Medical Imaging', 'Drug Discovery', 'Patient Care', 'Telemedicine', 'Clinical Trials']
        };
      default:
        return {
          title: 'General Research Trends',
          description: 'Cross-disciplinary AI research trends',
          trends: [
            { name: 'Neural Networks', change: '+52%', direction: 'up', description: 'Advanced architecture developments' },
            { name: 'Machine Learning', change: '+38%', direction: 'up', description: 'Widespread adoption across fields' },
            { name: 'AI Ethics', change: '+25%', direction: 'up', description: 'Focus on responsible development' },
            { name: 'Quantum AI', change: '+18%', direction: 'up', description: 'Emerging quantum computing applications' }
          ],
          topTopics: ['Neural Networks', 'Machine Learning', 'AI Ethics', 'Quantum Computing', 'Robotics']
        };
    }
  };

  const trendData = getTrendData();

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUpIcon className="h-5 w-5 text-green-400" />;
      case 'down':
        return <TrendingDownIcon className="h-5 w-5 text-red-400" />;
      default:
        return <MinusIcon className="h-5 w-5 text-gray-400" />;
    }
  };

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
          className="bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">📊 Trend Analysis</h2>
              <p className="text-gray-300 mt-1">{trendData.description}</p>
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
            {/* Trends Overview */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-6">Research Trends</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trendData.trends.map((trend, index) => (
                  <motion.div
                    key={trend.name}
                    className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">{trend.name}</h4>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(trend.direction)}
                        <span className={`font-bold ${
                          trend.direction === 'up' ? 'text-green-400' : 
                          trend.direction === 'down' ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {trend.change}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">{trend.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Top Topics */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Top Research Topics</h3>
              <div className="flex flex-wrap gap-3">
                {trendData.topTopics.map((topic, index) => (
                  <motion.span
                    key={topic}
                    className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {topic}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-3xl font-bold text-white mb-2">2,847</div>
                <div className="text-gray-300 text-sm">Papers Published</div>
              </motion.div>
              <motion.div
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-3xl font-bold text-white mb-2">156K</div>
                <div className="text-gray-300 text-sm">Total Citations</div>
              </motion.div>
              <motion.div
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-3xl font-bold text-white mb-2">89%</div>
                <div className="text-gray-300 text-sm">Growth Rate</div>
              </motion.div>
            </div>

            {/* Chart Placeholder */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Research Growth Over Time</h3>
              <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
                <div className="flex items-center justify-center h-48">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📈</div>
                    <p className="text-gray-300">Interactive chart showing research growth trends</p>
                    <p className="text-gray-400 text-sm mt-2">Chart visualization would be implemented here</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-6 border-t border-gray-700">
              <motion.button
                className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download Report
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