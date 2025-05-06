"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { useTheme } from '@/context/ThemeContext';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';

interface Course {
  _id: string;
  title: string;
  code: string;
  description: string;
  semester: string;
  year: number;
  credits: number;
  syllabus?: string;
}

export default function TeachingPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    async function fetchCourses() {
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
    }
    
    fetchCourses();
  }, []);

  return (
    <>
      <Header />
        
        <div className={`min-h-screen pt-24 ${isDark ? 'bg-circuit-dark' : 'bg-bg-primary'} relative`}>
        <AnimatedBackground />
        
        {loading ? (
          <LoadingIndicator message="Loading courses..." fullScreen={true} />
        ) : (
          <main className="container mx-auto px-4 py-10 relative z-10">
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
                    className={`p-6 rounded-lg border border-osc-blue border-opacity-30 ${isDark ? 'bg-bg-dark' : 'bg-bg-secondary'} bg-opacity-80 backdrop-blur-lg`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <h3 className="text-xl font-bold mb-2 text-comp-gold">{course.title}</h3>
                    <p className="text-sm text-text-muted mb-3">{course.code} • {course.semester} {course.year} • {course.credits} Credits</p>
                    <p className="mb-4">{course.description}</p>
                    
                    {course.syllabus && (
                      <a 
                        href={course.syllabus} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-osc-blue hover:underline"
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
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </main>
        )}
      </div>
    </>
  );
}