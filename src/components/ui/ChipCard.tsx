// src/components/ui/ChipCard.tsx
"use client";

import React, { useId } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface ChipCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  type?: 'processor' | 'memory' | 'io';
  chipId?: string;
}

export const ChipCard: React.FC<ChipCardProps> = ({ 
  title, 
  children, 
  className = '',
  type = 'processor',
  chipId,
}) => {
  const id = useId();
  const chipNumber = chipId || `SM-${id.split(':').join('').substring(0, 4)}`;
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Type-based styles
  const typeStyles = {
    processor: {
      border: 'border-osc-blue',
      led: 'bg-osc-blue',
      shadow: 'shadow-osc-glow',
      color: isDark ? 'rgb(120, 186, 255)' : 'rgb(37, 99, 235)',
    },
    memory: {
      border: 'border-pcb-green',
      led: 'bg-pcb-green',
      shadow: 'shadow-pcb-glow',
      color: isDark ? 'rgb(160, 228, 203)' : 'rgb(34, 197, 94)',
    },
    io: {
      border: 'border-comp-gold',
      led: 'bg-comp-gold',
      shadow: 'shadow-gold-glow',
      color: isDark ? 'rgb(248, 198, 109)' : 'rgb(217, 119, 6)',
    },
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: `0 10px 25px -5px ${typeStyles[type].color}40`,
        translateZ: 20,
        rotateX: 2,
        rotateY: 2,
      }}
      className={`relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <div className={`
        relative overflow-hidden rounded-lg
        bg-bg-card ${typeStyles[type].border}
        shadow-md hover:${typeStyles[type].shadow} transition-all duration-300
      `}>
        {/* Animated circuit pattern background */}
        <motion.div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage: `
              radial-gradient(circle at 10% 20%, ${typeStyles[type].color}20 0%, transparent 20%),
              radial-gradient(circle at 80% 50%, ${typeStyles[type].color}20 0%, transparent 20%),
              radial-gradient(circle at 30% 70%, ${typeStyles[type].color}20 0%, transparent 20%)
            `,
            backgroundSize: '100% 100%',
          }}
        />
        
        {/* Moving flash effect */}
        <motion.div 
          className="absolute inset-0 opacity-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${typeStyles[type].color}20 10%, transparent 20%)`,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
        
        {/* Header with LED indicator */}
        <div className="bg-bg-highlight p-3 flex items-center justify-between border-b border-opacity-50 border-pcb-green">
          <div className="flex items-center space-x-2">
            <motion.div 
              className={`w-2 h-2 rounded-full ${typeStyles[type].led}`}
              animate={{ 
                boxShadow: [
                  `0 0 2px ${typeStyles[type].color}60`,
                  `0 0 8px ${typeStyles[type].color}`,
                  `0 0 2px ${typeStyles[type].color}60`
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <h3 className="text-osc-blue font-semibold tracking-wide">{title}</h3>
          </div>
          <div className="text-text-muted font-mono text-xs">{chipNumber}</div>
        </div>
        
        {/* Animated pin connections */}
        <div className="absolute top-12 left-0 h-[calc(100%-48px)] w-[1px] flex flex-col justify-around">
          {[...Array(5)].map((_, i) => (
            <motion.div 
              key={`left-${i}`} 
              className="w-[3px] h-[1px] bg-pcb-green"
              animate={{ 
                opacity: [0.4, 1, 0.4],
                width: ['2px', '6px', '2px'],
                boxShadow: [
                  'none',
                  `0 0 4px ${typeStyles[type].color}`,
                  'none'
                ]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: i * 0.4 
              }}
            />
          ))}
        </div>
        
        <div className="absolute top-12 right-0 h-[calc(100%-48px)] w-[1px] flex flex-col justify-around">
          {[...Array(5)].map((_, i) => (
            <motion.div 
              key={`right-${i}`} 
              className="w-[3px] h-[1px] bg-pcb-green"
              animate={{ 
                opacity: [0.4, 1, 0.4],
                width: ['2px', '6px', '2px'],
                boxShadow: [
                  'none',
                  `0 0 4px ${typeStyles[type].color}`,
                  'none'
                ]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: i * 0.4 + 0.2
              }}
            />
          ))}
        </div>
        
        {/* Content area with 3D lift */}
        <motion.div 
          className="p-4 relative z-10"
          whileHover={{
            translateZ: 10,
            transition: { duration: 0.3 }
          }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-text-light"
          >
            {children}
          </motion.div>
        </motion.div>
        
        {/* Animated circuit traces in footer */}
        <div className="h-6 bg-bg-highlight relative overflow-hidden">
          <motion.div 
            className="absolute inset-0"
            animate={{
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 300 20">
              <path 
                d="M0,10 H300" 
                stroke={typeStyles[type].color}
                strokeOpacity="0.5"
                strokeWidth="0.5" 
                strokeDasharray="5 3" 
              />
              
              <motion.path 
                d="M75,10 V5 H150 V15 H225 V10" 
                stroke={typeStyles[type].color}
                strokeWidth="1" 
                fill="none"
                animate={{
                  strokeDashoffset: [0, 100]
                }}
                style={{
                  strokeDasharray: 100
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              <motion.circle
                cx="75"
                cy="10"
                r="2"
                fill={typeStyles[type].color}
                animate={{
                  cx: [75, 150, 225, 300],
                  cy: [10, 5, 15, 10],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};