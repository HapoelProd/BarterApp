import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import AdminPage from './components/AdminPage';
import SupplierPage from './components/SupplierPage';
import MainLogin from './components/MainLogin';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMainAuthenticated, setIsMainAuthenticated] = useState(false);

  // Check for existing authentication on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('mainAuth');
    if (authStatus === 'authenticated') {
      setIsMainAuthenticated(true);
    }
  }, []);

  const handleMainLogin = () => {
    setIsMainAuthenticated(true);
    localStorage.setItem('mainAuth', 'authenticated');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'admin':
        return <AdminPage onNavigate={handleNavigate} />;
      case 'supplier':
        return <SupplierPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  // Show main login if not authenticated
  if (!isMainAuthenticated) {
    return <MainLogin onLogin={handleMainLogin} />;
  }

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
