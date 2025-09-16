import React, { useState, useEffect } from 'react';

interface Supplier {
  id: number;
  name: string;
  initial_amount: number;
  current_amount: number;
}

const RemoveSupplier: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/suppliers');
      if (response.ok) {
        const data = await response.json();
        // Sort suppliers A-Z by name
        const sortedSuppliers = data.sort((a: Supplier, b: Supplier) => 
          a.name.localeCompare(b.name)
        );
        setSuppliers(sortedSuppliers);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load suppliers' });
    }
  };

  const handleSupplierSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSupplier(e.target.value);
    setShowConfirmation(false);
    setConfirmationText('');
    setMessage({ type: '', text: '' });
  };

  const handleRemoveClick = () => {
    if (selectedSupplier) {
      setShowConfirmation(true);
      setMessage({ type: '', text: '' });
    }
  };

  const handleApply = async () => {
    const supplier = suppliers.find(s => s.id.toString() === selectedSupplier);
    if (!supplier || confirmationText.toLowerCase() !== 'delete') {
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`http://localhost:5000/api/suppliers/${selectedSupplier}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Supplier "${supplier.name}" and all history deleted successfully!` });
        setSelectedSupplier('');
        setConfirmationText('');
        setShowConfirmation(false);
        // Refresh suppliers list
        await fetchSuppliers();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to delete supplier' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check if the backend server is running.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setConfirmationText('');
    setMessage({ type: '', text: '' });
  };

  const selectedSupplierData = suppliers.find(s => s.id.toString() === selectedSupplier);

  return (
    <div>
      <p style={{ color: '#ffffff', marginBottom: '20px' }}>
        Remove a supplier from the system. This action will permanently delete the supplier and all transaction history.
      </p>

      {message.text && (
        <div style={{ 
          padding: '12px', 
          marginBottom: '20px',
          borderRadius: '4px',
          backgroundColor: message.type === 'success' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(220, 38, 38, 0.1)',
          border: `1px solid ${message.type === 'success' ? '#00ff00' : '#dc2626'}`,
          color: message.type === 'success' ? '#00ff00' : '#dc2626'
        }}>
          {message.text}
        </div>
      )}
      
      <div style={{ maxWidth: '500px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#ffffff', display: 'block', marginBottom: '8px' }}>
            Select Supplier to Remove (A-Z)
          </label>
          <select
            value={selectedSupplier}
            onChange={handleSupplierSelect}
            className="input"
            style={{ width: '100%' }}
            disabled={isSubmitting}
          >
            <option value="">-- Select a supplier --</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name} (Initial: {supplier.initial_amount}₪, Current: {supplier.current_amount}₪)
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
              <p><strong>Initial Amount:</strong> {selectedSupplierData.initial_amount}₪</p>
              <p><strong>Current Amount:</strong> {selectedSupplierData.current_amount}₪</p>
            </div>
          </div>
        )}

        {showConfirmation && selectedSupplierData && (
          <div style={{ marginBottom: '20px' }}>
            <div className="error" style={{ marginBottom: '12px', fontSize: '16px' }}>
              ⚠️ WARNING: This action cannot be undone!
            </div>
            <p style={{ color: '#ffffff', marginBottom: '12px' }}>
              This will permanently delete supplier <strong>"{selectedSupplierData.name}"</strong> and all associated transaction history.
            </p>
            <label style={{ color: '#ffffff', display: 'block', marginBottom: '8px' }}>
              Type "delete" to confirm removal:
            </label>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="input"
              style={{ width: '100%' }}
              placeholder="Type 'delete' to confirm"
              disabled={isSubmitting}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          {!showConfirmation ? (
            <button 
              className="btn" 
              onClick={handleRemoveClick}
              disabled={!selectedSupplier || isSubmitting}
              style={{ 
                backgroundColor: selectedSupplier ? '#dc2626' : '#666666',
                borderColor: selectedSupplier ? '#dc2626' : '#666666',
                cursor: (selectedSupplier && !isSubmitting) ? 'pointer' : 'not-allowed',
                opacity: isSubmitting ? 0.6 : 1
              }}
            >
              Remove Supplier
            </button>
          ) : (
            <>
              <button 
                className="btn"
                onClick={handleApply}
                disabled={confirmationText.toLowerCase() !== 'delete' || isSubmitting}
                style={{ 
                  backgroundColor: (confirmationText.toLowerCase() === 'delete' && !isSubmitting) ? '#dc2626' : '#666666',
                  borderColor: (confirmationText.toLowerCase() === 'delete' && !isSubmitting) ? '#dc2626' : '#666666',
                  cursor: (confirmationText.toLowerCase() === 'delete' && !isSubmitting) ? 'pointer' : 'not-allowed',
                  opacity: isSubmitting ? 0.6 : 1
                }}
              >
                {isSubmitting ? 'Deleting...' : 'Apply'}
              </button>
              <button 
                className="btn" 
                onClick={handleCancel}
                disabled={isSubmitting}
                style={{
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.6 : 1
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