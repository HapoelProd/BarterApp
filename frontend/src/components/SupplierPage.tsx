import React from 'react';

interface SupplierPageProps {
  onNavigate: (page: string) => void;
}

const SupplierPage: React.FC<SupplierPageProps> = ({ onNavigate }) => {
  return (
    <div className="container">
      <div className="header">
        <div className="logo-container">
          <img src="/logo.jpeg" alt="Organization Logo" className="logo" />
        </div>
        <div className="intro">
          <h1>Supplier Actions</h1>
          <p>
            Submit orders, view balances, and track your barter transactions
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px', margin: '0 auto' }}>
        <div className="card">
          <h3>Submit New Order</h3>
          <p style={{ color: '#475569', marginBottom: '16px' }}>
            Create a new barter order request for review and approval
          </p>
          <button className="btn btn-primary">New Order</button>
        </div>

        <div className="card">
          <h3>View Your Balance</h3>
          <p style={{ color: '#475569', marginBottom: '16px' }}>
            Check your current barter balance and transaction history
          </p>
          <button className="btn">Check Balance</button>
        </div>

        <div className="card">
          <h3>Order History</h3>
          <p style={{ color: '#475569', marginBottom: '16px' }}>
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