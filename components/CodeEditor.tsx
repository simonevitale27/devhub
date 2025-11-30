import React, { useEffect, useRef } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  onRun: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, onRun }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [value]); // Re-focus when value changes drastically (e.g. new exercise)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
    }
  };

  return (
    <div className="relative h-full w-full font-mono text-[15px] group">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Scrivi la tua query SQL qui..."
        className="w-full h-full bg-transparent p-4 font-mono text-sm text-slate-100 outline-none resize-none"
        spellCheck={false}
      />
      <div className="absolute bottom-4 right-6 text-xs text-slate-600 bg-slate-800/80 px-2 py-1 rounded border border-slate-700 pointer-events-none select-none opacity-0 group-hover:opacity-100 transition-opacity">
        Run: Ctrl + Enter
      </div>
    </div>
  );
};

export default CodeEditor;