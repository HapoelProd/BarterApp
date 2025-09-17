import React, { useState } from 'react';
import SupplierSidebar from './supplier/SupplierSidebar';

interface Supplier {
  id: number;
  name: string;
  initial_amount: number;
  current_amount: number;
}

interface SupplierPageProps {
  onNavigate: (page: string) => void;
}

const SupplierPage: React.FC<SupplierPageProps> = ({ onNavigate }) => {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const handleSupplierSelect = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <SupplierSidebar 
        onSupplierSelect={handleSupplierSelect}
        selectedSupplierId={selectedSupplier?.id}
      />

      {/* Main Content */}
      <div className="supplier-main-content" style={{ 
        marginLeft: '300px', 
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div className="container" style={{ 
          maxWidth: 'none', 
          padding: '20px 40px',
          width: '100%',
          minWidth: 0,
          overflow: 'hidden'
        }}>
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

          <div className="supplier-container">
            {selectedSupplier ? (
              /* Selected Supplier View */
              <div>
                <div className="card" style={{ marginBottom: '24px' }}>
                  <h2 style={{ color: '#1e293b', marginBottom: '16px' }}>
                    {selectedSupplier.name}
                  </h2>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '16px',
                    marginBottom: '20px'
                  }}>
                    <div>
                      <strong style={{ color: '#374151' }}>Initial Amount:</strong>
                      <div style={{ color: '#dc2626', fontSize: '1.2rem', fontWeight: '600' }}>
                        {selectedSupplier.initial_amount.toFixed(2)}₪
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: '#374151' }}>Current Balance:</strong>
                      <div style={{ color: '#dc2626', fontSize: '1.2rem', fontWeight: '600' }}>
                        {selectedSupplier.current_amount.toFixed(2)}₪
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: '#374151' }}>Available Credit:</strong>
                      <div style={{ 
                        color: selectedSupplier.current_amount > 0 ? '#059669' : '#dc2626', 
                        fontSize: '1.2rem', 
                        fontWeight: '600' 
                      }}>
                        {selectedSupplier.current_amount.toFixed(2)}₪
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Cards for Selected Supplier */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="card">
                    <h3>Submit New Order</h3>
                    <p style={{ color: '#475569', marginBottom: '16px' }}>
                      Create a new barter order request for {selectedSupplier.name}
                    </p>
                    <button className="btn btn-primary">New Order for {selectedSupplier.name}</button>
                  </div>

                  <div className="card">
                    <h3>View Transaction History</h3>
                    <p style={{ color: '#475569', marginBottom: '16px' }}>
                      Check transaction history and balance changes for {selectedSupplier.name}
                    </p>
                    <button className="btn">View {selectedSupplier.name} History</button>
                  </div>

                  <div className="card">
                    <h3>Order History</h3>
                    <p style={{ color: '#475569', marginBottom: '16px' }}>
                      Review past orders with {selectedSupplier.name} and their current status
                    </p>
                    <button className="btn">View Order History</button>
                  </div>
                </div>
              </div>
            ) : (
              /* Default View - No Supplier Selected */
              <div>
                <div className="card" style={{ 
                  textAlign: 'center', 
                  padding: '60px 40px',
                  marginBottom: '24px'
                }}>
                  <div style={{ 
                    fontSize: '48px', 
                    marginBottom: '20px',
                    color: '#dc2626'
                  }}>
                    👈
                  </div>
                  <h3 style={{ marginBottom: '16px', color: '#1e293b' }}>
                    Select a Supplier
                  </h3>
                  <p style={{ color: '#475569', fontSize: '16px' }}>
                    Choose a supplier from the sidebar to view their details and perform actions.
                    Suppliers are sorted by initial amount with the highest amounts at the top.
                  </p>
                </div>

                {/* General Action Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="card">
                    <h3>Submit New Order</h3>
                    <p style={{ color: '#475569', marginBottom: '16px' }}>
                      Create a new barter order request for review and approval
                    </p>
                    <button className="btn btn-primary">New Order</button>
                  </div>

                  <div className="card">
                    <h3>View All Balances</h3>
                    <p style={{ color: '#475569', marginBottom: '16px' }}>
                      Check current barter balances across all suppliers
                    </p>
                    <button className="btn">Check All Balances</button>
                  </div>

                  <div className="card">
                    <h3>Order History</h3>
                    <p style={{ color: '#475569', marginBottom: '16px' }}>
                      Review your past orders and their current status
                    </p>
                    <button className="btn">View All History</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <button className="btn" onClick={() => onNavigate('home')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierPage;