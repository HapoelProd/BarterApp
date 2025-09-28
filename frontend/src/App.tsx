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
    const loginTime = localStorage.getItem('loginTime');
    
    if (authStatus === 'authenticated' && loginTime) {
      const currentTime = Date.now();
      const timeDiff = currentTime - parseInt(loginTime);
      const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
      
      if (timeDiff < thirtyMinutes) {
        setIsMainAuthenticated(true);
      } else {
        // Auto logout after 30 minutes
        handleMainLogout();
      }
    }
  }, []);

  // Auto logout timer
  useEffect(() => {
    if (isMainAuthenticated) {
      const thirtyMinutes = 30 * 60 * 1000;
      const timer = setTimeout(() => {
        handleMainLogout();
        alert('Session expired. Please log in again.');
      }, thirtyMinutes);

      return () => clearTimeout(timer);
    }
  }, [isMainAuthenticated]);

  const handleMainLogin = () => {
    setIsMainAuthenticated(true);
    localStorage.setItem('mainAuth', 'authenticated');
    localStorage.setItem('loginTime', Date.now().toString());
  };

  const handleMainLogout = () => {
    setIsMainAuthenticated(false);
    setCurrentPage('home');
    localStorage.removeItem('mainAuth');
    localStorage.removeItem('loginTime');
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
        return <HomePage onNavigate={handleNavigate} onLogout={handleMainLogout} />;
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
