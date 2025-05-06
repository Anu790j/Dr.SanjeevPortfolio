"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import BackButton from '@/components/admin/BackButton';

interface FileData {
  _id: string;
  filename: string;
  contentType: string;
  size: number;
  uploadDate: string;
  metadata: {
    originalName: string;
    [key: string]: any;
  };
}

export default function AdminFiles() {
  // const { data: session, status } = useSession();
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [previewFile, setPreviewFile] = useState<FileData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const isMounted = useRef(false);

  useEffect(() => {
    // Only fetch files if we haven't already done so in this session
    if (!isMounted.current) {
      fetchFiles();
      isMounted.current = true;
    }
    
    // Cleanup function
    return () => {
      // No cleanup needed, but keeping the useEffect format consistent
    };
  }, []);

  async function fetchFiles() {
    try {
      setLoading(true);
      const res = await fetch('/api/files');
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      } else {
        setMessage({ text: 'Failed to load files', type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      setMessage({ text: 'Error loading files', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    
    const file = fileList[0];
    setUploading(true);
    setUploadProgress(0);
    setMessage({ text: '', type: '' });
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Create upload request with progress tracking
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          fetchFiles();
          setMessage({ text: 'File uploaded successfully', type: 'success' });
        } else {
          console.error('Upload failed');
          setMessage({ text: 'Failed to upload file', type: 'error' });
        }
        setUploading(false);
      });
      
      xhr.addEventListener('error', () => {
        console.error('Upload failed');
        setMessage({ text: 'Error uploading file', type: 'error' });
        setUploading(false);
      });
      
      xhr.open('POST', '/api/files/upload');
      xhr.send(formData);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage({ text: 'Error uploading file', type: 'error' });
      setUploading(false);
    }
  }

  async function handleDeleteFile(id: string) {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      setMessage({ text: 'Deleting file...', type: 'info' });
      
      // Use a direct fetch with the DELETE method
      const res = await fetch(`/api/files/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Remove the file from the local state immediately
        setFiles(files.filter(file => file._id !== id));
        setMessage({ text: 'File deleted successfully', type: 'success' });
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to delete file:', errorData);
        setMessage({ text: `Failed to delete file: ${errorData.error || res.statusText}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      setMessage({ text: 'Error deleting file', type: 'error' });
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function getFileIcon(contentType: string | undefined): string {
    if (!contentType) return '📁';
    
    if (contentType.startsWith('image/')) {
      return '🖼️';
    } else if (contentType.includes('pdf')) {
      return '📄';
    } else if (contentType.includes('word') || contentType.includes('document')) {
      return '📝';
    } else if (contentType.includes('spreadsheet') || contentType.includes('excel')) {
      return '📊';
    } else if (contentType.includes('presentation') || contentType.includes('powerpoint')) {
      return '📊';
    } else if (contentType.includes('text')) {
      return '📋';
    } else if (contentType.includes('zip') || contentType.includes('compressed')) {
      return '🗜️';
    } else {
      return '📁';
    }
  }

  const filteredFiles = searchQuery 
    ? files.filter(file => 
        file.metadata?.originalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.contentType?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : files;

  function openPreview(file: FileData) {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  }

  function closePreview() {
    setIsPreviewOpen(false);
    setPreviewFile(null);
  }

  function canPreviewFile(contentType: string | undefined): boolean {
    if (!contentType) return false;
    return contentType.startsWith('image/') || 
           contentType.includes('pdf') ||
           contentType.includes('text/');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">File Management</h1>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-red-500 bg-opacity-20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="mb-6">
        <div className="bg-bg-dark p-6 rounded-lg border border-osc-blue border-opacity-20">
          <h2 className="text-lg font-medium mb-4">Upload New File</h2>
          
          {uploading ? (
            <div className="w-full bg-bg-darker rounded-lg overflow-hidden">
              <div 
                className="bg-osc-blue h-2 transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-xs mt-1 text-center">{uploadProgress}% Uploaded</p>
            </div>
          ) : (
            <label className="flex items-center justify-center w-full p-8 bg-bg-darker bg-opacity-50 border border-dashed border-osc-blue border-opacity-50 rounded-lg cursor-pointer hover:bg-opacity-70 transition-all">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-osc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg">Click to select a file</p>
                <p className="text-sm text-text-muted mt-1">or drag and drop</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileUpload}
              />
            </label>
          )}
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-bg-dark border border-osc-blue border-opacity-20 rounded-md"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-pulse h-8 w-8 bg-osc-blue rounded-full"></div>
        </div>
      ) : (
        <div className="bg-bg-dark rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-bg-darker">
                <th className="py-3 px-4 text-left">File</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Size</th>
                <th className="py-3 px-4 text-left">Uploaded</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-text-muted">
                    {searchQuery ? 'No files match your search' : 'No files uploaded yet'}
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <motion.tr 
                    key={file._id}
                    className="border-t border-osc-blue border-opacity-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{getFileIcon(file.contentType)}</span>
                        <span className="truncate max-w-xs">{file.metadata?.originalName || file.filename}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-muted">{file.contentType}</td>
                    <td className="py-3 px-4 text-text-muted">{formatFileSize(file.size)}</td>
                    <td className="py-3 px-4 text-text-muted">
                      {new Date(file.uploadDate).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => openPreview(file)}
                          className="text-osc-blue hover:underline"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file._id)}
                          className="text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isPreviewOpen && previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-dark rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-osc-blue border-opacity-20">
              <h3 className="text-lg font-medium">
                {previewFile.metadata?.originalName || previewFile.filename}
              </h3>
              <button 
                onClick={closePreview}
                className="text-text-muted hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 flex-grow overflow-auto">
              {previewFile.metadata?.contentType?.startsWith('image/') ? (
                <div className="flex justify-center">
                  <img 
                    src={`/api/files/${previewFile._id}/${previewFile.filename}`} 
                    alt={previewFile.metadata?.originalName || previewFile.filename}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </div>
              ) : previewFile.metadata?.contentType?.includes('pdf') ? (
                <object 
                  data={`/api/files/${previewFile._id}/${previewFile.filename}`}
                  type="application/pdf" 
                  className="w-full h-[70vh]"
                >
                  <div className="text-center py-10">
                    <p className="mb-2">Unable to display PDF directly.</p>
                    <a 
                      href={`/api/files/${previewFile._id}/${previewFile.filename}?download=true`}
                      className="px-4 py-2 bg-osc-blue text-white rounded-md hover:bg-opacity-90"
                      download
                    >
                      Download PDF
                    </a>
                  </div>
                </object>
              ) : previewFile.metadata?.contentType?.includes('text/') ? (
                <iframe 
                  src={`/api/files/${previewFile._id}/${previewFile.filename}`}
                  className="w-full h-[70vh] bg-white text-black p-4"
                  title={previewFile.metadata?.originalName || previewFile.filename}
                ></iframe>
              ) : (
                <div className="text-center py-10">
                  <div className="text-3xl mb-4">{getFileIcon(previewFile.metadata?.contentType)}</div>
                  <p className="mb-2">Preview not available for this file type.</p>
                  <p className="text-text-muted text-sm">File type: {previewFile.metadata?.contentType || 'Unknown'}</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-osc-blue border-opacity-20">
              <div className="flex justify-end">
                <a 
                  href={`/api/files/${previewFile._id}/${previewFile.filename}?download=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-osc-blue text-white rounded-md hover:bg-opacity-90"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}