"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import BackButton from '@/components/admin/BackButton';

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
}

export default function PublicationsPage() {
  const router = useRouter();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  
  useEffect(() => {
    // Use NextAuth session instead of localStorage
    if (status === "unauthenticated") {
      router.push('/admin/login');
      return;
    }
    
    fetchPublications();
  }, [router, status]);
  
  async function fetchPublications() {
    try {
      const res = await fetch('/api/publication');
      if (res.ok) {
        const data = await res.json();
        setPublications(data);
      } else {
        setError('Failed to fetch publications');
      }
    } catch (error) {
      console.error('Error fetching publications:', error);
      setError('Error loading publications');
    } finally {
      setLoading(false);
    }
  }
  
  async function deletePublication(id: string) {
    if (!confirm('Are you sure you want to delete this publication?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/publication/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        fetchPublications();
      } else {
        setError('Failed to delete publication');
      }
    } catch (error) {
      console.error('Error deleting publication:', error);
      setError('Error deleting publication');
    }
  }
  
  if (loading) {
    return <div className="p-6">Loading publications...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <h1 className="text-2xl font-bold mb-6">Publications Management</h1>
      <div className="flex justify-between items-center mb-6">
        <div>
  
          
          <button 
            onClick={() => router.push('/admin/publications/new')}
            className="px-4 py-2 text-sm bg-comp-gold bg-opacity-20 border border-comp-gold rounded-lg hover:bg-opacity-30"
          >
            Add New Publication
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-50 rounded-lg text-red-500">
          {error}
        </div>
      )}
      
      {publications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted mb-4">No publications found</p>
          <button 
            onClick={() => router.push('/admin/publications/new')}
            className="px-4 py-2 text-sm bg-comp-gold bg-opacity-10 border border-comp-gold rounded-lg hover:bg-opacity-20"
          >
            Add Your First Publication
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {publications.map((publication) => (
            <div 
              key={publication._id} 
              className="p-4 bg-bg-dark bg-opacity-50 rounded-lg border border-osc-blue border-opacity-20"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-comp-gold">{publication.title}</h3>
                  <p className="text-sm text-text-muted">{Array.isArray(publication.authors) ? publication.authors.join(', ') : publication.authors}</p>
                  <p className="text-xs">{publication.journal}, {publication.year}</p>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => router.push(`/admin/publications/edit/${publication._id}`)}
                    className="px-3 py-1 text-xs bg-osc-blue bg-opacity-10 rounded hover:bg-opacity-20"
                  >
                    Edit
                  </button>
                  
                  <button 
                    onClick={() => deletePublication(publication._id)}
                    className="px-3 py-1 text-xs bg-red-500 bg-opacity-10 rounded hover:bg-opacity-20 text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}