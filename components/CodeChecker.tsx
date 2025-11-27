import React, { useState } from 'react';
import { Home, Play, MessageSquare, AlertTriangle, CheckCircle2, Cpu, Zap, FileCode } from 'lucide-react';
import { analyzeCode } from '../services/mockAiService';

interface CodeCheckerProps {
    onBack: () => void;
}

const CodeChecker: React.FC<CodeCheckerProps> = ({ onBack }) => {
    const [language, setLanguage] = useState('SQL');
    const [context, setContext] = useState('');
    const [code, setCode] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleAnalyze = async () => {
        if (!code.trim()) return;
        setIsAnalyzing(true);
        setResult(null);
        const res = await analyzeCode(code, language, context);
        setResult(res);
        setIsAnalyzing(false);
    };

    return (
        <div className="flex h-screen bg-[#0f172a] text-slate-200 font-sans overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            {/* Left Panel: Input */}
            <div className="w-1/2 flex flex-col border-r border-slate-800">
                {/* Header */}
                <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0b1120]">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded transition-colors">
                            <Home size={18} />
                        </button>
                        <h2 className="font-bold text-lg text-white flex items-center gap-2">
                            <FileCode className="text-purple-500"/> Code Reviewer <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded border border-purple-900/50">AI SIM</span>
                        </h2>
                    </div>
                    
                    <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-purple-500"
                    >
                        <option value="SQL">SQL</option>
                        <option value="Python">Python</option>
                        <option value="DAX">DAX</option>
                    </select>
                </div>

                <div className="flex-1 flex flex-col p-6 gap-4 overflow-y-auto">
                    {/* Context Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <MessageSquare size={12} /> Contesto / Richiesta (Opzionale)
                        </label>
                        <textarea 
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            placeholder="Es: Calcola la media mobile ma ignora i valori nulli..."
                            className="w-full h-24 bg-[#1e293b]/50 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none placeholder-slate-600 transition-all"
                        />
                    </div>

                    {/* Code Input */}
                    <div className="flex-1 flex flex-col space-y-2 min-h-0">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Codice da Analizzare
                        </label>
                        <div className="flex-1 bg-[#0b1120] rounded-lg border border-slate-700 overflow-hidden relative group">
                             <textarea 
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder={`Incolla qui il tuo codice ${language}...`}
                                className="w-full h-full bg-transparent p-4 font-mono text-sm text-purple-100 outline-none resize-none"
                                spellCheck={false}
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !code.trim()}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2"
                    >
                        {isAnalyzing ? 'Analisi in corso...' : 'Avvia Code Review'}
                        {!isAnalyzing && <Play size={16} />}
                    </button>
                </div>
            </div>

            {/* Right Panel: Output */}
            <div className="w-1/2 bg-[#1e293b]/30 flex flex-col">
                <div className="h-16 border-b border-slate-800 flex items-center px-6 bg-[#0f172a]">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Report Revisione</span>
                </div>
                
                <div className="flex-1 p-8 overflow-y-auto">
                    {result ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            
                            {/* Header Verdict */}
                            <div className="flex items-start justify-between border-b border-slate-700 pb-6">
                                <div>
                                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Verdetto</div>
                                    <h1 className={`text-3xl font-black tracking-tight ${
                                        result.verdict === 'Funziona' ? 'text-emerald-400' : 
                                        result.verdict === 'Non funziona' ? 'text-red-400' : 'text-amber-400'
                                    }`}>
                                        {result.verdict.toUpperCase()}
                                    </h1>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Voto</div>
                                    <div className={`text-4xl font-mono font-bold ${result.score >= 7 ? 'text-emerald-400' : result.score >= 5 ? 'text-amber-400' : 'text-red-400'}`}>
                                        {result.score}<span className="text-lg text-slate-600">/10</span>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Cards */}
                            <div className="grid gap-6">
                                
                                {/* Correctness */}
                                <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-800">
                                    <h3 className="flex items-center gap-2 text-sm font-bold text-blue-400 uppercase mb-3">
                                        <CheckCircle2 size={16}/> Correttezza Funzionale
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed text-sm border-l-2 border-blue-500/50 pl-4">
                                        {result.correctness}
                                    </p>
                                </div>

                                {/* Style */}
                                <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-800">
                                    <h3 className="flex items-center gap-2 text-sm font-bold text-pink-400 uppercase mb-3">
                                        <FileCode size={16}/> Stile & Best Practices
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed text-sm border-l-2 border-pink-500/50 pl-4">
                                        {result.style}
                                    </p>
                                </div>

                                {/* Efficiency */}
                                <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-800">
                                    <h3 className="flex items-center gap-2 text-sm font-bold text-amber-400 uppercase mb-3">
                                        <Cpu size={16}/> Efficienza
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed text-sm border-l-2 border-amber-500/50 pl-4">
                                        {result.efficiency}
                                    </p>
                                </div>

                                 {/* Alternative */}
                                 <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-800">
                                    <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-400 uppercase mb-3">
                                        <Zap size={16}/> Alternativa Consigliata
                                    </h3>
                                    <div className="bg-[#0b1120] p-4 rounded border border-slate-800 mt-2">
                                        <code className="font-mono text-sm text-emerald-200 block whitespace-pre-wrap">
                                            {result.alternative}
                                        </code>
                                    </div>
                                </div>
                                
                                {/* Priorities */}
                                <div className="bg-purple-900/10 rounded-lg p-5 border border-purple-900/30">
                                    <h3 className="flex items-center gap-2 text-sm font-bold text-purple-400 uppercase mb-3">
                                        <AlertTriangle size={16}/> Priorità di Miglioramento
                                    </h3>
                                    <ul className="list-decimal list-inside space-y-2 text-sm text-slate-300">
                                        {result.priority.length > 0 ? result.priority.map((p: string, i: number) => (
                                            <li key={i} className="pl-2">{p}</li>
                                        )) : <li className="italic text-slate-500">Nessuna priorità critica.</li>}
                                    </ul>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                            <Cpu size={64} strokeWidth={1} className="mb-4" />
                            <p className="text-sm font-medium uppercase tracking-widest">In attesa di codice...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CodeChecker;