import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

export const Footer: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className={`${isDark ? 'bg-circuit-dark border-t border-circuit-copper/30' : 'bg-bg-secondary border-t border-osc-blue/10'} relative overflow-hidden`}>
      {/* Circuit pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="circuitPattern" patternUnits="userSpaceOnUse" width="100" height="100" x="0" y="0">
            <path 
              d="M10 10h80v80h-80z M30 10v20h20v20h20v20M50 10v20M70 10v20M30 50h20M30 70h20M50 70v20M70 70v20" 
              fill="none" 
              stroke={isDark ? '#F0B866' : '#2563eb'} 
              strokeWidth="1" 
              strokeOpacity="0.3"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuitPattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-circuit-copper' : 'text-comp-gold'} flex items-center`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Contact
            </h3>
            <address className={`${isDark ? 'text-circuit-silver' : 'text-text-secondary'} not-italic space-y-2`}>
              <p className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>
                  Department of Electronics and Communication Engineering<br />
                  Indian Institute of Technology Roorkee<br />
                  Roorkee, Uttarakhand, India - 247667
                </span>
              </p>
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:sanjeev.manhas@ece.iitr.ac.in" className={`${isDark ? 'text-circuit-light-blue hover:text-white' : 'text-osc-blue hover:text-text-primary'} transition-colors`}>
                  sanjeev.manhas@ece.iitr.ac.in
                </a>
              </p>
            </address>
          </div>
          
          <div>
            <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-circuit-copper' : 'text-comp-gold'} flex items-center`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Quick Links
            </h3>
            <ul className={`${isDark ? 'text-circuit-silver' : 'text-text-secondary'} space-y-3`}>
              <li>
                <Link href="/research" className={`flex items-center ${isDark ? 'hover:text-white' : 'hover:text-text-primary'} transition-colors group`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform">Research</span>
                </Link>
              </li>
              <li>
                <Link href="/teaching" className={`flex items-center ${isDark ? 'hover:text-white' : 'hover:text-text-primary'} transition-colors group`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform">Teaching</span>
                </Link>
              </li>
              <li>
                <Link href="/projects" className={`flex items-center ${isDark ? 'hover:text-white' : 'hover:text-text-primary'} transition-colors group`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform">Projects</span>
                </Link>
              </li>
              <li>
                <a href="https://iitr.ac.in" target="_blank" rel="noopener noreferrer" className={`flex items-center ${isDark ? 'hover:text-white' : 'hover:text-text-primary'} transition-colors group`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform">IIT Roorkee</span>
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-circuit-copper' : 'text-comp-gold'} flex items-center`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About This Site
            </h3>
            <div className={`${isDark ? 'text-circuit-silver' : 'text-text-secondary'} space-y-4`}>
              <p className="text-sm">
                © {new Date().getFullYear()} Dr. Sanjeev Manhas. All rights reserved.
              </p>
              <p className="text-sm">
                Website design inspired by electronic circuit boards and VLSI design patterns, reflecting the research focus in microelectronics.
              </p>
              <div className={`mt-4 p-3 text-xs rounded-md ${isDark ? 'bg-bg-dark' : 'bg-white'} border ${isDark ? 'border-circuit-copper/20' : 'border-osc-blue/10'}`}>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${isDark ? 'bg-circuit-copper' : 'bg-comp-gold'}`}></div>
                  <span>Last Updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`mt-12 pt-6 border-t ${isDark ? 'border-circuit-copper/20' : 'border-osc-blue/10'} text-center text-sm ${isDark ? 'text-text-muted' : 'text-text-secondary'}`}>
          <p>
            Department of Electronics and Communication Engineering, IIT Roorkee
          </p>
        </div>
      </div>
    </footer>
  );
};