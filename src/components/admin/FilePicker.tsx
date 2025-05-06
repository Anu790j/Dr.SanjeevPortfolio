"use client";

import { useState, useEffect } from 'react';

interface File {
  _id: string;
  filename: string;
  contentType: string;
  metadata: {
    originalName: string;
  };
}

interface FilePickerProps {
  value: string;
  onChange: (fileUrl: string) => void;
  label?: string;
  accept?: string;
  showPreview?: boolean;
}

export default function FilePicker({ 
  value, 
  onChange, 
  label = 'Choose File', 
  accept = '*/*',
  showPreview = true
}: FilePickerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isDialogOpen) {
      fetchFiles();
    }
  }, [isDialogOpen]);

  async function fetchFiles() {
    try {
      setLoading(true);
      const res = await fetch('/api/files');
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectFile(file: File) {
    const fileUrl = `/api/files/${file._id}/${encodeURIComponent(file.metadata.originalName)}`;
    onChange(fileUrl);
    setIsDialogOpen(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    
    const file = fileList[0];
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (res.ok) {
        const data = await res.json();
        const fileUrl = `/api/files/${data.fileId}/${encodeURIComponent(data.filename)}`;
        onChange(fileUrl);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  const filteredFiles = searchQuery 
    ? files.filter(file => 
        file.metadata.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.contentType.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : files;

  function getFileIcon(contentType: string): string {
    if (contentType.startsWith('image/')) {
      return '🖼️';
    } else if (contentType.includes('pdf')) {
      return '📄';
    } else if (contentType.includes('text')) {
      return '📋';
    } else {
      return '📁';
    }
  }

  function isImage(url: string): boolean {
    return url.match(/\.(jpeg|jpg|gif|png)$/) !== null;
  }

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm">{label}</label>
      
      <div className="flex space-x-2">
        <input
          type="text"
          value={value}
          readOnly
          className="flex-grow px-3 py-2 bg-bg-darker border border-osc-blue border-opacity-20 rounded-md"
        />
        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="px-4 py-2 bg-osc-blue text-white rounded-md"
        >
          Browse
        </button>
      </div>
      
      {showPreview && value && (
        <div className="mt-2">
          {isImage(value) ? (
            <div className="mt-2 border border-osc-blue border-opacity-20 rounded-md overflow-hidden">
              <img 
                src={value} 
                alt="Preview" 
                className="max-h-32 object-contain"
              />
            </div>
          ) : (
            <div className="mt-2 text-text-muted">
              Selected file: {value.split('/').pop()}
            </div>
          )}
        </div>
      )}
      
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-bg-dark rounded-lg w-11/12 max-w-3xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-osc-blue border-opacity-20 flex justify-between items-center">
              <h3 className="text-lg font-medium">Select a File</h3>
              <button 
                onClick={() => setIsDialogOpen(false)}
                className="text-text-muted hover:text-text-primary"
              >
                ×
              </button>
            </div>
            
            <div className="p-4 flex flex-col gap-4 flex-grow overflow-auto">
              <div className="flex gap-4">
                <div className="flex-grow">
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 bg-bg-darker border border-osc-blue border-opacity-20 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="cursor-pointer px-4 py-2 bg-osc-blue text-white rounded-md">
                    Upload New
                    <input 
                      type="file" 
                      className="hidden" 
                      accept={accept}
                      onChange={handleUpload}
                    />
                  </label>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-pulse h-8 w-8 bg-osc-blue rounded-full"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredFiles.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-text-muted">
                      {searchQuery ? 'No files match your search' : 'No files uploaded yet'}
                    </div>
                  ) : (
                    filteredFiles.map((file) => (
                      <div 
                        key={file._id}
                        onClick={() => handleSelectFile(file)}
                        className="p-3 border border-osc-blue border-opacity-20 rounded-md cursor-pointer hover:bg-bg-darker transition-colors"
                      >
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2">{getFileIcon(file.contentType)}</span>
                          <span className="truncate">{file.metadata.originalName}</span>
                        </div>
                        
                        {file.contentType.startsWith('image/') && (
                          <div className="h-20 flex items-center justify-center bg-bg-darker rounded">
                            <img 
                              src={`/api/files/${file._id}/${encodeURIComponent(file.metadata.originalName)}`}
                              alt={file.metadata.originalName}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}