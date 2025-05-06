"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Import ReactQuill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  height?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  label = 'Content',
  placeholder = 'Write something...',
  height = '200px'
}: RichTextEditorProps) {
  // Local state to handle the editor's value
  const [editorValue, setEditorValue] = useState(value);
  
  // Update local state when the prop value changes
  useEffect(() => {
    setEditorValue(value);
  }, [value]);
  
  // Handle editor changes and propagate them to the parent component
  const handleChange = (content: string) => {
    setEditorValue(content);
    onChange(content);
  };
  
  // Quill modules/formats configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image'],
      ['clean']
    ],
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  return (
    <div className="mb-4">
      {label && <label className="block mb-2 text-sm">{label}</label>}
      
      <div className="bg-bg-darker border border-osc-blue border-opacity-20 rounded-md overflow-hidden">
        <ReactQuill
          theme="snow"
          value={editorValue}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{ 
            height: height,
            backgroundColor: 'transparent'
          }}
        />
      </div>
    </div>
  );
}