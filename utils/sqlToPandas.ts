/**
 * Omni-Translator: Advanced SQL to Pandas Converter
 * Converts complex SQL queries to equivalent Pandas code
 */

export interface TranslationResult {
  code: string;
  imports: string[];
  error?: string;
}

/**
 * Main translation function
 */
export function sqlToPandas(sql: string): TranslationResult {
  try {
    const imports = new Set<string>(['import pandas as pd']);
    let code = '';
    
    const sqlUpper = sql.trim().toUpperCase();
    const sqlOriginal = sql.trim();
    
    // Extract main components
    const selectMatch = extractSelect(sqlOriginal);
    const fromMatch = extractFrom(sqlOriginal);
    const joinMatch = extractJoins(sqlOriginal);
    const whereMatch = extractWhere(sqlOriginal);
    const groupByMatch = extractGroupBy(sqlOriginal);
    const orderByMatch = extractOrderBy(sqlOriginal);
    const limitMatch = extractLimit(sqlOriginal);
    
    if (!fromMatch) {
      return { code: '# Unable to parse FROM clause', imports: [] };
    }
    
    // Start with base dataframe
    const tableName = fromMatch.table;
    code += `# Load data\n`;
    code += `df = ${tableName}\n\n`;
    
    // Handle JOINs
    if (joinMatch && joinMatch.length > 0) {
      imports.add('import pandas as pd');
      
      joinMatch.forEach((join, idx) => {
        const joinType = join.type.toLowerCase();
        const howMap: Record<string, string> = {
          'inner': 'inner',
          'left': 'left',
          'right': 'right',
          'outer': 'outer',
          'full': 'outer'
        };
        
        const how = howMap[joinType] || 'inner';
        
        code += `# ${join.type} JOIN\n`;
        code += `df = pd.merge(df, ${join.table}, `;
        
        if (join.on) {
          const onParts = parseJoinCondition(join.on);
          if (onParts) {
            code += `left_on='${onParts.left}', right_on='${onParts.right}', `;
          }
        }
        
        code += `how='${how}')\n`;
      });
      
      code += '\n';
    }
    
    // Handle WHERE clause (filtering)
    if (whereMatch) {
      code += `# Apply filters\n`;
      const filterCode = translateWhereClause(whereMatch, imports);
      code += `df = df[${filterCode}]\n\n`;
    }
    
    // Handle GROUP BY and aggregations
    if (groupByMatch) {
      code += `# Group by and aggregate\n`;
      const groupCode = translateGroupBy(selectMatch, groupByMatch);
      code += groupCode + '\n\n';
    } else if (selectMatch && selectMatch !== '*') {
      // Handle SELECT (column selection and transformations)
      const selectCode = translateSelect(selectMatch, imports);
      if (selectCode) {
        code += `# Select and transform columns\n`;
        code += selectCode + '\n\n';
      }
    }
    
    // Handle ORDER BY
    if (orderByMatch) {
      code += `# Sort data\n`;
      const sortCode = translateOrderBy(orderByMatch);
      code += sortCode + '\n\n';
    }
    
    // Handle LIMIT and OFFSET
    if (limitMatch) {
      code += `# Limit results\n`;
      code += translateLimit(limitMatch) + '\n\n';
    }
    
    // Final result
    code += `# Result\n`;
    code += `result = df\n`;
    
    return {
      code: code.trim(),
      imports: Array.from(imports)
    };
    
  } catch (error) {
    return {
      code: `# Translation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      imports: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Extract SELECT clause
 */
function extractSelect(sql: string): string | null {
  const match = sql.match(/SELECT\s+(.*?)\s+FROM/is);
  return match ? match[1].trim() : null;
}

/**
 * Extract FROM clause
 */
function extractFrom(sql: string): { table: string } | null {
  const match = sql.match(/FROM\s+(\w+)/i);
  return match ? { table: match[1] } : null;
}

/**
 * Extract JOIN clauses
 */
function extractJoins(sql: string): Array<{ type: string; table: string; on: string }> | null {
  const joinRegex = /(INNER|LEFT|RIGHT|OUTER|FULL)?\s*JOIN\s+(\w+)\s+ON\s+(.*?)(?=\s+(?:INNER|LEFT|RIGHT|OUTER|FULL)?\s*JOIN|\s+WHERE|\s+GROUP|\s+ORDER|\s+LIMIT|$)/gis;
  const joins: Array<{ type: string; table: string; on: string }> = [];
  
  let match;
  while ((match = joinRegex.exec(sql)) !== null) {
    joins.push({
      type: (match[1] || 'INNER').trim(),
      table: match[2].trim(),
      on: match[3].trim()
    });
  }
  
  return joins.length > 0 ? joins : null;
}

/**
 * Parse JOIN condition
 */
function parseJoinCondition(condition: string): { left: string; right: string } | null {
  const match = condition.match(/(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)/i);
  if (match) {
    return {
      left: match[2],
      right: match[4]
    };
  }
  return null;
}

/**
 * Extract WHERE clause
 */
function extractWhere(sql: string): string | null {
  const match = sql.match(/WHERE\s+(.*?)(?=\s+GROUP|\s+ORDER|\s+LIMIT|$)/is);
  return match ? match[1].trim() : null;
}

/**
 * Extract GROUP BY clause
 */
function extractGroupBy(sql: string): string | null {
  const match = sql.match(/GROUP\s+BY\s+(.*?)(?=\s+ORDER|\s+LIMIT|$)/is);
  return match ? match[1].trim() : null;
}

/**
 * Extract ORDER BY clause
 */
function extractOrderBy(sql: string): Array<{ column: string; direction: string }> | null {
  const match = sql.match(/ORDER\s+BY\s+(.*?)(?=\s+LIMIT|$)/is);
  if (!match) return null;
  
  const orderParts = match[1].split(',').map(part => {
    const trimmed = part.trim();
    const direction = /DESC$/i.test(trimmed) ? 'desc' : 'asc';
    const column = trimmed.replace(/\s+(ASC|DESC)$/i, '').trim();
    return { column, direction };
  });
  
  return orderParts;
}

/**
 * Extract LIMIT and OFFSET
 */
function extractLimit(sql: string): { limit: number; offset: number } | null {
  const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
  const offsetMatch = sql.match(/OFFSET\s+(\d+)/i);
  
  if (!limitMatch) return null;
  
  return {
    limit: parseInt(limitMatch[1]),
    offset: offsetMatch ? parseInt(offsetMatch[1]) : 0
  };
}

/**
 * Translate WHERE clause to Pandas filter
 */
function translateWhereClause(where: string, imports: Set<string>): string {
  let condition = where;
  
  // Replace IS NULL
  condition = condition.replace(/(\w+)\s+IS\s+NULL/gi, (_, col) => {
    return `df['${col}'].isna()`;
  });
  
  // Replace IS NOT NULL
  condition = condition.replace(/(\w+)\s+IS\s+NOT\s+NULL/gi, (_, col) => {
    return `df['${col}'].notna()`;
  });
  
  // Replace LIKE
  condition = condition.replace(/(\w+)\s+LIKE\s+'%(.+?)%'/gi, (_, col, pattern) => {
    return `df['${col}'].str.contains('${pattern}', na=False)`;
  });
  
  condition = condition.replace(/(\w+)\s+LIKE\s+'(.+?)%'/gi, (_, col, pattern) => {
    return `df['${col}'].str.startswith('${pattern}', na=False)`;
  });
  
  condition = condition.replace(/(\w+)\s+LIKE\s+'%(.+?)'/gi, (_, col, pattern) => {
    return `df['${col}'].str.endswith('${pattern}', na=False)`;
  });
  
  // Replace IN
  condition = condition.replace(/(\w+)\s+IN\s*\((.*?)\)/gi, (_, col, values) => {
    return `df['${col}'].isin([${values}])`;
  });
  
  // Replace BETWEEN
  condition = condition.replace(/(\w+)\s+BETWEEN\s+(\S+)\s+AND\s+(\S+)/gi, (_, col, min, max) => {
    return `df['${col}'].between(${min}, ${max})`;
  });
  
  // Replace comparison operators with column references
  condition = condition.replace(/(\w+)\s*(=|!=|<>|>|<|>=|<=)\s*(\S+)/gi, (match, col, op, val) => {
    // Skip if already processed (contains df[)
    if (match.includes('df[')) return match;
    
    const pandasOp = op === '=' ? '==' : op === '<>' ? '!=' : op;
    return `(df['${col}'] ${pandasOp} ${val})`;
  });
  
  // Replace AND/OR
  condition = condition.replace(/\s+AND\s+/gi, ' & ');
  condition = condition.replace(/\s+OR\s+/gi, ' | ');
  
  return condition;
}

/**
 * Translate SELECT clause
 */
function translateSelect(select: string, imports: Set<string>): string | null {
  if (select === '*') return null;
  
  let code = '';
  
  // Check for DISTINCT
  if (/^DISTINCT\s+/i.test(select)) {
    const col = select.replace(/^DISTINCT\s+/i, '').trim();
    code += `df = df['${col}'].drop_duplicates()\n`;
    return code;
  }
  
  // Check for CASE WHEN
  if (/CASE\s+WHEN/i.test(select)) {
    imports.add('import numpy as np');
    return translateCaseWhen(select);
  }
  
  // Check for functions
  if (/UPPER\(|LOWER\(|TRIM\(/i.test(select)) {
    return translateStringFunctions(select);
  }
  
  // Check for COALESCE
  if (/COALESCE\(/i.test(select)) {
    return translateCoalesce(select);
  }
  
  // Simple column selection
  const columns = select.split(',').map(c => c.trim());
  const colList = columns.map(c => `'${c}'`).join(', ');
  code += `df = df[[${colList}]]\n`;
  
  return code;
}

/**
 * Translate CASE WHEN to np.select
 */
function translateCaseWhen(caseExpr: string): string {
  const conditions: string[] = [];
  const values: string[] = [];
  let defaultValue = 'None';
  
  // Extract WHEN conditions
  const whenRegex = /WHEN\s+(.*?)\s+THEN\s+(.*?)(?=\s+WHEN|\s+ELSE|\s+END)/gis;
  let match;
  
  while ((match = whenRegex.exec(caseExpr)) !== null) {
    conditions.push(match[1].trim());
    values.push(match[2].trim());
  }
  
  // Extract ELSE
  const elseMatch = caseExpr.match(/ELSE\s+(.*?)\s+END/is);
  if (elseMatch) {
    defaultValue = elseMatch[1].trim();
  }
  
  let code = '# Case when logic\n';
  code += `conditions = [${conditions.map(c => `(df['${c}'])`).join(', ')}]\n`;
  code += `values = [${values.join(', ')}]\n`;
  code += `df['result'] = np.select(conditions, values, default=${defaultValue})\n`;
  
  return code;
}

/**
 * Translate string functions
 */
function translateStringFunctions(expr: string): string {
  let code = '';
  
  if (/UPPER\((\w+)\)/i.test(expr)) {
    const col = expr.match(/UPPER\((\w+)\)/i)?.[1];
    code += `df['${col}'] = df['${col}'].str.upper()\n`;
  }
  
  if (/LOWER\((\w+)\)/i.test(expr)) {
    const col = expr.match(/LOWER\((\w+)\)/i)?.[1];
    code += `df['${col}'] = df['${col}'].str.lower()\n`;
  }
  
  return code;
}

/**
 * Translate COALESCE
 */
function translateCoalesce(expr: string): string {
  const match = expr.match(/COALESCE\((\w+),\s*(.+?)\)/i);
  if (!match) return '';
  
  const col = match[1];
  const defaultVal = match[2];
  
  return `df['${col}'] = df['${col}'].fillna(${defaultVal})\n`;
}

/**
 * Translate GROUP BY
 */
function translateGroupBy(select: string | null, groupBy: string): string {
  if (!select) return '';
  
  const groupCols = groupBy.split(',').map(c => c.trim());
  let code = `df = df.groupby([${groupCols.map(c => `'${c}'`).join(', ')}])`;
  
  // Extract aggregation functions from SELECT
  const aggMatch = select.match(/(COUNT|SUM|AVG|MIN|MAX)\s*\(\s*(\*|\w+)\s*\)/i);
  if (aggMatch) {
    const func = aggMatch[1].toLowerCase();
    const col = aggMatch[2] === '*' ? '' : aggMatch[2];
    
    if (func === 'count') {
      code += `.size().reset_index(name='count')`;
    } else if (col) {
      code += `.agg({'${col}': '${func}'}).reset_index()`;
    }
  } else {
    code += `.first().reset_index()`;
  }
  
  code += '\n';
  return code;
}

/**
 * Translate ORDER BY
 */
function translateOrderBy(orderBy: Array<{ column: string; direction: string }>): string {
  const cols = orderBy.map(o => `'${o.column}'`).join(', ');
  const ascending = orderBy.map(o => o.direction === 'asc').join(', ');
  
  return `df = df.sort_values([${cols}], ascending=[${ascending}])\n`;
}

/**
 * Translate LIMIT/OFFSET
 */
function translateLimit(limit: { limit: number; offset: number }): string {
  const start = limit.offset;
  const end = limit.offset + limit.limit;
  
  return `df = df.iloc[${start}:${end}]\n`;
}
