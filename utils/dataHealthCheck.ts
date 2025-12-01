// Data Health Check Engine
// Analizza la qualità dei dati CSV con validazioni intelligenti

export interface ColumnIssue {
    columnName: string;
    issueType: 'format_error' | 'null_values' | 'duplicates';
    severity: 'high' | 'medium' | 'low';
    count: number;
    percentage: number;
    examples: string[];
    description: string;
}

export interface DataHealthReport {
    healthScore: number;
    totalRows: number;
    analyzedRows: number;
    totalColumns: number;
    totalCells: number;
    issues: ColumnIssue[];
    duplicateRowCount: number;
    wasSampled: boolean;
}

// Regex patterns for validation
const PATTERNS = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    dateISO: /^\d{4}-\d{2}-\d{2}$/,
    dateSlash: /^\d{1,2}\/\d{1,2}\/\d{4}$/,
    url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i
};

// Column name patterns to detect data types
const COLUMN_PATTERNS = {
    email: ['mail', 'email', 'e-mail'],
    phone: ['phone', 'tel', 'cell', 'telefon', 'cellulare'],
    date: ['date', 'data', 'birth', 'nascita', 'created', 'updated', 'when'],
    currency: ['price', 'cost', 'amount', 'prezzo', 'costo', 'totale', 'total', 'salary', 'stipendio'],
    url: ['url', 'site', 'link', 'website', 'web', 'sito']
};

// Maximum rows to analyze (performance limit)
const MAX_SAMPLE_SIZE = 10000;

// Maximum examples to store per issue
const MAX_EXAMPLES = 5;

/**
 * Detect column type based on column name
 */
function detectColumnType(columnName: string): string | null {
    const lowerName = columnName.toLowerCase();
    
    for (const [type, patterns] of Object.entries(COLUMN_PATTERNS)) {
        if (patterns.some(pattern => lowerName.includes(pattern))) {
            return type;
        }
    }
    
    return null;
}

/**
 * Validate email format
 */
function validateEmail(value: string): boolean {
    return PATTERNS.email.test(value);
}

/**
 * Validate phone number
 */
function validatePhone(value: string): boolean {
    // Remove common formatting characters for checking
    const cleaned = value.replace(/[\s\-\(\)\.]/g, '');
    
    // Must be at least 7 digits
    if (cleaned.length < 7) return false;
    
    // Must contain only digits and optional leading +
    if (!/^[\+]?\d+$/.test(cleaned)) return false;
    
    return PATTERNS.phone.test(value);
}

/**
 * Validate date format and check if date is valid
 */
function validateDate(value: string): boolean {
    // Try ISO format (YYYY-MM-DD)
    if (PATTERNS.dateISO.test(value)) {
        const [year, month, day] = value.split('-').map(Number);
        return isValidDate(year, month, day);
    }
    
    // Try slash format (DD/MM/YYYY or MM/DD/YYYY)
    if (PATTERNS.dateSlash.test(value)) {
        const parts = value.split('/').map(Number);
        
        // Try DD/MM/YYYY (European)
        if (isValidDate(parts[2], parts[1], parts[0])) return true;
        
        // Try MM/DD/YYYY (US)
        if (isValidDate(parts[2], parts[0], parts[1])) return true;
        
        return false;
    }
    
    return false;
}

/**
 * Check if date components form a valid date
 */
function isValidDate(year: number, month: number, day: number): boolean {
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > 2100) return false;
    
    // Check days in month
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // Leap year check
    if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
        return day <= 29;
    }
    
    return day <= daysInMonth[month - 1];
}

/**
 * Validate currency/number value
 */
function validateCurrency(value: string): boolean {
    const num = Number(value);
    
    // Must be a valid number
    if (isNaN(num)) return false;
    
    // Should not be negative (business rule)
    if (num < 0) return false;
    
    return true;
}

/**
 * Validate URL format
 */
function validateUrl(value: string): boolean {
    return PATTERNS.url.test(value);
}

/**
 * Check if value is null or empty
 */
function isNullOrEmpty(value: any): boolean {
    return value === null || 
           value === undefined || 
           (typeof value === 'string' && value.trim() === '');
}

/**
 * Analyze a single column for issues
 */
