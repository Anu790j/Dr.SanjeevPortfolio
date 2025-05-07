"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BackButton from '@/components/admin/BackButton';
import { toast, Toaster } from 'react-hot-toast';
import { AdminButton } from '@/components/ui/AdminButton';
import { FileUpload } from '@/components/ui/FileUpload';
import { useTheme } from '@/context/ThemeContext';

interface Project {
  _id: string;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  fundingAgency?: string;
  fundingAmount?: string;
  collaborators?: string[];
  status: 'ongoing' | 'completed' | 'upcoming';
  order: number;
  tags?: string[];
  url?: string;
  category: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const emptyProject: Omit<Project, '_id'> = {
    title: '',
    description: '',
    status: 'ongoing',
    order: 0,
    tags: [],
    category: 'research'
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentProject) return;

    try {
      const method = currentProject._id ? 'PUT' : 'POST';
      const url = currentProject._id 
        ? `/api/projects/${currentProject._id}`
        : '/api/projects';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentProject),
      });

      if (res.ok) {
        toast.success(currentProject._id ? 'Project updated successfully' : 'Project created successfully');
        fetchProjects();
        setIsEditing(false);
        setCurrentProject(null);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Error saving project');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Project deleted successfully');
        fetchProjects();
      } else {
        toast.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Error deleting project');
    }
  }

  function addNewProject() {
    setCurrentProject(emptyProject as Project);
    setIsEditing(true);
  }

  function editProject(project: Project) {
    setCurrentProject(project);
    setIsEditing(true);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <BackButton />
      <h1 className="text-2xl font-bold mb-6">Projects Management</h1>
      <div className="flex justify-between items-center mb-6">
        <AdminButton
          type="primary"
          onClick={addNewProject}
          className={`${isDark ? '' : 'bg-osc-blue text-white'}`}
        >
          Add New Project
        </AdminButton>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-pulse h-8 w-8 bg-osc-blue rounded-full"></div>
        </div>
      ) : isEditing ? (
        <ProjectForm
          project={currentProject as Project}
          setProject={setCurrentProject}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsEditing(false);
            setCurrentProject(null);
          }}
        />
      ) : (
        <div className="grid gap-4">
          {projects.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No projects found. Add your first project!</p>
          ) : (
            projects.map((project) => (
              <motion.div
                key={project._id}
                className={`p-4 rounded-lg border ${
                  isDark 
                    ? 'bg-bg-dark border-osc-blue/20' 
                    : 'bg-white border-gray-200'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-medium">{project.title}</h3>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        project.status === 'ongoing' ? 'bg-green-500 bg-opacity-20 text-green-400' :
                        project.status === 'completed' ? 'bg-blue-500 bg-opacity-20 text-blue-400' :
                        'bg-yellow-500 bg-opacity-20 text-yellow-400'
                      }`}>
                        {project.status 
                          ? project.status.charAt(0).toUpperCase() + project.status.slice(1) 
                          : 'Unknown'}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2">{project.description}</p>
                    
                    {project.tags && project.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {project.tags.map((tag, i) => (
                          <span 
                            key={i} 
                            className={`text-xs px-2 py-0.5 rounded ${
                              isDark
                                ? 'bg-osc-blue/10 text-osc-blue' 
                                : 'bg-osc-blue/10 text-osc-blue'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <AdminButton
                      type="warning"
                      onClick={() => editProject(project)}
                    >
                      Edit
                    </AdminButton>
                    <AdminButton
                      type="danger"
                      onClick={() => handleDelete(project._id)}
                    >
                      Delete
                    </AdminButton>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

interface ProjectFormProps {
  project: Project;
  setProject: (project: Project) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

function ProjectForm({ project, setProject, onSubmit, onCancel }: ProjectFormProps) {
  const [tagInput, setTagInput] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setProject({
      ...project,
      [name]: name === 'order' ? parseInt(value, 10) : value,
    });
  }

  function handleImageUploaded(fileId: string) {
    setProject({
      ...project,
      imageUrl: fileId
    });
  }

  function handleTagAdd() {
    if (!tagInput.trim()) return;
    
    // Create a new array if tags is undefined
    const currentTags = Array.isArray(project.tags) ? [...project.tags] : [];
    
    setProject({
      ...project,
      tags: [...currentTags, tagInput.trim()]
    });
    setTagInput('');
  }

  function handleTagRemove(index: number) {
    if (!Array.isArray(project.tags)) return;
    
    const newTags = [...project.tags];
    newTags.splice(index, 1);
    setProject({
      ...project,
      tags: newTags
    });
  }

  function handleTagKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  }

  return (
    <form onSubmit={onSubmit} className={`p-6 rounded-lg border ${
      isDark ? 'bg-bg-dark border-osc-blue/20' : 'bg-white border-gray-200'
    }`}>
      <div className="mb-4">
        <label className="block mb-1 text-sm">Project Title</label>
        <input
          type="text"
          name="title"
          value={project.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 rounded-md border ${
            isDark 
              ? 'bg-bg-darker border-osc-blue/20 text-white' 
              : 'bg-white border-gray-300 text-gray-800'
          }`}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm">Description</label>
        <textarea
          name="description"
          value={project.description}
          onChange={handleChange}
          rows={4}
          className={`w-full px-3 py-2 rounded-md border ${
            isDark 
              ? 'bg-bg-darker border-osc-blue/20 text-white' 
              : 'bg-white border-gray-300 text-gray-800'
          }`}
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 text-sm">Project Image</label>
        <FileUpload
          currentFileId={project.imageUrl}
          previewUrl={project.imageUrl ? `/api/files/${project.imageUrl}` : undefined}
          onFileUploaded={handleImageUploaded}
          label="Upload Image"
          accept="image/*"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 text-sm">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={project.startDate || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              isDark 
                ? 'bg-bg-darker border-osc-blue/20 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">End Date</label>
          <input
            type="date"
            name="endDate"
            value={project.endDate || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              isDark 
                ? 'bg-bg-darker border-osc-blue/20 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 text-sm">Funding Agency</label>
          <input
            type="text"
            name="fundingAgency"
            value={project.fundingAgency || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              isDark 
                ? 'bg-bg-darker border-osc-blue/20 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Funding Amount</label>
          <input
            type="text"
            name="fundingAmount"
            value={project.fundingAmount || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              isDark 
                ? 'bg-bg-darker border-osc-blue/20 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm">Project URL</label>
        <input
          type="text"
          name="url"
          value={project.url || ''}
          onChange={handleChange}
          className={`w-full px-3 py-2 rounded-md border ${
            isDark 
              ? 'bg-bg-darker border-osc-blue/20 text-white' 
              : 'bg-white border-gray-300 text-gray-800'
          }`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 text-sm">Status</label>
          <select
            name="status"
            value={project.status}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              isDark 
                ? 'bg-bg-darker border-osc-blue/20 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          >
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm">Category</label>
          <select
            name="category"
            value={project.category || 'research'}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              isDark 
                ? 'bg-bg-darker border-osc-blue/20 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
            required
          >
            <option value="research">Research</option>
            <option value="lab">Lab</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm">Display Order</label>
        <input
          type="number"
          name="order"
          value={project.order}
          onChange={handleChange}
          className={`w-full px-3 py-2 rounded-md border ${
            isDark 
              ? 'bg-bg-darker border-osc-blue/20 text-white' 
              : 'bg-white border-gray-300 text-gray-800'
          }`}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm">Tags</label>
        <div className="flex">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className={`flex-grow px-3 py-2 rounded-l-md border ${
              isDark 
                ? 'bg-bg-darker border-osc-blue/20 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
            placeholder="Add a tag and press Enter"
          />
          <AdminButton
            type="primary" 
            onClick={handleTagAdd}
            className="rounded-l-none"
          >
            Add
          </AdminButton>
        </div>
        
        {project.tags && project.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <div 
                key={i} 
                className={`flex items-center px-2 py-1 rounded ${
                  isDark
                    ? 'bg-osc-blue/10 text-osc-blue' 
                    : 'bg-osc-blue/10 text-osc-blue'
                }`}
              >
                <span className="text-sm">{tag}</span>
                <button
                  type="button"
                  onClick={() => handleTagRemove(i)}
                  className="ml-1 text-xs hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <AdminButton
          type="secondary"
          onClick={onCancel}
        >
          Cancel
        </AdminButton>
        <AdminButton
          type="primary"
          buttonType="submit"
        >
          Save Project
        </AdminButton>
      </div>
    </form>
  );
}