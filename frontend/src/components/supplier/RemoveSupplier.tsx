import React, { useState } from 'react';

interface Supplier {
  id: number;
  name: string;
  balance: number;
  status: string;
}

const RemoveSupplier: React.FC = () => {
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock supplier data - TODO: Replace with API call
  const suppliers: Supplier[] = [
    { id: 1, name: 'Supplier A', balance: 1500.00, status: 'active' },
    { id: 2, name: 'Supplier B', balance: -750.50, status: 'active' },
    { id: 3, name: 'Supplier C', balance: 0.00, status: 'pending' }
  ];

  const handleSupplierSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSupplier(e.target.value);
    setShowConfirmation(false);
    setConfirmationText('');
  };

  const handleRemoveClick = () => {
    if (selectedSupplier) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmRemove = () => {
    const supplier = suppliers.find(s => s.id.toString() === selectedSupplier);
    if (supplier && confirmationText === supplier.name) {
      console.log('Removing supplier:', supplier.name);
      // TODO: API call to remove supplier
      setSelectedSupplier('');
      setConfirmationText('');
      setShowConfirmation(false);
    }
  };

  const selectedSupplierData = suppliers.find(s => s.id.toString() === selectedSupplier);

  return (
    <div>
      <p style={{ color: '#ffffff', marginBottom: '20px' }}>
        Remove a supplier from the system. This action will permanently delete all supplier data and transaction history.
      </p>
      
      <div style={{ maxWidth: '500px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#ffffff', display: 'block', marginBottom: '8px' }}>
            Select Supplier to Remove
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
          <div style={{ 
            padding: '16px', 
            border: '1px solid #dc2626', 
            borderRadius: '4px', 
            marginBottom: '20px',
            backgroundColor: 'rgba(220, 38, 38, 0.1)'
          }}>
            <h4 style={{ color: '#dc2626', margin: '0 0 12px 0' }}>Supplier Details</h4>
            <div style={{ color: '#ffffff' }}>
              <p><strong>Name:</strong> {selectedSupplierData.name}</p>
              <p><strong>Current Balance:</strong> ${selectedSupplierData.balance.toFixed(2)}</p>
              <p><strong>Status:</strong> {selectedSupplierData.status}</p>
            </div>
          </div>
        )}

        {showConfirmation && selectedSupplierData && (
          <div style={{ marginBottom: '20px' }}>
            <div className="error" style={{ marginBottom: '12px', fontSize: '16px' }}>
              ⚠️ WARNING: This action cannot be undone!
            </div>
            <label style={{ color: '#ffffff', display: 'block', marginBottom: '8px' }}>
              Type the supplier name "{selectedSupplierData.name}" to confirm removal:
            </label>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="input"
              style={{ width: '100%' }}
              placeholder={`Type "${selectedSupplierData.name}" to confirm`}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          {!showConfirmation ? (
            <button 
              className="btn" 
              onClick={handleRemoveClick}
              disabled={!selectedSupplier}
              style={{ 
                backgroundColor: selectedSupplier ? '#dc2626' : '#666666',
                borderColor: selectedSupplier ? '#dc2626' : '#666666',
                cursor: selectedSupplier ? 'pointer' : 'not-allowed'
              }}
            >
              Remove Supplier
            </button>
          ) : (
            <>
              <button 
                className="btn"
                onClick={handleConfirmRemove}
                disabled={confirmationText !== selectedSupplierData?.name}
                style={{ 
                  backgroundColor: (confirmationText === selectedSupplierData?.name) ? '#dc2626' : '#666666',
                  borderColor: (confirmationText === selectedSupplierData?.name) ? '#dc2626' : '#666666',
                  cursor: (confirmationText === selectedSupplierData?.name) ? 'pointer' : 'not-allowed'
                }}
              >
                Confirm Removal
              </button>
              <button 
                className="btn" 
                onClick={() => {
                  setShowConfirmation(false);
                  setConfirmationText('');
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveSupplier;