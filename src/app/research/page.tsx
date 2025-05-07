"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { useTheme } from '@/context/ThemeContext';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { BlurCard } from '@/components/ui/BlurCard';
import { PublicationCard } from '@/components/publications/PublicationCard';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import { GradientHoverCard } from '@/components/animations/GradientHoverCard';

interface Publication {
  _id: string;
  title: string;
  authors: string;
  category: 'journal' | 'conference' | 'patent';
  journal?: string;
  conference?: string;
  year: number;
  doi?: string;
  abstract?: string;
  pdfFileId?: string;
  link?: string;
  citation?: string;
  tags?: string[];
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
  const [activeCategory, setActiveCategory] = useState<'all' | 'journal' | 'conference' | 'patent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
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
  
  // Filter publications by category and search query
  const filteredPublications = publications.filter(pub => {
    // Filter by category
    if (activeCategory !== 'all' && pub.category !== activeCategory) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        pub.title.toLowerCase().includes(query) ||
        pub.authors.toLowerCase().includes(query) ||
        (pub.journal && pub.journal.toLowerCase().includes(query)) ||
        (pub.conference && pub.conference.toLowerCase().includes(query)) ||
        (pub.abstract && pub.abstract.toLowerCase().includes(query)) ||
        (pub.tags && pub.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    return true;
  });

  // Calculate basic metrics (kept for reference)
  const metrics = {
    total: publications.length,
    journals: publications.filter(p => p.category === 'journal').length,
    conferences: publications.filter(p => p.category === 'conference').length,
    patents: publications.filter(p => p.category === 'patent').length
  };

  const categories = [
    { id: 'all', label: 'All Publications' },
    { id: 'journal', label: 'Journal Papers' },
    { id: 'conference', label: 'Conference Papers' },
    { id: 'patent', label: 'Patents' }
  ];
  
  return (
    <>
      <Header />
      <div className={`min-h-screen pt-24 ${isDark ? 'bg-circuit-dark' : 'bg-bg-primary'} relative`}>
      <AnimatedBackground />
        
        {loading ? (
          <LoadingIndicator message="Loading research data..." fullScreen={true} />
        ) : (
          <main className="container mx-auto max-w-6xl px-4 md:px-8 py-10 relative z-10">
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
                    
                    {/* Publications section */}
                    <section className="mb-8">
                      <div className="container mx-auto max-w-6xl">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                          {/* Category tabs */}
                          <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id as any)}
                                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                                  activeCategory === cat.id
                                    ? isDark
                                      ? 'bg-circuit-light-blue/20 text-circuit-light-blue'
                                      : 'bg-osc-blue/10 text-osc-blue'
                                    : isDark
                                      ? 'bg-circuit-dark-blue/20 text-gray-300 hover:bg-circuit-dark-blue/30'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {cat.label}{' '}
                                <span className="text-xs opacity-70">
                                  ({cat.id === 'all' 
                                    ? metrics.total 
                                    : cat.id === 'journal'
                                      ? metrics.journals
                                      : cat.id === 'conference'
                                        ? metrics.conferences
                                        : metrics.patents})
                                </span>
                              </button>
                            ))}
                          </div>
                          
                          <div className="relative w-full md:w-64">
                            <input
                              type="text"
                              placeholder="Search publications..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className={`w-full px-4 py-2 rounded-md pl-10 ${
                                isDark
                                  ? 'bg-circuit-dark border border-circuit-light-blue/20 text-white placeholder-gray-500 focus:border-circuit-light-blue/50'
                                  : 'bg-white border border-gray-300 text-gray-700 placeholder-gray-400 focus:border-osc-blue'
                              } focus:outline-none transition-colors`}
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        {/* Publications List */}
                        <div className="space-y-6">
                          {filteredPublications.length > 0 ? (
                            filteredPublications.map((publication, index) => (
                              <PublicationCard key={publication._id} publication={publication} index={index} />
                            ))
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className={`text-center py-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                              <p>No publications found matching your criteria.</p>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </section>
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
                        {/* ProjectCard component is missing - creating a simple version */}
                        {projects.map((project, index) => (
                          <motion.div
                            key={project._id}
                            className={`p-6 rounded-lg ${isDark ? 'bg-bg-dark' : 'bg-bg-secondary'} bg-opacity-80 backdrop-blur-lg shadow-card border ${isDark ? 'border-circuit-copper/10' : 'border-osc-blue/5'}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                          >
                            <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-text-light' : 'text-text-primary'}`}>
                              {project.title}
                            </h3>
                            <p className={`${isDark ? 'text-text-secondary' : 'text-text-secondary'} mb-4`}>
                              {project.description}
                            </p>
                            <div className="flex justify-between text-sm">
                              <span className={`px-2 py-1 rounded-full ${
                                isDark 
                                  ? project.status === 'ongoing' ? 'bg-circuit-light-blue/20 text-circuit-light-blue' : 'bg-circuit-copper/20 text-circuit-copper'
                                  : project.status === 'ongoing' ? 'bg-osc-blue/10 text-osc-blue' : 'bg-comp-gold/10 text-comp-gold'
                              }`}>
                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                              </span>
                            </div>
                          </motion.div>
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
                      } as any}
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
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
      <Toaster />
      <Footer />
    </>
  );
}