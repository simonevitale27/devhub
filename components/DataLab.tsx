import React, { useState, useRef } from 'react';
import { Home, Upload, Play, Code2, TrendingUp, FileSpreadsheet, AlertCircle, CheckCircle2, Cpu, Zap, FileCode, AlertTriangle, X } from 'lucide-react';
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
        <div className="flex h-screen bg-[#0f172a] text-slate-200 font-sans overflow-hidden">
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                
                {/* Header */}
                <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0b1120]">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded transition-colors">
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
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                            showAiCoach 
                                ? 'bg-purple-600 text-white' 
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                    >
                        {showAiCoach ? 'Nascondi' : 'Mostra'} AI Coach
                    </button>
                </div>

                {/* Content Area with Scroll */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">

                        {/* CSV UPLOAD SECTION */}
                        <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-6">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Upload size={14} />
                                Carica Dati CSV
                            </h3>

                            {!csvData ? (
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                                        isDragging 
                                            ? 'border-emerald-500 bg-emerald-500/10' 
                                            : 'border-slate-700 hover:border-slate-600'
                                    }`}
                                >
                                    <Upload className="mx-auto mb-4 text-slate-500" size={48} strokeWidth={1} />
                                    <p className="text-slate-400 mb-2">Trascina un file CSV qui</p>
                                    <p className="text-xs text-slate-600 mb-4">oppure</p>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-md transition-colors"
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
                                    <p className="text-xs text-slate-600 mt-4">Max 10MB</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* CSV Info */}
                                    <div className="bg-[#0b1120] rounded-lg p-4 border border-slate-800">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">File Caricato</div>
                                                <div className="text-white font-bold mt-1">{csvData.fileName}</div>
                                            </div>
                                            <button
                                                onClick={handleClearData}
                                                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                                title="Rimuovi file"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <div className="flex gap-6 text-sm">
                                            <div>
                                                <span className="text-slate-500">Righe:</span>
                                                <span className="text-emerald-400 font-bold ml-2">{csvData.rowCount}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500">Colonne:</span>
                                                <span className="text-emerald-400 font-bold ml-2">{csvData.headers.length}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview */}
                                    <div>
                                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Preview (primi 5 righi)</div>
                                        <div className="bg-[#0b1120] rounded-lg border border-slate-800 overflow-x-auto">
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr className="border-b border-slate-800">
                                                        {csvData.headers.map((header, i) => (
                                                            <th key={i} className="text-left p-3 font-bold text-emerald-400 whitespace-nowrap">
                                                                {header}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {csvData.rows.slice(0, 5).map((row, i) => (
                                                        <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                                                            {row.map((cell, j) => (
                                                                <td key={j} className="p-3 text-slate-300 whitespace-nowrap">
                                                                    {cell !== null && cell !== undefined ? String(cell) : '-'}
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
                        <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-6">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Code2 size={14} />
                                Editor SQL
                            </h3>

                            {csvData && (
                                <div className="text-xs text-blue-400 mb-3 bg-blue-900/20 border border-blue-900/50 rounded px-3 py-2">
                                    💡 Query sulla tabella: <code className="font-bold">my_data</code>
                                </div>
                            )}

                            <div className="bg-[#0b1120] rounded-lg border border-slate-700 overflow-hidden mb-4">
                                <textarea
                                    value={sqlQuery}
                                    onChange={(e) => setSqlQuery(e.target.value)}
                                    placeholder="Scrivi la tua query SQL qui..."
                                    className="w-full h-32 bg-transparent p-4 font-mono text-sm text-purple-100 outline-none resize-none"
                                    spellCheck={false}
                                />
                            </div>

                            <button
                                onClick={handleExecuteQuery}
                                disabled={isExecuting || !csvData}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
                            >
                                {isExecuting ? 'Esecuzione...' : 'Esegui Query'}
                                {!isExecuting && <Play size={16} />}
                            </button>
                        </div>

                        {/* ERROR MESSAGE */}
                        {error && (
                            <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-red-400 mb-1">Errore</div>
                                    <div className="text-sm text-slate-300">{error}</div>
                                </div>
                            </div>
                        )}

                        {/* QUERY RESULTS */}
                        {queryResult && queryResult.length > 0 && (
                            <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-6">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <TrendingUp size={14} />
                                    Risultati ({queryResult.length} {queryResult.length === 1 ? 'riga' : 'righe'})
                                </h3>
                                <div className="bg-[#0b1120] rounded-lg border border-slate-800 overflow-x-auto">
                                    <ResultsTable data={queryResult} />
                                </div>
                            </div>
                        )}

                        {queryResult && queryResult.length === 0 && (
                            <div className="bg-amber-900/20 border border-amber-900/50 rounded-lg p-4 text-center">
                                <p className="text-amber-400 text-sm">La query è stata eseguita correttamente ma non ha restituito risultati.</p>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* AI COACH SIDEBAR */}
            {showAiCoach && (
                <div className="w-96 border-l border-slate-800 bg-[#1e293b]/30 flex flex-col overflow-hidden">
                    <div className="h-16 border-b border-slate-800 flex items-center px-6 bg-[#0f172a]">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Cpu size={14} className="text-purple-500" />
                            AI Coach
                        </span>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto">
                        {aiAnalysis ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                
                                {/* Score Header */}
                                <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-800">
                                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Valutazione</div>
                                    <div className="flex items-baseline gap-2">
                                        <div className={`text-4xl font-mono font-bold ${
                                            aiAnalysis.score >= 7 ? 'text-emerald-400' : 
                                            aiAnalysis.score >= 5 ? 'text-amber-400' : 'text-red-400'
                                        }`}>
                                            {aiAnalysis.score}
                                        </div>
                                        <div className="text-lg text-slate-600">/10</div>
                                    </div>
                                    <div className={`text-sm font-bold mt-2 ${
                                        aiAnalysis.verdict === 'Funziona' ? 'text-emerald-400' : 
                                        aiAnalysis.verdict === 'Non funziona' ? 'text-red-400' : 'text-amber-400'
                                    }`}>
                                        {aiAnalysis.verdict}
                                    </div>
                                </div>

                                {/* Analysis Cards */}
                                <div className="space-y-4">
                                    
                                    {/* Correctness */}
                                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                                        <h4 className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase mb-2">
                                            <CheckCircle2 size={12}/> Correttezza
                                        </h4>
                                        <p className="text-slate-300 text-xs leading-relaxed">
                                            {aiAnalysis.correctness}
                                        </p>
                                    </div>

                                    {/* Style */}
                                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                                        <h4 className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase mb-2">
                                            <FileCode size={12}/> Stile
                                        </h4>
                                        <p className="text-slate-300 text-xs leading-relaxed">
                                            {aiAnalysis.style}
                                        </p>
                                    </div>

                                    {/* Efficiency */}
                                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                                        <h4 className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase mb-2">
                                            <Cpu size={12}/> Efficienza
                                        </h4>
                                        <p className="text-slate-300 text-xs leading-relaxed">
                                            {aiAnalysis.efficiency}
                                        </p>
                                    </div>

                                    {/* Alternative */}
                                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
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
                                        <div className="bg-purple-900/10 rounded-lg p-4 border border-purple-900/30">
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
