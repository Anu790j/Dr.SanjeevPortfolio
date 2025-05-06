import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import { useState } from 'react';

export interface ProjectCardProps {
  title: string;
  description: string;
  status: 'ongoing' | 'completed';
  imageUrl: string;
  startDate?: Date;
  endDate?: Date;
  collaborators?: string[];
  funding?: string;
  index?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  status,
  imageUrl,
  startDate,
  endDate,
  collaborators,
  funding,
  index = 0
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isHovered, setIsHovered] = useState(false);
  
  // Animation variants for staggered children animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: index * 0.1,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const statusColor = status === 'ongoing' 
    ? isDark ? 'text-circuit-light-blue bg-circuit-dark' : 'text-osc-blue bg-bg-accent' 
    : isDark ? 'text-circuit-copper bg-circuit-dark' : 'text-comp-gold bg-bg-accent';
  
  return (
    <motion.div
      className={`rounded-lg overflow-hidden shadow-lg ${isDark ? 'bg-bg-dark' : 'bg-bg-secondary'} border ${isDark ? 'border-circuit-copper/10' : 'border-osc-blue/5'} relative`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: isDark ? '0 0 15px rgba(240, 184, 102, 0.1)' : '0 0 15px rgba(37, 99, 235, 0.1)'
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Softer Border Effect */}
      <motion.div 
        className="absolute inset-0 rounded-lg z-0 opacity-0"
        animate={{
          opacity: isHovered ? 0.3 : 0,
          boxShadow: isHovered 
            ? isDark ? 'inset 0 0 10px rgba(240, 184, 102, 0.2)' : 'inset 0 0 10px rgba(37, 99, 235, 0.2)'
            : 'inset 0 0 0px rgba(0, 0, 0, 0)'
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Reduced Corner Accents */}
      {[...Array(4)].map((_, i) => (
        <motion.div 
          key={i}
          className={`absolute w-2 h-2 rounded-full ${isDark ? 'bg-circuit-light-blue/80' : 'bg-osc-blue/80'} z-10`}
          style={{
            top: i < 2 ? '4px' : 'auto',
            bottom: i >= 2 ? '4px' : 'auto',
            left: i % 2 === 0 ? '4px' : 'auto',
            right: i % 2 === 1 ? '4px' : 'auto',
          }}
          initial={{ scale: 0 }}
          animate={{ 
            scale: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.2, delay: 0.1 * i }}
        />
      ))}
      
      {/* Project Image with subtle hover effect */}
      <div className="relative overflow-hidden h-48">
        <motion.div
          className="h-full w-full"
          animate={{ 
            scale: isHovered ? 1.03 : 1,
          }}
          transition={{ duration: 0.4 }}
        >
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={title} 
              layout="fill" 
              objectFit="cover" 
              className="transition-all duration-500"
              quality={90}
            />
          ) : (
            <div className={`h-full w-full flex items-center justify-center ${isDark ? 'bg-circuit-dark' : 'bg-bg-accent'}`}>
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-12 w-12 ${isDark ? 'text-circuit-light-blue' : 'text-osc-blue'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                animate={{ 
                  scale: isHovered ? 1.1 : 1 
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </motion.svg>
            </div>
          )}
        </motion.div>
        
        {/* Status Badge */}
        <motion.div 
          className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium ${statusColor}`}
          variants={itemVariants}
          animate={{ 
            y: isHovered ? -2 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          {status === 'ongoing' ? 'Ongoing' : 'Completed'}
        </motion.div>
      </div>
      
      {/* Content */}
      <div className="p-5 relative">
        {/* Static Circuit Pattern */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ 
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: '30px 30px',
          }}
        />
        
        {/* Title with animated underline */}
        <div className="mb-3 relative">
          <motion.h3 
            className={`text-xl font-semibold ${isDark ? 'text-text-light' : 'text-text-primary'}`}
            variants={itemVariants}
          >
            {title}
          </motion.h3>
          <motion.div 
            className={`h-0.5 ${isDark ? 'bg-circuit-copper/30' : 'bg-osc-blue/30'} mt-1 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: isHovered ? '100%' : '40%' }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* Description */}
        <motion.p 
          className={`text-sm mb-4 ${isDark ? 'text-text-secondary' : 'text-text-secondary'}`}
          variants={itemVariants}
        >
          {description}
        </motion.p>
        
        {/* Date Range */}
        {(startDate || endDate) && (
          <motion.div 
            className="flex items-center mb-2"
            variants={itemVariants}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 mr-2 ${isDark ? 'text-circuit-silver' : 'text-text-secondary'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={`text-xs ${isDark ? 'text-circuit-silver' : 'text-text-secondary'}`}>
              {startDate && startDate.getFullYear()}
              {endDate ? ` - ${endDate.getFullYear()}` : ' - Present'}
            </span>
          </motion.div>
        )}
        
        {/* Funding (if available) */}
        {funding && (
          <motion.div 
            className="flex items-center mb-2"
            variants={itemVariants}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 mr-2 ${isDark ? 'text-circuit-silver' : 'text-text-secondary'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`text-xs ${isDark ? 'text-circuit-silver' : 'text-text-secondary'}`}>
              {funding}
            </span>
          </motion.div>
        )}
        
        {/* Collaborators (if available) */}
        {collaborators && collaborators.length > 0 && (
          <motion.div 
            className="flex flex-wrap mt-3"
            variants={itemVariants}
          >
            {collaborators.map((collaborator, i) => (
              <motion.span 
                key={i}
                className={`text-xs mr-2 mb-1 px-2 py-1 rounded-full ${
                  isDark 
                    ? 'bg-circuit-dark text-circuit-silver' 
                    : 'bg-bg-accent text-text-secondary'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: isHovered ? -1 : 0
                }}
                transition={{ 
                  duration: 0.2, 
                  delay: 0.1 + (i * 0.05)
                }}
                whileHover={{ scale: 1.03 }}
              >
                {collaborator}
              </motion.span>
            ))}
          </motion.div>
        )}
        
        {/* View Details button (subtle animation) */}
        <motion.button
          className={`mt-4 px-4 py-2 rounded-md text-sm font-medium ${
            isDark 
              ? 'bg-transparent border border-circuit-copper/30 text-circuit-copper hover:bg-circuit-copper/10' 
              : 'bg-transparent border border-osc-blue/30 text-osc-blue hover:bg-osc-blue/10'
          } flex items-center justify-center w-full transition-colors`}
          variants={itemVariants}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>View Details</span>
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ x: isHovered ? 2 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </motion.svg>
        </motion.button>
      </div>
    </motion.div>
  );
}; 