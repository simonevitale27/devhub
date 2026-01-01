import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import GhostText from './GhostText';
import AutocompleteDropdown, { AutocompleteItem } from './AutocompleteDropdown';
import { getGhostSuggestion, applyGhostSuggestion, GhostSuggestion, TableInfo } from '../utils/ghostTextSuggestions';

interface SyntaxHighlightedEditorProps {
  value: string;
  onChange: (val: string) => void;
  onRun: () => void;
  tables?: TableInfo[];
  onCursorPositionChange?: (position: number) => void;
  onSelectionChange?: (start: number, end: number) => void;
}

import { SQL_KEYWORDS, SQL_FUNCTIONS } from '../utils/sqlConstants';
import { detectMisspelledWords, MisspelledWord } from '../utils/sqlSpellCheck';

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

const LineNumberItem = React.memo(({ num, isActive }: { num: number, isActive: boolean }) => (
  <div 
    className={`text-xs leading-[1.5] font-mono h-[21px] pr-1 transition-colors ${
      isActive
        ? 'text-blue-400 bg-blue-500/10 rounded-l'
        : 'text-slate-600'
    }`}
  >
    {num}
  </div>
));

const SyntaxHighlightedEditor: React.FC<SyntaxHighlightedEditorProps> = ({ 
  value, 
  onChange, 
  onRun, 
  tables = [],
  onCursorPositionChange,
  onSelectionChange
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const spellCheckRef = useRef<HTMLDivElement>(null);
  const [ghostSuggestion, setGhostSuggestion] = useState<GhostSuggestion | null>(null);
  const [highlightedHTML, setHighlightedHTML] = useState<string>('');
  const [cursorPos, setCursorPos] = useState<number>(0);
  
  // Current line highlight
  const [currentLineNumber, setCurrentLineNumber] = useState(0);
  
  // Matching brackets
  const [matchingBrackets, setMatchingBrackets] = useState<{ open: number; close: number } | null>(null);
  
  // Column info popup
  const [hoveredWord, setHoveredWord] = useState<{ word: string; x: number; y: number } | null>(null);
  const [columnInfo, setColumnInfo] = useState<{ name: string; type: string; table: string; isPrimaryKey?: boolean; isForeignKey?: boolean } | null>(null);
  
  // Autocomplete dropdown state
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteItems, setAutocompleteItems] = useState<AutocompleteItem[]>([]);
  const [autocompletePosition, setAutocompletePosition] = useState({ top: 0, left: 0 });
  const [selectedAutocompleteIndex, setSelectedAutocompleteIndex] = useState(0);

  // Detect misspelled words (excluding word at cursor position)
  const misspelledWords = useMemo(() => {
    return detectMisspelledWords(value, tables, cursorPos);
  }, [value, tables, cursorPos]);

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
    if (textareaRef.current && spellCheckRef.current) {
      spellCheckRef.current.scrollTop = textareaRef.current.scrollTop;
      spellCheckRef.current.scrollLeft = textareaRef.current.scrollLeft;
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

  // Update current line number and matching brackets when cursor moves
  const updateCursorInfo = useCallback((cursorPosition: number) => {
    // Calculate current line number (0-indexed)
    const textBefore = value.substring(0, cursorPosition);
    const lineNumber = textBefore.split('\n').length - 1;
    setCurrentLineNumber(lineNumber);
    
    // Find matching brackets
    const charAtCursor = value[cursorPosition];
    const charBeforeCursor = value[cursorPosition - 1];
    
    let bracketPos: number | null = null;
    let isOpenBracket = false;
    
    if (charAtCursor === '(' || charAtCursor === ')') {
      bracketPos = cursorPosition;
      isOpenBracket = charAtCursor === '(';
    } else if (charBeforeCursor === '(' || charBeforeCursor === ')') {
      bracketPos = cursorPosition - 1;
      isOpenBracket = charBeforeCursor === '(';
    }
    
    if (bracketPos !== null) {
      // Find matching bracket
      let depth = 0;
      let matchPos = -1;
      
      if (isOpenBracket) {
        // Search forward for closing bracket
        for (let i = bracketPos; i < value.length; i++) {
          if (value[i] === '(') depth++;
          if (value[i] === ')') depth--;
          if (depth === 0) {
            matchPos = i;
            break;
          }
        }
        if (matchPos !== -1) {
          setMatchingBrackets({ open: bracketPos, close: matchPos });
        } else {
          setMatchingBrackets(null);
        }
      } else {
        // Search backward for opening bracket
        for (let i = bracketPos; i >= 0; i--) {
          if (value[i] === ')') depth++;
          if (value[i] === '(') depth--;
          if (depth === 0) {
            matchPos = i;
            break;
          }
        }
        if (matchPos !== -1) {
          setMatchingBrackets({ open: matchPos, close: bracketPos });
        } else {
          setMatchingBrackets(null);
        }
      }
    } else {
      setMatchingBrackets(null);
    }
  }, [value]);

  // Look up column info from tables
  const getColumnInfo = useCallback((word: string) => {
    for (const table of tables) {
      const columnIndex = table.columns.findIndex(
        col => col.toLowerCase() === word.toLowerCase()
      );
      if (columnIndex !== -1) {
        const columnName = table.columns[columnIndex];
        // Infer type from column name patterns
        let type = 'VARCHAR';
        const lowerName = columnName.toLowerCase();
        if (lowerName.includes('id') || lowerName.includes('_id')) {
          type = 'INT';
        } else if (lowerName.includes('price') || lowerName.includes('amount') || lowerName.includes('total') || lowerName.includes('cost')) {
          type = 'DECIMAL(10,2)';
        } else if (lowerName.includes('date') || lowerName.includes('_at') || lowerName.includes('created') || lowerName.includes('updated')) {
          type = 'DATE';
        } else if (lowerName.includes('count') || lowerName.includes('quantity') || lowerName.includes('qty') || lowerName.includes('stock')) {
          type = 'INT';
        } else if (lowerName.includes('email')) {
          type = 'VARCHAR(255)';
        } else if (lowerName.includes('name')) {
          type = 'VARCHAR(100)';
        } else if (lowerName.includes('description') || lowerName.includes('notes')) {
          type = 'TEXT';
        } else if (lowerName.includes('active') || lowerName.includes('is_') || lowerName.includes('has_')) {
          type = 'BOOLEAN';
        } else if (lowerName.includes('rating') || lowerName.includes('score')) {
          type = 'DECIMAL(3,2)';
        }
        
        return {
          name: columnName,
          type,
          table: table.tableName,
          isPrimaryKey: lowerName === 'id' || lowerName.endsWith('_id'),
          isForeignKey: lowerName.endsWith('_id') && lowerName !== 'id',
        };
      }
    }
    return null;
  }, [tables]);

  // Get table from FROM clause in the query
  const getTableFromQuery = useCallback((query: string): TableInfo | null => {
    const match = query.match(/FROM\s+(\w+)/i);
    if (match) {
      const tableName = match[1];
      return tables.find(t => t.tableName.toLowerCase() === tableName.toLowerCase()) || null;
    }
    return null;
  }, [tables]);

  // Calculate dropdown position based on cursor
  const calculateDropdownPosition = useCallback(() => {
    if (!textareaRef.current) return { top: 0, left: 0 };
    
    const textarea = textareaRef.current;
    const cursorPosition = textarea.selectionStart;
    
    // Create a hidden div to measure text
    const div = document.createElement('div');
    div.style.cssText = window.getComputedStyle(textarea).cssText;
    div.style.height = 'auto';
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'pre-wrap';
    div.style.wordWrap = 'break-word';
    div.style.width = textarea.clientWidth + 'px';
    
    // Get text before cursor
    const textBefore = value.substring(0, cursorPosition);
    div.textContent = textBefore;
    
    document.body.appendChild(div);
    
    // Create a span for the cursor position
    const span = document.createElement('span');
    span.textContent = '|';
    div.appendChild(span);
    
    const rect = span.getBoundingClientRect();
    const textareaRect = textarea.getBoundingClientRect();
    
    document.body.removeChild(div);
    
    const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight) || 21;
    const lines = textBefore.split('\n');
    const currentLineNumber = lines.length - 1;
    
    return {
      top: (currentLineNumber + 1) * lineHeight + 16 - textarea.scrollTop,
      left: Math.min(100, (lines[currentLineNumber]?.length || 0) * 8 + 16),
    };
  }, [value]);

  // Update autocomplete based on cursor position and query
  const updateAutocomplete = useCallback((query: string, cursorPosition: number) => {
    const textBeforeCursor = query.slice(0, cursorPosition);
    
    // Get the current word being typed
    const words = textBeforeCursor.split(/[\s,]+/);
    const currentWord = words[words.length - 1]?.toLowerCase() || '';
    
    // Check if we're after FROM or JOIN - show table autocomplete
    const afterFromOrJoin = /(?:FROM|JOIN)\s+$/i.test(textBeforeCursor) ||
      /(?:FROM|JOIN)\s+\w*$/i.test(textBeforeCursor);
    
    if (afterFromOrJoin) {
      // Show tables dropdown
      const items: AutocompleteItem[] = tables
        .filter(t => currentWord === '' || t.tableName.toLowerCase().startsWith(currentWord))
        .map(t => ({
          label: t.tableName,
          type: 'table' as const,
        }));
      
      if (items.length > 0) {
        setAutocompleteItems(items);
        setAutocompletePosition(calculateDropdownPosition());
        setShowAutocomplete(true);
        setSelectedAutocompleteIndex(0);
        return;
      }
    }
    
    // Check if we're in a SELECT clause (between SELECT and FROM or after SELECT at end)
    const hasSelect = /SELECT\s+/i.test(query);
    const hasFrom = /FROM\s+/i.test(query);
    
    // Get position of FROM in query
    const fromMatch = query.match(/FROM\s+/i);
    const fromIndex = fromMatch ? query.indexOf(fromMatch[0]) : -1;
    
    // We should show autocomplete if:
    // 1. There's a SELECT clause
    // 2. Cursor is after SELECT and before FROM (if FROM exists)
    // 3. The table in FROM clause is valid
    const selectMatch = textBeforeCursor.match(/SELECT\s+/i);
    const isInSelectClause = hasSelect && selectMatch && 
      (fromIndex === -1 || cursorPosition < fromIndex);
    
    if (isInSelectClause && hasFrom) {
      const table = getTableFromQuery(query);
      if (table) {
        // Filter columns based on current word
        const items: AutocompleteItem[] = table.columns
          .filter(col => currentWord === '' || col.toLowerCase().startsWith(currentWord))
          .map(col => ({
            label: col,
            type: 'column' as const,
            tableName: table.tableName,
          }));
        
        if (items.length > 0) {
          setAutocompleteItems(items);
          setAutocompletePosition(calculateDropdownPosition());
          setShowAutocomplete(true);
          setSelectedAutocompleteIndex(0);
          return;
        }
      }
    }
    
    setShowAutocomplete(false);
    setAutocompleteItems([]);
  }, [tables, getTableFromQuery, calculateDropdownPosition]);

  // Handle autocomplete selection
  const handleAutocompleteSelect = useCallback((item: AutocompleteItem) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const cursorPosition = textarea.selectionStart;
    const textBefore = value.substring(0, cursorPosition);
    
    // Find the start of the current word
    const words = textBefore.split(/[\s,]+/);
    const currentWord = words[words.length - 1] || '';
    const wordStart = cursorPosition - currentWord.length;
    
    // Replace current word with selected item
    const newValue = value.substring(0, wordStart) + item.label + value.substring(cursorPosition);
    onChange(newValue);
    
    // Position cursor after inserted text
    const newCursorPos = wordStart + item.label.length;
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newCursorPos;
        textareaRef.current.focus();
      }
    }, 0);
    
    setShowAutocomplete(false);
    setAutocompleteItems([]);
  }, [value, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Execute query on Cmd+Enter or Ctrl+Enter (Priority over autocomplete)
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
      return;
    }

    // Autocomplete keyboard navigation
    if (showAutocomplete && autocompleteItems.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedAutocompleteIndex(prev => 
          prev < autocompleteItems.length - 1 ? prev + 1 : 0
        );
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedAutocompleteIndex(prev => 
          prev > 0 ? prev - 1 : autocompleteItems.length - 1
        );
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        handleAutocompleteSelect(autocompleteItems[selectedAutocompleteIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowAutocomplete(false);
        return;
      }
    }

    // Toggle comment (Cmd+/ or Ctrl+/)
    if ((e.metaKey || e.ctrlKey) && e.key === '/') {
      e.preventDefault();
      const textarea = e.currentTarget as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const lines = value.split('\n');
      let lineStart = 0;
      let startLineIdx = 0;
      let endLineIdx = 0;
      
      // Find which lines are selected
      for (let i = 0; i < lines.length; i++) {
        const lineEnd = lineStart + lines[i].length;
        if (lineStart <= start && start <= lineEnd + 1) startLineIdx = i;
        if (lineStart <= end && end <= lineEnd + 1) endLineIdx = i;
        lineStart = lineEnd + 1;
      }
      
      // Check if all selected lines are commented
      const selectedLines = lines.slice(startLineIdx, endLineIdx + 1);
      const allCommented = selectedLines.every(line => line.trimStart().startsWith('--'));
      
      // Toggle comments
      const newLines = [...lines];
      for (let i = startLineIdx; i <= endLineIdx; i++) {
        if (allCommented) {
          // Remove comment
          newLines[i] = newLines[i].replace(/^(\s*)--\s?/, '$1');
        } else {
          // Add comment
          newLines[i] = '-- ' + newLines[i];
        }
      }
      
      onChange(newLines.join('\n'));
      return;
    }

    // SQL Snippets expansion (abbreviation + Tab when not in autocomplete)
    if (e.key === 'Tab' && !showAutocomplete && !ghostSuggestion) {
      const textarea = e.currentTarget as HTMLTextAreaElement;
      const cursorPos = textarea.selectionStart;
      const textBefore = value.substring(0, cursorPos);
      const words = textBefore.split(/[\s\n]+/);
      const lastWord = words[words.length - 1]?.toLowerCase() || '';
      
      const snippets: Record<string, { text: string; cursorOffset: number }> = {
        'sel': { text: 'SELECT * FROM ', cursorOffset: 14 },
        'seld': { text: 'SELECT DISTINCT * FROM ', cursorOffset: 23 },
        'selc': { text: 'SELECT COUNT(*) FROM ', cursorOffset: 21 },
        'ins': { text: 'INSERT INTO  VALUES ()', cursorOffset: 12 },
        'upd': { text: 'UPDATE  SET  WHERE ', cursorOffset: 7 },
        'del': { text: 'DELETE FROM  WHERE ', cursorOffset: 12 },
        'join': { text: 'INNER JOIN  ON ', cursorOffset: 11 },
        'ljoin': { text: 'LEFT JOIN  ON ', cursorOffset: 10 },
        'rjoin': { text: 'RIGHT JOIN  ON ', cursorOffset: 11 },
        'grp': { text: 'GROUP BY ', cursorOffset: 9 },
        'ord': { text: 'ORDER BY ', cursorOffset: 9 },
        'ordd': { text: 'ORDER BY  DESC', cursorOffset: 9 },
        'hav': { text: 'HAVING ', cursorOffset: 7 },
        'cre': { text: 'CREATE TABLE  (\n  id INT PRIMARY KEY,\n  \n)', cursorOffset: 13 },
        'alt': { text: 'ALTER TABLE  ADD ', cursorOffset: 12 },
        'drp': { text: 'DROP TABLE ', cursorOffset: 11 },
        'whr': { text: 'WHERE ', cursorOffset: 6 },
        'and': { text: 'AND ', cursorOffset: 4 },
        'or': { text: 'OR ', cursorOffset: 3 },
        'lim': { text: 'LIMIT ', cursorOffset: 6 },
        'bet': { text: 'BETWEEN  AND ', cursorOffset: 8 },
        'lik': { text: "LIKE '%%'", cursorOffset: 7 },
        'inn': { text: 'IN ()', cursorOffset: 4 },
        'cas': { text: 'CASE WHEN  THEN  ELSE  END', cursorOffset: 10 },
        'coa': { text: 'COALESCE(, )', cursorOffset: 9 },
        'nul': { text: 'IS NULL', cursorOffset: 7 },
        'nnul': { text: 'IS NOT NULL', cursorOffset: 11 },
      };
      
      if (snippets[lastWord]) {
        e.preventDefault();
        const snippet = snippets[lastWord];
        const wordStart = cursorPos - lastWord.length;
        const newValue = value.substring(0, wordStart) + snippet.text + value.substring(cursorPos);
        onChange(newValue);
        
        setTimeout(() => {
          if (textareaRef.current) {
            const newPos = wordStart + snippet.cursorOffset;
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newPos;
          }
        }, 0);
        return;
      }
    }

    // Auto-indentation after Enter
    if (e.key === 'Enter' && !showAutocomplete) {
      const textarea = e.currentTarget as HTMLTextAreaElement;
      const cursorPos = textarea.selectionStart;
      const textBefore = value.substring(0, cursorPos);
      const currentLine = textBefore.split('\n').pop() || '';
      
      // Get current line's indentation
      const indentMatch = currentLine.match(/^(\s*)/);
      const currentIndent = indentMatch ? indentMatch[1] : '';
      
      // Check if we should add extra indent (after SELECT, FROM, WHERE, etc.)
      const shouldIndent = /\b(SELECT|FROM|WHERE|AND|OR|JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|INNER\s+JOIN|GROUP\s+BY|ORDER\s+BY|HAVING|SET|VALUES)\s*$/i.test(currentLine.trim());
      
      e.preventDefault();
      const extraIndent = shouldIndent ? '  ' : '';
      const newValue = value.substring(0, cursorPos) + '\n' + currentIndent + extraIndent + value.substring(cursorPos);
      onChange(newValue);
      
      setTimeout(() => {
        if (textareaRef.current) {
          const newPos = cursorPos + 1 + currentIndent.length + extraIndent.length;
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newPos;
        }
      }, 0);
      return;
    }



    // Auto-pair quotes (' and ")
    if (e.key === "'" || e.key === '"') {
      e.preventDefault();
      const textarea = e.currentTarget as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const textAfterCursor = value.charAt(end);
      
      // If the character after cursor is the same quote, just skip over it
      if (textAfterCursor === e.key) {
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = end + 1;
          }
        }, 0);
        return;
      }
      
      // If there's selected text, wrap it in quotes
      if (start !== end) {
        const selectedText = value.substring(start, end);
        const newValue = value.substring(0, start) + e.key + selectedText + e.key + value.substring(end);
        onChange(newValue);
        // Position cursor after the wrapped text
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = end + 2;
          }
        }, 0);
      } else {
        // Insert both quotes and position cursor in between
        const newValue = value.substring(0, start) + e.key + e.key + value.substring(end);
        onChange(newValue);
        // Position cursor between the quotes
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1;
          }
        }, 0);
      }
      return;
    }

    // Auto-pair parentheses ()
    if (e.key === '(') {
      e.preventDefault();
      const textarea = e.currentTarget as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // If there's selected text, wrap it in parentheses
      if (start !== end) {
        const selectedText = value.substring(start, end);
        const newValue = value.substring(0, start) + '(' + selectedText + ')' + value.substring(end);
        onChange(newValue);
        // Position cursor after the wrapped text
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = end + 2;
          }
        }, 0);
      } else {
        // Insert both parentheses and position cursor in between
        const newValue = value.substring(0, start) + '()' + value.substring(end);
        onChange(newValue);
        // Position cursor between the parentheses
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1;
          }
        }, 0);
      }
      return;
    }

    // Skip over closing parenthesis if already there
    if (e.key === ')') {
      const textarea = e.currentTarget as HTMLTextAreaElement;
      const end = textarea.selectionEnd;
      const textAfterCursor = value.charAt(end);
      
      if (textAfterCursor === ')') {
        e.preventDefault();
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = end + 1;
          }
        }, 0);
        return;
      }
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
    const cursorPosition = e.target.selectionStart;
    const suggestion = getGhostSuggestion(newValue, cursorPosition, tables);
    setGhostSuggestion(suggestion);
    
    // Update cursor position for spell check
    setCursorPos(cursorPosition);
    
    // Update current line and bracket matching
    updateCursorInfo(cursorPosition);
    
    // Update autocomplete dropdown
    updateAutocomplete(newValue, cursorPosition);
    
    // Notify parent of cursor position change
    onCursorPositionChange?.(cursorPosition);
  };

  const handleClick = () => {
    // Update ghost suggestion on click (cursor position change)
    if (textareaRef.current) {
      const selStart = textareaRef.current.selectionStart;
      const selEnd = textareaRef.current.selectionEnd;
      const suggestion = getGhostSuggestion(value, selStart, tables);
      setGhostSuggestion(suggestion);
      
      // Update cursor position for spell check
      setCursorPos(selStart);
      
      // Update current line and bracket matching
      updateCursorInfo(selStart);
      
      // Notify parent of cursor position change
      onCursorPositionChange?.(selStart);
      
      // Notify parent of selection change
      onSelectionChange?.(selStart, selEnd);
    }
  };

  // Handle mouse move for column info popup
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const rect = textarea.getBoundingClientRect();
    
    // Get character position from mouse coordinates (approximate)
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top + textarea.scrollTop;
    
    const charWidth = 8.4; // Approximate monospace char width
    const lineHeight = 21; // Based on line-height: 1.5 with 14px font
    const padding = 16; // p-4 = 16px
    
    const col = Math.floor((x - padding) / charWidth);
    const row = Math.floor((y - padding) / lineHeight);
    
    const lines = value.split('\n');
    if (row >= 0 && row < lines.length) {
      const line = lines[row];
      if (col >= 0 && col < line.length) {
        // Find word at position
        let wordStart = col;
        let wordEnd = col;
        
        while (wordStart > 0 && /\w/.test(line[wordStart - 1])) wordStart--;
        while (wordEnd < line.length && /\w/.test(line[wordEnd])) wordEnd++;
        
        const word = line.substring(wordStart, wordEnd);
        
        if (word && word.length > 1) {
          const info = getColumnInfo(word);
          if (info) {
            setHoveredWord({ word, x: e.clientX, y: e.clientY });
            setColumnInfo(info);
            return;
          }
        }
      }
    }
    
    // Clear popup if not hovering a column
    if (hoveredWord) {
      setHoveredWord(null);
      setColumnInfo(null);
    }
  }, [value, getColumnInfo, hoveredWord]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setHoveredWord(null);
    setColumnInfo(null);
  }, []);

  // Calculate line count for line numbers
  const lineCount = useMemo(() => {
    return (value || '').split('\n').length;
  }, [value]);

  // Ref for line numbers to sync scroll
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Updated scroll handler to sync line numbers
  const handleScrollWithLineNumbers = () => {
    handleScroll();
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className="relative h-full w-full font-mono text-[15px] group flex">
      {/* Line Numbers Gutter */}
      <div 
        ref={lineNumbersRef}
        className="flex-shrink-0 bg-[#0a0a0a]/50 border-r border-white/5 select-none overflow-hidden"
        style={{ width: '40px' }}
      >
        <div className="py-4 pr-2 text-right">
          {Array.from({ length: lineCount }, (_, i) => (
            <LineNumberItem 
              key={i + 1} 
              num={i + 1} 
              isActive={i === currentLineNumber} 
            />
          ))}
        </div>
      </div>
      
      {/* Editor Area */}
      <div className="relative flex-1 h-full overflow-hidden">
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
        
        {/* Spell Check Underline Layer */}
        <div
          ref={spellCheckRef}
          className="absolute inset-0 w-full h-full p-4 font-mono text-sm overflow-auto pointer-events-none whitespace-pre-wrap break-words scrollbar-hide"
          style={{
            lineHeight: '1.5',
            color: 'transparent', // Make text transparent, only show underlines
          }}
          dangerouslySetInnerHTML={{
            __html: (() => {
              if (!value || misspelledWords.length === 0) return '';
              
              let result = value;
              
              // Escape HTML
              result = result
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
              
              // Sort misspelled words by start index descending (to process from end to start)
              const sorted = [...misspelledWords].sort((a, b) => b.startIndex - a.startIndex);
              
              // Insert underline spans for each misspelled word
              sorted.forEach(misspelled => {
                const before = result.substring(0, misspelled.startIndex);
                const word = result.substring(misspelled.startIndex, misspelled.endIndex);
                const after = result.substring(misspelled.endIndex);
                
                result = before + 
                  `<span style="text-decoration: underline wavy red; text-decoration-skip-ink: none; text-underline-offset: 2px;">${word}</span>` +
                  after;
              });
              
              return result;
            })()
          }}
        />
        
        {/* Actual Textarea (transparent text) */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          onScroll={handleScrollWithLineNumbers}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
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
        
        {/* Autocomplete Dropdown */}
        <AutocompleteDropdown
          items={autocompleteItems}
          visible={showAutocomplete}
          position={autocompletePosition}
          onSelect={handleAutocompleteSelect}
          onClose={() => setShowAutocomplete(false)}
          selectedIndex={selectedAutocompleteIndex}
          onSelectedIndexChange={setSelectedAutocompleteIndex}
        />
        
        {/* Current Line Highlight Layer */}
        <div 
          className="absolute left-0 right-0 pointer-events-none transition-all duration-75"
          style={{
            top: currentLineNumber * 21 + 16 - (textareaRef.current?.scrollTop || 0),
            height: '21px',
            background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.03) 100%)',
            borderLeft: '2px solid rgba(59, 130, 246, 0.4)',
          }}
        />
        
        {/* Matching Brackets Highlight */}
        {matchingBrackets && (
          <>
            <div 
              className="absolute pointer-events-none bg-amber-500/20 border border-amber-500/50 rounded"
              style={{
                top: value.substring(0, matchingBrackets.open).split('\n').length * 21 - 5 - (textareaRef.current?.scrollTop || 0),
                left: (value.substring(0, matchingBrackets.open).split('\n').pop()?.length || 0) * 8.4 + 14,
                width: '10px',
                height: '18px',
              }}
            />
            <div 
              className="absolute pointer-events-none bg-amber-500/20 border border-amber-500/50 rounded"
              style={{
                top: value.substring(0, matchingBrackets.close).split('\n').length * 21 - 5 - (textareaRef.current?.scrollTop || 0),
                left: (value.substring(0, matchingBrackets.close).split('\n').pop()?.length || 0) * 8.4 + 14,
                width: '10px',
                height: '18px',
              }}
            />
          </>
        )}
        
        {/* Column Info Popup */}
        {columnInfo && hoveredWord && (
          <div 
            className="fixed z-[100] bg-[#1a1a1a] border border-white/20 rounded-lg shadow-xl shadow-black/50 p-3 min-w-[200px] pointer-events-none animate-in fade-in duration-150"
            style={{
              top: hoveredWord.y + 20,
              left: hoveredWord.x,
              maxWidth: '280px',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded">COLUMN</span>
              <span className="font-mono text-white font-bold">{columnInfo.name}</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Tabella</span>
                <span className="text-emerald-400 font-mono">{columnInfo.table}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Tipo</span>
                <span className="text-amber-400 font-mono">{columnInfo.type}</span>
              </div>
              {columnInfo.isPrimaryKey && (
                <div className="flex items-center gap-1.5 text-yellow-400">
                  <span className="text-[10px]">🔑</span>
                  <span>Primary Key</span>
                </div>
              )}
              {columnInfo.isForeignKey && (
                <div className="flex items-center gap-1.5 text-purple-400">
                  <span className="text-[10px]">🔗</span>
                  <span>Foreign Key</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="absolute bottom-4 right-6 text-xs text-slate-600 bg-slate-800/80 px-2 py-1 rounded border border-slate-700 pointer-events-none select-none opacity-0 group-hover:opacity-100 transition-opacity z-20">
        Run: Ctrl + Enter
      </div>
    </div>
  );
};

export default SyntaxHighlightedEditor;
