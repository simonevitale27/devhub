import Papa from 'papaparse';
import alasql from 'alasql';
import * as XLSX from 'xlsx';
import { CsvData } from '../types';

/**
 * Parse a CSV file and return structured data
 * @param file - The CSV file to parse
 * @returns Promise with CsvData
 */
export async function parseCsvFile(file: File): Promise<CsvData> {
    return new Promise((resolve, reject) => {
        // Validate file size (max 250MB)
        const maxSize = 250 * 1024 * 1024;
        if (file.size > maxSize) {
            reject(new Error('Il file è troppo grande. Dimensione massima supportata: 250MB'));
            return;
        }

        // Validate file type
        if (!file.name.toLowerCase().endsWith('.csv')) {
            reject(new Error('Formato file non valido. Usa un file CSV. Per altri formati usa parseFile().'));
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: 'greedy', // Skip empty lines and whitespace-only lines
            dynamicTyping: true, // Auto-convert numbers
            transformHeader: (header, index) => {
                const trimmed = header.trim();
                // If header is empty, assign a default name
                return trimmed || `col_${index + 1}`;
            },
            complete: (results) => {
                const headers = results.meta.fields || [];
                
                if (headers.length === 0) {
                    reject(new Error('Il file CSV non contiene intestazioni valide.'));
                    return;
                }
                
                // Map rows and fill missing values with null
                // Only skip rows that are COMPLETELY empty (all values are null/undefined/empty)
                const rows = results.data
                    .map((row: any) => 
                        headers.map(header => {
                            // Ensure the key exists in the row object, even if value is undefined
                            const value = row.hasOwnProperty(header) ? row[header] : null;
                            
                            // Explicitly convert undefined, null, and empty strings to null
                            if (value === undefined || value === null || value === '') {
                                return null;
                            }
                            
                            // For string "null", "undefined", "NULL" etc, also convert to null
                            if (typeof value === 'string') {
                                const strValue = value.toLowerCase().trim();
                                if (strValue === 'null' || strValue === 'undefined' || strValue === 'n/a') {
                                    return null;
                                }
                            }
                            
                            // Return the actual value (PapaParse dynamicTyping already converts numbers)
                            return value;
                        })
                    )
                    .filter(row => {
                        // Keep row if at least ONE value is not null
                        return row.some(value => value !== null);
                    });

                if (rows.length === 0) {
                    // Show different error if we have headers but no valid data
                    if (results.data.length > 0) {
                        reject(new Error('Il file CSV contiene solo righe vuote. Verifica che ci siano dati dopo le intestazioni.'));
                    } else {
                        reject(new Error('Il file CSV non contiene dati. Il file potrebbe avere solo intestazioni senza righe di dati.'));
                    }
                    return;
                }

                const csvData: CsvData = {
                    tableName: 'my_data',
                    fileName: file.name,
                    headers,
                    rows,
                    rowCount: rows.length
                };


                resolve(csvData);
            },
            error: (error) => {
                reject(new Error(`Errore nella lettura del file: ${error.message}`));
            }
        });
    });
}

/**
 * Parse a JSON file (array of objects) and return structured data
 */
export async function parseJsonFile(file: File): Promise<CsvData> {
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        throw new Error('Il file è troppo grande. Dimensione massima: 10MB');
    }

    const text = await file.text();
    let parsed: any;
    try {
        parsed = JSON.parse(text);
    } catch {
        throw new Error('JSON non valido. Verifica la sintassi del file.');
    }

    // Handle array of objects
    let dataArray: any[];
    if (Array.isArray(parsed)) {
        dataArray = parsed;
    } else if (typeof parsed === 'object' && parsed !== null) {
        // Try to find an array property (common pattern: {data: [...], results: [...]})
        const arrayProp = Object.values(parsed).find(v => Array.isArray(v)) as any[] | undefined;
        if (arrayProp && arrayProp.length > 0) {
            dataArray = arrayProp;
        } else {
            // Single object — wrap in array
            dataArray = [parsed];
        }
    } else {
        throw new Error('Il JSON deve contenere un array di oggetti.');
    }

    if (dataArray.length === 0) {
        throw new Error('Il file JSON non contiene dati.');
    }

    // Extract headers from all objects (union of all keys)
    const headerSet = new Set<string>();
    dataArray.forEach(obj => {
        if (typeof obj === 'object' && obj !== null) {
            Object.keys(obj).forEach(k => headerSet.add(k));
        }
    });
    const headers = Array.from(headerSet);

    if (headers.length === 0) {
        throw new Error('Impossibile estrarre colonne dal JSON.');
    }

    const rows = dataArray
        .filter(obj => typeof obj === 'object' && obj !== null)
        .map(obj => headers.map(h => {
            const val = obj[h];
            if (val === undefined || val === null) return null;
            if (typeof val === 'object') return JSON.stringify(val);
            return val;
        }));

    return {
        tableName: 'json_data',
        fileName: file.name,
        headers,
        rows,
        rowCount: rows.length
    };
}

