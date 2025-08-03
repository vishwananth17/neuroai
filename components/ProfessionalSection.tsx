'use client';
import { motion } from 'framer-motion';
import { ArrowTopRightOnSquareIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

interface ProfessionalSectionProps {
  type: 'lawyer' | 'doctor' | 'all';
}

export default function ProfessionalSection({ type }: ProfessionalSectionProps) {
  const getSectionData = () => {
    switch (type) {
      case 'lawyer':
        return {
          title: 'Legal Research Hub',
          description: 'AI-powered legal research and case analysis tools',
          papers: [
            {
              id: '1',
              title: 'AI in Contract Analysis: A Comprehensive Review',
              authors: ['Smith, J.', 'Johnson, A.'],
              abstract: 'This paper examines the application of artificial intelligence in contract analysis and legal document review...',
              year: 2024,
              citations: 67,
              category: 'Legal AI'
            },
            {
              id: '2',
              title: 'Machine Learning for Case Outcome Prediction',
              authors: ['Brown, M.', 'Davis, R.'],
              abstract: 'A study on using machine learning algorithms to predict legal case outcomes based on historical data...',
              year: 2024,
              citations: 89,
              category: 'Legal Tech'
            },
            {
              id: '3',
              title: 'Ethical Considerations in AI-Assisted Legal Research',
              authors: ['Wilson, K.', 'Taylor, L.'],
              abstract: 'An analysis of ethical implications and best practices for AI integration in legal research...',
              year: 2023,
              citations: 45,
              category: 'Legal Ethics'
            }
          ]
        };
      case 'doctor':
        return {
          title: 'Medical Research Center',
          description: 'Healthcare and medical research insights powered by AI',
          papers: [
            {
              id: '4',
              title: 'AI in Medical Imaging: Recent Advances and Applications',
              authors: ['Anderson, P.', 'Garcia, M.'],
              abstract: 'A comprehensive review of artificial intelligence applications in medical imaging and diagnosis...',
              year: 2024,
              citations: 156,
              category: 'Medical AI'
            },
            {
              id: '5',
              title: 'Machine Learning for Drug Discovery',
              authors: ['Lee, S.', 'Chen, W.'],
              abstract: 'Exploring the role of machine learning in accelerating drug discovery and development processes...',
              year: 2024,
              citations: 234,
              category: 'Drug Discovery'
            },
            {
              id: '6',
              title: 'AI-Powered Patient Care Systems',
              authors: ['Martinez, A.', 'Thompson, B.'],
              abstract: 'Implementation and evaluation of AI systems for improving patient care and outcomes...',
              year: 2023,
              citations: 78,
              category: 'Patient Care'
            }
          ]
        };
      default:
        return {
          title: 'Research Across All Fields',
          description: 'Comprehensive research insights across all disciplines',
          papers: [
            {
              id: '7',
              title: 'Advances in Neural Network Architecture',
              authors: ['Zhang, L.', 'Kumar, R.'],
              abstract: 'Recent developments in neural network architectures and their applications in various fields...',
              year: 2024,
              citations: 189,
              category: 'AI Research'
            },
            {
              id: '8',
              title: 'Cross-Disciplinary Applications of Machine Learning',
              authors: ['Patel, N.', 'Singh, A.'],
              abstract: 'Exploring how machine learning techniques are being applied across different scientific disciplines...',
              year: 2024,
              citations: 134,
              category: 'ML Applications'
            },
            {
              id: '9',
              title: 'Future of AI in Scientific Research',
              authors: ['White, E.', 'Black, F.'],
              abstract: 'Predictions and analysis of AI\'s role in shaping the future of scientific research...',
              year: 2023,
              citations: 92,
              category: 'AI Future'
            }
          ]
        };
    }
  };

  const sectionData = getSectionData();

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {sectionData.title}
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {sectionData.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectionData.papers.map((paper, index) => (
            <motion.div
              key={paper.id}
              className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
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
      </div>
    </section>
  );
} 