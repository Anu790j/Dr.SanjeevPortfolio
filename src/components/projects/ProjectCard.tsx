import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface ProjectProps {
  title: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  status?: 'ongoing' | 'completed' | 'upcoming';
  tags?: string[];
  url?: string;
  startDate?: Date;
  endDate?: Date;
  collaborators?: string[];
  funding?: string;
  index: number;
}

export const ProjectCard: React.FC<ProjectProps> = ({ 
  title, 
  description, 
  imageUrl, 
  category = 'research', 
  status, 
  tags, 
  url, 
  startDate,
  endDate,
  collaborators,
  funding,
  index 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Generate proper image URL from the imageUrl ID if it starts with a MongoDB ObjectId format
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return '/images/placeholder-research.jpg';
    // Check if it's already a path or needs to be converted to API endpoint
    return imageUrl.startsWith('/') ? imageUrl : `/api/files/${imageUrl}`;
  };
  
  return (
    <motion.div
      className={`rounded-lg overflow-hidden shadow-md ${isDark ? 'bg-bg-dark' : 'bg-white'}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
    >
      <div className="relative h-48 w-full">
        <Image
          src={getImageUrl(imageUrl || '')}
          alt={title}
          fill
          className="object-cover"
        />
        <div className={`absolute bottom-0 left-0 right-0 py-1 px-3 text-xs font-medium ${
          isDark 
            ? 'bg-bg-dark/80 text-osc-blue' 
            : 'bg-white/80 text-osc-blue'
        }`}>
          {category === 'research' ? 'Research' : 'Lab'}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {title}
        </h3>
        
        {status && (
          <span className={`inline-block px-2 py-1 text-xs rounded-full mb-2 ${
            status === 'ongoing' ? 'bg-green-100 text-green-800' :
            status === 'completed' ? 'bg-blue-100 text-blue-800' : 
            'bg-yellow-100 text-yellow-800'
          }`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
        
        {description && (
          <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {description}
          </p>
        )}
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag, i) => (
              <span 
                key={i}
                className={`text-xs px-2 py-0.5 rounded ${
                  isDark ? 'bg-osc-blue/10 text-osc-blue' : 'bg-osc-blue/10 text-osc-blue'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {url && (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`mt-3 inline-flex items-center text-sm font-medium ${
              isDark ? 'text-osc-blue hover:text-osc-blue/80' : 'text-osc-blue hover:text-osc-blue/80'
            }`}
          >
            View Project
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </a>
        )}
      </div>
    </motion.div>
  );
}; 