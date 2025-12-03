import React, { useEffect, useRef, useState } from 'react';
import GhostText from './GhostText';
import { getGhostSuggestion, applyGhostSuggestion, GhostSuggestion, TableInfo } from '../utils/ghostTextSuggestions';

interface SyntaxHighlightedEditorProps {
  value: string;
  onChange: (val: string) => void;
  onRun: () => void;
  tables?: TableInfo[];
  onCursorPositionChange?: (position: number) => void;
}

import { SQL_KEYWORDS, SQL_FUNCTIONS } from '../utils/sqlConstants';

/**
 * Generate syntax-highlighted HTML from SQL text
 */
function highlightSQL(sql: string): string {
  if (!sql) return '';
  
  let highlighted = sql;
  
  // Escape HTML to prevent injection
  highlighted = highlighted
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Highlight keywords (green)
  SQL_KEYWORDS.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
    highlighted = highlighted.replace(regex, '<span style="color: #4ade80;">$1</span>');
  });
  
  // Highlight functions (yellow)
  SQL_FUNCTIONS.forEach(func => {
    const regex = new RegExp(`\\b(${func})\\b`, 'gi');
    highlighted = highlighted.replace(regex, '<span style="color: #fbbf24;">$1</span>');
  });
  
  return highlighted;
}

const SyntaxHighlightedEditor: React.FC<SyntaxHighlightedEditorProps> = ({ 
  value, 
  onChange, 
  onRun, 
  tables = [],
  onCursorPositionChange 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [ghostSuggestion, setGhostSuggestion] = useState<GhostSuggestion | null>(null);
  const [highlightedHTML, setHighlightedHTML] = useState<string>('');

  // Update highlighted HTML when value changes
  useEffect(() => {
    setHighlightedHTML(highlightSQL(value));
  }, [value]);

  // Sync scroll between textarea and highlight overlay
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      // Only focus on mount if value is empty (new exercise) to avoid stealing focus on every render
      if (!value) {
        textareaRef.current.focus();
      }
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Execute query on Cmd+Enter or Ctrl+Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
      return;
    }

    // Accept ghost suggestion on TAB
    if (e.key === 'Tab' && ghostSuggestion) {
      e.preventDefault();
      const textarea = e.currentTarget as HTMLTextAreaElement;
      const cursorPos = textarea.selectionStart;
      const result = applyGhostSuggestion(value, cursorPos, ghostSuggestion);
      onChange(result.newQuery);
      setGhostSuggestion(null);
      
      // Restore cursor position after state update
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = result.newCursorPosition;
        }
      }, 0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Generate ghost text suggestion
    const cursorPos = e.target.selectionStart;
    const suggestion = getGhostSuggestion(newValue, cursorPos, tables);
    setGhostSuggestion(suggestion);
    
    // Notify parent of cursor position change
    onCursorPositionChange?.(cursorPos);
  };

  const handleClick = () => {
    // Update ghost suggestion on click (cursor position change)
    if (textareaRef.current) {
      const cursorPos = textareaRef.current.selectionStart;
      const suggestion = getGhostSuggestion(value, cursorPos, tables);
      setGhostSuggestion(suggestion);
      
      // Notify parent of cursor position change
      onCursorPositionChange?.(cursorPos);
    }
  };

  return (
    <div className="relative h-full w-full font-mono text-[15px] group">
      <div className="relative w-full h-full">
        {/* Syntax Highlight Layer (behind textarea) */}
        <div
          ref={highlightRef}
          className="absolute inset-0 w-full h-full p-4 font-mono text-sm overflow-auto pointer-events-none whitespace-pre-wrap break-words scrollbar-hide"
          style={{
            color: '#f1f5f9', // white for default text
            lineHeight: '1.5',
          }}
          dangerouslySetInnerHTML={{ __html: highlightedHTML || '<span style="color: #64748b;">Scrivi la tua query SQL qui...</span>' }}
        />
        
        {/* Actual Textarea (transparent text) */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          onScroll={handleScroll}
          placeholder="Scrivi la tua query SQL qui..."
          className="absolute inset-0 w-full h-full bg-transparent p-4 font-mono text-sm outline-none resize-none scrollbar-hide"
          style={{
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
            caretColor: '#f1f5f9',
            lineHeight: '1.5',
          }}
          spellCheck={false}
        />
        
        {/* Ghost Text Overlay */}
        {ghostSuggestion && (
          <GhostText 
            suggestion={ghostSuggestion.text} 
            textareaRef={textareaRef}
          />
        )}
      </div>
      <div className="absolute bottom-4 right-6 text-xs text-slate-600 bg-slate-800/80 px-2 py-1 rounded border border-slate-700 pointer-events-none select-none opacity-0 group-hover:opacity-100 transition-opacity z-20">
        Run: Ctrl + Enter
      </div>
    </div>
  );
};

export default SyntaxHighlightedEditor;
