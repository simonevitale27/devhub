import React, { useState } from 'react';
import { Table, Edit2, Trash2, ChevronRight, X, Hash, Type, Calendar, CheckSquare } from 'lucide-react';

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
}

const TableManagerSidebar: React.FC<TableManagerSidebarProps> = ({
    tables,
    onRenameTable,
    onDeleteTable,
    onQueryTable,
    onInsertColumn,
    onRenameColumn,
    onDeleteColumn
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

    return (
        <div className="h-full bg-[#121212]/60 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/20 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/5">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Table size={14} className="text-emerald-500" />
                    Tabelle Attive
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-3">
                    {tables.size} {tables.size === 1 ? 'tabella' : 'tabelle'}
                </p>
                
                {/* Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cerca tabella..."
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
                                className="group bg-black/20 hover:bg-white/5 rounded-lg transition-all duration-200 border border-transparent hover:border-emerald-500/20 overflow-hidden"
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

                                        {/* Actions (always visible) */}
                                        {editingTable !== tableName && (
                                            <div className="flex items-center gap-1 transition-opacity">
                                                <button
                                                    onClick={() => handleStartEdit(tableName)}
                                                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-900/20 rounded transition-colors"
                                                    title="Rinomina tabella"
                                                >
                                                    <Edit2 size={12} />
                                                </button>
                                                <button
                                                    onClick={() => onDeleteTable(tableName)}
                                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                                    title="Elimina tabella"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Columns Panel (Accordion) */}
                                {expandedTables.has(tableName) && (
                                    <div className="bg-black/40 border-t border-white/5 px-3 py-2 animate-in slide-in-from-top-2 duration-200">
                                        <div className="space-y-1">
                                            {tableData.headers.map((header) => (
                                                <div key={header} className="group/col flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 transition-colors">
                                                    
                                                    {editingColumn?.table === tableName && editingColumn?.col === header ? (
                                                        <div className="flex-1 flex items-center gap-2">
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
                                                                className="w-full px-1 py-0.5 bg-black/60 border border-emerald-500/50 rounded text-xs text-white font-mono focus:outline-none"
                                                                autoFocus
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                            <button onClick={handleConfirmRenameColumn} className="text-emerald-400 hover:text-emerald-300"><Edit2 size={10}/></button>
                                                            <button onClick={handleCancelEditColumn} className="text-slate-400 hover:text-slate-300"><X size={10}/></button>
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
