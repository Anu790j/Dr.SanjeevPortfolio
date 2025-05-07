"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

type ButtonType = 'primary' | 'secondary' | 'warning' | 'danger';
type HTMLButtonType = 'button' | 'submit' | 'reset';

interface AdminButtonProps {
  type: ButtonType;
  buttonType?: HTMLButtonType;
  onClick?: () => void;
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const AdminButton: React.FC<AdminButtonProps> = ({
  type = 'primary',
  buttonType = 'button',
  onClick,
  children,
  isLoading = false,
  disabled = false,
  className = '',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Base styles
  let buttonStyles = `px-4 py-2 rounded-md font-medium text-sm flex items-center justify-center transition-colors duration-200 transform shadow-sm ${className}`;
  
  // Type-specific styles
  if (type === 'primary') {
    buttonStyles += isDark
      ? ' bg-osc-blue text-white hover:bg-osc-blue/80 active:bg-osc-blue/90 focus:ring-2 focus:ring-osc-blue/50'
      : ' bg-osc-blue text-white hover:bg-osc-blue/90 active:bg-osc-blue/100 focus:ring-2 focus:ring-osc-blue/30';
  } else if (type === 'secondary') {
    buttonStyles += isDark
      ? ' bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800 active:bg-gray-700 focus:ring-2 focus:ring-gray-600/30'
      : ' bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-2 focus:ring-gray-300/30';
  } else if (type === 'warning') {
    buttonStyles += isDark
      ? ' bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800 focus:ring-2 focus:ring-amber-600/50'
      : ' bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 focus:ring-2 focus:ring-amber-500/30';
  } else if (type === 'danger') {
    buttonStyles += isDark
      ? ' bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-2 focus:ring-red-600/50'
      : ' bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-2 focus:ring-red-500/30';
  }
  
  // Disabled or loading styles
  if (disabled || isLoading) {
    buttonStyles += ' opacity-50 cursor-not-allowed';
  } else {
    buttonStyles += ' hover:scale-[1.02] active:scale-[0.98] transform duration-150';
  }
  
  return (
    <button
      type={buttonType}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={buttonStyles}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
}; 