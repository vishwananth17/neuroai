'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch (simplified version for SSR)
  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                NeuroAI
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-gray-800">
                <Bars3Icon className="h-5 w-5 text-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <motion.nav
      className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-gray-800 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              NeuroAI
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#search" className="text-white hover:text-gray-300 transition-colors">
              Search
            </a>
            <a href="#trending" className="text-white hover:text-gray-300 transition-colors">
              Trending
            </a>
            <a href="#about" className="text-white hover:text-gray-300 transition-colors">
              About
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-5 w-5 text-white" />
              ) : (
                <Bars3Icon className="h-5 w-5 text-white" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-800">
                <a
                  href="#search"
                  className="block px-3 py-2 text-white hover:text-gray-300 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Search
                </a>
                <a
                  href="#trending"
                  className="block px-3 py-2 text-white hover:text-gray-300 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Trending
                </a>
                <a
                  href="#about"
                  className="block px-3 py-2 text-white hover:text-gray-300 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
} 