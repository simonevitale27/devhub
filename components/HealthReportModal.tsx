import React, { useState } from 'react';
import { X, Activity, AlertCircle, AlertTriangle, Copy, CheckCircle, ChevronRight, CheckSquare } from 'lucide-react';
import { DataHealthReport, ColumnIssue } from '../utils/dataHealthCheck';

interface HealthReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: DataHealthReport | null;
    tableName: string;
}

const HealthReportModal: React.FC<HealthReportModalProps> = ({
    isOpen,
    onClose,
    report,
    tableName
}) => {
    const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set());

    if (!isOpen || !report) return null;

    const toggleIssue = (index: number) => {
        setExpandedIssues(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    // Determine health score color
    const getScoreColor = (score: number): string => {
        if (score > 80) return 'text-green-500';
        if (score >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getScoreGlow = (score: number): string => {
        if (score > 80) return 'shadow-green-500/20';
        if (score >= 50) return 'shadow-yellow-500/20';
        return 'shadow-red-500/20';
    };

    // Group issues by column
    const issuesByColumn: Record<string, ColumnIssue[]> = {};
    report.issues.forEach(issue => {
        if (!issuesByColumn[issue.columnName]) {
            issuesByColumn[issue.columnName] = [];
        }
        issuesByColumn[issue.columnName].push(issue);
    });

    const getIssueIcon = (issueType: string) => {
        switch (issueType) {
            case 'format_error':
                return <AlertTriangle size={14} className="text-yellow-400" />;
            case 'null_values':
                return <AlertCircle size={14} className="text-blue-400" />;
            case 'duplicates':
                return <Copy size={14} className="text-purple-400" />;
            default:
                return <AlertCircle size={14} className="text-slate-400" />;
        }
    };

    const getSeverityBadge = (severity: string) => {
        const colors = {
            high: 'bg-red-500/20 text-red-300 border-red-500/30',
            medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
            low: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
        };
        return colors[severity as keyof typeof colors] || colors.low;
    };

    return (
        <>
            {/* Overlay */}
            <div 
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-200"
                onClick={onClose}
            >
                {/* Modal Content */}
                <div 
                    className="relative z-50 bg-[#121212]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-gradient-to-r from-cyan-900/20 to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                                <Activity size={20} className="text-cyan-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Report Salute Dati</h2>
                                <p className="text-xs text-slate-400 font-mono">{tableName}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(85vh - 80px)' }}>
                        <div className="p-6 space-y-8">
                            
                            {/* Data Overview Section */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Activity size={18} className="text-cyan-400" />
                                    Panoramica Qualità Dati
                                </h3>
                                
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    {/* Completeness Card */}
                                    <div className="bg-black/40 border border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <CheckCircle size={40} className="text-blue-400" />
                                        </div>
                                        <div className="text-sm text-slate-400 font-medium mb-1">Completezza</div>
                                        <div className="text-3xl font-bold text-white mb-2">
                                            {Math.max(0, ((report.totalCells - report.issues.filter(i => i.issueType === 'null_values').reduce((acc, curr) => acc + curr.count, 0)) / report.totalCells * 100)).toFixed(1)}%
                                        </div>
                                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${Math.max(0, ((report.totalCells - report.issues.filter(i => i.issueType === 'null_values').reduce((acc, curr) => acc + curr.count, 0)) / report.totalCells * 100))}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-slate-500 mt-2">
                                            Celle compilate su {report.totalCells.toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Validity Card */}
                                    <div className="bg-black/40 border border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-green-500/30 transition-colors">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <CheckSquare size={40} className="text-green-400" />
                                        </div>
                                        <div className="text-sm text-slate-400 font-medium mb-1">Validità</div>
                                        <div className="text-3xl font-bold text-white mb-2">
                                            {Math.max(0, ((report.totalCells - report.issues.filter(i => i.issueType === 'format_error').reduce((acc, curr) => acc + curr.count, 0)) / report.totalCells * 100)).toFixed(1)}%
                                        </div>
                                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-green-500 rounded-full"
                                                style={{ width: `${Math.max(0, ((report.totalCells - report.issues.filter(i => i.issueType === 'format_error').reduce((acc, curr) => acc + curr.count, 0)) / report.totalCells * 100))}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-slate-500 mt-2">
                                            Celle con formato corretto
                                        </div>
                                    </div>

                                    {/* Uniqueness Card */}
                                    <div className="bg-black/40 border border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Copy size={40} className="text-purple-400" />
                                        </div>
                                        <div className="text-sm text-slate-400 font-medium mb-1">Unicità</div>
                                        <div className="text-3xl font-bold text-white mb-2">
                                            {Math.max(0, ((report.analyzedRows - report.duplicateRowCount) / report.analyzedRows * 100)).toFixed(1)}%
                                        </div>
                                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-purple-500 rounded-full"
                                                style={{ width: `${Math.max(0, ((report.analyzedRows - report.duplicateRowCount) / report.analyzedRows * 100))}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-slate-500 mt-2">
                                            Righe uniche su {report.analyzedRows.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Stats Grid */}
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="bg-white/5 border border-white/5 rounded-lg p-3 text-center">
                                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Righe Totali</div>
                                        <div className="text-xl font-bold text-white">{report.totalRows.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 rounded-lg p-3 text-center">
                                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Colonne</div>
                                        <div className="text-xl font-bold text-white">{report.totalColumns}</div>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 rounded-lg p-3 text-center">
                                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Celle Totali</div>
                                        <div className="text-xl font-bold text-white">{report.totalCells.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 rounded-lg p-3 text-center">
                                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Problemi</div>
                                        <div className={`text-xl font-bold ${report.issues.length > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                                            {report.issues.length}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sampling Notice */}
                            {report.wasSampled && (
                                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3">
                                    <AlertCircle size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-200">
                                        <strong>Nota:</strong> Dataset campionato. Statistiche basate sulle prime {report.analyzedRows.toLocaleString()} righe.
                                    </div>
                                </div>
                            )}

                            {/* Issues Section */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <AlertTriangle size={18} className="text-yellow-400" />
                                    Audit Log - Dettaglio Problemi
                                </h3>

                                    {Object.entries(issuesByColumn).map(([columnName, issues], groupIndex) => (
                                        <div key={groupIndex} className="space-y-2">
                                            {/* Column Header */}
                                            <div className="text-sm font-bold text-cyan-300 font-mono bg-cyan-900/10 px-3 py-1 rounded border-l-2 border-cyan-500">
                                                {columnName}
                                            </div>

                                            {/* Issues for this column */}
                                            {issues.map((issue, issueIndex) => {
                                                const globalIndex = groupIndex * 100 + issueIndex; // Unique index
                                                const isExpanded = expandedIssues.has(globalIndex);

                                                return (
                                                    <div 
                                                        key={issueIndex}
                                                        className="bg-black/20 border border-white/5 rounded-lg overflow-hidden hover:border-white/10 transition-colors"
                                                    >
                                                        {/* Issue Header - Clickable */}
                                                        <button
                                                            onClick={() => toggleIssue(globalIndex)}
                                                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                {getIssueIcon(issue.issueType)}
                                                                <div className="text-left">
                                                                    <div className="text-sm text-white font-medium">
                                                                        {issue.description}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${getSeverityBadge(issue.severity)}`}>
                                                                            {issue.severity}
                                                                        </span>
                                                                        <span className="text-xs text-slate-400">
                                                                            {issue.percentage.toFixed(1)}% dei dati
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <ChevronRight 
                                                                size={16} 
                                                                className={`text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                                                            />
                                                        </button>

                                                        {/* Expanded Examples */}
                                                        {isExpanded && issue.examples.length > 0 && (
                                                            <div className="border-t border-white/5 bg-black/40 px-4 py-3 animate-in slide-in-from-top-2 duration-200">
                                                                <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                                                                    Esempi di valori errati:
                                                                </div>
                                                                <div className="space-y-1">
                                                                    {issue.examples.map((example, exIndex) => (
                                                                        <div 
                                                                            key={exIndex}
                                                                            className="bg-red-900/10 border border-red-500/20 rounded px-3 py-1.5 font-mono text-xs text-red-200"
                                                                        >
                                                                            {example}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HealthReportModal;
