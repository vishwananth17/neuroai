'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import TrendingPapers from '@/components/TrendingPapers';
import ProfessionalSection from '@/components/ProfessionalSection';
import AIInsights from '@/components/AIInsights';
import TrendAnalysis from '@/components/TrendAnalysis';

type ProfessionalType = 'lawyer' | 'doctor' | 'all';

export default function Home() {
  const [activeSection, setActiveSection] = useState<ProfessionalType>('all');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showTrends, setShowTrends] = useState(false);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, category: activeSection })
      });
      const data = await response.json();
      setSearchResults(data.results || []);
      setShowInsights(true);
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to mock data for demo
      setSearchResults([
        {
          id: '1',
          title: 'Advanced AI Applications in Legal Research',
          authors: ['Smith, J.', 'Johnson, A.'],
          abstract: 'This paper explores the integration of artificial intelligence in legal research methodologies...',
          year: 2024,
          citations: 45,
          category: activeSection === 'lawyer' ? 'Legal AI' : 'AI Research'
        }
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  const professionalSections = [
    { id: 'lawyer', title: 'Legal Research', icon: '⚖️', description: 'AI-powered legal research and case analysis' },
    { id: 'doctor', title: 'Medical Research', icon: '🏥', description: 'Healthcare and medical research insights' },
    { id: 'all', title: 'All Fields', icon: '🔬', description: 'Comprehensive research across all disciplines' }
  ];

  return (
    <main className="min-h-screen bg-black text-white">
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
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Discover Research with{' '}
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  AI
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Professional research platform powered by AI for lawyers, doctors, and researchers.
              </p>
            </motion.div>

            {/* Professional Sections */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {professionalSections.map((section) => (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as ProfessionalType)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-white text-black shadow-lg'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-2xl mr-2">{section.icon}</span>
                    {section.title}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Search Section */}
            <motion.div
              id="search"
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <SearchBar onSearch={handleSearch} isSearching={isSearching} />
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                onClick={() => setShowInsights(!showInsights)}
                className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🧠 AI Insights
              </motion.button>
              <motion.button
                onClick={() => setShowTrends(!showTrends)}
                className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📊 Trend Analysis
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Professional Section Content */}
      <ProfessionalSection type={activeSection} />

      {/* AI Insights */}
      {showInsights && (
        <AIInsights 
          searchResults={searchResults} 
          onClose={() => setShowInsights(false)} 
        />
      )}

      {/* Trend Analysis */}
      {showTrends && (
        <TrendAnalysis 
          category={activeSection} 
          onClose={() => setShowTrends(false)} 
        />
      )}

      {/* Trending Papers Section */}
      <TrendingPapers />

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              About NeuroAI
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              NeuroAI is your intelligent research companion, designed to help researchers, lawyers, doctors, and AI enthusiasts discover, understand, and stay current with the latest developments in their respective fields.
            </p>
            <div className="text-sm text-gray-400">
              Done by Vishwananth B
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 