function analyzeColumn(
    data: any[],
    columnName: string,
    columnType: string | null
): ColumnIssue[] {
    const issues: ColumnIssue[] = [];
    const invalidValues: string[] = [];
    const nullValues: string[] = [];
    
    let formatErrorCount = 0;
    let nullCount = 0;
    
    for (const row of data) {
        const value = row[columnName];
        
        // Check for null/empty
        if (isNullOrEmpty(value)) {
            nullCount++;
            if (nullValues.length < MAX_EXAMPLES) {
                nullValues.push('(vuoto)');
            }
            continue;
        }
        
        const strValue = String(value).trim();
        
        // Type-specific validation
        let isValid = true;
        
        if (columnType === 'email') {
            isValid = validateEmail(strValue);
        } else if (columnType === 'phone') {
            isValid = validatePhone(strValue);
        } else if (columnType === 'date') {
            isValid = validateDate(strValue);
        } else if (columnType === 'currency') {
            isValid = validateCurrency(strValue);
        } else if (columnType === 'url') {
            isValid = validateUrl(strValue);
        }
        
        // Collect invalid values
        if (!isValid && columnType !== null) {
            formatErrorCount++;
            if (invalidValues.length < MAX_EXAMPLES) {
                invalidValues.push(strValue);
            }
        }
    }
    
    const totalRows = data.length;
    
    // Create issue for format errors
    if (formatErrorCount > 0) {
        issues.push({
            columnName,
            issueType: 'format_error',
            severity: formatErrorCount / totalRows > 0.1 ? 'high' : 'medium',
            count: formatErrorCount,
            percentage: (formatErrorCount / totalRows) * 100,
            examples: invalidValues,
            description: `${formatErrorCount} valori con formato ${columnType} non valido`
        });
    }
    
    // Create issue for null values
    if (nullCount > 0) {
        issues.push({
            columnName,
            issueType: 'null_values',
            severity: nullCount / totalRows > 0.2 ? 'high' : 'low',
            count: nullCount,
            percentage: (nullCount / totalRows) * 100,
            examples: nullValues.slice(0, 1), // Just one example for nulls
            description: `${nullCount} valori nulli o vuoti (${((nullCount / totalRows) * 100).toFixed(1)}%)`
        });
    }
    
    return issues;
}

/**
 * Find duplicate rows
 */
function findDuplicates(data: any[]): number {
    const seen = new Set<string>();
    let duplicateCount = 0;
    
    for (const row of data) {
        // Create a hash of the row
        const rowHash = JSON.stringify(row);
        
        if (seen.has(rowHash)) {
            duplicateCount++;
        } else {
            seen.add(rowHash);
        }
    }
    
    return duplicateCount;
}

/**
 * Calculate health score based on issues
 */
function calculateHealthScore(
    issues: ColumnIssue[],
    duplicateCount: number,
    totalRows: number
): number {
    let score = 100;
    
    // Deduct for null values
    for (const issue of issues) {
        if (issue.issueType === 'null_values') {
            score -= issue.percentage; // -1 point per 1% nulls
        }
    }
    
    // Deduct for format errors
    for (const issue of issues) {
        if (issue.issueType === 'format_error') {
            score -= issue.count * 2; // -2 points per format error
        }
    }
    
    // Deduct for duplicates
    score -= duplicateCount * 5; // -5 points per duplicate row
    
    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Main analysis function
 */
export function analyzeTableHealth(
    data: any[],
    headers: string[]
): DataHealthReport {
    if (!data || data.length === 0) {
        return {
            healthScore: 0,
            totalRows: 0,
            analyzedRows: 0,
            totalColumns: headers.length,
            totalCells: 0,
            issues: [],
            duplicateRowCount: 0,
            wasSampled: false
        };
    }
    
    const totalRows = data.length;
    const wasSampled = totalRows > MAX_SAMPLE_SIZE;
    const sampleData = wasSampled ? data.slice(0, MAX_SAMPLE_SIZE) : data;
    const analyzedRows = sampleData.length;
    const totalColumns = headers.length;
    const totalCells = analyzedRows * totalColumns;
    
    const allIssues: ColumnIssue[] = [];
    
    // Analyze each column
    for (const header of headers) {
        const columnType = detectColumnType(header);
        const columnIssues = analyzeColumn(sampleData, header, columnType);
        allIssues.push(...columnIssues);
    }
    
    // Find duplicates
    const duplicateCount = findDuplicates(sampleData);
    
    // Add duplicates issue if any
    if (duplicateCount > 0) {
        allIssues.push({
            columnName: 'Tabella Generale',
            issueType: 'duplicates',
            severity: duplicateCount > 10 ? 'high' : 'medium',
            count: duplicateCount,
            percentage: (duplicateCount / analyzedRows) * 100,
            examples: [],
            description: `${duplicateCount} righe duplicate rilevate`
        });
    }
    
    // Calculate health score
    const healthScore = calculateHealthScore(allIssues, duplicateCount, analyzedRows);
    
    return {
        healthScore,
        totalRows,
        analyzedRows,
        totalColumns,
        totalCells,
        issues: allIssues,
        duplicateRowCount: duplicateCount,
        wasSampled
    };
}
