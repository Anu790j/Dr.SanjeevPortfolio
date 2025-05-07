"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BackButton from '@/components/admin/BackButton';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { AdminButton } from '@/components/ui/AdminButton';
import { useTheme } from '@/context/ThemeContext';
import { FileUpload } from '@/components/ui/FileUpload';

interface Course {
  _id: string;
  title: string;
  code: string;
  description: string;
  semester: string;
  year: number;
  credits: number;
  syllabus?: string;
  order: number;
  imageUrl?: string;
  level: string;
  highlights: string[];
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  
  const emptyCourse: Omit<Course, '_id'> = {
    title: '',
    code: '',
    description: '',
    semester: '',
    year: new Date().getFullYear(),
    credits: 3,
    order: 0,
    level: 'Undergraduate',
    imageUrl: '',
    syllabus: '',
    highlights: []
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      setLoading(true);
      const res = await fetch('/api/course');
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentCourse) return;

    try {
      const method = currentCourse._id ? 'PUT' : 'POST';
      const url = currentCourse._id 
        ? `/api/course/${currentCourse._id}`
        : '/api/course';
      
      // Create a complete course object with all fields including imageUrl
      const courseData = {
        ...currentCourse,
        imageUrl: currentCourse.imageUrl || '' // Ensure imageUrl is included
      };
      
      console.log('Submitting course data:', courseData);
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (res.ok) {
        fetchCourses();
        setIsEditing(false);
        setCurrentCourse(null);
      }
    } catch (error) {
      console.error('Error saving course:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const res = await fetch(`/api/course/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchCourses();
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  }

  function addNewCourse() {
    setCurrentCourse(emptyCourse as Course);
    setIsEditing(true);
  }

  function editCourse(course: Course) {
    setCurrentCourse(course);
    setIsEditing(true);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <h1 className="text-2xl font-bold mb-6">Courses Management</h1>
      <div className="flex justify-between items-center mb-6">
        <AdminButton
          type="primary"
          onClick={addNewCourse}
        >
          Add New Course
        </AdminButton>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-pulse h-8 w-8 bg-osc-blue rounded-full"></div>
        </div>
      ) : isEditing ? (
        <CourseForm
          course={currentCourse as Course}
          setCourse={setCurrentCourse}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsEditing(false);
            setCurrentCourse(null);
          }}
        />
      ) : (
        <div className="grid gap-4">
          {courses.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No courses found. Add your first course!</p>
          ) : (
            courses.map((course) => (
              <motion.div
                key={course._id}
                className="p-4 bg-bg-dark rounded-lg border border-osc-blue border-opacity-20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex justify-between">
                  <div className="flex items-start space-x-4">
                    {course.imageUrl ? (
                      <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image 
                          src={`/api/files/${course.imageUrl}`}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className={`w-16 h-16 rounded-md flex items-center justify-center bg-osc-blue/10 flex-shrink-0`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-osc-blue/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-xl font-medium">{course.title}</h3>
                      <p className="text-sm text-text-muted">{course.code} • {course.credits} credits</p>
                      <p className="mt-2">{course.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <AdminButton
                      type="warning"
                      onClick={() => editCourse(course)}
                    >
                      Edit
                    </AdminButton>
                    <AdminButton
                      type="danger"
                      onClick={() => handleDelete(course._id)}
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

interface CourseFormProps {
  course: Course;
  setCourse: (course: Course) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

function CourseForm({ course, setCourse, onSubmit, onCancel }: CourseFormProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Initialize imagePreview when component mounts
  useEffect(() => {
    if (course.imageUrl) {
      setImagePreview(`/api/files/${course.imageUrl}`);
    }
  }, [course._id, course.imageUrl]);
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setCourse({
      ...course,
      [name]: value,
    });
  }
  
  function handleImageUploaded(fileId: string) {
    console.log('Image uploaded with fileId:', fileId);
    setCourse({
      ...course,
      imageUrl: fileId
    });
    setImagePreview(`/api/files/${fileId}`);
    console.log('Updated course with imageUrl:', { ...course, imageUrl: fileId });
  }

  // Add debugging to track course state
  useEffect(() => {
    console.log('Current course state:', course);
  }, [course]);

  return (
    <form onSubmit={onSubmit} className={`p-6 rounded-lg border ${
      isDark ? 'bg-bg-dark border-osc-blue/20' : 'bg-white border-gray-200'
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={`block mb-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Course Title</label>
          <input
            type="text"
            name="title"
            value={course.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              isDark 
                ? 'bg-bg-darker border-osc-blue/20 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
            required
          />
        </div>
        <div>
          <label className={`block mb-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Course Code</label>
          <input
            type="text"
            name="code"
            value={course.code}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              isDark 
                ? 'bg-bg-darker border-osc-blue/20 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
            required
          />
        </div>
      </div>
      
      {/* Course Image Upload */}
      <div className="mb-6">
        <label className={`block mb-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Course Image</label>
        
        {/* Image preview section */}
        {course.imageUrl && (
          <div className="mb-3">
            <div className="relative w-32 h-32 rounded-md overflow-hidden border mb-2">
              {imagePreview && (
                <Image 
                  src={imagePreview}
                  alt="Course preview" 
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <p className={`mb-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Current image ID: {course.imageUrl}
            </p>
          </div>
        )}
        
        <FileUpload 
          currentFileId={course.imageUrl}
          onFileUploaded={handleImageUploaded}
          previewUrl={imagePreview || undefined}
          accept="image/*"
          label="Upload Course Image"
        />
      </div>

      <div className="mb-4">
        <label className={`block mb-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
        <textarea
          name="description"
          value={course.description}
          onChange={handleChange}
          rows={4}
          className={`w-full px-3 py-2 rounded-md border ${
            isDark 
              ? 'bg-bg-darker border-osc-blue/20 text-white' 
              : 'bg-white border-gray-300 text-gray-800'
          }`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className={`block mb-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Semester</label>
          <select
            name="semester"
            value={course.semester}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              isDark 
                ? 'bg-bg-darker border-osc-blue/20 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
            required
          >
            <option value="">Select Semester</option>
            <option value="Fall">Fall</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Winter">Winter</option>
          </select>
        </div>
        <div>
          <label className={`block mb-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Level</label>
          <select
            name="level"
            value={course.level}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              isDark 
                ? 'bg-bg-darker border-osc-blue/20 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
            required
          >
            <option value="">Select Level</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Graduate">Graduate</option>
          </select>
        </div>
        <div>
          <label className={`block mb-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Year</label>
          <input
            type="number"
            name="year"
            value={course.year}
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
        <label className={`block mb-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Credits</label>
        <input
          type="number"
          name="credits"
          value={course.credits}
          onChange={handleChange}
          className={`w-full px-3 py-2 rounded-md border ${
            isDark 
              ? 'bg-bg-darker border-osc-blue/20 text-white' 
              : 'bg-white border-gray-300 text-gray-800'
          }`}
        />
      </div>

      <div className="mb-4">
        <label className={`block mb-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Syllabus URL</label>
        <input
          type="text"
          name="syllabus"
          value={course.syllabus || ''}
          onChange={handleChange}
          className={`w-full px-3 py-2 rounded-md border ${
            isDark 
              ? 'bg-bg-darker border-osc-blue/20 text-white' 
              : 'bg-white border-gray-300 text-gray-800'
          }`}
        />
      </div>

      <div className="mb-4">
        <label className={`block mb-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Display Order</label>
        <input
          type="number"
          name="order"
          value={course.order}
          onChange={handleChange}
          className={`w-full px-3 py-2 rounded-md border ${
            isDark 
              ? 'bg-bg-darker border-osc-blue/20 text-white' 
              : 'bg-white border-gray-300 text-gray-800'
          }`}
        />
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
          Save Course
        </AdminButton>
      </div>
    </form>
  );
}