/**
 * Parse an Excel file (.xlsx/.xls) and return structured data
 */
export async function parseExcelFile(file: File): Promise<CsvData> {
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        throw new Error('Il file è troppo grande. Dimensione massima: 10MB');
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    
    // Use first sheet
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
        throw new Error('Il file Excel non contiene fogli di lavoro.');
    }

    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length < 2) {
        throw new Error('Il file Excel non contiene dati sufficienti (servono almeno header + 1 riga).');
    }

    // First row = headers
    const rawHeaders = jsonData[0] as any[];
    const headers = rawHeaders.map((h, i) => {
        const trimmed = String(h ?? '').trim();
        return trimmed || `col_${i + 1}`;
    });

    // Remaining rows = data
    const rows = jsonData.slice(1)
        .map(row => headers.map((_, i) => {
            const val = (row as any[])[i];
            if (val === undefined || val === null || val === '') return null;
            return val;
        }))
        .filter(row => row.some(v => v !== null));

    if (rows.length === 0) {
        throw new Error('Il file Excel non contiene righe di dati valide.');
    }

    return {
        tableName: 'excel_data',
        fileName: file.name,
        headers,
        rows,
        rowCount: rows.length
    };
}

/**
 * Universal file parser — auto-detects format by extension
 * Supports: .csv, .json, .xlsx, .xls
 */
export async function parseFile(file: File): Promise<CsvData> {
    const ext = file.name.toLowerCase().split('.').pop() || '';
    
    switch (ext) {
        case 'csv':
            return parseCsvFile(file);
        case 'json':
            return parseJsonFile(file);
        case 'xlsx':
        case 'xls':
            return parseExcelFile(file);
        default:
            throw new Error(`Formato file non supportato: .${ext}. Formati supportati: CSV, JSON, Excel (.xlsx/.xls)`);
    }
}

/**
 * Generate a valid SQL table name from a filename
 * @param fileName - The original file name
 * @param existingTables - Array of existing table names to avoid conflicts
 * @returns Generated table name
 */
export function generateTableName(fileName: string, existingTables: string[]): string {
    // Remove known file extensions
    let baseName = fileName.toLowerCase().replace(/\.(csv|json|xlsx|xls)$/i, '');
    
    // Replace spaces and special characters with underscores
    baseName = baseName.replace(/[^a-z0-9_]/g, '_');
    
    // Remove consecutive underscores
    baseName = baseName.replace(/_+/g, '_');
    
    // Remove leading/trailing underscores
    baseName = baseName.replace(/^_+|_+$/g, '');
    
    // Ensure it doesn't start with a number
    if (/^[0-9]/.test(baseName)) {
        baseName = 't_' + baseName;
    }
    
    // Handle conflicts by adding suffix
    let tableName = baseName;
    let counter = 1;
    while (existingTables.includes(tableName)) {
        tableName = `${baseName}_${counter}`;
        counter++;
    }
    
    return tableName;
}

/**
 * Load CSV data into AlaSQL as a temporary table
 * @param csvData - The parsed CSV data
 * @param tableName - Optional custom table name (defaults to csvData.tableName)
 */
export function loadCsvToAlaSQL(csvData: CsvData, tableName?: string): void {
    const finalTableName = tableName || csvData.tableName;
    
    try {
        // Drop existing table if present
        clearAlaSQLTable(finalTableName);

        // Use headers as-is (they should already be sanitized from parseCsvFile or from React state)
        const headers = csvData.headers;
        const columns = headers.map(h => `\`${h}\``).join(', ');
        alasql(`CREATE TABLE ${finalTableName} (${columns})`);

        // Insert rows directly into AlaSQL data structure for performance and safety
        // This avoids SQL injection issues and ensures keys match schema exactly
        const tableData = csvData.rows.map(row => {
            const rowObject: any = {};
            headers.forEach((header, index) => {
                // Use the header as key (already sanitized)
                rowObject[header] = row[index];
            });
            return rowObject;
        });

        // Assign data directly
        if (alasql.tables[finalTableName]) {
            alasql.tables[finalTableName].data = tableData;
        } else {
            throw new Error(`Table ${finalTableName} was not created successfully`);
        }
    } catch (error: any) {
        throw new Error(`Errore nel caricamento dati in AlaSQL: ${error.message}`);
    }
}

