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
 * Compare two result sets and return differences
 */
export const compareResults = (userRows: any[], expectedRows: any[]): DiffResult => {
  const missingRows: any[] = [];
  const extraRows: any[] = [];
  const differentCells: { rowIndex: number; column: string }[] = [];

  // Find missing rows (in expected but not in user)
  expectedRows.forEach(expectedRow => {
    const found = userRows.some(userRow => 
      JSON.stringify(userRow) === JSON.stringify(expectedRow)
    );
    if (!found) {
      missingRows.push(expectedRow);
    }
  });

  // Find extra rows (in user but not in expected)
  userRows.forEach(userRow => {
    const found = expectedRows.some(expectedRow => 
      JSON.stringify(userRow) === JSON.stringify(expectedRow)
    );
    if (!found) {
      extraRows.push(userRow);
    }
  });

  // Find different cells at matching indices
  const minLength = Math.min(userRows.length, expectedRows.length);
  for (let i = 0; i < minLength; i++) {
    const userRow = userRows[i];
    const expectedRow = expectedRows[i];
    
    if (JSON.stringify(userRow) !== JSON.stringify(expectedRow)) {
      // Find which columns are different
      const columns = Object.keys(expectedRow);
      columns.forEach(col => {
        if (userRow[col] !== expectedRow[col]) {
          differentCells.push({ rowIndex: i, column: col });
        }
      });
    }
  }

  return { missingRows, extraRows, differentCells };
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
  const hasAggregation = detectAggregation(query);
  
  // No aggregation detected
  if (!hasAggregation) {
    return { type: 'none', xKey: '', yKey: '' };
  }

  // Single Value Result (1 row, 1 column with numeric value) - show as KPI
  if (data.length === 1 && columns.length === 1) {
    const value = data[0][columns[0]];
    // Check if it's a numeric value
    if (typeof value === 'number' || !isNaN(Number(value))) {
      return { type: 'kpi', xKey: columns[0], yKey: columns[0] };
    }
  }
  
  // Look for common patterns with GROUP BY
  const hasGroupBy = query.toUpperCase().includes('GROUP BY');
  
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

  // Fallback: check if we have multiple rows with aggregation (might be GROUP BY without explicit keyword)
  if (data.length > 1 && columns.length >= 2) {
    return { type: 'bar', xKey: columns[0], yKey: columns[1] };
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
 */
export const downloadCSV = (data: any[], filename: string = 'query_results.csv') => {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
