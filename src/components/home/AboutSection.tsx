import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';

interface AboutSectionProps {
  professor?: {
    name?: string;
    department?: string;
    university?: string;
    bio?: string;
  };
}

export const AboutSection: React.FC<AboutSectionProps> = ({ professor }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <section className="container mx-auto max-w-6xl px-4 md:px-8 py-16 relative">
      {/* Circuit pattern background */}
      <div 
        className="absolute inset-0 -z-10 opacity-5 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? 'url("/images/circuit-pattern-dark.svg")'
            : 'url("/images/circuit-pattern-light.svg")',
          backgroundSize: '400px',
          backgroundPosition: 'center'
        }}
      ></div>
      
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2 
          className={`text-2xl md:text-3xl font-semibold mb-6 ${isDark ? 'text-circuit-light-blue' : 'text-osc-blue'}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          About Me
        </motion.h2>
        
        <motion.div
          className={`mt-8 text-base md:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-4`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p>
            {professor?.bio || 
            `I am a Professor in the ${professor?.department || 'Department of Electronics and Communication Engineering'} 
            at ${professor?.university || 'Indian Institute of Technology Roorkee'}. 
            With expertise in Microelectronics, VLSI Design, and Semiconductor Devices, 
            my research focuses on advancing electronic technologies and developing innovative solutions.`}
          </p>
          
          <p>
            Throughout my career, I have collaborated with industry partners and academic institutions worldwide, 
            mentored numerous students, and published extensively in prestigious journals.
          </p>
        </motion.div>
        
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link href="/about">
            <motion.button 
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                isDark 
                  ? 'bg-circuit-dark-blue text-white hover:bg-circuit-dark-blue/80' 
                  : 'bg-osc-blue text-white hover:bg-osc-blue/80'
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center">
                <span>More About Me</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}; 