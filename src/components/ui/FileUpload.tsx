"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/context/ThemeContext';

interface FileUploadProps {
  currentFileId?: string;
  onFileUploaded: (fileId: string) => void;
  previewUrl?: string;
  accept?: string;
  label?: string;
  previewHeight?: number;
  previewWidth?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  currentFileId,
  onFileUploaded,
  previewUrl: initialPreviewUrl,
  accept = 'image/*',
  label = 'Upload File',
  previewHeight = 96,
  previewWidth = 128
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialPreviewUrl);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        
        onFileUploaded(data.fileId);
        setPreviewUrl(`/api/files/${data.fileId}`);
        toast.success('File uploaded successfully. Remember to save your changes!');
      } else {
        toast.error('Failed to upload file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Preview area */}
      {previewUrl ? (
        <div className={`relative w-${previewWidth/4} h-${previewHeight/4} rounded-md overflow-hidden border ${
          isDark ? 'border-osc-blue/20' : 'border-gray-300'
        }`}>
          <Image 
            src={previewUrl} 
            alt="File preview" 
            width={previewWidth} 
            height={previewHeight} 
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div className={`flex items-center justify-center w-${previewWidth/4} h-${previewHeight/4} ${
          isDark ? 'bg-bg-darker border-osc-blue/20' : 'bg-gray-100 border-gray-300'
        } border rounded-md`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      
      {/* Upload controls */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="file"
            id="file-upload"
            className="sr-only"
            accept={accept}
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <label
            htmlFor="file-upload"
            className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium cursor-pointer ${
              uploading 
                ? 'bg-gray-600 text-white cursor-not-allowed' 
                : isDark
                  ? 'bg-osc-blue/10 border-osc-blue/30 text-osc-blue hover:bg-osc-blue/20'
                  : 'bg-osc-blue/10 border-osc-blue/30 text-osc-blue hover:bg-osc-blue/20'
            }`}
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {label}
              </>
            )}
          </label>
        </div>
        
        {currentFileId && (
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            File ID: {currentFileId}
          </p>
        )}
      </div>
    </div>
  );
}; 