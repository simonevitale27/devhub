
import React from 'react';
import { Page } from '../types';
import { Database, Code2, Hexagon, Terminal, Braces } from 'lucide-react';

interface HomeProps {
    onNavigate: (page: Page) => void;
}

// Modern Minimal Logo Component
const DevHubLogo = ({ 
    className, 
    size = 24, 
    dotClassName = "w-1.5 h-1.5", 
    showIcon = true,
    text = <span>DEV<span className="text-blue-500">HUB</span></span> 
}: { 
    className?: string, 
    size?: number, 
    dotClassName?: string, 
    showIcon?: boolean,
    text?: React.ReactNode
}) => (
    <div className={`flex items-center gap-2 font-black tracking-tighter select-none ${className}`}>
        {showIcon && (
            <div className="relative flex items-center justify-center">
                <Hexagon size={size} className="text-blue-600 fill-blue-600/10" strokeWidth={2.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`${dotClassName} bg-blue-400 rounded-full animate-pulse`}></div>
                </div>
            </div>
        )}
        {text}
    </div>
);

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen bg-transparent text-slate-200 font-sans flex flex-col relative overflow-y-auto">

            {/* BACKGROUND LOGO WATERMARK */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] overflow-hidden">
                <Hexagon size={800} className="text-slate-400 animate-spin-slow origin-center" strokeWidth={0.5} />
            </div>
            {/* Removed light beams for pure black stealth look */}

            {/* Navbar */}
            <nav className="h-24 px-8 md:px-16 flex items-center justify-between relative z-20 shrink-0">
                <DevHubLogo 
                    size={32} 
                    className="text-2xl text-white" 
                    text={<span>D<span className="text-blue-500">H</span></span>}
                />
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-white/5 backdrop-blur-md px-3 py-1 rounded-full ring-1 ring-white/10 shadow-lg">
                    Beta v1.0
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 pb-40">

                <div className="text-center mb-16 relative">
                    <DevHubLogo 
                        showIcon={false}
                        className="text-6xl md:text-8xl text-white drop-shadow-2xl" 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">

                    {/* SQL GYM CARD */}
                    <button
                        onClick={() => onNavigate(Page.SqlGym)}
                            className="group relative h-64 bg-[#121212]/40 backdrop-blur-xl rounded-3xl p-8 transition-all duration-500 flex flex-col items-center justify-center text-center hover:scale-105 shadow-2xl shadow-black/50 border border-white/10 hover:shadow-blue-500/20"
                    >
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform duration-500">
                            <Database size={28} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight font-outfit group-hover:text-blue-400 transition-colors">SQL Lab</h2>
                        <p className="text-slate-400 text-sm font-medium max-w-[200px] leading-relaxed group-hover:text-slate-300 transition-colors">
                            Esercizi pratici, scenari reali e database volatili.
                        </p>
                    </button>

                    {/* DATALAB CARD */}
                    <button
                        onClick={() => onNavigate(Page.DataLab)}
                        className="group relative h-64 bg-[#121212]/40 backdrop-blur-xl rounded-3xl p-8 transition-all duration-500 flex flex-col items-center justify-center text-center hover:scale-105 shadow-2xl shadow-black/50 border border-white/10 hover:shadow-emerald-500/20"
                    >
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform duration-500">
                            <Code2 size={28} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight font-outfit group-hover:text-emerald-400 transition-colors">DataLab</h2>
                        <p className="text-slate-400 text-sm font-medium max-w-[200px] leading-relaxed group-hover:text-slate-300 transition-colors">
                            Carica CSV, interroga con SQL, ricevi feedback AI.
                        </p>
                    </button>

                    {/* PYTHON GYM CARD (Placeholder) */}
                    <button
                        disabled
                        className="group relative h-64 bg-[#121212]/30 backdrop-blur-sm rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-40 cursor-not-allowed border border-white/5 grayscale hover:grayscale-0 transition-all duration-500"
                    >
                        <div className="absolute top-4 right-4 px-2 py-1 bg-slate-800/50 text-[9px] font-bold text-slate-400 uppercase tracking-wider rounded">Coming Soon</div>
                        <div className="w-16 h-16 bg-slate-800/30 rounded-2xl flex items-center justify-center text-slate-600 mb-4">
                            <Terminal size={28} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-500 mb-2 tracking-tight font-outfit">Python Lab</h2>
                        <p className="text-slate-600 text-sm font-medium max-w-[200px] leading-relaxed">
                            Data Science, Pandas & NumPy training.
                        </p>
                    </button>

                    {/* ANGULAR GYM CARD (Active but Disabled) */}
                    <button
                        disabled
                        className="group relative h-64 bg-[#121212]/30 backdrop-blur-sm rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-default border border-white/5 opacity-40"
                    >
                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-4">
                            <Braces size={28} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight font-outfit">Angular Lab</h2>
                        <p className="text-slate-400 text-sm font-medium max-w-[200px] leading-relaxed">
                            Frontend architecture & components.
                        </p>
                    </button>

                </div>

            </main>
        </div>
    );
};

export default Home;