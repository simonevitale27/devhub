import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { pb, toAuthUser, AuthUser } from '../services/pocketbaseClient';
import { setCurrentUser, syncBackendToLocal, syncLocalToBackend } from '../services/progressService';

interface AuthContextType {
  user: AuthUser | null;
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
  const [user, setUser] = useState<AuthUser | null>(pb.authStore.record ? toAuthUser(pb.authStore.record) : null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getDisplayName = (user: AuthUser | null): string | null => {
    if (!user) return null;
    return user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || null;
  };

  const getAvatarUrl = (user: AuthUser | null): string | null => {
    if (!user) return null;
    return user.user_metadata?.avatar_url || null;
  };

  useEffect(() => {
    // PocketBase restores the session from localStorage synchronously, so we only
    // need to verify it's still valid against the server (token revoked/expired).
    const checkSession = async () => {
      if (pb.authStore.isValid && pb.authStore.record) {
        setUser(toAuthUser(pb.authStore.record));
        setCurrentUser(pb.authStore.record.id);
        try {
          await pb.collection('users').authRefresh();
        } catch {
          // Token invalid/expired server-side — clear local state
          pb.authStore.clear();
          setUser(null);
          setCurrentUser(null);
          setIsLoading(false);
          return;
        }
        syncLocalToBackend()
          .then(() => syncBackendToLocal())
          .catch(() => {});
        onAuthChange?.(true);
      }
      setIsLoading(false);
    };

    checkSession();

    const removeListener = pb.authStore.onChange((_token, record) => {
      if (record) {
        setUser(toAuthUser(record));
        setIsGuest(false);
        setCurrentUser(record.id);
        syncLocalToBackend()
          .then(() => syncBackendToLocal())
          .catch(() => {});
        onAuthChange?.(true);
      } else {
        setUser(null);
        setCurrentUser(null);
        onAuthChange?.(false);
      }
    });

    return () => {
      removeListener();
    };
  }, [onAuthChange]);

  const setGuestMode = () => {
    setIsGuest(true);
    setUser(null);
    setCurrentUser(null);
  };

  const logout = async () => {
    try {
      pb.authStore.clear();
    } catch {
      // Clear local state anyway so the user isn't stuck logged in
    }
    setUser(null);
    setIsGuest(false);
    setCurrentUser(null);
  };

  const updateProfile = async (name: string) => {
    if (!user) return;
    const record = await pb.collection('users').update(user.id, { name });
    setUser(toAuthUser(record));
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
