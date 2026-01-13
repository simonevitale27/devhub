// Python execution service using Pyodide (Python WebAssembly)

import { PythonResult } from '../pythonTypes';

// Pyodide types
declare global {
  interface Window {
    loadPyodide: (config?: { indexURL?: string }) => Promise<PyodideInterface>;
  }
}

interface PyodideInterface {
  runPython: (code: string) => any;
  runPythonAsync: (code: string) => Promise<any>;
  loadPackage: (packages: string | string[]) => Promise<void>;
  setStdout: (options: { batched: (output: string) => void }) => void;
  setStderr: (options: { batched: (output: string) => void }) => void;
  globals: any;
}

// Singleton Pyodide instance
let pyodideInstance: PyodideInterface | null = null;
let pyodideLoading: Promise<PyodideInterface> | null = null;

// Pyodide CDN URL
const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/';

/**
 * Load Pyodide script dynamically
 */
const loadPyodideScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.loadPyodide) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `${PYODIDE_CDN}pyodide.js`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Pyodide script'));
    document.head.appendChild(script);
  });
};

/**
 * Initialize Pyodide instance (singleton pattern)
 */
export const initPyodide = async (): Promise<PyodideInterface> => {
  // Return existing instance if already loaded
  if (pyodideInstance) {
    return pyodideInstance;
  }

  // Return existing loading promise to avoid parallel loads
  if (pyodideLoading) {
    return pyodideLoading;
  }

  // Start loading
  pyodideLoading = (async () => {
    try {
      // Load script if not already present
      await loadPyodideScript();

      // Initialize Pyodide
      const pyodide = await window.loadPyodide({
        indexURL: PYODIDE_CDN
      });

      pyodideInstance = pyodide;
      console.log('Pyodide initialized successfully');
      return pyodide;
    } catch (error) {
      pyodideLoading = null;
      throw error;
    }
  })();

  return pyodideLoading;
};

/**
 * Check if Pyodide is loaded
 */
export const isPyodideReady = (): boolean => {
  return pyodideInstance !== null;
};

/**
 * Run Python code and capture output
 */
export const runPython = async (code: string, timeout: number = 5000): Promise<PythonResult> => {
  const startTime = performance.now();
  
  try {
    const pyodide = await initPyodide();
    
    // Capture stdout and stderr
    let stdout = '';
    let stderr = '';
    
    pyodide.setStdout({
      batched: (output: string) => {
        stdout += output;
      }
    });
    
    pyodide.setStderr({
      batched: (output: string) => {
        stderr += output;
      }
    });

    // Wrap execution with timeout
    const executeWithTimeout = async (): Promise<any> => {
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error(`Timeout: l'esecuzione ha superato ${timeout}ms. Possibile loop infinito?`));
        }, timeout);

        try {
          // Run synchronously for simple scripts
          const result = pyodide.runPython(code);
          clearTimeout(timeoutId);
          resolve(result);
        } catch (error) {
          clearTimeout(timeoutId);
          reject(error);
        }
      });
    };

    await executeWithTimeout();
    
    const executionTime = performance.now() - startTime;

    // Check for errors in stderr
    if (stderr && !stdout) {
      return {
        success: false,
        output: '',
        error: stderr.trim(),
        executionTime
      };
    }

    return {
      success: true,
      output: stdout.trim(),
      error: stderr.trim() || undefined,
      executionTime
    };

  } catch (error: any) {
    const executionTime = performance.now() - startTime;
    
    // Parse Python errors for better display
    let errorMessage = error.message || String(error);
    
    // Extract meaningful error from Pyodide error format
    if (errorMessage.includes('PythonError:')) {
      const match = errorMessage.match(/PythonError:\s*(.+)/s);
      if (match) {
        errorMessage = match[1];
      }
    }

    return {
      success: false,
      output: '',
      error: errorMessage,
      executionTime
    };
  }
};

/**
 * Validate Python output against expected output
 */
export const validateOutput = (
  userOutput: string,
  expectedOutput: string,
  strictMode: boolean = false
): boolean => {
  // Normalize outputs
  const normalizeOutput = (output: string): string => {
    let normalized = output.trim();
    
    if (!strictMode) {
      // Normalize whitespace
      normalized = normalized.replace(/\s+/g, ' ');
      // Normalize line endings
      normalized = normalized.replace(/\r\n/g, '\n');
    }
    
    return normalized;
  };

  return normalizeOutput(userOutput) === normalizeOutput(expectedOutput);
};

/**
 * Run code with mock input (for exercises that use input())
 */
export const runPythonWithInput = async (
  code: string,
  inputs: string[],
  timeout: number = 5000
): Promise<PythonResult> => {
  // Wrap code to mock input() function
  const inputQueue = JSON.stringify(inputs);
  const wrappedCode = `
_input_queue = ${inputQueue}
_input_index = 0

def _mock_input(prompt=""):
    global _input_index
    if _input_index < len(_input_queue):
        result = _input_queue[_input_index]
        _input_index += 1
        return result
    raise EOFError("No more input available")

# Replace built-in input with mock
import builtins
builtins.input = _mock_input

# User code
${code}
`;

  return runPython(wrappedCode, timeout);
};

/**
 * Format Python error for display
 */
export const formatPythonError = (error: string): string => {
  // Remove stack trace noise for cleaner display
  const lines = error.split('\n');
  
  // Find the actual error message (usually last lines)
  const errorLines: string[] = [];
  let foundError = false;
  
  for (const line of lines) {
    if (line.includes('Error:') || line.includes('Exception:') || foundError) {
      foundError = true;
      errorLines.push(line);
    }
  }
  
  if (errorLines.length > 0) {
    return errorLines.join('\n');
  }
  
  return error;
};
