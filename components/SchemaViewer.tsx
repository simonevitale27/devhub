
import React, { useState } from 'react';
import { TableSchema } from '../types';
import { Table as TableIcon, ChevronRight, ChevronDown, Eye, Columns, Hash, Type as TypeIcon, Calendar, ToggleLeft, Maximize2 } from 'lucide-react';
import { getTablePreview } from '../services/sqlService';
import TableInspectorModal from './TableInspectorModal';

interface SchemaViewerProps {
  schemas: TableSchema[];
}

const SchemaViewer: React.FC<SchemaViewerProps> = ({ schemas }) => {
  const [expandedTable, setExpandedTable] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [inspectorTable, setInspectorTable] = useState<TableSchema | null>(null);

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
          <div key={schema.tableName} className="border border-slate-700 rounded-lg bg-slate-800/30 overflow-hidden transition-all duration-200 hover:border-slate-600">
            
            {/* Table Header */}
            <button 
                onClick={() => handleExpand(schema.tableName)}
                className={`w-full px-4 py-3 flex items-center justify-between transition-all duration-300 ${isExpanded ? 'bg-slate-800' : 'hover:bg-slate-800/50'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-md transition-all duration-300 ${isExpanded ? 'bg-blue-600 text-white scale-110' : 'bg-slate-700 text-slate-400 scale-100'}`}>
                    <TableIcon size={14} />
                </div>
                <div className="flex flex-col items-start">
                    <span className={`font-semibold text-sm transition-colors duration-200 ${isExpanded ? 'text-white' : 'text-slate-300'}`}>{schema.tableName}</span>
                </div>
              </div>
              <ChevronDown 
                size={14} 
                className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
              />
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="border-t border-slate-700 bg-slate-900/50 p-3 space-y-4 animate-in slide-in-from-top-2 fade-in duration-300">
                
                {/* Columns Grid */}
                <div className="animate-in fade-in duration-300 delay-75">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Columns size={10} /> Colonne
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {schema.columns.map((col, idx) => (
                        <div 
                          key={col.name} 
                          className="flex items-center gap-2 text-xs bg-slate-900 p-1.5 rounded border border-slate-800 animate-in fade-in slide-in-from-left-2 duration-200"
                          style={{ animationDelay: `${idx * 30}ms` }}
                        >
                            {getIconForType(col.type)}
                            <span className="text-slate-300 font-medium">{col.name}</span>
                        </div>
                        ))}
                    </div>
                </div>

                {/* Data Preview */}
                <div className="animate-in fade-in duration-300 delay-150">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Eye size={10} /> Anteprima Dati
                    </div>
                    <div className="overflow-x-auto rounded border border-slate-700 bg-slate-950 shadow-inner">
                        <table className="w-full text-[10px] text-left text-slate-400 whitespace-nowrap">
                            <thead className="bg-slate-900 text-slate-300 font-mono">
                                <tr>
                                    {schema.columns.map(c => (
                                        <th key={c.name} className="px-2 py-1.5 border-b border-slate-800 font-medium">{c.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="font-mono">
                                {previewData.map((row, idx) => (
                                    <tr 
                                      key={idx} 
                                      className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors duration-150"
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
                    onClick={() => setInspectorTable(schema)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 hover:border-blue-500 rounded-lg text-blue-300 hover:text-white text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
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

      {/* Inspector Modal */}
      {inspectorTable && (
        <TableInspectorModal
          tableName={inspectorTable.tableName}
          schema={inspectorTable}
          onClose={() => setInspectorTable(null)}
        />
      )}
    </div>
  );
};

export default SchemaViewer;
