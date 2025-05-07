"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { Header } from '@/components/layout/Header';
import { useTheme } from '@/context/ThemeContext';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { Footer } from '@/components/layout/Footer';

interface Project {
  _id: string;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  fundingAgency?: string;
  fundingAmount?: string;
  collaborators?: string[];
  status: 'ongoing' | 'completed' | 'upcoming';
  tags?: string[];
  url?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'ongoing' | 'completed' | 'upcoming'>('all');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const pageRef = useRef<HTMLDivElement>(null);

  // Track mouse position for parallax effects
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (pageRef.current) {
        const { clientX, clientY } = event;
        const { left, top, width, height } = pageRef.current.getBoundingClientRect();
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const res = await fetch('/api/projects');
        
        if (!res.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, []);

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.status === activeFilter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <>
      <Header />
      <div 
        ref={pageRef}
        className={`min-h-screen pt-24 ${isDark ? 'bg-circuit-dark' : 'bg-bg-primary'} relative overflow-hidden`}
      >

        {/* Animated Background with Parallax */}
        <AnimatedBackground />
       

        {/* Futuristic grid overlay */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, ${isDark ? 'rgba(37,99,235,0.05)' : 'rgba(37,99,235,0.03)'} 1px, transparent 1px),
                             linear-gradient(to bottom, ${isDark ? 'rgba(37,99,235,0.05)' : 'rgba(37,99,235,0.03)'} 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {loading ? (
          <LoadingIndicator message="Loading projects..." fullScreen={true} />
        ) : (
          <main className="container mx-auto max-w-6xl px-4 md:px-8 py-10 relative z-10">
            <section>
              <motion.h1 
                className={`text-3xl md:text-4xl font-bold mb-6 ${isDark ? 'text-circuit-light-blue' : 'text-osc-blue'} relative inline-block`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ 
                  scale: 1.03,
                  textShadow: isDark ? '0 0 8px rgba(37,99,235,0.5)' : '0 0 8px rgba(37,99,235,0.3)'
                }}
              >
                Projects
                <motion.span 
                  className={`absolute -bottom-2 left-0 h-1 ${isDark ? 'bg-circuit-copper' : 'bg-comp-gold'}`}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                />
              </motion.h1>
              
              <motion.p 
                className={`mb-8 text-lg ${isDark ? 'text-text-light' : 'text-text-primary'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Exploring the frontiers of microelectronics through innovative projects and collaborations.
              </motion.p>
              
              {/* Enhanced Filter controls */}
              <motion.div 
                className="flex justify-center mb-8 overflow-x-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <motion.div 
                  className={`inline-flex ${isDark ? 'bg-bg-dark' : 'bg-bg-secondary'} rounded-lg p-1 shadow-lg`}
                  whileHover={{ boxShadow: isDark ? '0 0 15px rgba(37,99,235,0.2)' : '0 0 15px rgba(37,99,235,0.1)' }}
                >
                  {['all', 'ongoing', 'completed', 'upcoming'].map((filter, index) => (
                    <motion.button
                      key={filter}
                      onClick={() => setActiveFilter(filter as any)}
                      className={`px-5 py-2 rounded-md text-sm font-medium relative overflow-hidden ${
                        activeFilter === filter 
                          ? isDark ? 'text-white' : 'text-white'
                          : isDark ? 'text-text-muted hover:text-text-light' : 'text-text-muted hover:text-text-primary'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Active tab background */}
                      {activeFilter === filter && (
                        <motion.div 
                          className={`absolute inset-0 ${isDark ? 'bg-circuit-light-blue' : 'bg-osc-blue'} rounded-md z-0`}
                          layoutId="activeTab"
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        >
                          <motion.div 
                            className="absolute inset-0 opacity-20"
                            style={{
                              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M15 0C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15zm0 5c5.514 0 10 4.486 10 10 0 5.514-4.486 10-10 10-5.514 0-10-4.486-10-10 0-5.514 4.486-10 10-10z'/%3E%3C/g%3E%3C/svg%3E\")",
                              backgroundSize: '8px 8px',
                            }}
                            animate={{
                              backgroundPosition: ['0% 0%', '100% 100%']
                            }}
                            transition={{
                              duration: 10,
                              repeat: Infinity,
                              repeatType: "loop"
                            }}
                          />
                        </motion.div>
                      )}
                      <span className="relative z-10">
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
              
              {error ? (
                <motion.div 
                  className="text-center py-10 text-red-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {error}
                </motion.div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFilter}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
                  >
                    {filteredProjects.length === 0 ? (
                      <motion.p 
                        className={`col-span-full text-center py-10 ${isDark ? 'text-text-secondary' : 'text-text-muted'}`}
                        variants={itemVariants}
                      >
                        No projects found for this filter.
                      </motion.p>
                    ) : (
                      filteredProjects.map((project, index) => (
                        <motion.div
                          key={project._id}
                          variants={itemVariants}
                          layout
                        >
                          <ProjectCard
                            title={project.title}
                            description={project.description}
                            status={project.status as 'ongoing' | 'completed'}
                            imageUrl={project.imageUrl || '/images/PROJECTS.jpg'}
                            startDate={project.startDate ? new Date(project.startDate) : undefined}
                            endDate={project.endDate ? new Date(project.endDate) : undefined}
                            collaborators={project.collaborators}
                            funding={project.fundingAgency}
                            index={index}
                          />
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </section>

            {/* Floating Action Button */}
            <motion.div
              className="fixed bottom-8 right-8 z-20"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: 1,
                type: "spring",
                stiffness: 400,
                damping: 10
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.button
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                  isDark 
                    ? 'bg-circuit-light-blue text-white' 
                    : 'bg-osc-blue text-white'
                }`}
                whileHover={{ 
                  boxShadow: isDark 
                    ? '0 0 20px rgba(37,99,235,0.4)' 
                    : '0 0 20px rgba(37,99,235,0.3)'
                }}
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
                </svg>
              </motion.button>
            </motion.div>
          </main>
        )}
      </div>
      <Footer />
    </>
  );
}