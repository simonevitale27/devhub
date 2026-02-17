import React from 'react';
import { Page } from '../types';
import { Database, Code2, Hexagon, Terminal, TrendingUp } from 'lucide-react';
import UserBadge from './UserBadge';

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
        <div className="min-h-screen bg-transparent text-slate-200 font-sans flex flex-col relative overflow-y-auto overflow-x-hidden">

            {/* BACKGROUND LOGO WATERMARK */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08] overflow-hidden">
                <Hexagon size={800} className="text-slate-400 animate-spin-slow origin-center" strokeWidth={0.5} />
            </div>

             {/* AMBIENT GLOW */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Navbar */}
            <nav className="h-20 md:h-24 px-4 md:px-16 flex items-center justify-between relative z-20 shrink-0">
                <DevHubLogo 
                    size={32} 
                    className="text-2xl text-white" 
                    text={<span>D<span className="text-blue-500">H</span></span>}
                />
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] bg-white/5 backdrop-blur-md px-3 py-1 rounded-full ring-1 ring-white/20 shadow-lg">
                        Beta v1.0
                    </div>
                    <UserBadge onNavigate={onNavigate} />
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center px-4 md:px-6 relative z-10 pt-4 md:pt-0 md:justify-center pb-20 md:pb-40">

                <div className="text-center mb-6 md:mb-16 relative">
                    <DevHubLogo 
                        showIcon={false}
                        className="text-6xl md:text-8xl text-white drop-shadow-2xl" 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 w-full max-w-6xl">

                    {/* SQL GYM CARD */}
                    <button
                        onClick={() => onNavigate(Page.SqlGym)}
                        className="group relative h-44 md:h-72 bg-gradient-to-br from-blue-950/50 to-slate-900/50 backdrop-blur-xl rounded-3xl transition-all duration-500 text-center hover:scale-105 shadow-2xl shadow-blue-900/30 hover:shadow-blue-500/30 ring-1 ring-blue-500/20 hover:ring-blue-400/40 overflow-hidden"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-4 md:top-10 left-1/2 -translate-x-1/2 w-12 h-12 md:w-16 md:h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-500 ring-1 ring-blue-500/30">
                            <Database size={30} strokeWidth={1.5} />
                        </div>
                        <h2 className="absolute top-[5rem] md:top-[8.5rem] left-0 right-0 text-xl md:text-3xl font-bold text-white tracking-tight font-outfit group-hover:text-blue-300 transition-colors">SQL Lab</h2>
                        <p className="absolute top-[6.5rem] md:top-[11rem] left-0 right-0 px-4 md:px-8 text-slate-300 text-xs md:text-base font-medium leading-relaxed group-hover:text-slate-100 transition-colors">
                            Esercizi pratici, scenari reali e database volatili.
                        </p>
                    </button>

                    {/* PYTHON LAB CARD */}
                    <button
                        onClick={() => onNavigate(Page.PythonGym)}
                        className="group relative h-44 md:h-72 bg-gradient-to-br from-amber-950/50 to-slate-900/50 backdrop-blur-xl rounded-3xl transition-all duration-500 text-center hover:scale-105 shadow-2xl shadow-amber-900/30 hover:shadow-amber-500/30 ring-1 ring-amber-500/20 hover:ring-amber-400/40 overflow-hidden"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-4 md:top-10 left-1/2 -translate-x-1/2 w-12 h-12 md:w-16 md:h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform duration-500 ring-1 ring-amber-500/30">
                            <Terminal size={30} strokeWidth={1.5} />
                        </div>
                        <h2 className="absolute top-[5rem] md:top-[8.5rem] left-0 right-0 text-xl md:text-3xl font-bold text-white tracking-tight font-outfit group-hover:text-amber-300 transition-colors">Python Lab</h2>
                        <p className="absolute top-[6.5rem] md:top-[11rem] left-0 right-0 px-4 md:px-8 text-slate-300 text-xs md:text-base font-medium leading-relaxed group-hover:text-slate-100 transition-colors">
                            Esercizi interattivi, dalle basi alle strutture dati.
                        </p>
                    </button>

                    {/* DATALAB CARD */}
                    <button
                        onClick={() => onNavigate(Page.DataLab)}
                        className="group relative h-44 md:h-72 bg-gradient-to-br from-emerald-950/50 to-slate-900/50 backdrop-blur-xl rounded-3xl transition-all duration-500 text-center hover:scale-105 shadow-2xl shadow-amber-900/30 hover:shadow-emerald-500/30 ring-1 ring-emerald-500/20 hover:ring-emerald-400/40 overflow-hidden"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-4 md:top-10 left-1/2 -translate-x-1/2 w-12 h-12 md:w-16 md:h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-500 ring-1 ring-emerald-500/30">
                            <Code2 size={30} strokeWidth={1.5} />
                        </div>
                        <h2 className="absolute top-[5rem] md:top-[8.5rem] left-0 right-0 text-xl md:text-3xl font-bold text-white tracking-tight font-outfit group-hover:text-emerald-300 transition-colors">DataLab</h2>
                        <p className="absolute top-[6.5rem] md:top-[11rem] left-0 right-0 px-4 md:px-8 text-slate-300 text-xs md:text-base font-medium leading-relaxed group-hover:text-slate-100 transition-colors">
                            Analizza dati con SQL e Python, crea grafici ed esporta.
                        </p>
                    </button>

                </div>

                {/* ANALYTICS BUTTON - Secondary, smaller */}
                <button
                    onClick={() => onNavigate(Page.Analytics)}
                    className="mt-6 md:mt-10 group flex items-center gap-3 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm rounded-full transition-all duration-300 ring-1 ring-slate-600/30 hover:ring-purple-500/30"
                >
                    <TrendingUp size={18} className="text-purple-400" />
                    <span className="text-slate-300 group-hover:text-white font-medium">Dashboard Analytics</span>
                </button>

            </main>
        </div>
    );
};

export default Home;