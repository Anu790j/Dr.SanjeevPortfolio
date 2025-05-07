"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { useTheme } from '@/context/ThemeContext';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import Image from 'next/image';
import { BlurCard } from '@/components/ui/BlurCard';
import { Footer } from '@/components/layout/Footer';

interface ProfessorData {
  name: string;
  title: string;
  department?: string;
  university?: string;
  bio?: string;
  biography?: string;
  photoUrl?: string;
  profileImage?: string;
  education?: Array<{
    degree: string;
    institution: string;
    year: number;
    field?: string;
  }>;
  experience?: Array<{
    position: string;
    institution: string;
    period: string;
    description?: string;
  }>;
  awards?: Array<{
    title: string;
    year: number;
    organization: string;
    description?: string;
  }>;
  researchInterests?: string[];
}

export default function AboutPage() {
  const [professor, setProfessor] = useState<ProfessorData | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    async function fetchProfessorData() {
      try {
        const response = await fetch('/api/professor');
        if (response.ok) {
          const data = await response.json();
          setProfessor(data);
        }
      } catch (error) {
        console.error('Error fetching professor data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfessorData();
  }, []);

  // Also fetch awards in case they're not in the professor profile
  const [awards, setAwards] = useState<any[]>([]);
  
  useEffect(() => {
    async function fetchAwards() {
      try {
        const response = await fetch('/api/awards');
        if (response.ok) {
          const data = await response.json();
          setAwards(data);
        }
      } catch (error) {
        console.error('Error fetching awards:', error);
      }
    }
    
    fetchAwards();
  }, []);

  return (
    <>
      <Header />
      <div className={isDark ? 'bg-circuit-dark' : 'bg-bg-primary'}>
        <AnimatedBackground />
        
        {loading ? (
          <LoadingIndicator message="Loading professor data..." fullScreen={true} />
        ) : (
          <main className="relative z-10">
            {/* Hero Section */}
            <section className="px-4 md:px-8 pt-24 pb-16 relative overflow-hidden">
              <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row items-center gap-12">
                  {/* Profile Image */}
                  <motion.div 
                    className="md:w-1/3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative w-full max-w-xs mx-auto">
                      <div className={`absolute inset-0 rounded-lg -m-2 bg-gradient-to-tr ${
                        isDark 
                          ? 'from-circuit-copper via-circuit-light-blue to-circuit-copper' 
                          : 'from-comp-gold via-osc-blue to-comp-gold'
                      } opacity-20 blur-md`}></div>
                      
                      <div className="relative rounded-lg overflow-hidden">
                        <Image
                          src={professor?.profileImage ? `/api/files/${professor.profileImage}` : "/images/bg.jpg"}
                          alt={professor?.name || "Professor Sanjeev Manhas"}
                          width={400}
                          height={500}
                          className="w-full h-auto object-cover"
                          priority
                        />
                        
                        {/* Circuit overlay */}
                        <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Bio content */}
                  <motion.div 
                    className="md:w-2/3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {professor?.name || "Dr. Sanjeev Manhas"}
                    </h1>
                    
                    <h2 className={`text-xl mb-6 ${isDark ? 'text-circuit-silver' : 'text-gray-600'}`}>
                      {professor?.title || "Professor"}, {professor?.department || "Department of Electronics and Communication Engineering"}
                    </h2>
                    
                    <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
                      <p className="text-lg">
                        {professor?.biography || 
                        `With over 20 years of experience in teaching and research, I have contributed significantly 
                        to the field of electronics through various projects, publications, and mentorship of graduate students.
                        My work focuses on advancing semiconductor technology and VLSI design for next-generation applications.`}
                      </p>
                    </div>
                    
                    {/* Quick stats */}
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Experience", value: professor?.experience?.length || "20+ Years" },
                        { label: "Publications", value: "120+" },
                        { label: "Research Projects", value: "35+" },
                        { label: "Students Mentored", value: "25+" }
                      ].map((stat, index) => (
                        <motion.div 
                          key={index}
                          className={`p-4 rounded-lg text-center backdrop-blur-lg ${
                            isDark 
                              ? 'bg-circuit-dark/50 border border-circuit-light-blue/20' 
                              : 'bg-white/60 shadow-sm'
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: isDark 
                              ? '0 0 25px rgba(120, 186, 255, 0.3)' 
                              : '0 0 25px rgba(59, 130, 246, 0.25)',
                            borderColor: isDark ? 'rgba(120, 186, 255, 0.4)' : 'rgba(59, 130, 246, 0.3)'
                          } as any}
                        >
                          <div className={`text-2xl font-bold mb-1 ${
                            isDark ? 'text-circuit-copper' : 'text-comp-gold'
                          }`}>
                            {stat.value}
                          </div>
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {stat.label}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
            
            {/* Education & Experience Section */}
            <section className="px-4 md:px-8 py-16 relative">
              <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                  {/* Education */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <BlurCard title="Education">
                      <ul className="space-y-6">
                        {professor?.education ? (
                          professor.education.map((edu, index) => (
                            <motion.li 
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              viewport={{ once: true }}
                              className="relative pl-8 before:absolute before:left-0 before:top-1.5 before:w-4 before:h-4 before:rounded-full before:border-2 before:border-circuit-light-blue before:bg-white dark:before:bg-circuit-dark"
                            >
                              <div className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                {edu.degree}
                                {edu.field && <span className="ml-1.5 font-normal text-base">in {edu.field}</span>}
                              </div>
                              <div className="flex justify-between">
                                <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {edu.institution}
                                </div>
                                <div className={`text-sm px-2 py-0.5 rounded-full ${
                                  isDark 
                                    ? 'bg-circuit-dark-blue/20 text-circuit-light-blue' 
                                    : 'bg-osc-blue/10 text-osc-blue'
                                }`}>
                                  {edu.year}
                                </div>
                              </div>
                            </motion.li>
                          ))
                        ) : (
                          // Default education if none provided
                          [
                            { degree: "Ph.D.", field: "Microelectronics", institution: "IIT Delhi", year: 2005 },
                            { degree: "M.Tech", field: "VLSI Design", institution: "IIT Bombay", year: 2001 },
                            { degree: "B.Tech", field: "Electronics Engineering", institution: "Renowned Technical Institution", year: 1998 }
                          ].map((edu, index) => (
                            <motion.li 
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              viewport={{ once: true }}
                              className="relative pl-8 before:absolute before:left-0 before:top-1.5 before:w-4 before:h-4 before:rounded-full before:border-2 before:border-circuit-light-blue before:bg-white dark:before:bg-circuit-dark"
                            >
                              <div className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                {edu.degree}
                                {edu.field && <span className="ml-1.5 font-normal text-base">in {edu.field}</span>}
                              </div>
                              <div className="flex justify-between">
                                <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {edu.institution}
                                </div>
                                <div className={`text-sm px-2 py-0.5 rounded-full ${
                                  isDark 
                                    ? 'bg-circuit-dark-blue/20 text-circuit-light-blue' 
                                    : 'bg-osc-blue/10 text-osc-blue'
                                }`}>
                                  {edu.year}
                                </div>
                              </div>
                            </motion.li>
                          ))
                        )}
                      </ul>
                    </BlurCard>
                  </motion.div>
                  
                  {/* Experience */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <BlurCard title="Professional Experience">
                      <ul className="space-y-6">
                        {professor?.experience ? (
                          professor.experience.map((exp, index) => (
                            <motion.li 
                              key={index}
                              initial={{ opacity: 0, x: 10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              viewport={{ once: true }}
                              className="relative pl-8 before:absolute before:left-0 before:top-1.5 before:w-4 before:h-4 before:rounded-full before:border-2 before:border-circuit-copper before:bg-white dark:before:bg-circuit-dark"
                            >
                              <div className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                {exp.position}
                              </div>
                              <div className="flex justify-between">
                                <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {exp.institution}
                                </div>
                                <div className={`text-sm px-2 py-0.5 rounded-full ${
                                  isDark 
                                    ? 'bg-circuit-copper/20 text-circuit-copper' 
                                    : 'bg-comp-gold/10 text-comp-gold'
                                }`}>
                                  {exp.period}
                                </div>
                              </div>
                              {exp.description && (
                                <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {exp.description}
                                </p>
                              )}
                            </motion.li>
                          ))
                        ) : (
                          // Default experience if none provided
                          [
                            { 
                              position: "Professor", 
                              institution: "IIT Roorkee", 
                              period: "2015-Present", 
                              description: "Leading cutting-edge research in microelectronics and mentoring the next generation of engineers."
                            },
                            { 
                              position: "Associate Professor", 
                              institution: "IIT Roorkee", 
                              period: "2010-2015", 
                              description: "Led multiple research projects and expanded lab facilities for semiconductor research."
                            },
                            { 
                              position: "Assistant Professor", 
                              institution: "IIT Roorkee", 
                              period: "2005-2010", 
                              description: "Started academic career at IIT Roorkee, establishing research focus on semiconductor devices."
                            }
                          ].map((exp, index) => (
                            <motion.li 
                              key={index}
                              initial={{ opacity: 0, x: 10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              viewport={{ once: true }}
                              className="relative pl-8 before:absolute before:left-0 before:top-1.5 before:w-4 before:h-4 before:rounded-full before:border-2 before:border-circuit-copper before:bg-white dark:before:bg-circuit-dark"
                            >
                              <div className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                {exp.position}
                              </div>
                              <div className="flex justify-between">
                                <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {exp.institution}
                                </div>
                                <div className={`text-sm px-2 py-0.5 rounded-full ${
                                  isDark 
                                    ? 'bg-circuit-copper/20 text-circuit-copper' 
                                    : 'bg-comp-gold/10 text-comp-gold'
                                }`}>
                                  {exp.period}
                                </div>
                              </div>
                              {exp.description && (
                                <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {exp.description}
                                </p>
                              )}
                            </motion.li>
                          ))
                        )}
                      </ul>
                    </BlurCard>
                  </motion.div>
                </div>
                
                {/* Awards Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="mb-16"
                >
                  <BlurCard title="Awards & Honors">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Show any of the awards, prioritizing the ones from professor data */}
                      {(professor?.awards?.length ? professor.awards : awards).slice(0, 4).map((award, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className={`p-4 rounded-lg ${
                            isDark 
                              ? 'bg-circuit-dark border border-circuit-copper/20' 
                              : 'bg-white shadow-sm border border-gray-100'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${
                              isDark ? 'bg-circuit-dark-blue/20 text-circuit-light-blue' : 'bg-osc-blue/10 text-osc-blue'
                            }`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                              </svg>
                            </div>
                            
                            <div className="flex-grow">
                              <div className="flex justify-between items-start">
                                <h3 className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                  {award.title}
                                </h3>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                  isDark ? 'bg-circuit-dark-blue/20 text-circuit-light-blue' : 'bg-osc-blue/10 text-osc-blue'
                                }`}>
                                  {award.year}
                                </span>
                              </div>
                              
                              <p className={`text-sm ${isDark ? 'text-circuit-silver' : 'text-gray-600'}`}>
                                {award.organization}
                              </p>
                              
                              {award.description && (
                                <p className={`mt-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {award.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </BlurCard>
                </motion.div>
                
                {/* Academic Journey Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <BlurCard title="Academic Journey">
                    <div className="relative pl-8 space-y-8">
                      {/* Timeline line */}
                      <div className="absolute left-3.5 top-0 h-full w-0.5 bg-gradient-to-b from-circuit-light-blue via-circuit-copper to-circuit-light-blue"></div>
                      
                      {/* Timeline events - combine education and experience and sort by year */}
                      {[
                        // Experience items (convert period to end year)
                        ...(professor?.experience || []).map(exp => ({
                          type: 'experience',
                          year: parseInt(exp.period.split('-')[1] || exp.period) || new Date().getFullYear(),
                          ...exp
                        })),
                        // Education items
                        ...(professor?.education || []).map(edu => ({
                          type: 'education',
                          ...edu
                        }))
                        // Removed awards from timeline
                      ]
                        .sort((a, b) => b.year - a.year) // Sort by year descending
                        .slice(0, 8) // Limit to 8 items
                        .map((event, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative"
                          >
                            {/* Timeline dot */}
                            <div className={`absolute -left-8 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              event.type === 'education'
                                ? isDark ? 'bg-circuit-dark border-circuit-light-blue' : 'bg-white border-osc-blue'
                                : isDark ? 'bg-circuit-dark border-circuit-silver' : 'bg-white border-gray-500'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                event.type === 'education'
                                  ? isDark ? 'bg-circuit-light-blue' : 'bg-osc-blue'
                                  : isDark ? 'bg-circuit-silver' : 'bg-gray-500'
                              }`}></div>
                            </div>
                            
                            <div className={`mb-1 font-semibold text-sm px-3 py-1 rounded-full inline-block ${
                              event.type === 'education'
                                ? isDark ? 'bg-circuit-dark-blue/20 text-circuit-light-blue' : 'bg-osc-blue/10 text-osc-blue'
                                : isDark ? 'bg-circuit-silver/20 text-circuit-silver' : 'bg-gray-200 text-gray-700'
                            }`}>
                              {event.year}
                            </div>
                            
                            <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                              {event.type === 'education' ? (event as any).degree : (event as any).position}
                            </h3>
                            
                            <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              {event.institution}
                            </div>
                            
                            {(event as any).description && (
                              <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {(event as any).description}
                              </p>
                            )}
                          </motion.div>
                        ))
                      }
                    </div>
                  </BlurCard>
                </motion.div>
              </div>
            </section>
            
            <Footer />
          </main>
        )}
      </div>
    </>
  );
} 