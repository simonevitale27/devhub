// Python language constants for syntax highlighting and autocomplete

export const PYTHON_KEYWORDS = [
  // Control flow
  'if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'pass',
  'try', 'except', 'finally', 'raise', 'assert',
  // Definitions
  'def', 'class', 'return', 'yield', 'lambda',
  // Imports
  'import', 'from', 'as',
  // Logic
  'and', 'or', 'not', 'is', 'in',
  // Values
  'True', 'False', 'None',
  // Context
  'with', 'async', 'await',
  // Other
  'global', 'nonlocal', 'del',
];

export const PYTHON_BUILTINS = [
  // I/O
  'print', 'input', 'open',
  // Type conversions
  'int', 'float', 'str', 'bool', 'list', 'dict', 'set', 'tuple', 'bytes',
  // Math
  'abs', 'round', 'pow', 'min', 'max', 'sum', 'divmod',
  // Sequences
  'len', 'range', 'enumerate', 'zip', 'sorted', 'reversed',
  'map', 'filter', 'reduce',
  // Checks
  'type', 'isinstance', 'issubclass', 'callable', 'hasattr', 'getattr', 'setattr',
  // Iterators
  'iter', 'next', 'any', 'all',
  // Other
  'id', 'hash', 'repr', 'format', 'chr', 'ord', 'hex', 'bin', 'oct',
  // Object creation
  'object', 'super', 'property', 'classmethod', 'staticmethod',
];

export const PYTHON_METHODS = {
  list: ['append', 'extend', 'insert', 'remove', 'pop', 'clear', 'index', 'count', 'sort', 'reverse', 'copy'],
  dict: ['keys', 'values', 'items', 'get', 'pop', 'update', 'clear', 'copy', 'setdefault'],
  set: ['add', 'remove', 'discard', 'pop', 'clear', 'union', 'intersection', 'difference', 'issubset', 'issuperset'],
  str: ['upper', 'lower', 'strip', 'split', 'join', 'replace', 'find', 'startswith', 'endswith', 'format'],
};

// Snippets for Python - abbreviation + Tab to expand
export const PYTHON_SNIPPETS: Record<string, { text: string; cursorOffset: number; description: string }> = {
  // Function/Class
  'def': { text: 'def ():\n    ', cursorOffset: 4, description: 'Funzione' },
  'class': { text: 'class :\n    def __init__(self):\n        ', cursorOffset: 6, description: 'Classe' },
  'main': { text: "if __name__ == '__main__':\n    ", cursorOffset: 31, description: 'Main block' },
  
  // Control flow
  'if': { text: 'if :\n    ', cursorOffset: 3, description: 'If statement' },
  'ife': { text: 'if :\n    \nelse:\n    ', cursorOffset: 3, description: 'If-else' },
  'ifel': { text: 'if :\n    \nelif :\n    \nelse:\n    ', cursorOffset: 3, description: 'If-elif-else' },
  'for': { text: 'for  in :\n    ', cursorOffset: 4, description: 'For loop' },
  'forr': { text: 'for i in range():\n    ', cursorOffset: 14, description: 'For range' },
  'fore': { text: 'for i, item in enumerate():\n    ', cursorOffset: 25, description: 'For enumerate' },
  'while': { text: 'while :\n    ', cursorOffset: 6, description: 'While loop' },
  
  // Error handling
  'try': { text: 'try:\n    \nexcept Exception as e:\n    ', cursorOffset: 9, description: 'Try-except' },
  'tryf': { text: 'try:\n    \nexcept Exception as e:\n    \nfinally:\n    ', cursorOffset: 9, description: 'Try-except-finally' },
  
  // Common patterns
  'with': { text: 'with  as :\n    ', cursorOffset: 5, description: 'Context manager' },
  'lc': { text: '[ for  in ]', cursorOffset: 1, description: 'List comprehension' },
  'dc': { text: '{: for  in }', cursorOffset: 1, description: 'Dict comprehension' },
  'sc': { text: '{ for  in }', cursorOffset: 1, description: 'Set comprehension' },
  'lambda': { text: 'lambda : ', cursorOffset: 7, description: 'Lambda function' },
  
  // Print/Debug
  'pr': { text: 'print()', cursorOffset: 6, description: 'Print' },
  'prf': { text: "print(f'')", cursorOffset: 8, description: 'Print f-string' },
  'inp': { text: "input('')", cursorOffset: 7, description: 'Input' },
  
  // Data structures
  'dict': { text: '{}', cursorOffset: 1, description: 'Empty dict' },
  'list': { text: '[]', cursorOffset: 1, description: 'Empty list' },
  'set': { text: 'set()', cursorOffset: 4, description: 'Empty set' },
};

// All autocomplete items
export const getAllPythonAutocompleteItems = () => {
  const items: Array<{ label: string; type: 'keyword' | 'function' | 'snippet'; description?: string }> = [];
  
  // Keywords
  PYTHON_KEYWORDS.forEach(kw => {
    items.push({ label: kw, type: 'keyword' });
  });
  
  // Builtins
  PYTHON_BUILTINS.forEach(fn => {
    items.push({ label: fn + '()', type: 'function' });
  });
  
  return items;
};
