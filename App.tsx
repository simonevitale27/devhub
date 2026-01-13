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

    switch (currentPage) {
      case Page.Landing:
        return <LandingPage onNavigate={setCurrentPage} />;
      case Page.Home:
        return <Home onNavigate={setCurrentPage} />;
      case Page.SqlGym:
        return <SqlGym onBack={() => setCurrentPage(Page.Home)} onNavigate={setCurrentPage} />;
      case Page.DataLab:
        return <DataLab onBack={() => setCurrentPage(Page.Home)} />;
      case Page.PythonGym:
        return <PythonGym onBack={() => setCurrentPage(Page.Home)} onNavigate={setCurrentPage} />;
      case Page.Analytics:
        return <AnalyticsDashboard onBack={() => setCurrentPage(Page.Home)} onNavigate={setCurrentPage} />;
      case Page.Account:
        return <AccountPage onBack={() => setCurrentPage(Page.Home)} onNavigate={setCurrentPage} />;
      case Page.ResetPassword:
        return <ResetPasswordPage onNavigate={setCurrentPage} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
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
