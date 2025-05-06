"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface ProjectCardProps {
  title: string;
  description: string;
  status: 'ongoing' | 'completed';
  imageUrl?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  collaborators?: string[];
  funding?: string;
  index?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  status,
  imageUrl,
  startDate,
  endDate,
  collaborators,
  funding,
  index
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      className={`${isDark ? 'bg-bg-dark' : 'bg-bg-secondary'} bg-opacity-80 backdrop-blur-lg rounded-lg overflow-hidden border border-osc-blue border-opacity-20`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {imageUrl && (
        <div className="h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-lg font-medium ${isDark ? 'text-comp-gold' : 'text-comp-gold'}`}>{title}</h3>
          <span className={`text-xs px-2 py-1 rounded ${
            status === 'ongoing' 
              ? 'bg-green-500 bg-opacity-10 text-green-400' 
              : 'bg-blue-500 bg-opacity-10 text-blue-400'
          }`}>
            {status === 'ongoing' ? 'Ongoing' : 'Completed'}
          </span>
        </div>
        
        <p className={`text-sm mb-3 ${isDark ? 'text-text-light' : 'text-text-primary'}`}>{description}</p>
        
        {(startDate || endDate) && (
          <p className="text-xs text-text-muted mb-2">
            {startDate && (typeof startDate === 'string' ? startDate : new Date(startDate).getFullYear())}
            {endDate 
              ? ` - ${typeof endDate === 'string' ? endDate : new Date(endDate).getFullYear()}` 
              : ' - Present'}
          </p>
        )}
        
        {collaborators && collaborators.length > 0 && (
          <div className="mb-2">
            <span className="text-xs text-text-muted">Collaborators: </span>
            <span className="text-xs">{collaborators.join(', ')}</span>
          </div>
        )}
        
        
        {index && (
          <div className="mt-2">
            <span className="text-xs text-text-muted">Funding: </span>
            <span className="text-xs">{funding}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}; 