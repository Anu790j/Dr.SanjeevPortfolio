"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { AdminButton } from '@/components/ui/AdminButton';
import { FileUpload } from '@/components/ui/FileUpload';
import { useTheme } from '@/context/ThemeContext';
import { useSession } from 'next-auth/react';
import BackButton from '@/components/admin/BackButton';
import LoadingSection from '@/components/admin/LoadingSection';

// Define Publication interface
interface Publication {
  _id?: string;
  title: string;
  authors: string;
  category: 'journal' | 'conference' | 'patent';
  journal?: string;
  conference?: string;
  year: number;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  abstract?: string;
  imageUrl?: string;
}

export default function EditPublicationPage() {
  const router = useRouter();
  const params = useParams();
  const publicationId = params.id as string;
  
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [publication, setPublication] = useState<Publication>({
    title: '',
    authors: '',
    category: 'journal',
    journal: '',
    year: new Date().getFullYear(),
    volume: '',
    issue: '',
    pages: '',
    doi: '',
    url: '',
    abstract: '',
    imageUrl: ''
  });
  
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/admin/login');
      return;
    }
    
    if (status === "authenticated") {
      fetchPublication();
    }
  }, [router, status, publicationId]);
  
  async function fetchPublication() {
    try {
      setLoading(true);
      const res = await fetch(`/api/publication/${publicationId}`);
      
      if (res.ok) {
        const data = await res.json();
        setPublication(data);
      } else {
        toast.error('Failed to fetch publication');
        router.push('/admin/publications');
      }
    } catch (error) {
      console.error('Error fetching publication:', error);
      toast.error('Error loading publication');
      router.push('/admin/publications');
    } finally {
      setLoading(false);
    }
  }
  
  async function savePublication(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch(`/api/publication/${publicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(publication)
      });
      
      if (res.ok) {
        toast.success('Publication updated successfully');
        router.push('/admin/publications');
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to update publication');
      }
    } catch (error) {
      console.error('Error updating publication:', error);
      toast.error('Error updating publication');
    } finally {
      setSaving(false);
    }
  }
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setPublication(prev => ({ ...prev, [name]: value }));
  }
  
  function handleImageUploaded(fileId: string) {
    setPublication(prev => ({
      ...prev,
      imageUrl: fileId
    }));
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        <h1 className="text-2xl font-bold mb-6">Edit Publication</h1>
        <LoadingSection />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <BackButton />
      <h1 className="text-2xl font-bold mb-6">Edit Publication</h1>
      
      <form onSubmit={savePublication} className={`p-6 rounded-lg ${isDark ? 'bg-bg-dark' : 'bg-gray-50'}`}>
        <div className="mb-4">
          <label className={`block mb-2 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>Title *</label>
          <input
            type="text"
            name="title"
            value={publication.title}
            onChange={handleChange}
            className={`w-full p-2 rounded-lg border ${
              isDark 
                ? 'bg-bg-darker border-osc-blue/30 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className={`block mb-2 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>Authors *</label>
          <input
            type="text"
            name="authors"
            value={publication.authors}
            onChange={handleChange}
            className={`w-full p-2 rounded-lg border ${
              isDark 
                ? 'bg-bg-darker border-osc-blue/30 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            placeholder="List authors separated by commas"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className={`block mb-2 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>Category *</label>
          <select
            name="category"
            value={publication.category}
            onChange={handleChange}
            className={`w-full p-2 rounded-lg border ${
              isDark 
                ? 'bg-bg-darker border-osc-blue/30 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            required
          >
            <option value="journal">Journal</option>
            <option value="conference">Conference</option>
            <option value="patent">Patent</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className={`block mb-2 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>Publication Image</label>
          <FileUpload
            currentFileId={publication.imageUrl}
            onFileUploaded={handleImageUploaded}
            previewUrl={publication.imageUrl ? `/api/files/${publication.imageUrl}` : undefined}
            label="Upload Image"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block mb-2 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>Journal/Conference *</label>
            <input
              type="text"
              name="journal"
              value={publication.journal}
              onChange={handleChange}
              className={`w-full p-2 rounded-lg border ${
                isDark 
                  ? 'bg-bg-darker border-osc-blue/30 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>
          
          <div>
            <label className={`block mb-2 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>Year *</label>
            <input
              type="number"
              name="year"
              value={publication.year}
              onChange={handleChange}
              className={`w-full p-2 rounded-lg border ${
                isDark 
                  ? 'bg-bg-darker border-osc-blue/30 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
              min="1900"
              max="2100"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className={`block mb-2 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>Volume</label>
            <input
              type="text"
              name="volume"
              value={publication.volume}
              onChange={handleChange}
              className={`w-full p-2 rounded-lg border ${
                isDark 
                  ? 'bg-bg-darker border-osc-blue/30 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          
          <div>
            <label className={`block mb-2 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>Issue</label>
            <input
              type="text"
              name="issue"
              value={publication.issue}
              onChange={handleChange}
              className={`w-full p-2 rounded-lg border ${
                isDark 
                  ? 'bg-bg-darker border-osc-blue/30 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          
          <div>
            <label className={`block mb-2 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>Pages</label>
            <input
              type="text"
              name="pages"
              value={publication.pages}
              onChange={handleChange}
              className={`w-full p-2 rounded-lg border ${
                isDark 
                  ? 'bg-bg-darker border-osc-blue/30 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={`block mb-2 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>DOI</label>
            <input
              type="text"
              name="doi"
              value={publication.doi}
              onChange={handleChange}
              className={`w-full p-2 rounded-lg border ${
                isDark 
                  ? 'bg-bg-darker border-osc-blue/30 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          
          <div>
            <label className={`block mb-2 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>URL</label>
            <input
              type="url"
              name="url"
              value={publication.url}
              onChange={handleChange}
              className={`w-full p-2 rounded-lg border ${
                isDark 
                  ? 'bg-bg-darker border-osc-blue/30 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="https://..."
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className={`block mb-2 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>Abstract</label>
          <textarea
            name="abstract"
            value={publication.abstract}
            onChange={handleChange}
            rows={4}
            className={`w-full p-2 rounded-lg border ${
              isDark 
                ? 'bg-bg-darker border-osc-blue/30 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <AdminButton
            type="secondary"
            onClick={() => router.push('/admin/publications')}
          >
            Cancel
          </AdminButton>
          
          <AdminButton
            type="primary"
            buttonType="submit"
            isLoading={saving}
          >
            Update Publication
          </AdminButton>
        </div>
      </form>
    </div>
  );
} 