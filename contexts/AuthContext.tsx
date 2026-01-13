import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import { setCurrentUser, syncSupabaseToLocal } from '../services/progressService';

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
  displayName: string | null;
  avatarUrl: string | null;
  setGuestMode: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
  onAuthChange?: (isAuthenticated: boolean) => void;
}

export function AuthProvider({ children, onAuthChange }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Extract display name from user metadata
  const getDisplayName = (user: User | null): string | null => {
    if (!user) return null;
    // Try different sources for name
    return (
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      null
    );
  };

  // Extract avatar URL from user metadata
  const getAvatarUrl = (user: User | null): string | null => {
    if (!user) return null;
    return (
      user.user_metadata?.avatar_url ||
      user.user_metadata?.picture ||
      null
    );
  };

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setCurrentUser(session.user.id);
          await syncSupabaseToLocal();
          onAuthChange?.(true);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes (including OAuth redirects)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          setIsGuest(false);
          setCurrentUser(session.user.id);
          await syncSupabaseToLocal();
          onAuthChange?.(true);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setCurrentUser(null);
          onAuthChange?.(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [onAuthChange]);

  const setGuestMode = () => {
    setIsGuest(true);
    setUser(null);
    setCurrentUser(null);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsGuest(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        isLoading,
        displayName: getDisplayName(user),
        avatarUrl: getAvatarUrl(user),
        setGuestMode,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
