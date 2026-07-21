// Python execution service backed by a Pyodide Web Worker.
//
// Pyodide runs in a dedicated worker (public/pyodide.worker.js). A per-run timeout
// on the main thread terminates the worker if user code runs away (e.g.
// `while True: pass`) — something the old in-thread setTimeout could never do,
// because the synchronous runPython blocked the tab (and the timeout callback).

import { PythonResult } from '../pythonTypes';

// ---- Worker plumbing -------------------------------------------------------

let worker: Worker | null = null;
let ready = false;
let initPromise: Promise<void> | null = null;
let seq = 0;

interface Pending {
  resolve: (v: any) => void;
  reject: (e: any) => void;
  timer?: ReturnType<typeof setTimeout>;
}
const pending = new Map<number, Pending>();

// Packages loaded in the current worker, so we can no-op repeats and (after a
// timeout-kill) know what to reload lazily on the next call.
const loadedPackages = new Set<string>();

const TIMEOUT_MARKER = '__TIMEOUT__';

function spawnWorker() {
  worker = new Worker('/pyodide.worker.js');
  worker.onmessage = (e: MessageEvent) => {
    const { id, ok, result, error } = e.data || {};
    const p = pending.get(id);
    if (!p) return;
    pending.delete(id);
    if (p.timer) clearTimeout(p.timer);
    if (ok) p.resolve(result);
    else p.reject(new Error(error || 'Errore worker Python'));
  };
  worker.onerror = () => {
    // Fatal worker error — reject everything and reset so the next call re-inits.
    rejectAllPending('Il worker Python è andato in errore.');
    ready = false;
    worker = null;
    initPromise = null;
    loadedPackages.clear();
  };
}

function rejectAllPending(message: string) {
  for (const [, p] of pending) {
    if (p.timer) clearTimeout(p.timer);
    p.reject(new Error(message));
  }
  pending.clear();
}

// Kill a runaway worker and reset all state; next call transparently re-inits.
function terminateAndReset() {
  if (worker) {
    worker.terminate();
    worker = null;
  }
  ready = false;
  initPromise = null;
  loadedPackages.clear(); // VFS + injected DataFrames die with the worker
  rejectAllPending('Ambiente Python riavviato.');
}

function call(type: string, payload?: any, timeout?: number): Promise<any> {
  if (!worker) spawnWorker();
  const id = ++seq;
  return new Promise((resolve, reject) => {
    const entry: Pending = { resolve, reject };
    if (timeout && timeout > 0) {
      entry.timer = setTimeout(() => {
        pending.delete(id);
        terminateAndReset();
        reject(new Error(`${TIMEOUT_MARKER}:${timeout}`));
      }, timeout);
    }
    pending.set(id, entry);
    worker!.postMessage({ id, type, payload });
  });
}

// ---- Public API (same signatures as before) --------------------------------

/**
 * Initialize Pyodide (in the worker). Idempotent; safe to await repeatedly.
 * No timeout — the very first load pulls the WASM runtime and can take 10s+.
 */
export const initPyodide = async (): Promise<void> => {
  if (ready) return;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    if (!worker) spawnWorker();
    await call('init');
    ready = true;
  })().catch((e) => {
    initPromise = null;
    throw e;
  });
  return initPromise;
};

/** Check if Pyodide is loaded (worker initialized). */
export const isPyodideReady = (): boolean => ready;

/**
 * Load Python packages on-demand (numpy, pandas, matplotlib, seaborn, ...).
 */
export const loadPyodidePackages = async (packages: string[]): Promise<void> => {
  await initPyodide();
  const toLoad = packages.filter((p) => !loadedPackages.has(p));
  if (toLoad.length === 0) return;
  try {
    await call('loadPackages', { packages: toLoad });
    toLoad.forEach((p) => loadedPackages.add(p));
  } catch (error) {
    console.error('Failed to load packages:', error);
    throw error;
  }
};

function toFriendlyError(error: any): string {
  let msg = error?.message || String(error);
  if (typeof msg === 'string' && msg.startsWith(TIMEOUT_MARKER)) {
    const ms = msg.split(':')[1] || '';
    return `Timeout: l'esecuzione ha superato ${ms}ms (possibile loop infinito). L'ambiente Python è stato riavviato.`;
  }
  if (msg.includes('PythonError:')) {
    const match = msg.match(/PythonError:\s*(.+)/s);
    if (match) msg = match[1];
  }
  return msg;
}

/**
 * Run Python code and capture output. A runaway loop now hits the timeout and the
 * worker is terminated (returns success:false with a timeout message) instead of
 * freezing the tab.
 */
export const runPython = async (code: string, timeout: number = 5000): Promise<PythonResult> => {
  const startTime = performance.now();
  try {
    await initPyodide();
    const res = await call('run', { code, mode: 'simple' }, timeout);
    const executionTime = performance.now() - startTime;
    const stdout = (res.stdout || '').trim();
    const stderr = (res.stderr || '').trim();
    if (stderr && !stdout) {
      return { success: false, output: '', error: stderr, executionTime };
    }
    return { success: true, output: stdout, error: stderr || undefined, executionTime };
  } catch (error: any) {
    const executionTime = performance.now() - startTime;
    return { success: false, output: '', error: toFriendlyError(error), executionTime };
  }
};

