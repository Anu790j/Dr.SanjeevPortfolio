import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { BlurCard } from '@/components/ui/BlurCard';

interface StudentData {
  _id?: string;
  name: string;
  category: string;
  email: string;
  photoUrl: string;
  degree: string;
  researchArea: string;
  startYear?: number;
  endYear?: number;
  linkedin: string;
  position: string;
  description: string;
  achievements: string[];
}

interface StudentFormProps {
  initialData?: StudentData;
  onSubmit: (data: StudentData) => void;
  onCancel: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'current',
    email: '',
    photoUrl: '',
    degree: '',
    researchArea: '',
    startYear: '',
    endYear: '',
    linkedin: '',
    position: '',
    description: '',
    achievements: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'current',
        email: initialData.email || '',
        photoUrl: initialData.photoUrl || '',
        degree: initialData.degree || '',
        researchArea: initialData.researchArea || '',
        startYear: initialData.startYear ? String(initialData.startYear) : '',
        endYear: initialData.endYear ? String(initialData.endYear) : '',
        linkedin: initialData.linkedin || '',
        position: initialData.position || '',
        description: initialData.description || '',
        achievements: initialData.achievements ? initialData.achievements.join('\n') : ''
      });
      
      // Set preview URL if photo exists
      if (initialData.photoUrl) {
        setPreviewUrl(`/api/files/${initialData.photoUrl}`);
      }
    }
  }, [initialData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
        
        setFormData(prev => ({
          ...prev,
          photoUrl: data.fileId
        }));
        
        setPreviewUrl(`/api/files/${data.fileId}`);
        toast.success('Photo uploaded. Don\'t forget to save changes!');
      } else {
        toast.error('Failed to upload photo.');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Error uploading photo.');
    } finally {
      setUploading(false);
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Format achievements as array
      const achievementsArray = formData.achievements
        ? formData.achievements.split('\n').filter(item => item.trim() !== '')
        : [];
      
      // Format years as numbers
      const startYear = formData.startYear ? parseInt(formData.startYear, 10) : undefined;
      const endYear = formData.endYear ? parseInt(formData.endYear, 10) : undefined;
      
      const studentData: StudentData = {
        ...formData,
        achievements: achievementsArray,
        startYear,
        endYear
      };
      
      if (initialData?._id) {
        studentData._id = initialData._id;
      }
      
      await onSubmit(studentData);
      toast.success(initialData ? 'Student updated successfully' : 'Student added successfully');
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error('Error saving student');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <BlurCard title="Student Information">
          <div className="space-y-6">
            {/* Photo Upload Section */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Student Photo
              </label>
              
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Photo Preview */}
                <div className={`relative w-40 h-40 overflow-hidden rounded-full border-2 ${
                  isDark 
                    ? 'border-circuit-copper bg-circuit-dark' 
                    : 'border-osc-blue bg-gray-100'
                }`}>
                  {previewUrl ? (
                    <Image 
                      src={previewUrl} 
                      alt="Student photo" 
                      width={160} 
                      height={160} 
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Upload Controls */}
                <div className="space-y-3 flex-1">
                  <div className="relative">
                    <input
                      type="file"
                      id="photo-upload"
                      className="sr-only"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploading}
                    />
                    <label
                      htmlFor="photo-upload"
                      className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium 
                        ${isDark 
                          ? 'bg-circuit-dark-blue text-white border-circuit-light-blue hover:bg-circuit-dark-blue/80' 
                          : 'bg-osc-blue text-white border-transparent hover:bg-osc-blue/90'
                        } cursor-pointer transition-colors`}
                    >
                      {uploading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </div>
                      ) : (
                        <>
                          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload Photo
                        </>
                      )}
                    </label>
                  </div>
                  
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Upload a clear photo of the student. Recommended size: 400x400 pixels.
                  </p>
                  
                  {formData.photoUrl && (
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Photo ID: {formData.photoUrl}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                    isDark 
                      ? 'bg-circuit-dark border-circuit-light-blue/20 text-white focus:border-circuit-light-blue/50' 
                      : 'border-gray-300 focus:border-osc-blue'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                    isDark 
                      ? 'bg-circuit-dark border-circuit-light-blue/20 text-white focus:border-circuit-light-blue/50' 
                      : 'border-gray-300 focus:border-osc-blue'
                  }`}
                >
                  <option value="current">Current Student</option>
                  <option value="alumni">Alumni</option>
                  <option value="opportunity">Opportunity</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                    isDark 
                      ? 'bg-circuit-dark border-circuit-light-blue/20 text-white focus:border-circuit-light-blue/50' 
                      : 'border-gray-300 focus:border-osc-blue'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Degree
                </label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                    isDark 
                      ? 'bg-circuit-dark border-circuit-light-blue/20 text-white focus:border-circuit-light-blue/50' 
                      : 'border-gray-300 focus:border-osc-blue'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                    isDark 
                      ? 'bg-circuit-dark border-circuit-light-blue/20 text-white focus:border-circuit-light-blue/50' 
                      : 'border-gray-300 focus:border-osc-blue'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Start Year
                </label>
                <input
                  type="number"
                  name="startYear"
                  value={formData.startYear}
                  onChange={handleChange}
                  min="1900"
                  max="2100"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                    isDark 
                      ? 'bg-circuit-dark border-circuit-light-blue/20 text-white focus:border-circuit-light-blue/50' 
                      : 'border-gray-300 focus:border-osc-blue'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  End Year
                </label>
                <input
                  type="number"
                  name="endYear"
                  value={formData.endYear}
                  onChange={handleChange}
                  min="1900"
                  max="2100"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                    isDark 
                      ? 'bg-circuit-dark border-circuit-light-blue/20 text-white focus:border-circuit-light-blue/50' 
                      : 'border-gray-300 focus:border-osc-blue'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Research Area
                </label>
                <input
                  type="text"
                  name="researchArea"
                  value={formData.researchArea}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                    isDark 
                      ? 'bg-circuit-dark border-circuit-light-blue/20 text-white focus:border-circuit-light-blue/50' 
                      : 'border-gray-300 focus:border-osc-blue'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                    isDark 
                      ? 'bg-circuit-dark border-circuit-light-blue/20 text-white focus:border-circuit-light-blue/50' 
                      : 'border-gray-300 focus:border-osc-blue'
                  }`}
                />
              </div>
            </div>
          </div>
        </BlurCard>
        
        <BlurCard title="Additional Information">
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                  isDark 
                    ? 'bg-circuit-dark border-circuit-light-blue/20 text-white focus:border-circuit-light-blue/50' 
                    : 'border-gray-300 focus:border-osc-blue'
                }`}
              ></textarea>
              <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Brief description of the student's research interests and background.
              </p>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Achievements (one per line)
              </label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                  isDark 
                    ? 'bg-circuit-dark border-circuit-light-blue/20 text-white focus:border-circuit-light-blue/50' 
                    : 'border-gray-300 focus:border-osc-blue'
                }`}
                placeholder="List achievements, one per line"
              ></textarea>
              <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Enter each achievement on a new line. These will be displayed as bullet points.
              </p>
            </div>
          </div>
        </BlurCard>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
              isDark 
                ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 border rounded-md text-sm font-medium text-white transition-colors ${
              isDark 
                ? 'bg-circuit-copper border-transparent hover:bg-circuit-copper/90' 
                : 'bg-osc-blue border-transparent hover:bg-osc-blue/90'
            }`}
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Student' : 'Add Student'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}; 