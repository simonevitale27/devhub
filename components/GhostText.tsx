import React from 'react';

interface GhostTextProps {
  suggestion: string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

/**
 * Ghost Text Overlay Component
 * Displays inline autocomplete suggestion in gray text
 */
const GhostText: React.FC<GhostTextProps> = ({ suggestion, textareaRef }) => {
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  
  React.useEffect(() => {
    if (!textareaRef.current || !suggestion) return;
    
    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = textarea.value.slice(0, cursorPos);
    
    // Calculate position based on cursor
    const lines = textBeforeCursor.split('\n');
    const currentLineIndex = lines.length - 1;
    const currentLineText = lines[currentLineIndex] || '';
    
    // Create a temporary element to measure text width
    const measureElement = document.createElement('span');
    measureElement.style.font = window.getComputedStyle(textarea).font;
    measureElement.style.visibility = 'hidden';
    measureElement.style.position = 'absolute';
    measureElement.style.whiteSpace = 'pre';
    measureElement.textContent = currentLineText;
    document.body.appendChild(measureElement);
    
    const textWidth = measureElement.offsetWidth;
    document.body.removeChild(measureElement);
    
    // Calculate vertical position (line height * line number)
    const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight) || 20;
    const paddingTop = parseInt(window.getComputedStyle(textarea).paddingTop) || 0;
    const paddingLeft = parseInt(window.getComputedStyle(textarea).paddingLeft) || 0;
    
    setPosition({
      top: paddingTop + (currentLineIndex * lineHeight),
      left: paddingLeft + textWidth
    });
  }, [suggestion, textareaRef]);
  
  if (!suggestion) return null;
  
  return (
    <div
      className="absolute pointer-events-none font-mono text-sm text-slate-600 whitespace-pre"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        lineHeight: '1.5'
      }}
    >
      {suggestion}
    </div>
  );
};

export default GhostText;
