'use client';
   
import { SessionProvider } from 'next-auth/react';
import { LoadingProvider } from '@/context/LoadingContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LoadingProvider>
        {children}
      </LoadingProvider>
    </SessionProvider>
  );
}