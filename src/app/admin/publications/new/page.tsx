"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define Publication interface
interface Publication {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  volume: string;
  issue: string;
  pages: string;
  doi: string;
  url: string;
  abstract: string;
}

export default function NewPublicationPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [publication, setPublication] = useState<Publication>({
    title: '',
    authors: [''],
    journal: '',
    year: new Date().getFullYear(),
    volume: '',
    issue: '',
    pages: '',
    doi: '',
    url: '',
    abstract: ''
  });
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('admin-token');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);
  
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
        router.push('/admin/publications');
      } else {
        alert('Failed to save publication');
      }
    } catch (error) {
      console.error('Error saving publication:', error);
      alert('Error saving publication');
    } finally {
      setSaving(false);
    }
  }
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setPublication(prev => ({ ...prev, [name]: value }));
  }
  
  function handleAuthorChange(index: number, value: string) {
    const updatedAuthors = [...publication.authors];
    updatedAuthors[index] = value;
    setPublication(prev => ({ ...prev, authors: updatedAuthors }));
  }
  
  function addAuthor() {
    setPublication(prev => ({
      ...prev,
      authors: [...prev.authors, '']
    }));
  }
  
  function removeAuthor(index: number) {
    if (publication.authors.length === 1) return;
    const updatedAuthors = [...publication.authors];
    updatedAuthors.splice(index, 1);
    setPublication(prev => ({ ...prev, authors: updatedAuthors }));
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Publication</h1>
        <button 
          onClick={() => router.push('/admin/publications')}
          className="px-4 py-2 text-sm bg-bg-dark rounded-lg hover:bg-osc-blue hover:bg-opacity-20"
        >
          Back to Publications
        </button>
      </div>
      
      <form onSubmit={savePublication} className="space-y-6">
        <div>
          <label className="block mb-2 text-sm">Title *</label>
          <input
            type="text"
            name="title"
            value={publication.title}
            onChange={handleChange}
            className="w-full p-2 bg-bg-dark rounded-lg border border-osc-blue border-opacity-50"
            required
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm">Authors *</label>
            <button
              type="button"
              onClick={addAuthor}
              className="text-sm text-comp-gold hover:underline"
            >
              + Add Author
            </button>
          </div>
          
          {publication.authors.map((author, index) => (
            <div key={index} className="mb-2 flex items-center">
              <input
                type="text"
                value={author}
                onChange={(e) => handleAuthorChange(index, e.target.value)}
                className="flex-1 p-2 bg-bg-dark rounded-lg border border-osc-blue border-opacity-50"
                placeholder="Author name"
                required
              />
              {publication.authors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAuthor(index)}
                  className="ml-2 px-2 py-1 text-xs text-red-500 hover:bg-red-500 hover:bg-opacity-10 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm">Journal/Conference *</label>
            <input
              type="text"
              name="journal"
              value={publication.journal}
              onChange={handleChange}
              className="w-full p-2 bg-bg-dark rounded-lg border border-osc-blue border-opacity-50"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm">Year *</label>
            <input
              type="number"
              name="year"
              value={publication.year}
              onChange={handleChange}
              className="w-full p-2 bg-bg-dark rounded-lg border border-osc-blue border-opacity-50"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-2 text-sm">Volume</label>
            <input
              type="text"
              name="volume"
              value={publication.volume}
              onChange={handleChange}
              className="w-full p-2 bg-bg-dark rounded-lg border border-osc-blue border-opacity-50"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm">Issue</label>
            <input
              type="text"
              name="issue"
              value={publication.issue}
              onChange={handleChange}
              className="w-full p-2 bg-bg-dark rounded-lg border border-osc-blue border-opacity-50"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm">Pages</label>
            <input
              type="text"
              name="pages"
              value={publication.pages}
              onChange={handleChange}
              className="w-full p-2 bg-bg-dark rounded-lg border border-osc-blue border-opacity-50"
              placeholder="e.g., 123-145"
            />
          </div>
        </div>
        
        <div>
          <label className="block mb-2 text-sm">DOI</label>
          <input
            type="text"
            name="doi"
            value={publication.doi}
            onChange={handleChange}
            className="w-full p-2 bg-bg-dark rounded-lg border border-osc-blue border-opacity-50"
            placeholder="e.g., 10.1000/xyz123"
          />
        </div>
        
        <div>
          <label className="block mb-2 text-sm">URL</label>
          <input
            type="url"
            name="url"
            value={publication.url}
            onChange={handleChange}
            className="w-full p-2 bg-bg-dark rounded-lg border border-osc-blue border-opacity-50"
            placeholder="https://..."
          />
        </div>
        
        <div>
          <label className="block mb-2 text-sm">Abstract</label>
          <textarea
            name="abstract"
            value={publication.abstract}
            onChange={handleChange}
            rows={5}
            className="w-full p-2 bg-bg-dark rounded-lg border border-osc-blue border-opacity-50"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-comp-gold bg-opacity-20 border border-comp-gold rounded-md hover:bg-opacity-30 transition-all"
          >
            {saving ? 'Saving...' : 'Save Publication'}
          </button>
        </div>
      </form>
    </div>
  );
}