"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AwardForm } from '@/components/admin/AwardForm';
import { toast, Toaster } from 'react-hot-toast';
import { confirmDialog } from '@/lib/confirmDialog';
import BackButton from '@/components/admin/BackButton';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import { AdminButton } from '@/components/ui/AdminButton';

interface Award {
  _id: string;
  title: string;
  year: number;
  organization: string;
  description?: string;
  imageUrl?: string;
  link?: string;
}

export default function AwardsAdminPage() {
  const router = useRouter();
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const fetchAwards = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/awards');
      if (response.ok) {
        const data = await response.json();
        setAwards(data);
      } else {
        toast.error('Failed to fetch awards');
      }
    } catch (error) {
      console.error('Error fetching awards:', error);
      toast.error('Error loading awards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  const handleAddNew = () => {
    setEditingAward(null);
    setShowForm(true);
  };

  const handleEdit = (award: Award) => {
    setEditingAward(award);
    setShowForm(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (await confirmDialog(`Are you sure you want to delete "${title}"?`)) {
      try {
        const response = await fetch(`/api/awards?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Award deleted successfully');
          setAwards(awards.filter(award => award._id !== id));
        } else {
          toast.error('Failed to delete award');
        }
      } catch (error) {
        console.error('Error deleting award:', error);
        toast.error('Error deleting award');
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      const url = data._id ? `/api/awards` : '/api/awards';
      const method = data._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(`Award ${data._id ? 'updated' : 'added'} successfully`);
        setShowForm(false);
        fetchAwards();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to save award');
      }
    } catch (error) {
      console.error('Error saving award:', error);
      toast.error('Error saving award');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingAward(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <BackButton />
      
      {showForm ? (
        <div className={`p-6 rounded-lg shadow ${isDark ? 'bg-bg-dark bg-opacity-50' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">
            {editingAward ? `Edit Award: ${editingAward.title}` : 'Add New Award'}
          </h2>
          <AwardForm
            initialData={editingAward || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Awards & Honors</h1>
            <AdminButton
              type="primary"
              onClick={handleAddNew}
              className={`${isDark ? '' : 'bg-comp-gold text-white'}`}
            >
              Add New Award
            </AdminButton>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                isDark ? 'border-circuit-copper' : 'border-comp-gold'
              }`}></div>
            </div>
          ) : (
            <>
              {awards.length > 0 ? (
                <div className="space-y-4">
                  {awards.map((award, index) => (
                    <motion.div 
                      key={award._id} 
                      className={`p-4 rounded-lg border ${
                        isDark 
                          ? 'bg-bg-dark bg-opacity-50 border-circuit-copper border-opacity-20' 
                          : 'bg-white border-comp-gold border-opacity-20'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full mt-1 ${
                            isDark ? 'bg-circuit-dark-blue/20 text-circuit-copper' : 'bg-comp-gold/10 text-comp-gold'
                          }`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                {award.title}
                              </h3>
                              <span className={`ml-3 px-2 py-0.5 text-xs rounded-full ${
                                isDark ? 'bg-circuit-dark-blue/20 text-circuit-copper' : 'bg-comp-gold/10 text-comp-gold'
                              }`}>
                                {award.year}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-500">
                              {award.organization}
                            </p>
                            
                            {award.description && (
                              <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                {award.description}
                              </p>
                            )}
                            
                            {award.link && (
                              <a 
                                href={award.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`text-xs mt-2 inline-block ${
                                  isDark ? 'text-circuit-light-blue' : 'text-osc-blue'
                                }`}
                              >
                                View details →
                              </a>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <AdminButton
                            type="warning"
                            onClick={() => handleEdit(award)}
                          >
                            Edit
                          </AdminButton>
                          
                          <AdminButton
                            type="danger"
                            onClick={() => handleDelete(award._id, award.title)}
                          >
                            Delete
                          </AdminButton>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <p className="mb-4">No awards found yet.</p>
                  <button 
                    onClick={handleAddNew}
                    className={`px-4 py-2 text-sm rounded-lg ${
                      isDark 
                        ? 'bg-circuit-copper bg-opacity-10 border border-circuit-copper text-white hover:bg-opacity-20' 
                        : 'bg-comp-gold bg-opacity-10 border border-comp-gold text-comp-gold hover:bg-opacity-20'
                    }`}
                  >
                    Add Your First Award
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
} 