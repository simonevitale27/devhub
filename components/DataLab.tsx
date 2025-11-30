import React, { useState, useRef } from 'react';
import { Home, Upload, Play, Code2, TrendingUp, FileSpreadsheet, AlertCircle, CheckCircle2, Cpu, Zap, FileCode, AlertTriangle, X, Eye } from 'lucide-react';
import { CsvData } from '../types';
import { parseCsvFile, loadCsvToAlaSQL, executeQuery } from '../utils/csvParser';
import { analyzeCode } from '../services/mockAiService';
import ResultsTable from './ResultsTable';

interface DataLabProps {
    onBack: () => void;
}

const DataLab: React.FC<DataLabProps> = ({ onBack }) => {
    const [csvData, setCsvData] = useState<CsvData | null>(null);
    const [sqlQuery, setSqlQuery] = useState('SELECT * FROM my_data LIMIT 10');
    const [queryResult, setQueryResult] = useState<any[] | null>(null);
    const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
    const [isExecuting, setIsExecuting] = useState(false);
    const [showAiCoach, setShowAiCoach] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle file drop
    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            await handleFileUpload(file);
        }
    };

    // Handle file selection
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await handleFileUpload(file);
        }
    };

    // Process CSV file upload
    const handleFileUpload = async (file: File) => {
        setError(null);
        try {
            const data = await parseCsvFile(file);
            loadCsvToAlaSQL(data);
            setCsvData(data);
            setQueryResult(null);
            setAiAnalysis(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Execute SQL query
    const handleExecuteQuery = async () => {
        if (!csvData) {
            setError('Carica prima un file CSV per eseguire query.');
            return;
        }
        if (!sqlQuery.trim()) {
            setError('Inserisci una query SQL valida.');
            return;
        }

        setIsExecuting(true);
        setError(null);
        setQueryResult(null);
        setAiAnalysis(null);

        try {
            // Execute query
            const result = executeQuery(sqlQuery);
            setQueryResult(result);

            // Run AI analysis on the query
            const analysis = await analyzeCode(sqlQuery, 'SQL', `Query su tabella: ${csvData.fileName}`);
            setAiAnalysis(analysis);
        } catch (err: any) {
            setError(err.message || 'Errore nell\'esecuzione della query.');
        } finally {
            setIsExecuting(false);
        }
    };

    // Clear current CSV data
    const handleClearData = () => {
        setCsvData(null);
        setQueryResult(null);
        setAiAnalysis(null);
        setSqlQuery('SELECT * FROM my_data LIMIT 10');
    };

    return (
        <div className="flex h-screen bg-transparent text-slate-200 font-sans overflow-hidden selection:bg-emerald-500 selection:text-white">
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 pl-6 pr-6 h-full">
                
                {/* Header */}
                <div className="h-16 flex items-center justify-between mt-4 mb-1 z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="h-[42px] w-[42px] flex items-center justify-center text-slate-400 hover:text-white bg-[#121212]/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/20 hover:bg-white/5 transition-all active:scale-95">
                            <Home size={18} />
                        </button>
                        <h2 className="font-bold text-lg text-white flex items-center gap-2">
                            <FileSpreadsheet className="text-emerald-500"/>
                            DataLab
                            <span className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded border border-emerald-900/50">CSV Sandbox</span>
                        </h2>
                    </div>
                    
                    <button
                        onClick={() => setShowAiCoach(!showAiCoach)}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all shadow-lg ${
                            showAiCoach 
                                ? 'bg-gradient-to-b from-purple-500/30 to-purple-600/5 backdrop-blur-xl border border-white/5 shadow-[0_0_15px_rgba(168,85,247,0.2)_inset] shadow-purple-500/10 text-purple-300' 
                                : 'bg-[#121212]/60 backdrop-blur-xl text-slate-400 hover:bg-white/5 shadow-black/20'
                        }`}
                    >
                        {showAiCoach ? 'Nascondi' : 'Mostra'} AI Coach
                    </button>
                </div>

                {/* Content Area with Scroll */}
                <div className="flex-1 overflow-y-auto pb-6 custom-scrollbar">
                    <div className="space-y-6">

                        {/* CSV UPLOAD SECTION */}
                        <div className="bg-[#121212]/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg shadow-black/20 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-colors duration-500"></div>
                            
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Upload size={14} className="text-emerald-500" />
                                Carica Dati CSV
                            </h3>

                            {!csvData ? (
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                                        isDragging 
                                            ? 'border-emerald-500 bg-emerald-500/10 scale-[1.02]' 
                                            : 'border-slate-700/50 hover:border-emerald-500/50 bg-black/20 hover:bg-black/30'
                                    }`}
                                >
                                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-500 ${isDragging ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800/50 text-slate-500'}`}>
                                        <Upload size={32} strokeWidth={1.5} />
                                    </div>
                                    <p className="text-slate-300 font-medium mb-2">Trascina un file CSV qui</p>
                                    <p className="text-xs text-slate-500 mb-6">oppure seleziona dal computer</p>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 transition-all active:scale-95 border border-white/10"
                                    >
                                        Scegli File
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <p className="text-[10px] text-slate-600 mt-4 uppercase tracking-widest">Max 10MB • UTF-8</p>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {/* CSV Info */}
                                    <div className="bg-black/20 rounded-xl p-4 ring-1 ring-black/20 inset flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                                <FileSpreadsheet size={20} />
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">File Caricato</div>
                                                <div className="text-white font-bold">{csvData.fileName}</div>
                                            </div>
                                            <div className="h-8 w-px bg-white/5 mx-2"></div>
                                            <div className="flex gap-6 text-sm">
                                                <div>
                                                    <span className="text-slate-500 text-xs uppercase tracking-wider block">Righe</span>
                                                    <span className="text-emerald-400 font-mono font-bold">{csvData.rowCount}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 text-xs uppercase tracking-wider block">Colonne</span>
                                                    <span className="text-emerald-400 font-mono font-bold">{csvData.headers.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleClearData}
                                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors group"
                                            title="Rimuovi file"
                                        >
                                            <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                                        </button>
                                    </div>

                                    {/* Preview */}
                                    <div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <Eye size={12} /> Preview (primi 5 righi)
                                        </div>
                                        <div className="bg-black/20 rounded-xl ring-1 ring-black/20 inset overflow-x-auto custom-scrollbar">
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr className="border-b border-white/5 bg-white/5">
                                                        {csvData.headers.map((header, i) => (
                                                            <th key={i} className="text-left p-3 font-bold text-emerald-400 whitespace-nowrap">
                                                                {header}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {csvData.rows.slice(0, 5).map((row, i) => (
                                                        <tr key={i} className="hover:bg-white/5 transition-colors">
                                                            {row.map((cell, j) => (
                                                                <td key={j} className="p-3 text-slate-300 whitespace-nowrap font-mono">
                                                                    {cell !== null && cell !== undefined ? String(cell) : <span className="text-slate-600">-</span>}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SQL EDITOR SECTION */}
                        <div className="bg-[#121212]/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg shadow-black/20 relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-colors duration-500"></div>
                            
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Code2 size={14} className="text-blue-500" />
                                    Editor SQL
                                </h3>
                                {csvData && (
                                    <div className="text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded px-2 py-1 font-mono">
                                        FROM <span className="font-bold text-blue-400">my_data</span>
                                    </div>
                                )}
                            </div>

                            <div className="bg-[#0b1120] rounded-xl border border-white/5 shadow-inner overflow-hidden mb-4 group focus-within:border-blue-500/50 transition-colors">
                                <textarea
                                    value={sqlQuery}
                                    onChange={(e) => setSqlQuery(e.target.value)}
                                    placeholder="Scrivi la tua query SQL qui..."
                                    className="w-full h-32 bg-transparent p-4 font-mono text-sm text-blue-100 outline-none resize-none placeholder-slate-600"
                                    spellCheck={false}
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleExecuteQuery}
                                    disabled={isExecuting || !csvData}
                                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none border border-white/10"
                                >
                                    {isExecuting ? 'Esecuzione...' : 'Esegui Query'}
                                    {!isExecuting && <Play size={14} fill="currentColor" />}
                                </button>
                            </div>
                        </div>

                        {/* ERROR MESSAGE */}
                        {error && (
                            <div className="bg-red-900/20 border border-red-900/50 rounded-xl p-4 flex items-start gap-3 shadow-lg animate-in slide-in-from-top-2">
                                <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-red-400 mb-1">Errore</div>
                                    <div className="text-sm text-slate-300">{error}</div>
                                </div>
                            </div>
                        )}

                        {/* QUERY RESULTS */}
                        {queryResult && queryResult.length > 0 && (
                            <div className="bg-[#121212]/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg shadow-black/20 animate-in slide-in-from-bottom-4 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-colors duration-500"></div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <TrendingUp size={14} className="text-purple-500" />
                                    Risultati ({queryResult.length} {queryResult.length === 1 ? 'riga' : 'righe'})
                                </h3>
                                <div className="bg-black/20 rounded-xl ring-1 ring-black/20 inset overflow-x-auto custom-scrollbar">
                                    <ResultsTable data={queryResult} />
                                </div>
                            </div>
                        )}

                        {queryResult && queryResult.length === 0 && (
                            <div className="bg-amber-900/20 border border-amber-900/50 rounded-xl p-4 text-center animate-in fade-in">
                                <p className="text-amber-400 text-sm font-medium">La query è stata eseguita correttamente ma non ha restituito risultati.</p>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* AI COACH SIDEBAR */}
            {showAiCoach && (
                <div className="w-96 bg-[#121212]/60 backdrop-blur-xl flex flex-col overflow-hidden mt-7 mb-3 mr-6 rounded-3xl z-20 h-[calc(100vh-3.25rem)] shadow-2xl border border-white/5 animate-in slide-in-from-right duration-300">
                    <div className="h-16 flex items-center px-6 border-b border-white/5 bg-white/5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Cpu size={14} className="text-purple-500" />
                            AI Coach
                        </span>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                        {aiAnalysis ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                
                                {/* Score Header */}
                                <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Cpu size={64} />
                                    </div>
                                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Valutazione</div>
                                    <div className="flex items-baseline gap-2 relative z-10">
                                        <div className={`text-4xl font-mono font-bold ${
                                            aiAnalysis.score >= 7 ? 'text-emerald-400' : 
                                            aiAnalysis.score >= 5 ? 'text-amber-400' : 'text-red-400'
                                        }`}>
                                            {aiAnalysis.score}
                                        </div>
                                        <div className="text-lg text-slate-600">/10</div>
                                    </div>
                                    <div className={`text-sm font-bold mt-2 relative z-10 ${
                                        aiAnalysis.verdict === 'Funziona' ? 'text-emerald-400' : 
                                        aiAnalysis.verdict === 'Non funziona' ? 'text-red-400' : 'text-amber-400'
                                    }`}>
                                        {aiAnalysis.verdict}
                                    </div>
                                </div>

                                {/* Analysis Cards */}
                                <div className="space-y-4">
                                    
                                    {/* Correctness */}
                                    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 hover:border-blue-500/30 transition-colors">
                                        <h4 className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase mb-2">
                                            <CheckCircle2 size={12}/> Correttezza
                                        </h4>
                                        <p className="text-slate-300 text-xs leading-relaxed">
                                            {aiAnalysis.correctness}
                                        </p>
                                    </div>

                                    {/* Style */}
                                    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 hover:border-pink-500/30 transition-colors">
                                        <h4 className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase mb-2">
                                            <FileCode size={12}/> Stile
                                        </h4>
                                        <p className="text-slate-300 text-xs leading-relaxed">
                                            {aiAnalysis.style}
                                        </p>
                                    </div>

                                    {/* Efficiency */}
                                    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 hover:border-amber-500/30 transition-colors">
                                        <h4 className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase mb-2">
                                            <Cpu size={12}/> Efficienza
                                        </h4>
                                        <p className="text-slate-300 text-xs leading-relaxed">
                                            {aiAnalysis.efficiency}
                                        </p>
                                    </div>

                                    {/* Alternative */}
                                    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 hover:border-emerald-500/30 transition-colors">
                                        <h4 className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase mb-2">
                                            <Zap size={12}/> Alternativa
                                        </h4>
                                        <div className="bg-[#0b1120] p-3 rounded border border-slate-800 mt-2">
                                            <code className="font-mono text-xs text-emerald-200 block whitespace-pre-wrap">
                                                {aiAnalysis.alternative}
                                            </code>
                                        </div>
                                    </div>

                                    {/* Priorities */}
                                    {aiAnalysis.priority && aiAnalysis.priority.length > 0 && (
                                        <div className="bg-purple-900/10 rounded-xl p-4 border border-purple-900/30">
                                            <h4 className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase mb-2">
                                                <AlertTriangle size={12}/> Priorità
                                            </h4>
                                            <ul className="list-decimal list-inside space-y-1 text-xs text-slate-300">
                                                {aiAnalysis.priority.map((p: string, i: number) => (
                                                    <li key={i} className="pl-1">{p}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                </div>

                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                                <Cpu size={48} strokeWidth={1} className="mb-4" />
                                <p className="text-xs font-medium uppercase tracking-widest text-center">
                                    Esegui una query per<br />ricevere feedback AI
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default DataLab;
