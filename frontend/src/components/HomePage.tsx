import React, { useState } from 'react';
import AdminModal from './AdminModal';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onLogout }) => {
  const [showAdminModal, setShowAdminModal] = useState(false);

  const handleAdminClick = () => {
    setShowAdminModal(true);
  };

  const handleSupplierClick = () => {
    onNavigate('supplier');
  };

  const handleAdminLogin = () => {
    setShowAdminModal(false);
    onNavigate('admin');
  };

  const handleCloseModal = () => {
    setShowAdminModal(false);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container">
          <img src="/logo.jpeg" alt="Organization Logo" className="logo" />
        </div>
        <div className="intro">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1>Barter Management System</h1>
              <p>
                Welcome to your comprehensive barter and inventory management solution. 
                This system helps you manage supplier agreements, track barter balances, 
                and streamline order approvals efficiently. Choose your access level below 
                to get started.
              </p>
            </div>
            <button 
              onClick={onLogout}
              style={{
                background: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                marginLeft: '20px',
                flexShrink: 0
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#b91c1c'}
              onMouseOut={(e) => e.currentTarget.style.background = '#dc2626'}
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="navigation">
        <button className="btn btn-primary" onClick={handleAdminClick}>
          Admin Actions
        </button>
        <button className="btn" onClick={handleSupplierClick}>
          Supplier Actions
        </button>
      </div>

      {showAdminModal && (
        <AdminModal
          onLogin={handleAdminLogin}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default HomePage;