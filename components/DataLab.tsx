import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Home, Upload, Play, Code2, TrendingUp, FileSpreadsheet, AlertCircle, X, BarChart3, Filter, ArrowDownAZ, ArrowUpAZ, CheckSquare, Square, FileDown, ChevronDown, Copy, Check, History as HistoryIcon, XCircle as XCircleIcon, Activity } from 'lucide-react';
import { generateUnifiedPDF } from '../utils/pdfExport';
import alasql from 'alasql';
import * as XLSX from 'xlsx';
import { CsvData } from '../types';
import { parseCsvFile, loadCsvToAlaSQL, executeQuery, generateTableName, clearAlaSQLTable, renameTableInAlaSQL, renameColumnInAlaSQL, dropColumnInAlaSQL } from '../utils/csvParser';
import ResultsTable from './ResultsTable';
import TableInspectorModal from './TableInspectorModal';
import ResultStats from './ResultStats';
import QuickChart from './QuickChart';
import TableManagerSidebar, { TableData } from './TableManagerSidebar';
import SyntaxHighlightedEditor from './SyntaxHighlightedEditor';
import DataVisualization from './DataVisualization';
import { useDebounce } from '../utils/useDebounce';
import HealthReportModal from './HealthReportModal';
import DataProfiling from './DataProfiling';
import { analyzeTableHealth, DataHealthReport } from '../utils/dataHealthCheck';

import PythonPanel from './PythonPanel';
import EditorToggle from './EditorToggle';

import { sqlToPandas } from '../utils/sqlToPandas';
import { formatSQL } from '../utils/formatSQL';
import { formatPythonCode, copyToClipboard } from '../utils/formatPython';

interface DataLabProps {
    onBack: () => void;
}

