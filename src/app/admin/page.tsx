"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('admin-token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      window.location.href = '/admin/login';
    }
  }, []);

  if (!isLoggedIn) {
    return <div>Checking authorization...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="Professor Info" 
          description="Edit your personal information, education, and background."
          link="/admin/professor"
          icon="👨‍🏫"
        />
        <DashboardCard 
          title="Publications" 
          description="Manage your research publications and papers."
          link="/admin/publications"
          icon="📚"
        />
        <DashboardCard 
          title="Projects" 
          description="Update your research projects and collaborations."
          link="/admin/projects"
          icon="🔬"
        />
        <DashboardCard 
          title="Teaching" 
          description="Add and edit courses and teaching materials."
          link="/admin/teaching"
          icon="🎓"
        />
        <DashboardCard 
          title="Files" 
          description="Upload and manage documents and images."
          link="/admin/files"
          icon="📁"
        />
        <DashboardCard 
          title="Settings" 
          description="Configure website settings and appearance."
          link="/admin/settings"
          icon="⚙️"
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, description, link, icon }: { title: string, description: string, link: string, icon: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      className="bg-bg-dark bg-opacity-50 backdrop-blur-md rounded-lg p-6 border border-osc-blue border-opacity-20"
    >
      <Link href={link} className="block h-full">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-lg font-medium mb-2 text-comp-gold">{title}</h3>
        <p className="text-sm text-text-muted">{description}</p>
      </Link>
    </motion.div>
  );
}