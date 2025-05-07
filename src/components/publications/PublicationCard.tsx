"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'react-hot-toast';

interface PublicationCardProps {
  publication: {
    _id: string;
  title: string;
    authors: string;
    category: 'journal' | 'conference' | 'patent';
    journal?: string;
    conference?: string;
  year: number;
  doi?: string;
    abstract?: string;
    pdfFileId?: string;
    link?: string;
    citation?: string;
    tags?: string[];
  };
  index: number;
}

export const PublicationCard: React.FC<PublicationCardProps> = ({ publication, index }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [expanded, setExpanded] = useState(false);
  const [citationOpen, setCitationOpen] = useState(false);
  
  // Helper function to generate a citation if not provided
  const getCitation = () => {
    if (publication.citation) return publication.citation;
    
    // Generate basic citation
    const authorLastNames = publication.authors
      .split(',')
      .map(author => author.trim().split(' ').pop())
      .join(', ');
    
    if (publication.category === 'journal') {
      return `${authorLastNames} (${publication.year}). ${publication.title}. ${publication.journal}.`;
    } else if (publication.category === 'conference') {
      return `${authorLastNames} (${publication.year}). ${publication.title}. In ${publication.conference}.`;
    } else {
      return `${authorLastNames} (${publication.year}). ${publication.title}. Patent.`;
    }
  };
  
  // Copy citation to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCitation())
      .then(() => {
        toast.success('Citation copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy citation');
      });
  };

  return (
    <motion.div
      className={`rounded-lg p-4 ${
        isDark 
          ? 'bg-circuit-dark border border-circuit-light-blue/20' 
          : 'bg-gray-50 shadow-md hover:shadow-lg backdrop-blur-sm'
      } transition-all`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              publication.category === 'journal'
                ? isDark ? 'bg-circuit-light-blue/20 text-circuit-light-blue' : 'bg-osc-blue/10 text-osc-blue'
                : publication.category === 'conference'
                  ? isDark ? 'bg-circuit-copper/20 text-circuit-copper' : 'bg-comp-gold/10 text-comp-gold'
                  : isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'
            }`}>
              {publication.category === 'journal' 
                ? 'Journal' 
                : publication.category === 'conference'
                  ? 'Conference'
                  : 'Patent'}
            </span>
            
            <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {publication.year}
            </span>
          </div>
          
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {publication.title}
          </h3>
          
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {publication.authors}
          </p>
          
          {(publication.journal || publication.conference) && (
            <p className={`text-sm mt-1 italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {publication.journal || publication.conference}
            </p>
          )}
          
          {publication.abstract && (
            <div className="mt-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className={`text-sm font-medium ${
                  isDark ? 'text-circuit-light-blue hover:text-circuit-light-blue/80' : 'text-osc-blue hover:text-osc-blue/80'
                } flex items-center`}
              >
                {expanded ? 'Hide Abstract' : 'Show Abstract'}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-1 transform transition-transform ${expanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expanded && (
                <motion.p 
                  className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
        >
                  {publication.abstract}
                </motion.p>
              )}
            </div>
          )}
          
          {/* Citation section */}
          {citationOpen && (
        <motion.div 
              className={`mt-3 p-3 text-sm rounded ${
                isDark ? 'bg-circuit-dark-blue/10 border border-circuit-light-blue/20' : 'bg-blue-50 border border-blue-100'
              }`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`font-medium ${isDark ? 'text-circuit-light-blue' : 'text-osc-blue'}`}>Citation</span>
                <button
                  onClick={copyToClipboard}
                  className={`text-xs ${
                    isDark ? 'text-circuit-copper hover:text-circuit-copper/80' : 'text-comp-gold hover:text-comp-gold/80'
                  }`}
        >
                  Copy
                </button>
              </div>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                {getCitation()}
              </p>
        </motion.div>
          )}
        
          {/* Tags */}
          {publication.tags && publication.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {publication.tags.map((tag, i) => (
                <span 
                  key={i} 
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isDark ? 'bg-circuit-dark border border-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => setCitationOpen(!citationOpen)}
          className={`text-xs px-3 py-1.5 rounded ${
            isDark 
              ? citationOpen 
                ? 'bg-circuit-light-blue/20 text-circuit-light-blue' 
                : 'bg-circuit-dark-blue/20 text-circuit-light-blue hover:bg-circuit-dark-blue/30' 
              : citationOpen
                ? 'bg-osc-blue/20 text-osc-blue'
                : 'bg-osc-blue/10 text-osc-blue hover:bg-osc-blue/20'
          } transition-colors`}
        >
          {citationOpen ? 'Hide Citation' : 'Cite'}
        </button>
        
        {publication.pdfFileId && (
          <a
            href={`/api/files/${publication.pdfFileId}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs px-3 py-1.5 rounded ${
              isDark 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-red-100 text-red-600 hover:bg-red-200'
            } transition-colors`}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF
            </span>
          </a>
        )}
        
        {publication.link && (
          <a
            href={publication.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs px-3 py-1.5 rounded ${
              isDark 
                ? 'bg-circuit-copper/20 text-circuit-copper hover:bg-circuit-copper/30' 
                : 'bg-comp-gold/10 text-comp-gold hover:bg-comp-gold/20'
            } transition-colors`}
        >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View
            </span>
          </a>
        )}
        
        {publication.doi && (
          <a
            href={`https://doi.org/${publication.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs px-3 py-1.5 rounded ${
              isDark 
                ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
          >
            <span className="flex items-center">
              DOI
            </span>
          </a>
        )}
      </div>
    </motion.div>
  );
};
