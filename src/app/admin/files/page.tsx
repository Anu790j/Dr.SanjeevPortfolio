"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import BackButton from '@/components/admin/BackButton';
import { AdminButton } from '@/components/ui/AdminButton';
import { toast, Toaster } from 'react-hot-toast';
import { useTheme } from '@/context/ThemeContext';
import { confirmDialog } from '@/lib/confirmDialog';

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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('');
  const [previewFile, setPreviewFile] = useState<FileData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const isMounted = useRef(false);

  useEffect(() => {
    // Only fetch files if we haven't already done so in this session
    if (!isMounted.current) {
      fetchFiles();
      isMounted.current = true;
    }
  }, []);

  async function fetchFiles() {
    try {
      setLoading(true);
      const res = await fetch('/api/files');
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      } else {
        toast.error('Failed to load files');
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Error loading files');
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
          toast.success('File uploaded successfully');
        } else {
          console.error('Upload failed');
          toast.error('Failed to upload file');
        }
        setUploading(false);
      });
      
      xhr.addEventListener('error', () => {
        console.error('Upload failed');
        toast.error('Error uploading file');
        setUploading(false);
      });
      
      xhr.open('POST', '/api/files/upload');
      xhr.send(formData);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file');
      setUploading(false);
    }
  }

  async function handleDeleteFile(id: string) {
    if (!await confirmDialog('Are you sure you want to delete this file?')) return;
    
    try {
      toast.loading('Deleting file...');
      
      const res = await fetch(`/api/files/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Remove the file from the local state immediately
        setFiles(files.filter(file => file._id !== id));
        toast.dismiss();
        toast.success('File deleted successfully');
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to delete file:', errorData);
        toast.dismiss();
        toast.error(`Failed to delete file: ${errorData.error || res.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.dismiss();
      toast.error('Error deleting file');
    }
  }

  async function handleBulkDelete() {
    if (selectedFiles.length === 0) return;
    
    if (!await confirmDialog(`Are you sure you want to delete ${selectedFiles.length} selected files?`)) return;
    
    toast.loading(`Deleting ${selectedFiles.length} files...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Create an array of promises for each delete operation
    const deletePromises = selectedFiles.map(async (fileId) => {
      try {
        const res = await fetch(`/api/files/${fileId}`, {
          method: 'DELETE',
        });
        
        if (res.ok) {
          successCount++;
          return { success: true, id: fileId };
        } else {
          errorCount++;
          return { success: false, id: fileId };
        }
      } catch (error) {
        console.error(`Error deleting file ${fileId}:`, error);
        errorCount++;
        return { success: false, id: fileId };
      }
    });
    
    // Wait for all delete operations to complete
    const results = await Promise.all(deletePromises);
    
    // Remove the successfully deleted files from the local state
    const successfullyDeletedIds = results
      .filter(result => result.success)
      .map(result => result.id);
    
    if (successfullyDeletedIds.length > 0) {
      setFiles(files.filter(file => !successfullyDeletedIds.includes(file._id)));
    }
    
    setSelectedFiles([]);
    setSelectAll(false);
    toast.dismiss();
    
    if (errorCount === 0) {
      toast.success(`Successfully deleted ${successCount} files`);
    } else if (successCount === 0) {
      toast.error(`Failed to delete ${errorCount} files`);
    } else {
      toast.success(`Deleted ${successCount} files, failed to delete ${errorCount} files`);
    }
  }

  function handleSelectFile(id: string) {
    if (selectedFiles.includes(id)) {
      setSelectedFiles(selectedFiles.filter(fileId => fileId !== id));
    } else {
      setSelectedFiles([...selectedFiles, id]);
    }
  }

  function handleSelectAll() {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    if (newSelectAll) {
      setSelectedFiles(filteredFiles.map(file => file._id));
    } else {
      setSelectedFiles([]);
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

  // Get unique file types for filtering
  const fileTypes = Array.from(new Set(files.map(file => {
    if (!file.contentType) return 'unknown';
    const type = file.contentType.split('/')[0];
    return type === 'application' && file.contentType.includes('/') ? file.contentType.split('/')[1] : type;
  })));

  // Filter files based on search query and file type
  const filteredFiles = files.filter(file => {
    // Text search filter
    const matchesSearch = searchQuery 
      ? file.metadata?.originalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.contentType?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    // File type filter
    const matchesType = fileTypeFilter 
      ? file.contentType.startsWith(fileTypeFilter) || 
        (fileTypeFilter === 'application' && file.contentType.includes('application/'))
      : true;
      
    return matchesSearch && matchesType;
  });

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
      <Toaster position="top-right" />
      <BackButton />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">File Management</h1>
      </div>

      <div className="mb-6">
        <div className={`p-6 rounded-lg border ${
          isDark ? 'bg-bg-dark border-osc-blue/20' : 'bg-white border-gray-200'
        }`}>
          <h2 className="text-lg font-medium mb-4">Upload New File</h2>
          
          {uploading ? (
            <div className={`w-full ${isDark ? 'bg-bg-darker' : 'bg-gray-100'} rounded-lg overflow-hidden`}>
              <div 
                className="bg-osc-blue h-2 transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-xs mt-1 text-center">{uploadProgress}% Uploaded</p>
            </div>
          ) : (
            <label className={`flex items-center justify-center w-full p-8 rounded-lg cursor-pointer transition-all
              ${isDark 
                ? 'bg-bg-darker border border-dashed border-osc-blue/50 hover:bg-opacity-70' 
                : 'bg-gray-50 border border-dashed border-osc-blue/30 hover:bg-gray-100'
              }`}>
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-osc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg">Click to select a file</p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>or drag and drop</p>
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

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="md:flex-1">
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-2 rounded-md border ${
              isDark 
                ? 'bg-bg-dark border-osc-blue/20 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        </div>
        
        <div className="md:w-48">
          <select
            value={fileTypeFilter}
            onChange={(e) => setFileTypeFilter(e.target.value)}
            className={`w-full px-4 py-2 rounded-md border ${
              isDark 
                ? 'bg-bg-dark border-osc-blue/20 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          >
            <option value="">All File Types</option>
            {fileTypes.map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>

        {selectedFiles.length > 0 && (
          <div>
            <AdminButton
              type="danger"
              onClick={handleBulkDelete}
            >
              Delete Selected ({selectedFiles.length})
            </AdminButton>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
            isDark ? 'border-osc-blue' : 'border-osc-blue'
          }`}></div>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <p>No files found</p>
        </div>
      ) : (
        <div className={`overflow-x-auto border rounded-lg ${isDark ? 'border-osc-blue/20' : 'border-gray-200'}`}>
          <table className={`min-w-full divide-y ${isDark ? 'divide-osc-blue/20' : 'divide-gray-200'}`}>
            <thead className={isDark ? 'bg-bg-dark' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className="py-3 px-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-osc-blue focus:ring-osc-blue/30"
                    />
                  </div>
                </th>
                <th scope="col" className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                  File
                </th>
                <th scope="col" className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                  Size
                </th>
                <th scope="col" className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                  Uploaded
                </th>
                <th scope="col" className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-osc-blue/10' : 'divide-gray-200'}`}>
              {filteredFiles.map((file) => (
                <tr key={file._id} 
                  className={`
                    ${selectedFiles.includes(file._id) 
                      ? isDark ? 'bg-osc-blue/20' : 'bg-osc-blue/10' 
                      : isDark ? 'bg-bg-darker' : 'bg-white'
                    }
                    hover:bg-opacity-90 transition-colors
                  `}
                >
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file._id)}
                        onChange={() => handleSelectFile(file._id)}
                        className="h-4 w-4 rounded border-gray-300 text-osc-blue focus:ring-osc-blue/30"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="mr-2 text-lg">{getFileIcon(file.contentType)}</span>
                      <div className="ml-2">
                        <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {file.metadata?.originalName || file.filename}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          ID: {file._id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      isDark 
                        ? 'bg-osc-blue/10 text-osc-blue' 
                        : 'bg-osc-blue/10 text-osc-blue'
                    }`}>
                      {file.contentType}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm">
                    {formatFileSize(file.size)}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm">
                    {new Date(file.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <a 
                        href={`/api/files/${file._id}/${encodeURIComponent(file.metadata?.originalName || file.filename)}`}
                        download={file.metadata?.originalName || file.filename}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          isDark 
                            ? 'bg-osc-blue/10 text-osc-blue hover:bg-osc-blue/20' 
                            : 'bg-osc-blue/10 text-osc-blue hover:bg-osc-blue/20'
                        }`}
                      >
                        Download
                      </a>
                      
                      {canPreviewFile(file.contentType) && (
                        <button
                          type="button"
                          onClick={() => openPreview(file)}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            isDark 
                              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Preview
                        </button>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => handleDeleteFile(file._id)}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          isDark 
                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                            : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                        }`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* File Preview Modal */}
      {isPreviewOpen && previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-3xl max-h-[90vh] w-full rounded-lg ${isDark ? 'bg-bg-dark' : 'bg-white'} flex flex-col overflow-hidden`}>
            <div className={`p-4 flex justify-between items-center border-b ${isDark ? 'border-osc-blue/20' : 'border-gray-200'}`}>
              <h3 className="text-lg font-medium">{previewFile.metadata?.originalName || previewFile.filename}</h3>
              <button 
                onClick={closePreview}
                className={`text-2xl leading-none ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                &times;
              </button>
            </div>
            
            <div className="flex-grow overflow-auto p-4">
              {previewFile.contentType.startsWith('image/') ? (
                <div className="flex items-center justify-center h-full">
                  <img 
                    src={`/api/files/${previewFile._id}/${encodeURIComponent(previewFile.metadata?.originalName || previewFile.filename)}`} 
                    alt={previewFile.metadata?.originalName || previewFile.filename}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </div>
              ) : (
                <div className={`h-full flex items-center justify-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p>Preview not available. Please download the file to view it.</p>
                </div>
              )}
            </div>
            
            <div className={`p-4 border-t ${isDark ? 'border-osc-blue/20' : 'border-gray-200'} flex justify-end`}>
              <a 
                href={`/api/files/${previewFile._id}/${encodeURIComponent(previewFile.metadata?.originalName || previewFile.filename)}`}
                download={previewFile.metadata?.originalName || previewFile.filename}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  isDark 
                    ? 'bg-osc-blue/10 text-osc-blue hover:bg-osc-blue/20' 
                    : 'bg-osc-blue/10 text-osc-blue hover:bg-osc-blue/20'
                }`}
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}