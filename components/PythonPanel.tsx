import React, { useState } from 'react';
import { Code2, Copy, Check, Type, Code } from 'lucide-react';
import { formatPythonCode, copyToClipboard } from '../utils/formatPython';

interface PythonPanelProps {
  code: string;
}

/**
 * Python Panel Component
 * Displays translated Python code with syntax highlighting and formatting tools
 */
const PythonPanel: React.FC<PythonPanelProps> = ({ code }) => {
  const [displayCode, setDisplayCode] = useState(code);
  const [copied, setCopied] = useState(false);
  const [formatted, setFormatted] = useState(false);

  React.useEffect(() => {
    setDisplayCode(code);
  }, [code]);
  
  const handleCopy = async () => {
    const success = await copyToClipboard(displayCode);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleFormat = () => {
    const formatted = formatPythonCode(displayCode);
    setDisplayCode(formatted);
    setFormatted(true);
    setTimeout(() => setFormatted(false), 2000);
  };
  
  // Syntax highlighting for Python
  const highlightPython = (code: string) => {
    const keywords = /\b(import|from|as|def|class|if|else|elif|for|while|return|and|or|not|in|is|True|False|None)\b/g;
    const strings = /(["'])(?:(?=(\\?))\2.)*?\1/g;
    const comments = /#.*/g;
    const functions = /\b([a-zA-Z_]\w*)\s*(?=\()/g;
    
    let highlighted = code;
    
    // Escape HTML
    highlighted = highlighted.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Highlight comments (do first to avoid conflicts)
    highlighted = highlighted.replace(comments, '<span class="text-slate-500">$&</span>');
    
    // Highlight strings
    highlighted = highlighted.replace(strings, '<span class="text-emerald-400">$&</span>');
    
    // Highlight keywords
    highlighted = highlighted.replace(keywords, '<span class="text-blue-400 font-bold">$&</span>');
    
    // Highlight functions
    highlighted = highlighted.replace(functions, '<span class="text-purple-400">$1</span>');
    
    return highlighted;
  };
  
  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      {/* Code Display with Toolbar Overlay */}
      <div className="flex-1 bg-black/40 rounded-xl border border-white/10 shadow-inner overflow-hidden relative group">
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button
            onClick={handleFormat}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-2 ${
                formatted
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-[#121212]/70 backdrop-blur-xl hover:bg-white/10 text-slate-300 border border-white/10 hover:border-blue-500/30'
            } shadow-lg shadow-black/20 active:scale-95`}
            >
            <Type size={12} />
            {formatted ? 'Formatted!' : 'Format'}
            </button>

            <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-2 ${
                copied
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-[#121212]/70 backdrop-blur-xl hover:bg-white/10 text-slate-300 border border-white/10 hover:border-emerald-500/30'
            } shadow-lg shadow-black/20 active:scale-95`}
            >
            {copied ? (
                <>
                <Check size={12} />
                Copied!
                </>
            ) : (
                <>
                <Copy size={12} />
                Copy Code
                </>
            )}
            </button>
        </div>

        <div className="absolute inset-0 overflow-auto custom-scrollbar p-4">
            <pre className="font-mono text-sm text-slate-300 leading-relaxed">
            <code dangerouslySetInnerHTML={{ __html: highlightPython(displayCode) }} />
            </pre>
        </div>
      </div>
    </div>
  );
};

export default PythonPanel;
