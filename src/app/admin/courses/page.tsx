"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BackButton from '@/components/admin/BackButton';

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
    order: 0
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
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentCourse),
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
        <button
          onClick={addNewCourse}
          className="px-4 py-2 bg-osc-blue text-white rounded-md hover:bg-opacity-90"
        >
          Add New Course
        </button>
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
                  <div>
                    <h3 className="text-xl font-medium">{course.title}</h3>
                    <p className="text-sm text-text-muted">{course.code} • {course.credits} credits</p>
                    <p className="mt-2">{course.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editCourse(course)}
                      className="px-3 py-1 text-sm bg-opacity-20 bg-comp-gold text-comp-gold rounded hover:bg-opacity-30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="px-3 py-1 text-sm bg-opacity-20 bg-red-500 text-red-500 rounded hover:bg-opacity-30"
                    >
                      Delete
                    </button>
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
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setCourse({
      ...course,
      [name]: name === 'credits' || name === 'year' || name === 'order' 
        ? parseInt(value, 10) 
        : value,
    });
  }

  return (
    <form onSubmit={onSubmit} className="bg-bg-dark p-6 rounded-lg border border-osc-blue border-opacity-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 text-sm">Course Title</label>
          <input
            type="text"
            name="title"
            value={course.title}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-bg-darker border border-osc-blue border-opacity-20 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Course Code</label>
          <input
            type="text"
            name="code"
            value={course.code}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-bg-darker border border-osc-blue border-opacity-20 rounded-md"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm">Description</label>
        <textarea
          name="description"
          value={course.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 bg-bg-darker border border-osc-blue border-opacity-20 rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-1 text-sm">Semester</label>
          <select
            name="semester"
            value={course.semester}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-bg-darker border border-osc-blue border-opacity-20 rounded-md"
          >
            <option value="">Select Semester</option>
            <option value="Fall">Fall</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Winter">Winter</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm">Year</label>
          <input
            type="number"
            name="year"
            value={course.year}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-bg-darker border border-osc-blue border-opacity-20 rounded-md"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Credits</label>
          <input
            type="number"
            name="credits"
            value={course.credits}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-bg-darker border border-osc-blue border-opacity-20 rounded-md"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm">Syllabus URL</label>
        <input
          type="text"
          name="syllabus"
          value={course.syllabus || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-bg-darker border border-osc-blue border-opacity-20 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm">Display Order</label>
        <input
          type="number"
          name="order"
          value={course.order}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-bg-darker border border-osc-blue border-opacity-20 rounded-md"
        />
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-osc-blue text-osc-blue rounded-md hover:bg-osc-blue hover:bg-opacity-10"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-osc-blue text-white rounded-md hover:bg-opacity-90"
        >
          Save Course
        </button>
      </div>
    </form>
  );
}