/**
 * Clear/drop an AlaSQL table
 * @param tableName - Name of the table to drop
 */
export function clearAlaSQLTable(tableName: string): void {
    try {
        alasql(`DROP TABLE IF EXISTS ${tableName}`);
    } catch (error) {
        // Ignore error if table doesn't exist
    }
}

/**
 * Sanitize column names to be SQL-safe
 * @param name - Original column name
 * @returns Sanitized column name
 */
function sanitizeColumnName(name: string): string {
    // Replace spaces and special characters with underscores
    return name.replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * Rename a table in AlaSQL by recreating it with a new name
 * @param oldName - Current table name
 * @param newName - New table name
 */
export function renameTableInAlaSQL(oldName: string, newName: string): void {
    try {
        // FAST: Get data directly from AlaSQL's internal structure
        const oldTable = alasql.tables[oldName];
        if (!oldTable || !oldTable.data) {
            throw new Error(`Table ${oldName} not found`);
        }
        
        const data = oldTable.data;
        
        // Get column names from first row or table columns
        let columns: string[];
        if (data.length > 0) {
            columns = Object.keys(data[0]);
        } else if (oldTable.columns) {
            columns = oldTable.columns.map((c: any) => c.columnid);
        } else {
            // Empty table with no schema
            clearAlaSQLTable(oldName);
            alasql(`CREATE TABLE ${newName}`);
            return;
        }
        
        const columnsDef = columns.map(col => `\`${col}\``).join(', ');
        
        // Create new table
        alasql(`CREATE TABLE ${newName} (${columnsDef})`);
        
        // FAST: Direct data assignment instead of row-by-row INSERT
        if (alasql.tables[newName]) {
            alasql.tables[newName].data = data;
        } else {
            throw new Error(`Failed to create new table ${newName}`);
        }
        
        // Drop old table
        clearAlaSQLTable(oldName);
    } catch (error: any) {
        throw new Error(`Errore nella rinominazione della tabella: ${error.message}`);
    }
}

/**
 * Execute a SQL query on AlaSQL
 * @param query - The SQL query to execute
 * @returns Query results
 */
export function executeQuery(query: string): any[] {
    try {
        const result = alasql(query);
        return Array.isArray(result) ? result : [result];
    } catch (error: any) {
        throw error;
    }
}

/**
 * Rename a column in an AlaSQL table
 * @param tableName - The table name
 * @param oldName - The current column name
 * @param newName - The new column name
 */
export function renameColumnInAlaSQL(tableName: string, oldName: string, newName: string): void {
    try {
        // FAST: Get data directly from AlaSQL's internal structure
        const table = alasql.tables[tableName];
        if (!table || !table.data) {
            throw new Error(`Table ${tableName} not found`);
        }
        
        const data = table.data;
        
        if (data.length === 0) {
            // Empty table - nothing to rename
            return;
        }

        // FAST: Rename key in each object (mutate in place for performance)
        data.forEach((row: any) => {
            if (oldName in row) {
                row[newName] = row[oldName];
                delete row[oldName];
            }
        });
        
        // Update table columns metadata if available
        if (table.columns) {
            table.columns.forEach((col: any) => {
                if (col.columnid === oldName) {
                    col.columnid = newName;
                }
            });
        }

    } catch (error: any) {
        throw new Error(`Errore nella rinominazione della colonna: ${error.message}`);
    }
}

/**
 * Drop a column from an AlaSQL table
 * @param tableName - The table name
 * @param columnName - The column to drop
 */
export function dropColumnInAlaSQL(tableName: string, columnName: string): void {
    try {
        const data = alasql(`SELECT * FROM ${tableName}`);
        
        // Remove property from all rows
        const newData = data.map((row: any) => {
            const newRow = { ...row };
            delete newRow[columnName];
            return newRow;
        });

        // Update table data directly
        if (alasql.tables[tableName]) {
            alasql.tables[tableName].data = newData;
            
            // Update table columns metadata if available
            if (alasql.tables[tableName].columns) {
                alasql.tables[tableName].columns = alasql.tables[tableName].columns.filter(
                    (col: any) => col.columnid !== columnName
                );
            }
        }
    } catch (error: any) {
        throw new Error(`Errore nell'eliminazione della colonna: ${error.message}`);
    }
}
