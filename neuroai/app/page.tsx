'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import TrendingPapers from '@/components/TrendingPapers';
import SemanticScholarDatasets from '@/components/SemanticScholarDatasets';
import DeepSeekDemo from '@/components/DeepSeekDemo';

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050508] text-[#F0F0FF] overflow-hidden selection:bg-[#6C63FF] selection:text-white font-sans">
      
      {/* Background Glowing Orbs */}
      <motion.div 
        className="glow-orb-primary top-[-10%] left-[10%]"
        animate={{ x: mousePos.x * -2, y: mousePos.y * -2 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />
      <motion.div 
        className="glow-orb-accent top-[40%] right-[-5%]"
        animate={{ x: mousePos.x * -3, y: mousePos.y * -3 }}
        transition={{ type: "spring", stiffness: 45, damping: 20 }}
      />
      <motion.div 
        className="glow-orb-primary bottom-[-10%] left-[30%]"
        style={{ opacity: 0.6 }}
        animate={{ x: mousePos.x * -1.5, y: mousePos.y * -1.5 }}
        transition={{ type: "spring", stiffness: 40, damping: 20 }}
      />

      {/* Floating Sidebar */}
      <aside className="fixed left-6 top-1/2 -translate-y-1/2 w-64 glass-panel rounded-2xl p-6 hidden lg:flex flex-col gap-8 z-50 shadow-2xl animate-fade-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6C63FF] to-[#00F5FF] flex items-center justify-center animate-glow-pulse">
            <span className="font-display font-bold text-white text-xl">N</span>
          </div>
          <h1 className="font-display font-bold text-2xl tracking-wide bg-gradient-to-r from-[#00F5FF] to-[#6C63FF] bg-clip-text text-transparent">
            NeuroAI
          </h1>
        </div>
        
        <nav className="flex flex-col gap-4 mt-8">
          {['Dashboard', 'Research', 'Datasets', 'Neural Sync'].map((item, i) => (
            <button key={item} className="text-left py-3 px-4 rounded-xl text-sm font-medium uppercase tracking-[0.15em] text-[#7A7A9D] hover:text-[#00F5FF] hover:bg-white/5 transition-all group relative overflow-hidden">
              <span className="relative z-10">{item}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </nav>
        
        <div className="mt-auto pt-8 border-t border-white/10">
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#00FFB2]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FFB2] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FFB2]"></span>
            </span>
            System Online
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:ml-80 relative z-10 p-6 lg:p-12 min-h-screen flex flex-col pt-24 lg:pt-12">
        
        {/* Top Search Bar */}
        <header className="flex justify-center lg:justify-end mb-16 w-full max-w-5xl mx-auto">
          <motion.div 
            className="w-full max-w-lg"
            animate={{ x: mousePos.x * 2, y: mousePos.y * 2 }}
            transition={{ type: "spring", stiffness: 100, damping: 30 }}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00F5FF] to-[#6C63FF] rounded-full blur opacity-25 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative glass-panel rounded-full flex items-center px-6 py-4">
                <svg className="w-5 h-5 text-[#00F5FF] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input 
                  type="text" 
                  placeholder="Search the neural network..." 
                  className="bg-transparent border-none outline-none w-full text-sm font-sans placeholder:text-[#7A7A9D] text-white uppercase tracking-widest"
                />
              </div>
            </div>
          </motion.div>
        </header>

        {/* Hero Section */}
        <section className="mb-24 flex flex-col items-center text-center max-w-5xl mx-auto w-full relative">
          <motion.div
            className="absolute inset-0 flex justify-center items-center pointer-events-none z-[-1]"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-[600px] h-[600px] rounded-full border border-white/5 animate-orbit-pulse border-dashed"></div>
            <div className="w-[400px] h-[400px] rounded-full border border-[#6C63FF]/20 absolute"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ x: mousePos.x * 3, y: mousePos.y * 3 }}
          >
            <h2 className="font-display font-black text-6xl md:text-7xl lg:text-[5rem] leading-tight mb-6 bg-gradient-to-br from-[#00F5FF] via-[#F0F0FF] to-[#6C63FF] bg-clip-text text-transparent">
              TRANSCEND <br /> RESEARCH.
            </h2>
            <p className="font-sans text-lg md:text-xl text-[#7A7A9D] max-w-2xl mx-auto uppercase tracking-[0.15em] leading-relaxed">
              Navigate millions of parameters. Isolate relevant data. 
              Deploy AI-assisted insights in a frictionless zero-gravity environment.
            </p>
            
            <motion.button 
              className="mt-10 px-10 py-4 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#00F5FF] text-white font-bold uppercase tracking-widest text-sm relative group overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300"></div>
              <span className="relative z-10 flex items-center gap-3">
                Initialize Sequence 
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </span>
            </motion.button>
          </motion.div>
        </section>

        {/* Feature Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full mb-32">
          {/* Card 1 */}
          <motion.div 
            className="glass-card rounded-2xl p-8 flex flex-col gap-4 relative animate-float group"
            style={{ rotate: '-1.5deg', x: mousePos.x * 1, y: mousePos.y * 1 }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00F5FF] to-transparent opacity-50"></div>
            <div className="w-12 h-12 rounded-xl bg-[#6C63FF]/20 border border-[#6C63FF]/30 flex items-center justify-center mb-2 group-hover:bg-[#6C63FF]/40 transition-colors">
              <svg className="w-6 h-6 text-[#00F5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="font-display font-bold text-xl text-white">Quantum Search</h3>
            <p className="text-[#7A7A9D] text-sm leading-relaxed">
              Query millions of academic papers with context-aware natural language processing.
            </p>
            <div className="mt-auto pt-4 border-t border-white/5 flex items-center text-[#6C63FF] text-xs uppercase tracking-widest font-bold">
              Access Module →
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            className="glass-card rounded-2xl p-8 flex flex-col gap-4 relative animate-float group"
            style={{ animationDelay: '1.2s', rotate: '1.5deg', x: mousePos.x * 1.5, y: mousePos.y * 1.5 }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6C63FF] to-transparent opacity-50"></div>
            <div className="w-12 h-12 rounded-xl bg-[#00F5FF]/10 border border-[#00F5FF]/30 flex items-center justify-center mb-2 group-hover:bg-[#00F5FF]/30 transition-colors">
              <svg className="w-6 h-6 text-[#6C63FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <h3 className="font-display font-bold text-xl text-white">Neural Synthesizer</h3>
            <p className="text-[#7A7A9D] text-sm leading-relaxed">
              Automatically generate literature reviews and synthesize contradictory findings across disciplines.
            </p>
            <div className="mt-auto pt-4 border-t border-white/5 flex items-center text-[#00F5FF] text-xs uppercase tracking-widest font-bold">
              Access Module →
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            className="glass-card rounded-2xl p-8 flex flex-col gap-4 relative animate-float group"
            style={{ animationDelay: '0.6s', rotate: '-0.5deg', x: mousePos.x * 0.8, y: mousePos.y * 0.8 }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2 group-hover:bg-white/10 transition-colors relative">
               <div className="absolute inset-0 rounded-xl bg-[#6C63FF] blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <svg className="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h3 className="font-display font-bold text-xl text-white">Predictive Trends</h3>
            <p className="text-[#7A7A9D] text-sm leading-relaxed">
              Analyze citation pathways to predict emerging fields and paradigm shifts before they happen.
            </p>
            <div className="mt-auto pt-4 border-t border-white/5 flex items-center text-white text-xs uppercase tracking-widest font-bold">
              Access Module →
            </div>
          </motion.div>
        </section>

        {/* AI Chat Bubble Component */}
        <motion.div 
          className="fixed bottom-8 right-8 z-50 animate-float"
          style={{ animationDuration: '6s' }}
        >
          <button className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#6C63FF] to-[#00F5FF] rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 animate-glow-pulse"></div>
            <div className="relative w-16 h-16 rounded-full glass-panel flex items-center justify-center border border-[#00F5FF]/50 shadow-2xl overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-[#6C63FF]/20 to-[#00F5FF]/20"></div>
              <svg className="w-7 h-7 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </div>
          </button>
        </motion.div>

        {/* Existing Components - wrapped in glass panels so they fit the theme if used */}
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-12 opacity-80 mt-12 mb-32 child-glass">
            {/* The user originally had these components. We keep them but styled nicely in dark mode. */}
            <div className="glass-panel p-8 rounded-3xl border-[#6C63FF]/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00F5FF]/5 blur-[80px] rounded-full"></div>
                <h3 className="font-display font-bold text-2xl mb-8 uppercase tracking-wider text-[#00F5FF]">Extracted DeepSeek Assets</h3>
                <DeepSeekDemo />
            </div>
            
            <div className="glass-panel p-8 rounded-3xl border-[#00F5FF]/20 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#6C63FF]/5 blur-[80px] rounded-full"></div>
                <h3 className="font-display font-bold text-2xl mb-8 uppercase tracking-wider text-[#6C63FF]">Live Data Feeds</h3>
                <SemanticScholarDatasets />
                <div className="mt-8">
                  <TrendingPapers />
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}
