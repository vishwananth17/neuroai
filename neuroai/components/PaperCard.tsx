'use client';

import { motion } from 'framer-motion';
import { BookmarkIcon, ShareIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface Author {
  name: string;
  id?: string;
}

interface PaperCardProps {
  id: string;
  title: string;
  abstract: string;
  authors: Author[];
  year?: number;
  venue?: string;
  citationCount: number;
  fieldsOfStudy: string[];
  tldr?: string;
  isSaved?: boolean;
  onSave?: () => void;
  onShare?: () => void;
  onSummarize?: () => void;
  onClick?: () => void;
}

export default function PaperCard({
  id,
  title,
  abstract,
  authors,
  year,
  venue,
  citationCount,
  fieldsOfStudy,
  tldr,
  isSaved = false,
  onSave,
  onShare,
  onSummarize,
  onClick,
}: PaperCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const authorNames = authors.map((a) => a.name).join(', ');
  const truncatedAbstract = (tldr || abstract).substring(0, 200) + '...';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Card Background with Glassmorphism */}
      <div
        className="relative bg-glass border border-glass backdrop-blur-md rounded-xl 
                   p-6 cursor-pointer transition-all duration-300
                   hover:border-glow-indigo hover:shadow-glow-indigo-md
                   hover:bg-glass-hover overflow-hidden"
        onClick={onClick}
      >
        {/* Top gradient line */}
        <div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r 
                     from-transparent via-indigo to-transparent opacity-50"
        />

        {/* Main Content */}
        <div className="relative z-10">
          {/* Title */}
          <h3
            className="text-lg font-semibold text-star leading-tight 
                       group-hover:text-indigo transition-colors duration-200 mb-2"
          >
            {title}
          </h3>

          {/* Authors and Year */}
          <p className="text-sm text-secondary mb-3 line-clamp-1">
            {authorNames}
            {year && <span className="ml-2 text-muted">({year})</span>}
          </p>

          {/* TLDR / Abstract */}
          <p className="text-sm text-primary leading-relaxed mb-4 line-clamp-2">
            {truncatedAbstract}
          </p>

          {/* Fields of Study Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {fieldsOfStudy.slice(0, 3).map((field, i) => (
              <span
                key={i}
                className="text-xs bg-elevated border border-glass-hover rounded-full 
                           px-3 py-1 text-secondary hover:text-indigo transition-colors"
              >
                {field}
              </span>
            ))}
            {fieldsOfStudy.length > 3 && (
              <span className="text-xs text-muted">+{fieldsOfStudy.length - 3}</span>
            )}
          </div>

          {/* Footer: Citation count and Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-glass">
            {/* Citation Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary">Cited</span>
              <span className="text-sm font-semibold text-indigo">
                {citationCount.toLocaleString()}
              </span>
              {venue && (
                <span className="text-xs text-muted">• {venue.substring(0, 20)}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSave?.();
                }}
                className="p-1 hover:text-indigo text-secondary transition-colors"
                title={isSaved ? 'Remove from library' : 'Save to library'}
              >
                {isSaved ? (
                  <BookmarkSolidIcon className="w-4 h-4" />
                ) : (
                  <BookmarkIcon className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare?.();
                }}
                className="p-1 hover:text-cyan text-secondary transition-colors"
                title="Share paper"
              >
                <ShareIcon className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSummarize?.();
                }}
                className="p-1 hover:text-emerald text-secondary transition-colors"
                title="Generate AI summary"
              >
                <SparklesIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Animated background orb on hover */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.05, scale: 1 }}
            className="absolute -right-20 -top-20 w-40 h-40 bg-indigo rounded-full blur-3xl"
          />
        )}
      </div>
    </motion.div>
  );
}
