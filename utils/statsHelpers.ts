// Statistics helper functions for query results analysis

export interface NumericStats {
  avg: number;
  min: number;
  max: number;
  sum: number;
}

export interface TextStats {
  distinctCount: number;
}

export interface ColumnStats {
  columnName: string;
  type: 'numeric' | 'text';
  nullCount: number;
  numericStats?: NumericStats;
  textStats?: TextStats;
}

/**
 * Determines if a column contains primarily numeric values
 */
export const isNumericColumn = (data: any[], columnName: string): boolean => {
  if (!data || data.length === 0) return false;

  // Sample non-null values
  const nonNullValues = data
    .map(row => row[columnName])
    .filter(val => val !== null && val !== undefined);

  if (nonNullValues.length === 0) return false;

  // Check if at least 80% of values are numeric
  const numericCount = nonNullValues.filter(val => {
    const num = Number(val);
    return !isNaN(num) && isFinite(num);
  }).length;

  return numericCount / nonNullValues.length >= 0.8;
};

/**
 * Calculates numeric statistics for a column
 */
export const calculateNumericStats = (
  data: any[],
  columnName: string
): NumericStats => {
  const values = data
    .map(row => Number(row[columnName]))
    .filter(val => !isNaN(val) && isFinite(val));

  if (values.length === 0) {
    return { avg: 0, min: 0, max: 0, sum: 0 };
  }

  const sum = values.reduce((acc, val) => acc + val, 0);
  const avg = sum / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);

  return {
    avg: Math.round(avg * 100) / 100, // Round to 2 decimals
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100,
    sum: Math.round(sum * 100) / 100,
  };
};

/**
 * Calculates text statistics for a column
 */
export const calculateTextStats = (
  data: any[],
  columnName: string
): TextStats => {
  const values = data
    .map(row => row[columnName])
    .filter(val => val !== null && val !== undefined);

  const distinctValues = new Set(values);

  return {
    distinctCount: distinctValues.size,
  };
};

/**
 * Counts NULL values in a column
 */
export const countNulls = (data: any[], columnName: string): number => {
  return data.filter(
    row => row[columnName] === null || row[columnName] === undefined
  ).length;
};

/**
 * Analyzes all columns in the result set and generates statistics
 */
export const analyzeResultStats = (data: any[]): ColumnStats[] => {
  if (!data || data.length < 2) return [];

  const firstRow = data[0];
  const columnNames = Object.keys(firstRow);

  return columnNames.map(columnName => {
    const nullCount = countNulls(data, columnName);
    const isNumeric = isNumericColumn(data, columnName);

    const stats: ColumnStats = {
      columnName,
      type: isNumeric ? 'numeric' : 'text',
      nullCount,
    };

    if (isNumeric) {
      stats.numericStats = calculateNumericStats(data, columnName);
    } else {
      stats.textStats = calculateTextStats(data, columnName);
    }

    return stats;
  });
};