/**
 * Validate Python output against expected output.
 */
export const validateOutput = (
  userOutput: string,
  expectedOutput: string,
  strictMode: boolean = false
): boolean => {
  const normalizeOutput = (output: string): string => {
    let normalized = output.trim();
    if (!strictMode) {
      normalized = normalized.replace(/\s+/g, ' ');
      normalized = normalized.replace(/\r\n/g, '\n');
    }
    return normalized;
  };
  return normalizeOutput(userOutput) === normalizeOutput(expectedOutput);
};

/**
 * Run code with mock input (for exercises that use input()).
 */
export const runPythonWithInput = async (
  code: string,
  inputs: string[],
  timeout: number = 5000
): Promise<PythonResult> => {
  const inputQueue = JSON.stringify(inputs);
  const wrappedCode = `
_input_queue = ${inputQueue}
_input_index = 0

def _mock_input(prompt=""):
    # CPython writes the prompt to stdout with no trailing newline; mirror that
    # exactly, otherwise the expected output recorded against real python3 would
    # never match what the browser produces.
    global _input_index
    if prompt:
        print(prompt, end="")
    if _input_index < len(_input_queue):
        result = _input_queue[_input_index]
        _input_index += 1
        return result
    raise EOFError("No more input available")

import builtins
builtins.input = _mock_input

${code}
`;
  return runPython(wrappedCode, timeout);
};

/**
 * Format Python error for display.
 */
export const formatPythonError = (error: string): string => {
  const lines = error.split('\n');
  const errorLines: string[] = [];
  let foundError = false;
  for (const line of lines) {
    if (line.includes('Error:') || line.includes('Exception:') || foundError) {
      foundError = true;
      errorLines.push(line);
    }
  }
  return errorLines.length > 0 ? errorLines.join('\n') : error;
};

/**
 * Inject data as a pandas DataFrame into the worker namespace (df_<name>).
 */
export const injectDataFrame = async (
  name: string,
  headers: string[],
  rows: any[][]
): Promise<void> => {
  await initPyodide();
  const records = rows.map((row) => {
    const obj: Record<string, any> = {};
    headers.forEach((h, i) => { obj[h] = row[i] ?? null; });
    return obj;
  });
  try {
    await call('injectDataFrame', { name, records });
  } catch (error: any) {
    console.error(`Failed to inject DataFrame df_${name}:`, error);
    throw new Error(`Errore nel caricamento dati come DataFrame: ${error.message}`);
  }
};

/**
 * Load a CSV already written to the worker VFS as df_<tableName>.
 */
export const injectDataFrameFromCSV = async (
  tableName: string,
  fileName: string
): Promise<void> => {
  await initPyodide();
  try {
    await call('injectCSV', { tableName, fileName });
  } catch (error: any) {
    console.error(`Failed to inject DataFrame df_${tableName} from CSV:`, error);
    throw new Error(`Errore nel caricamento nativo del DataFrame: ${error.message}`);
  }
};

/**
 * Write a file to the worker's virtual filesystem at /data/<filename>.
 */
export const writeFileToVFS = async (
  fileName: string,
  content: string | ArrayBuffer | Uint8Array
): Promise<string> => {
  await initPyodide();
  let buffer: ArrayBuffer;
  if (typeof content === 'string') {
    buffer = new TextEncoder().encode(content).buffer;
  } else if (content instanceof Uint8Array) {
    buffer = content.buffer.slice(content.byteOffset, content.byteOffset + content.byteLength);
  } else {
    buffer = content;
  }
  const res = await call('writeFile', { fileName, bytes: buffer });
  return res.path;
};

/**
 * Get list of DataFrames currently available in the worker namespace.
 */
export const getAvailableDataFrames = async (): Promise<string[]> => {
  if (!ready) return [];
  try {
    const res = await call('availableDataFrames');
    return res.frames || [];
  } catch {
    return [];
  }
};

/**
 * Run Python in DataLab context: renders a trailing DataFrame/Series as a table
 * and captures a matplotlib figure as a base64 PNG.
 */
export const runPythonForDataLab = async (
  code: string,
  timeout: number = 15000
): Promise<{ output: string; error?: string; tableData?: { headers: string[]; rows: any[][] }; image?: string }> => {
  try {
    await initPyodide();
    const res = await call('run', { code, mode: 'datalab' }, timeout);

    let tableData: { headers: string[]; rows: any[][] } | undefined;
    let image: string | undefined;
    let cleanOutput = (res.stdout || '').trim();

    if (cleanOutput.includes('__MATPLOTLIB_IMAGE__')) {
      const parts = cleanOutput.split('__MATPLOTLIB_IMAGE__');
      cleanOutput = parts[0].trim();
      image = parts[1].trim();
    }
    if (cleanOutput.includes('__DATAFRAME_JSON__')) {
      const parts = cleanOutput.split('__DATAFRAME_JSON__');
      cleanOutput = parts[0].trim();
      try {
        tableData = JSON.parse(parts[1]);
      } catch { /* ignore parse errors */ }
    }

    return {
      output: cleanOutput,
      error: (res.stderr || '').trim() || undefined,
      tableData,
      image,
    };
  } catch (error: any) {
    return { output: '', error: toFriendlyError(error) };
  }
};
