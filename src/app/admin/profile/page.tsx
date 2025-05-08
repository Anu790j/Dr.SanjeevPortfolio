"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SimpleEditor from '@/components/admin/SimpleEditor';
import BackButton from '@/components/admin/BackButton';
// import AdminCard from '@/components/admin/AdminCard';

interface Professor {
  _id?: string;
  name: string;
  title: string;
  institution: string;
  department: string;
  email: string;
  phone?: string;
  office?: string;
  bio: string;
  profileImage?: string;
  education: Education[];
  socialLinks: SocialLink[];
  researchInterests: string[];
  typeAnimationSequence?: string[];
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

export default function AdminProfile() {
  const [professor, setProfessor] = useState<Professor>({
    name: '',
    title: '',
    institution: '',
    department: '',
    email: '',
    phone: '',
    office: '',
    bio: '',
    profileImage: '',
    education: [],
    socialLinks: [],
    researchInterests: [],
    typeAnimationSequence: []
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // For education and social links editing
  const [newEducation, setNewEducation] = useState<Education>({ degree: '', institution: '', year: '' });
  const [newSocialLink, setNewSocialLink] = useState<SocialLink>({ platform: '', url: '' });
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    fetchProfessor();
  }, []);

  async function fetchProfessor() {
    try {
      setLoading(true);
      const res = await fetch('/api/professor');
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched professor data:", data);
        if (data && Object.keys(data).length > 0) {
          setProfessor({
            name: data.name || '',
            title: data.title || '',
            institution: data.institution || data.university || '',
            department: data.department || '',
            email: data.email || '',
            phone: data.phone || '',
            office: data.office || '',
            bio: data.bio || '',
            profileImage: data.profileImage || '',
            education: data.education || [],
            socialLinks: data.socialLinks || [],
            researchInterests: data.researchInterests || [],
            typeAnimationSequence: data.typeAnimationSequence || [] 
          });
          
          if (data.profileImage) {
            console.log("Profile image found:", data.profileImage);
          } else {
            console.log("No profile image in fetched data");
          }
        }
      }
    } catch (error) {
      console.error('Error fetching professor data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setSaving(true);
      setMessage({ text: '', type: '' });
      
      console.log('Saving professor data with image:', professor);
      
      const res = await fetch('/api/professor', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(professor),
      });

      if (res.ok) {
        setMessage({ text: 'Profile saved successfully!', type: 'success' });
      } else {
        const errorData = await res.json();
        console.error('Failed to save profile:', errorData);
        setMessage({ text: `Failed to save profile: ${errorData.error || 'Unknown error'}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error saving professor data:', error);
      setMessage({ text: 'An error occurred while saving.', type: 'error' });
    } finally {
      setSaving(false);
      
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setProfessor({
      ...professor,
      [name]: value,
    });
  }

  function handleBioChange(value: string) {
    setProfessor({
      ...professor,
      bio: value,
    });
  }

  function handleProfileImageChange(url: string) {
    setProfessor({
      ...professor,
      profileImage: url,
    });
  }

  async function handleProfileImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log('File upload response:', data);
        
        setProfessor({
          ...professor,
          profileImage: data.fileId
        });
        
        console.log('Updated professor with new profileImage:', data.fileId);
        setMessage({ text: 'Profile image uploaded. Don\'t forget to save changes!', type: 'success' });
      } else {
        setMessage({ text: 'Failed to upload profile image.', type: 'error' });
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      setMessage({ text: 'Error uploading profile image.', type: 'error' });
    } finally {
      setUploading(false);
    }
  }

  function addEducation() {
    if (!newEducation.degree || !newEducation.institution) return;
    
    setProfessor({
      ...professor,
      education: [...professor.education, newEducation]
    });
    
    setNewEducation({ degree: '', institution: '', year: '' });
  }

  function removeEducation(index: number) {
    const newEducation = [...professor.education];
    newEducation.splice(index, 1);
    setProfessor({
      ...professor,
      education: newEducation
    });
  }

  function addSocialLink() {
    if (!newSocialLink.platform || !newSocialLink.url) return;
    
    setProfessor({
      ...professor,
      socialLinks: [...professor.socialLinks, newSocialLink]
    });
    
    setNewSocialLink({ platform: '', url: '' });
  }

  function removeSocialLink(index: number) {
    const newLinks = [...professor.socialLinks];
    newLinks.splice(index, 1);
    setProfessor({
      ...professor,
      socialLinks: newLinks
    });
  }

  function addResearchInterest() {
    if (!newInterest.trim()) return;
    
    setProfessor({
      ...professor,
      researchInterests: [...professor.researchInterests, newInterest.trim()]
    });
    
    setNewInterest('');
  }

  function removeResearchInterest(index: number) {
    const newInterests = [...professor.researchInterests];
    newInterests.splice(index, 1);
    setProfessor({
      ...professor,
      researchInterests: newInterests
    });
  }

  function handleAnimationSequenceChange(index: number, value: string) {
    const updatedSequence = [...professor.typeAnimationSequence || []];
    updatedSequence[index] = value;
    setProfessor({
      ...professor,
      typeAnimationSequence: updatedSequence,
    });
  }

  const addAnimationStep = () => {
    const updatedSequence = [...(professor.typeAnimationSequence || []), ""];
    setProfessor({ ...professor, typeAnimationSequence: updatedSequence });
  };

  function removeAnimationStep(index: number) {
    const updatedSequence = [...professor.typeAnimationSequence || []];
    updatedSequence.splice(index, 1);
    setProfessor({
      ...professor,
      typeAnimationSequence: updatedSequence
    });
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-pulse h-8 w-8 bg-osc-blue rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <BackButton />
          <h1 className="text-2xl font-bold mt-4">Profile Management</h1>
        </div>
        <button
          type="button"
          onClick={() => window.location.href = '/'}
          className="flex items-center text-sm px-4 py-2 rounded-lg hover:bg-osc-blue hover:bg-opacity-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Public Profile
        </button>
      </div>
  
      {message.text && (
        <motion.div 
          className={`mb-8 p-4 rounded-md flex items-center ${
            message.type === 'success' ? 'bg-green-500 bg-opacity-10 text-green-400' : 'bg-red-500 bg-opacity-10 text-red-400'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mr-3">
            {message.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          {message.text}
        </motion.div>
      )}
      
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-bg-dark bg-opacity-60 backdrop-blur-md p-8 rounded-xl shadow-sm">
            <h2 className="text-lg font-medium mb-6 text-osc-blue">Basic Information</h2>
            
            <div className="flex flex-col md:flex-row gap-10 mb-8">
              <div className="w-full md:w-1/3 flex flex-col items-center">
                {professor.profileImage ? (
                  <div className="w-44 h-44 rounded-xl overflow-hidden bg-bg-darker relative group shadow-md mb-4">
                    <img 
                      src={`/api/files/${professor.profileImage}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log("Image load error, trying alternate URL format");
                        const target = e.target as HTMLImageElement;
                        target.src = `/api/files/${professor.profileImage}/image`;
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => {
                          setProfessor({
                            ...professor,
                            profileImage: ''
                          });
                          setMessage({ text: 'Profile image removed. Save changes to update.', type: 'success' });
                        }}
                        className="text-white hover:text-red-400 bg-red-500 bg-opacity-20 px-3 py-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-44 h-44 rounded-xl bg-bg-darker flex items-center justify-center shadow-md mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                
                <label 
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-osc-blue text-white rounded-md hover:bg-opacity-90 transition-colors shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{professor.profileImage ? 'Change Image' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageUpload}
                  />
                </label>
                {uploading && (
                  <div className="mt-2 flex items-center text-sm text-text-muted">
                    <svg className="animate-spin h-4 w-4 mr-2 text-osc-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </div>
                )}
              </div>
              
              <div className="w-full md:w-2/3 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm text-text-muted">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={professor.name || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-bg-darker border-b-2 border-osc-blue/30 rounded-md focus:border-osc-blue focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-text-muted">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={professor.title || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-bg-darker border-b-2 border-osc-blue/30 rounded-md focus:border-osc-blue focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm text-text-muted">Institution</label>
                    <input
                      type="text"
                      name="institution"
                      value={professor.institution || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-bg-darker border-b-2 border-osc-blue/30 rounded-md focus:border-osc-blue focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-text-muted">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={professor.department || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-bg-darker border-b-2 border-osc-blue/30 rounded-md focus:border-osc-blue focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block mb-2 text-sm text-text-muted">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={professor.email || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-bg-darker border-b-2 border-osc-blue/30 rounded-md focus:border-osc-blue focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-text-muted">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={professor.phone || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-bg-darker border-b-2 border-osc-blue/30 rounded-md focus:border-osc-blue focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-text-muted">Office</label>
                    <input
                      type="text"
                      name="office"
                      value={professor.office || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-bg-darker border-b-2 border-osc-blue/30 rounded-md focus:border-osc-blue focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <label className="block mb-2 text-sm text-text-muted">Biography</label>
              <SimpleEditor
                label=""
                value={professor.bio || ''}
                onChange={handleBioChange}
                minHeight="250px"
              />
            </div>
  
            {/* Animation Sequence Section */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-osc-blue mb-4">Animation Sequence</h3>
              {professor.typeAnimationSequence?.map((step, index) => (
                <div key={index} className="flex items-center gap-4 mb-4">
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleAnimationSequenceChange(index, e.target.value)}
                    className="w-full px-3 py-2 bg-bg-darker border-b-2 border-osc-blue/30 rounded-md focus:border-osc-blue focus:outline-none transition-colors"
                    placeholder={`Animation Step ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeAnimationStep(index)}
                    className="text-red-400 hover:text-red-500 p-2 rounded-full hover:bg-red-500 hover:bg-opacity-10 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addAnimationStep}
                className="flex items-center px-4 py-2 text-osc-blue hover:bg-osc-blue hover:bg-opacity-10 rounded-md transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Animation Step
              </button>
            </div>
          </div>
          
          <div className="bg-bg-dark bg-opacity-60 backdrop-blur-md p-8 rounded-xl shadow-sm">
            <h2 className="text-lg font-medium mb-6 text-osc-blue">Education</h2>
            
            {professor.education.length > 0 && (
              <div className="mb-6">
                <div className="space-y-3">
                  {professor.education.map((edu, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center justify-between p-4 bg-bg-darker rounded-md"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div>
                        <div className="font-medium">{edu.degree}</div>
                        <div className="text-sm text-text-muted">{edu.institution}, {edu.year}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-red-400 hover:text-red-500 p-2 rounded-full hover:bg-red-500 hover:bg-opacity-10 transition-colors"
                        aria-label="Remove education"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="p-4 bg-bg-darker rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Degree"
                    value={newEducation.degree || ''}
                    onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                    className="w-full px-3 py-2.5 bg-transparent border-b-2 border-osc-blue/30 rounded-t-md focus:border-osc-blue focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Institution"
                    value={newEducation.institution || ''}
                    onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
                    className="w-full px-3 py-2.5 bg-transparent border-b-2 border-osc-blue/30 rounded-t-md focus:border-osc-blue focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Year"
                    value={newEducation.year || ''}
                    onChange={(e) => setNewEducation({...newEducation, year: e.target.value})}
                    className="flex-grow px-3 py-2.5 bg-transparent border-b-2 border-osc-blue/30 rounded-tl-md focus:border-osc-blue focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={addEducation}
                    className="px-4 py-2.5 bg-osc-blue text-white rounded-tr-md hover:bg-opacity-90 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-bg-dark bg-opacity-60 backdrop-blur-md p-8 rounded-xl shadow-sm">
            <h2 className="text-lg font-medium mb-6 text-osc-blue">Research Interests</h2>
            
            <div className="mb-6">
              {professor.researchInterests.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {professor.researchInterests.map((interest, index) => (
                    <div 
                      key={index} 
                      className="flex items-center bg-osc-blue bg-opacity-10 px-3 py-1.5 rounded-full"
                    >
                      <span className="mr-1.5 text-osc-blue">{interest}</span>
                      <button
                        type="button"
                        onClick={() => removeResearchInterest(index)}
                        className="ml-1 text-xs hover:text-red-400 rounded-full h-5 w-5 flex items-center justify-center transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex">
                <input
                  type="text"
                  placeholder="Add a research interest"
                  value={newInterest || ''}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addResearchInterest())}
                  className="flex-grow px-3 py-2.5 bg-bg-darker border-b-2 border-osc-blue/30 rounded-l-md focus:border-osc-blue focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={addResearchInterest}
                  className="px-4 py-2.5 bg-osc-blue text-white rounded-r-md hover:bg-opacity-90 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-bg-dark bg-opacity-60 backdrop-blur-md p-8 rounded-xl shadow-sm">
            <h2 className="text-lg font-medium mb-6 text-osc-blue">Social Links</h2>
            
            {professor.socialLinks.length > 0 && (
              <div className="mb-6">
                <div className="space-y-3">
                  {professor.socialLinks.map((link, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center justify-between p-4 bg-bg-darker rounded-md"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex-1 mr-4">
                        <div className="font-medium">{link.platform}</div>
                        <div className="text-sm text-text-muted truncate">{link.url}</div>
                      </div>
                      <div className="flex items-center">
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-osc-blue hover:text-circuit-light-blue p-2 rounded-full hover:bg-osc-blue hover:bg-opacity-10 transition-colors mr-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </a>
                        <button
                          type="button"
                          onClick={() => removeSocialLink(index)}
                          className="text-red-400 hover:text-red-500 p-2 rounded-full hover:bg-red-500 hover:bg-opacity-10 transition-colors"
                          aria-label="Remove social link"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="p-4 bg-bg-darker rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Platform (e.g., LinkedIn, Twitter)"
                    value={newSocialLink.platform || ''}
                    onChange={(e) => setNewSocialLink({...newSocialLink, platform: e.target.value})}
                    className="w-full px-3 py-2.5 bg-transparent border-b-2 border-osc-blue/30 rounded-t-md focus:border-osc-blue focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="URL"
                    value={newSocialLink.url || ''}
                    onChange={(e) => setNewSocialLink({...newSocialLink, url: e.target.value})}
                    className="flex-grow px-3 py-2.5 bg-transparent border-b-2 border-osc-blue/30 rounded-tl-md focus:border-osc-blue focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={addSocialLink}
                    className="px-4 py-2.5 bg-osc-blue text-white rounded-tr-md hover:bg-opacity-90 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="fixed bottom-6 right-6 z-10">
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-3 bg-osc-blue rounded-full text-white font-medium ${
                saving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90'
              } shadow-lg transition-all flex items-center`}
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}