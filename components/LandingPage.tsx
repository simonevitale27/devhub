import React, { useState } from 'react';
import { Page } from '../types';
import { Hexagon, ArrowRight, Mail, Lock, User, Chrome, LogIn } from 'lucide-react';
import { signIn, signUp, signInWithGoogle } from '../services/authService';
import { setCurrentUser, syncSupabaseToLocal } from '../services/progressService';
import { useAuth } from '../contexts/AuthContext';

interface LandingPageProps {
    onNavigate: (page: Page) => void;
}

type AuthMode = 'landing' | 'login' | 'register';

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    const { setGuestMode } = useAuth();
    const [authMode, setAuthMode] = useState<AuthMode>('landing');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
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
                await syncSupabaseToLocal(); // Load cloud progress
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

    // Landing View
    if (authMode === 'landing') {
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
                    <p className="text-lg md:text-xl text-slate-400 max-w-md mb-10 leading-relaxed">
                        Il tuo spazio di pratica per SQL, dati e sviluppo.
                    </p>

                    {/* GUEST ACCESS - PRIMARY */}
                    <button
                        onClick={handleGuestAccess}
                        className="group relative px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-full transition-all duration-300 shadow-2xl shadow-blue-600/30 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 flex items-center gap-3 mb-6"
                    >
                        Prova come Ospite
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* AUTH BUTTONS */}
                    <div className="flex items-center gap-4 text-sm">
                        <button
                            onClick={() => setAuthMode('login')}
                            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                        >
                            <LogIn size={16} />
                            Accedi
                        </button>
                        <span className="text-slate-600">|</span>
                        <button
                            onClick={() => setAuthMode('register')}
                            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                        >
                            <User size={16} />
                            Registrati
                        </button>
                    </div>

                    {/* VERSION BADGE */}
                    <div className="mt-16 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
                        Beta v1.0
                    </div>
                </div>
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
                        {authMode === 'login' ? 'Bentornato' : 'Crea Account'}
                    </h2>
                    <p className="text-slate-400 text-sm">
                        {authMode === 'login' 
                            ? 'Accedi per sincronizzare i tuoi progressi'
                            : 'Registrati per salvare i tuoi progressi nel cloud'
                        }
                    </p>
                </div>

                {/* Form */}
                <form 
                    onSubmit={authMode === 'login' ? handleLogin : handleRegister}
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

                    {/* Password */}
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

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                            {error}
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
                                {authMode === 'login' ? 'Accedi' : 'Registrati'}
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
                    <button
                        onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        {authMode === 'login' 
                            ? 'Non hai un account? Registrati'
                            : 'Hai già un account? Accedi'
                        }
                    </button>
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
