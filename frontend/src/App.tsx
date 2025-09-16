import React, { useState } from 'react';
import HomePage from './components/HomePage';
import AdminPage from './components/AdminPage';
import SupplierPage from './components/SupplierPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

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

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
