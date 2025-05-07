import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface AwardCardProps {
  award: {
    title: string;
    year: number;
    organization: string;
    description?: string;
    imageUrl?: string;
    link?: string;
  };
  index: number;
}

export const AwardCard: React.FC<AwardCardProps> = ({ award, index }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Generate proper image URL from the imageUrl ID
  const getImageUrl = (imageId: string) => {
    if (!imageId) return '/images/placeholder-award.jpg';
    // Check if it's already a path or needs to be converted to API endpoint
    return imageId.startsWith('/') ? imageId : `/api/files/${imageId}`;
  };
  
  return (
    <motion.div
      className={`rounded-lg p-4 backdrop-blur-lg ${
        isDark 
          ? 'bg-circuit-dark/60 border border-circuit-copper/30' 
          : 'bg-gray-100/70 shadow-md'
      } transition-all`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: isDark 
          ? '0 10px 40px rgba(252, 150, 37, 0.25)' 
          : '0 10px 40px rgba(59, 130, 246, 0.25)',
        borderColor: isDark ? 'rgba(252, 150, 37, 0.6)' : 'rgba(59, 130, 246, 0.4)'
      }}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className={`relative w-16 h-16 rounded-full overflow-hidden border-2 ${
            isDark ? 'border-circuit-copper' : 'border-comp-gold'
          }`}>
            <Image
              src={getImageUrl(award.imageUrl || '')}
              alt={award.title}
              fill
              className="object-cover"
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30"
              whileHover={{ opacity: 0 }}
              initial={{ opacity: 0.3 }}
            />
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {award.title}
            </h3>
            <span className={`text-sm font-bold px-2 py-1 rounded-full ${
              isDark ? 'bg-circuit-dark-blue/20 text-circuit-light-blue' : 'bg-osc-blue/10 text-osc-blue'
            }`}>
              {award.year}
            </span>
          </div>
          
          <p className={`text-sm ${isDark ? 'text-circuit-silver' : 'text-gray-600'}`}>
            {award.organization}
          </p>
          
          {award.description && (
            <p className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {award.description}
            </p>
          )}
          
          {award.link && (
            <div className="mt-3">
              <motion.a 
                href={award.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm inline-flex items-center ${
                  isDark ? 'text-circuit-copper hover:text-circuit-copper/80' : 'text-comp-gold hover:text-comp-gold/80'
                }`}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}; 