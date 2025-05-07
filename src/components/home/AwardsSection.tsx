import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { AwardCard } from '@/components/awards/AwardCard';

interface Award {
  _id: string;
  title: string;
  year: number;
  organization: string;
  description?: string;
  imageUrl?: string;
  link?: string;
}

export const AwardsSection: React.FC = () => {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  useEffect(() => {
    async function fetchAwards() {
      try {
        const response = await fetch('/api/awards');
        if (response.ok) {
          const data = await response.json();
          // Get only the latest 4 awards
          setAwards(data.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching awards:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAwards();
  }, []);
  
  if (awards.length === 0 && !loading) {
    return null;
  }
  
  return (
    <section className="container mx-auto max-w-6xl px-4 md:px-8 py-16 relative">
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 -z-10 opacity-5"
        style={{
          backgroundImage: `radial-gradient(${isDark ? '#4F6BFF' : '#3B82F6'} 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      <motion.h2 
        className={`text-2xl md:text-3xl font-semibold mb-10 ${isDark ? 'text-circuit-light-blue' : 'text-osc-blue'} relative inline-block`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        Awards & Honors
        <motion.span 
          className={`absolute -bottom-1 left-0 h-1 ${isDark ? 'bg-circuit-copper' : 'bg-comp-gold'}`}
          initial={{ width: 0 }}
          whileInView={{ width: '4rem' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        />
      </motion.h2>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <div 
              key={i} 
              className={`animate-pulse rounded-lg h-32 ${isDark ? 'bg-circuit-dark' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {awards.map((award, index) => (
            <AwardCard key={award._id} award={award} index={index} />
          ))}
        </div>
      )}
      
      {/* Victory scene */}
      <div className="relative mt-12">
        <svg className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 opacity-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15C15.866 15 19 11.866 19 8V7.5C19 7.224 18.776 7 18.5 7H5.5C5.224 7 5 7.224 5 7.5V8C5 11.866 8.134 15 12 15Z" fill={isDark ? '#78BAFF' : '#3B82F6'} />
          <path d="M13 16.0168V20H16C16.5523 20 17 20.4477 17 21C17 21.5523 16.5523 22 16 22H8C7.44772 22 7 21.5523 7 21C7 20.4477 7.44772 20 8 20H11V16.0168C9.41168 15.8367 7.97348 15.1537 6.87347 14.1202C5.21842 15.5399 4 17.6465 4 20C4 20.5523 3.55228 21 3 21C2.44772 21 2 20.5523 2 20C2 16.9098 3.57399 14.1926 5.85785 12.4855C5.30667 11.4225 5 10.2418 5 9V7C5 5.89543 5.89543 5 7 5H10V3C10 2.44772 10.4477 2 11 2H13C13.5523 2 14 2.44772 14 3V5H17C18.1046 5 19 5.89543 19 7V9C19 10.2418 18.6933 11.4225 18.1421 12.4855C20.426 14.1926 22 16.9098 22 20C22 20.5523 21.5523 21 21 21C20.4477 21 20 20.5523 20 20C20 17.6465 18.7816 15.5399 17.1265 14.1202C16.0265 15.1537 14.5883 15.8367 13 16.0168Z" fill={isDark ? '#F0B866' : '#F59E0B'} />
        </svg>
        
        <motion.div 
          className="text-center relative bg-opacity-10 py-8 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <span className={isDark ? 'text-circuit-copper' : 'text-comp-gold'}>Excellence</span> in research and innovation
          </p>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Recognized contributions to the field of Microelectronics and Semiconductor Devices
          </p>
        </motion.div>
      </div>
    </section>
  );
}; 