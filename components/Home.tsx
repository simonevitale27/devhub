
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
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08] overflow-hidden">
                <Hexagon size={800} className="text-slate-400 animate-spin-slow origin-center" strokeWidth={0.5} />
            </div>

             {/* AMBIENT GLOW */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Navbar */}
            <nav className="h-24 px-8 md:px-16 flex items-center justify-between relative z-20 shrink-0">
                <DevHubLogo 
                    size={32} 
                    className="text-2xl text-white" 
                    text={<span>D<span className="text-blue-500">H</span></span>}
                />
                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] bg-white/5 backdrop-blur-md px-3 py-1 rounded-full ring-1 ring-white/20 shadow-lg">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">

                    {/* SQL GYM CARD */}
                    <button
                        onClick={() => onNavigate(Page.SqlGym)}
                        className="group relative h-72 bg-gradient-to-br from-blue-950/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 transition-all duration-500 flex flex-col items-center justify-center text-center hover:scale-105 shadow-2xl shadow-blue-900/30 hover:shadow-blue-500/30 ring-1 ring-blue-500/20 hover:ring-blue-400/40"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 transition-transform duration-500 ring-1 ring-blue-500/30">
                            <Database size={36} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight font-outfit group-hover:text-blue-300 transition-colors">SQL Lab</h2>
                        <p className="text-slate-300 text-base font-medium max-w-[220px] leading-relaxed group-hover:text-slate-100 transition-colors">
                            Esercizi pratici, scenari reali e database volatili.
                        </p>
                    </button>

                    {/* DATALAB CARD */}
                    <button
                        onClick={() => onNavigate(Page.DataLab)}
                        className="group relative h-72 bg-gradient-to-br from-emerald-950/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 transition-all duration-500 flex flex-col items-center justify-center text-center hover:scale-105 shadow-2xl shadow-emerald-900/30 hover:shadow-emerald-500/30 ring-1 ring-emerald-500/20 hover:ring-emerald-400/40"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform duration-500 ring-1 ring-emerald-500/30">
                            <Code2 size={36} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight font-outfit group-hover:text-emerald-300 transition-colors">DataLab</h2>
                        <p className="text-slate-300 text-base font-medium max-w-[220px] leading-relaxed group-hover:text-slate-100 transition-colors">
                            Carica CSV, interroga con SQL
                        </p>
                    </button>

                    {/* PYTHON GYM CARD (Placeholder) */}
                    <button
                        disabled
                        className="group relative h-72 bg-slate-900/30 backdrop-blur-sm rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-50 cursor-not-allowed grayscale hover:grayscale-0 transition-all duration-500 ring-1 ring-slate-700/30 col-span-1 md:col-span-2 max-w-sm mx-auto w-full"
                    >
                        <div className="absolute top-4 right-4 px-2.5 py-1 bg-slate-800/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider rounded-full">Coming Soon</div>
                        <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center text-slate-500 mb-4">
                            <Terminal size={28} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-400 mb-2 tracking-tight font-outfit">Python Lab</h2>
                        <p className="text-slate-500 text-sm font-medium max-w-[200px] leading-relaxed">
                            Data Science, Pandas & NumPy training.
                        </p>
                    </button>

                </div>

            </main>
        </div>
    );
};

export default Home;