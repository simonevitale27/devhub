import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';

interface PythonEditorProps {
  value: string;
  onChange: (val: string) => void;
  onRun: () => void;
  availableDataFrames?: string[];
  filePaths?: Record<string, string>; // tableName -> /data/filename
  dataFrameColumns?: Record<string, string[]>; // df_name -> [col1, col2]
  placeholder?: string;
}

// ──── Syntax Highlighting ────

function highlightPython(code: string): string {
  const lines = code.split('\n');
  
  const highlightedLines = lines.map(line => {
    let processed = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    const tokens: Array<{placeholder: string, html: string}> = [];
    let tokenCounter = 0;
    
    const createToken = (html: string) => {
      const placeholder = `__PYT_${tokenCounter++}__`;
      tokens.push({ placeholder, html });
      return placeholder;
    };
    
    // 1. Strings (triple-quoted, double, single)
    processed = processed.replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, (match) => {
      return createToken(`<span class="text-emerald-400">${match}</span>`);
    });
    
    // 2. Comments
    if (processed.includes('#')) {
      const inToken = processed.substring(0, processed.indexOf('#')).includes('__PYT_');
      if (!inToken) {
        const hashIndex = processed.indexOf('#');
        const beforeComment = processed.substring(0, hashIndex);
        const comment = processed.substring(hashIndex);
        const commentToken = createToken(`<span class="text-slate-500 italic">${comment}</span>`);
        processed = beforeComment + commentToken;
      }
    }
    
    // 3. Keywords
    const keywords = ['import', 'from', 'as', 'def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'and', 'or', 'not', 'in', 'is', 'True', 'False', 'None', 'with', 'try', 'except', 'finally', 'raise', 'assert', 'break', 'continue', 'pass', 'yield', 'lambda', 'del', 'global', 'nonlocal', 'async', 'await'];
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
      processed = processed.replace(regex, (match, _kw, offset) => {
        if (match.includes('__PYT_')) return match;
        const before = processed.substring(Math.max(0, offset - 8), offset);
        if (before.includes('__PYT_')) return match;
        return createToken(`<span class="text-blue-400 font-semibold">${match}</span>`);
      });
    });
    
    // 4. Built-in functions (distinct orange color)
    const builtins = ['print', 'len', 'range', 'type', 'str', 'int', 'float', 'list', 'dict', 'set', 'tuple', 'sorted', 'enumerate', 'zip', 'map', 'filter', 'abs', 'max', 'min', 'sum', 'round', 'open', 'isinstance', 'issubclass', 'hasattr', 'getattr', 'setattr', 'input', 'iter', 'next', 'reversed', 'bool', 'bytes', 'chr', 'ord', 'hex', 'oct', 'bin', 'format', 'repr', 'hash', 'id', 'any', 'all', 'super', 'property', 'staticmethod', 'classmethod', 'vars', 'globals', 'locals', 'dir', 'help', 'callable', 'eval', 'exec', 'compile', 'complex', 'divmod', 'pow', 'slice', 'frozenset', 'memoryview', 'object', 'breakpoint'];
    builtins.forEach(name => {
      const regex = new RegExp(`\\b(${name})\\s*(?=\\()`, 'g');
      processed = processed.replace(regex, (match, fn, offset) => {
        if (match.includes('__PYT_')) return match;
        const before = processed.substring(Math.max(0, offset - 8), offset);
        if (before.includes('__PYT_')) return match;
        return createToken(`<span class="text-orange-400 font-semibold">${fn}</span>`) + match.substring(fn.length);
      });
    });
    
    // 5. Method calls on objects: .method_name( and .attribute
    processed = processed.replace(/\.([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, (match, method, offset) => {
      if (match.includes('__PYT_')) return match;
      const before = processed.substring(Math.max(0, offset - 8), offset);
      if (before.includes('__PYT_')) return match;
      return '.' + createToken(`<span class="text-cyan-400">${method}</span>`) + match.substring(1 + method.length);
    });
    
    // 6. Known attributes/properties (no parentheses)
    const knownAttrs = ['shape', 'columns', 'dtypes', 'index', 'values', 'T', 'size', 'ndim', 'empty', 'name', 'dtype', 'str', 'dt', 'cat', 'axes', 'iloc', 'loc', 'at', 'iat'];
    knownAttrs.forEach(attr => {
      const regex = new RegExp(`\\.\\b(${attr})\\b(?!\\s*\\()`, 'g');
      processed = processed.replace(regex, (match, a, offset) => {
        if (match.includes('__PYT_')) return match;
        const before = processed.substring(Math.max(0, offset - 8), offset);
        if (before.includes('__PYT_')) return match;
        return '.' + createToken(`<span class="text-cyan-300">${a}</span>`);
      });
    });
    
    // 7. Numbers
    processed = processed.replace(/\b(\d+\.?\d*)\b/g, (match, _n, offset) => {
      if (match.includes('__PYT_')) return match;
      const before = processed.substring(Math.max(0, offset - 8), offset);
      if (before.includes('__PYT_')) return match;
      return createToken(`<span class="text-amber-400">${match}</span>`);
    });
    
    // 8. Function definitions and regular function calls
    processed = processed.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, (match, funcName, offset) => {
      if (match.includes('__PYT_')) return match;
      const before = processed.substring(Math.max(0, offset - 8), offset);
      if (before.includes('__PYT_')) return match;
      return createToken(`<span class="text-purple-400">${funcName}</span>`) + match.substring(funcName.length);
    });
    
    // 9. Decorators
    processed = processed.replace(/(@\w+)/g, (match) => {
      if (match.includes('__PYT_')) return match;
      return createToken(`<span class="text-yellow-400">${match}</span>`);
    });
    
    // 10. self/cls
    processed = processed.replace(/\b(self|cls)\b/g, (match, _s, offset) => {
      if (match.includes('__PYT_')) return match;
      const before = processed.substring(Math.max(0, offset - 8), offset);
      if (before.includes('__PYT_')) return match;
      return createToken(`<span class="text-red-300 italic">${match}</span>`);
    });
    
    // 11. Magic methods/attributes
    processed = processed.replace(/\b(__[a-zA-Z_]+__)\b/g, (match, magic, offset) => {
      // Magic methods look like placeholders but aren't (unless they match exactly __PYT_N__)
      // But let's be safe
      if (match.includes('__PYT_')) return match;
      const before = processed.substring(Math.max(0, offset - 8), offset);
      if (before.includes('__PYT_')) return match;
      return createToken(`<span class="text-yellow-300 font-semibold">${magic}</span>`);
    });
    
    // Replace all tokens
    tokens.forEach(({ placeholder, html }) => {
      processed = processed.replace(placeholder, html);
    });
    
    return processed;
  });
  
  return highlightedLines.join('\n');
}

