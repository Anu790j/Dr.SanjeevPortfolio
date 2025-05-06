// src/components/ui/CircuitNavigation.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

interface CircuitNavigationProps {
  items: NavItem[];
  className?: string;
}

export const CircuitNavigation: React.FC<CircuitNavigationProps> = ({ items, className = '' }) => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <nav className={`relative py-6 ${className}`}>
      {/* Horizontal circuit trace */}
      <div className={`absolute top-1/2 left-0 w-full h-0.5 ${isDark ? 'bg-circuit-copper/50' : 'bg-osc-blue/30'} transform -translate-y-1/2`} />
      
      {/* Circuit dots along the trace */}
      <div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2 flex justify-between px-4">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className={`w-1 h-1 rounded-full ${isDark ? 'bg-circuit-copper/70' : 'bg-osc-blue/50'}`}
          />
        ))}
      </div>
      
      <ul className="flex justify-center relative z-10">
        {items.map((item, index) => {
          const isActive = pathname === item.href;
          
          return (
            <li key={item.name} className="relative mx-3">
              {/* Circuit node */}
              <motion.div 
                className={`absolute rounded-full w-3 h-3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                  isActive 
                    ? isDark 
                      ? 'bg-circuit-light-blue shadow-glow-sm shadow-circuit-light-blue/50' 
                      : 'bg-comp-gold shadow-glow-sm shadow-comp-gold/50'
                    : isDark 
                      ? 'bg-circuit-silver/50' 
                      : 'bg-text-muted/50'
                }`}
                animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Vertical trace to button */}
              <div className={`absolute w-0.5 h-6 ${isDark ? 'bg-circuit-copper/70' : 'bg-osc-blue/50'} top-1/2 left-1/2 transform -translate-x-1/2`} />
              
              {/* Navigation button */}
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link 
                  href={item.href}
                  className={`relative block mt-8 px-4 py-2 rounded-md transition-all ${
                    isActive 
                      ? isDark 
                        ? 'bg-circuit-light-blue text-white border border-circuit-light-blue/70 shadow-md shadow-circuit-light-blue/20' 
                        : 'bg-comp-gold text-white border border-comp-gold/70 shadow-md shadow-comp-gold/20'
                      : isDark 
                        ? 'bg-bg-dark/80 text-circuit-silver border border-circuit-copper/30 hover:bg-circuit-copper/10 hover:text-white hover:border-circuit-copper/50' 
                        : 'bg-bg-secondary text-text-secondary border border-osc-blue/20 hover:bg-osc-blue/10 hover:text-text-primary hover:border-osc-blue/40'
                  }`}
                >
                  <div className="flex items-center">
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    <span>{item.name}</span>
                  </div>
                  
                  {/* Active indicator dot */}
                  {isActive && (
                    <motion.div 
                      className={`absolute -right-1 -top-1 w-2 h-2 rounded-full ${isDark ? 'bg-circuit-copper' : 'bg-comp-gold'}`}
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </Link>
              </motion.div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};