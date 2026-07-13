import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Page } from './types';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import ResetPasswordPage from './components/ResetPasswordPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Lazy-load heavy components — they are only mounted when the user navigates to them.
// This eliminates the "all pages mounted at once" problem that was causing
// Pyodide (~20MB WASM), AlaSQL DB init, and exercise generation to all fire on first load.
const SqlGym = lazy(() => import('./components/SqlGym'));
const DataLab = lazy(() => import('./components/DataLab'));
const PythonGym = lazy(() => import('./components/PythonGym'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));
const AccountPage = lazy(() => import('./components/AccountPage'));

// Shared loading fallback for lazy-loaded pages
const PageLoader = () => (
  <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-zinc-400 text-sm font-medium">Caricamento...</span>
    </div>
  </div>
);

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Landing);
  const { user, isGuest, isLoading } = useAuth();

  // Redirect to Home when authenticated, back to Landing when logged out
  useEffect(() => {
    if (isLoading) return;
    
    // Check URL for reset-password path (PocketBase reset link: /reset-password?token=...)
    if (window.location.pathname === '/reset-password') {
      setCurrentPage(Page.ResetPassword);
      return;
    }
    
    if ((user || isGuest) && currentPage === Page.Landing) {
      setCurrentPage(Page.Home);
    } else if (!user && !isGuest && currentPage !== Page.Landing && currentPage !== Page.ResetPassword) {
      setCurrentPage(Page.Landing);
    }
  }, [user, isGuest, isLoading, currentPage]);

  const renderPage = () => {
    // Show loading while checking auth
    if (isLoading) {
      return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    // Conditional rendering: only the active page is mounted.
    // This prevents SqlGym/PythonGym/DataLab from initializing their heavy
    // resources (AlaSQL, Pyodide, exercise generators) until actually needed.
    switch (currentPage) {
      case Page.Landing:
        return <LandingPage onNavigate={setCurrentPage} />;
      case Page.ResetPassword:
        return <ResetPasswordPage onNavigate={setCurrentPage} />;
      case Page.Home:
        return <Home onNavigate={setCurrentPage} />;
      case Page.SqlGym:
        return (
          <Suspense fallback={<PageLoader />}>
            <SqlGym onBack={() => setCurrentPage(Page.Home)} onNavigate={setCurrentPage} />
          </Suspense>
        );
      case Page.DataLab:
        return (
          <Suspense fallback={<PageLoader />}>
            <DataLab onBack={() => setCurrentPage(Page.Home)} />
          </Suspense>
        );
      case Page.PythonGym:
        return (
          <Suspense fallback={<PageLoader />}>
            <PythonGym onBack={() => setCurrentPage(Page.Home)} onNavigate={setCurrentPage} />
          </Suspense>
        );
      case Page.Analytics:
        return (
          <Suspense fallback={<PageLoader />}>
            <AnalyticsDashboard onBack={() => setCurrentPage(Page.Home)} onNavigate={setCurrentPage} />
          </Suspense>
        );
      case Page.Account:
        return (
          <Suspense fallback={<PageLoader />}>
            <AccountPage onBack={() => setCurrentPage(Page.Home)} onNavigate={setCurrentPage} />
          </Suspense>
        );
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return <>{renderPage()}</>;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
