import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface LoadingSectionProps {
  title?: string;
}

const LoadingSection: React.FC<LoadingSectionProps> = ({ title }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {title && <h2 className="text-xl font-semibold mb-6">{title}</h2>}
      <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
        isDark ? 'border-osc-blue' : 'border-osc-blue'
      }`}></div>
      <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading...</p>
    </div>
  );
};

export default LoadingSection; 