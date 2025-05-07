"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import BackButton from '@/components/admin/BackButton';
import { toast, Toaster } from 'react-hot-toast';
import { AdminButton } from '@/components/ui/AdminButton';
import { useTheme } from '@/context/ThemeContext';
import { confirmDialog } from '@/lib/confirmDialog';

// Define Publication interface
interface Publication {
  _id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  abstract?: string;
  imageUrl?: string;
}

export default function PublicationsPage() {
  const router = useRouter();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  useEffect(() => {
    // Use NextAuth session instead of localStorage
    if (status === "unauthenticated") {
      router.push('/admin/login');
      return;
    }
    
    if (status === "authenticated") {
      fetchPublications();
    }
  }, [router, status]);
  
  async function fetchPublications() {
    try {
      setLoading(true);
      const res = await fetch('/api/publication');
      if (res.ok) {
        const data = await res.json();
        setPublications(data);
      } else {
        setError('Failed to fetch publications');
        toast.error('Failed to fetch publications');
      }
    } catch (error) {
      console.error('Error fetching publications:', error);
      setError('Error loading publications');
      toast.error('Error loading publications');
    } finally {
      setLoading(false);
    }
  }
  
  async function deletePublication(id: string) {
    if (!await confirmDialog('Are you sure you want to delete this publication?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/publication/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        toast.success('Publication deleted successfully');
        fetchPublications();
      } else {
        setError('Failed to delete publication');
        toast.error('Failed to delete publication');
      }
    } catch (error) {
      console.error('Error deleting publication:', error);
      setError('Error deleting publication');
      toast.error('Error deleting publication');
    }
  }

  function handleAddNew() {
    router.push('/admin/publications/new');
  }
  
  function handleEdit(id: string) {
    router.push(`/admin/publications/edit/${id}`);
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        <h1 className="text-2xl font-bold mb-6">Publications Management</h1>
        <div className="flex justify-center py-12">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
            isDark ? 'border-osc-blue' : 'border-osc-blue'
          }`}></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <BackButton />
      <h1 className="text-2xl font-bold mb-6">Publications Management</h1>
      <div className="flex justify-between items-center mb-6">
        <div>
          <AdminButton
            type="primary"
            onClick={handleAddNew}
            className={`${isDark ? '' : 'bg-osc-blue text-white'}`}
          >
            Add New Publication
          </AdminButton>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-50 rounded-lg text-red-500">
          {error}
        </div>
      )}
      
      {publications.length === 0 ? (
        <div className="text-center py-12">
          <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No publications found</p>
          <AdminButton
            type="primary"
            onClick={handleAddNew}
            className={`${isDark ? '' : 'bg-osc-blue text-white'}`}
          >
            Add Your First Publication
          </AdminButton>
        </div>
      ) : (
        <div className="space-y-4">
          {publications.map((publication) => (
            <div 
              key={publication._id} 
              className={`p-4 rounded-lg border ${
                isDark 
                  ? 'bg-bg-dark bg-opacity-50 border-osc-blue border-opacity-20' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-comp-gold' : 'text-osc-blue'}`}>{publication.title}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{Array.isArray(publication.authors) ? publication.authors.join(', ') : publication.authors}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{publication.journal}, {publication.year}</p>
                </div>
                
                <div className="flex space-x-2">
                  <AdminButton
                    type="warning"
                    onClick={() => handleEdit(publication._id)}
                  >
                    Edit
                  </AdminButton>
                  
                  <AdminButton
                    type="danger"
                    onClick={() => deletePublication(publication._id)}
                  >
                    Delete
                  </AdminButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}