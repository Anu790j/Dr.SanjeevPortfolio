// src/components/ui/CircuitFrame.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface CircuitFrameProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  corners?: 'all' | 'top' | 'bottom' | 'left' | 'right' | 'none';
  cornerSize?: 'sm' | 'md' | 'lg';
  pulseEffect?: boolean;
}

export const CircuitFrame: React.FC<CircuitFrameProps> = ({
  children,
  className = '',
  animated = true,
  corners = 'all',
  cornerSize = 'md',
  pulseEffect = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Size mapping
  const sizeMap = {
    sm: { size: 15, thickness: 2 },
    md: { size: 20, thickness: 3 },
    lg: { size: 30, thickness: 4 },
  };
  
  const { size, thickness } = sizeMap[cornerSize];
  
  // Determine which corners to show
  const showCorners = {
    topLeft: ['all', 'top', 'left'].includes(corners),
    topRight: ['all', 'top', 'right'].includes(corners),
    bottomLeft: ['all', 'bottom', 'left'].includes(corners),
    bottomRight: ['all', 'bottom', 'right'].includes(corners),
  };
  
  const circuitPattern = (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <pattern id="circuit-grid" width="50" height="50" patternUnits="userSpaceOnUse">
        <path 
          d="M 50 0 L 0 0 L 0 50" 
          fill="none" 
          stroke={isDark ? "#F0B866" : "#38BDF8"} 
          strokeWidth="0.5" 
          strokeOpacity="0.2"
        />
        <circle cx="0" cy="0" r="1" fill={isDark ? "#F0B866" : "#38BDF8"} fillOpacity="0.2" />
        <circle cx="50" cy="0" r="1" fill={isDark ? "#F0B866" : "#38BDF8"} fillOpacity="0.2" />
        <circle cx="0" cy="50" r="1" fill={isDark ? "#F0B866" : "#38BDF8"} fillOpacity="0.2" />
        <circle cx="50" cy="50" r="1" fill={isDark ? "#F0B866" : "#38BDF8"} fillOpacity="0.2" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#circuit-grid)" />
    </svg>
  );
  
  return (
    <motion.div 
      className={`relative overflow-hidden ${className}`}
      initial={animated ? { opacity: 0, y: 20 } : {}}
      whileInView={animated ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
        {circuitPattern}
      </div>
      
      {/* Corner decorations */}
      {showCorners.topLeft && (
        <div className="absolute top-0 left-0 pointer-events-none">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
            <path 
              d={`M ${size} 0 L ${thickness} 0 L ${thickness} ${size-thickness} L 0 ${size-thickness} L 0 ${size} L ${size} ${size}`} 
              fill="none" 
              stroke={isDark ? "#F0B866" : "#38BDF8"} 
              strokeWidth={thickness} 
              strokeOpacity={pulseEffect ? "0.6" : "0.5"}
              className={pulseEffect ? "animate-pulse" : ""}
            />
            <circle 
              cx={thickness} 
              cy={thickness} 
              r={thickness/2} 
              fill={isDark ? "#F0B866" : "#38BDF8"} 
              className={pulseEffect ? "animate-ping" : ""}
            />
          </svg>
        </div>
      )}
      
      {showCorners.topRight && (
        <div className="absolute top-0 right-0 pointer-events-none">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
            <path 
              d={`M 0 0 L ${size-thickness} 0 L ${size-thickness} ${size-thickness} L ${size} ${size-thickness} L ${size} ${size} L 0 ${size}`} 
              fill="none" 
              stroke={isDark ? "#F0B866" : "#38BDF8"} 
              strokeWidth={thickness} 
              strokeOpacity={pulseEffect ? "0.6" : "0.5"}
              className={pulseEffect ? "animate-pulse" : ""}
            />
            <circle 
              cx={size-thickness} 
              cy={thickness} 
              r={thickness/2} 
              fill={isDark ? "#F0B866" : "#38BDF8"} 
              className={pulseEffect ? "animate-ping" : ""}
            />
          </svg>
        </div>
      )}
      
      {showCorners.bottomLeft && (
        <div className="absolute bottom-0 left-0 pointer-events-none">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
            <path 
              d={`M ${size} 0 L ${size} ${size-thickness} L ${thickness} ${size-thickness} L ${thickness} ${size} L 0 ${size} L 0 0`} 
              fill="none" 
              stroke={isDark ? "#F0B866" : "#38BDF8"} 
              strokeWidth={thickness} 
              strokeOpacity={pulseEffect ? "0.6" : "0.5"}
              className={pulseEffect ? "animate-pulse" : ""}
            />
            <circle 
              cx={thickness} 
              cy={size-thickness} 
              r={thickness/2} 
              fill={isDark ? "#F0B866" : "#38BDF8"} 
              className={pulseEffect ? "animate-ping" : ""}
            />
          </svg>
        </div>
      )}
      
      {showCorners.bottomRight && (
        <div className="absolute bottom-0 right-0 pointer-events-none">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
            <path 
              d={`M 0 0 L ${size} 0 L ${size} ${size-thickness} L ${size-thickness} ${size-thickness} L ${size-thickness} ${size} L 0 ${size}`} 
              fill="none" 
              stroke={isDark ? "#F0B866" : "#38BDF8"} 
              strokeWidth={thickness} 
              strokeOpacity={pulseEffect ? "0.6" : "0.5"}
              className={pulseEffect ? "animate-pulse" : ""}
            />
            <circle 
              cx={size-thickness} 
              cy={size-thickness} 
              r={thickness/2} 
              fill={isDark ? "#F0B866" : "#38BDF8"} 
              className={pulseEffect ? "animate-ping" : ""}
            />
          </svg>
        </div>
      )}
      
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};