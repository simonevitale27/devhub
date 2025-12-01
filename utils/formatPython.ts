/**
 * Python Code Formatter
 * Auto-indents Python code based on colons and block structure
 */

export function formatPythonCode(code: string): string {
  const lines = code.split('\n');
  const formatted: string[] = [];
  let indentLevel = 0;
  const INDENT_SIZE = 4;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (line === '') {
      formatted.push('');
      continue;
    }
    
    // Decrease indent for lines starting with closing brackets or dedent keywords
    if (line.startsWith('}') || line.startsWith(']') || line.startsWith(')')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Check for dedent keywords (else, elif, except, finally)
    if (/^(else|elif|except|finally|case)\b/.test(line)) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Add the line with current indentation
    const indent = ' '.repeat(indentLevel * INDENT_SIZE);
    formatted.push(indent + line);
    
    // Increase indent after colons (function/class definitions, if/for/while blocks)
    if (line.endsWith(':') || line.endsWith('(') || line.endsWith('[') || line.endsWith('{')) {
      indentLevel++;
    }
    
    // Increase indent for continuation lines (lines ending with \)
    if (line.endsWith('\\')) {
      indentLevel++;
    } else if (i > 0 && lines[i - 1].trim().endsWith('\\')) {
      // Decrease indent after continuation line ends
      indentLevel = Math.max(0, indentLevel - 1);
    }
  }
  
  return formatted.join('\n');
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    
    // Fallback method
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch (fallbackErr) {
      console.error('Fallback copy failed:', fallbackErr);
      return false;
    }
  }
}
