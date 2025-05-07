"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { useTheme } from '@/context/ThemeContext';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { Footer } from '@/components/layout/Footer';

interface ProfessorData {
  name: string;
  title: string;
  email: string;
  phone: string;
  office: string;
  department: string;
  university: string;
  socialLinks: Array<{
    name: string;
    url: string;
    icon: string;
  }>;
}

export default function ContactPage() {
  const [professorData, setProfessorData] = useState<ProfessorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  useEffect(() => {
    async function fetchProfessorData() {
      try {
        const res = await fetch('/api/professor');
        if (res.ok) {
          const data = await res.json();
          setProfessorData(data);
        }
      } catch (error) {
        console.error('Error fetching professor data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfessorData();
  }, []);
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      // In a real application, you would send this to your backend
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setError('Failed to submit the form. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit the form. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  }
  
  return (
    <>
      <Header />
      <div className={`min-h-screen pt-24 ${isDark ? 'bg-circuit-dark' : 'bg-bg-primary'} relative`}>
        <AnimatedBackground /> 
        
        <main className="container mx-auto max-w-6xl px-4 md:px-8 py-10 relative z-10">
          <motion.h1 
            className={`text-3xl md:text-4xl font-bold mb-6 ${isDark ? 'text-circuit-light-blue' : 'text-osc-blue'}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Contact
          </motion.h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Contact Information Column */}
            <motion.div 
              className={`${isDark ? 'bg-bg-dark' : 'bg-bg-secondary'} bg-opacity-80 backdrop-blur-lg p-6 rounded-lg border border-osc-blue border-opacity-20`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-comp-gold' : 'text-comp-gold'}`}>Contact Information</h2>
              
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-bg-darker rounded w-3/4"></div>
                  <div className="h-4 bg-bg-darker rounded w-1/2"></div>
                  <div className="h-4 bg-bg-darker rounded w-2/3"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {professorData?.office && (
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-osc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <div>
                        <p className="font-medium">Office</p>
                        <p className="text-text-muted">{professorData.office}</p>
                      </div>
                    </div>
                  )}
                  
                  {professorData?.email && (
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-osc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="font-medium">Email</p>
                        <a href={`mailto:${professorData.email}`} className="text-text-muted hover:text-osc-blue">{professorData.email}</a>
                      </div>
                    </div>
                  )}
                  
                  {professorData?.phone && (
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-osc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-text-muted">{professorData.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {professorData?.department && professorData?.university && (
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-osc-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-medium">Department</p>
                        <p className="text-text-muted">{professorData.department}, {professorData.university}</p>
                      </div>
                    </div>
                  )}
                  
                  {!professorData?.office && !professorData?.email && !professorData?.phone && !professorData?.department && (
                    <div className="text-text-muted">
                      <p>Contact information not available.</p>
                      <p className="mt-2">You can use the contact form to send me a message.</p>
                    </div>
                  )}
                  
                  {professorData?.socialLinks && professorData.socialLinks.length > 0 && (
                    <div className="mt-6">
                      <p className="font-medium mb-2">Connect With Me</p>
                      <div className="flex space-x-4">
                        {professorData.socialLinks.map((link, index) => (
                          <a 
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-osc-blue hover:text-text-primary transition-colors"
                            aria-label={link.name}
                          >
                            <span dangerouslySetInnerHTML={{ __html: link.icon }} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
            
            {/* Contact Form Column */}
            <motion.div 
              className={`${isDark ? 'bg-bg-dark' : 'bg-bg-secondary'} bg-opacity-80 backdrop-blur-lg p-6 rounded-lg border border-osc-blue border-opacity-20`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-comp-gold' : 'text-comp-gold'}`}>Send a Message</h2>
              
              {submitted ? (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-medium mt-4 mb-2">Thank You!</h3>
                  <p className="text-text-muted">Your message has been sent successfully.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-4 py-2 bg-osc-blue text-white rounded-md hover:bg-opacity-90 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded-md text-red-400 text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 ${isDark ? 'bg-bg-darker' : 'bg-bg-primary'} rounded-md border border-osc-blue border-opacity-20 focus:border-opacity-60 focus:outline-none`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 ${isDark ? 'bg-bg-darker' : 'bg-bg-primary'} rounded-md border border-osc-blue border-opacity-20 focus:border-opacity-60 focus:outline-none`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 ${isDark ? 'bg-bg-darker' : 'bg-bg-primary'} rounded-md border border-osc-blue border-opacity-20 focus:border-opacity-60 focus:outline-none`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={`w-full px-3 py-2 ${isDark ? 'bg-bg-darker' : 'bg-bg-primary'} rounded-md border border-osc-blue border-opacity-20 focus:border-opacity-60 focus:outline-none resize-none`}
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                      submitting 
                        ? 'bg-osc-blue bg-opacity-70 cursor-not-allowed' 
                        : 'bg-osc-blue hover:bg-opacity-90'
                    } transition-colors`}
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}