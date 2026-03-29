'use client';

import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header 
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <motion.h1 
          className="text-4xl font-bold text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          NeuroAI
        </motion.h1>
        <motion.p 
          className="text-xl text-center mt-2 opacity-90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          AI-powered research assistant
        </motion.p>
      </div>
    </motion.header>
  );
} 