// src/app/page.tsx
"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { useEffect, useState } from 'react';
import { LEDButton, GlowingCard } from '@/components/ui/GlowingCard';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { TypeAnimation } from 'react-type-animation';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { AnimatedName } from '@/components/animations/AnimatedName';
import { GradientHoverCard } from '@/components/animations/GradientHoverCard';
import { BlurCard } from '@/components/ui/BlurCard';

interface ProfessorData {
  name: string;
  title: string;
  department?: string;
  university?: string;
  bio?: string;
  photoUrl?: string;
  profileImage?: string;
  education?: Array<{
    degree: string;
    institution: string;
    year: number;
  }>;
  researchInterests?: string[];
}

export default function Home() {
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

  return (
    <>
      <Header />
      <div className={isDark ? 'bg-circuit-dark' : 'bg-bg-primary'}>
        {/* Enhanced animated background */}
        <AnimatedBackground />
        
        {loading ? (
          <LoadingIndicator message="Loading professor data..." fullScreen={true} />
        ) : (
          <main className="relative z-10">
            {/* Hero Section with enhanced animations */}
            <section className="min-h-[90vh] px-4 md:px-8 pt-24 relative overflow-hidden">
              <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-center gap-12 py-16">
                  {/* Text content with enhanced animations */}
                  <div className="md:w-1/2">
                    {/* Animated name with moving line */}
                    <AnimatedName 
                      firstName="Dr. Sanjeev" 
                      lastName="Manhas" 
                    />
                      
                      <motion.h2 
                        className={`text-xl md:text-2xl mb-6 font-light ${isDark ? 'text-circuit-silver' : 'text-text-secondary'}`}
                        initial={{ opacity: 1, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <TypeAnimation
                          sequence={[
                            'Professor, Microelectronics & VLSI',
                            1000,
                            'Researcher in Semiconductor Devices',
                            1000,
                            'Expert in Circuit Modeling',
                            1000,
                          ]}
                          wrapper="span"
                          speed={50}
                          repeat={Infinity}
                          cursor={true}
                          className="inline-block"
                        />
                      </motion.h2>
                      
                    {/* Bio with gradient hover effect */}
                    <GradientHoverCard className="mb-8 max-w-xl">
                      <p className={`${isDark ? 'text-text-light' : 'text-text-primary'}`}>
                        {professor?.bio || "Professor in the Department of Electronics and Communication Engineering at Indian Institute of Technology Roorkee. Specializing in Microelectronics, VLSI Design, and Semiconductor Devices."}
                      </p>
                    </GradientHoverCard>
                    
                    <div className="flex flex-wrap gap-4">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link href="/contact" className="btn primary-btn">
                          Contact Me
                        </Link>
                      </motion.div>
                      <motion.div 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                        <Link href="/research" className="btn secondary-btn">
                          View Research
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Profile image with enhanced effects */}
                  <div className="md:w-1/2">
                  <motion.div 
                      className="relative"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                  >
                      <div className="relative w-full max-w-md mx-auto">
                        <div className="absolute inset-0 rounded-lg overflow-hidden">
                          <motion.div
                            className="absolute inset-0"
                            style={{
                              background: isDark
                                ? 'linear-gradient(45deg, #78BAFF, #F0B866, #78BAFF)'
                                : 'linear-gradient(45deg, #38BDF8, #F59E0B, #38BDF8)',
                              opacity: 0.2,
                            }}
                            animate={{ 
                              opacity: [0.2, 0.3, 0.2],
                            }}
                            transition={{ 
                              duration: 3,
                              repeat: Infinity,
                              repeatType: "reverse",
                            }}
                          />
                        </div>
                        
                        <div className="relative rounded-lg overflow-hidden border-2 border-transparent hover:border-circuit-light-blue transition-colors duration-300">
                          <Image
                            src={professor?.profileImage ? `/api/files/${professor.profileImage}` : "/images/bg.jpg"}
                            alt="Professor Sanjeev Manhas"
                            width={500}
                            height={600}
                            className="w-full h-auto object-cover"
                            priority
                            onError={(e) => {
                              // Fallback to default image if the provided URL fails
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/bg.jpg';
                            }}
                      />
                    </div>
                </div>
                    </motion.div>
                  </div>
                    </div>
              </div>
            </section>
            
            {/* About Section with simplified animations */}
            <section className="container mx-auto max-w-6xl px-4 md:px-8 py-16">
              <motion.h2 
                className={`text-2xl md:text-3xl font-semibold mb-10 ${isDark ? 'text-circuit-light-blue' : 'text-osc-blue'} relative inline-block`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                About Me
                <motion.span 
                  className={`absolute -bottom-1 left-0 h-1 ${isDark ? 'bg-circuit-copper' : 'bg-comp-gold'}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: '4rem' }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                />
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <BlurCard title="Education & Background">
                  <ul className="space-y-4">
                    {professor?.education ? (
                      professor.education.map((edu, index) => (
                        <motion.li 
                          key={index} 
                          className="group"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="font-medium">{edu.degree}</div>
                          <div className={`flex items-center ${isDark ? 'text-text-secondary' : 'text-text-secondary'}`}>
                            {edu.institution}
                            {edu.year && (
                              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-circuit-dark border border-circuit-copper/20' : 'bg-bg-accent'}`}>
                                {edu.year}
                              </span>
                            )}
                          </div>
                        </motion.li>
                      ))
                    ) : (
                      <>
                        <motion.li
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          viewport={{ once: true }}
                        >
                          <div className="font-medium">Ph.D. in Microelectronics</div>
                          <div className={isDark ? 'text-text-secondary' : 'text-text-secondary'}>IIT Delhi</div>
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="font-medium">M.Tech in Solid State Materials</div>
                          <div className={isDark ? 'text-text-secondary' : 'text-text-secondary'}>IIT Delhi</div>
                        </motion.li>
                        <motion.li
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          viewport={{ once: true }}
                        >
                          <div className="font-medium">B.E. in Electronics & Communication Engineering</div>
                          <div className={isDark ? 'text-text-secondary' : 'text-text-secondary'}>University of Roorkee</div>
                        </motion.li>
                      </>
                    )}
                  </ul>
                  </BlurCard>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <BlurCard title="Research Focus">
                  <ul className="space-y-4">
                    {professor?.researchInterests ? (
                      professor.researchInterests.map((interest, index) => (
                        <motion.li 
                          key={index} 
                          className="group"
                          initial={{ opacity: 0, x: 10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className={`relative pl-4 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full ${isDark ? 'before:bg-circuit-light-blue' : 'before:bg-osc-blue'}`}>
                            {interest}
                          </div>
                        </motion.li>
                      ))
                    ) : (
                      <>
                        <motion.li 
                          className={`relative pl-4 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full ${isDark ? 'before:bg-circuit-light-blue' : 'before:bg-osc-blue'}`}
                          initial={{ opacity: 0, x: 10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          viewport={{ once: true }}
                        >
                          Micro/Nanoelectronics Device Modeling
                        </motion.li>
                        <motion.li 
                          className={`relative pl-4 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full ${isDark ? 'before:bg-circuit-light-blue' : 'before:bg-osc-blue'}`}
                          initial={{ opacity: 0, x: 10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          viewport={{ once: true }}
                        >
                          Semiconductor Device Fabrication
                        </motion.li>
                        <motion.li 
                          className={`relative pl-4 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full ${isDark ? 'before:bg-circuit-light-blue' : 'before:bg-osc-blue'}`}
                          initial={{ opacity: 0, x: 10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          viewport={{ once: true }}
                        >
                          Compact Model Development for Circuit Simulation
                        </motion.li>
                      </>
                    )}
                  </ul>
                  </BlurCard>
                </motion.div>
              </div>
            </section>
            
            {/* Research Highlights Section with simplified animations */}
            <section className="container mx-auto max-w-6xl px-4 md:px-8 py-16 relative">
              {/* Static background */}
              <div 
                className="absolute inset-0 -z-10 opacity-5"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${isDark ? 'rgba(37,99,235,0.1)' : 'rgba(37,99,235,0.05)'} 0%, transparent 70%)`
                }}
              />

              <motion.h2 
                className={`text-2xl md:text-3xl font-semibold mb-10 ${isDark ? 'text-circuit-light-blue' : 'text-osc-blue'} relative inline-block`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Research Highlights
                <motion.span 
                  className={`absolute -bottom-1 left-0 h-1 ${isDark ? 'bg-circuit-copper' : 'bg-comp-gold'}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: '4rem' }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                />
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 - Semiconductor Devices */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <BlurCard title="Semiconductor Devices">
                    <div className="mb-4 flex justify-center">
                  <motion.div 
                        className={`w-14 h-14 rounded-full flex items-center justify-center ${isDark ? 'bg-circuit-dark' : 'bg-bg-accent'} relative`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 360,
                      transition: { duration: 0.5 }
                    }}
                  >
                    <div 
                      className={`absolute inset-0 rounded-full ${isDark ? 'border border-circuit-light-blue/20' : 'border border-osc-blue/10'}`}
                    />
                  
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${isDark ? 'text-comp-gold' : 'text-comp-gold'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </motion.div>
                    </div>
                  
                  <motion.p 
                    className={`${isDark ? 'text-text-secondary' : 'text-text-secondary'} relative z-10`}
                    whileHover={{ 
                      scale: 1.02,
                      color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'
                    }}
                  >
                    Research on advanced semiconductor devices, including ultra-scaled MOSFETs, FinFETs, and emerging technologies.
                  </motion.p>
                  
                  {/* Read more link with animated arrow */}
                  <motion.div
                    className={`flex items-center mt-4 text-sm font-medium ${isDark ? 'text-circuit-light-blue' : 'text-osc-blue'} cursor-pointer`}
                    whileHover={{ x: 3 }}
                  >
                    <span>Learn more</span>
                    <motion.svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </motion.div>
                  </BlurCard>
                </motion.div>
                
                {/* Card 2 - VLSI Design */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <BlurCard title="VLSI Design">
                    <div className="mb-4 flex justify-center">
                  <motion.div 
                        className={`w-14 h-14 rounded-full flex items-center justify-center ${isDark ? 'bg-circuit-dark' : 'bg-bg-accent'} relative`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 360,
                      transition: { duration: 0.5 }
                    }}
                  >
                    <div 
                      className={`absolute inset-0 rounded-full ${isDark ? 'border border-circuit-copper/30' : 'border border-comp-gold/20'}`}
                    />
                  
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${isDark ? 'text-comp-gold' : 'text-comp-gold'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </motion.div>
                    </div>
                  
                  <motion.p 
                    className={`${isDark ? 'text-text-secondary' : 'text-text-secondary'} relative z-10`}
                    whileHover={{ 
                      scale: 1.02,
                      color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'
                    }}
                  >
                    Advanced Very Large Scale Integration designs, focusing on low-power applications and high-performance computing.
                  </motion.p>
                  
                  {/* Read more link with animated arrow */}
                  <motion.div
                    className={`flex items-center mt-4 text-sm font-medium ${isDark ? 'text-circuit-copper' : 'text-comp-gold'} cursor-pointer`}
                    whileHover={{ x: 3 }}
                  >
                    <span>Learn more</span>
                    <motion.svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </motion.div>
                  </BlurCard>
                </motion.div>
                
                {/* Card 3 - Circuit Modeling */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <BlurCard title="Circuit Modeling">
                    <div className="mb-4 flex justify-center">
                  <motion.div 
                        className={`w-14 h-14 rounded-full flex items-center justify-center ${isDark ? 'bg-circuit-dark' : 'bg-bg-accent'} relative`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 360,
                      transition: { duration: 0.5 }
                    }}
                  >
                    <div 
                          className={`absolute inset-0 rounded-full ${isDark ? 'border border-circuit-light-blue/20' : 'border border-osc-blue/20'}`}
                    />
                  
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${isDark ? 'text-comp-gold' : 'text-comp-gold'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </motion.div>
                    </div>
                  
                  <motion.p 
                    className={`${isDark ? 'text-text-secondary' : 'text-text-secondary'} relative z-10`}
                    whileHover={{ 
                      scale: 1.02,
                      color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'
                    }}
                  >
                      Development of compact models for circuit simulation, including industry-standard BSIM models and custom solutions.
                  </motion.p>
                  
                  {/* Read more link with animated arrow */}
                  <motion.div
                      className={`flex items-center mt-4 text-sm font-medium ${isDark ? 'text-circuit-light-blue' : 'text-osc-blue'} cursor-pointer`}
                    whileHover={{ x: 3 }}
                  >
                    <span>Learn more</span>
                    <motion.svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </motion.div>
                  </BlurCard>
                </motion.div>
              </div>
              
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <Link href="/research">
                  <motion.button 
                    className={`px-6 py-3 rounded-md font-medium transition-all ${
                      isDark 
                        ? 'bg-transparent text-circuit-copper border border-circuit-copper hover:bg-circuit-copper/10' 
                        : 'bg-transparent text-osc-blue border border-osc-blue hover:bg-osc-blue/10'
                    } relative overflow-hidden group`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Modified shine effect */}
                    <div 
                      className="absolute inset-0 opacity-0 bg-gradient-to-r from-transparent via-white to-transparent group-hover:opacity-10"
                    />
                    
                    <span className="flex items-center justify-center">
                      <span>View All Research</span>
                      <motion.svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 ml-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </motion.svg>
                    </span>
                  </motion.button>
                </Link>
              </motion.div>
            </section>
          </main>
        )}
      </div>
    </>
  );
}