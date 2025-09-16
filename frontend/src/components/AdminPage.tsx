import React from 'react';
import ExpandableSection from './ExpandableSection';
import AddSupplier from './supplier/AddSupplier';
import RemoveSupplier from './supplier/RemoveSupplier';
import EditSupplier from './supplier/EditSupplier';
import InitializeSupplier from './supplier/InitializeSupplier';
import AddOrderCategory from './admin/AddOrderCategory';

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  return (
    <div className="container">
      <div className="header">
        <div className="logo-container">
          <img src="/logo.jpeg" alt="Organization Logo" className="logo" />
        </div>
        <div className="intro">
          <h1>Admin Actions</h1>
          <p>
            Manage supplier agreements, barter balances, and order approvals
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2>Supplier Management</h2>
          
          <ExpandableSection title="Add Supplier">
            <AddSupplier />
          </ExpandableSection>

          <ExpandableSection title="Remove Supplier">
            <RemoveSupplier />
          </ExpandableSection>

          <ExpandableSection title="Edit Supplier">
            <EditSupplier />
          </ExpandableSection>

          <ExpandableSection title="Initialize Supplier">
            <InitializeSupplier />
          </ExpandableSection>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h2>Additional Admin Functions</h2>
          
          <ExpandableSection title="Add Order Category">
            <AddOrderCategory />
          </ExpandableSection>
          
          <div style={{ marginTop: '20px' }}>
            <div className="card">
              <h3>Order Approvals</h3>
              <p style={{ color: '#475569', marginBottom: '16px' }}>
                Review and approve pending barter orders and transactions
              </p>
              <button className="btn">Pending Orders</button>
            </div>
          </div>
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

export default AdminPage;