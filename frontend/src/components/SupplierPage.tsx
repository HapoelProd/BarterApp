import React from 'react';

interface SupplierPageProps {
  onNavigate: (page: string) => void;
}

const SupplierPage: React.FC<SupplierPageProps> = ({ onNavigate }) => {
  return (
    <div className="container">
      <div className="header">
        <div className="logo-placeholder">
          Organization Logo
        </div>
        <h1 style={{ color: '#dc2626', fontSize: '2rem', marginBottom: '16px' }}>
          Supplier Actions
        </h1>
        <p style={{ color: '#ffffff', marginBottom: '32px' }}>
          Submit orders, view balances, and track your barter transactions
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ padding: '24px', border: '2px solid #dc2626', borderRadius: '8px' }}>
          <h3 style={{ color: '#dc2626', marginBottom: '12px' }}>Submit New Order</h3>
          <p style={{ color: '#ffffff', marginBottom: '16px' }}>
            Create a new barter order request for review and approval
          </p>
          <button className="btn">New Order</button>
        </div>

        <div style={{ padding: '24px', border: '2px solid #dc2626', borderRadius: '8px' }}>
          <h3 style={{ color: '#dc2626', marginBottom: '12px' }}>View Your Balance</h3>
          <p style={{ color: '#ffffff', marginBottom: '16px' }}>
            Check your current barter balance and transaction history
          </p>
          <button className="btn">Check Balance</button>
        </div>

        <div style={{ padding: '24px', border: '2px solid #dc2626', borderRadius: '8px' }}>
          <h3 style={{ color: '#dc2626', marginBottom: '12px' }}>Order History</h3>
          <p style={{ color: '#ffffff', marginBottom: '16px' }}>
            Review your past orders and their current status
          </p>
          <button className="btn">View History</button>
        </div>
      </div>

      <div style={{ marginTop: '48px', textAlign: 'center' }}>
        <button className="btn" onClick={() => onNavigate('home')}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SupplierPage;