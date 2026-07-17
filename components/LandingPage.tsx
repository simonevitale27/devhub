import React, { useState } from 'react';
import { Page } from '../types';
import { Hexagon, ArrowRight, Mail, Lock, User, Chrome, LogIn, Database, Terminal, BarChart3, Code2, Sparkles } from 'lucide-react';
import { signIn, signUp, signInWithGoogle, resetPassword } from '../services/authService';
import { setCurrentUser, syncBackendToLocal } from '../services/progressService';
import { useAuth } from '../contexts/AuthContext';
import { APP_VERSION } from '../version';

interface LandingPageProps {
    onNavigate: (page: Page) => void;
}

type AuthMode = 'landing' | 'login' | 'register' | 'forgot';

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    const { setGuestMode } = useAuth();
    const [authMode, setAuthMode] = useState<AuthMode>('landing');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGuestAccess = () => {
        // Guest mode: no user ID, data stored locally only
        setGuestMode();
        onNavigate(Page.Home);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { user, error: authError } = await signIn(email, password);
            if (authError) {
                setError(authError.message);
                return;
            }
            if (user) {
                setCurrentUser(user.id);
                await syncBackendToLocal(); // Load cloud progress
                onNavigate(Page.Home);
            }
        } catch (err: any) {
            setError(err.message || 'Errore durante il login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!username.trim()) {
            setError('Inserisci un nome utente');
            setIsLoading(false);
            return;
        }

        try {
            const { user, error: authError } = await signUp(email, password, username.trim());
            if (authError) {
                setError(authError.message);
                return;
            }
            if (user) {
                setCurrentUser(user.id);
                onNavigate(Page.Home);
            } else {
                setError('Controlla la tua email per confermare la registrazione.');
            }
        } catch (err: any) {
            setError(err.message || 'Errore durante la registrazione');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        const { error: authError } = await signInWithGoogle();
        if (authError) {
            setError(authError.message);
        }
        // Google OAuth will redirect, so no need to navigate here
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        if (!email.trim()) {
            setError('Inserisci la tua email');
            setIsLoading(false);
            return;
        }

        try {
            const { error: resetError } = await resetPassword(email);
            if (resetError) {
                setError(resetError.message);
            } else {
                setSuccessMessage('Ti abbiamo inviato un\'email con le istruzioni per reimpostare la password.');
            }
        } catch (err: any) {
            setError(err.message || 'Errore durante l\'invio dell\'email');
        } finally {
            setIsLoading(false);
        }
    };

    // Landing View
    if (authMode === 'landing') {
        return (
            <div className="min-h-dvh bg-transparent text-slate-200 font-sans flex flex-col relative overflow-hidden selection:bg-blue-500 selection:text-white">

                {/* Single refined accent, high up so the hero sits in its light */}
                <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[720px] bg-blue-600/10 rounded-full blur-[160px]"></div>

                {/* Top bar: brand mark + build */}
                <header className="relative z-10 flex items-center justify-between px-5 md:px-10 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="relative flex items-center justify-center">
                            <Hexagon size={22} className="text-blue-500 fill-blue-500/10" strokeWidth={2} />
                            <span className="absolute w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                        </div>
                        <span className="font-syne font-bold text-lg tracking-tight text-white">Dev<span className="text-blue-500">Hub</span></span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold tracking-[0.2em] text-slate-500">v{APP_VERSION}</span>
                </header>

                {/* Hero */}
                <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5 pb-20 -mt-6">

                    <div className="animate-rise inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-slate-300 mb-9 backdrop-blur-sm">
                        <Sparkles size={13} className="text-blue-400" /> Impara facendo, non guardando
                    </div>

                    <h1 className="animate-rise delay-1 text-display text-[clamp(3.5rem,12vw,7rem)] text-white mb-6 select-none">
                        DEV<span className="text-blue-500">HUB</span>
                    </h1>

                    <p className="animate-rise delay-2 text-base md:text-xl text-slate-400 max-w-xl leading-relaxed mb-9">
                        Allena SQL, Python e DAX in un editor dal vivo. Esercizi reali, correzione immediata, zero configurazione.
                    </p>

                    {/* Lab chips — signal what you actually practise here */}
                    <div className="animate-rise delay-2 flex flex-wrap items-center justify-center gap-2.5 mb-11">
                        {[
                            { Icon: Database, label: 'SQL', cls: 'text-blue-300 ring-blue-500/25 bg-blue-500/[0.06]' },
                            { Icon: Terminal, label: 'Python', cls: 'text-amber-300 ring-amber-500/25 bg-amber-500/[0.06]' },
                            { Icon: BarChart3, label: 'DAX', cls: 'text-yellow-300 ring-yellow-500/25 bg-yellow-500/[0.06]' },
                            { Icon: Code2, label: 'Data Lab', cls: 'text-emerald-300 ring-emerald-500/25 bg-emerald-500/[0.06]' },
                        ].map(({ Icon, label, cls }) => (
                            <span key={label} className={`inline-flex items-center gap-1.5 rounded-full ring-1 px-3 py-1.5 text-xs font-semibold ${cls}`}>
                                <Icon size={13} /> {label}
                            </span>
                        ))}
                    </div>

                    <div className="animate-rise delay-3 flex flex-col items-center gap-6">
                        <button
                            onClick={handleGuestAccess}
                            className="group relative px-9 md:px-11 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-base md:text-lg rounded-full transition-all duration-300 shadow-[0_10px_40px_-8px_rgba(37,99,235,0.5)] hover:shadow-[0_14px_48px_-8px_rgba(59,130,246,0.6)] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-3"
                        >
                            Prova come Ospite
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="flex items-center gap-4 text-sm">
                            <button
                                onClick={() => setAuthMode('login')}
                                className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 py-1"
                            >
                                <LogIn size={16} /> Accedi
                            </button>
                            <span className="text-slate-700">·</span>
                            <button
                                onClick={() => setAuthMode('register')}
                                className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 py-1"
                            >
                                <User size={16} /> Registrati
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Login / Register Form
    return (
        <div className="min-h-screen bg-transparent text-slate-200 font-sans flex flex-col items-center justify-center relative overflow-hidden selection:bg-blue-500 selection:text-white">
            
            {/* BACKGROUND */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <Hexagon 
                    size={600} 
                    className="absolute -top-40 -left-40 text-slate-800/30" 
                    strokeWidth={0.3} 
                />
            </div>

            {/* AMBIENT GLOW */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* FORM CONTAINER */}
            <div className="relative z-10 w-full max-w-md px-6">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Hexagon size={50} className="text-blue-600 fill-blue-600/10" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">
                        {authMode === 'login' ? 'Bentornato' : authMode === 'forgot' ? 'Password dimenticata' : 'Crea Account'}
                    </h2>
                    <p className="text-slate-400 text-sm">
                        {authMode === 'login' 
                            ? 'Accedi per sincronizzare i tuoi progressi'
                            : authMode === 'forgot'
                            ? 'Inserisci la tua email per ricevere le istruzioni'
                            : 'Registrati per salvare i tuoi progressi nel cloud'
                        }
                    </p>
                </div>

                {/* Form */}
                <form 
                    onSubmit={authMode === 'login' ? handleLogin : authMode === 'forgot' ? handleForgotPassword : handleRegister}
                    className="space-y-4"
                >
                    {/* Username (only for register) */}
                    {authMode === 'register' && (
                        <div className="relative">
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Nome utente"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                required
                            />
                        </div>
                    )}

                    {/* Email */}
                    <div className="relative">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            required
                        />
                    </div>

                    {/* Hide password field in forgot mode */}
                    {authMode === 'forgot' ? null : (
                    /* Password */
                    <div className="relative">
                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            required
                            minLength={6}
                        />
                    </div>
                    )}

                    {/* Forgot Password Link (login mode only) */}
                    {authMode === 'login' && (
                        <div className="text-right -mt-2">
                            <button
                                type="button"
                                onClick={() => { setAuthMode('forgot'); setError(''); setSuccessMessage(''); }}
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Password dimenticata?
                            </button>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {successMessage && (
                        <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm">
                            {successMessage}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                {authMode === 'login' ? 'Accedi' : authMode === 'forgot' ? 'Invia Email' : 'Registrati'}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-slate-700" />
                    <span className="text-slate-500 text-sm">oppure</span>
                    <div className="flex-1 h-px bg-slate-700" />
                </div>

                {/* Google Login */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full py-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-xl transition-all flex items-center justify-center gap-3"
                >
                    <Chrome size={20} />
                    Continua con Google
                </button>

                {/* Footer Links */}
                <div className="flex flex-col items-center gap-3 mt-8 text-sm">
                    {authMode === 'forgot' ? (
                        <button
                            onClick={() => { setAuthMode('login'); setError(''); setSuccessMessage(''); }}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            ← Torna al login
                        </button>
                    ) : (
                        <button
                            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            {authMode === 'login' 
                                ? 'Non hai un account? Registrati'
                                : 'Hai già un account? Accedi'
                            }
                        </button>
                    )}
                    <button
                        onClick={() => setAuthMode('landing')}
                        className="text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        ← Torna indietro
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
