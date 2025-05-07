import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { BlurCard } from '@/components/ui/BlurCard';
import { AdminButton } from '@/components/ui/AdminButton';
import { FileUpload } from '@/components/ui/FileUpload';
import Image from 'next/image';

interface AwardData {
  _id?: string;
  title: string;
  year: number;
  organization: string;
  description?: string;
  imageUrl?: string;
  link?: string;
}

interface AwardFormProps {
  initialData?: AwardData;
  onSubmit: (data: AwardData) => void;
  onCancel: () => void;
}

export const AwardForm: React.FC<AwardFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    organization: '',
    description: '',
    imageUrl: '',
    link: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        year: initialData.year || new Date().getFullYear(),
        organization: initialData.organization || '',
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || '',
        link: initialData.link || ''
      });
      
      // Set image preview if initialData has an imageUrl
      if (initialData.imageUrl) {
        setImagePreview(`/api/files/${initialData.imageUrl}`);
      }
    }
  }, [initialData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'year' ? parseInt(value, 10) : value
    });
  };
  
  const handleImageUploaded = (fileId: string) => {
    setFormData({
      ...formData,
      imageUrl: fileId
    });
    setImagePreview(`/api/files/${fileId}`);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const awardData: AwardData = {
        ...formData,
        year: formData.year
      };
      
      if (initialData?._id) {
        awardData._id = initialData._id;
      }
      
      await onSubmit(awardData);
    } catch (error) {
      console.error('Error saving award:', error);
      toast.error('Error saving award');
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
        <BlurCard title="Award Information">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
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
                  Year *
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  min="1900"
                  max="2100"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                    isDark 
                      ? 'bg-circuit-dark border-circuit-light-blue/20 text-white focus:border-circuit-light-blue/50' 
                      : 'border-gray-300 focus:border-osc-blue'
                  }`}
                />
              </div>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Organization *
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
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
                Award Image
              </label>
              
              {/* New image preview section */}
              {formData.imageUrl && (
                <div className="mb-3">
                  <div className="relative w-32 h-32 rounded-md overflow-hidden border">
                    {imagePreview && (
                      <Image 
                        src={imagePreview}
                        alt="Award preview" 
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Current image ID: {formData.imageUrl}
                  </p>
                </div>
              )}
              
              <FileUpload
                currentFileId={formData.imageUrl}
                onFileUploaded={handleImageUploaded}
                previewUrl={imagePreview || undefined}
                label="Upload Image"
                accept="image/*"
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Link
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                  isDark 
                    ? 'bg-circuit-dark border-circuit-light-blue/20 text-white focus:border-circuit-light-blue/50' 
                    : 'border-gray-300 focus:border-osc-blue'
                }`}
                placeholder="https://example.com"
              />
              <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Link to more information about the award
              </p>
            </div>
            
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
                placeholder="Provide details about this award or honor"
              />
              <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Describe the significance of this award and any relevant details
              </p>
            </div>
          </div>
        </BlurCard>
        
        <div className="flex justify-end space-x-3 mt-6">
          <AdminButton
            type="secondary"
            onClick={onCancel}
          >
            Cancel
          </AdminButton>
          <AdminButton
            type="primary"
            buttonType="submit"
            isLoading={isSubmitting}
          >
            {initialData ? 'Update Award' : 'Add Award'}
          </AdminButton>
        </div>
      </form>
    </motion.div>
  );
}; 