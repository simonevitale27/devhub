import React from 'react';

interface PythonPanelProps {
  code: string;
}

/**
 * Python Panel Component
 * Displays translated Python code with syntax highlighting
 */
const PythonPanel: React.FC<PythonPanelProps> = ({ code }) => {
  // Syntax highlighting for Python using placeholders to avoid conflicts
  const highlightPython = (code: string) => {
    const lines = code.split('\n');
    
    const highlightedLines = lines.map(line => {
      // Escape HTML first
      let processed = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
      const tokens: Array<{placeholder: string, html: string}> = [];
      let tokenCounter = 0;
      
      // Helper to create placeholder
      const createToken = (html: string) => {
        const placeholder = `__TOKEN_${tokenCounter++}__`;
        tokens.push({ placeholder, html });
        return placeholder;
      };
      
      // Highlight comments (entire line after #)
      if (processed.includes('#')) {
        const hashIndex = processed.indexOf('#');
        const beforeComment = processed.substring(0, hashIndex);
        const comment = processed.substring(hashIndex);
        const commentToken = createToken(`<span class="text-slate-500">${comment}</span>`);
        processed = beforeComment + commentToken;
      }
      
      // Highlight Python keywords (only if not already in a comment)
      if (!processed.includes('__TOKEN_')) {
        const keywords = ['import', 'from', 'as', 'def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'and', 'or', 'not', 'in', 'is', 'True', 'False', 'None', 'with', 'try', 'except', 'finally', 'raise', 'assert', 'break', 'continue', 'pass', 'yield', 'lambda'];
        keywords.forEach(keyword => {
          const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
          processed = processed.replace(regex, (match) => {
            return createToken(`<span class="text-blue-400 font-semibold">${match}</span>`);
          });
        });
      }
      
      // Highlight strings (after keywords to avoid conflicts)
      processed = processed.replace(/(&quot;[^&quot;]*&quot;|&#39;[^&#39;]*&#39;)/g, (match) => {
        if (match.includes('__TOKEN_')) return match; // Skip if it's a token
        return createToken(`<span class="text-emerald-400">${match}</span>`);
      });
      
      // Highlight function calls
      processed = processed.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, (match, funcName) => {
        if (match.includes('__TOKEN_')) return match; // Skip if it's a token
        return createToken(`<span class="text-purple-400">${funcName}</span>`) + match.substring(funcName.length);
      });
      
      // Replace all tokens with actual HTML
      tokens.forEach(({ placeholder, html }) => {
        processed = processed.replace(placeholder, html);
      });
      
      return processed;
    });
    
    return highlightedLines.join('\n');
  };
  
  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      {/* Code Display */}
      <div className="flex-1 bg-black/40 rounded-xl border border-white/10 shadow-inner overflow-hidden relative">
        <div className="absolute inset-0 overflow-auto custom-scrollbar p-4">
          <pre className="font-mono text-sm text-slate-300 leading-relaxed">
            <code dangerouslySetInnerHTML={{ __html: highlightPython(code) }} />
          </pre>
        </div>
      </div>
    </div>
  );
};

export default PythonPanel;
