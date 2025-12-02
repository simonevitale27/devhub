/**
 * Format SQL query with proper indentation, spacing, and uppercase keywords
 */
export function formatSQL(sql: string): string {
    if (!sql || !sql.trim()) return sql;

    let formatted = sql.trim();
    
    // Normalize whitespace
    formatted = formatted.replace(/\s+/g, ' ');
    
    // List of SQL keywords to uppercase
    const keywords = [
        'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 
        'FULL', 'CROSS', 'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN',
        'LIKE', 'IS', 'NULL', 'AS', 'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 
        'DESC', 'LIMIT', 'OFFSET', 'UNION', 'INTERSECT', 'EXCEPT', 'DISTINCT',
        'ALL', 'ANY', 'SOME', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'INTO',
        'VALUES', 'INSERT', 'UPDATE', 'DELETE', 'SET', 'CREATE', 'TABLE',
        'DROP', 'ALTER', 'ADD', 'COLUMN', 'PRIMARY', 'KEY', 'FOREIGN',
        'REFERENCES', 'INDEX', 'VIEW', 'WITH', 'RECURSIVE'
    ];
    
    // Uppercase all keywords while preserving identifiers
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, keyword.toUpperCase());
    });
    
    // Add line breaks before major keywords
    const lineBreakKeywords = [
        'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 
        'RIGHT JOIN', 'OUTER JOIN', 'ON', 'GROUP BY', 'HAVING', 
        'ORDER BY', 'LIMIT', 'OFFSET', 'UNION', 'INTERSECT', 'EXCEPT'
    ];
    
    lineBreakKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, `\n${keyword.toUpperCase()}`);
    });
    
    // Special handling for AND/OR in WHERE clauses
    formatted = formatted.replace(/\s+(AND|OR)\s+/gi, '\n  $1 ');
    
    // Clean up leading/trailing whitespace on each line
    const lines = formatted.split('\n').map(line => line.trim()).filter(line => line);
    
    // Add proper indentation
    const indented = lines.map((line, index) => {
        const upper = line.toUpperCase();
        
        // No indent for SELECT, FROM, major clauses
        if (upper.startsWith('SELECT') || 
            upper.startsWith('FROM') || 
            upper.startsWith('WHERE') ||
            upper.startsWith('GROUP BY') ||
            upper.startsWith('HAVING') ||
            upper.startsWith('ORDER BY') ||
            upper.startsWith('LIMIT') ||
            upper.startsWith('OFFSET') ||
            upper.startsWith('UNION') ||
            upper.startsWith('INTERSECT') ||
            upper.startsWith('EXCEPT')) {
            return line;
        }
        
        // Indent JOIN clauses and ON conditions
        if (upper.includes('JOIN') || upper.startsWith('ON')) {
            return '  ' + line;
        }
        
        // Indent AND/OR conditions
        if (upper.startsWith('AND') || upper.startsWith('OR')) {
            return '  ' + line;
        }
        
        // Indent everything else slightly
        return '  ' + line;
    });
    
    return indented.join('\n');
}

/**
 * Copy text to clipboard with error handling
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        return false;
    }
}
