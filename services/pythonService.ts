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
  FS: any; // Virtual File System module
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

// Track which packages are already loaded
const loadedPackages = new Set<string>();

/**
 * Load Python packages on-demand via Pyodide
 * Uses loadPackage for built-in packages (numpy, pandas, matplotlib, etc.)
 */
export const loadPyodidePackages = async (packages: string[]): Promise<void> => {
  const pyodide = await initPyodide();
  const toLoad = packages.filter(p => !loadedPackages.has(p));
  
  if (toLoad.length === 0) return;
  
  try {
    await pyodide.loadPackage(toLoad);
    toLoad.forEach(p => loadedPackages.add(p));
    console.log(`Loaded packages: ${toLoad.join(', ')}`);
  } catch (error) {
    console.error('Failed to load packages:', error);
    throw error;
  }
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

/**
 * Inject data as a pandas DataFrame into the Pyodide namespace.
 * After calling this, the DataFrame is available as `df_<name>` in Python code.
 * @param name - The table/variable name (will be prefixed with df_)
 * @param headers - Column headers 
 * @param rows - 2D array of row data
 */
export const injectDataFrame = async (
  name: string,
  headers: string[],
  rows: any[][]
): Promise<void> => {
  const pyodide = await initPyodide();
  
  // Ensure pandas is loaded
  await loadPyodidePackages(['pandas']);
  
  // Convert rows to list of dicts for pandas
  const records = rows.map(row => {
    const obj: Record<string, any> = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] ?? null;
    });
    return obj;
  });
  
  // Serialize to JSON and inject via Python
  const jsonStr = JSON.stringify(records).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  
  const pyCode = `
import pandas as pd
import json as _json

_data = _json.loads('${jsonStr}')
df_${name} = pd.DataFrame(_data)
del _data
`;
  
  try {
    pyodide.runPython(pyCode);
    console.log(`Injected DataFrame df_${name} (${rows.length} rows, ${headers.length} cols)`);
  } catch (error: any) {
    console.error(`Failed to inject DataFrame df_${name}:`, error);
    throw new Error(`Errore nel caricamento dati come DataFrame: ${error.message}`);
  }
};

/**
 * Write a file to Pyodide's virtual filesystem at /data/<filename>.
 * This allows Python code to access uploaded files via standard paths,
 * e.g. pd.read_csv('/data/vendite.csv')
 */
export const writeFileToVFS = async (
  fileName: string,
  content: string | ArrayBuffer | Uint8Array
): Promise<string> => {
  const pyodide = await initPyodide();
  
  const filePath = `/data/${fileName}`;
  
  // Create /data directory if it doesn't exist
  try {
    pyodide.FS.mkdir('/data');
  } catch (e: any) {
    if (e.code !== 'EEXIST') {
      console.warn("Failed to create /data directory:", e);
    }
  }
  
  // Write file natively using Pyodide FS (ArrayBuffer/Uint8Array highly recommended for large files)
  let bytes: Uint8Array;
  if (typeof content === 'string') {
    const encoder = new TextEncoder();
    bytes = encoder.encode(content);
  } else if (content instanceof ArrayBuffer) {
    bytes = new Uint8Array(content);
  } else {
    bytes = content;
  }
  
  pyodide.FS.writeFile(filePath, bytes);
  
  console.log(`Written file to VFS natively: ${filePath} (${bytes.length} bytes)`);
  return filePath;
};

/**
 * Get list of currently available DataFrames in Pyodide namespace
 */
export const getAvailableDataFrames = async (): Promise<string[]> => {
  if (!pyodideInstance) return [];
  
  try {
    const result = pyodideInstance.runPython(`
import pandas as pd
[name for name in dir() if name.startswith('df_') and isinstance(eval(name), pd.DataFrame)]
`);
    return result.toJs() || [];
  } catch {
    return [];
  }
};

/**
 * Run Python code in DataLab context with DataFrame-aware output.
 * Automatically renders the last expression if it's a DataFrame.
 */
