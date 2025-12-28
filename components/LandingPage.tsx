import React from 'react';
import { Page } from '../types';
import { Hexagon, ArrowRight } from 'lucide-react';

interface LandingPageProps {
    onNavigate: (page: Page) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen bg-transparent text-slate-200 font-sans flex flex-col items-center justify-center relative overflow-hidden selection:bg-blue-500 selection:text-white">
            
            {/* BACKGROUND HEXAGONS */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <Hexagon 
                    size={600} 
                    className="absolute -top-40 -left-40 text-slate-800/30 animate-pulse" 
                    strokeWidth={0.3} 
                />
                <Hexagon 
                    size={400} 
                    className="absolute -bottom-20 -right-20 text-blue-900/20" 
                    strokeWidth={0.5} 
                />
            </div>

            {/* AMBIENT GLOW */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>

            {/* CONTENT */}
            <div className="relative z-10 flex flex-col items-center text-center px-6">
                
                {/* LOGO */}
                <div className="relative mb-8">
                    <Hexagon size={80} className="text-blue-600 fill-blue-600/10" strokeWidth={1.5} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                    </div>
                </div>

                {/* TITLE */}
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 select-none">
                    DEV<span className="text-blue-500">HUB</span>
                </h1>

                {/* TAGLINE */}
                <p className="text-lg md:text-xl text-slate-400 max-w-md mb-12 leading-relaxed">
                    Il tuo spazio di pratica per SQL, dati e sviluppo.
                </p>

                {/* CTA BUTTON */}
                <button
                    onClick={() => onNavigate(Page.Home)}
                    className="group relative px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-full transition-all duration-300 shadow-2xl shadow-blue-600/30 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                    Inizia
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* VERSION BADGE */}
                <div className="mt-16 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
                    Beta v1.0
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
