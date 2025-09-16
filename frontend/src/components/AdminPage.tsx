import React from 'react';
import ExpandableSection from './ExpandableSection';
import AddSupplier from './supplier/AddSupplier';
import RemoveSupplier from './supplier/RemoveSupplier';
import EditSupplier from './supplier/EditSupplier';
import InitializeSupplier from './supplier/InitializeSupplier';

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  return (
    <div className="container">
      <div className="header">
        <div className="logo-placeholder">
          Organization Logo
        </div>
        <h1 style={{ color: '#dc2626', fontSize: '2rem', marginBottom: '16px' }}>
          Admin Actions
        </h1>
        <p style={{ color: '#ffffff', marginBottom: '32px' }}>
          Manage supplier agreements, barter balances, and order approvals
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#dc2626', marginBottom: '20px', fontSize: '1.5rem' }}>
            Supplier Management
          </h2>
          
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
          <h2 style={{ color: '#dc2626', marginBottom: '20px', fontSize: '1.5rem' }}>
            Additional Admin Functions
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '24px', border: '2px solid #dc2626', borderRadius: '8px' }}>
              <h3 style={{ color: '#dc2626', marginBottom: '12px' }}>Barter Balance Tracking</h3>
              <p style={{ color: '#ffffff', marginBottom: '16px' }}>
                Monitor and adjust barter balances across all supplier relationships
              </p>
              <button className="btn">View Balances</button>
            </div>

            <div style={{ padding: '24px', border: '2px solid #dc2626', borderRadius: '8px' }}>
              <h3 style={{ color: '#dc2626', marginBottom: '12px' }}>Order Approvals</h3>
              <p style={{ color: '#ffffff', marginBottom: '16px' }}>
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