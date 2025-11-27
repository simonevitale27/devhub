import React from 'react';
import { X, Table, Key, Link } from 'lucide-react';
import { TableSchema } from '../types';

interface SchemaERDiagramProps {
  schemas: TableSchema[];
  onClose: () => void;
}

const SchemaERDiagram: React.FC<SchemaERDiagramProps> = ({ schemas, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl w-[90%] max-w-5xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
              <Table className="text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Documentazione Database</h2>
              <p className="text-sm text-slate-400 mt-0.5">Schema completo delle tabelle e colonne</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Chiudi"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content - Table List */}
        <div className="flex-1 overflow-auto p-6 bg-[#0b1120] custom-scrollbar">
          <div className="space-y-6">
            {schemas.map((schema, idx) => (
              <div
                key={schema.tableName}
                className="bg-slate-900/50 border border-slate-800 rounded-lg p-5 hover:border-slate-700 transition-colors"
              >
                {/* Table Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 bg-blue-600/10 border border-blue-500/30 rounded-md">
                    <span className="text-blue-400 font-mono text-sm font-bold">{idx + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-mono">{schema.tableName}</h3>
                  <span className="text-xs text-slate-500 font-mono">
                    ({schema.columns.length} colonne)
                  </span>
                </div>

                {/* Columns List */}
                <div className="space-y-2">
                  {schema.columns.map((column) => {
                    const isPK = column.name === 'id';
                    const isFK = column.name.endsWith('_id');

                    return (
                      <div
                        key={column.name}
                        className="flex items-center gap-3 p-2.5 bg-slate-950/50 rounded border border-slate-800/50 hover:bg-slate-900/50 transition-colors"
                      >
                        {/* Column Name */}
                        <code className="flex-1 text-sm font-mono text-slate-200 font-semibold">
                          {column.name}
                        </code>

                        {/* Type */}
                        <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">
                          {column.type}
                        </span>

                        {/* Badges */}
                        <div className="flex gap-1.5">
                          {isPK && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-amber-600/10 border border-amber-500/30 rounded text-xs font-bold text-amber-400">
                              <Key size={12} />
                              PK
                            </div>
                          )}
                          {isFK && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-purple-600/10 border border-purple-500/30 rounded text-xs font-bold text-purple-400">
                              <Link size={12} />
                              FK
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0f172a] flex justify-between items-center">
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-amber-400">PK</span> = Primary Key | <span className="font-semibold text-purple-400">FK</span> = Foreign Key
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg transition-colors"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchemaERDiagram;
