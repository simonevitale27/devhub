import React, { useState, useMemo } from 'react';
import { TableSchema } from '../types';
import { X, Key, Link, Search } from 'lucide-react';
import { getAllTableData } from '../services/sqlService';

interface TableInspectorModalProps {
  tableName: string;
  schema: TableSchema;
  onClose: () => void;
}

const TableInspectorModal: React.FC<TableInspectorModalProps> = ({ 
  tableName, 
  schema, 
  onClose 
}) => {
  // Fetch all table data
  const allData = getAllTableData(tableName);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data based on search term (search across all columns)
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return allData;
    
    const lowerSearch = searchTerm.toLowerCase();
    return allData.filter((row) => {
      // Check if any column value contains the search term
      return schema.columns.some((col) => {
        const value = row[col.name];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowerSearch);
      });
    });
  }, [allData, searchTerm, schema.columns]);

  const totalRows = allData.length;
  const filteredRows = filteredData.length;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative bg-[#0b1120] border border-slate-700 rounded-xl shadow-2xl w-full max-w-6xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-gradient-to-r from-blue-900/20 to-transparent">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">
              {tableName}
            </h2>
            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
              {totalRows} {totalRows === 1 ? 'row' : 'rows'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Chiudi"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b border-slate-700 bg-slate-900/30">
          <div className="relative">
            <Search 
              size={16} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Cerca nei risultati..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg text-sm py-2.5 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Cancella ricerca"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Table Body - Scrollable */}
        <div className="flex-1 overflow-auto p-4 bg-[#0f172a] custom-scrollbar">
          <div className="rounded-lg border border-slate-700 overflow-hidden shadow-lg">
            <table className="w-full text-sm text-left text-slate-300">
              {/* Fixed Header */}
              <thead className="bg-slate-900 text-slate-200 sticky top-0 z-10 shadow-md">
                <tr>
                  {schema.columns.map((col) => (
                    <th 
                      key={col.name} 
                      className="px-4 py-3 font-semibold border-b-2 border-slate-700 whitespace-nowrap"
                    >
                      <div className="flex items-center gap-2">
                        <span>{col.name}</span>
                        {col.isPrimaryKey && (
                          <span 
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/20 border border-amber-500/50 rounded text-[10px] font-bold text-amber-300"
                            title="Primary Key"
                          >
                            <Key size={10} />
                            PK
                          </span>
                        )}
                        {col.isForeignKey && (
                          <span 
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/50 rounded text-[10px] font-bold text-blue-300"
                            title="Foreign Key"
                          >
                            <Link size={10} />
                            FK
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body with Striped Rows */}
              <tbody className="font-mono text-xs">
                {filteredData.length === 0 ? (
                  <tr>
                    <td 
                      colSpan={schema.columns.length} 
                      className="px-4 py-8 text-center text-slate-500 italic"
                    >
                      {searchTerm ? 'Nessun risultato trovato' : 'Nessun dato disponibile'}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row, idx) => (
                    <tr 
                      key={idx} 
                      className={`border-b border-slate-800/50 hover:bg-blue-900/10 transition-colors ${
                        idx % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/50'
                      }`}
                    >
                      {schema.columns.map((col) => (
                        <td 
                          key={col.name} 
                          className="px-4 py-2.5 whitespace-nowrap"
                        >
                          {row[col.name] === null ? (
                            <span className="text-red-400 opacity-60 italic">NULL</span>
                          ) : (
                            <span className="text-slate-300">
                              {String(row[col.name])}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3 border-t border-slate-700 bg-slate-900/50 text-xs text-slate-500">
          {searchTerm ? (
            <>
              Mostrando <span className="text-blue-400 font-semibold">{filteredRows}</span> di {totalRows} righe • Schema: {schema.columns.length} colonne
            </>
          ) : (
            <>
              Mostrando {totalRows} righe totali • Schema: {schema.columns.length} colonne
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableInspectorModal;
