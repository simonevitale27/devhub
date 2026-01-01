
import React, { useState } from 'react';
import { TableSchema } from '../types';
import { Table as TableIcon, ChevronRight, ChevronDown, Eye, Columns, Hash, Type as TypeIcon, Calendar, ToggleLeft, Maximize2, Copy } from 'lucide-react';
import { getTablePreview } from '../services/sqlService';

interface SchemaViewerProps {
  schemas: TableSchema[];
  onInspect?: (schema: TableSchema) => void;
  onColumnClick?: (columnName: string) => void;
  onTableClick?: (tableName: string) => void;
}

const SchemaViewer: React.FC<SchemaViewerProps> = ({ schemas, onInspect, onColumnClick, onTableClick }) => {
  const [expandedTable, setExpandedTable] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleExpand = (tableName: string) => {
    if (expandedTable === tableName) {
      setExpandedTable(null);
    } else {
      setExpandedTable(tableName);
      setPreviewData(getTablePreview(tableName));
    }
  };

  const getIconForType = (type: string) => {
      if (type.includes('INT') || type.includes('DECIMAL')) return <Hash size={12} className="text-blue-400"/>;
      if (type.includes('DATE')) return <Calendar size={12} className="text-amber-400"/>;
      if (type.includes('BOOLEAN')) return <ToggleLeft size={12} className="text-purple-400"/>;
      return <TypeIcon size={12} className="text-emerald-400"/>;
  }

  return (
    <div className="space-y-2">
      {schemas.map((schema) => {
        const isExpanded = expandedTable === schema.tableName;
        
        return (
          <div key={schema.tableName} className="bg-[#121212]/60 backdrop-blur-xl rounded-lg overflow-hidden transition-all duration-200 hover:bg-[#181818]/60">
            
            {/* Table Header */}
            <button 
                onClick={() => handleExpand(schema.tableName)}
                className={`w-full px-4 py-3 flex items-center justify-between transition-all duration-300 rounded-lg ${
                  isExpanded 
                    ? 'bg-gradient-to-b from-blue-500/30 to-blue-600/5 backdrop-blur-xl border border-white/5 shadow-[0_0_15px_rgba(59,130,246,0.2)_inset] shadow-blue-500/10' 
                    : 'bg-[#121212]/60 backdrop-blur-xl hover:bg-white/5 shadow-lg shadow-black/40'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-md transition-all duration-300 ${isExpanded ? 'bg-blue-600/20 text-blue-400 scale-110' : 'bg-[#1a1a1a] text-slate-400 scale-100'}`}>
                    <TableIcon size={14} />
                </div>
                <div className="flex flex-col items-start">
                    <span className={`font-semibold text-sm transition-colors duration-200 ${isExpanded ? 'text-white' : 'text-slate-300'}`}>{schema.tableName}</span>
                </div>
                {/* Copy Table Name Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTableClick?.(schema.tableName);
                  }}
                  className="p-1.5 rounded-md bg-[#1a1a1a] text-slate-400 hover:text-blue-400 hover:bg-blue-600/20 transition-all duration-200 active:scale-95"
                  title={`Inserisci "${schema.tableName}" nella query`}
                >
                  <Copy size={12} />
                </button>
              </div>
              <ChevronDown 
                size={14} 
                className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
              />
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="bg-[#0a0a0a]/60 backdrop-blur-sm p-3 space-y-4 animate-in slide-in-from-top-2 fade-in duration-300">
                
                {/* Columns Grid */}
                <div className="animate-in fade-in duration-300 delay-75">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Columns size={10} /> Colonne
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {schema.columns.map((col, idx) => (
                        <button 
                          key={col.name} 
                          onClick={() => onColumnClick?.(col.name)}
                          className="flex items-center gap-2 text-xs bg-[#0a0a0a] p-1.5 rounded animate-in fade-in slide-in-from-left-2 duration-200 hover:bg-blue-500/10 hover:border hover:border-blue-500/30 transition-all cursor-pointer active:scale-95"
                          style={{ animationDelay: `${idx * 30}ms` }}
                          title={`Clicca per inserire "${col.name}" nella query`}
                        >
                            {getIconForType(col.type)}
                            <span className="text-slate-300 font-medium hover:text-blue-300 transition-colors">{col.name}</span>
                        </button>
                        ))}
                    </div>
                </div>

                {/* Data Preview */}
                <div className="animate-in fade-in duration-300 delay-150">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Eye size={10} /> Anteprima Dati
                    </div>
                    <div className="overflow-x-auto rounded bg-[#0a0a0a]/80 backdrop-blur-sm shadow-inner">
                        <table className="w-full text-[10px] text-left text-slate-400 whitespace-nowrap">
                            <thead className="bg-slate-900 text-slate-300 font-mono">
                                <tr>
                                    {schema.columns.map(c => (
                                        <th key={c.name} className="px-2 py-1.5 font-medium">{c.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="font-mono">
                                {previewData.map((row, idx) => (
                                    <tr 
                                      key={idx} 
                                      className="hover:bg-[#0a0a0a]/40 transition-colors duration-150"
                                    >
                                        {schema.columns.map(c => (
                                            <td key={c.name} className="px-2 py-1">
                                                {row[c.name] === null ? <span className="text-red-500 opacity-60">NULL</span> : String(row[c.name]).substring(0, 15)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Explore Table Button */}
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-200">
                  <button
                    onClick={() => onInspect?.(schema)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-b from-blue-500/30 to-blue-600/5 backdrop-blur-xl border border-white/10 shadow-[0_0_15px_rgba(59,130,246,0.4)_inset] shadow-lg shadow-blue-500/20 rounded-lg text-blue-300 hover:text-blue-200 text-sm font-semibold transition-all duration-300 hover:from-blue-500/40 hover:to-blue-600/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)_inset] active:scale-95"
                  >
                    <Maximize2 size={14} />
                    Esplora Tabella
                  </button>
                </div>

              </div>
            )}
          </div>
        );
      })}


    </div>
  );
};

export default SchemaViewer;
