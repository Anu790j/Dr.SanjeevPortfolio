"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AdminCard from '@/components/admin/AdminCard';
import { useTheme } from '@/context/ThemeContext';

interface Stats {
  publications: number;
  projects: number;
  courses: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    publications: 0,
    projects: 0,
    courses: 0
  });
  
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        
        // Fetch stats in parallel
        const [pubRes, projRes, courseRes] = await Promise.all([
          fetch('/api/publication'),
          fetch('/api/projects'),
          fetch('/api/course')
        ]);
        
        // Process results
        const publications = pubRes.ok ? await pubRes.json() : [];
        const projects = projRes.ok ? await projRes.json() : [];
        const courses = courseRes.ok ? await courseRes.json() : [];
        
        setStats({
          publications: publications.length,
          projects: projects.length,
          courses: courses.length
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  const dashboardItems = [
    {
      title: 'Profile',
      description: 'Manage your personal information, education, and biography.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      link: '/admin/profile',
      count: 1,
      color: isDark ? 'text-circuit-light-blue' : 'text-osc-blue'
    },
    {
      title: 'Publications',
      description: 'Add and edit your research publications and papers.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      link: '/admin/publications',
      count: stats.publications,
      color: isDark ? 'text-circuit-copper' : 'text-comp-gold'
    },
    {
      title: 'Projects',
      description: 'Manage your research projects and collaborations.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      link: '/admin/projects',
      count: stats.projects,
      color: isDark ? 'text-pcb-gold' : 'text-comp-gold'
    },
    {
      title: 'Courses',
      description: 'Update your teaching information and course materials.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      ),
      link: '/admin/courses',
      count: stats.courses,
      color: isDark ? 'text-circuit-light-blue' : 'text-osc-blue'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <motion.h1 
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Welcome to Your Portfolio Dashboard
        </motion.h1>
        <motion.p 
          className="text-text-muted max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Manage your professional portfolio content with ease. Use the cards below to navigate to different management sections.
        </motion.p>
      </div>
      
      {/* Stats summary section */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <AdminCard className="flex items-center">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isDark ? 'bg-circuit-dark' : 'bg-blue-50'} mr-4`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-osc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-text-muted mb-1">Publications</p>
            <p className="text-2xl font-bold">{loading ? '...' : stats.publications}</p>
          </div>
        </AdminCard>
        
        <AdminCard className="flex items-center">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isDark ? 'bg-circuit-dark' : 'bg-amber-50'} mr-4`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-comp-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-text-muted mb-1">Projects</p>
            <p className="text-2xl font-bold">{loading ? '...' : stats.projects}</p>
          </div>
        </AdminCard>
        
        <AdminCard className="flex items-center">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isDark ? 'bg-circuit-dark' : 'bg-green-50'} mr-4`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-text-muted mb-1">Courses</p>
            <p className="text-2xl font-bold">{loading ? '...' : stats.courses}</p>
          </div>
        </AdminCard>
      </motion.div>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-pulse h-8 w-8 bg-osc-blue rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (index * 0.1) }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Link href={item.link} className="block h-full">
                <div className={`h-full p-6 bg-bg-dark bg-opacity-80 backdrop-blur-lg rounded-lg border border-osc-blue border-opacity-20 hover:border-opacity-50 transition-all duration-300 relative overflow-hidden group`}>
                  {/* Circuit-themed accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 opacity-20 -mt-8 -mr-8">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="4" className={item.color} />
                      <path d="M30,50 L70,50" stroke="currentColor" strokeWidth="3" className={item.color} />
                      <path d="M50,30 L50,70" stroke="currentColor" strokeWidth="3" className={item.color} />
                    </svg>
                  </div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-lg ${isDark ? 'bg-bg-darker' : 'bg-bg-primary'} ${item.color}`}>
                      {item.icon}
                    </div>
                    <span className={`bg-osc-blue bg-opacity-20 text-osc-blue px-3 py-1 rounded-full text-sm font-medium`}>
                      {item.count}
                    </span>
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 group-hover:${item.color.replace('text-', '')} transition-colors`}>{item.title}</h3>
                  <p className="text-text-muted">{item.description}</p>
                  
                  <div className="mt-4 flex items-center text-sm text-osc-blue opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Manage</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
      
      <AdminCard title="Quick Tips" className="mt-8">
        <div className="space-y-5">
          <div className="flex items-start">
            <div className={`min-w-[2rem] h-8 flex items-center justify-center rounded-full ${isDark ? 'bg-circuit-dark' : 'bg-blue-50'} mr-4`}>
              <span className="text-osc-blue font-medium">1</span>
            </div>
            <div>
              <h4 className="font-medium mb-1">Keep your profile updated</h4>
              <p className="text-sm text-text-muted">Regularly update your professional information to ensure visitors have access to your latest accomplishments.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className={`min-w-[2rem] h-8 flex items-center justify-center rounded-full ${isDark ? 'bg-circuit-dark' : 'bg-blue-50'} mr-4`}>
              <span className="text-osc-blue font-medium">2</span>
            </div>
            <div>
              <h4 className="font-medium mb-1">Add high-quality images</h4>
              <p className="text-sm text-text-muted">Use clear, professional images for your profile and projects to enhance visual appeal.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className={`min-w-[2rem] h-8 flex items-center justify-center rounded-full ${isDark ? 'bg-circuit-dark' : 'bg-blue-50'} mr-4`}>
              <span className="text-osc-blue font-medium">3</span>
            </div>
            <div>
              <h4 className="font-medium mb-1">Preview your site</h4>
              <p className="text-sm text-text-muted">
                Remember to check how your portfolio looks on the public-facing site after making changes.
                <Link href="/" className="inline-flex items-center ml-2 text-osc-blue hover:underline">
                  <span>View Site</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}