import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Page } from '../types';

interface UserBadgeProps {
  onNavigate?: (page: Page) => void;
  showLogout?: boolean;
}

export default function UserBadge({ onNavigate, showLogout = true }: UserBadgeProps) {
  const { user, isGuest, displayName, avatarUrl, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onNavigate?.(Page.Landing);
  };

  // Don't show if not authenticated
  if (!user && !isGuest) return null;

  return (
    <div className="flex items-center gap-3">
      {/* User Info - Clickable to go to Account */}
      <button
        onClick={() => onNavigate?.(Page.Account)}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full ring-1 ring-white/10 hover:ring-white/20 transition-all cursor-pointer"
        title="Vai al tuo profilo"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName || 'Avatar'}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
            <User size={14} className="text-blue-400" />
          </div>
        )}
        <span className="text-sm font-medium text-slate-300 max-w-[120px] truncate">
          {isGuest ? 'Ospite' : displayName || 'Utente'}
        </span>
        {isGuest && (
          <span className="text-[10px] text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded-full">
            Dati locali
          </span>
        )}
      </button>

      {/* Logout Button */}
      {showLogout && (
        <button
          onClick={handleLogout}
          className="text-xs font-medium text-slate-400 hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all flex items-center gap-1.5"
          title={isGuest ? "Torna al login" : "Esci"}
        >
          <LogOut size={14} />
        </button>
      )}
    </div>
  );
}
