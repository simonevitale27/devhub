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
            skipEmptyLines: true,
            dynamicTyping: true, // Auto-convert numbers
            complete: (results) => {
                if (results.errors.length > 0) {
                    reject(new Error(`Errore nel parsing CSV: ${results.errors[0].message}`));
                    return;
                }

                const headers = results.meta.fields || [];
                const rows = results.data.map((row: any) => 
                    headers.map(header => row[header])
                );

                if (headers.length === 0 || rows.length === 0) {
                    reject(new Error('Il file CSV è vuoto o non contiene dati validi.'));
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
 * Load CSV data into AlaSQL as a temporary table
 * @param csvData - The parsed CSV data
 */
export function loadCsvToAlaSQL(csvData: CsvData): void {
    try {
        // Drop existing table if present
        clearAlaSQLTable(csvData.tableName);

        // Create table with dynamic schema
        const columns = csvData.headers.map(h => `\`${sanitizeColumnName(h)}\``).join(', ');
        alasql(`CREATE TABLE ${csvData.tableName} (${columns})`);

        // Insert rows
        csvData.rows.forEach(row => {
            const values = row.map(v => {
                if (v === null || v === undefined) return 'NULL';
                if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
                return v;
            }).join(', ');
            alasql(`INSERT INTO ${csvData.tableName} VALUES (${values})`);
        });
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
