"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { useTheme } from '@/context/ThemeContext';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { StudentCard } from '@/components/students/StudentCard';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { Footer } from '@/components/layout/Footer';

interface Student {
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
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'current' | 'alumni' | 'opportunity'>('all');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const response = await fetch('/api/students');
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  useEffect(() => {
    if (students && students.length > 0) {
      if (activeTab === 'all') {
        setFilteredStudents(students);
      } else {
        setFilteredStudents(students.filter(student => student.category === activeTab));
      }
    }
  }, [students, activeTab]);

  const tabs = [
    { id: 'all', label: 'All Students' },
    { id: 'current', label: 'Current Students' },
    { id: 'alumni', label: 'Alumni' },
    { id: 'opportunity', label: 'Opportunities' }
  ];

  return (
    <>
      <Header />
      <div className={isDark ? 'bg-circuit-dark' : 'bg-bg-primary'}>
        <AnimatedBackground />
        
        <main className="relative z-10 min-h-screen">
          <div className="container mx-auto max-w-6xl px-4 pt-24 pb-16">
            <motion.h1 
              className={`text-3xl md:text-4xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-800'}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Students & Opportunities
            </motion.h1>

            <motion.p 
              className={`mb-8 text-lg text-center max-w-3xl mx-auto ${isDark ? 'text-circuit-silver' : 'text-text-secondary'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Meet our talented research team members, alumni, and learn about opportunities to join our research group.
            </motion.p>

            <motion.div 
              className="mb-8 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className={`inline-flex border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 text-sm md:text-base font-medium transition-colors relative
                      ${activeTab === tab.id
                        ? isDark
                          ? 'text-circuit-light-blue'
                          : 'text-osc-blue'
                        : isDark
                          ? 'text-gray-400 hover:text-gray-300'
                          : 'text-gray-500 hover:text-gray-700'
                      }
                    `}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        className={`absolute h-0.5 left-0 right-0 bottom-0 ${
                          isDark ? 'bg-circuit-light-blue' : 'bg-osc-blue'
                        }`}
                        layoutId="activeStudentTab"
                      />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {loading ? (
              <LoadingIndicator message="Loading students..." />
            ) : (
              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {filteredStudents.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {filteredStudents.map((student, index) => (
                          <StudentCard key={student._id} student={student} index={index} />
                        ))}
                      </div>
                    ) : (
                      <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {activeTab === 'opportunity' ? (
                          <div>
                            <h3 className="text-xl font-medium mb-4">No Current Opportunities</h3>
                            <p>There are currently no open positions or opportunities available.</p>
                            <p className="mt-2">Please check back later or contact for more information.</p>
                          </div>
                        ) : (
                          <div>
                            <h3 className="text-xl font-medium mb-4">No Students Found</h3>
                            <p>No {activeTab === 'all' ? '' : activeTab} students found.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
} 