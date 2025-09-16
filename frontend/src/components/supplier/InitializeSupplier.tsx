import React, { useState } from 'react';

interface Supplier {
  id: number;
  name: string;
  balance: number;
  status: string;
}

const InitializeSupplier: React.FC = () => {
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [initializationType, setInitializationType] = useState('balance');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [resetConfirmation, setResetConfirmation] = useState('');
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  // Mock supplier data - TODO: Replace with API call
  const suppliers: Supplier[] = [
    { id: 1, name: 'Supplier A', balance: 1500.00, status: 'active' },
    { id: 2, name: 'Supplier B', balance: -750.50, status: 'active' },
    { id: 3, name: 'Supplier C', balance: 0.00, status: 'pending' }
  ];

  const handleSupplierSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSupplier(e.target.value);
    setShowResetConfirmation(false);
    setResetConfirmation('');
  };

  const handleInitializeBalance = () => {
    const supplier = suppliers.find(s => s.id.toString() === selectedSupplier);
    if (supplier && balanceAmount) {
      console.log(`Initializing balance for ${supplier.name} to $${balanceAmount}`);
      // TODO: API call to initialize supplier balance
      setBalanceAmount('');
    }
  };

  const handleResetSupplier = () => {
    setShowResetConfirmation(true);
  };

  const handleConfirmReset = () => {
    const supplier = suppliers.find(s => s.id.toString() === selectedSupplier);
    if (supplier && resetConfirmation === supplier.name) {
      console.log(`Resetting all data for ${supplier.name}`);
      // TODO: API call to reset supplier data
      setResetConfirmation('');
      setShowResetConfirmation(false);
    }
  };

  const selectedSupplierData = suppliers.find(s => s.id.toString() === selectedSupplier);

  return (
    <div>
      <p style={{ color: '#ffffff', marginBottom: '20px' }}>
        Initialize supplier settings including balance reset and data cleanup operations.
      </p>
      
      <div style={{ maxWidth: '500px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#ffffff', display: 'block', marginBottom: '8px' }}>
            Select Supplier
          </label>
          <select
            value={selectedSupplier}
            onChange={handleSupplierSelect}
            className="input"
            style={{ width: '100%' }}
          >
            <option value="">-- Select a supplier --</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name} (Balance: ${supplier.balance.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        {selectedSupplierData && (
          <div>
            <div style={{ 
              padding: '16px', 
              border: '1px solid #dc2626', 
              borderRadius: '4px', 
              marginBottom: '20px',
              backgroundColor: 'rgba(220, 38, 38, 0.1)'
            }}>
              <h4 style={{ color: '#dc2626', margin: '0 0 12px 0' }}>Current Supplier Status</h4>
              <div style={{ color: '#ffffff' }}>
                <p><strong>Name:</strong> {selectedSupplierData.name}</p>
                <p><strong>Current Balance:</strong> ${selectedSupplierData.balance.toFixed(2)}</p>
                <p><strong>Status:</strong> {selectedSupplierData.status}</p>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                Initialization Type
              </label>
              <select
                value={initializationType}
                onChange={(e) => setInitializationType(e.target.value)}
                className="input"
                style={{ width: '100%' }}
              >
                <option value="balance">Set New Balance</option>
                <option value="reset">Reset All Data</option>
              </select>
            </div>

            {initializationType === 'balance' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                  New Balance Amount ($)
                </label>
                <input
                  type="number"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(e.target.value)}
                  className="input"
                  style={{ width: '100%' }}
                  placeholder="Enter new balance amount"
                  step="0.01"
                />
                <small style={{ color: '#ffffff', opacity: 0.8 }}>
                  Current balance: ${selectedSupplierData.balance.toFixed(2)}
                </small>
              </div>
            )}

            {initializationType === 'reset' && showResetConfirmation && (
              <div style={{ marginBottom: '20px' }}>
                <div className="error" style={{ marginBottom: '12px', fontSize: '16px' }}>
                  ⚠️ WARNING: This will reset ALL supplier data including transaction history!
                </div>
                <label style={{ color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                  Type the supplier name "{selectedSupplierData.name}" to confirm reset:
                </label>
                <input
                  type="text"
                  value={resetConfirmation}
                  onChange={(e) => setResetConfirmation(e.target.value)}
                  className="input"
                  style={{ width: '100%' }}
                  placeholder={`Type "${selectedSupplierData.name}" to confirm`}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              {initializationType === 'balance' && (
                <button 
                  className="btn btn-primary"
                  onClick={handleInitializeBalance}
                  disabled={!balanceAmount}
                  style={{ 
                    backgroundColor: balanceAmount ? '#dc2626' : '#666666',
                    borderColor: balanceAmount ? '#dc2626' : '#666666',
                    cursor: balanceAmount ? 'pointer' : 'not-allowed'
                  }}
                >
                  Set Balance
                </button>
              )}

              {initializationType === 'reset' && !showResetConfirmation && (
                <button 
                  className="btn"
                  onClick={handleResetSupplier}
                  style={{ 
                    backgroundColor: '#dc2626',
                    borderColor: '#dc2626'
                  }}
                >
                  Reset Supplier Data
                </button>
              )}

              {initializationType === 'reset' && showResetConfirmation && (
                <>
                  <button 
                    className="btn"
                    onClick={handleConfirmReset}
                    disabled={resetConfirmation !== selectedSupplierData.name}
                    style={{ 
                      backgroundColor: (resetConfirmation === selectedSupplierData.name) ? '#dc2626' : '#666666',
                      borderColor: (resetConfirmation === selectedSupplierData.name) ? '#dc2626' : '#666666',
                      cursor: (resetConfirmation === selectedSupplierData.name) ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Confirm Reset
                  </button>
                  <button 
                    className="btn"
                    onClick={() => {
                      setShowResetConfirmation(false);
                      setResetConfirmation('');
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InitializeSupplier;