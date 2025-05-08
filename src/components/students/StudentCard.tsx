import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface StudentCardProps {
  student: {
    _id: string;
    name: string;
    category: 'current' | 'alumni' | 'opportunity';
    email?: string;
    photoUrl?: string;
    degree?: string;
    researchArea?: string;
    startYear?: number;
    endYear?: number;
    linkedin?: string;
    position?: string;
    description?: string;
  };
  index: number;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, index }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Get the correct image source - either from API or placeholder
  const imageSrc = student.photoUrl 
    ? `/api/files/${student.photoUrl}` 
    : '/images/placeholder-profile.jpg';
  
  return (
    <motion.div
      className={`w-full aspect-square max-w-[300px] mx-auto rounded-lg p-4 backdrop-blur-lg overflow-hidden ${
        isDark 
          ? 'bg-circuit-dark/60 border border-circuit-light-blue/20' 
          : 'bg-white/70 shadow-md'
      } transition-all flex flex-col justify-between`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: isDark 
          ? '0 8px 32px rgba(120, 186, 255, 0.15)' 
          : '0 8px 32px rgba(59, 130, 246, 0.15)'
      }}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="flex justify-center">
          <div className={`relative w-24 h-24 rounded-full overflow-hidden border-2 ${
            isDark ? 'border-circuit-copper' : 'border-osc-blue'
          }`}>
            <Image
              src={imageSrc}
              alt={student.name}
              fill
              className="object-cover"
            />
            <div className={`absolute inset-0 opacity-20 ${
              isDark ? 'circuit-overlay-dark' : 'circuit-overlay-light'
            }`}></div>
          </div>
        </div>
        
        <div className="w-full">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {student.name}
          </h3>
          
          {student.position && (
            <p className={`mt-1 text-sm ${isDark ? 'text-circuit-silver' : 'text-gray-600'}`}>
              {student.position}
            </p>
          )}
          
          {student.degree && (
            <p className={`text-xs mt-1 ${isDark ? 'text-circuit-silver' : 'text-gray-600'}`}>
              {student.degree}
              {student.startYear && (
                <span className="ml-1">
                  ({student.startYear}{student.endYear ? ` - ${student.endYear}` : ' - Present'})
                </span>
              )}
            </p>
          )}
          
          {student.researchArea && (
            <p className={`mt-2 text-xs ${isDark ? 'text-circuit-light-blue' : 'text-osc-blue'} font-medium`}>
              Research Area: {student.researchArea}
            </p>
          )}
          
          
          {student.description && student.description.length > 0 && (
            <p className={`mt-2 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {student.description.length > 100 
                ? `${student.description.substring(0, 100)}...` 
                : student.description
              }
            </p>
          )}
          
          <div className="mt-3 flex justify-center flex-wrap gap-2">
            {student.email && (
              <a 
                href={`mailto:${student.email}`}
                className={`text-xs px-2 py-1 rounded-full ${
                  isDark 
                    ? 'bg-circuit-dark-blue text-white hover:bg-circuit-dark-blue/80' 
                    : 'bg-osc-blue/10 text-osc-blue hover:bg-osc-blue/20'
                } transition-colors`}
              >
                <i className="fas fa-envelope mr-1"></i> Email
              </a>
            )}
            
            {student.linkedin && (
              <a 
                href={student.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs px-2 py-1 rounded-full ${
                  isDark 
                    ? 'bg-[#0077b5]/20 text-[#0077b5] hover:bg-[#0077b5]/30' 
                    : 'bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20'
                } transition-colors`}
              >
                <i className="fab fa-linkedin mr-1"></i> LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 