// ──── Autocomplete Suggestions ────

// Pandas DataFrame methods & attributes
const PANDAS_SUGGESTIONS = [
  // Data inspection
  { label: '.head()', detail: 'First n rows', insert: '.head()' },
  { label: '.tail()', detail: 'Last n rows', insert: '.tail()' },
  { label: '.describe()', detail: 'Summary statistics', insert: '.describe()' },
  { label: '.info()', detail: 'DataFrame info', insert: '.info()' },
  { label: '.sample()', detail: 'Random sample', insert: '.sample()' },
  { label: '.shape', detail: 'Dimensions (rows, cols)', insert: '.shape' },
  { label: '.columns', detail: 'Column names', insert: '.columns' },
  { label: '.dtypes', detail: 'Column data types', insert: '.dtypes' },
  { label: '.index', detail: 'Row index', insert: '.index' },
  { label: '.values', detail: 'Underlying numpy array', insert: '.values' },
  { label: '.size', detail: 'Number of elements', insert: '.size' },
  { label: '.ndim', detail: 'Number of dimensions', insert: '.ndim' },
  { label: '.empty', detail: 'Check if empty', insert: '.empty' },
  { label: '.T', detail: 'Transpose', insert: '.T' },
  // Selection & filtering
  { label: '.loc[]', detail: 'Label-based selection', insert: '.loc[]' },
  { label: '.iloc[]', detail: 'Integer-based selection', insert: '.iloc[]' },
  { label: '.at[]', detail: 'Access single value by label', insert: '.at[]' },
  { label: '.iat[]', detail: 'Access single value by integer', insert: '.iat[]' },
  { label: '.query()', detail: 'Query by expression', insert: ".query('')" },
  { label: '.filter()', detail: 'Filter rows/columns', insert: '.filter()' },
  { label: '.where()', detail: 'Replace where condition is False', insert: '.where()' },
  { label: '.mask()', detail: 'Replace where condition is True', insert: '.mask()' },
  { label: '.between()', detail: 'Check if between bounds', insert: '.between()' },
  { label: '.isin()', detail: 'Check membership', insert: '.isin([])' },
  // Aggregation & statistics
  { label: '.sum()', detail: 'Sum values', insert: '.sum()' },
  { label: '.mean()', detail: 'Mean value', insert: '.mean()' },
  { label: '.median()', detail: 'Median value', insert: '.median()' },
  { label: '.std()', detail: 'Standard deviation', insert: '.std()' },
  { label: '.var()', detail: 'Variance', insert: '.var()' },
  { label: '.max()', detail: 'Max value', insert: '.max()' },
  { label: '.min()', detail: 'Min value', insert: '.min()' },
  { label: '.count()', detail: 'Count non-null', insert: '.count()' },
  { label: '.abs()', detail: 'Absolute values', insert: '.abs()' },
  { label: '.cumsum()', detail: 'Cumulative sum', insert: '.cumsum()' },
  { label: '.cumprod()', detail: 'Cumulative product', insert: '.cumprod()' },
  { label: '.cummax()', detail: 'Cumulative max', insert: '.cummax()' },
  { label: '.cummin()', detail: 'Cumulative min', insert: '.cummin()' },
  { label: '.diff()', detail: 'Difference between consecutive', insert: '.diff()' },
  { label: '.pct_change()', detail: 'Percentage change', insert: '.pct_change()' },
  { label: '.rank()', detail: 'Rank values', insert: '.rank()' },
  { label: '.nlargest()', detail: 'N largest values', insert: '.nlargest()' },
  { label: '.nsmallest()', detail: 'N smallest values', insert: '.nsmallest()' },
  { label: '.idxmax()', detail: 'Index of max', insert: '.idxmax()' },
  { label: '.idxmin()', detail: 'Index of min', insert: '.idxmin()' },
  { label: '.clip()', detail: 'Clip values to range', insert: '.clip()' },
  { label: '.corr()', detail: 'Correlation matrix', insert: '.corr()' },
  { label: '.cov()', detail: 'Covariance matrix', insert: '.cov()' },
  // Grouping & reshaping
  { label: '.groupby()', detail: 'Group by columns', insert: ".groupby('')" },
  { label: '.agg()', detail: 'Aggregate functions', insert: '.agg()' },
  { label: '.pivot_table()', detail: 'Pivot table', insert: '.pivot_table()' },
  { label: '.melt()', detail: 'Unpivot wide to long', insert: '.melt()' },
  { label: '.stack()', detail: 'Stack columns to index', insert: '.stack()' },
  { label: '.unstack()', detail: 'Unstack index to columns', insert: '.unstack()' },
  { label: '.crosstab()', detail: 'Cross tabulation', insert: '.crosstab()' },
  // Unique & value counts
  { label: '.value_counts()', detail: 'Count unique values', insert: '.value_counts()' },
  { label: '.unique()', detail: 'Unique values', insert: '.unique()' },
  { label: '.nunique()', detail: 'Number of unique values', insert: '.nunique()' },
  // Sorting
  { label: '.sort_values()', detail: 'Sort by column', insert: ".sort_values('')" },
  { label: '.sort_index()', detail: 'Sort by index', insert: '.sort_index()' },
  // Missing data
  { label: '.isnull()', detail: 'Check for null', insert: '.isnull()' },
  { label: '.isna()', detail: 'Check for NA', insert: '.isna()' },
  { label: '.notnull()', detail: 'Check for not null', insert: '.notnull()' },
  { label: '.notna()', detail: 'Check for not NA', insert: '.notna()' },
  { label: '.fillna()', detail: 'Fill missing values', insert: '.fillna()' },
  { label: '.dropna()', detail: 'Drop missing values', insert: '.dropna()' },
  { label: '.interpolate()', detail: 'Interpolate missing', insert: '.interpolate()' },
  // Modification
  { label: '.apply()', detail: 'Apply function', insert: '.apply()' },
  { label: '.map()', detail: 'Map values', insert: '.map()' },
  { label: '.transform()', detail: 'Transform values', insert: '.transform()' },
  { label: '.replace()', detail: 'Replace values', insert: '.replace()' },
  { label: '.rename()', detail: 'Rename columns', insert: '.rename(columns={})' },
  { label: '.astype()', detail: 'Cast column type', insert: '.astype()' },
  { label: '.copy()', detail: 'Deep copy', insert: '.copy()' },
  { label: '.drop()', detail: 'Drop columns/rows', insert: '.drop()' },
  { label: '.drop_duplicates()', detail: 'Remove duplicates', insert: '.drop_duplicates()' },
  { label: '.reset_index()', detail: 'Reset index', insert: '.reset_index()' },
  { label: '.set_index()', detail: 'Set column as index', insert: ".set_index('')" },
  // Merging
  { label: '.merge()', detail: 'Merge DataFrames', insert: '.merge()' },
  { label: '.join()', detail: 'Join DataFrames', insert: '.join()' },
  { label: '.append()', detail: 'Append rows', insert: '.append()' },
  // String operations
  { label: '.str.lower()', detail: 'Lowercase strings', insert: '.str.lower()' },
  { label: '.str.upper()', detail: 'Uppercase strings', insert: '.str.upper()' },
  { label: '.str.strip()', detail: 'Strip whitespace', insert: '.str.strip()' },
  { label: '.str.contains()', detail: 'Check contains pattern', insert: ".str.contains('')" },
  { label: '.str.replace()', detail: 'Replace in strings', insert: ".str.replace('', '')" },
  { label: '.str.split()', detail: 'Split strings', insert: ".str.split('')" },
  { label: '.str.len()', detail: 'String length', insert: '.str.len()' },
  { label: '.str.startswith()', detail: 'Starts with', insert: ".str.startswith('')" },
  { label: '.str.endswith()', detail: 'Ends with', insert: ".str.endswith('')" },
  // DateTime
  { label: '.dt.year', detail: 'Extract year', insert: '.dt.year' },
  { label: '.dt.month', detail: 'Extract month', insert: '.dt.month' },
  { label: '.dt.day', detail: 'Extract day', insert: '.dt.day' },
  { label: '.dt.hour', detail: 'Extract hour', insert: '.dt.hour' },
  { label: '.dt.dayofweek', detail: 'Day of week', insert: '.dt.dayofweek' },
  { label: '.dt.date', detail: 'Date component', insert: '.dt.date' },
  // Export
  { label: '.to_csv()', detail: 'Export to CSV', insert: ".to_csv('')" },
  { label: '.to_json()', detail: 'Export to JSON', insert: '.to_json()' },
  { label: '.to_dict()', detail: 'Convert to dict', insert: '.to_dict()' },
  { label: '.to_numpy()', detail: 'Convert to numpy array', insert: '.to_numpy()' },
  { label: '.to_list()', detail: 'Convert to list', insert: '.to_list()' },
  // Plotting
  { label: '.plot()', detail: 'Quick plot', insert: '.plot()' },
  { label: '.plot.bar()', detail: 'Bar plot', insert: '.plot.bar()' },
  { label: '.plot.hist()', detail: 'Histogram', insert: '.plot.hist()' },
  { label: '.plot.scatter()', detail: 'Scatter plot', insert: '.plot.scatter()' },
  { label: '.plot.box()', detail: 'Box plot', insert: '.plot.box()' },
  { label: '.plot.line()', detail: 'Line plot', insert: '.plot.line()' },
];