const DataLab: React.FC<DataLabProps> = ({ onBack }) => {
    const [tables, setTables] = useState<Map<string, TableData>>(new Map());
    const [sqlQuery, setSqlQuery] = useState('');
    const [queryResult, setQueryResult] = useState<any[] | null>(null);
    const [filteredResult, setFilteredResult] = useState<any[] | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isExecuting, setIsExecuting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showTableInspector, setShowTableInspector] = useState(false);
    const [selectedTableForInspector, setSelectedTableForInspector] = useState<string | null>(null);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [showChartModal, setShowChartModal] = useState(false);
    const [newTableName, setNewTableName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [cursorPosition, setCursorPosition] = useState(0);

    // Health Check State
    const [showHealthModal, setShowHealthModal] = useState(false);
    const [healthReport, setHealthReport] = useState<DataHealthReport | null>(null);
    const [healthTableName, setHealthTableName] = useState<string | null>(null);
    const [showDataProfiling, setShowDataProfiling] = useState(false);

    // Filter & Sort State
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null);
    const [filters, setFilters] = useState<Record<string, Set<string>>>({});
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    // Resize State
    const [editorHeight, setEditorHeight] = useState(300);
    const [isResizing, setIsResizing] = useState(false);

    // Debounce search query to avoid excessive re-renders during typing
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Ghost Text & Python Panel State
    // Python Panel State
    const [showPythonPanel, setShowPythonPanel] = useState(false);
    const [pythonCode, setPythonCode] = useState('');
    const [copiedCode, setCopiedCode] = useState(false);
    const [queryHistory, setQueryHistory] = useState<string[]>(() => {
        // Load from localStorage on init
        try {
            const saved = localStorage.getItem('dataLab_queryHistory');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Persist query history to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('dataLab_queryHistory', JSON.stringify(queryHistory));
        } catch {
            // localStorage might be full or disabled
        }
    }, [queryHistory]);

    // Resize Handlers
    const startResizing = useCallback((e: React.MouseEvent) => {
        setIsResizing(true);
        e.preventDefault();
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = useCallback((e: MouseEvent) => {
        if (isResizing) {
            // Calculate new height relative to the viewport/container
            // Header is approx 80-90px.
            const newHeight = e.clientY - 90; 
            if (newHeight > 200 && newHeight < window.innerHeight - 200) {
                setEditorHeight(newHeight);
            }
        }
    }, [isResizing]);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResizing);
        } else {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        }
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [isResizing, resize, stopResizing]);

    // Get unique values for a column - memoized and LIMITED for performance
    const getUniqueValues = useCallback((column: string): string[] => {
        if (!queryResult) return [];
        
        // OPTIMIZATION: Limit to first 5000 rows for unique value extraction
        const sampleSize = Math.min(5000, queryResult.length);
        const sampleData = queryResult.slice(0, sampleSize);
        
        const values = new Set<string>();
        
        for (const row of sampleData) {
            values.add(String(row[column]));
            // OPTIMIZATION: Stop at 100 unique values to prevent UI overload
            if (values.size >= 100) break;
        }
        
        return Array.from(values).sort();
    }, [queryResult]);

    // Apply filters and sort - memoized for performance
    const filteredResultMemo = useMemo(() => {
        if (!queryResult) return null;

        let result = [...queryResult];

        // 1. Apply Search (debounced)
        if (debouncedSearchQuery) {
            const lowerQuery = debouncedSearchQuery.toLowerCase();
            result = result.filter(row =>
                Object.values(row).some(val =>
                    String(val).toLowerCase().includes(lowerQuery)
                )
            );
        }

        // 2. Apply Column Filters
        Object.entries(filters).forEach(([col, selectedValues]) => {
            if ((selectedValues as Set<string>).size > 0) {
                result = result.filter(row => (selectedValues as Set<string>).has(String(row[col])));
            }
        });

        // 3. Apply Sort
        if (sortConfig) {
            result.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];
                
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [queryResult, debouncedSearchQuery, filters, sortConfig]);

    // Sync filteredResultMemo with state
    React.useEffect(() => {
        setFilteredResult(filteredResultMemo);
    }, [filteredResultMemo]);

    const handleSort = useCallback((key: string, direction: 'asc' | 'desc') => {
        setSortConfig({ key, direction });
    }, []);

    const toggleFilterValue = useCallback((column: string, value: string) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            if (!newFilters[column]) {
                const allValues = getUniqueValues(column);
                const newSet = new Set(allValues);
                newSet.delete(value);
                newFilters[column] = newSet;
            } else {
                const newSet = new Set(newFilters[column]);
                if (newSet.has(value)) {
                    newSet.delete(value);
                } else {
                    newSet.add(value);
                }
                newFilters[column] = newSet;
            }
            return newFilters;
        });
    }, [getUniqueValues]);

    const isFilterActive = (column: string) => !!filters[column];
    const isValueSelected = (column: string, value: string) => {
        if (!filters[column]) return true; // Default all selected
        return filters[column].has(value);
    };

    const selectAllFilters = (column: string) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[column]; // Remove entry = all selected
            return newFilters;
        });
    };

    const clearAllFilters = (column: string) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            newFilters[column] = new Set(); // Empty set = none selected
            return newFilters;
        });
    };

    // Process multiple CSV file uploads
    const handleMultipleFileUpload = async (files: File[]) => {
        setError(null);
        
        for (const file of files) {
            try {
                // Parse CSV
                const data = await parseCsvFile(file);
                
                // Infer Column Types
                const columnTypes: Record<string, 'number' | 'string' | 'date' | 'boolean'> = {};
                
                data.headers.forEach((header, index) => {
                    let inferredType: 'number' | 'string' | 'date' | 'boolean' = 'string';
                    
                    // Find first non-empty value to infer type
                    for (const row of data.rows) {
                        const val = row[index];
                        if (val !== null && val !== undefined && String(val).trim() !== '') {
                            const strVal = String(val).trim();
                            const lowerVal = strVal.toLowerCase();
                            
                            // Boolean check
                            if (lowerVal === 'true' || lowerVal === 'false') {
                                inferredType = 'boolean';
                            } 
                            // Number check
                            else if (!isNaN(Number(strVal))) {
                                inferredType = 'number';
                            } 
                            // Date check (simple)
                            else if (!isNaN(Date.parse(strVal)) && isNaN(Number(strVal))) {
                                inferredType = 'date';
                            }
                            
                            break; // Stop after finding first valid value
                        }
                    }
                    columnTypes[header] = inferredType;
                });
                
                // Generate unique table name
                const existingTableNames = Array.from(tables.keys()) as string[];
                const tableName = generateTableName(file.name, existingTableNames);
                
                // Load to AlaSQL with custom table name
                loadCsvToAlaSQL(data, tableName);
                
                // Create TableData object
                const tableData: TableData = {
                    tableName,
                    fileName: file.name,
                    rowCount: data.rowCount,
                    headers: data.headers,
                    rows: data.rows,
                    columnTypes
                };
                
                // Add to tables map
                setTables(prev => new Map(prev).set(tableName, tableData));
                
            } catch (err: any) {
                setError(`Errore nel caricamento di ${file.name}: ${err.message}`);
            }
        }
    };

    // Handle multiple file drop
    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files) as File[];
        if (files.length > 0) {
            await handleMultipleFileUpload(files);
        }
    };

    // Handle multiple file selection
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) as File[] : [];
        if (files.length > 0) {
            await handleMultipleFileUpload(files);
        }
    };



    // Execute SQL query
    const handleExecuteQuery = async (codeOrEvent?: string | React.MouseEvent) => {
        const queryToRun = typeof codeOrEvent === 'string' && codeOrEvent 
            ? codeOrEvent 
            : sqlQuery;

        // Add to history before execution
        if (queryToRun && queryToRun.trim()) {
            setQueryHistory((prev) => {
                // Remove duplicates, add to front, keep max 5
                const newHistory = [
                    queryToRun,
                    ...prev.filter((q) => q !== queryToRun),
                ].slice(0, 5);
                return newHistory;
            });
        }
        if (!queryToRun.trim()) {
            setError('Inserisci una query SQL valida.');
            return;
        }

        setIsExecuting(true);
        setError(null);
        setQueryResult(null);

        try {
            const result = executeQuery(queryToRun);
            setQueryResult(result);
            setFilteredResult(null); // Reset filters when new query is executed
            setFilters({});
            setSortConfig(null);
            setSearchQuery('');
            
        } catch (err: any) {
            setError(err.message || 'Errore durante l\'esecuzione della query');
            setQueryResult(null);
            setFilteredResult(null);
        } finally {
            setIsExecuting(false);
        }
    };

    // Filter results based on search query
    const handleSearchResults = (search: string) => {
        setSearchQuery(search);
        // Filtering is now handled by useEffect
    };

    // Rename table
    const handleRenameTable = (oldName: string, newName: string) => {
        try {
            // Auto-fix: replace spaces with underscores and force lowercase
            const sanitizedNewName = newName.trim().toLowerCase().replace(/\s+/g, '_');
            
            if (sanitizedNewName === oldName) return;

            renameTableInAlaSQL(oldName, sanitizedNewName);
            setTables(prev => {
                const newMap = new Map();
                // Iterate over existing entries to preserve order
                for (const [key, val] of prev) {
                    if (key === oldName) {
                        // Replace the old key with the new key, keeping the value (updated with new name)
                        const updatedTableData: TableData = {
                            ...val,
                            tableName: sanitizedNewName
                        };
                        newMap.set(sanitizedNewName, updatedTableData);
                    } else {
                        newMap.set(key, val);
                    }
                }
                return newMap;
            });
        } catch (error: any) {
            console.error("Error renaming table:", error);
            setError(`Errore durante la ridenominazione della tabella: ${error.message}`);
        }
    };

    // Delete table
    const handleDeleteTable = (tableName: string) => {
        try {
            // Drop from AlaSQL
            clearAlaSQLTable(tableName);
            
            // Remove from tables map
            setTables(prev => {
                const newMap = new Map(prev);
                newMap.delete(tableName);
                return newMap;
            });
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Insert quick query for table
    const handleQueryTable = (tableName: string) => {
        setSqlQuery(`SELECT * FROM ${tableName} LIMIT 10`);
    };

    // Open table inspector for specific table
    const handleOpenTableInspector = (tableName: string) => {
        setSelectedTableForInspector(tableName);
        setShowTableInspector(true);
    };

    // Insert column name into editor
    // Insert column name into editor
    const handleInsertColumn = (columnName: string) => {
        const before = sqlQuery.substring(0, cursorPosition);
        const after = sqlQuery.substring(cursorPosition);
        
        const newText = before + columnName + after;
        setSqlQuery(newText);
        
        // Update cursor position
        setCursorPosition(cursorPosition + columnName.length);
    };

    // Rename column
    const handleRenameColumn = (tableName: string, oldName: string, newName: string) => {
        try {
            // Sanitize new name
            const sanitizedNewName = newName.trim().replace(/\s+/g, '_');
            if (sanitizedNewName === oldName) return;

            // Update state first
            setTables(prev => {
                const newMap = new Map<string, TableData>(prev);
                const tableData = newMap.get(tableName);
                if (tableData) {
                    // Update headers
                    const newHeaders = tableData.headers.map(h => h === oldName ? sanitizedNewName : h);
                    
                    // Update columnTypes map with new column name
                    const newColumnTypes = { ...tableData.columnTypes };
                    if (oldName in newColumnTypes) {
                        newColumnTypes[sanitizedNewName] = newColumnTypes[oldName];
                        delete newColumnTypes[oldName];
                    }
                    
                    const updatedTableData = {
                        ...tableData,
                        headers: newHeaders,
                        columnTypes: newColumnTypes
                    };
                    
                    newMap.set(tableName, updatedTableData);
                    
                    // Recreate AlaSQL table entirely from updated state
                    clearAlaSQLTable(tableName);
                    loadCsvToAlaSQL({
                        tableName,
                        fileName: updatedTableData.fileName,
                        headers: newHeaders,
                        rows: updatedTableData.rows,
                        rowCount: updatedTableData.rowCount
                    });
                }
                return newMap;
            });
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Drop column
    const handleDropColumn = (tableName: string, columnName: string) => {
        try {
            // Update state first
            setTables(prev => {
                const newMap = new Map<string, TableData>(prev);
                const tableData = newMap.get(tableName);
                if (tableData) {
                    // Find column index to remove
                    const columnIndex = tableData.headers.indexOf(columnName);
                    
                    // Update headers (remove deleted column)
                    const newHeaders = tableData.headers.filter(h => h !== columnName);
                    
                    // Update rows (remove value at column index from each row)
                    const newRows = tableData.rows.map(row => 
                        row.filter((_, index) => index !== columnIndex)
                    );
                    
                    // Update columnTypes (remove deleted column)
                    const newColumnTypes = { ...tableData.columnTypes };
                    delete newColumnTypes[columnName];
                    
                    const updatedTableData = {
                        ...tableData,
                        headers: newHeaders,
                        rows: newRows,
                        columnTypes: newColumnTypes,
                        rowCount: newRows.length
                    };
                    
                    newMap.set(tableName, updatedTableData);
                    
                    // Recreate AlaSQL table entirely from updated state
                    clearAlaSQLTable(tableName);
                    loadCsvToAlaSQL({
                        tableName,
                        fileName: updatedTableData.fileName,
                        headers: newHeaders,
                        rows: newRows,
                        rowCount: newRows.length
                    });
                }
                return newMap;
            });
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Handle Health Check
    const handleHealthCheck = (tableName: string) => {
        try {
            const tableData = tables.get(tableName);
            if (!tableData) {
                setError('Tabella non trovata');
                return;
            }

            // Get data from AlaSQL
            const data = alasql(`SELECT * FROM ${tableName}`);

            if (!data || data.length === 0) {
                setError('Nessun dato da analizzare');
                return;
            }

            // Analyze data
            const report = analyzeTableHealth(data, tableData.headers);

            // Show modal
            setHealthReport(report);
            setHealthTableName(tableName);
            setShowHealthModal(true);
        } catch (err: any) {
            setError(`Errore durante l'analisi: ${err.message}`);
        }
    };

    // Handle Save as Table
    const handleSaveAsTable = async () => {
        if (!newTableName.trim()) {
            setSaveError('Inserisci un nome valido per la tabella');
            return;
        }

        // Sanitize name
        const sanitizedName = newTableName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
        
        if (tables.has(sanitizedName)) {
            setSaveError('Esiste già una tabella con questo nome');
            return;
        }

        const dataToSave = filteredResult || queryResult;

        if (!dataToSave || dataToSave.length === 0) {
            setSaveError('Nessun dato da salvare');
            return;
        }

        setIsSaving(true);
        setSaveError(null);

        try {
            // 1. Create Table in AlaSQL
            const headers = Object.keys(dataToSave[0]);
            const columnsDef = headers.map(h => `\`${h}\``).join(', ');
            
            // Drop if exists (safety check, though we checked tables map)
            clearAlaSQLTable(sanitizedName);
            
            alasql(`CREATE TABLE ${sanitizedName} (${columnsDef})`);

            // 2. Insert Data
            // We use the direct data assignment for speed and safety
            if (alasql.tables[sanitizedName]) {
                alasql.tables[sanitizedName].data = dataToSave;
            } else {
                throw new Error('Errore nella creazione della tabella');
            }

            // 3. Infer Types for the new table
            const columnTypes: Record<string, 'number' | 'string' | 'date' | 'boolean'> = {};
            headers.forEach((header, index) => {
                let inferredType: 'number' | 'string' | 'date' | 'boolean' = 'string';
                for (const row of dataToSave) {
                    const val = row[header];
                    if (val !== null && val !== undefined && String(val).trim() !== '') {
                        const strVal = String(val).trim();
                        const lowerVal = strVal.toLowerCase();
                        if (lowerVal === 'true' || lowerVal === 'false') inferredType = 'boolean';
                        else if (!isNaN(Number(strVal))) inferredType = 'number';
                        else if (!isNaN(Date.parse(strVal)) && isNaN(Number(strVal))) inferredType = 'date';
                        break;
                    }
                }
                columnTypes[header] = inferredType;
            });

            // 4. Update Sidebar State
            const newTableData: TableData = {
                tableName: sanitizedName,
                fileName: 'Generated',
                rowCount: dataToSave.length,
                headers: headers,
                rows: dataToSave.map(row => Object.values(row)), // Convert to array of arrays for TableData consistency if needed, but TableData interface says rows: any[][]. 
                // Wait, parseCsvFile returns rows as any[][]. No, parseCsvFile returns CsvData where rows is any[][].
                // But loadCsvToAlaSQL converts it to array of objects.
                // Let's check TableData definition in TableManagerSidebar.
                // It says rows: any[][].
                // But wait, queryResult is array of objects.
                // So I need to convert queryResult (objects) to array of arrays for TableData.
                // Actually, TableData.rows is used for... let's check. 
                // It seems TableData.rows is NOT used for display, only for metadata?
                // But to be safe, let's convert.
            };
            
            // Re-map rows to array of values matching headers order
            const rowsAsArrays = dataToSave.map(row => headers.map(h => row[h]));
            
            setTables(prev => new Map(prev).set(sanitizedName, {
                ...newTableData,
                rows: rowsAsArrays,
                columnTypes
            }));

            // Close Modal
            setShowSaveModal(false);
            setNewTableName('');
            setSaveError(null);

        } catch (err: any) {
            setSaveError(`Errore: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    // Generate PDF Report
    const generatePDF = () => {
        // Use filteredResult if available (includes filters), otherwise queryResult
        const dataToExport = filteredResult || queryResult;
        
        if (!dataToExport || dataToExport.length === 0) {
            setError('Nessun dato da esportare.');
            return;
        }

        generateUnifiedPDF(dataToExport, `datalab_report_${new Date().getTime()}.pdf`, 'DataLab Export');
        setIsDownloadMenuOpen(false);
    };

    // Generate CSV Export
    const generateCSV = () => {
        const dataToExport = filteredResult || queryResult;
        
        if (!dataToExport || dataToExport.length === 0) {
            setError('Nessun dato da esportare.');
            return;
        }

        try {
            // Get headers
            const headers = Object.keys(dataToExport[0]);
            
            // Create CSV content
            const csvContent = [
                headers.join(','), // Header row
                ...dataToExport.map(row => 
                    headers.map(header => {
                        const cell = row[header] === null || row[header] === undefined ? '' : row[header];
                        // Escape quotes and wrap in quotes if contains comma or quote
                        const stringCell = String(cell);
                        if (stringCell.includes(',') || stringCell.includes('"') || stringCell.includes('\n')) {
                            return `"${stringCell.replace(/"/g, '""')}"`;
                        }
                        return stringCell;
                    }).join(',')
                )
            ].join('\n');
            
            
            // Use data URL for maximum browser compatibility
            const dataUrl = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `DevHub_Export_${new Date().getTime()}.csv`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setIsDownloadMenuOpen(false);
            console.log('generateCSV: Download completed');
            
        } catch (err: any) {
            console.error('Error generating CSV:', err);
            setError('Errore nella generazione del CSV: ' + err.message);
        }
    };

    // Generate Excel Export
    const generateExcel = () => {
        const dataToExport = filteredResult || queryResult;
        
        if (!dataToExport || dataToExport.length === 0) {
            setError('Nessun dato da esportare.');
            return;
        }

        try {
            // Create workbook and worksheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(dataToExport);
            
            // Auto-fit column widths
            const colWidths = Object.keys(dataToExport[0]).map(key => ({
                wch: Math.max(
                    key.length,
                    ...dataToExport.slice(0, 100).map(row => 
                        String(row[key] ?? '').length
                    )
                ) + 2
            }));
            ws['!cols'] = colWidths;
            
            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Query Results');
            
            // Generate and download file
            XLSX.writeFile(wb, `DevHub_Export_${new Date().getTime()}.xlsx`);
            
            setIsDownloadMenuOpen(false);
            console.log('generateExcel: Download completed');
            
        } catch (err: any) {
            console.error('Error generating Excel:', err);
            setError('Errore nella generazione dell\'Excel: ' + err.message);
        }
    };

    return (
        <div className="flex h-screen bg-transparent text-slate-200 font-sans overflow-hidden selection:bg-emerald-500 selection:text-white">
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 px-6 h-full">
                
                {/* Header */}
                <div className="h-16 flex items-center justify-between mt-4 mb-1 z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="h-[42px] w-[42px] flex items-center justify-center text-slate-300 hover:text-white bg-[#121212]/70 backdrop-blur-xl rounded-xl shadow-lg shadow-black/20 hover:bg-white/5 transition-all active:scale-95">
                            <Home size={18} />
                        </button>
                        <h2 className="font-bold text-lg text-white flex items-center gap-2">
                            <FileSpreadsheet className="text-emerald-500"/>
                            DataLab
                            <span className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded border border-emerald-900/50">Multi-Table</span>
                        </h2>
                    </div>
                </div>

                {/* Two-Column Layout: 20% Sidebar | 80% Main Content */}
                <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
                    
                    {/* LEFT COLUMN - Sidebar (20%) */}
                    <div className="w-1/5 flex flex-col gap-4 pb-6 min-w-[250px]">
                        
                        {/* UPLOAD AREA (20% height) */}
                        <div className="h-[20%] bg-[#121212]/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg shadow-black/20 relative overflow-hidden flex-shrink-0">
                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            
                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                className={`h-full border-2 border-dashed rounded-xl p-4 text-center transition-all duration-300 flex items-center justify-center relative overflow-hidden ${
                                    isDragging 
                                        ? 'border-emerald-500 bg-emerald-500/10' 
                                        : 'border-slate-700/50 hover:border-emerald-500/50 bg-black/20'
                                }`}
                            >
                                {/* Content */}
                                <div className="relative z-10 flex flex-col items-center justify-center gap-4 w-full h-full">
                                    <div className="text-center">
                                        <p className="text-base text-slate-200 font-semibold">Trascina CSV qui</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Multi-file • Max 10MB</p>
                                    </div>
                                    
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-3 py-1.5 bg-gradient-to-b from-emerald-500/30 to-emerald-600/5 backdrop-blur-xl border border-white/10 shadow-[0_0_15px_rgba(16,185,129,0.4)_inset] shadow-lg shadow-emerald-500/20 rounded-lg text-emerald-300 hover:text-emerald-200 text-xs font-bold transition-all duration-300 hover:from-emerald-500/40 hover:to-emerald-600/10 active:scale-95 flex items-center gap-2"
                                    >
                                        <Upload size={12} />
                                        Scegli File
                                    </button>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".csv"
                                        multiple
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* TABLE MANAGER (80% height) */}
                        <div className="h-[80%] flex flex-col relative overflow-hidden">
                            <TableManagerSidebar
                                tables={tables}
                                onRenameTable={handleRenameTable}
                                onDeleteTable={handleDeleteTable}
                                onQueryTable={handleOpenTableInspector}
                                onInsertColumn={handleInsertColumn}
                                onRenameColumn={handleRenameColumn}
                                onDeleteColumn={handleDropColumn}
                                onHealthCheck={handleHealthCheck}
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Main Content (80%) */}
                    <div className="flex-1 flex flex-col pb-6 h-full min-w-0">

                        {/* TOP: SQL EDITOR / PYTHON PANEL (Resizable) */}
                        <div 
                            className="bg-[#121212]/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg shadow-black/20 relative overflow-hidden flex flex-col min-h-[200px]"
                            style={{ height: editorHeight }}
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                            
                            {/* Persistent Header */}
                            <div className="flex items-center justify-between mb-3 flex-shrink-0">
                                <EditorToggle
                                    activeEditor={showPythonPanel ? 'python' : 'sql'}
                                    onToggle={(editor) => {
                                        if (editor === 'python') {
                                            // ON-DEMAND TRANSLATION
                                            if (!sqlQuery || !sqlQuery.trim()) {
                                                setPythonCode('# Scrivi una query SQL e premi il toggle per convertirla in Python');
                                                setShowPythonPanel(true);
                                                return;
                                            }
                                            
                                            const translation = sqlToPandas(sqlQuery);
                                            console.log('SQL to Python translation:', {
                                                sql: sqlQuery,
                                                error: translation.error,
                                                imports: translation.imports,
                                                code: translation.code
                                            });
                                            
                                            if (translation.error) {
                                                console.warn('Python translation error:', translation.error);
                                                setPythonCode(`# Errore di traduzione: ${translation.error}\n\n${translation.code}`);
                                            } else {
                                                const fullCode = translation.imports.join('\n') + '\n\n' + translation.code;
                                                setPythonCode(fullCode);
                                            }
                                            setShowPythonPanel(true);
                                        } else {
                                            setShowPythonPanel(false);
                                        }
                                    }}
                                />
                                <div className="flex items-center gap-2">
                                    {/* Format Button */}
                                    <button
                                        onClick={() => {
                                            if (showPythonPanel) {
                                                const formatted = formatPythonCode(pythonCode);
                                                setPythonCode(formatted);
                                            } else {
                                                const formatted = formatSQL(sqlQuery);
                                                setSqlQuery(formatted);
                                            }
                                        }}
                                        className="w-32 px-3 py-1 bg-[#121212]/70 backdrop-blur-xl hover:bg-white/10 text-slate-300 text-xs rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-black/20 active:scale-95"
                                        title="Formatta codice"
                                    >
                                        <Code2 size={12} />
                                        Formatta
                                    </button>
                                    {/* Copy Code Button */}
                                    <button
                                        onClick={async () => {
                                            const codeToCopy = showPythonPanel ? pythonCode : sqlQuery;
                                            const success = await copyToClipboard(codeToCopy);
                                            if (success) {
                                                setCopiedCode(true);
                                                setTimeout(() => setCopiedCode(false), 2000);
                                            }
                                        }}
                                        className={`w-32 px-3 py-1 rounded-lg text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-black/20 active:scale-95 ${
                                            copiedCode
                                                ? 'bg-emerald-500/20 text-emerald-300'
                                                : 'bg-[#121212]/70 backdrop-blur-xl hover:bg-white/10 text-slate-300'
                                        }`}
                                        title={showPythonPanel ? "Copia codice Python" : "Copia query SQL"}
                                    >
                                        {copiedCode ? (
                                            <>
                                                <Check size={12} />
                                                Copiato!
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={12} />
                                                Copy Code
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Content Area */}
                            {showPythonPanel ? (
                                <PythonPanel 
                                    code={pythonCode}
                                />
                            ) : (
                                <>
                                    <div 
                                        className="bg-black/40 rounded-xl border border-white/10 shadow-inner overflow-hidden relative group focus-within:border-white/20 transition-colors min-h-0 flex-1"
                                    >
                                        <SyntaxHighlightedEditor
                                            value={sqlQuery}
                                            onChange={setSqlQuery}
                                            onRun={handleExecuteQuery}
                                            tables={Array.from(tables.entries()).map(([tableName, t]) => ({
                                                tableName: tableName,
                                                columns: t.headers
                                            }))}
                                            onCursorPositionChange={setCursorPosition}
                                        />
                                    </div>
                                    

                                    <div className="flex items-center gap-2 mt-2">
                                        {/* History Bar (Compact) */}
                                        {queryHistory.length > 0 ? (
                                            <div className="flex-1 min-w-0 bg-[#121212]/70 backdrop-blur-md rounded-lg p-1.5 flex items-center gap-2 overflow-hidden border border-white/5 shadow-inner">
                                                <div className="flex items-center gap-2 pl-2 pr-3 border-r border-white/10 shrink-0">
                                                    <HistoryIcon size={12} className="text-slate-400" />
                                                    <button 
                                                        onClick={() => setQueryHistory([])} 
                                                        className="text-slate-500 hover:text-red-400 transition-colors" 
                                                        title="Cancella tutto"
                                                    >
                                                        <XCircleIcon size={12} />
                                                    </button>
                                                </div>
                                                <div className="flex gap-2 overflow-x-auto custom-scrollbar items-center pb-0.5 mask-linear-fade">
                                                    {queryHistory.map((query, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setSqlQuery(query)}
                                                            className="shrink-0 max-w-[150px] text-[10px] text-left bg-black/40 hover:bg-white/10 text-slate-300 hover:text-white rounded px-2 py-1 transition-all truncate font-mono border border-white/5"
                                                            title={query}
                                                        >
                                                            {query}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : <div className="flex-1" />}

                                        {/* Execute Button */}
                                        <button
                                            onClick={handleExecuteQuery}
                                            disabled={isExecuting}
                                            className={`h-[34px] px-4 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shrink-0 ${
                                                isExecuting
                                                    ? 'bg-[#0a0a0a]/80 text-slate-400 shadow-black/20'
                                                    : 'bg-[#121212]/70 backdrop-blur-xl text-slate-300 hover:bg-white/5 hover:text-slate-200 shadow-black/20 active:bg-emerald-500/20 active:text-emerald-300 active:shadow-[0_0_15px_rgba(16,185,129,0.3)_inset] active:shadow-emerald-500/20 active:scale-95'
                                            }`}
                                        >
                                            {isExecuting ? (
                                                <>
                                                    <div className="w-3.5 h-3.5 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin"></div>
                                                    Esecuzione...
                                                </>
                                            ) : (
                                                <>
                                                    <Play size={12} fill="currentColor" />
                                                    Esegui
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* RESIZE HANDLE */}
                        <div 
                            className="h-4 w-full cursor-row-resize flex items-center justify-center hover:bg-white/5 group transition-colors shrink-0 z-10"
                            onMouseDown={startResizing}
                        >
                             <div className="w-16 h-1 rounded-full bg-white/10 group-hover:bg-blue-500/50 transition-colors" />
                        </div>

                        {/* BOTTOM: RESULTS (Flex-1) */}
                        <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
                            {/* ERROR MESSAGE */}
                            {error && (
                                <div className="absolute top-0 inset-x-0 z-50 bg-red-900/90 backdrop-blur border border-red-900/50 rounded-xl p-4 flex items-start gap-3 shadow-lg animate-in slide-in-from-top-2 mx-4 mt-2">
                                    <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-red-400 mb-1">Errore</div>
                                        <div className="text-sm text-slate-200">{error}</div>
                                    </div>
                                    <button
                                        onClick={() => setError(null)}
                                        className="p-1 text-slate-400 hover:text-white rounded transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            {/* QUERY RESULTS */}
                            {queryResult && queryResult.length > 0 && (
                                <div className="flex-1 bg-[#121212]/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/20 animate-in slide-in-from-bottom-4 relative overflow-hidden flex flex-col">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-500 shadow-[0_0_10px_rgba(100,116,139,0.5)]"></div>
                                    
                                    {/* Results Header */}
                                    <div className="px-6 py-4 border-b border-white/5 flex-shrink-0">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                                <TrendingUp size={14} className="text-slate-400" />
                                                Risultati ({filteredResult ? filteredResult.length : queryResult.length} di {queryResult.length})
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setQueryResult(null);
                                                        setFilteredResult(null);
                                                        setSqlQuery('');
                                                        setSearchQuery('');
                                                        setFilters({});
                                                        setSortConfig(null);
                                                        setError(null);
                                                    }}
                                                    className="px-3 py-1.5 bg-[#121212]/70 backdrop-blur-xl hover:bg-white/10 text-slate-300 text-xs rounded-lg transition-all duration-300 flex items-center gap-2 hover:text-red-300 shadow-lg shadow-black/20 active:scale-95"
                                                    title="Reset risultati e query"
                                                >
                                                    <X size={12} />
                                                    Reset
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (queryResult && queryResult.length > 0) {
                                                            const report = analyzeTableHealth(queryResult, Object.keys(queryResult[0]));
                                                            setHealthReport(report);
                                                            setHealthTableName("Risultati Query");
                                                            setShowHealthModal(true);
                                                        }
                                                    }}
                                                    className="px-3 py-1.5 bg-[#121212]/70 backdrop-blur-xl hover:bg-white/10 text-slate-300 text-xs rounded-lg transition-all duration-300 flex items-center gap-2 hover:text-emerald-300 shadow-lg shadow-black/20 active:scale-95"
                                                    title="Analisi Qualità Dati"
                                                >
                                                    <Activity size={12} />
                                                    Data Quality
                                                </button>
                                                <button
                                                    onClick={() => setShowSaveModal(true)}
                                                    className="px-3 py-1.5 bg-[#121212]/70 backdrop-blur-xl hover:bg-white/10 text-slate-300 text-xs rounded-lg transition-all duration-300 flex items-center gap-2 hover:text-emerald-300 shadow-lg shadow-black/20 active:scale-95"
                                                    title="Salva come nuova tabella"
                                                >
                                                    <FileSpreadsheet size={12} />
                                                    Salva come Tabella
                                                </button>
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                                                        className="px-3 py-1.5 bg-[#121212]/70 backdrop-blur-xl hover:bg-white/10 text-slate-300 text-xs rounded-lg transition-all duration-300 flex items-center gap-2 hover:text-blue-300 shadow-lg shadow-black/20 active:scale-95"
                                                        title="Scarica risultati"
                                                    >
                                                        <FileDown size={12} />
                                                        Scarica
                                                        <ChevronDown size={12} className={`transition-transform duration-200 ${isDownloadMenuOpen ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    
                                                    {isDownloadMenuOpen && (
                                                        <div className="absolute top-full right-0 mt-2 w-36 bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-20 flex flex-col py-1">
                                                            <button
                                                                onClick={() => {
                                                                    generatePDF();
                                                                    setIsDownloadMenuOpen(false);
                                                                }}
                                                                className="px-4 py-2 text-left text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
                                                            >
                                                                <FileDown size={12} className="text-red-400" />
                                                                Scarica PDF
                                                            </button>
                                                            <button
                                                                onClick={generateCSV}
                                                                className="px-4 py-2 text-left text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
                                                            >
                                                                <FileSpreadsheet size={12} className="text-emerald-400" />
                                                                Scarica CSV
                                                            </button>
                                                            <button
                                                                onClick={generateExcel}
                                                                className="px-4 py-2 text-left text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
                                                            >
                                                                <FileSpreadsheet size={12} className="text-blue-400" />
                                                                Scarica Excel
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => setShowStatsModal(true)}
                                                    className="px-3 py-1.5 bg-[#121212]/70 backdrop-blur-xl hover:bg-white/10 text-slate-300 text-xs rounded-lg transition-all duration-300 flex items-center gap-2 hover:text-purple-300 shadow-lg shadow-black/20 active:scale-95"
                                                    title="Visualizza statistiche dettagliate"
                                                >
                                                    <BarChart3 size={12} />
                                                    Statistiche
                                                </button>
                                                <button
                                                    onClick={() => setShowChartModal(true)}
                                                    className="px-3 py-1.5 bg-[#121212]/70 backdrop-blur-xl hover:bg-white/10 text-slate-300 text-xs rounded-lg transition-all duration-300 flex items-center gap-2 hover:text-orange-300 shadow-lg shadow-black/20 active:scale-95"
                                                    title="Crea grafico dai risultati"
                                                >
                                                    <TrendingUp size={12} />
                                                    Grafico
                                                </button>
                                                <button
                                                    onClick={() => setShowDataProfiling(!showDataProfiling)}
                                                    className={`px-3 py-1.5 backdrop-blur-xl text-xs rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg shadow-black/20 active:scale-95 ${showDataProfiling ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-[#121212]/70 hover:bg-white/10 text-slate-300 hover:text-blue-300'}`}
                                                    title="Analisi profilo dati"
                                                >
                                                    <BarChart3 size={12} />
                                                    Profiling
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Search & Filter Bar */}
                                        <div className="flex gap-2 relative">
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => handleSearchResults(e.target.value)}
                                                    placeholder="Cerca nei risultati..."
                                                    className="w-full px-4 py-2 pl-10 bg-black/40 border border-white/10 rounded-lg text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-white/20 transition-colors"
                                                />
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                                    <TrendingUp size={16} />
                                                </div>
                                            </div>
                                            
                                            {/* Filter Button */}
                                            <div className="relative">
                                                <div className={`h-full rounded-lg border transition-colors flex items-center ${
                                                    showFilterMenu || Object.keys(filters).length > 0
                                                        ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                                                        : 'bg-black/40 border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                                }`}>
                                                    <button
                                                        onClick={() => setShowFilterMenu(!showFilterMenu)}
                                                        className="h-full px-3 flex items-center gap-2"
                                                        title="Filtra e Ordina"
                                                    >
                                                        <Filter size={18} />
                                                        {Object.keys(filters).length > 0 && (
                                                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-black">
                                                                {Object.keys(filters).length}
                                                            </span>
                                                        )}
                                                    </button>
                                                    
                                                    {Object.keys(filters).length > 0 && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setFilters({});
                                                            }}
                                                            className="h-full px-2 border-l border-emerald-500/30 hover:bg-emerald-500/30 hover:text-emerald-200 transition-colors rounded-r-lg"
                                                            title="Rimuovi tutti i filtri"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Filter Popover */}
                                                {showFilterMenu && (
                                                    <div className="absolute right-0 top-full mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl shadow-black/50 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                        <div className="p-3 border-b border-white/5">
                                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Colonna</h4>
                                                            <select
                                                                value={activeFilterColumn || ''}
                                                                onChange={(e) => setActiveFilterColumn(e.target.value)}
                                                                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                                                            >
                                                                <option value="" disabled>Seleziona colonna...</option>
                                                                {queryResult && queryResult.length > 0 && Object.keys(queryResult[0] || {}).map(col => (
                                                                    <option key={col} value={col}>{col}</option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        {activeFilterColumn && queryResult && queryResult.length > 0 && (
                                                            <>
                                                                {/* Sorting */}
                                                                <div className="p-3 border-b border-white/5 flex gap-2">
                                                                    <button
                                                                        onClick={() => handleSort(activeFilterColumn, 'asc')}
                                                                        className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-xs transition-colors ${
                                                                            sortConfig?.key === activeFilterColumn && sortConfig.direction === 'asc'
                                                                                ? 'bg-emerald-500/20 text-emerald-300'
                                                                                : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                                                        }`}
                                                                    >
                                                                        <ArrowDownAZ size={14} /> A-Z
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleSort(activeFilterColumn, 'desc')}
                                                                        className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-xs transition-colors ${
                                                                            sortConfig?.key === activeFilterColumn && sortConfig.direction === 'desc'
                                                                                ? 'bg-emerald-500/20 text-emerald-300'
                                                                                : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                                                        }`}
                                                                    >
                                                                        <ArrowUpAZ size={14} /> Z-A
                                                                    </button>
                                                                </div>

                                                                {/* Values */}
                                                                <div className="max-h-48 overflow-y-auto custom-scrollbar p-2">
                                                                    <div className="flex items-center justify-between mb-2 px-1">
                                                                        <span className="text-xs font-bold text-slate-500">Valori</span>
                                                                        <div className="flex gap-2">
                                                                            <button onClick={() => selectAllFilters(activeFilterColumn)} className="text-[10px] text-emerald-400 hover:underline">Tutti</button>
                                                                            <button onClick={() => clearAllFilters(activeFilterColumn)} className="text-[10px] text-red-400 hover:underline">Nessuno</button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        {getUniqueValues(activeFilterColumn!).map((val: string) => (
                                                                            <button
                                                                                key={val}
                                                                                onClick={() => toggleFilterValue(activeFilterColumn!, val)}
                                                                                className="w-full flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 text-left group"
                                                                            >
                                                                                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                                                                                    isValueSelected(activeFilterColumn!, val)
                                                                                        ? 'bg-emerald-500 border-emerald-500'
                                                                                        : 'border-slate-600 group-hover:border-slate-500'
                                                                                }`}>
                                                                                    {isValueSelected(activeFilterColumn!, val) && <CheckSquare size={10} className="text-black" />}
                                                                                    {!isValueSelected(activeFilterColumn!, val) && <Square size={10} className="text-slate-600 group-hover:text-slate-500" />}
                                                                                </div>
                                                                                <span className="text-xs text-slate-300 truncate">{val}</span>
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Data Profiling Panel */}
                                    {showDataProfiling && queryResult && queryResult.length > 0 && (
                                        <div className="mb-4">
                                            <DataProfiling 
                                                data={queryResult as Record<string, unknown>[]} 
                                                columns={Object.keys(queryResult[0] || {})} 
                                            />
                                        </div>
                                    )}

                                    {/* Results Table */}
                                    <div className="flex-1 overflow-auto custom-scrollbar">
                                        <ResultsTable data={filteredResult || queryResult} />
                                    </div>
                                </div>
                            )}

                            {queryResult && queryResult.length === 0 && (
                                <div className="bg-amber-900/20 border border-amber-900/50 rounded-xl p-4 text-center animate-in fade-in">
                                    <p className="text-amber-400 text-sm font-medium">La query è stata eseguita correttamente ma non ha restituito risultati.</p>
                                </div>
                            )}

                            {/* Empty state quando non ci sono risultati */}
                            {!queryResult && !error && (
                                <div className="flex-1 bg-[#121212]/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/20 flex items-center justify-center">
                                    <div className="text-center text-slate-600">
                                        <TrendingUp size={48} className="mx-auto mb-4 opacity-30" />
                                        <p className="text-sm font-bold uppercase tracking-wider">Nessun risultato</p>
                                        <p className="text-xs mt-1">Esegui una query sui dati caricati</p>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>

            {/* Table Inspector Modal */}
            {showTableInspector && selectedTableForInspector && tables.get(selectedTableForInspector) && (
                <TableInspectorModal
                    tableName={selectedTableForInspector}
                    schema={{
                        tableName: tables.get(selectedTableForInspector)!.fileName,
                        columns: tables.get(selectedTableForInspector)!.headers.map(header => ({
                            name: header,
                            type: 'VARCHAR',
                            isPrimaryKey: false,
                            isForeignKey: false
                        }))
                    }}
                    onClose={() => {
                        setShowTableInspector(false);
                        setSelectedTableForInspector(null);
                    }}
                />
            )}

            {/* Stats Modal */}
            {showStatsModal && queryResult && queryResult.length > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#121212]/70 backdrop-blur-xl rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col m-4 overflow-hidden">
                        <div className="flex items-center justify-between p-6 bg-gradient-to-b from-[#0a0a0a]/80 to-transparent backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <BarChart3 size={18} className="text-purple-400" />
                                <h2 className="text-lg font-bold text-white">Statistiche Risultati Query</h2>
                                <span className="text-xs text-slate-400">
                                    ({queryResult.length} righe)
                                </span>
                            </div>
                            <button
                                onClick={() => setShowStatsModal(false)}
                                className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                aria-label="Chiudi"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-auto custom-scrollbar">
                            <ResultStats
                                data={queryResult}
                                query={sqlQuery}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Save Table Modal */}
            {showSaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-[#121212] border border-white/10 rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <FileSpreadsheet className="text-blue-500" size={20} />
                            Salva come Nuova Tabella
                        </h3>
                        
                        <p className="text-sm text-slate-400 mb-4">
                            Salva i risultati correnti (inclusi filtri e ordinamento) come una nuova tabella nel workspace.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">
                                    Nome Tabella
                                </label>
                                <input
                                    type="text"
                                    value={newTableName}
                                    onChange={(e) => {
                                        setNewTableName(e.target.value);
                                        setSaveError(null);
                                    }}
                                    placeholder="es. clean_sales_data"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50"
                                    autoFocus
                                />
                                <p className="text-[10px] text-slate-500 mt-1">
                                    Usa solo lettere minuscole, numeri e underscore.
                                </p>
                                {saveError && (
                                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                                        <AlertCircle size={10} />
                                        {saveError}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => {
                                        setShowSaveModal(false);
                                        setNewTableName('');
                                        setSaveError(null);
                                    }}
                                    className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Annulla
                                </button>
                                <button
                                    onClick={handleSaveAsTable}
                                    disabled={!newTableName.trim() || isSaving}
                                    className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                                            Salvataggio...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={12} />
                                            Salva Tabella
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Chart Modal */}
            {showChartModal && (filteredResult || queryResult) && (
                <QuickChart
                    data={filteredResult || queryResult}
                    onClose={() => setShowChartModal(false)}
                />
            )}

            {/* Health Report Modal */}
            <HealthReportModal
                isOpen={showHealthModal}
                onClose={() => {
                    setShowHealthModal(false);
                    setHealthReport(null);
                    setHealthTableName(null);
                }}
                report={healthReport}
                tableName={healthTableName || ''}
            />
        </div>
    );
};

export default DataLab;
