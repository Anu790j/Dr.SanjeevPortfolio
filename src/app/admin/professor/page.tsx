"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define types for the education and professor data
interface Education {
  degree: string;
  institution: string;
  year: string | number;
}

interface ProfessorData {
  name: string;
  title: string;
  university: string;
  department: string;
  bio: string;
  photoUrl: string;
  education: Education[];
  researchInterests: string[];
}

export default function ProfessorEditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [professor, setProfessor] = useState<ProfessorData>({
    name: '',
    title: '',
    university: '',
    department: '',
    bio: '',
    photoUrl: '',
    education: [],
    researchInterests: []
  });
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('admin-token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    
    // Fetch professor data
    fetchProfessor();
  }, [router]);
  
  async function fetchProfessor() {
    try {
      const res = await fetch('/api/professor');
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setProfessor(data);
        }
      }
    } catch (error) {
      console.error('Error fetching professor data:', error);
    } finally {
      setLoading(false);
    }
  }
  
  async function saveProfessor(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch('/api/professor', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(professor)
      });
      
      if (res.ok) {
        alert('Professor information saved successfully');
      } else {
        alert('Failed to save professor information');
      }
    } catch (error) {
      console.error('Error saving professor data:', error);
      alert('Error saving professor information');
    } finally {
      setSaving(false);
    }
  }
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setProfessor(prev => ({ ...prev, [name]: value }));
  }
  
  function handleEducationChange(index: number, field: keyof Education, value: string) {
    const updatedEducation = [...professor.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setProfessor(prev => ({ ...prev, education: updatedEducation }));
  }
  
  function addEducation() {
    setProfessor(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', year: '' }]
    }));
  }
  
  function removeEducation(index: number) {
    const updatedEducation = [...professor.education];
    updatedEducation.splice(index, 1);
    setProfessor(prev => ({ ...prev, education: updatedEducation }));
  }
  
  function handleResearchInterestChange(index: number, value: string) {
    const updatedInterests = [...professor.researchInterests];
    updatedInterests[index] = value;
    setProfessor(prev => ({ ...prev, researchInterests: updatedInterests }));
  }
  
  function addResearchInterest() {
    setProfessor(prev => ({
      ...prev,
      researchInterests: [...prev.researchInterests, '']
    }));
  }
  
  function removeResearchInterest(index: number) {
    const updatedInterests = [...professor.researchInterests];
    updatedInterests.splice(index, 1);
    setProfessor(prev => ({ ...prev, researchInterests: updatedInterests }));
  }
  
  if (loading) {
    return <div className="p-6">Loading...</div>;
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Professor Information</h1>
        <button 
          onClick={() => router.push('/admin')}
          className="px-4 py-2 text-sm bg-bg-dark rounded-lg hover:bg-osc-blue hover:bg-opacity-20"
        >
          Back to Dashboard
        </button>
      </div>
      
      <form onSubmit={saveProfessor} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm">Name</label>
            <input
              type="text"
              name="name"
              value={professor.name}
              onChange={handleChange}
              className="w-full p-2 bg-bg-dark rounded-lg border border-osc-blue border-opacity-50"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm">Title</label>
            <input
              type="text"
              name="title"
              value={professor.title}
              onChange={handleChange}
              className="w-full p-2 bg-bg-dark rounded-lg border border-osc-blue border-opacity-50"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm">University</label>
            <input
              type="text"
              name="university"
              value={professor.university}
              onChange={handleChange}
              className="w-full p-2 bg-bg-dark rounded-lg border border-osc-blue border-opacity-50"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm">Department</label>
            <input
              type="text"
              name="department"
              value={professor.department}
              onChange={handleChange}
              className="w-full p-2 bg-bg-dark rounded-lg border border-osc-blue border-opacity-50"
            />
          </div>
        </div>
        
        <div>
          <label className="block mb-2 text-sm">Photo URL</label>
          <input
            type="text"
            name="photoUrl"
            value={professor.photoUrl}
            onChange={handleChange}
            className="w-full p-2 bg-bg-dark rounded-lg border border-osc-blue border-opacity-50"
            placeholder="URL to your profile photo"
          />
        </div>
        
        <div>
          <label className="block mb-2 text-sm">Bio</label>
          <textarea
            name="bio"
            value={professor.bio}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 bg-bg-dark rounded-lg border border-osc-blue border-opacity-50"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm">Education</label>
            <button
              type="button"
              onClick={addEducation}
              className="text-sm text-comp-gold hover:underline"
            >
              + Add Education
            </button>
          </div>
          
          {professor.education.map((edu, index) => (
            <div key={index} className="mb-4 p-3 bg-bg-dark bg-opacity-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-comp-gold">Education #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 text-xs">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    className="w-full p-2 bg-bg-dark rounded-lg border border-osc-blue border-opacity-50"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs">Institution</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                    className="w-full p-2 bg-bg-dark rounded-lg border border-osc-blue border-opacity-50"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs">Year</label>
                  <input
                    type="number"
                    value={edu.year}
                    onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                    className="w-full p-2 bg-bg-dark rounded-lg border border-osc-blue border-opacity-50"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm">Research Interests</label>
            <button
              type="button"
              onClick={addResearchInterest}
              className="text-sm text-comp-gold hover:underline"
            >
              + Add Research Interest
            </button>
          </div>
          
          {professor.researchInterests.map((interest, index) => (
            <div key={index} className="mb-2 flex items-center">
              <input
                type="text"
                value={interest}
                onChange={(e) => handleResearchInterestChange(index, e.target.value)}
                className="flex-1 p-2 bg-bg-dark rounded-lg border border-osc-blue border-opacity-50"
              />
              <button
                type="button"
                onClick={() => removeResearchInterest(index)}
                className="ml-2 px-2 py-1 text-xs text-red-500 hover:bg-red-500 hover:bg-opacity-10 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-osc-blue bg-opacity-20 border border-osc-blue rounded-md hover:bg-opacity-30 transition-all"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}