// pd. module-level functions
const PD_SUGGESTIONS = [
  { label: 'pd.read_csv()', detail: 'Read CSV file', insert: "pd.read_csv('')" },
  { label: 'pd.read_json()', detail: 'Read JSON file', insert: "pd.read_json('')" },
  { label: 'pd.read_excel()', detail: 'Read Excel file', insert: "pd.read_excel('')" },
  { label: 'pd.DataFrame()', detail: 'Create DataFrame', insert: 'pd.DataFrame()' },
  { label: 'pd.Series()', detail: 'Create Series', insert: 'pd.Series()' },
  { label: 'pd.concat()', detail: 'Concatenate DataFrames', insert: 'pd.concat([])' },
  { label: 'pd.merge()', detail: 'Merge DataFrames', insert: 'pd.merge()' },
  { label: 'pd.to_datetime()', detail: 'Convert to datetime', insert: "pd.to_datetime('')" },
  { label: 'pd.to_numeric()', detail: 'Convert to numeric', insert: 'pd.to_numeric()' },
  { label: 'pd.cut()', detail: 'Bin values into intervals', insert: 'pd.cut()' },
  { label: 'pd.qcut()', detail: 'Quantile-based binning', insert: 'pd.qcut()' },
  { label: 'pd.get_dummies()', detail: 'One-hot encoding', insert: 'pd.get_dummies()' },
  { label: 'pd.pivot_table()', detail: 'Create pivot table', insert: 'pd.pivot_table()' },
  { label: 'pd.crosstab()', detail: 'Cross tabulation', insert: 'pd.crosstab()' },
  { label: 'pd.isna()', detail: 'Check for NA', insert: 'pd.isna()' },
  { label: 'pd.notna()', detail: 'Check for not NA', insert: 'pd.notna()' },
  { label: 'pd.set_option()', detail: 'Set display option', insert: "pd.set_option('')" },
];

