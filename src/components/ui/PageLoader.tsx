"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = "Loading...",
  fullScreen = true
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const containerClass = fullScreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center'
    : 'flex flex-col items-center justify-center py-12';
    
  const bgClass = fullScreen
    ? isDark ? 'bg-circuit-dark/90 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'
    : '';
  
  return (
    <motion.div 
      className={`${containerClass} ${bgClass}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <div className="h-16 w-16">
          <motion.div
            className={`absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-t-transparent ${isDark ? 'border-osc-blue' : 'border-osc-blue'}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
      
      <motion.p
        className={`mt-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </motion.p>
    </motion.div>
  );
}; 