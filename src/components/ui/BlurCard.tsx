import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface BlurCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  hideHeaderBorder?: boolean;
}

export const BlurCard: React.FC<BlurCardProps> = ({ 
  children,
  className = '',
  title,
  hideHeaderBorder = false
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <motion.div
      className={`relative rounded-lg overflow-hidden border ${isDark ? 'border-circuit-copper/30' : 'border-osc-blue/30'} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: isDark 
          ? '0 10px 30px -10px rgba(120, 186, 255, 0.3)' 
          : '0 10px 30px -10px rgba(59, 130, 246, 0.3)',
      } as any}
    >
      {/* Blurred background */}
      <div 
        className={`absolute inset-0 ${isDark ? 'bg-bg-dark/70' : 'bg-bg-secondary/70'} backdrop-blur-md`}
      />
      
      {/* Border glow */}
      <motion.div 
        className="absolute inset-0 rounded-lg opacity-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{ 
          boxShadow: `inset 0 0 0 1px ${isDark ? 'rgba(120, 186, 255, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
        } as any}
      />
      
      {/* Flash effect on hover */}
      <motion.div 
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: isDark 
            ? 'linear-gradient(90deg, transparent 0%, rgba(120, 186, 255, 0.2) 10%, transparent 20%)'
            : 'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.15) 10%, transparent 20%)',
          transform: 'translateX(-100%) skewX(-15deg)',
        } as any}
        whileHover={{ 
          opacity: 1,
          x: ['-100%', '200%'],
          transition: { 
            duration: 1.2, 
            ease: "easeOut" 
          }
        }}
      />
      
      {/* Title if provided */}
      {title && (
        <div className={`px-6 pt-4 pb-2 relative z-10 ${!hideHeaderBorder ? `border-b ${isDark ? 'border-circuit-copper/20' : 'border-osc-blue/20'}` : ''}`}>
          <h3 className={`text-xl font-bold ${isDark ? 'text-circuit-light-blue' : 'text-osc-blue'}`}>
            {title}
          </h3>
        </div>
      )}
      
      {/* Content */}
      <div className="p-6 relative z-10">
        {children}
      </div>
    </motion.div>
  );
}; 