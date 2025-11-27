import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { compareResults } from '../utils/sqlHelpers';

interface ResultDiffProps {
  userResult: any[];
  expectedResult: any[];
}

const ResultDiff: React.FC<ResultDiffProps> = ({ userResult, expectedResult }) => {
  const diffData = useMemo(() => {
    return compareResults(userResult, expectedResult);
  }, [userResult, expectedResult]);

  // Get all columns from both datasets
  const columns = useMemo(() => {
    const allColumns = new Set<string>();
    [...userResult, ...expectedResult].forEach(row => {
      Object.keys(row).forEach(key => allColumns.add(key));
    });
    return Array.from(allColumns);
  }, [userResult, expectedResult]);

  // Check if a cell is different
  const isCellDifferent = (rowIndex: number, column: string): boolean => {
    return diffData.differentCells.some(
      diff => diff.rowIndex === rowIndex && diff.column === column
    );
  };

  // Check if a row is missing or extra
  const isRowMissing = (row: any): boolean => {
    return diffData.missingRows.some(
      missingRow => JSON.stringify(missingRow) === JSON.stringify(row)
    );
  };

  const isRowExtra = (row: any): boolean => {
    return diffData.extraRows.some(
      extraRow => JSON.stringify(extraRow) === JSON.stringify(row)
    );
  };

  const TableView = ({ data, title, isUser }: { data: any[], title: string, isUser: boolean }) => {
    if (!data || data.length === 0) {
      return (
        <div className="flex-1 bg-slate-900 rounded-lg border border-slate-800 p-8 flex items-center justify-center">
          <div className="text-slate-500 italic text-sm">Nessun dato</div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
        <div className={`px-4 py-2 text-xs font-bold uppercase border-b ${isUser ? 'bg-orange-900/30 text-orange-400 border-orange-900/50' : 'bg-emerald-900/30 text-emerald-400 border-emerald-900/50'}`}>
          {title}
        </div>
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-mono text-slate-400 bg-slate-800 w-12 border-r border-slate-700">#</th>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-bold text-slate-300 uppercase tracking-wider whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-slate-900 divide-y divide-slate-800 font-mono text-xs">
              {data.map((row, idx) => {
                const missing = !isUser && isRowMissing(row);
                const extra = isUser && isRowExtra(row);
                const rowClass = missing 
                  ? 'bg-red-950/40 border-l-4 border-red-600' 
                  : extra 
                  ? 'bg-orange-950/40 border-l-4 border-orange-600'
                  : 'hover:bg-slate-800/50';

                return (
                  <tr key={idx} className={`transition-colors ${rowClass}`}>
                    <td className="px-4 py-2 text-slate-600 border-r border-slate-800 text-right select-none">
                      {idx + 1}
                    </td>
                    {columns.map((col) => {
                      const isDifferent = !missing && !extra && isCellDifferent(idx, col);
                      const cellClass = isDifferent 
                        ? 'bg-yellow-900/30 text-yellow-300 font-bold' 
                        : '';

                      return (
                        <td 
                          key={`${idx}-${col}`} 
                          className={`px-4 py-2 whitespace-nowrap text-slate-300 border-r border-slate-800/50 last:border-0 ${cellClass}`}
                        >
                          {row[col] === null ? (
                            <span className="text-red-400/70 italic">NULL</span>
                          ) : typeof row[col] === 'boolean' ? (
                            <span className={row[col] ? 'text-emerald-400' : 'text-red-400'}>{String(row[col])}</span>
                          ) : typeof row[col] === 'number' ? (
                            <span className="text-blue-300">{row[col]}</span>
                          ) : (
                            <span className="text-slate-300">{String(row[col])}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#0b1120] p-4 gap-4">
      {/* Summary Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex items-start gap-3">
        <AlertTriangle size={20} className="text-orange-400 shrink-0 mt-0.5" />
        <div className="flex-1 text-sm">
          <div className="font-bold text-white mb-1">Confronto Risultati</div>
          <div className="text-slate-400 space-y-1">
            {diffData.missingRows.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-red-600 rounded-sm"></span>
                <span><span className="font-mono text-red-400">{diffData.missingRows.length}</span> righe mancanti (nel risultato atteso ma non nel tuo)</span>
              </div>
            )}
            {diffData.extraRows.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-orange-600 rounded-sm"></span>
                <span><span className="font-mono text-orange-400">{diffData.extraRows.length}</span> righe extra (nel tuo risultato ma non attese)</span>
              </div>
            )}
            {diffData.differentCells.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-yellow-600 rounded-sm"></span>
                <span><span className="font-mono text-yellow-400">{diffData.differentCells.length}</span> celle con valori diversi</span>
              </div>
            )}
            {diffData.missingRows.length === 0 && diffData.extraRows.length === 0 && diffData.differentCells.length === 0 && (
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 size={16} />
                <span>I risultati coincidono perfettamente!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
        <TableView data={userResult} title="Il Tuo Risultato" isUser={true} />
        <TableView data={expectedResult} title="Risultato Atteso" isUser={false} />
      </div>
    </div>
  );
};

export default ResultDiff;