export const runPythonForDataLab = async (
  code: string,
  timeout: number = 15000
): Promise<{ output: string; error?: string; tableData?: { headers: string[]; rows: any[][] }; image?: string }> => {
  const startTime = performance.now();
  
  try {
    const pyodide = await initPyodide();
    
    // Ensure packages are loaded
    await loadPyodidePackages(['pandas', 'matplotlib']);
    
    let stdout = '';
    let stderr = '';
    
    pyodide.setStdout({
      batched: (output: string) => { stdout += output; }
    });
    
    pyodide.setStderr({
      batched: (output: string) => { stderr += output; }
    });

    // Escape code for Python string literal
    const escapedCode = code.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

    // Enhanced execution strategies:
    // 1. AST parsing to separate last expression
    // 2. Execute statements
    // 3. Eval last expression
    // 4. Serialize result if DataFrame/Series, else print
    const wrappedCode = `
import pandas as pd
import json as _json
import ast as _ast
import sys as _sys
import io as _io
import base64 as _base64
import matplotlib.pyplot as _plt

# Set non-interactive backend and dark styling
_plt.switch_backend('Agg')
try:
    _plt.style.use('dark_background')
except:
    pass
_plt.rcParams.update({
    'figure.figsize': [10, 5],
    'figure.dpi': 200,
    'savefig.dpi': 200,
    'savefig.facecolor': '#0f0f1a',
    'figure.facecolor': '#0f0f1a',
    'axes.facecolor': '#141425',
    'axes.edgecolor': '#2a2a4a',
    'axes.linewidth': 0.8,
    'axes.labelcolor': '#c8c8e0',
    'axes.grid': True,
    'axes.prop_cycle': _plt.cycler('color', ['#00d2ff', '#7b68ee', '#ff6b9d', '#00e676', '#ffd54f', '#ff7043', '#b388ff', '#18ffff']),
    'grid.color': '#ffffff',
    'grid.alpha': 0.06,
    'grid.linestyle': '--',
    'grid.linewidth': 0.5,
    'xtick.color': '#9898b0',
    'ytick.color': '#9898b0',
    'xtick.labelsize': 9,
    'ytick.labelsize': 9,
    'xtick.major.pad': 6,
    'ytick.major.pad': 6,
    'xtick.major.size': 0,
    'ytick.major.size': 0,
    'text.color': '#e0e0f0',
    'font.size': 10,
    'font.family': 'sans-serif',
    'axes.titlesize': 13,
    'axes.titleweight': 'bold',
    'axes.titlepad': 14,
    'axes.labelsize': 10,
    'axes.labelpad': 8,
    'legend.facecolor': '#1a1a30',
    'legend.edgecolor': '#2a2a4a',
    'legend.fontsize': 9,
    'legend.framealpha': 0.9,
    'legend.fancybox': True,
    'legend.shadow': False,
    'figure.autolayout': True,
    'axes.spines.top': False,
    'axes.spines.right': False,
})

_code = """${escapedCode}"""

# Increase recursion limit for complex matplotlib objects
_sys.setrecursionlimit(500)

def _execute_and_display(code):
    try:
        _tree = _ast.parse(code)
        _last_is_expr = False
        
        if _tree.body and isinstance(_tree.body[-1], _ast.Expr):
            _last_is_expr = True
            _last_node = _tree.body.pop()
            
            # Execute all but last
            if _tree.body:
                _exec_code = compile(_tree, "<string>", "exec")
                exec(_exec_code, globals())
                
            # Evaluate last
            _eval_code = compile(_ast.Expression(_last_node.value), "<string>", "eval")
            _result = eval(_eval_code, globals())
            
            if _result is not None:
                try:
                    if isinstance(_result, pd.DataFrame):
                        _json_str = _result.to_json(orient='split', date_format='iso')
                        _data = _json.loads(_json_str)
                        _cols = _data['columns']
                        _rows = _data['data']
                        print("__DATAFRAME_JSON__" + _json.dumps({"headers": _cols, "rows": _rows}, default=str))
                    elif isinstance(_result, pd.Series):
                        _df = _result.to_frame()
                        _json_str = _df.to_json(orient='split', date_format='iso')
                        _data = _json.loads(_json_str)
                        _cols = _data['columns']
                        _rows = _data['data']
                        print("__DATAFRAME_JSON__" + _json.dumps({"headers": _cols, "rows": _rows}, default=str))
                    else:
                        _type_str = str(type(_result))
                        if 'matplotlib' in _type_str:
                            pass  # Suppress matplotlib objects, plot is captured below
                        else:
                            try:
                                _str_res = str(_result)
                                if 'AxesSubplot' not in _str_res and 'Axes(' not in _str_res and '<Figure' not in _str_res:
                                    print(_str_res)
                            except (RecursionError, OverflowError):
                                pass  # Complex object, skip text output
                except (RecursionError, OverflowError):
                    pass  # Complex object caused recursion, plot still captured below
        else:
            # No expression at end, just exec
            exec(code, globals())
            
    except Exception as e:
        # Print error so it is captured in stderr
        print(f"{type(e).__name__}: {e}", file=_sys.stderr)

    # Check for matplotlib figures
    if _plt.get_fignums():
        _buf = _io.BytesIO()
        try:
            _plt.tight_layout()
        except:
            pass # Ignore layout errors
            
        _plt.savefig(_buf, format='png', bbox_inches='tight', facecolor='#0f0f1a', edgecolor='none', pad_inches=0.3)
        _buf.seek(0)
        _img_str = _base64.b64encode(_buf.read()).decode('utf-8')
        print("__MATPLOTLIB_IMAGE__" + _img_str)
        _plt.close('all')

_execute_and_display(_code)
`;

    const executeWithTimeout = async (): Promise<any> => {
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error(`Timeout: l'esecuzione ha superato ${timeout}ms.`));
        }, timeout);
        try {
          const result = pyodide.runPython(wrappedCode);
          clearTimeout(timeoutId);
          resolve(result);
        } catch (error) {
          clearTimeout(timeoutId);
          reject(error);
        }
      });
    };

    await executeWithTimeout();
    
    // Parse output — check for DataFrame marker and Image marker
    let tableData: { headers: string[]; rows: any[][] } | undefined;
    let image: string | undefined;
    let cleanOutput = stdout.trim();

    // Check for image
    if (cleanOutput.includes('__MATPLOTLIB_IMAGE__')) {
        const parts = cleanOutput.split('__MATPLOTLIB_IMAGE__');
        cleanOutput = parts[0].trim();
        image = parts[1].trim();
    }
    
    if (cleanOutput.includes('__DATAFRAME_JSON__')) {
      const parts = cleanOutput.split('__DATAFRAME_JSON__');
      cleanOutput = parts[0].trim();
      try {
        const dfData = JSON.parse(parts[1]);
        tableData = dfData;
      } catch { /* ignore parse errors */ }
    }

    // Always return output if present, even if empty (logs might be empty but tableData present)
    return { 
      output: cleanOutput, 
      error: stderr.trim() || undefined,
      tableData,
      image
    };

  } catch (error: any) {
    let errorMessage = error.message || String(error);
    if (errorMessage.includes('PythonError:')) {
      const match = errorMessage.match(/PythonError:\s*(.+)/s);
      if (match) errorMessage = match[1];
    }
    return { output: '', error: errorMessage };
  }
};
