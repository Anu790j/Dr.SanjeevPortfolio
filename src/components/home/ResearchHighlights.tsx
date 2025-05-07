import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import Image from 'next/image';
import { BlurCard } from '@/components/ui/BlurCard';

interface Publication {
  _id: string;
  title: string;
  authors: string;
  category: string;
  abstract?: string;
  pdfFileId?: string;
  imageUrl?: string;
  journal?: string;
  conference?: string;
  year: number;
  link?: string;
  featured?: boolean;
}

export const ResearchHighlights: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  useEffect(() => {
    async function fetchPublications() {
      try {
        const response = await fetch('/api/publication');
        if (response.ok) {
          const data = await response.json();
          // Filter featured publications or take first 3
          const featuredPublications = data.filter((p: Publication) => p.featured);
          const publicationsToShow = featuredPublications.length >= 3 
            ? featuredPublications.slice(0, 3) 
            : data.slice(0, 3);
          setPublications(publicationsToShow);
        }
      } catch (error) {
        console.error('Error fetching publications:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPublications();
  }, []);
  
  return (
    <section className="container mx-auto max-w-6xl px-4 md:px-8 py-16 relative">
      {/* Static background */}
      <div 
        className="absolute inset-0 -z-10 opacity-5"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${isDark ? 'rgba(37,99,235,0.1)' : 'rgba(37,99,235,0.05)'} 0%, transparent 70%)`
        }}
      />

      <motion.h2 
        className={`text-2xl md:text-3xl font-semibold mb-10 ${isDark ? 'text-circuit-light-blue' : 'text-osc-blue'} relative inline-block`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        Research Highlights
        <motion.span 
          className={`absolute -bottom-1 left-0 h-1 ${isDark ? 'bg-circuit-copper' : 'bg-comp-gold'}`}
          initial={{ width: 0 }}
          whileInView={{ width: '4rem' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        />
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div 
              key={i} 
              className={`animate-pulse rounded-lg h-64 ${isDark ? 'bg-circuit-dark' : 'bg-gray-200'}`}
            />
          ))
        ) : publications.length > 0 ? (
          publications.map((publication, index) => (
            <motion.div
              key={publication._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
              className="h-full"
            >
              <Link href={`/research/publication/${publication._id}`} className="block h-full">
                <BlurCard 
                  title={publication.title} 
                  className="h-full flex flex-col"
                  hideHeaderBorder
                >
                  <div className="relative h-40 mb-4 overflow-hidden rounded-md">
                    <Image
                      src={publication.imageUrl ? `/api/files/${publication.imageUrl}` : '/images/placeholder-research.jpg'}
                      alt={publication.title}
                      fill
                      className="object-cover transition-transform hover:scale-105 duration-500"
                    />
                    {publication.category && (
                      <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full 
                        ${isDark ? 'bg-circuit-dark-blue/80 text-white' : 'bg-osc-blue/80 text-white'}`}>
                        {publication.category}
                      </div>
                    )}
                  </div>
                  
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} flex-grow`}>
                    {publication.abstract?.substring(0, 120) + '...' || 'Research publication'}
                  </p>
                  
                  <div className={`mt-4 inline-flex items-center text-sm font-medium ${
                    isDark ? 'text-circuit-copper' : 'text-comp-gold'
                  } self-start`}>
                    <span>Learn more</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </BlurCard>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No research publications found.</p>
          </div>
        )}
      </div>
      
      <motion.div 
        className="mt-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <Link href="/research">
          <motion.button 
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              isDark 
                ? 'bg-transparent text-circuit-copper border border-circuit-copper hover:bg-circuit-copper/10' 
                : 'bg-transparent text-osc-blue border border-osc-blue hover:bg-osc-blue/10'
            } relative overflow-hidden group`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Modified shine effect */}
            <div 
              className="absolute inset-0 opacity-0 bg-gradient-to-r from-transparent via-white to-transparent group-hover:opacity-10"
            />
            
            <span className="flex items-center justify-center">
              <span>View All Research</span>
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </motion.svg>
            </span>
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}; 