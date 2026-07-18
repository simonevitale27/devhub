import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Key, Trash2, Calendar, Shield, AlertTriangle, Check, X, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Page } from '../types';
import { pb } from '../services/pocketbaseClient';
import { getTotalStats } from '../services/progressService';

interface AccountPageProps {
  onBack: () => void;
  onNavigate: (page: Page) => void;
}

export default function AccountPage({ onBack, onNavigate }: AccountPageProps) {
  const { user, isGuest, displayName, logout, updateProfile } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showNameForm, setShowNameForm] = useState(false);
  const [newName, setNewName] = useState(displayName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Get stats for display
  const stats = getTotalStats();

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La password deve essere di almeno 6 caratteri' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Le password non corrispondono' });
      return;
    }

    setIsLoading(true);
    try {
      if (!user) throw new Error('Utente non autenticato');
      await pb.collection('users').update(user.id, {
        oldPassword: currentPassword,
        password: newPassword,
        passwordConfirm: confirmPassword,
      });
      setMessage({ type: 'success', text: 'Password aggiornata con successo!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.response?.data?.oldPassword?.message || err?.message || 'Errore durante l\'aggiornamento' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      if (!user) throw new Error('Utente non autenticato');

      // Delete the user record (cascadeDelete on user_progress.user removes their progress too)
      await pb.collection('users').delete(user.id);

      // Sign out locally
      await logout();
      onNavigate(Page.Landing);

      setMessage({ type: 'success', text: 'Account eliminato con successo' });
    } catch (err: any) {
      console.error('Delete Error:', err);
      setMessage({ type: 'error', text: err?.message || 'Impossibile eliminare l\'account' });
    } finally {
      setIsLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/D';
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // If guest, show limited info
  if (isGuest) {
    return (
      <div className="min-h-screen bg-transparent text-white p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="h-10 inline-flex items-center gap-2 px-3.5 rounded-xl bg-white/[0.04] ring-1 ring-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08] mb-8 transition-all text-sm font-semibold"
          >
            <ArrowLeft size={20} />
            Torna indietro
          </button>

          <div className="bg-white/[0.02] ring-1 ring-white/[0.07] rounded-2xl p-6 md:p-8 elev-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                <User size={32} className="text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Ospite</h1>
                <p className="text-amber-400 text-sm">I tuoi dati sono salvati solo localmente</p>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-amber-300 font-medium">Modalità Ospite</p>
                  <p className="text-amber-200/70 text-sm mt-1">
                    I tuoi progressi sono salvati solo su questo dispositivo. 
                    Se cancelli i dati del browser, perderai tutto.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate(Page.Landing)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition-colors"
            >
              Registrati per salvare i progressi nel cloud
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white p-4 md:p-6 pb-32 relative overflow-y-auto font-sans">
        
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }}></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="h-10 inline-flex items-center gap-2 px-3.5 rounded-xl bg-white/[0.04] ring-1 ring-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08] mb-8 transition-all text-sm font-semibold"
        >
          <ArrowLeft size={20} />
          Torna indietro
        </button>

        {/* Profile Header */}
        <div className="bg-white/[0.02] ring-1 ring-white/[0.07] rounded-2xl p-5 md:p-8 elev-1 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
              <User size={32} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{displayName || 'Utente'}</h1>
              <p className="text-slate-400">{user?.email}</p>
            </div>
          </div>

          {/* User info — hairline grid instead of cards nested inside a card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.06] rounded-xl ring-1 ring-white/[0.07] overflow-hidden">
            <div className="bg-[#0a0d16] p-4">
              <div className="flex items-center gap-3 text-slate-400 mb-2">
                <Mail size={18} />
                <span className="text-sm">Email</span>
              </div>
              <p className="text-white font-medium truncate">{user?.email}</p>
            </div>

            <div className="bg-[#0a0d16] p-4">
              <div className="flex items-center gap-3 text-slate-400 mb-2">
                <Calendar size={18} />
                <span className="text-sm">Membro dal</span>
              </div>
              <p className="text-white font-medium">{formatDate(user?.created_at)}</p>
            </div>

            {/* Username Edit Card */}
            <div className={`bg-[#0a0d16] p-4 transition-all ${showNameForm ? 'ring-2 ring-blue-500/50' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-3 text-slate-400">
                    <User size={18} />
                    <span className="text-sm">Username</span>
                 </div>
                 {!showNameForm && (
                   <button 
                     onClick={() => setShowNameForm(true)}
                     className="text-blue-400 hover:text-blue-300 text-xs font-medium"
                   >
                     Modifica
                   </button>
                 )}
              </div>
              
              {showNameForm ? (
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newName.trim()) return;
                    setIsLoading(true);
                    try {
                        // Assuming updateProfile handles metadata update
                        await updateProfile(newName); 
                        setShowNameForm(false);
                        setMessage({ type: 'success', text: 'Username aggiornato!' });
                    } catch (err) {
                        setMessage({ type: 'error', text: 'Errore durante l\'aggiornamento' });
                    } finally {
                        setIsLoading(false);
                    }
                  }} 
                  className="flex gap-2"
                >
                    <input 
                        type="text" 
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 h-10 bg-white/[0.04] ring-1 ring-white/10 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="Nome utente"
                    />
                    <button type="submit" disabled={isLoading} className="h-10 w-10 grid place-items-center bg-blue-600 rounded-xl hover:bg-blue-500 disabled:opacity-50 shrink-0">
                        <Check size={14} />
                    </button>
                     <button type="button" onClick={() => setShowNameForm(false)} className="h-10 w-10 grid place-items-center bg-white/[0.06] ring-1 ring-white/10 rounded-xl hover:bg-white/[0.1] shrink-0">
                        <X size={14} />
                    </button>
                </form>
              ) : (
                <p className="text-white font-medium truncate">{displayName || 'Imposta username'}</p>
              )}
            </div>

            <div className="bg-[#0a0d16] p-4">
              <div className="flex items-center gap-3 text-slate-400 mb-2">
                <Shield size={18} />
                <span className="text-sm">Provider</span>
              </div>
              <p className="text-white font-medium capitalize">
                {user?.app_metadata?.provider || 'Email'}
              </p>
            </div>

            <div className="bg-[#0a0d16] p-4">
              <div className="flex items-center gap-3 text-slate-400 mb-2">
                <Check size={18} />
                <span className="text-sm">Esercizi completati</span>
              </div>
              <p className="text-white font-medium">{stats.totalCompleted}</p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-500/10 border-green-500/30 text-green-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* Password Change Section */}
        {user?.app_metadata?.provider !== 'google' && (
          <div className="bg-white/[0.02] ring-1 ring-white/[0.07] rounded-2xl p-6 elev-1 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Key size={20} className="text-slate-400" />
                <h2 className="text-lg font-semibold">Cambia Password</h2>
              </div>
              {!showPasswordForm && (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  Modifica
                </button>
              )}
            </div>

            {showPasswordForm && (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Password attuale</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full h-12 px-4 bg-white/[0.04] ring-1 ring-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                    placeholder="Password attuale"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Nuova password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-12 px-4 bg-white/[0.04] ring-1 ring-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                    placeholder="Minimo 6 caratteri"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Conferma password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-12 px-4 bg-white/[0.04] ring-1 ring-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                    placeholder="Ripeti la password"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                    Salva
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </form>
            )}

            {!showPasswordForm && (
              <p className="text-slate-500 text-sm">
                Ultima modifica: mai
              </p>
            )}
          </div>
        )}

        {/* Danger Zone */}
        <div className="bg-slate-900/50 rounded-2xl p-6 border border-red-500/20 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Trash2 size={20} className="text-red-400" />
            <h2 className="text-lg font-semibold text-red-400">Zona Pericolosa</h2>
          </div>

          {!showDeleteConfirm ? (
            <div>
              <p className="text-slate-400 text-sm mb-4">
                Eliminando l'account, tutti i tuoi progressi e dati saranno rimossi permanentemente.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl transition-colors"
              >
                Elimina Account
              </button>
            </div>
          ) : (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <p className="text-red-300 font-medium mb-4">
                Sei sicuro? Questa azione è irreversibile.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  Sì, elimina
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Annulla
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
