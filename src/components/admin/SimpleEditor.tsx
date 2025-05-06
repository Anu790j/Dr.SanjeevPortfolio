"use client";

import { useState, useEffect } from 'react';

interface SimpleEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  minHeight?: string;
}

export default function SimpleEditor({
  value,
  onChange,
  label = 'Content',
  placeholder = 'Write something...',
  minHeight = '200px'
}: SimpleEditorProps) {
  // Local state to handle the content
  const [content, setContent] = useState(value);
  
  // Update local state when the prop value changes
  useEffect(() => {
    setContent(value);
  }, [value]);
  
  // Handle content changes and propagate them to parent
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onChange(newContent);
  };

  // Format buttons handlers
  const insertFormat = (format: string) => {
    const textArea = document.getElementById('simple-editor') as HTMLTextAreaElement;
    if (!textArea) return;
    
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    
    switch(format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'heading':
        formattedText = `\n## ${selectedText}`;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        break;
      case 'list':
        formattedText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
        break;
      default:
        formattedText = selectedText;
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
    onChange(newContent);
    
    // Refocus the textarea after applying format
    setTimeout(() => {
      textArea.focus();
      // Position cursor after the formatted text
      textArea.selectionStart = start + formattedText.length;
      textArea.selectionEnd = start + formattedText.length;
    }, 0);
  };

  return (
    <div className="mb-4">
      {label && <label className="block mb-2 text-sm">{label}</label>}
      
      <div className="bg-bg-darker border border-osc-blue border-opacity-20 rounded-md overflow-hidden">
        <div className="flex p-2 bg-bg-dark border-b border-osc-blue border-opacity-20">
          <button 
            type="button"
            onClick={() => insertFormat('bold')}
            className="px-2 py-1 text-sm hover:bg-osc-blue hover:bg-opacity-20 rounded"
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button 
            type="button"
            onClick={() => insertFormat('italic')}
            className="px-2 py-1 text-sm hover:bg-osc-blue hover:bg-opacity-20 rounded"
            title="Italic"
          >
            <em>I</em>
          </button>
          <button 
            type="button"
            onClick={() => insertFormat('heading')}
            className="px-2 py-1 text-sm hover:bg-osc-blue hover:bg-opacity-20 rounded"
            title="Heading"
          >
            H
          </button>
          <button 
            type="button"
            onClick={() => insertFormat('link')}
            className="px-2 py-1 text-sm hover:bg-osc-blue hover:bg-opacity-20 rounded"
            title="Link"
          >
            🔗
          </button>
          <button 
            type="button"
            onClick={() => insertFormat('list')}
            className="px-2 py-1 text-sm hover:bg-osc-blue hover:bg-opacity-20 rounded"
            title="List"
          >
            • List
          </button>
        </div>
        
        <textarea
          id="simple-editor"
          value={content}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full p-3 bg-bg-darker text-text-primary outline-none resize-y"
          style={{ minHeight }}
        />
        
        <div className="p-2 text-xs text-text-muted border-t border-osc-blue border-opacity-20">
          Markdown supported: **bold**, *italic*, ## heading, [link](url), - list item
        </div>
      </div>
    </div>
  );
}