// np. module-level functions
const NP_SUGGESTIONS = [
  { label: 'np.array()', detail: 'Create array', insert: 'np.array([])' },
  { label: 'np.zeros()', detail: 'Array of zeros', insert: 'np.zeros()' },
  { label: 'np.ones()', detail: 'Array of ones', insert: 'np.ones()' },
  { label: 'np.arange()', detail: 'Range array', insert: 'np.arange()' },
  { label: 'np.linspace()', detail: 'Evenly spaced values', insert: 'np.linspace()' },
  { label: 'np.mean()', detail: 'Mean', insert: 'np.mean()' },
  { label: 'np.median()', detail: 'Median', insert: 'np.median()' },
  { label: 'np.std()', detail: 'Standard deviation', insert: 'np.std()' },
  { label: 'np.var()', detail: 'Variance', insert: 'np.var()' },
  { label: 'np.sum()', detail: 'Sum', insert: 'np.sum()' },
  { label: 'np.min()', detail: 'Minimum', insert: 'np.min()' },
  { label: 'np.max()', detail: 'Maximum', insert: 'np.max()' },
  { label: 'np.abs()', detail: 'Absolute values', insert: 'np.abs()' },
  { label: 'np.sqrt()', detail: 'Square root', insert: 'np.sqrt()' },
  { label: 'np.log()', detail: 'Natural log', insert: 'np.log()' },
  { label: 'np.exp()', detail: 'Exponential', insert: 'np.exp()' },
  { label: 'np.round()', detail: 'Round values', insert: 'np.round()' },
  { label: 'np.unique()', detail: 'Unique values', insert: 'np.unique()' },
  { label: 'np.sort()', detail: 'Sort array', insert: 'np.sort()' },
  { label: 'np.where()', detail: 'Conditional selection', insert: 'np.where()' },
  { label: 'np.concatenate()', detail: 'Concatenate arrays', insert: 'np.concatenate([])' },
  { label: 'np.reshape()', detail: 'Reshape array', insert: 'np.reshape()' },
  { label: 'np.random.rand()', detail: 'Random uniform', insert: 'np.random.rand()' },
  { label: 'np.random.randn()', detail: 'Random normal', insert: 'np.random.randn()' },
  { label: 'np.random.randint()', detail: 'Random integers', insert: 'np.random.randint()' },
  { label: 'np.corrcoef()', detail: 'Correlation coefficient', insert: 'np.corrcoef()' },
  { label: 'np.dot()', detail: 'Dot product', insert: 'np.dot()' },
  { label: 'np.nan', detail: 'Not a Number', insert: 'np.nan' },
  { label: 'np.inf', detail: 'Infinity', insert: 'np.inf' },
  { label: 'np.pi', detail: 'Pi constant', insert: 'np.pi' },
];

