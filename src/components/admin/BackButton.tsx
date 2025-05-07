"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const handleBackClick = () => {
    // Check if we're on a student edit page and redirect to student list
    if (pathname?.includes('/admin/students/edit')) {
      router.push('/admin/students');
    } else if (pathname?.includes('/admin/publications/edit')) {
      router.push('/admin/publications');
    } else if (pathname?.includes('/admin/projects/edit')) {
      router.push('/admin/projects');
    } else if (pathname?.includes('/admin/awards/edit')) {
      router.push('/admin/awards');
    } else if (pathname?.includes('/admin/courses/edit')) {
      router.push('/admin/courses');
    } else {
      router.back();
    }
  };
  
  return (
    <button
      onClick={handleBackClick}
      className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-all duration-200
        ${isDark 
          ? 'text-osc-blue hover:bg-osc-blue/10 active:bg-osc-blue/15' 
          : 'text-osc-blue hover:bg-osc-blue/10 active:bg-osc-blue/15'
        } mb-4 hover:translate-x-[-2px]`}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4 mr-1.5" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 19l-7-7m0 0l7-7m-7 7h18" 
        />
      </svg>
      Back
    </button>
  );
}