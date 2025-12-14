import React, { useState } from 'react';
import { X, Table, Key, Link, List, GitMerge } from 'lucide-react';
import { TableSchema } from '../types';
import ERDiagramView from './ERDiagramView';

interface SchemaERDiagramProps {
  schemas: TableSchema[];
  onClose: () => void;
}

type ViewMode = 'list' | 'diagram';

const SchemaERDiagram: React.FC<SchemaERDiagramProps> = ({ schemas, onClose }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#121212]/60 backdrop-blur-xl rounded-3xl flex flex-col max-h-[85vh] overflow-hidden w-full max-w-5xl my-8 shadow-2xl shadow-black/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-[#0a0a0a]/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
              <Table className="text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Documentazione Database</h2>
              <p className="text-sm text-slate-400 mt-0.5">Schema completo delle tabelle e colonne</p>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 mr-4">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <List size={16} />
              Lista
            </button>
            <button
              onClick={() => setViewMode('diagram')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'diagram'
                  ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <GitMerge size={16} />
              Diagramma ER
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Chiudi"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 custom-scrollbar">
          {viewMode === 'diagram' ? (
            <ERDiagramView schemas={schemas} />
          ) : (
            <div className="space-y-6">
              {schemas.map((schema, idx) => (
                <div
                  key={schema.tableName}
                  className="bg-[#121212]/60 backdrop-blur-xl rounded-lg p-5 hover:bg-[#181818]/60 transition-colors"
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
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0a0a0a]/95 backdrop-blur flex justify-between items-center">
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

