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
  updateProfile: (name: string) => Promise<void>;
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

// Simple Error Boundary component
class ErrorBoundary extends React.Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Qualcosa è andato storto</h1>
          <pre className="bg-gray-900 p-4 rounded overflow-auto max-w-full text-xs">
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
          >
            Ricarica Pagina
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function AuthProvider({ children, onAuthChange }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Debug logs
  useEffect(() => {
    console.log("AuthProvider mounted");
    // Check if Supabase client is initialized
    try {
      console.log("Supabase URL defined:", !!supabase);
    } catch (e) {
      console.error("Error accessing Supabase client:", e);
    }
  }, []);

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
        console.log("Checking Supabase session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
           console.error("Supabase session error:", error);
           // Don't throw, just log
        }

        if (data?.session?.user) {
          console.log("User found:", data.session.user.id);
          setUser(data.session.user);
          setCurrentUser(data.session.user.id);
          await syncSupabaseToLocal();
          onAuthChange?.(true);
        } else {
           console.log("No active session");
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

  const updateProfile = async (name: string) => {
    if (!user) return;
    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: name, name: name }
    });
    
    if (error) throw error;
    if (data.user) setUser(data.user);
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
        updateProfile,
      }}
    >
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </AuthContext.Provider>
  );
}
