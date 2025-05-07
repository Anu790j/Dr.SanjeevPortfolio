import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

interface ProfessorData {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  office?: string;
  department?: string;
  university?: string;
  bio?: string;
  socialLinks?: Array<{
    name: string;
    url: string;
    icon: string;
  }>;
}

export const Footer: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const currentYear = new Date().getFullYear();
  const [professorData, setProfessorData] = useState<ProfessorData>({});
  
  useEffect(() => {
    async function fetchProfessorData() {
      try {
        const res = await fetch('/api/professor');
        if (res.ok) {
          const data = await res.json();
          setProfessorData(data);
        }
      } catch (error) {
        console.error('Error fetching professor data:', error);
      }
    }
    
    fetchProfessorData();
  }, []);
  
  // Define categories and their links
  const linkCategories = [
    {
      title: "Main Navigation",
      links: [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Research', href: '/research' },
        { name: 'Publications', href: '/publications' },
        { name: 'Teaching', href: '/teaching' },
      ]
    },
    {
      title: "People",
      links: [
        { name: 'Students', href: '/students' },
        { name: 'Research Team', href: '/students?tab=current' },
        { name: 'Alumni', href: '/students?tab=alumni' },
        { name: 'Opportunities', href: '/students?tab=opportunity' },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: 'Contact', href: '/contact' },
        { name: 'Department Website', href: 'https://ece.iitr.ac.in/', external: true },
        { name: 'IITR Website', href: 'https://www.iitr.ac.in/', external: true },
        { name: 'Admin', href: '/admin', admin: true },
      ]
    }
  ];

  return (
    <footer className={`py-10 backdrop-blur-lg shadow-lg z-10 relative ${
      isDark 
        ? 'bg-circuit-dark/80 border-t border-circuit-dark-blue/30' 
        : 'bg-gray-50/90 border-t border-gray-200'
    }`}>
      <div className="container mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo and About - takes 4 columns */}
          <div className="md:col-span-4">
            <div className="flex items-center mb-4">
              <Image 
                src="/images/iitr-logo.png" 
                alt="IIT Roorkee" 
                width={60} 
                height={60} 
                className="mr-3"
              />
              <div>
                <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {professorData?.name || "Prof. Sanjeev Manhas"}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {professorData?.university || "IIT Roorkee"}
                </p>
              </div>
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              {professorData?.bio || "Professor in the Department of Electronics and Communication Engineering, specializing in Microelectronics and VLSI Design."}
            </p>
      </div>

          {/* Quick Links - each category takes 2 columns */}
          {linkCategories.map((category, idx) => (
            <div key={idx} className="md:col-span-2">
              <h3 className={`font-semibold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {category.title}
              </h3>
              <ul className="space-y-2">
                {category.links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a 
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm transition-colors flex items-center ${
                          isDark 
                            ? 'text-gray-400 hover:text-circuit-light-blue' 
                            : 'text-gray-600 hover:text-osc-blue'
                        }`}
                      >
                        {link.name}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
                      </a>
                    ) : (
                      <Link 
                        href={link.href}
                        className={`text-sm transition-colors ${
                          link.admin 
                            ? isDark 
                              ? 'text-circuit-copper hover:text-circuit-copper/80' 
                              : 'text-comp-gold hover:text-comp-gold/80'
                            : isDark 
                              ? 'text-gray-400 hover:text-circuit-light-blue' 
                              : 'text-gray-600 hover:text-osc-blue'
                        }`}
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Contact Info - takes 4 columns */}
          <div className="md:col-span-4">
            <h3 className={`font-semibold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Contact
            </h3>
            <ul className="space-y-3">
              {professorData?.email && (
                <li className="flex items-start">
                  <div className={`flex-shrink-0 h-5 w-5 mr-2 ${isDark ? 'text-circuit-light-blue' : 'text-osc-blue'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <a 
                    href={`mailto:${professorData.email}`} 
                    className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                  >
                    {professorData.email}
                  </a>
                </li>
              )}
              
              {professorData?.phone && (
                <li className="flex items-start">
                  <div className={`flex-shrink-0 h-5 w-5 mr-2 ${isDark ? 'text-circuit-light-blue' : 'text-osc-blue'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {professorData.phone}
                  </span>
                </li>
              )}
              
              {(professorData?.department || professorData?.university) && (
                <li className="flex items-start">
                  <div className={`flex-shrink-0 h-5 w-5 mr-2 ${isDark ? 'text-circuit-light-blue' : 'text-osc-blue'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {professorData.department && `${professorData.department},`}<br />
                    {professorData.university}{professorData.university && `, Uttarakhand 247667, India`}
                  </span>
                </li>
              )}
            </ul>
            
            {/* Social Links */}
            <div className="mt-6 flex space-x-4">
              {professorData?.socialLinks && professorData.socialLinks.length > 0 ? (
                professorData.socialLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                    aria-label={link.name}
                  >
                    <span dangerouslySetInnerHTML={{ __html: link.icon }} />
                  </a>
                ))
              ) : (
                // Default social links if none provided
                <>
                  <a 
                    href="https://scholar.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                    aria-label="Google Scholar"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 24a12 12 0 110-24 12 12 0 010 24zm-2.961-7.209v2.745h4.843c-.967-1.594-2.015-2.152-2.445-2.394-.43-.243-1.548-.334-2.398-.351zm7.996.704l1.871-1.933c.587.854.879 1.91.879 3.184C19.785 22.118 16.318 24 12 24s-7.785-1.882-7.785-5.254c0-1.274.292-2.331.879-3.184l1.871 1.933C6.541 18.31 6.3 19.276 6.3 20.4c0 1.888 2.148 3.6 5.7 3.6s5.7-1.712 5.7-3.6c0-1.125-.241-2.091-.665-2.905zM8.4 15.3v-2.4h1.8v-1.8H8.4V9.3H6.6v1.8H4.8v1.8h1.8v2.4h1.8zM21.3 9.3h-4.8V11.1h3v1.8h-3v1.8h4.8v-5.4zM15.3 9.3h-1.8v5.4h1.8v-5.4zm-3.6-2.4h-1.8v1.8h1.8V6.9z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://www.linkedin.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                    aria-label="LinkedIn"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className={`mt-12 pt-8 border-t ${isDark ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-500'} text-sm text-center`}>
          <p>© {currentYear} {professorData?.name || "Prof. Sanjeev Manhas"}. All rights reserved.</p>
          <p className="mt-2">
            <span className="px-2">{professorData?.university || "IIT Roorkee"}</span>
            •
            <span className="px-2">{professorData?.department || "Department of Electronics and Communication Engineering"}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};