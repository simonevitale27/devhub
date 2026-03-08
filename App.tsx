import React, { useState, useEffect } from 'react';
import { Page } from './types';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import SqlGym from './components/SqlGym';
import DataLab from './components/DataLab';
import PythonGym from './components/PythonGym';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AccountPage from './components/AccountPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Landing);
  const { user, isGuest, isLoading } = useAuth();

  // Redirect to Home when authenticated, back to Landing when logged out
  // Force Vercel Redeploy: v1.3 (Fix React Version Mismatch)
  useEffect(() => {
    if (isLoading) return;
    
    // Check URL for reset-password path
    if (window.location.pathname === '/reset-password' || window.location.hash.includes('type=recovery')) {
      setCurrentPage(Page.ResetPassword);
      return;
    }
    
    if ((user || isGuest) && currentPage === Page.Landing) {
      // User just logged in or selected guest mode
      setCurrentPage(Page.Home);
    } else if (!user && !isGuest && currentPage !== Page.Landing && currentPage !== Page.ResetPassword) {
      // User logged out - return to landing
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

    if (currentPage === Page.Landing) {
      return <LandingPage onNavigate={setCurrentPage} />;
    }
    
    if (currentPage === Page.ResetPassword) {
      return <ResetPasswordPage onNavigate={setCurrentPage} />;
    }

    return (
      <>
        <div className={currentPage === Page.Home ? "block" : "hidden"}>
          <Home onNavigate={setCurrentPage} />
        </div>
        <div className={currentPage === Page.SqlGym ? "block" : "hidden"}>
          <SqlGym onBack={() => setCurrentPage(Page.Home)} onNavigate={setCurrentPage} />
        </div>
        <div className={currentPage === Page.DataLab ? "block" : "hidden"}>
          <DataLab onBack={() => setCurrentPage(Page.Home)} />
        </div>
        <div className={currentPage === Page.PythonGym ? "block" : "hidden"}>
          <PythonGym onBack={() => setCurrentPage(Page.Home)} onNavigate={setCurrentPage} />
        </div>
        <div className={currentPage === Page.Analytics ? "block" : "hidden"}>
          <AnalyticsDashboard onBack={() => setCurrentPage(Page.Home)} onNavigate={setCurrentPage} />
        </div>
        <div className={currentPage === Page.Account ? "block" : "hidden"}>
          <AccountPage onBack={() => setCurrentPage(Page.Home)} onNavigate={setCurrentPage} />
        </div>
      </>
    );
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
