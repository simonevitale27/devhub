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
        className="w-full h-full bg-[#0f172a] text-emerald-400 p-6 outline-none resize-none leading-relaxed border-none placeholder-slate-700 focus:ring-0"
        spellCheck={false}
        placeholder="-- Scrivi la tua query SQL qui..."
      />
      <div className="absolute bottom-4 right-6 text-xs text-slate-600 bg-slate-800/80 px-2 py-1 rounded border border-slate-700 pointer-events-none select-none opacity-0 group-hover:opacity-100 transition-opacity">
        Run: Ctrl + Enter
      </div>
    </div>
  );
};

export default CodeEditor;