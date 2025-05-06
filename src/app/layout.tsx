// src/app/layout.tsx
"use client";

import { ThemeProvider } from '@/context/ThemeContext';
import { Providers } from './providers';
import CircuitBackground from '@/components/layout/CircuitBackground';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <ThemeProvider>
            <CircuitBackground />
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}