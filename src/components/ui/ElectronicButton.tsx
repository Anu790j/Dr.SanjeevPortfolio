// src/components/ui/ElectronicButton.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

interface ElectronicButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'circuit';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  animateHover?: boolean;
  external?: boolean;
}

export const ElectronicButton: React.FC<ElectronicButtonProps> = ({
  href,
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  fullWidth = false,
  animateHover = true,
  external = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  // Variant classes
  const variantClasses = {
    primary: isDark 
      ? 'bg-circuit-light-blue text-white hover:bg-blue-500 shadow-lg shadow-circuit-light-blue/20' 
      : 'bg-osc-blue text-white hover:bg-blue-600 shadow-md shadow-osc-blue/20',
    
    secondary: isDark 
      ? 'bg-circuit-copper text-bg-dark hover:bg-yellow-500 shadow-lg shadow-circuit-copper/20' 
      : 'bg-comp-gold text-bg-dark hover:bg-yellow-500 shadow-md shadow-comp-gold/20',
    
    outline: isDark 
      ? 'bg-transparent text-circuit-copper border border-circuit-copper hover:bg-circuit-copper/10' 
      : 'bg-transparent text-comp-gold border border-comp-gold hover:bg-comp-gold/10',
    
    circuit: isDark 
      ? 'bg-bg-dark border border-circuit-copper/30 text-circuit-silver hover:border-circuit-copper/60 hover:text-white' 
      : 'bg-bg-secondary border border-osc-blue/20 text-text-secondary hover:border-osc-blue/40 hover:text-text-primary',
  };
  
  // Combine all classes
  const buttonClasses = `
    rounded-md font-medium transition-all 
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    ${fullWidth ? 'w-full' : ''} 
    ${className}
  `;
  
  // Button with hover animation
  const ButtonContent = () => (
    <span className="flex items-center justify-center">
      {icon && <span className="mr-2">{icon}</span>}
      {children}
      
      {/* Circuit corner accents */}
      {variant === 'circuit' && (
        <>
          <span className={`absolute w-2 h-2 border-t border-l ${isDark ? 'border-circuit-copper' : 'border-osc-blue'} top-0 left-0`}></span>
          <span className={`absolute w-2 h-2 border-t border-r ${isDark ? 'border-circuit-copper' : 'border-osc-blue'} top-0 right-0`}></span>
          <span className={`absolute w-2 h-2 border-b border-l ${isDark ? 'border-circuit-copper' : 'border-osc-blue'} bottom-0 left-0`}></span>
          <span className={`absolute w-2 h-2 border-b border-r ${isDark ? 'border-circuit-copper' : 'border-osc-blue'} bottom-0 right-0`}></span>
        </>
      )}
      
      {/* Decorative LED indicator for primary and secondary */}
      {['primary', 'secondary'].includes(variant) && (
        <span className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${variant === 'primary' ? 'bg-white' : 'bg-bg-dark'} opacity-60`}></span>
      )}
    </span>
  );
  
  // Wrap in motion component if hover animation is enabled
  const ButtonWithAnimation = ({ children }: { children: React.ReactNode }) => {
    if (animateHover) {
      return (
        <motion.div 
          className="relative"
          whileHover={{ y: -2 }}
          whileTap={{ y: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {children}
        </motion.div>
      );
    }
    return <>{children}</>;
  };
  
  // Render as link or button
  if (href) {
    return (
      <ButtonWithAnimation>
        {external ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-block relative ${buttonClasses}`}>
            <ButtonContent />
          </a>
        ) : (
          <Link href={href} className={`inline-block relative ${buttonClasses}`}>
            <ButtonContent />
          </Link>
        )}
      </ButtonWithAnimation>
    );
  }
  
  return (
    <ButtonWithAnimation>
      <button 
        onClick={onClick} 
        className={`relative ${buttonClasses}`}
      >
        <ButtonContent />
      </button>
    </ButtonWithAnimation>
  );
};