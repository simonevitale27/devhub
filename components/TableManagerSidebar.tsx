import React, { useState } from 'react';
import { Table, Edit2, Trash2, ChevronRight, X, Hash, Type, Calendar, CheckSquare, Activity, FileJson, FileSpreadsheet, FileText, Copy, Check } from 'lucide-react';

export interface TableData {
    tableName: string;
    fileName: string;
    rowCount: number;
    headers: string[];
    rows: any[][];
    columnTypes?: Record<string, 'number' | 'string' | 'date' | 'boolean'>;
}

interface TableManagerSidebarProps {
    tables: Map<string, TableData>;
    onRenameTable: (oldName: string, newName: string) => void;
    onDeleteTable: (tableName: string) => void;
    onQueryTable: (tableName: string) => void;
    onInsertColumn: (columnName: string) => void;
    onRenameColumn: (tableName: string, oldName: string, newName: string) => void;
    onDeleteColumn: (tableName: string, columnName: string) => void;
    onHealthCheck: (tableName: string) => void;
}

const TableManagerSidebar: React.FC<TableManagerSidebarProps> = ({
    tables,
    onRenameTable,
    onDeleteTable,
    onQueryTable,
    onInsertColumn,
    onRenameColumn,
    onDeleteColumn,
    onHealthCheck
}) => {
    const [editingTable, setEditingTable] = useState<string | null>(null);
    const [newName, setNewName] = useState('');
    
    // Column editing state
    const [editingColumn, setEditingColumn] = useState<{table: string, col: string} | null>(null);
    const [newColName, setNewColName] = useState('');

    const handleStartEdit = (tableName: string) => {
        setEditingTable(tableName);
        setNewName(tableName);
    };

    const handleConfirmRename = (oldName: string) => {
        if (newName && newName !== oldName && !tables.has(newName)) {
            onRenameTable(oldName, newName);
            setEditingTable(null);
        }
    };

    const handleCancelEdit = () => {
        setEditingTable(null);
        setNewName('');
    };
    
    // Column handlers
    const handleStartEditColumn = (tableName: string, colName: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent insert trigger
        setEditingColumn({ table: tableName, col: colName });
        setNewColName(colName);
    };
    
    const handleConfirmRenameColumn = () => {
        if (editingColumn && newColName && newColName !== editingColumn.col) {
            onRenameColumn(editingColumn.table, editingColumn.col, newColName);
            setEditingColumn(null);
        }
    };
    
    const handleCancelEditColumn = () => {
        setEditingColumn(null);
        setNewColName('');
    };

    const [searchTerm, setSearchTerm] = useState('');

    const tableEntries = Array.from(tables.entries()).filter(([name]) => 
        name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
    const [copiedColumn, setCopiedColumn] = useState<string | null>(null);
    const [copiedPath, setCopiedPath] = useState<string | null>(null);

    const toggleTableExpansion = (tableName: string) => {
        setExpandedTables(prev => {
            const newSet = new Set(prev);
            if (newSet.has(tableName)) {
                newSet.delete(tableName);
            } else {
                newSet.add(tableName);
            }
            return newSet;
        });
    };

    const handleColumnClick = (columnName: string) => {
        // Auto-insert into editor
        onInsertColumn(columnName);
        
        // Also copy to clipboard for feedback
        navigator.clipboard.writeText(columnName);
        setCopiedColumn(columnName);
        setTimeout(() => setCopiedColumn(null), 2000);
    };

    // Helper to render type icon
    const renderTypeIcon = (type?: 'number' | 'string' | 'date' | 'boolean') => {
        switch (type) {
            case 'number':
                return <Hash size={10} className="text-cyan-400" />;
            case 'string':
                return <Type size={10} className="text-purple-400" />;
            case 'date':
                return <Calendar size={10} className="text-yellow-400" />;
            case 'boolean':
                return <CheckSquare size={10} className="text-green-400" />;
            default:
                return <Type size={10} className="text-slate-500" />;
        }
    };

    // Helper to get extension
    const getFileExtension = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (ext === 'csv') return { label: 'CSV', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
        if (ext === 'json') return { label: 'JSON', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' };
        if (ext === 'xlsx' || ext === 'xls') return { label: 'XLSX', color: 'text-green-400 bg-green-500/10 border-green-500/20' };
        return { label: ext?.toUpperCase() || 'FILE', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' };
    };

    const handleCopyPath = (fileName: string) => {
        const path = `/data/${fileName}`;
        navigator.clipboard.writeText(path);
        setCopiedPath(fileName);
        setTimeout(() => setCopiedPath(null), 2000);
    };

    return (
        <div className="h-full bg-[#121212]/60 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/20 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/5">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Table size={14} className="text-emerald-500" />
                    File Caricati
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-3">
                    {tables.size} {tables.size === 1 ? 'file' : 'file'}
                </p>
                
                {/* Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cerca file..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                </div>
            </div>

            {/* Table List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                {tableEntries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
                        <div className="w-12 h-12 rounded-xl bg-slate-800/30 flex items-center justify-center mb-3">
                            <Table size={24} className="text-slate-600" />
                        </div>
                        <p className="text-xs text-slate-500">
                            Nessuna tabella caricata
                        </p>
                        <p className="text-[10px] text-slate-600 mt-1">
                            Carica file CSV per iniziare
                        </p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {tableEntries.map(([tableName, tableData]) => (
                            <div
                                key={tableName}
                                className="group relative bg-black/20 hover:bg-white/5 rounded-lg transition-all duration-200 border border-transparent hover:border-emerald-500/20 overflow-hidden"
                            >
                                <div className="p-3">
                                    <div className="flex items-start gap-2">
                                        {/* Icon */}
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                                            <Table size={14} className="text-emerald-400" />
                                        </div>

                                        {/* Table Info */}
                                        <div className="flex-1 min-w-0">
                                            {editingTable === tableName ? (
                                                <div className="flex flex-col gap-2">
                                                    <input
                                                        type="text"
                                                        value={newName}
                                                        onChange={(e) => {
                                                            // Real-time sanitization: lowercase and replace spaces with underscores
                                                            const sanitized = e.target.value.toLowerCase().replace(/\s+/g, '_');
                                                            setNewName(sanitized);
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleConfirmRename(tableName);
                                                            } else if (e.key === 'Escape') {
                                                                handleCancelEdit();
                                                            }
                                                        }}
                                                        className="w-full px-2 py-1 bg-black/40 border border-emerald-500/50 rounded text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                                                        autoFocus
                                                    />
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => handleConfirmRename(tableName)}
                                                            className="flex-1 px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] rounded transition-colors"
                                                        >
                                                            Salva
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="flex-1 px-2 py-1 bg-slate-700/20 hover:bg-slate-700/30 text-slate-400 text-[10px] rounded transition-colors"
                                                        >
                                                            Annulla
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => onQueryTable(tableName)}
                                                        className="text-left w-full group/name"
                                                        title="Clicca per esplorare la tabella"
                                                    >
                                                        <div className="font-bold text-emerald-400 text-sm font-mono group-hover/name:text-emerald-300 transition-colors flex items-center gap-1">
                                                            {tableName}
                                                            <ChevronRight size={12} className="opacity-0 group-hover/name:opacity-100 transition-opacity" />
                                                        </div>
                                                    </button>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[10px] text-slate-500 bg-slate-800/30 px-1.5 py-0.5 rounded border border-slate-700/30">
                                                            {tableData.rowCount} {tableData.rowCount === 1 ? 'riga' : 'righe'}
                                                        </span>
                                                        
                                                        {/* Column Toggle */}
                                                        <button 
                                                            onClick={() => toggleTableExpansion(tableName)}
                                                            className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border transition-all duration-200 ${
                                                                expandedTables.has(tableName)
                                                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                                    : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-700/50 hover:text-slate-300'
                                                            }`}
                                                        >
                                                            <div className={`transform transition-transform duration-200 ${expandedTables.has(tableName) ? 'rotate-90' : ''}`}>
                                                                <ChevronRight size={10} />
                                                            </div>
                                                            {tableData.headers.length} col
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                    </div>
                                    
                                    {/* Extension Badge (Top Right) */}
                                    {editingTable !== tableName && (
                                        <div className={`absolute top-2 right-2 text-[9px] font-mono px-1 rounded border opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none ${getFileExtension(tableData.fileName).color}`}>
                                            {getFileExtension(tableData.fileName).label}
                                        </div>
                                    )}
                                </div>

                                {/* Actions (always visible) */}
                                {editingTable !== tableName && (
                                    <div className="flex items-center gap-1 px-3 pb-2 pt-0 transition-opacity justify-between border-t border-white/5 mt-1">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => onHealthCheck(tableName)}
                                                className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-900/20 rounded transition-colors group/btn relative"
                                            >
                                                <Activity size={12} />
                                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover/btn:opacity-100 transition-opacity delay-500 pointer-events-none whitespace-nowrap z-10 border border-white/10 shadow-lg">Analizza Salute</span>
                                            </button>
                                            <button
                                                onClick={() => handleStartEdit(tableName)}
                                                className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-900/20 rounded transition-colors group/btn relative"
                                            >
                                                <Edit2 size={12} />
                                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover/btn:opacity-100 transition-opacity delay-500 pointer-events-none whitespace-nowrap z-10 border border-white/10 shadow-lg">Rinomina</span>
                                            </button>
                                            <button
                                                onClick={() => handleCopyPath(tableData.fileName)}
                                                className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-900/20 rounded transition-colors group/btn relative"
                                            >
                                                {copiedPath === tableData.fileName ? <Check size={12} className="text-emerald-500"/> : <Copy size={12} />}
                                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover/btn:opacity-100 transition-opacity delay-500 pointer-events-none whitespace-nowrap z-10 border border-white/10 shadow-lg">
                                                    {copiedPath === tableData.fileName ? 'Copiato!' : 'Copia Percorso'}
                                                </span>
                                            </button>
                                        </div>
                                        
                                        <button
                                            onClick={() => onDeleteTable(tableName)}
                                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors group/btn relative"
                                        >
                                            <Trash2 size={12} />
                                            <span className="absolute bottom-full right-0 mb-1 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover/btn:opacity-100 transition-opacity delay-500 pointer-events-none whitespace-nowrap z-10 border border-white/10 shadow-lg">Elimina</span>
                                        </button>
                                    </div>
                                )}

                                {/* Columns Panel (Accordion) */}
                                {expandedTables.has(tableName) && (
                                    <div className="bg-black/40 border-t border-white/5 px-3 py-2 animate-in slide-in-from-top-2 duration-200">
                                        <div className="space-y-1">
                                            {tableData.headers.map((header) => (
                                                <div key={header} className="group/col flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 transition-colors">
                                                    
                                                    {editingColumn?.table === tableName && editingColumn?.col === header ? (
                                                        <div className="flex-1 flex flex-col gap-1.5">
                                                            <input
                                                                type="text"
                                                                value={newColName}
                                                                onChange={(e) => {
                                                                    const sanitized = e.target.value.replace(/\s+/g, '_');
                                                                    setNewColName(sanitized);
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') handleConfirmRenameColumn();
                                                                    if (e.key === 'Escape') handleCancelEditColumn();
                                                                }}
                                                                className="w-full px-2 py-1 bg-black/60 border border-emerald-500/50 rounded text-xs text-white font-mono focus:outline-none"
                                                                autoFocus
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                            <div className="flex gap-1">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleConfirmRenameColumn();
                                                                    }}
                                                                    className="flex-1 px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] rounded transition-colors"
                                                                >
                                                                    Salva
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCancelEditColumn();
                                                                    }}
                                                                    className="flex-1 px-2 py-1 bg-slate-700/20 hover:bg-slate-700/30 text-slate-400 text-[10px] rounded transition-colors"
                                                                >
                                                                    Annulla
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleColumnClick(header)}
                                                                className="flex-1 text-left flex items-center gap-2 overflow-hidden"
                                                                title="Clicca per inserire nella query"
                                                            >
                                                                {/* Type Icon */}
                                                                <div className="w-4 h-4 rounded flex items-center justify-center bg-white/5 group-hover/col:bg-white/10 transition-colors">
                                                                    {renderTypeIcon(tableData.columnTypes?.[header])}
                                                                </div>
                                                                
                                                                <span className="text-xs text-zinc-300 group-hover/col:text-white font-mono truncate transition-colors font-medium">
                                                                    {header}
                                                                </span>
                                                            </button>
                                                            
                                                            <div className="flex items-center gap-1 opacity-0 group-hover/col:opacity-100 transition-opacity">
                                                                {copiedColumn === header ? (
                                                                    <span className="text-[10px] text-emerald-400 font-bold animate-in fade-in zoom-in duration-200 mr-1">
                                                                        Inserito!
                                                                    </span>
                                                                ) : (
                                                                    <>
                                                                        <button
                                                                            onClick={(e) => handleStartEditColumn(tableName, header, e)}
                                                                            className="p-1 text-slate-500 hover:text-blue-400 transition-colors"
                                                                            title="Rinomina colonna"
                                                                        >
                                                                            <Edit2 size={10} />
                                                                        </button>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                if(confirm(`Eliminare colonna ${header}?`)) onDeleteColumn(tableName, header);
                                                                            }}
                                                                            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                                                                            title="Elimina colonna"
                                                                        >
                                                                            <Trash2 size={10} />
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TableManagerSidebar;
