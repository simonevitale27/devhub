import { TableSchema, DiffResult, ChartConfig } from '../types';

/**
 * Detect if a SQL query contains aggregation functions
 */
export const detectAggregation = (query: string): boolean => {
  if (!query) return false;
  const normalized = query.toUpperCase();
  const aggregationKeywords = ['COUNT(', 'SUM(', 'AVG(', 'MAX(', 'MIN(', 'GROUP BY'];
  return aggregationKeywords.some(keyword => normalized.includes(keyword));
};

/**
 * Extract the GROUP BY column name from a SQL query
 */
export const extractGroupByColumn = (query: string): string | null => {
  if (!query) return null;
  const regex = /GROUP\s+BY\s+(\w+)/i;
  const match = query.match(regex);
  return match ? match[1] : null;
};

/**
 * Generate Mermaid ER Diagram syntax from table schemas
 */
export const generateMermaidER = (schemas: TableSchema[]): string => {
  let mermaid = 'erDiagram\n';
  
  // Define relationships based on known FK structure
  const relationships = [
    { from: 'utenti', to: 'ordini', label: 'places' },
    { from: 'prodotti', to: 'ordini', label: 'included_in' },
    { from: 'categorie', to: 'prodotti', label: 'contains' },
    { from: 'fornitori', to: 'prodotti', label: 'supplies' },
    { from: 'ordini', to: 'spedizioni', label: 'shipped_via' },
    { from: 'prodotti', to: 'recensioni', label: 'reviewed_in' },
    { from: 'utenti', to: 'recensioni', label: 'writes' }
  ];

  // Add table definitions with columns
  schemas.forEach(schema => {
    mermaid += `    ${schema.tableName} {\n`;
    schema.columns.forEach(col => {
      const isPK = col.name === 'id';
      const isFK = col.name.endsWith('_id');
      let key = '';
      if (isPK) key = ' PK';
      if (isFK) key = ' FK';
      mermaid += `        ${col.type} ${col.name}${key}\n`;
    });
    mermaid += `    }\n`;
  });

  // Add relationships
  relationships.forEach(rel => {
    mermaid += `    ${rel.from} ||--o{ ${rel.to} : "${rel.label}"\n`;
  });

  return mermaid;
};

/**
 * Normalize a single row: convert all values to lowercase trimmed strings for consistent comparison
 * Handles null/undefined, booleans, numbers, and strings uniformly
 */
const normalizeRow = (row: any): any => {
  const normalized: any = {};
  for (const key in row) {
    const value = row[key];
    
    // Handle null/undefined/empty string all as empty
    if (value === null || value === undefined || value === '') {
      normalized[key] = '';
    } 
    // Convert booleans to '0' or '1' for numeric comparison compatibility
    else if (typeof value === 'boolean') {
      normalized[key] = value ? '1' : '0';
    } 
    // Convert numbers to string, handling decimals consistently
    else if (typeof value === 'number') {
      // Round to avoid floating point precision issues
      normalized[key] = Number.isInteger(value) ? String(value) : value.toFixed(2);
    } 
    // Convert strings: trim and lowercase for case-insensitive comparison
    else {
      normalized[key] = String(value).trim().toLowerCase();
    }
  }
  return normalized;
};

/**
 * Sort rows deterministically based on all column values
 * Uses normalized string comparison for stability
 */
const sortRows = (rows: any[]): any[] => {
  if (rows.length === 0) return rows;
  
  return [...rows].sort((a, b) => {
    // Get all keys from both objects and sort them
    const allKeys = Array.from(new Set([...Object.keys(a), ...Object.keys(b)])).sort();
    
    // Compare all columns in sorted order
    for (const key of allKeys) {
      const valA = String(a[key] ?? '').toLowerCase();
      const valB = String(b[key] ?? '').toLowerCase();
      
      if (valA < valB) return -1;
      if (valA > valB) return 1;
    }
    return 0;
  });
};

/**
 * Compare two result sets and return differences
 * Now with improved normalization and order-agnostic comparison
 * 
 * BUG FIX: This function normalizes values (lowercase, trim, type conversion) and sorts 
 * rows deterministically before comparison, making it completely order-agnostic and 
 * type-agnostic. Query results with the same data in different row orders or with 
 * minor type/case differences will match correctly.
 */
