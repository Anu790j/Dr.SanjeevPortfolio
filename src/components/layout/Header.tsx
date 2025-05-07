// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useRouter, usePathname } from 'next/navigation';
import { applyPageTransition } from '@/lib/pageTransition';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Research', path: '/research' },
    { name: 'Projects', path: '/projects' },
    { name: 'Students', path: '/students' },
    { name: 'Teaching', path: '/teaching' },
    { name: 'Contact', path: '/contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize page transition
  useEffect(() => {
    const transition = applyPageTransition();
    return () => {
      // Cleanup if needed
    };
  }, []);

  const isDark = theme === 'dark';

  // Custom navigation handler with transition
  const handleNavigation = useCallback((path: string) => {
    // Skip if already on the page
    if (pathname === path) return;
    
    // Get transition handlers
    const overlay = document.getElementById('page-transition-overlay');
    if (overlay) {
      // Start transition
      overlay.classList.add('active');
      
      // Navigate after a brief delay
      setTimeout(() => {
        router.push(path);
        
        // End transition after navigation
        setTimeout(() => {
          overlay.classList.remove('active');
        }, 300);
      }, 150);
    } else {
      // Fallback if overlay doesn't exist
      router.push(path);
    }
  }, [router, pathname]);

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${isScrolled 
        ? `${isDark ? 'bg-circuit-dark/95' : 'bg-bg-light/95'} backdrop-blur-md shadow-card py-3` 
        : 'py-5'}
    `}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          href="/" 
          onClick={(e) => { 
            e.preventDefault(); 
            handleNavigation('/'); 
          }}
          className="flex items-center"
        >
          <div className="w-10 h-10 mr-3 relative">
            {/* Simplified logo */}
            <div className={`absolute inset-0 rounded-full border-2 ${isDark ? 'border-circuit-copper' : 'border-osc-blue'}`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-1 h-3 ${isDark ? 'bg-circuit-light-blue' : 'bg-osc-blue'}`}></div>
              <div className={`w-3 h-1 ${isDark ? 'bg-circuit-light-blue' : 'bg-osc-blue'}`}></div>
            </div>
          </div>
          
          <h1 className="text-xl font-bold">
            <span className={isDark ? 'text-white' : 'text-text-primary'}>Dr. Sanjeev </span>
            <span className={isDark ? 'text-circuit-light-blue' : 'text-osc-blue'}>Manhas</span>
          </h1>
        </Link>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Theme toggle for mobile */}
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-white"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-osc-blue"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          
          <button 
            className={isDark ? 'text-white' : 'text-text-primary'}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span 
                className={`absolute top-2 right-0 block h-0.5 ${isMenuOpen ? 'opacity-0' : 'opacity-100'} ${isDark ? 'bg-white' : 'bg-text-primary'} rounded-full transition-all duration-200`}
                style={{ width: '24px', transform: isMenuOpen ? 'translateX(20px)' : 'none' }}
              />
              <span 
                className={`absolute top-3 right-0 block h-0.5 w-6 ${isDark ? 'bg-white' : 'bg-text-primary'} rounded-full transition-all duration-200`}
                style={{ transform: isMenuOpen ? 'rotate(45deg)' : 'none' }}
              />
              <span 
                className={`absolute top-3 right-0 block h-0.5 w-6 ${isDark ? 'bg-white' : 'bg-text-primary'} rounded-full transition-all duration-200`}
                style={{ transform: isMenuOpen ? 'rotate(-45deg)' : 'none' }}
              />
              <span 
                className={`absolute top-4 right-0 block h-0.5 ${isMenuOpen ? 'opacity-0' : 'opacity-100'} ${isDark ? 'bg-white' : 'bg-text-primary'} rounded-full transition-all duration-200`}
                style={{ width: '16px', transform: isMenuOpen ? 'translateX(20px)' : 'none' }}
              />
            </div>
          </button>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <div
              key={item.path}
              className="transition-all"
            >
              <Link 
                href={item.path}
                onClick={(e) => { 
                  e.preventDefault(); 
                  handleNavigation(item.path); 
                }}
                className={`${isDark ? 'text-white hover:text-circuit-light-blue' : 'text-text-primary hover:text-osc-blue'} relative group font-medium`}
              >
                <span>{item.name}</span>
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDark ? 'bg-circuit-copper' : 'bg-osc-blue'} transition-all duration-300 group-hover:w-full`}></span>
              </Link>
            </div>
          ))}
          
          {/* Theme toggle for desktop */}
          <button 
            onClick={toggleTheme}
            className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 ${isDark ? 'border-circuit-copper hover:border-white' : 'border-osc-blue hover:border-circuit-deep-blue'}`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-white"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-osc-blue"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </nav>
        
        {/* Mobile navigation */}
        <div 
          className={`md:hidden fixed inset-0 z-50 flex flex-col justify-center items-center transition-all duration-300 ${isDark ? 'bg-circuit-dark/95' : 'bg-bg-light/95'} backdrop-blur-md ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <nav className="flex flex-col space-y-6 items-center">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                href={item.path}
                onClick={(e) => { 
                  e.preventDefault(); 
                  handleNavigation(item.path);
                  setIsMenuOpen(false);
                }}
                className={`text-2xl ${isDark ? 'text-white hover:text-circuit-light-blue' : 'text-text-primary hover:text-osc-blue'} relative group font-medium`}
              >
                <span>{item.name}</span>
                <span className={`absolute -bottom-2 left-0 w-0 h-px ${isDark ? 'bg-circuit-copper' : 'bg-osc-blue'} transition-all duration-300 group-hover:w-full`}></span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}