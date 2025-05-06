// src/components/ui/WaveformDivider.tsx
"use client";

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

export const WaveformDivider: React.FC = () => {
  // Store the path data for the ECG-like waveform
  const [pathData, setPathData] = useState("");
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Add these hooks inside the component
  const x = useMotionValue(1200);
  
  // Transform x position to opacity
  const beepOpacity = useTransform(x, (value) => {
    const beatWidth = 1200 / 6;
    const relativeBeatPosition = (value % beatWidth) / beatWidth;
    return (relativeBeatPosition >= 0.28 && relativeBeatPosition <= 0.29) ? 0.8 : 0;
  });
  
  // Similar transform for the BEEP text
  const textOpacity = useTransform(x, (value) => {
    const beatWidth = 1200 / 6;
    const relativeBeatPosition = (value % beatWidth) / beatWidth;
    return (relativeBeatPosition >= 0.28 && relativeBeatPosition <= 0.32) ? 1 : 0;
  });

  // Animate the dot position based on the waveform
  const dotY = useTransform(x, (value) => {
    const beatWidth = 1200 / 6;
    const relativeBeatPosition = (value % beatWidth) / beatWidth;
    
    if (relativeBeatPosition < 0.2) return 20;
    else if (relativeBeatPosition < 0.25) return 20;
    else if (relativeBeatPosition < 0.28) {
      const progress = (relativeBeatPosition - 0.25) / 0.03;
      return 20 - (progress * 15);
    }
    else if (relativeBeatPosition < 0.31) {
      const progress = (relativeBeatPosition - 0.28) / 0.03;
      return 5 + (progress * 25);
    }
    else if (relativeBeatPosition < 0.35) return 30;
    else if (relativeBeatPosition < 0.4) {
      const progress = (relativeBeatPosition - 0.35) / 0.05;
      return 30 - (progress * 10);
    }
    else return 20;
  });

  // Same for the glow effect
  const glowY = useTransform(x, (value) => {
    const beatWidth = 1200 / 6;
    const relativeBeatPosition = (value % beatWidth) / beatWidth;
    
    if (relativeBeatPosition < 0.2) return 20;
    else if (relativeBeatPosition < 0.25) return 20;
    else if (relativeBeatPosition < 0.28) {
      const progress = (relativeBeatPosition - 0.25) / 0.03;
      return 20 - (progress * 15);
    } 
    else if (relativeBeatPosition < 0.31) {
      const progress = (relativeBeatPosition - 0.28) / 0.03;
      return 5 + (progress * 25);
    }
    else if (relativeBeatPosition < 0.35) return 30;
    else if (relativeBeatPosition < 0.4) {
      const progress = (relativeBeatPosition - 0.35) / 0.05;
      return 30 - (progress * 10);
    }
    else return 20;
  });

  // Start the animation when component mounts
  useEffect(() => {
    animate(x, -2400, {
      duration: 20,
      repeat: Infinity,
      repeatType: "loop",
      ease: "linear"
    });
  }, [x]);

  // Generate the ECG-like path on component mount
  useEffect(() => {
    // Generate an ECG-like pattern with sharp peaks
    let path = "M0,20 ";
    const width = 1200;
    
    // Create multiple heartbeat patterns across the width
    const beats = 6; // Number of heartbeats
    const beatWidth = width / beats;
    
    for (let i = 0; i < beats; i++) {
      const startX = i * beatWidth;
      
      // Flat line segment (baseline)
      path += `L${startX + beatWidth * 0.2},20 `;
      
      // Sharp upward spike (R wave)
      path += `L${startX + beatWidth * 0.25},20 `; // Start of spike
      path += `L${startX + beatWidth * 0.28},5 `;  // Sharp peak
      
      // Sharp downward movement (S wave)
      path += `L${startX + beatWidth * 0.31},30 `;
      
      // Return to baseline with small bump (T wave)
      path += `L${startX + beatWidth * 0.35},18 `;
      path += `L${startX + beatWidth * 0.4},22 `;
      
      // Back to baseline for the rest of the segment
      path += `L${startX + beatWidth * 0.45},20 `;
      path += `L${startX + beatWidth},20 `;
    }
    
    setPathData(path);
  }, []);

  return (
    <div className="py-4 relative">
      <div className={`relative h-16 w-full overflow-hidden ${isDark ? 'bg-bg-dark' : 'bg-bg-secondary'} rounded-md shadow-md`}>
        {/* Grid lines like an oscilloscope */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(8)].map((_, i) => (
            <div 
              key={`h-${i}`} 
              className="absolute w-full h-px bg-text-muted" 
              style={{ top: `${(i+1) * 12.5}%` }}
            />
          ))}
          {[...Array(20)].map((_, i) => (
            <div 
              key={`v-${i}`} 
              className="absolute top-0 bottom-0 w-px bg-text-muted" 
              style={{ left: `${(i+1) * 5}%` }}
            />
          ))}
        </div>
        
        <svg className="w-full h-full" viewBox="0 0 1200 40" xmlns="http://www.w3.org/2000/svg">
          {/* The baseline (flatline) */}
          <line
            x1="0" y1="20" x2="1200" y2="20"
            stroke={isDark ? "#38BDF8" : "#0284C7"}
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
          
          {/* The ECG waveform path */}
          {pathData && (
            <motion.path
              d={pathData}
              stroke={isDark ? "#38BDF8" : "#0284C7"}
              strokeWidth="2"
              fill="none"
              filter={`drop-shadow(0 0 3px ${isDark ? "rgba(56, 189, 248, 0.7)" : "rgba(2, 132, 199, 0.5)"})`}
              initial={{ pathLength: 0, pathOffset: 0 }}
              animate={{ 
                pathLength: 1,
                pathOffset: [-1, 0]
              }}
              transition={{ 
                pathLength: { duration: 2, delay: 0.5 },
                pathOffset: { 
                  duration: 10, 
                  repeat: Infinity, 
                  ease: "linear",
                }
              }}
            />
          )}  
          
          {/* Moving dot on the path */}
          <motion.circle 
            cx={0} 
            cy={dotY} 
            r="3" 
            fill={isDark ? "#F0B866" : "#F59E0B"} 
            style={{ x }} 
          />
          
          {/* Pulse glow effect */}
          <motion.circle 
            cx={0} 
            cy={glowY} 
            r="6" 
            fill="transparent"
            stroke={isDark ? "#F0B866" : "#F59E0B"}
            strokeWidth="1"
            style={{ 
              x,
              opacity: beepOpacity 
            }} 
          />
        </svg>
        
        {/* "BEEP" indicator text */}
        <motion.div 
          className="absolute right-4 top-4 text-xs font-mono"
          style={{ 
            opacity: textOpacity,
            color: isDark ? "#F0B866" : "#F59E0B"
          }}
        >
          SIGNAL
        </motion.div>
        
        {/* Additional effects */}
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-${isDark ? 'osc-blue' : 'comp-gold'} to-transparent opacity-5`}></div>
        
        {/* Label to indicate this is an oscilloscope view */}
        <div className={`absolute left-4 top-2 text-xs font-mono ${isDark ? 'text-circuit-silver' : 'text-text-secondary'} opacity-60`}>
          OSC: 200mV/div
        </div>
      </div>
    </div>
  );
};