"use client";

import { ThemeProvider } from '@/context/ThemeContext';
import CircuitBackground from '@/components/layout/CircuitBackground';
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div id="page-transition-overlay" className="fixed inset-0 z-[9999] pointer-events-none bg-black opacity-0 transition-opacity duration-300"></div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
          },
        }}
      />
      <CircuitBackground />
      {children}
    </ThemeProvider>
  );
} 