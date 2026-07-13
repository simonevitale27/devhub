import React, { useState } from 'react';
import { Hexagon, Lock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { pb } from '../services/pocketbaseClient';
import { Page } from '../types';

interface ResetPasswordPageProps {
  onNavigate: (page: Page) => void;
}

// PocketBase sends a reset link like /reset-password?token=... (see resetPasswordTemplate
// on the users collection). The token itself proves the request is legitimate — no
// active session is needed, unlike Supabase's magic-link-based recovery session.
function getResetToken(): string | null {
  return new URLSearchParams(window.location.search).get('token');
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigate }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [token] = useState<string | null>(getResetToken());

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Link non valido o scaduto');
      return;
    }

    if (password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri');
      return;
    }

    if (password !== confirmPassword) {
      setError('Le password non corrispondono');
      return;
    }

    setIsLoading(true);

    try {
      await pb.collection('users').confirmPasswordReset(token, password, confirmPassword);
      setSuccess(true);
      // Redirect to home after 3 seconds
      setTimeout(() => {
        onNavigate(Page.Home);
      }, 3000);
    } catch (err: any) {
      setError(err?.response?.message || err.message || 'Errore durante l\'aggiornamento della password. Il link potrebbe essere scaduto.');
    } finally {
      setIsLoading(false);
    }
  };

  // Invalid/missing token state
  if (!token) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 text-center px-6 max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Link non valido</h1>
          <p className="text-slate-400 mb-8">
            Il link per reimpostare la password è scaduto o non è valido. 
            Richiedi un nuovo link dalla pagina di login.
          </p>
          <button
            onClick={() => onNavigate(Page.Landing)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all"
          >
            Torna al Login
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-green-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 text-center px-6 max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Password aggiornata!</h1>
          <p className="text-slate-400 mb-4">
            La tua password è stata reimpostata con successo.
          </p>
          <p className="text-slate-500 text-sm">
            Verrai reindirizzato automaticamente...
          </p>
        </div>
      </div>
    );
  }

  // Reset form
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Hexagons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Hexagon 
          size={400} 
          className="absolute -top-20 -right-20 text-slate-800/20" 
          strokeWidth={0.5} 
        />
        <Hexagon 
          size={300} 
          className="absolute -bottom-10 -left-10 text-slate-800/20" 
          strokeWidth={0.5} 
        />
      </div>

      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Hexagon size={50} className="text-blue-600 fill-blue-600/10" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Nuova Password</h1>
          <p className="text-slate-400 text-sm">
            Inserisci la tua nuova password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* New Password */}
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="password"
              placeholder="Nuova password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              required
              minLength={6}
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="password"
              placeholder="Conferma password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                Aggiorna Password
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <button
            onClick={() => onNavigate(Page.Landing)}
            className="text-slate-500 hover:text-slate-300 transition-colors text-sm"
          >
            ← Torna al login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
