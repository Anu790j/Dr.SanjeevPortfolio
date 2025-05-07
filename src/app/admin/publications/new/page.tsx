"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast, Toaster } from 'react-hot-toast';
import { AdminButton } from '@/components/ui/AdminButton';
import { FileUpload } from '@/components/ui/FileUpload';
import { useTheme } from '@/context/ThemeContext';
import { useSession } from 'next-auth/react';
import BackButton from '@/components/admin/BackButton';

// Define Publication interface
interface Publication {
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

export default function NewPublicationPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
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
    }
  }, [router, status]);
  
  async function savePublication(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch('/api/publication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(publication)
      });
      
      if (res.ok) {
        toast.success('Publication saved successfully');
        router.push('/admin/publications');
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to save publication');
      }
    } catch (error) {
      console.error('Error saving publication:', error);
      toast.error('Error saving publication');
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
  
  if (status === "loading") {
    return (
      <div className="p-6 max-w-4xl mx-auto">
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
      <h1 className="text-2xl font-bold mb-6">Add New Publication</h1>
      
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        
        <div>
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
            Save Publication
          </AdminButton>
        </div>
      </form>
    </div>
  );
}