// Python built-in functions (for when the user types them at the start of a word)
const PYTHON_BUILTINS = [
  { label: 'print()', detail: 'Print to console', insert: 'print()' },
  { label: 'len()', detail: 'Length of object', insert: 'len()' },
  { label: 'range()', detail: 'Generate range', insert: 'range()' },
  { label: 'type()', detail: 'Type of object', insert: 'type()' },
  { label: 'str()', detail: 'Convert to string', insert: 'str()' },
  { label: 'int()', detail: 'Convert to integer', insert: 'int()' },
  { label: 'float()', detail: 'Convert to float', insert: 'float()' },
  { label: 'list()', detail: 'Create/convert to list', insert: 'list()' },
  { label: 'dict()', detail: 'Create/convert to dict', insert: 'dict()' },
  { label: 'set()', detail: 'Create/convert to set', insert: 'set()' },
  { label: 'tuple()', detail: 'Create/convert to tuple', insert: 'tuple()' },
  { label: 'sorted()', detail: 'Sort iterable', insert: 'sorted()' },
  { label: 'enumerate()', detail: 'Index + value pairs', insert: 'enumerate()' },
  { label: 'zip()', detail: 'Zip iterables', insert: 'zip()' },
  { label: 'map()', detail: 'Apply function to items', insert: 'map()' },
  { label: 'filter()', detail: 'Filter iterable', insert: 'filter()' },
  { label: 'abs()', detail: 'Absolute value', insert: 'abs()' },
  { label: 'max()', detail: 'Maximum value', insert: 'max()' },
  { label: 'min()', detail: 'Minimum value', insert: 'min()' },
  { label: 'sum()', detail: 'Sum values', insert: 'sum()' },
  { label: 'round()', detail: 'Round number', insert: 'round()' },
  { label: 'isinstance()', detail: 'Check type', insert: 'isinstance()' },
  { label: 'hasattr()', detail: 'Check attribute', insert: 'hasattr()' },
  { label: 'input()', detail: 'Read user input', insert: 'input()' },
  { label: 'open()', detail: 'Open file', insert: 'open()' },
  { label: 'reversed()', detail: 'Reverse iterable', insert: 'reversed()' },
  { label: 'bool()', detail: 'Convert to bool', insert: 'bool()' },
  { label: 'any()', detail: 'Any True?', insert: 'any()' },
  { label: 'all()', detail: 'All True?', insert: 'all()' },
  { label: 'format()', detail: 'Format string', insert: 'format()' },
  { label: 'repr()', detail: 'Object representation', insert: 'repr()' },
  { label: 'iter()', detail: 'Create iterator', insert: 'iter()' },
  { label: 'next()', detail: 'Get next item', insert: 'next()' },
  { label: 'chr()', detail: 'Char from code', insert: 'chr()' },
  { label: 'ord()', detail: 'Code from char', insert: 'ord()' },
  { label: 'hex()', detail: 'To hexadecimal', insert: 'hex()' },
  { label: 'bin()', detail: 'To binary', insert: 'bin()' },
  { label: 'vars()', detail: 'Object attributes', insert: 'vars()' },
  { label: 'dir()', detail: 'List attributes', insert: 'dir()' },
  { label: 'id()', detail: 'Object identity', insert: 'id()' },
  { label: 'hash()', detail: 'Hash value', insert: 'hash()' },
  { label: 'getattr()', detail: 'Get attribute', insert: 'getattr()' },
  { label: 'setattr()', detail: 'Set attribute', insert: 'setattr()' },
  { label: 'delattr()', detail: 'Delete attribute', insert: 'delattr()' },
  { label: 'callable()', detail: 'Check if callable', insert: 'callable()' },
  { label: 'super()', detail: 'Parent class', insert: 'super()' },
];

// ──── Component ────

