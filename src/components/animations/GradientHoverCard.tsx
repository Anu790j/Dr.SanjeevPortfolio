import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { ReactNode } from 'react';

interface GradientHoverCardProps {
  children: ReactNode;
  className?: string;
}

export const GradientHoverCard = ({ children, className = '' }: GradientHoverCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      className={`relative rounded-lg overflow-hidden p-5 ${
        isDark ? 'bg-bg-dark shadow-lg' : 'bg-bg-secondary shadow-md'
      } ${className}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.03,
        rotateX: 3,
        rotateY: 3,
        boxShadow: isDark 
          ? '0 10px 30px -5px rgba(120, 186, 255, 0.3)' 
          : '0 10px 30px -5px rgba(56, 189, 248, 0.3)',
        transition: {
          duration: 0.3,
          ease: "easeOut"
        }
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        transformOrigin: 'center center',
      }}
    >
      {/* Content area - always visible with 3D transform */}
      <motion.div 
        className="relative z-20"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        whileHover={{
          translateZ: 20,
          transition: { duration: 0.3 }
        }}
      >
        {children}
      </motion.div>

      {/* Strong gradient border */}
      <motion.div 
        className="absolute inset-0 rounded-lg"
        style={{ 
          background: isDark 
            ? 'linear-gradient(135deg, rgba(120, 186, 255, 0.5), rgba(240, 184, 102, 0.5))' 
            : 'linear-gradient(135deg, rgba(56, 189, 248, 0.3), rgba(245, 158, 11, 0.3))',
          padding: '2px',
        }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Fast moving flash effect */}
      <motion.div 
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: isDark 
            ? 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 20%, transparent 30%)' 
            : 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 20%, transparent 30%)',
          transform: 'translateX(-100%) skewX(-15deg)',
        }}
        whileHover={{ 
          opacity: 1,
          x: ['-100%', '200%'],
          transition: { 
            duration: 0.8, 
            repeat: Infinity, 
            repeatDelay: 0.3,
            ease: "easeOut" 
          }
        }}
      />

      {/* Edge highlight effect */}
      <motion.div 
        className="absolute inset-0 opacity-0 pointer-events-none rounded-lg"
        style={{
          boxShadow: isDark 
            ? 'inset 0 0 15px rgba(120, 186, 255, 0.5)' 
            : 'inset 0 0 15px rgba(56, 189, 248, 0.5)',
        }}
        whileHover={{ 
          opacity: 1,
          transition: { duration: 0.3 }
        }}
      />

      {/* 3D perspective shadow */}
      <motion.div 
        className="absolute inset-0 rounded-lg"
        style={{
          boxShadow: isDark 
            ? '0 5px 15px -5px rgba(0, 0, 0, 0.5)' 
            : '0 5px 15px -5px rgba(0, 0, 0, 0.3)',
          transform: 'translateZ(-10px)',
          opacity: 0,
        }}
        whileHover={{ 
          opacity: 1,
          translateZ: -20,
          transition: { duration: 0.3 }
        }}
      />
    </motion.div>
  );
}; 