export const compareResults = (userRows: any[], expectedRows: any[]): DiffResult => {
  const missingRows: any[] = [];
  const extraRows: any[] = [];
  const differentCells: { rowIndex: number; column: string }[] = [];
  
  // Detect column differences
  let hasExtraColumns = false;
  let extraColumns: string[] = [];
  
  if (userRows.length > 0 && expectedRows.length > 0) {
    const userCols = new Set(Object.keys(userRows[0]));
    const expectedCols = new Set(Object.keys(expectedRows[0]));
    
    // Check if user has extra columns (e.g., SELECT * vs SELECT name, age)
    extraColumns = Array.from(userCols).filter(col => !expectedCols.has(col));
    hasExtraColumns = extraColumns.length > 0;
  }

  // Normalize and sort both result sets for accurate comparison
  const normalizedUser = userRows.map(normalizeRow);
  const normalizedExpected = expectedRows.map(normalizeRow);
  
  const sortedUser = sortRows(normalizedUser);
  const sortedExpected = sortRows(normalizedExpected);

  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development' && sortedUser.length > 0 && sortedExpected.length > 0) {
    console.log('[compareResults] User first row:', sortedUser[0]);
    console.log('[compareResults] Expected first row:', sortedExpected[0]);
  }

  // Find missing rows (in expected but not in user)
  sortedExpected.forEach(expectedRow => {
    // Only compare columns that exist in expected result
    const expectedCols = Object.keys(expectedRow);
    
    const found = sortedUser.some(userRow => {
      // Compare only the expected columns (ignore extra user columns)
      return expectedCols.every(col => {
        const userVal = userRow[col];
        const expectedVal = expectedRow[col];
        return userVal === expectedVal;
      });
    });
    
    if (!found) {
      missingRows.push(expectedRow);
    }
  });

  // Find extra rows (in user but not in expected)
  sortedUser.forEach(userRow => {
    const expectedCols = expectedRows.length > 0 ? Object.keys(expectedRows[0]) : [];
    
    const found = sortedExpected.some(expectedRow => {
      // Compare only the expected columns (ignore extra user columns)
      return expectedCols.every(col => {
        const userVal = userRow[col];
        const expectedVal = expectedRow[col];
        return userVal === expectedVal;
      });
    });
    
    if (!found) {
      extraRows.push(userRow);
    }
  });

  // Note: differentCells not used anymore since we use set-based comparison,
  // but keeping for API compatibility

  return { missingRows, extraRows, differentCells, hasExtraColumns, extraColumns };
};

/**
 * Determine chart configuration based on query and data
 */
export const getChartConfig = (query: string, data: any[]): ChartConfig => {
  // No data or empty result
  if (!data || data.length === 0) {
    return { type: 'none', xKey: '', yKey: '' };
  }

  const columns = Object.keys(data[0]);
  
  // 1. Single Value Result (1 row, 1 column with numeric value) - show as KPI
  if (data.length === 1 && columns.length === 1) {
    const value = data[0][columns[0]];
    // Check if it's a numeric value
    if (typeof value === 'number' || (!isNaN(Number(value)) && value !== '' && value !== null)) {
      return { type: 'kpi', xKey: columns[0], yKey: columns[0] };
    }
  }
  
  // 2. Explicit Aggregation / GROUP BY Logic
  const hasGroupBy = query.toUpperCase().includes('GROUP BY');
  const hasAggregation = detectAggregation(query);

  if (hasGroupBy && columns.length >= 2) {
    // First column is typically the group, second is the aggregate
    const xKey = columns[0];
    const yKey = columns[1];
    
    // Use pie chart for counts with few categories
    if (data.length <= 5 && (query.toUpperCase().includes('COUNT(') || yKey.toLowerCase().includes('count'))) {
      return { type: 'pie', xKey, yKey };
    }
    
    // Default to bar chart for aggregations
    return { type: 'bar', xKey, yKey };
  }

  // 3. Auto-detection for non-aggregated data (e.g. "Product Name", "Price")
  // Look for a string column (X-axis) and a number column (Y-axis)
  if (columns.length >= 2) {
    // Find first string column (candidate for X-axis) - must not be numeric string
    const stringCol = columns.find(col => {
       const val = data[0][col];
       return typeof val === 'string' && isNaN(Number(val));
    });

    // Find first number column (candidate for Y-axis)
    const numberCol = columns.find(col => {
       const val = data[0][col];
       return (typeof val === 'number') || (!isNaN(Number(val)) && val !== '' && val !== null);
    });

    if (stringCol && numberCol) {
       // If we have a string label and a numeric value, we can chart it!
       return { type: 'bar', xKey: stringCol, yKey: numberCol };
    }
  }

  // Fallback for simple 2-column numeric data (e.g. x, y coordinates)
  if (columns.length === 2) {
      const col1 = columns[0];
      const col2 = columns[1];
      const val1 = data[0][col1];
      const val2 = data[0][col2];
      
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
          return { type: 'bar', xKey: col1, yKey: col2 };
      }
  }

  return { type: 'none', xKey: '', yKey: '' };
};

/**
 * Convert array of objects to CSV format
 */
export const convertToCSV = (data: any[]): string => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // Handle null/undefined
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      // Escape quotes and wrap in quotes if contains comma or newline
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
};

/**
 * Download data as CSV file
 * Improved version with better browser compatibility
 */
export const downloadCSV = (data: any[], filename: string = 'query_results.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data to download');
    return;
  }
  
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // For browsers that support the download attribute
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    link.style.position = 'fixed';
    link.style.left = '-9999px';
    
    document.body.appendChild(link);
    
    // Use requestAnimationFrame to ensure the link is in the DOM before clicking
    requestAnimationFrame(() => {
      link.click();
      
      // Clean up after a short delay to ensure download starts
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    });
  } else {
    // Fallback for older browsers
    const url = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.click();
  }
};

