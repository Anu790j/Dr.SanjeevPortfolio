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
import { ResearchHighlights } from '@/components/home/ResearchHighlights';
import { AwardsSection } from '@/components/home/AwardsSection';
import { AboutSection } from '@/components/home/AboutSection';
import { Footer } from '@/components/layout/Footer';


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
  typeAnimationSequence?: string[]; // New field for dynamic sequence
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

const fullName = professor?.name || "Professor Name";
let firstName = fullName;
let lastName = '';
let lastNameParts: string[] = []

const parts = fullName.split(" ");
if (parts.length > 1) {
  [firstName, ...lastNameParts] = parts;
  lastName = lastNameParts.join(" ");
}

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
                      firstName={firstName} 
                      lastName={lastName} 
                    />
                      
                      <motion.h2 
                        className={`text-xl md:text-2xl mb-6 font-light ${isDark ? 'text-circuit-silver' : 'text-text-secondary'}`}
                        initial={{ opacity: 1, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <TypeAnimation
                        sequence={professor?.typeAnimationSequence || [
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
                            } as any}
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
            
            {/* Research Highlights Section */}
            <ResearchHighlights />
            
            {/* Awards Section */}
            <AwardsSection />
            
            {/* About Section */}
            <AboutSection professor={professor || undefined} />
            
            {/* Footer */}
            <Footer />
          </main>
        )}
      </div>
    </>
  );
}