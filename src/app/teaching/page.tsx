"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { useTheme } from '@/context/ThemeContext';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { Footer } from '@/components/layout/Footer';

interface Course {
  _id: string;
  title: string;
  code: string;
  description: string;
  semester: string;
  year: number;
  credits: number;
  syllabus?: string;
  imageUrl?: string;
  level: string;
}

export default function TeachingPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/course');
        if (!res.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Generate proper image URL from the imageUrl ID
  const getImageUrl = (imageId: string) => {
    if (!imageId) return '/images/placeholder-course.jpg';
    // Check if it's already a path or needs to be converted to API endpoint
    return imageId.startsWith('/') ? imageId : `/api/files/${imageId}`;
  };

  return (
    <>
      <Header />
        
        <div className={`min-h-screen pt-24 ${isDark ? 'bg-circuit-dark' : 'bg-bg-primary'} relative`}>
        <AnimatedBackground />
        
        {loading ? (
          <LoadingIndicator message="Loading courses..." fullScreen={true} />
        ) : (
          <main className="container mx-auto max-w-6xl px-4 md:px-8 py-10 relative z-10">
          <section>
            <motion.h1 
              className={`text-3xl md:text-4xl font-bold mb-6 ${isDark ? 'text-circuit-light-blue' : 'text-osc-blue'}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Teaching
            </motion.h1>
            
            <motion.p 
              className={`mb-8 text-lg ${isDark ? 'text-text-light' : 'text-text-primary'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Courses taught in the area of Microelectronics, VLSI Design, and Semiconductor Devices.
            </motion.p>
            
              {error ? (
              <div className="text-center py-10 text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {courses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    className={`overflow-hidden rounded-lg border ${isDark ? 'bg-bg-dark border-osc-blue/30' : 'bg-white border-gray-200'} shadow-sm`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
                  >
                    {course.imageUrl ? (
                      <div className="relative h-48 w-full">
                        <Image 
                          src={getImageUrl(course.imageUrl)}
                          alt={course.title}
                          fill
                          className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                        />
                        <div className={`absolute top-3 right-3 py-1 px-3 text-xs font-medium rounded-full ${
                          isDark 
                            ? 'bg-bg-dark text-circuit-copper' 
                            : 'bg-white text-comp-gold'
                        }`}>
                          {course.level}
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-48 w-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                        <div className={`py-1 px-3 text-xs font-medium rounded-full ${
                          isDark 
                            ? 'bg-bg-dark text-circuit-copper' 
                            : 'bg-white text-comp-gold'
                        }`}>
                          {course.level}
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`text-xl font-bold ${isDark ? 'text-comp-gold' : 'text-comp-gold'}`}>{course.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDark 
                            ? 'bg-circuit-dark-blue/20 text-circuit-light-blue' 
                            : 'bg-osc-blue/10 text-osc-blue'
                        }`}>
                          {course.code}
                        </span>
                      </div>
                      
                      <div className="flex items-center mb-3 text-sm">
                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mr-3`}>
                          {course.semester} {course.year}
                        </span>
                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {course.credits} Credits
                        </span>
                      </div>
                      
                      <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {course.description}
                      </p>
                      
                      {course.syllabus && (
                        <a 
                          href={course.syllabus} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`inline-flex items-center text-sm ${
                            isDark 
                              ? 'text-circuit-copper hover:text-circuit-copper/80' 
                              : 'text-comp-gold hover:text-comp-gold/80'
                          }`}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-4 w-4 mr-1" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          View Syllabus
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </main>
        )}
      </div>
      <Footer />
    </>
  );
}