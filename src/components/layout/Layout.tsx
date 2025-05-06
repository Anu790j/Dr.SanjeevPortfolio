// src/components/layout/Layout.tsx
import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ThemeProvider } from '@/context/ThemeContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <ThemeToggle />
      <div className="flex flex-col min-h-screen modern-pcb-background">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};