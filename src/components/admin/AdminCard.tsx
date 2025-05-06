"use client";

import React from 'react';

interface AdminCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const AdminCard: React.FC<AdminCardProps> = ({ 
  title, 
  children,
  className = ""
}) => {
  return (
    <div className={`p-6 bg-bg-dark bg-opacity-80 backdrop-blur-lg rounded-lg border border-osc-blue border-opacity-20 ${className}`}>
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      {children}
    </div>
  );
};

export default AdminCard; 