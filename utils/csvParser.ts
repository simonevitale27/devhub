import Papa from 'papaparse';
import alasql from 'alasql';
import { CsvData } from '../types';

/**
 * Parse a CSV file and return structured data
 * @param file - The CSV file to parse
 * @returns Promise with CsvData
 */
export async function parseCsvFile(file: File): Promise<CsvData> {
    return new Promise((resolve, reject) => {
        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            reject(new Error('Il file è troppo grande. Dimensione massima: 10MB'));
            return;
        }

        // Validate file type
        if (!file.name.toLowerCase().endsWith('.csv')) {
            reject(new Error('Formato file non valido. Usa un file CSV.'));
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
 * Generate a valid SQL table name from a filename
 * @param fileName - The original file name
 * @param existingTables - Array of existing table names to avoid conflicts
 * @returns Generated table name
 */
export function generateTableName(fileName: string, existingTables: string[]): string {
    // Remove .csv extension
    let baseName = fileName.toLowerCase().replace(/\.csv$/i, '');
    
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

        // Create table with dynamic schema
        const sanitizedHeaders = csvData.headers.map(h => sanitizeColumnName(h));
        const columns = sanitizedHeaders.map(h => `\`${h}\``).join(', ');
        alasql(`CREATE TABLE ${finalTableName} (${columns})`);

        // Insert rows directly into AlaSQL data structure for performance and safety
        // This avoids SQL injection issues and ensures keys match schema exactly
        const tableData = csvData.rows.map(row => {
            const rowObject: any = {};
            sanitizedHeaders.forEach((header, index) => {
                // Use the sanitized header as key
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
        }
    } catch (error: any) {
        throw new Error(`Errore nell'eliminazione della colonna: ${error.message}`);
    }
}
