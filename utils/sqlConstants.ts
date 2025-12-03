
// SQL Keywords (colored green in editor)
export const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER',
  'FULL', 'CROSS', 'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN',
  'LIKE', 'IS', 'NULL', 'AS', 'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC',
  'DESC', 'LIMIT', 'OFFSET', 'UNION', 'INTERSECT', 'EXCEPT', 'DISTINCT',
  'ALL', 'ANY', 'SOME', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'INTO',
  'VALUES', 'INSERT', 'UPDATE', 'DELETE', 'SET', 'CREATE', 'TABLE',
  'DROP', 'ALTER', 'ADD', 'COLUMN', 'PRIMARY', 'KEY', 'FOREIGN',
  'REFERENCES', 'INDEX', 'VIEW', 'WITH', 'RECURSIVE', 'TRUE', 'FALSE',
  'TOP', 'FETCH', 'NEXT', 'ONLY', 'FIRST', 'LAST', 'TRUNCATE', 'NULLS'
];

// SQL Functions (colored yellow in editor)
export const SQL_FUNCTIONS = [
  // Date/Time Functions
  'MONTH', 'YEAR', 'DAY', 'HOUR', 'MINUTE', 'SECOND', 'DATE', 'TIME',
  'NOW', 'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP',
  'DATEADD', 'DATEDIFF', 'DATEPART', 'EXTRACT', 'TIMESTAMP', 'GETDATE', 'SYSDATETIME',
  'DAYOFWEEK', 'DAYOFYEAR', 'WEEK', 'QUARTER', 'TO_DATE', 'STR_TO_DATE', 'DATE_FORMAT',
  
  // Aggregate Functions
  'SUM', 'AVG', 'COUNT', 'MAX', 'MIN', 'STDDEV', 'VARIANCE',
  'STDDEV_POP', 'STDDEV_SAMP', 'VAR_POP', 'VAR_SAMP', 'GROUP_CONCAT', 'STRING_AGG',
  
  // String Functions
  'CONCAT', 'SUBSTRING', 'UPPER', 'LOWER', 'TRIM', 'LTRIM', 'RTRIM',
  'LENGTH', 'LEN', 'REPLACE', 'CHARINDEX', 'LEFT', 'RIGHT', 'REVERSE',
  'STUFF', 'REPLICATE', 'SPACE', 'CHAR', 'ASCII', 'UNICODE', 'INITCAP',
  'LPAD', 'RPAD', 'TRANSLATE', 'INSTR', 'POSITION',
  
  // Mathematical Functions
  'ROUND', 'FLOOR', 'CEIL', 'CEILING', 'ABS', 'POWER', 'SQRT', 'MOD',
  'EXP', 'LOG', 'LOG10', 'SIGN', 'PI', 'RAND', 'SIN', 'COS', 'TAN',
  'ACOS', 'ASIN', 'ATAN', 'ATAN2', 'DEGREES', 'RADIANS', 'TRUNC',
  
  // Window Functions
  'ROW_NUMBER', 'RANK', 'DENSE_RANK', 'NTILE', 'LAG', 'LEAD',
  'FIRST_VALUE', 'LAST_VALUE', 'OVER', 'PARTITION', 'RANGE', 'ROWS',
  'UNBOUNDED', 'PRECEDING', 'FOLLOWING', 'CURRENT', 'CUME_DIST', 'PERCENT_RANK',
  
  // Conditional & System Functions
  'COALESCE', 'NULLIF', 'IIF', 'CAST', 'CONVERT', 'ISNULL', 'IFNULL', 'NEWID',
  'USER', 'DATABASE', 'VERSION', 'SESSION_USER', 'SYSTEM_USER'
];
