import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface ResultsTableProps {
  data: any[];
  title?: string;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ data, title }) => {
  const PAGE_SIZE = 500;
  const [currentPage, setCurrentPage] = useState(1);

  // Handle empty array or null/undefined
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-slate-500 italic">
        Nessun dato restituito dalla query.
      </div>
    );
  }

  // Ensure first row exists and has keys
  if (!data[0] || typeof data[0] !== 'object') {
    return (
      <div className="h-full flex items-center justify-center p-8 text-slate-500 italic">
        Formato dati non valido.
      </div>
    );
  }

  const columns = Object.keys(data[0]);
  
  if (columns.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-slate-500 italic">
        Nessuna colonna nei risultati.
      </div>
    );
  }

  // Pagination calculations
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, data.length);
  
  // Use useMemo to avoid recalculating on every render
  const paginatedData = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  const handleFirstPage = () => setCurrentPage(1);
  const handlePrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));
  const handleLastPage = () => setCurrentPage(totalPages);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      {title && (
        <div className="bg-slate-800 px-4 py-2 text-xs font-bold text-slate-400 uppercase border-b border-slate-700 shrink-0">
          {title}
        </div>
      )}
      
      {/* Pagination Header */}
      {data.length > PAGE_SIZE && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#0a0a0a] border-b border-white/5 shrink-0">
          <div className="text-xs text-slate-400">
            Righe {startIndex + 1}-{endIndex} di {data.length.toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleFirstPage}
              disabled={currentPage === 1}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Prima pagina"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Pagina precedente"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 text-xs text-slate-300">
              Pagina {currentPage} di {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Pagina successiva"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={handleLastPage}
              disabled={currentPage === totalPages}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Ultima pagina"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0a0a0a] sticky top-0 z-10">
            <tr className="border-b border-white/5">
              <th className="px-4 py-3 text-center text-slate-500 font-mono bg-[#0a0a0a] border-r border-white/5">
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left font-bold text-slate-400 uppercase tracking-wider font-sans whitespace-nowrap bg-[#0a0a0a] border-r border-white/5 last:border-0"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => {
              const actualRowIndex = startIndex + index;
              return (
                <tr
                  key={actualRowIndex}
                  className="hover:bg-white/5 transition-colors border-b border-white/5"
                >
                  <td className="px-4 py-2 text-slate-600 border-r border-white/5 bg-[#0a0a0a] text-right select-none font-mono">
                    {actualRowIndex + 1}
                  </td>
                  {columns.map((col) => (
                    <td
                      key={`${actualRowIndex}-${col}`}
                      className="px-4 py-2 whitespace-nowrap text-slate-300 border-r border-white/5 last:border-0 font-mono"
                    >
                      {row[col] === undefined ? (
                        <span className="text-slate-600 italic">-</span>
                      ) : row[col] === null ? (
                        <span className="text-slate-500 italic">NULL</span>
                      ) : typeof row[col] === 'boolean' ? (
                        <span className={row[col] ? 'text-white font-bold' : 'text-slate-500'}>
                          {String(row[col])}
                        </span>
                      ) : typeof row[col] === 'number' ? (
                        <span className="text-slate-200">{row[col]}</span>
                      ) : (
                        <span className="text-slate-300">{String(row[col])}</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(ResultsTable);