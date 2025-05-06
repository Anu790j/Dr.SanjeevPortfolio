"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { WaveformDivider } from './WaveformDivider';
import { useTheme } from '@/context/ThemeContext';

interface LoadingIndicatorProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = "Loading...",
  fullScreen = false,
  className = "",
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  if (fullScreen) {
    return (
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${isDark ? 'bg-circuit-dark/90' : 'bg-bg-primary/90'} backdrop-blur-sm ${className}`}>
        <div className="w-full max-w-md">
          <WaveformDivider />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`mt-4 text-sm font-medium ${isDark ? 'text-circuit-silver' : 'text-text-secondary'}`}
        >
          {message}
        </motion.p>
      </div>
    );
  }
  
  return (
    <div className={`w-full py-4 ${className}`}>
      <WaveformDivider />
      <div className="container mx-auto max-w-6xl px-4 py-4 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`text-sm ${isDark ? 'text-circuit-silver' : 'text-text-secondary'}`}
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}; 