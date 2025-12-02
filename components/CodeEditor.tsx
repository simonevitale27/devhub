import React, { useEffect, useRef, useState } from 'react';
import GhostText from './GhostText';
import { getGhostSuggestion, applyGhostSuggestion, GhostSuggestion, TableInfo } from '../utils/ghostTextSuggestions';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  onRun: () => void;
  tables?: TableInfo[];
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, onRun, tables = [] }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [ghostSuggestion, setGhostSuggestion] = useState<GhostSuggestion | null>(null);

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
  };

  const handleClick = () => {
    // Update ghost suggestion on click (cursor position change)
    if (textareaRef.current) {
      const cursorPos = textareaRef.current.selectionStart;
      const suggestion = getGhostSuggestion(value, cursorPos, tables);
      setGhostSuggestion(suggestion);
    }
  };

  return (
    <div className="relative h-full w-full font-mono text-[15px] group">
      <div className="relative w-full h-full">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          placeholder="Scrivi la tua query SQL qui..."
          className="w-full h-full bg-transparent p-4 font-mono text-sm text-slate-100 outline-none resize-none relative z-10"
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

export default CodeEditor;