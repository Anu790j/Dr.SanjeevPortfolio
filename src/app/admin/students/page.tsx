"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { StudentForm } from '@/components/admin/StudentForm';
import { toast, Toaster } from 'react-hot-toast';
import { confirmDialog } from '@/lib/confirmDialog';
import BackButton from '@/components/admin/BackButton';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { BlurCard } from '@/components/ui/BlurCard';

interface Student {
  _id: string;
  name: string;
  category: 'current' | 'alumni' | 'opportunity';
  email?: string;
  photoUrl?: string;
  degree?: string;
  researchArea?: string;
  startYear?: number;
  endYear?: number;
}

export default function StudentsAdminPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'current' | 'alumni' | 'opportunity'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [researchFilter, setResearchFilter] = useState<string>('all');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        toast.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Error loading students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddNew = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (await confirmDialog(`Are you sure you want to delete ${name}?`)) {
      try {
        const response = await fetch(`/api/students?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Student deleted successfully');
          setStudents(students.filter(student => student._id !== id));
        } else {
          toast.error('Failed to delete student');
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        toast.error('Error deleting student');
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      const url = data._id ? `/api/students` : '/api/students';
      const method = data._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(`Student ${data._id ? 'updated' : 'added'} successfully`);
        setShowForm(false);
        fetchStudents();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to save student');
      }
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error('Error saving student');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  // Extract unique research areas
  const researchAreas = React.useMemo(() => {
    const areas = new Set<string>();
    students
      .filter(student => student.researchArea)
      .forEach(student => {
        if (student.researchArea) areas.add(student.researchArea);
      });
    return Array.from(areas);
  }, [students]);

  // Filter students based on tab, search query, and research area
  const filteredStudents = React.useMemo(() => {
    let filtered = students;
    
    // Filter by tab (category)
    if (activeTab !== 'all') {
      filtered = filtered.filter(student => student.category === activeTab);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(query) ||
        (student.email && student.email.toLowerCase().includes(query)) ||
        (student.degree && student.degree.toLowerCase().includes(query)) ||
        (student.researchArea && student.researchArea.toLowerCase().includes(query))
      );
    }
    
    // Filter by research area
    if (researchFilter !== 'all') {
      filtered = filtered.filter(student => 
        student.researchArea === researchFilter
      );
    }
    
    return filtered;
  }, [students, activeTab, searchQuery, researchFilter]);

  const tabs = [
    { id: 'all', label: 'All Students' },
    { id: 'current', label: 'Current Students' },
    { id: 'alumni', label: 'Alumni' },
    { id: 'opportunity', label: 'Opportunities' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <BackButton />
      
      {showForm ? (
        <div className={`p-6 rounded-lg shadow ${isDark ? 'bg-bg-dark bg-opacity-50 backdrop-blur-sm' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">
            {editingStudent ? `Edit Student: ${editingStudent.name}` : 'Add New Student'}
          </h2>
          <StudentForm
            initialData={editingStudent || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Students & Opportunities</h1>
            <button
              onClick={handleAddNew}
              className={`px-4 py-2 text-sm rounded-lg ${
                isDark 
                  ? 'bg-circuit-light-blue bg-opacity-20 border border-circuit-light-blue text-white hover:bg-opacity-30' 
                  : 'bg-osc-blue bg-opacity-20 border border-osc-blue text-osc-blue hover:bg-opacity-30'
              }`}
            >
              Add New Student
            </button>
          </div>

          <div className="mb-6">
            <div className={`flex border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-sm font-medium transition-colors relative
                    ${activeTab === tab.id
                      ? isDark ? 'text-circuit-light-blue' : 'text-osc-blue'
                      : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      className={`absolute h-0.5 left-0 right-0 bottom-0 ${
                        isDark ? 'bg-circuit-light-blue' : 'bg-osc-blue'
                      }`}
                      layoutId="activeTab"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <BlurCard title="Filter Students" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, email, degree..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full px-4 py-2 rounded-md pl-10 ${
                      isDark
                        ? 'bg-circuit-dark border border-circuit-light-blue/20 text-white placeholder-gray-500 focus:border-circuit-light-blue/50'
                        : 'bg-white border border-gray-300 text-gray-700 placeholder-gray-400 focus:border-osc-blue'
                    } focus:outline-none transition-colors`}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Research Area
                </label>
                <select
                  value={researchFilter}
                  onChange={(e) => setResearchFilter(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md ${
                    isDark
                      ? 'bg-circuit-dark border border-circuit-light-blue/20 text-white focus:border-circuit-light-blue/50'
                      : 'bg-white border border-gray-300 text-gray-700 focus:border-osc-blue'
                  } focus:outline-none transition-colors`}
                >
                  <option value="all">All Research Areas</option>
                  {researchAreas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
            </div>
          </BlurCard>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                isDark ? 'border-circuit-light-blue' : 'border-osc-blue'
              }`}></div>
            </div>
          ) : (
            <>
              {filteredStudents.length > 0 ? (
                <>
                  <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Showing {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
                    {researchFilter !== 'all' && ` in ${researchFilter}`}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </p>
                  <div className="space-y-4">
                    {filteredStudents.map((student) => (
                      <motion.div 
                        key={student._id} 
                        className={`p-4 rounded-lg border backdrop-blur-sm ${
                          isDark 
                            ? 'bg-bg-dark bg-opacity-50 border-circuit-light-blue border-opacity-20' 
                            : 'bg-white border-osc-blue border-opacity-20'
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {student.photoUrl && (
                              <div className="mr-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                  <Image 
                                    src={`/api/files/${student.photoUrl}`} 
                                    alt={student.name} 
                                    width={48} 
                                    height={48} 
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              </div>
                            )}
                            <div>
                              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                {student.name}
                              </h3>
                              <div className="flex flex-wrap items-center mt-1 space-x-4">
                                {student.category && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    isDark
                                      ? student.category === 'current' 
                                        ? 'bg-circuit-light-blue/20 text-circuit-light-blue' 
                                        : student.category === 'alumni'
                                          ? 'bg-circuit-copper/20 text-circuit-copper'
                                          : 'bg-green-800/20 text-green-400'
                                      : student.category === 'current'
                                        ? 'bg-osc-blue/10 text-osc-blue'
                                        : student.category === 'alumni'
                                          ? 'bg-comp-gold/10 text-comp-gold'
                                          : 'bg-green-100 text-green-600'
                                  }`}>
                                    {student.category.charAt(0).toUpperCase() + student.category.slice(1)}
                                  </span>
                                )}
                                {student.degree && (
                                  <span className="text-sm text-gray-500">
                                    {student.degree}
                                  </span>
                                )}
                                {student.startYear && (
                                  <span className="text-sm text-gray-500">
                                    {student.startYear} - {student.endYear || 'Present'}
                                  </span>
                                )}
                              </div>
                              {student.researchArea && (
                                <p className="text-sm text-gray-500 mt-1">
                                  <span className={`${isDark ? 'text-circuit-copper' : 'text-comp-gold'}`}>Research:</span> {student.researchArea}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEdit(student)}
                              className={`px-3 py-1 text-xs rounded ${
                              isDark 
                                ? 'bg-circuit-dark-blue/30 text-white hover:bg-circuit-dark-blue/50' 
                                : 'bg-osc-blue/10 text-osc-blue hover:bg-osc-blue/20'
                              }`}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(student._id, student.name)}
                              className={`px-3 py-1 text-xs rounded ${
                              isDark 
                                ? 'bg-red-900/30 text-red-200 hover:bg-red-900/50' 
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                              }`}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p className="text-lg font-medium">No students found</p>
                  {searchQuery || researchFilter !== 'all' ? (
                    <p className="mt-2">Try changing your filter criteria</p>
                  ) : (
                    <p className="mt-2">Click "Add New Student" to create one</p>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
} 