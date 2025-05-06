"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { useTheme } from '@/context/ThemeContext';
import { PublicationCard } from '@/components/publications/PublicationCard';
import { ProjectCard } from '@/components/publications/ProjectCard';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { GradientHoverCard } from '@/components/animations/GradientHoverCard';
import { BlurCard } from '@/components/ui/BlurCard';

interface Publication {
  _id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  abstract?: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  collaborators?: string[];
  funding?: string;
  status: 'ongoing' | 'completed';
  imageUrl?: string;
}

interface ResearchFocus {
  title: string;
  description: string;
  icon: string;
}

export default function ResearchPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [researchFocus, setResearchFocus] = useState<ResearchFocus[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'publications' | 'projects'>('publications');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all data in parallel
        const [pubRes, projRes, focusRes] = await Promise.all([
          fetch('/api/publication'),
          fetch('/api/projects'),
          fetch('/api/research-focus')
        ]);
        
        if (pubRes.ok && projRes.ok) {
          const pubData = await pubRes.json();
          const projData = await projRes.json();
          
          setPublications(pubData);
          setProjects(projData);
          
          if (focusRes.ok) {
            const focusData = await focusRes.json();
            setResearchFocus(focusData);
          }
        }
      } catch (error) {
        console.error('Error fetching research data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  return (
    <>
      <Header />
      <div className={`min-h-screen pt-24 ${isDark ? 'bg-circuit-dark' : 'bg-bg-primary'} relative`}>
      <AnimatedBackground />
        {/* Background Image with parallax effect */}
        {/* <motion.div 
          className="fixed inset-0 z-0 opacity-5 pointer-events-none"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img 
            src="/images/memory-testing-post.jpg" 
            alt="Research Background" 
            className="w-full h-full object-cover"
          />
        </motion.div> */}
        
        {loading ? (
          <LoadingIndicator message="Loading research data..." fullScreen={true} />
        ) : (
          <main className="container mx-auto px-4 py-10 relative z-10">
            <section>
              <motion.h1 
                className={`text-3xl md:text-4xl font-bold mb-6 ${isDark ? 'text-circuit-light-blue' : 'text-osc-blue'}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Research
              </motion.h1>
              
              <motion.p 
                className={`mb-8 text-lg ${isDark ? 'text-text-light' : 'text-text-primary'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Exploring the frontiers of microelectronics and VLSI design through innovative research and collaboration.
              </motion.p>
              
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex border-b border-osc-blue border-opacity-30">
                  <motion.button 
                    className={`py-2 px-4 font-medium ${activeTab === 'publications' ? 'text-comp-gold border-b-2 border-comp-gold' : 'text-text-muted hover:text-text-primary'}`}
                    onClick={() => setActiveTab('publications')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Publications
                  </motion.button>
                  <motion.button 
                    className={`py-2 px-4 font-medium ${activeTab === 'projects' ? 'text-comp-gold border-b-2 border-comp-gold' : 'text-text-muted hover:text-text-primary'}`}
                    onClick={() => setActiveTab('projects')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Projects
                  </motion.button>
                </div>
              </motion.div>
              
              <AnimatePresence mode="wait">
                {activeTab === 'publications' && (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.h2 
                      className={`text-xl font-semibold mb-4 ${isDark ? 'text-comp-gold' : 'text-comp-gold'}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      Research Publications
                    </motion.h2>
                    
                    {publications.length === 0 ? (
                      <motion.p 
                        className="text-text-muted py-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        No publications available.
                      </motion.p>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        {publications.map((pub, index) => (
                          <PublicationCard
                            key={pub._id}
                            title={pub.title}
                            authors={Array.isArray(pub.authors) ? pub.authors : [pub.authors]}
                            journal={pub.journal}
                            year={pub.year}
                            doi={pub.doi}
                            index={index}
                          />
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                )}
                
                {activeTab === 'projects' && (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.h2 
                      className={`text-xl font-semibold mb-4 ${isDark ? 'text-comp-gold' : 'text-comp-gold'}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      Research Projects
                    </motion.h2>
                    
                    {projects.length === 0 ? (
                      <motion.p 
                        className="text-text-muted py-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        No projects available.
                      </motion.p>
                    ) : (
                      <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        {projects.map((project, index) => (
                          <ProjectCard
                            key={project._id}
                            title={project.title}
                            description={project.description}
                            status={project.status}
                            imageUrl={project.imageUrl || '/images/memory-testing-post.jpg'}
                            startDate={project.startDate}
                            endDate={project.endDate}
                            collaborators={project.collaborators}
                            funding={project.funding}
                            index={index}
                          />
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
            
            <section className="mt-12 mb-10">
              <motion.h2 
                className={`text-xl font-semibold mb-6 ${isDark ? 'text-comp-gold' : 'text-comp-gold'}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Research Focus Areas
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {researchFocus.length > 0 ? (
                  researchFocus.map((focus, index) => (
                    <motion.div
                      key={index}
                      className={`p-6 rounded-lg ${isDark ? 'bg-bg-dark' : 'bg-bg-secondary'} bg-opacity-80 backdrop-blur-lg shadow-card border ${isDark ? 'border-circuit-copper/10' : 'border-osc-blue/5'}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: isDark ? '0 0 20px rgba(240, 184, 102, 0.1)' : '0 0 20px rgba(37, 99, 235, 0.1)'
                      }}
                    >
                      <motion.div 
                        className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center ${isDark ? 'bg-circuit-dark' : 'bg-bg-accent'}`}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.1, rotate: 360 }}
                      >
                        <i className={`${focus.icon} text-xl ${isDark ? 'text-comp-gold' : 'text-comp-gold'}`}></i>
                      </motion.div>
                      <motion.h3 
                        className={`text-xl font-medium mb-2 ${isDark ? 'text-text-light' : 'text-text-primary'}`}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                        viewport={{ once: true }}
                      >
                        {focus.title}
                      </motion.h3>
                      <motion.p 
                        className={`${isDark ? 'text-text-secondary' : 'text-text-secondary'}`}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                        viewport={{ once: true }}
                      >
                        {focus.description}
                      </motion.p>
                    </motion.div>
                  ))
                ) : (
                  <>
                    <motion.div
                      className={`p-6 rounded-lg ${isDark ? 'bg-bg-dark' : 'bg-bg-secondary'} bg-opacity-80 backdrop-blur-lg shadow-card border ${isDark ? 'border-circuit-copper/10' : 'border-osc-blue/5'}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <div className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center ${isDark ? 'bg-circuit-dark' : 'bg-bg-accent'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDark ? 'text-comp-gold' : 'text-comp-gold'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                      </div>
                      <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-text-light' : 'text-text-primary'}`}>Semiconductor Devices</h3>
                      <p className={`${isDark ? 'text-text-secondary' : 'text-text-secondary'}`}>
                        Research on advanced semiconductor devices, including ultra-scaled MOSFETs, FinFETs, and emerging technologies.
                      </p>
                    </motion.div>
                    
                    <motion.div
                      className={`p-6 rounded-lg ${isDark ? 'bg-bg-dark' : 'bg-bg-secondary'} bg-opacity-80 backdrop-blur-lg shadow-card border ${isDark ? 'border-circuit-copper/10' : 'border-osc-blue/5'}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center ${isDark ? 'bg-circuit-dark' : 'bg-bg-accent'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDark ? 'text-comp-gold' : 'text-comp-gold'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                        </svg>
                      </div>
                      <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-text-light' : 'text-text-primary'}`}>VLSI Design</h3>
                      <p className={`${isDark ? 'text-text-secondary' : 'text-text-secondary'}`}>
                        Advanced Very Large Scale Integration designs, focusing on low-power applications and high-performance computing.
                      </p>
                    </motion.div>
                    
                    <motion.div
                      className={`p-6 rounded-lg ${isDark ? 'bg-bg-dark' : 'bg-bg-secondary'} bg-opacity-80 backdrop-blur-lg shadow-card border ${isDark ? 'border-circuit-copper/10' : 'border-osc-blue/5'}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <div className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center ${isDark ? 'bg-circuit-dark' : 'bg-bg-accent'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDark ? 'text-comp-gold' : 'text-comp-gold'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-text-light' : 'text-text-primary'}`}>Circuit Modeling</h3>
                      <p className={`${isDark ? 'text-text-secondary' : 'text-text-secondary'}`}>
                        Development of accurate and efficient compact models for circuit simulation and performance optimization.
                      </p>
                    </motion.div>
                  </>
                )}
              </div>
            </section>
          </main>
        )}
      </div>
    </>
  );
}