import React, { useState, useMemo } from 'react';
import { TableSchema } from '../types';
import { X, Key, Link, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllTableData } from '../services/sqlService';
import { useDebounce } from '../utils/useDebounce';

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
  const PAGE_SIZE = 500;
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch all table data
  const allData = getAllTableData(tableName);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounce search for performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filter data based on search term (search across all columns)
  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return allData;
    
    const lowerSearch = debouncedSearchTerm.toLowerCase();
    return allData.filter((row) => {
      // Check if any column value contains the search term
      return schema.columns.some((col) => {
        const value = row[col.name];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowerSearch);
      });
    });
  }, [allData, debouncedSearchTerm, schema.columns]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, filteredData.length);
  
  const paginatedData = useMemo(() => {
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, startIndex, endIndex]);

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const totalRows = allData.length;
  const filteredRows = filteredData.length;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative bg-[#121212]/60 backdrop-blur-xl rounded-2xl w-full max-w-7xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 my-8 shadow-2xl shadow-black/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-[#0a0a0a]/80 to-transparent backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">
              {tableName}
            </h2>
            <span className="px-3 py-1 bg-gradient-to-b from-blue-500/30 to-blue-600/5 backdrop-blur-xl shadow-[0_0_15px_rgba(59,130,246,0.2)_inset] text-blue-300 text-xs font-bold rounded-full">
              {totalRows} {totalRows === 1 ? 'row' : 'rows'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Chiudi"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 bg-[#0a0a0a]/60 backdrop-blur-sm">
          <div className="relative">
            <Search 
              size={18} 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400"
            />
            <input
              type="text"
              placeholder="Cerca nei risultati..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0a0a]/80 backdrop-blur-xl border border-blue-500/30 rounded-xl text-sm py-3 pl-12 pr-10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:bg-[#0a0a0a] transition-all shadow-[0_0_20px_rgba(59,130,246,0.1)]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Cancella ricerca"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Pagination Controls */}
        {filteredData.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-6 py-2 bg-[#0a0a0a]/40 border-b border-white/5">
            <div className="text-xs text-slate-400">
              Righe {startIndex + 1}-{endIndex} di {filteredRows.toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 text-xs text-slate-300">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Table Body - Scrollable */}
        <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                <div className="bg-black/20 ring-1 ring-black/20 inset rounded-2xl overflow-hidden flex-1 flex flex-col min-h-0">
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
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/20 rounded text-[10px] font-bold text-amber-300"
                            title="Primary Key"
                          >
                            <Key size={10} />
                            PK
                          </span>
                        )}
                        {col.isForeignKey && (
                          <span 
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-500/20 rounded text-[10px] font-bold text-blue-300"
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
                {paginatedData.length === 0 ? (
                  <tr>
                    <td 
                      colSpan={schema.columns.length} 
                      className="px-4 py-8 text-center text-slate-500 italic"
                    >
                      {searchTerm ? 'Nessun risultato trovato' : 'Nessun dato disponibile'}
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, idx) => (
                    <tr key={startIndex + idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      {schema.columns.map((col) => (
                        <td 
                          key={col.name} 
                          className="px-4 py-2.5 whitespace-nowrap"
                        >
                          {row[col.name] === null || row[col.name] === undefined || row[col.name] === '' ? (
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
        <div className="px-6 py-3 bg-[#0a0a0a]/80 backdrop-blur-sm text-xs text-slate-500">
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

export default React.memo(TableInspectorModal);

