
import React, { useState } from 'react';
import { Page } from './types';
import Home from './components/Home';
import SqlGym from './components/SqlGym';
import DataLab from './components/DataLab';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <Home onNavigate={setCurrentPage} />;
      case Page.SqlGym:
        return <SqlGym onBack={() => setCurrentPage(Page.Home)} />;
      case Page.DataLab:
        return <DataLab onBack={() => setCurrentPage(Page.Home)} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      {renderPage()}
    </>
  );
}

export default App;
