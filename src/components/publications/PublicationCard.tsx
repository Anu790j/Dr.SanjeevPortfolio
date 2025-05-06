"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface PublicationCardProps {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi?: string;
  index: number;
}

export const PublicationCard = ({ title, authors, journal, year, doi, index }: PublicationCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      className={`relative rounded-lg overflow-hidden ${isDark ? 'bg-bg-dark' : 'bg-bg-secondary'} shadow-card border ${isDark ? 'border-circuit-copper/10' : 'border-osc-blue/5'} backdrop-blur-sm m-4`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Card content with padding */}
      <div className="relative p-6">
        {/* Circuit trace decoration (if any) */}
        
        {/* Card title */}
        <motion.h3 
          className={`text-xl font-medium mb-2 ${isDark ? 'text-text-light' : 'text-text-primary'}`}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h3>
        
        {/* Authors */}
        <motion.div 
          className={`text-sm mb-4 ${isDark ? 'text-text-secondary' : 'text-text-secondary'}`}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
          viewport={{ once: true }}
        >
          {authors.join(', ')}
        </motion.div>
        
        {/* Journal and Year */}
        <motion.div 
          className={`text-sm mb-4 ${isDark ? 'text-text-secondary' : 'text-text-secondary'}`}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
          viewport={{ once: true }}
        >
          {journal} • {year}
        </motion.div>
        
        {/* DOI Link */}
        {doi && (
          <motion.a
            href={`https://doi.org/${doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block mt-4 text-sm ${isDark ? 'text-circuit-light-blue hover:text-blue-400' : 'text-osc-blue hover:text-blue-600'}`}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ x: 5 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
            viewport={{ once: true }}
          >
            View Publication →
          </motion.a>
        )}
      </div>
    </motion.div>
  );
};
