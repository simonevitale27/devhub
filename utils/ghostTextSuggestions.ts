/**
 * Ghost Text Suggestion Engine for SQL Editor
 * Provides context-aware autocomplete suggestions for SQL keywords, tables, and columns
 */

export interface TableInfo {
  tableName: string;
  columns: string[];
}

import { SQL_KEYWORDS, SQL_FUNCTIONS } from './sqlConstants';

export interface TableInfo {
  tableName: string;
  columns: string[];
}

export interface GhostSuggestion {
  text: string; // The completion text to display
  type: 'keyword' | 'table' | 'column' | 'function';
  fullText: string; // The full suggested text
}

/**
 * Get ghost text suggestion based on current input
 */
export function getGhostSuggestion(
  query: string,
  cursorPosition: number,
  tables: TableInfo[]
): GhostSuggestion | null {
  
  // Get text before cursor
  const textBeforeCursor = query.slice(0, cursorPosition);
  const textAfterCursor = query.slice(cursorPosition);
  
  // Get the current word being typed (last word before cursor)
  const words = textBeforeCursor.split(/[\s(),]+/); // Split by space, parens, commas
  const currentWord = words[words.length - 1] || '';
  
  // Don't suggest if cursor is in middle of a word
  if (textAfterCursor.length > 0 && /^\w/.test(textAfterCursor)) {
    return null;
  }
  
  // Don't suggest if word is empty or too short
  if (currentWord.length === 0) {
    return null;
  }
  
  const currentWordUpper = currentWord.toUpperCase();
  
  // 1. Try to match SQL keywords
  const keywordMatch = SQL_KEYWORDS.find(kw => 
    kw.startsWith(currentWordUpper) && kw !== currentWordUpper
  );
  
  if (keywordMatch) {
    return {
      text: keywordMatch.slice(currentWord.length),
      type: 'keyword',
      fullText: keywordMatch
    };
  }

  // 2. Try to match SQL functions
  const functionMatch = SQL_FUNCTIONS.find(func => 
    func.startsWith(currentWordUpper) && func !== currentWordUpper
  );
  
  if (functionMatch) {
    return {
      text: functionMatch.slice(currentWord.length) + '()', // Add parens for functions
      type: 'function',
      fullText: functionMatch
    };
  }
  
  // 3. Try to match table names
  const tableMatch = tables.find(t => 
    t.tableName.toLowerCase().startsWith(currentWord.toLowerCase()) &&
    t.tableName.toLowerCase() !== currentWord.toLowerCase()
  );
  
  if (tableMatch) {
    return {
      text: tableMatch.tableName.slice(currentWord.length),
      type: 'table',
      fullText: tableMatch.tableName
    };
  }
  
  // 4. Try to match column names (look for context to determine which table)
  const contextTable = getTableContext(textBeforeCursor, tables);
  
  if (contextTable) {
    const columnMatch = contextTable.columns.find(col =>
      col.toLowerCase().startsWith(currentWord.toLowerCase()) &&
      col.toLowerCase() !== currentWord.toLowerCase()
    );
    
    if (columnMatch) {
      return {
        text: columnMatch.slice(currentWord.length),
        type: 'column',
        fullText: columnMatch
      };
    }
  }
  
  return null;
}

/**
 * Determine which table is being referenced based on query context
 */
function getTableContext(textBeforeCursor: string, tables: TableInfo[]): TableInfo | null {
  const upperText = textBeforeCursor.toUpperCase();
  
  // Look for "FROM tableName" pattern
  const fromMatch = upperText.match(/FROM\s+(\w+)\s*(?:WHERE|ORDER|GROUP|LIMIT|$)/i);
  if (fromMatch) {
    const tableName = textBeforeCursor.match(/FROM\s+(\w+)/i)?.[1];
    if (tableName) {
      return tables.find(t => t.tableName.toLowerCase() === tableName.toLowerCase()) || null;
    }
  }
  
  // Look for "JOIN tableName" pattern
  const joinMatch = upperText.match(/JOIN\s+(\w+)\s*(?:ON|WHERE|$)/i);
  if (joinMatch) {
    const tableName = textBeforeCursor.match(/JOIN\s+(\w+)/i)?.[1];
    if (tableName) {
      return tables.find(t => t.tableName.toLowerCase() === tableName.toLowerCase()) || null;
    }
  }
  
  // Default: use the first table mentioned in FROM clause
  const firstTableMatch = textBeforeCursor.match(/FROM\s+(\w+)/i);
  if (firstTableMatch) {
    return tables.find(t => t.tableName.toLowerCase() === firstTableMatch[1].toLowerCase()) || null;
  }
  
  return null;
}

/**
 * Apply the ghost suggestion to the query
 */
export function applyGhostSuggestion(
  query: string,
  cursorPosition: number,
  suggestion: GhostSuggestion
): { newQuery: string; newCursorPosition: number } {
  const textBefore = query.slice(0, cursorPosition);
  const textAfter = query.slice(cursorPosition);
  
  return {
    newQuery: textBefore + suggestion.text + textAfter,
    newCursorPosition: cursorPosition + suggestion.text.length
  };
}
