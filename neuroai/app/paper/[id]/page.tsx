'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  externalIds?: {
    PaperId?: string;
    ArxivId?: string;
    DOI?: string;
  };
  fieldsOfStudy?: string[];
  venue?: string;
  citationCount?: number;
}

interface Summary {
  type: 'abstract' | 'highlights' | 'methodology' | 'findings' | 'implications';
  title: string;
  content: string;
}

export default function PaperDetailPage() {
  const params = useParams();
  const paperId = params.id as string;

  const [paper, setPaper] = useState<Paper | null>(null);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'abstract' | 'summary' | 'details'>('abstract');
  const [savingPaper, setSavingPaper] = useState(false);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const response = await fetch(`/api/papers/${paperId}`);
        if (!response.ok) {
          setError('Paper not found');
          setLoading(false);
          return;
        }
        const data = await response.json();
        setPaper(data.paper);

        // Generate summaries if available
        if (data.summaries) {
          setSummaries(data.summaries);
        }
      } catch (err) {
        console.error('Error fetching paper:', err);
        setError('Failed to load paper details');
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [paperId]);

  const handleSavePaper = async () => {
    if (!paper) return;

    setSavingPaper(true);
    try {
      const response = await fetch('/api/papers/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          paperId: paper.id,
          title: paper.title,
        }),
      });

      if (!response.ok) {
        alert('Failed to save paper');
        return;
      }

      alert('Paper saved successfully!');
    } catch (err) {
      console.error('Error saving paper:', err);
      alert('Failed to save paper');
    } finally {
      setSavingPaper(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const getExternalLink = () => {
    if (paper?.externalIds?.ArxivId) {
      return `https://arxiv.org/abs/${paper.externalIds.ArxivId}`;
    }
    if (paper?.externalIds?.DOI) {
      return `https://doi.org/${paper.externalIds.DOI}`;
    }
    if (paper?.externalIds?.PaperId) {
      return `https://www.semanticscholar.org/paper/${paper.externalIds.PaperId}`;
    }
    return null;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse duration-7000" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse duration-7000 animation-delay-2000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/search"
              className="flex items-center gap-2 text-slate-300 hover:text-white transition"
            >
              <span>←</span>
              <span className="text-sm">Back to search</span>
            </Link>
            {paper && (
              <button
                onClick={handleSavePaper}
                disabled={savingPaper}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-50"
              >
                {savingPaper ? 'Saving...' : '💾 Save'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Loading state */}
      {loading && (
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="h-8 bg-white/10 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-white/10 rounded w-1/2 animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 bg-white/10 rounded w-full animate-pulse" />
              <div className="h-4 bg-white/10 rounded w-full animate-pulse" />
              <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-red-500/15 border border-red-500/30 rounded-lg"
          >
            <h2 className="text-red-200 font-semibold mb-2">{error}</h2>
            <p className="text-red-300/80 text-sm">The paper you're looking for could not be found.</p>
          </motion.div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && paper && (
        <motion.div
          className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Paper title and metadata */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">{paper.title}</h1>

            <div className="flex flex-wrap gap-4 mb-6">
              {paper.year && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Year:</span>
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded text-sm font-medium">
                    {paper.year}
                  </span>
                </div>
              )}
              {paper.venue && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Venue:</span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded text-sm font-medium">
                    {paper.venue}
                  </span>
                </div>
              )}
              {paper.citationCount !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Citations:</span>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded text-sm font-medium">
                    {paper.citationCount}
                  </span>
                </div>
              )}
            </div>

            {/* Authors */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Authors</h3>
              <p className="text-slate-400">
                {paper.authors?.join(', ') || 'No authors listed'}
              </p>
            </div>

            {/* Fields of study */}
            {paper.fieldsOfStudy && paper.fieldsOfStudy.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {paper.fieldsOfStudy.map((field, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-700/50 text-slate-200 rounded-full text-xs"
                  >
                    {field}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Tab navigation */}
          <motion.div variants={itemVariants} className="flex gap-4 mb-8 border-b border-white/10">
            {['abstract', 'summary', 'details'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 px-2 font-medium transition ${
                  activeTab === tab
                    ? 'text-indigo-400 border-b-2 border-indigo-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </motion.div>

          {/* Tab content */}
          <motion.div variants={itemVariants}>
            {/* Abstract tab */}
            {activeTab === 'abstract' && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Abstract</h2>
                <p className="text-slate-300 leading-relaxed">
                  {paper.abstract || 'No abstract available'}
                </p>
              </div>
            )}

            {/* Summary tab */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                {summaries.length > 0 ? (
                  summaries.map((summary, i) => (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/10 rounded-lg p-6"
                    >
                      <h3 className="text-white font-semibold mb-3">{summary.title}</h3>
                      <p className="text-slate-300 leading-relaxed">{summary.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
                    <p className="text-slate-400">AI summaries coming soon</p>
                  </div>
                )}
              </div>
            )}

            {/* Details tab */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                {getExternalLink() && (
                  <a
                    href={getExternalLink() || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-indigo-600/20 border border-indigo-500/30 rounded-lg hover:bg-indigo-600/30 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-300 font-medium">View full paper</span>
                      <span>→</span>
                    </div>
                  </a>
                )}

                {/* External IDs */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">Paper IDs</h3>
                  <div className="space-y-3">
                    {paper.externalIds?.PaperId && (
                      <div>
                        <label className="text-xs font-semibold text-slate-400">Semantic Scholar ID</label>
                        <p className="text-slate-300 font-mono text-sm break-all">
                          {paper.externalIds.PaperId}
                        </p>
                      </div>
                    )}
                    {paper.externalIds?.ArxivId && (
                      <div>
                        <label className="text-xs font-semibold text-slate-400">ArXiv ID</label>
                        <p className="text-slate-300 font-mono text-sm break-all">
                          {paper.externalIds.ArxivId}
                        </p>
                      </div>
                    )}
                    {paper.externalIds?.DOI && (
                      <div>
                        <label className="text-xs font-semibold text-slate-400">DOI</label>
                        <p className="text-slate-300 font-mono text-sm break-all">
                          {paper.externalIds.DOI}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Action buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/search"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition"
            >
              Back to search
            </Link>
            {getExternalLink() && (
              <a
                href={getExternalLink() || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
              >
                Read on external site
              </a>
            )}
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}