const PythonEditor: React.FC<PythonEditorProps> = ({ value, onChange, onRun, availableDataFrames = [], filePaths = {}, dataFrameColumns, placeholder }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [cursorLine, setCursorLine] = useState(1);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteItems, setAutocompleteItems] = useState<typeof PANDAS_SUGGESTIONS>([]);
  const [autocompletePos, setAutocompletePos] = useState({ top: 0, left: 0 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  
  const lineCount = useMemo(() => value.split('\n').length, [value]);
  
  // Sync scroll
  const handleScroll = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    if (highlightRef.current) {
      highlightRef.current.scrollTop = textarea.scrollTop;
      highlightRef.current.scrollLeft = textarea.scrollLeft;
    }
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textarea.scrollTop;
    }
  }, []);
  
  // Handle cursor position for active line
  const updateCursorLine = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const pos = textarea.selectionStart;
    const line = value.substring(0, pos).split('\n').length;
    setCursorLine(line);
  }, [value]);
  
  // Check for autocomplete trigger
  const checkAutocomplete = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const pos = textarea.selectionStart;
    const textBefore = value.substring(0, pos);
    
    // Helper to compute dropdown position
    const calcPos = () => {
      const lines = textBefore.split('\n');
      const currentLineNum = lines.length;
      const currentCol = lines[lines.length - 1].length;
      return {
        top: currentLineNum * 21 + 4 - (textarea.scrollTop || 0),
        left: currentCol * 8.4 + 48 - (textarea.scrollLeft || 0)
      };
    };
    
    // 1. pd. — pandas module functions
    const pdMatch = textBefore.match(/\bpd\.(\w*)$/);
    if (pdMatch) {
      const partial = pdMatch[1].toLowerCase();
      const filtered = PD_SUGGESTIONS.filter(s =>
        s.label.toLowerCase().replace('pd.', '').includes(partial)
      ).map(s => ({
        ...s,
        // Insert only the part after "pd."
        insert: s.insert.replace('pd.', '')
      }));
      if (filtered.length > 0) {
        setAutocompleteItems(filtered);
        setAutocompletePos(calcPos());
        setShowAutocomplete(true);
        setSelectedIndex(0);
        return;
      }
    }
    
    // 2. np. — numpy module functions
    const npMatch = textBefore.match(/\bnp\.(\w*)$/);
    if (npMatch) {
      const partial = npMatch[1].toLowerCase();
      const filtered = NP_SUGGESTIONS.filter(s =>
        s.label.toLowerCase().replace('np.', '').includes(partial)
      ).map(s => ({
        ...s,
        insert: s.insert.replace('np.', '')
      }));
      if (filtered.length > 0) {
        setAutocompleteItems(filtered);
        setAutocompletePos(calcPos());
        setShowAutocomplete(true);
        setSelectedIndex(0);
        return;
      }
    }
    
    // 3. Any variable followed by dot — pandas methods OR columns
    const dotMatch = textBefore.match(/\b([a-zA-Z_]\w*)\.(\w*)$/);
    if (dotMatch && !pdMatch && !npMatch) {
      const varName = dotMatch[1];
      const partial = dotMatch[2].toLowerCase();
      
      let pool = PANDAS_SUGGESTIONS;
      
      // If it's a known DataFrame, add columns to suggestions
      if (dataFrameColumns && dataFrameColumns[varName]) {
          const colSuggestions = dataFrameColumns[varName].map(col => ({
              label: col,
              detail: 'Column',
              insert: col
          }));
          pool = [...colSuggestions, ...PANDAS_SUGGESTIONS];
      }

      const filtered = pool.filter(s => 
        s.label.toLowerCase().includes(partial) // Match anywhere for columns/methods
      );
      
      if (filtered.length > 0) {
        setAutocompleteItems(filtered);
        setAutocompletePos(calcPos());
        setShowAutocomplete(true);
        setSelectedIndex(0);
        return;
      }
    }
    
    // 4. df_ variable name
    const dfMatch = textBefore.match(/\b(df_)(\w*)$/);
    if (dfMatch && availableDataFrames.length > 0) {
      const partial = dfMatch[2].toLowerCase();
      const filtered = availableDataFrames
        .filter(df => df.toLowerCase().includes(partial))
        .map(df => ({ label: df, detail: 'DataFrame', insert: df.substring(dfMatch[2].length) }));
      if (filtered.length > 0) {
        setAutocompleteItems(filtered);
        setAutocompletePos(calcPos());
        setShowAutocomplete(true);
        setSelectedIndex(0);
        return;
      }
    }

    // 4b. Bracket access df_name['
    const bracketMatch = textBefore.match(/\b([a-zA-Z_]\w*)\[['"]([^'"]*)$/);
    if (bracketMatch) {
        const varName = bracketMatch[1];
        const partial = bracketMatch[2].toLowerCase();
        
        if (dataFrameColumns && dataFrameColumns[varName]) {
            const filtered = dataFrameColumns[varName]
                .filter(col => col.toLowerCase().includes(partial))
                .map(col => ({ 
                    label: col, 
                    detail: 'Column', 
                    insert: col 
                }));
            
            if (filtered.length > 0) {
                setAutocompleteItems(filtered);
                setAutocompletePos(calcPos());
                setShowAutocomplete(true);
                setSelectedIndex(0);
                return;
            }
        }
    }
    
    // 5. Python built-in functions (at least 3 chars typed)
    const wordMatch = textBefore.match(/(?:^|[\s(=,\[{:])([a-zA-Z_]\w{2,})$/);
    if (wordMatch && !dotMatch) {
      const partial = wordMatch[1].toLowerCase();
      const filtered = PYTHON_BUILTINS.filter(s =>
        s.label.toLowerCase().startsWith(partial)
      ).map(s => ({
        ...s,
        // Replace the partial typed word
        insert: s.insert
      }));
      if (filtered.length > 0 && filtered.length < 15) { // Don't show if too many matches (user just started typing)
        setAutocompleteItems(filtered);
        setAutocompletePos(calcPos());
        setShowAutocomplete(true);
        setSelectedIndex(0);
        return;
      }
    }
    
    setShowAutocomplete(false);
    setShowAutocomplete(false);
  }, [value, availableDataFrames, dataFrameColumns]);
  
  // Apply autocomplete selection
  const applyAutocomplete = useCallback((item: typeof PANDAS_SUGGESTIONS[0]) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const pos = textarea.selectionStart;
    const textBefore = value.substring(0, pos);
    const textAfter = value.substring(pos);
    
    // Identify prefix to preserve and partial to replace
    const pdMatch = textBefore.match(/\bpd\.(\w*)$/);
    const npMatch = textBefore.match(/\bnp\.(\w*)$/);
    const dotMatch = textBefore.match(/\b([a-zA-Z_]\w*)\.(\w*)$/);
    const dfMatch = textBefore.match(/\b(df_)(\w*)$/);
    const bracketMatch = textBefore.match(/\b([a-zA-Z_]\w*)\[['"]([^'"]*)$/);
    const wordMatch = textBefore.match(/(?:^|[\s(=,\[\{:])([a-zA-Z_]\w{2,})$/);
    
    let newText: string;
    let newPos: number;
    
    if (pdMatch) {
      const prefix = textBefore.substring(0, textBefore.length - pdMatch[1].length);
      newText = prefix + item.insert + textAfter;
      newPos = (prefix + item.insert).length;
    } else if (npMatch) {
      const prefix = textBefore.substring(0, textBefore.length - npMatch[1].length);
      newText = prefix + item.insert + textAfter;
      newPos = (prefix + item.insert).length;
    } else if (dotMatch && !dfMatch) {
      const prefix = textBefore.substring(0, textBefore.length - dotMatch[2].length);
      const insertion = item.insert.startsWith('.') ? item.insert.substring(1) : item.insert;
      newText = prefix + insertion + textAfter;
      newPos = (prefix + insertion).length;
    } else if (dfMatch) {
      const prefix = textBefore;
      newText = prefix + item.insert + textAfter;
      newPos = (prefix + item.insert).length;
    } else if (bracketMatch) {
        // bracketMatch[2] is partial content inside quotes
        const prefix = textBefore.substring(0, textBefore.length - bracketMatch[2].length);
        newText = prefix + item.insert + textAfter;
        newPos = (prefix + item.insert).length;
    } else if (wordMatch) {
      // Replace the typed word with the full function name
      const prefix = textBefore.substring(0, textBefore.length - wordMatch[1].length);
      newText = prefix + item.insert + textAfter;
      newPos = (prefix + item.insert).length;
    } else {
      return;
    }
    
    onChange(newText);
    setShowAutocomplete(false);
    
    requestAnimationFrame(() => {
      if (textarea) {
        textarea.selectionStart = textarea.selectionEnd = newPos;
        textarea.focus();
      }
    });
  }, [value, onChange]);
  
  // Keyboard handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Autocomplete navigation
    if (showAutocomplete) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, autocompleteItems.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        applyAutocomplete(autocompleteItems[selectedIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowAutocomplete(false);
        return;
      }
    }
    
    // Cmd/Ctrl + Enter to run
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
      return;
    }
    
    // Tab to indent
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (e.shiftKey) {
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const line = value.substring(lineStart, end);
        if (line.startsWith('    ')) {
          const newValue = value.substring(0, lineStart) + line.substring(4) + value.substring(end);
          onChange(newValue);
          requestAnimationFrame(() => {
            textarea.selectionStart = Math.max(start - 4, lineStart);
            textarea.selectionEnd = Math.max(end - 4, lineStart);
          });
        }
      } else {
        const newValue = value.substring(0, start) + '    ' + value.substring(end);
        onChange(newValue);
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 4;
        });
      }
      return;
    }
    
    // Auto-indent on Enter
    if (e.key === 'Enter') {
      const textarea = e.currentTarget;
      const pos = textarea.selectionStart;
      const currentLine = value.substring(value.lastIndexOf('\n', pos - 1) + 1, pos);
      const indent = currentLine.match(/^(\s*)/)?.[1] || '';
      
      const trimmed = currentLine.trimEnd();
      const extraIndent = trimmed.endsWith(':') ? '    ' : '';
      
      e.preventDefault();
      const newValue = value.substring(0, pos) + '\n' + indent + extraIndent + value.substring(pos);
      onChange(newValue);
      
      const newPos = pos + 1 + indent.length + extraIndent.length;
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = newPos;
      });
    }
  }, [showAutocomplete, autocompleteItems, selectedIndex, applyAutocomplete, onRun, value, onChange]);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);
  
  // After value changes, check autocomplete and update cursor
  useEffect(() => {
    checkAutocomplete();
    updateCursorLine();
  }, [value, checkAutocomplete, updateCursorLine]);
  
  // Copy file path helper
  const copyPath = useCallback((path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  }, []);
  
  // Line numbers
  const lineNumbers = useMemo(() => {
    return Array.from({ length: lineCount }, (_, i) => (
      <div
        key={i + 1}
        className={`text-xs leading-[1.5] font-mono h-[21px] pr-1 text-right transition-colors ${
          cursorLine === i + 1
            ? 'text-purple-400 bg-purple-500/10 rounded-l'
            : 'text-slate-600'
        }`}
      >
        {i + 1}
      </div>
    ));
  }, [lineCount, cursorLine]);
  
  // Highlighted HTML
  const highlightedHtml = useMemo(() => highlightPython(value), [value]);
  
  // Build file paths list from available DataFrames
  const filePathEntries = useMemo(() => {
    return availableDataFrames
      .map(df => {
        const tableName = df.replace('df_', '');
        const path = filePaths[tableName];
        return path ? { df, path } : null;
      })
      .filter(Boolean) as { df: string; path: string }[];
  }, [availableDataFrames, filePaths]);
  
  return (
    <div ref={containerRef} className="flex-1 flex flex-col min-h-0 relative">
      <div className="flex-1 bg-black/40 rounded-xl border border-white/10 shadow-inner overflow-hidden relative">
        {/* Line Numbers */}
        <div
          ref={lineNumbersRef}
          className="absolute top-0 left-0 w-10 h-full overflow-hidden pt-4 pb-4 select-none z-10 bg-black/20 border-r border-white/5"
        >
          {lineNumbers}
        </div>
        
        {/* Highlight Overlay */}
        <div
          ref={highlightRef}
          className="absolute inset-0 pl-12 pt-4 pb-4 pr-4 overflow-hidden pointer-events-none"
        >
          <pre className="font-mono text-sm text-slate-300 leading-[1.5] whitespace-pre">
            <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
          </pre>
        </div>
        
        {/* Textarea (invisible, on top) */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          onClick={updateCursorLine}
          onSelect={updateCursorLine}
          className="absolute inset-0 pl-12 pt-4 pb-4 pr-4 font-mono text-sm text-transparent caret-white bg-transparent resize-none outline-none z-20 leading-[1.5] whitespace-pre overflow-auto"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          placeholder={placeholder}
        />
        
        {/* Autocomplete Dropdown */}
        {showAutocomplete && autocompleteItems.length > 0 && (
          <div 
            className="absolute z-50 bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl shadow-black/50 overflow-hidden max-h-[200px] overflow-y-auto min-w-[240px]"
            style={{ top: autocompletePos.top, left: Math.min(autocompletePos.left, 400) }}
          >
            {autocompleteItems.map((item, i) => (
              <button
                key={item.label}
                className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between gap-4 transition-colors ${
                  i === selectedIndex 
                    ? 'bg-purple-500/20 text-white' 
                    : 'text-slate-300 hover:bg-white/5'
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyAutocomplete(item);
                }}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <span className="font-mono font-semibold">{item.label}</span>
                <span className="text-slate-500 text-[10px]">{item.detail}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Available DataFrames and File Paths */}
      {availableDataFrames.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-1.5 px-1">
          {/* DataFrames row */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-medium flex-shrink-0">DataFrames:</span>
            <div className="flex gap-1 flex-wrap">
              {availableDataFrames.map(df => (
                <span 
                  key={df} 
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 cursor-pointer hover:bg-purple-500/20 transition-colors"
                  onClick={() => {
                    const textarea = textareaRef.current;
                    if (textarea) {
                      const pos = textarea.selectionStart;
                      const newValue = value.substring(0, pos) + df + value.substring(pos);
                      onChange(newValue);
                      requestAnimationFrame(() => {
                        textarea.selectionStart = textarea.selectionEnd = pos + df.length;
                        textarea.focus();
                      });
                    }
                  }}
                >
                  {df}
                </span>
              ))}
            </div>
          </div>
          
          {/* File paths row */}
          {filePathEntries.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-medium flex-shrink-0">File paths:</span>
              <div className="flex gap-1 flex-wrap">
                {filePathEntries.map(({ df, path }) => (
                  <span
                    key={path}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/20 transition-colors flex items-center gap-1 group"
                    onClick={() => copyPath(path)}
                    title={`Clicca per copiare il path: ${path}`}
                  >
                    {path}
                    {copiedPath === path ? (
                      <Check size={9} className="text-emerald-300" />
                    ) : (
                      <Copy size={9} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PythonEditor;
