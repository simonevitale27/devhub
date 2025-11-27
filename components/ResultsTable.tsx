import React from 'react';

interface ResultsTableProps {
  data: any[];
  title?: string;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ data, title }) => {
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

  return (
    <div className="flex flex-col h-full">
      {title && (
         <div className="bg-slate-800 px-4 py-2 text-xs font-bold text-slate-400 uppercase border-b border-slate-700 shrink-0">
            {title}
         </div>
      )}
      <div className="flex-1 overflow-auto bg-slate-900 custom-scrollbar">
        <table className="min-w-full divide-y divide-slate-800 text-sm relative">
            <thead className="bg-slate-800 sticky top-0 z-10 shadow-sm">
            <tr>
                <th className="px-4 py-3 text-left text-xs font-mono text-slate-400 bg-slate-800/90 backdrop-blur w-12 border-r border-slate-700">#</th>
                {columns.map((col) => (
                <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-bold text-slate-300 uppercase tracking-wider font-sans whitespace-nowrap"
                >
                    {col}
                </th>
                ))}
            </tr>
            </thead>
            <tbody className="bg-slate-900 divide-y divide-slate-800 font-mono text-xs">
            {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50 transition-colors group">
                <td className="px-4 py-2 text-slate-600 border-r border-slate-800 bg-slate-900 group-hover:bg-slate-800/50 text-right select-none">
                    {idx + 1}
                </td>
                {columns.map((col) => (
                    <td key={`${idx}-${col}`} className="px-4 py-2 whitespace-nowrap text-slate-300 border-r border-slate-800/50 last:border-0">
                    {row[col] === undefined ? (
                        <span className="text-slate-500 italic">-</span>
                    ) : row[col] === null ? (
                        <span className="text-red-400/70 italic">NULL</span>
                    ) : typeof row[col] === 'boolean' ? (
                        <span className={row[col] ? 'text-emerald-400' : 'text-red-400'}>{String(row[col])}</span>
                    ) : typeof row[col] === 'number' ? (
                        <span className="text-blue-300">{row[col]}</span>
                    ) : (
                        <span className="text-slate-300">{String(row[col])}</span>
                    )}
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;