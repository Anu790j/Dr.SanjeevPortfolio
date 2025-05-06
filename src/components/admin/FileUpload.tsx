"use client";

import { useState } from 'react';

interface FileUploadProps {
  onFileUpload: (file: string) => void;
  label?: string;
  accept?: string;
}

export default function FileUpload({ onFileUpload, label = 'Upload File', accept = '*/*' }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    setProgress(0);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Create upload request with progress tracking
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          onFileUpload(response.fileUrl);
        } else {
          console.error('Upload failed');
        }
        setUploading(false);
      });
      
      xhr.addEventListener('error', () => {
        console.error('Upload failed');
        setUploading(false);
      });
      
      xhr.open('POST', '/api/files/upload');
      xhr.send(formData);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploading(false);
    }
  }
  
  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm">{label}</label>
      
      {uploading ? (
        <div className="w-full bg-bg-dark rounded-lg overflow-hidden">
          <div 
            className="bg-osc-blue h-2 transition-all"
            style={{ width: `${progress}%` }}
          ></div>
          <p className="text-xs mt-1 text-center">{progress}% Uploaded</p>
        </div>
      ) : (
        <label className="flex items-center justify-center w-full p-4 bg-bg-dark bg-opacity-50 border border-dashed border-osc-blue border-opacity-50 rounded-lg cursor-pointer hover:bg-opacity-70 transition-all">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2 text-osc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm">Click to select a file</p>
            <p className="text-xs text-text-muted mt-1">or drag and drop</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            onChange={handleFileChange}
            accept={accept}
          />
        </label>
      )}
    </div>
  );
}