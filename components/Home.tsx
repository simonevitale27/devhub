
import React from 'react';
import { Page } from '../types';
import { Database, Code2, Hexagon, Terminal, Braces } from 'lucide-react';

interface HomeProps {
    onNavigate: (page: Page) => void;
}

// Modern Minimal Logo Component
const DevHubLogo = ({ className, size = 24 }: { className?: string, size?: number }) => (
    <div className={`flex items-center gap-2 font-black tracking-tighter select-none ${className}`}>
        <div className="relative flex items-center justify-center">
            <Hexagon size={size} className="text-blue-600 fill-blue-600/10" strokeWidth={2.5} />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
        </div>
        <span>DEV<span className="text-blue-500">HUB</span></span>
    </div>
);

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen bg-transparent text-slate-200 font-sans flex flex-col relative overflow-hidden">

            {/* BACKGROUND LOGO WATERMARK */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] overflow-hidden">
                <Hexagon size={800} className="text-slate-400 animate-spin-slow origin-center" strokeWidth={0.5} />
            </div>
            {/* Removed light beams for pure black stealth look */}

            {/* Navbar */}
            <nav className="h-24 px-8 md:px-16 flex items-center justify-between relative z-20">
                <DevHubLogo size={32} className="text-2xl text-white" />
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-white/5 backdrop-blur-md px-3 py-1 rounded-full ring-1 ring-white/10 shadow-lg">
                    Beta v1.0
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 pb-20">

                <div className="text-center mb-20 relative">
                    <h1 className="text-7xl md:text-8xl font-black font-sans text-white tracking-tighter animate-float drop-shadow-2xl">
                        MASTER YOUR <br />
                        <span className="text-blue-500">STACK</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">

                    {/* SQL GYM CARD */}
                    <button
                        onClick={() => onNavigate(Page.SqlGym)}
                            className="group relative h-64 bg-[#121212]/60 backdrop-blur-xl rounded-3xl p-8 transition-all duration-500 flex flex-col items-center justify-center text-center hover:scale-105 hover:bg-[#181818]/60"
                    >
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform duration-500 shadow-inner border border-blue-500/20">
                            <Database size={28} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight font-outfit">SQL Lab</h2>
                        <p className="text-slate-400 text-sm font-medium max-w-[200px] leading-relaxed">
                            Esercizi pratici, scenari reali e database volatili.
                        </p>

                        <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5 group-hover:ring-blue-500/30 transition-all duration-500"></div>
                    </button>

                    {/* DATALAB CARD */}
                    <button
                        onClick={() => onNavigate(Page.DataLab)}
                        className="group relative h-64 bg-white/5 backdrop-blur-2xl rounded-3xl p-8 transition-all duration-500 flex flex-col items-center justify-center text-center hover:scale-105 shadow-2xl shadow-black/20 hover:shadow-emerald-500/20 ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/10"
                    >
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform duration-500 shadow-inner border border-emerald-500/20">
                            <Code2 size={28} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight font-outfit">DataLab</h2>
                        <p className="text-slate-400 text-sm font-medium max-w-[200px] leading-relaxed">
                            Carica CSV, interroga con SQL, ricevi feedback AI.
                        </p>

                        <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5 group-hover:ring-emerald-500/30 transition-all duration-500"></div>
                    </button>

                    {/* PYTHON GYM CARD (Placeholder) */}
                    <button
                        disabled
                        className="group relative h-64 bg-white/5 backdrop-blur-sm rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-50 cursor-not-allowed ring-1 ring-white/5"
                    >
                        <div className="absolute top-4 right-4 px-2 py-1 bg-slate-800 text-[9px] font-bold text-slate-400 uppercase tracking-wider rounded">Coming Soon</div>
                        <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center text-slate-600 mb-4 border border-slate-700">
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
                        className="group relative h-64 bg-white/5 backdrop-blur-2xl rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-default ring-1 ring-white/10 shadow-2xl shadow-black/20"
                    >
                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-4 shadow-inner border border-red-500/20">
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