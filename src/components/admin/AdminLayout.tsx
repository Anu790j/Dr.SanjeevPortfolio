import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import BackButton from './BackButton';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <BackButton />
            {title && (
              <h1 className="ml-4 text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
            )}
          </div>
        </div>
        
        {children}
      </div>
    </div>
  );
}; 