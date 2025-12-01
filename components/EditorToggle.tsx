import React from 'react';
import { Code2, Database } from 'lucide-react';

interface EditorToggleProps {
    activeEditor: 'sql' | 'python';
    onToggle: (editor: 'sql' | 'python') => void;
    disabled?: boolean;
}

const EditorToggle: React.FC<EditorToggleProps> = ({ activeEditor, onToggle, disabled = false }) => {
    const isSql = activeEditor === 'sql';

    return (
        <div className="relative flex bg-[#121212]/70 backdrop-blur-xl rounded-xl p-1.5 shadow-lg shadow-black/20 w-64">
            {/* Sliding Pill */}
            <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-lg shadow-lg transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
                    isSql
                        ? "left-1.5 bg-gradient-to-b from-blue-500/30 to-blue-600/5 backdrop-blur-xl border border-white/15 shadow-[0_0_15px_rgba(59,130,246,0.2)_inset] shadow-blue-500/20"
                        : "left-[calc(50%+0px)] translate-x-0 bg-gradient-to-b from-purple-500/30 to-purple-600/5 backdrop-blur-xl border border-white/15 shadow-[0_0_15px_rgba(168,85,247,0.2)_inset] shadow-purple-500/20"
                }`}
            ></div>

            {/* SQL Button */}
            <button
                onClick={() => onToggle('sql')}
                disabled={disabled}
                className={`relative z-10 flex-1 text-[11px] font-black tracking-wider py-2 px-4 rounded-lg transition-colors text-center flex items-center justify-center gap-2 uppercase ${
                    isSql
                        ? "text-white text-shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
                <Database size={14} strokeWidth={2.5} /> SQL
            </button>

            {/* Python Button */}
            <button
                onClick={() => onToggle('python')}
                disabled={disabled}
                className={`relative z-10 flex-1 text-[11px] font-black tracking-wider py-2 px-4 rounded-lg transition-colors text-center flex items-center justify-center gap-2 uppercase ${
                    !isSql
                        ? "text-white text-shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
                <Code2 size={14} strokeWidth={2.5} /> PYTHON
            </button>
        </div>
    );
};

export default EditorToggle;
