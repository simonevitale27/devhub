import React from 'react';
import { Page } from '../types';
import { Database, Code2, Hexagon, Terminal, TrendingUp, BarChart3, ArrowRight } from 'lucide-react';
import UserBadge from './UserBadge';

interface HomeProps {
    onNavigate: (page: Page) => void;
}

// One entry per lab. Accent classes are written out in full (never string-built)
// so Tailwind's purge keeps them.
const LABS: {
    page: Page;
    Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
    name: string;
    desc: string;
    tile: string;   // icon tile ring/bg/text
    ring: string;   // card hover ring
    glow: string;   // hover glow gradient start
    cta: string;    // "Apri" colour
}[] = [
    {
        page: Page.SqlGym, Icon: Database, name: 'SQL Lab',
        desc: 'Query su un database reale in-browser, con correzione immediata e scenari sempre diversi.',
        tile: 'ring-blue-500/25 bg-blue-500/10 text-blue-300', ring: 'hover:ring-blue-400/40',
        glow: 'from-blue-500/[0.08]', cta: 'text-blue-300',
    },
    {
        page: Page.PythonGym, Icon: Terminal, name: 'Python Lab',
        desc: 'Dalle basi alle strutture dati, in un editor Python dal vivo con esecuzione reale.',
        tile: 'ring-amber-500/25 bg-amber-500/10 text-amber-300', ring: 'hover:ring-amber-400/40',
        glow: 'from-amber-500/[0.08]', cta: 'text-amber-300',
    },
    {
        page: Page.DaxGym, Icon: BarChart3, name: 'DAX Lab',
        desc: 'Preparazione Power BI PL-300: CALCULATE, filter context e time intelligence.',
        tile: 'ring-yellow-500/25 bg-yellow-500/10 text-yellow-300', ring: 'hover:ring-yellow-400/40',
        glow: 'from-yellow-500/[0.08]', cta: 'text-yellow-300',
    },
    {
        page: Page.DataLab, Icon: Code2, name: 'DataLab',
        desc: 'Importa i tuoi dati, analizzali con SQL o Python, crea grafici ed esporta.',
        tile: 'ring-emerald-500/25 bg-emerald-500/10 text-emerald-300', ring: 'hover:ring-emerald-400/40',
        glow: 'from-emerald-500/[0.08]', cta: 'text-emerald-300',
    },
];

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-dvh bg-transparent text-slate-200 font-sans flex flex-col relative overflow-y-auto overflow-x-hidden">

            {/* Signature hexagon, kept but dialled right down so it reads as a watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] overflow-hidden">
                <Hexagon size={820} className="text-slate-400 animate-spin-slow origin-center" strokeWidth={0.5} />
            </div>
            <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[620px] h-[620px] bg-blue-500/[0.07] rounded-full blur-[140px] pointer-events-none"></div>

            {/* Navbar */}
            <nav className="h-20 px-5 md:px-12 flex items-center justify-between relative z-20 shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="relative flex items-center justify-center">
                        <Hexagon size={26} className="text-blue-500 fill-blue-500/10" strokeWidth={2.25} />
                        <span className="absolute w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    </div>
                    <span className="font-bold text-lg tracking-[-0.03em] text-white">Dev<span className="text-blue-500">Hub</span></span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-white/[0.04] px-3 py-1.5 rounded-full ring-1 ring-white/10">
                        Beta
                    </span>
                    <UserBadge onNavigate={onNavigate} />
                </div>
            </nav>

            {/* Main */}
            <main className="flex-1 flex flex-col items-center px-5 md:px-6 relative z-10 pt-6 md:pt-4 md:justify-center pb-24">

                <div className="animate-rise text-center mb-10 md:mb-14">
                    <h1 className="text-display text-4xl md:text-6xl text-white mb-4">
                        Scegli il tuo <span className="text-blue-500">laboratorio</span>
                    </h1>
                    <p className="text-slate-400 text-base md:text-lg max-w-md mx-auto leading-relaxed">
                        Quattro palestre, un solo editor. Scrivi, esegui, correggi.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 w-full max-w-4xl">
                    {LABS.map((lab, i) => (
                        <button
                            key={lab.name}
                            onClick={() => onNavigate(lab.page)}
                            style={{ animationDelay: `${i * 70}ms` }}
                            className={`animate-rise group relative flex flex-col items-start text-left min-h-[188px] md:min-h-[236px] rounded-3xl p-6 md:p-7 bg-white/[0.02] ring-1 ring-white/[0.07] ${lab.ring} elev-2 transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${lab.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            <div className={`relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-2xl grid place-items-center ring-1 ${lab.tile} mb-5 group-hover:scale-105 transition-transform duration-300`}>
                                <lab.Icon size={26} strokeWidth={1.75} />
                            </div>
                            <h2 className="relative z-10 font-outfit text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">{lab.name}</h2>
                            <p className="relative z-10 text-slate-400 text-sm leading-relaxed mb-auto max-w-[42ch]">{lab.desc}</p>
                            <span className={`relative z-10 mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${lab.cta} opacity-70 group-hover:opacity-100 group-hover:gap-2.5 transition-all duration-300`}>
                                Apri <ArrowRight size={14} />
                            </span>
                        </button>
                    ))}
                </div>

                {/* Analytics — secondary */}
                <button
                    onClick={() => onNavigate(Page.Analytics)}
                    className="animate-rise delay-4 mt-8 md:mt-10 group flex items-center gap-2.5 px-5 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] rounded-full transition-all duration-300 ring-1 ring-white/10 hover:ring-purple-500/30 elev-1"
                >
                    <TrendingUp size={17} className="text-purple-400" />
                    <span className="text-slate-300 group-hover:text-white font-semibold text-sm">Dashboard Analytics</span>
                    <ArrowRight size={14} className="text-slate-500 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all" />
                </button>

            </main>
        </div>
    );
};

export default Home;
