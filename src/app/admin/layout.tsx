"use client";


import { redirect, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminThemeToggle from "@/components/admin/AdminThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { useSession } from "next-auth/react";
import { PageLoader } from "@/components/ui/PageLoader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    // Reset the navigation state when pathname changes
    setIsNavigating(false);
  }, [pathname]);

  const handleNavigation = (path: string) => {
    if (path !== pathname) {
      setIsNavigating(true);
      router.push(path);
    }
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (status === "loading") {
    return <PageLoader message="Loading session..." />;
  }

  if (status === "unauthenticated") {
    redirect("/admin/login");
  }

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${isDark ? 'bg-bg-darker' : 'bg-bg-primary'}`}>
      {isNavigating && <PageLoader message="Loading page..." />}
      
      {/* Sidebar */}
      <motion.div 
        className={`md:w-64 ${isDark ? 'bg-bg-dark' : 'bg-bg-secondary'} border-r border-osc-blue border-opacity-20 md:fixed md:h-screen overflow-y-auto z-10 shadow-lg`}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6 flex justify-between items-center border-b border-osc-blue border-opacity-10">
          <Link href="/admin/dashboard" className="flex items-center space-x-2" onClick={() => handleNavigation('/admin/dashboard')}>
            <span className="text-xl text-osc-blue font-bold">Admin Panel</span>
          </Link>
          <div className="flex items-center space-x-2">
            <AdminThemeToggle />
            <button 
              className="md:hidden text-osc-blue p-2 rounded-lg hover:bg-osc-blue hover:bg-opacity-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
        
        <nav className={`p-6 ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
          <p className="text-xs uppercase text-text-muted mb-4 font-medium tracking-wider">Navigation</p>
          <ul className="space-y-3">
            <li>
              <Link 
                href="/admin/dashboard" 
                onClick={(e) => { e.preventDefault(); handleNavigation('/admin/dashboard'); }}
                className={`flex items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                  pathname.includes('/admin/dashboard') 
                    ? `${isDark ? 'bg-osc-blue/20 text-osc-blue' : 'bg-osc-blue/20 text-osc-blue'} font-medium shadow-sm` 
                    : `hover:bg-osc-blue/10 active:bg-osc-blue/15 ${isDark ? 'text-gray-200' : 'text-gray-700'} hover:text-osc-blue hover:translate-x-1`
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                </svg>
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/profile" 
                onClick={(e) => { e.preventDefault(); handleNavigation('/admin/profile'); }}
                className={`flex items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                  pathname.includes('/admin/profile') 
                    ? `${isDark ? 'bg-osc-blue/20 text-osc-blue' : 'bg-osc-blue/20 text-osc-blue'} font-medium shadow-sm` 
                    : `hover:bg-osc-blue/10 active:bg-osc-blue/15 ${isDark ? 'text-gray-200' : 'text-gray-700'} hover:text-osc-blue hover:translate-x-1`
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/publications" 
                onClick={(e) => { e.preventDefault(); handleNavigation('/admin/publications'); }}
                className={`flex items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                  pathname.includes('/admin/publications') 
                    ? `${isDark ? 'bg-osc-blue/20 text-osc-blue' : 'bg-osc-blue/20 text-osc-blue'} font-medium shadow-sm` 
                    : `hover:bg-osc-blue/10 active:bg-osc-blue/15 ${isDark ? 'text-gray-200' : 'text-gray-700'} hover:text-osc-blue hover:translate-x-1`
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Publications
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/students" 
                onClick={(e) => { e.preventDefault(); handleNavigation('/admin/students'); }}
                className={`flex items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                  pathname.includes('/admin/students') 
                    ? `${isDark ? 'bg-osc-blue/20 text-osc-blue' : 'bg-osc-blue/20 text-osc-blue'} font-medium shadow-sm` 
                    : `hover:bg-osc-blue/10 active:bg-osc-blue/15 ${isDark ? 'text-gray-200' : 'text-gray-700'} hover:text-osc-blue hover:translate-x-1`
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Students
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/awards" 
                onClick={(e) => { e.preventDefault(); handleNavigation('/admin/awards'); }}
                className={`flex items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                  pathname.includes('/admin/awards') 
                    ? `${isDark ? 'bg-osc-blue/20 text-osc-blue' : 'bg-osc-blue/20 text-osc-blue'} font-medium shadow-sm` 
                    : `hover:bg-osc-blue/10 active:bg-osc-blue/15 ${isDark ? 'text-gray-200' : 'text-gray-700'} hover:text-osc-blue hover:translate-x-1`
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Awards
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/projects" 
                onClick={(e) => { e.preventDefault(); handleNavigation('/admin/projects'); }}
                className={`flex items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                  pathname.includes('/admin/projects') 
                    ? `${isDark ? 'bg-osc-blue/20 text-osc-blue' : 'bg-osc-blue/20 text-osc-blue'} font-medium shadow-sm` 
                    : `hover:bg-osc-blue/10 active:bg-osc-blue/15 ${isDark ? 'text-gray-200' : 'text-gray-700'} hover:text-osc-blue hover:translate-x-1`
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Projects
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/courses" 
                onClick={(e) => { e.preventDefault(); handleNavigation('/admin/courses'); }}
                className={`flex items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                  pathname.includes('/admin/courses') 
                    ? `${isDark ? 'bg-osc-blue/20 text-osc-blue' : 'bg-osc-blue/20 text-osc-blue'} font-medium shadow-sm` 
                    : `hover:bg-osc-blue/10 active:bg-osc-blue/15 ${isDark ? 'text-gray-200' : 'text-gray-700'} hover:text-osc-blue hover:translate-x-1`
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
                Courses
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/files" 
                onClick={(e) => { e.preventDefault(); handleNavigation('/admin/files'); }}
                className={`flex items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                  pathname.includes('/admin/files') 
                    ? `${isDark ? 'bg-osc-blue/20 text-osc-blue' : 'bg-osc-blue/20 text-osc-blue'} font-medium shadow-sm` 
                    : `hover:bg-osc-blue/10 active:bg-osc-blue/15 ${isDark ? 'text-gray-200' : 'text-gray-700'} hover:text-osc-blue hover:translate-x-1`
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                Files
              </Link>
            </li>
          </ul>
          
          <div className="mt-8 pt-6 border-t border-osc-blue border-opacity-10">
            <Link 
              href="/"
              className={`flex items-center py-2 px-4 rounded-lg transition-all duration-200 
                ${isDark ? 'text-gray-300' : 'text-gray-700'} 
                hover:bg-osc-blue/10 hover:text-osc-blue active:bg-osc-blue/15 hover:translate-x-1`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              View Site
            </Link>
          </div>
        </nav>
      </motion.div>

      {/* Main content */}
      <motion.div 
        className="flex-1 p-6 md:ml-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}