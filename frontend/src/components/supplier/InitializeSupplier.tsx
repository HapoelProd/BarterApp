import React, { useState, useEffect } from 'react';
import API_ENDPOINTS, { getApiUrl } from '../../config/api';

interface Supplier {
  id: number;
  name: string;
  initial_amount: number;
  current_amount: number;
}

const InitializeSupplier: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [initializationData, setInitializationData] = useState({
    initialAmount: '',
    currentAmount: ''
  });
  const [exportHistory, setExportHistory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Default Current Amount to Initial Amount when Initial Amount changes
  useEffect(() => {
    if (initializationData.initialAmount && !initializationData.currentAmount) {
      setInitializationData(prev => ({
        ...prev,
        currentAmount: prev.initialAmount
      }));
    }
  }, [initializationData.initialAmount, initializationData.currentAmount]);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.SUPPLIERS);
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
    setMessage({ type: '', text: '' });
    // Reset form when selecting a new supplier
    setInitializationData({ initialAmount: '', currentAmount: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInitializationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExportHistory(e.target.checked);
  };

  const handleApply = async () => {
    if (!selectedSupplier) return;
    
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const finalCurrentAmount = initializationData.currentAmount || initializationData.initialAmount;
      
      const initData = {
        initialAmount: parseFloat(initializationData.initialAmount) || 0,
        currentAmount: parseFloat(finalCurrentAmount) || 0,
        exportHistory: exportHistory
      };

      // Validate data
      if (initData.initialAmount < 0 || initData.currentAmount < 0) {
        setMessage({ type: 'error', text: 'Amounts must be non-negative' });
        setIsSubmitting(false);
        return;
      }

      if (initData.initialAmount === 0) {
        setMessage({ type: 'error', text: 'Initial Amount is required and must be greater than 0' });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(getApiUrl(`/api/suppliers/${selectedSupplier}/initialize`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(initData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({ type: 'success', text: result.message });
        // Refresh suppliers list
        await fetchSuppliers();
        // Reset form
        setInitializationData({ initialAmount: '', currentAmount: '' });
        setExportHistory(false);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to initialize supplier' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check if the backend server is running.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSupplierData = suppliers.find(s => s.id.toString() === selectedSupplier);

  return (
    <div>
      <p style={{ color: '#000000', marginBottom: '20px' }}>
        Initialize a supplier with new balance amounts and optionally export transaction history to orders.
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
          <label style={{ color: '#000000', display: 'block', marginBottom: '8px' }}>
            Select Supplier to Initialize (A-Z)
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
          <div>
            <div style={{ 
              padding: '16px', 
              border: '1px solid #dc2626', 
              borderRadius: '4px', 
              marginBottom: '20px',
              backgroundColor: 'rgba(220, 38, 38, 0.1)'
            }}>
              <h4 style={{ color: '#dc2626', margin: '0 0 12px 0' }}>Current Supplier Status</h4>
              <div style={{ color: '#000000' }}>
                <p><strong>Name:</strong> {selectedSupplierData.name}</p>
                <p><strong>Current Initial Amount:</strong> {selectedSupplierData.initial_amount}₪</p>
                <p><strong>Current Balance:</strong> {selectedSupplierData.current_amount}₪</p>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ color: '#000000', display: 'block', marginBottom: '8px' }}>
                  New Initial Amount (₪) *
                </label>
                <input
                  type="number"
                  name="initialAmount"
                  value={initializationData.initialAmount}
                  onChange={handleInputChange}
                  className="input"
                  required
                  style={{ width: '100%' }}
                  placeholder="Enter new initial amount"
                  step="0.01"
                  min="0.01"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label style={{ color: '#000000', display: 'block', marginBottom: '8px' }}>
                  New Current Amount (₪)
                </label>
                <input
                  type="number"
                  name="currentAmount"
                  value={initializationData.currentAmount}
                  onChange={handleInputChange}
                  className="input"
                  style={{ width: '100%' }}
                  placeholder={initializationData.initialAmount || "Will default to Initial Amount"}
                  step="0.01"
                  min="0"
                  disabled={isSubmitting}
                />
                <small style={{ color: '#000000', opacity: 0.7, fontSize: '12px' }}>
                  Leave empty to default to Initial Amount
                </small>
              </div>

              <div style={{ 
                padding: '12px', 
                border: '1px solid #dc2626', 
                borderRadius: '4px',
                backgroundColor: 'rgba(220, 38, 38, 0.05)'
              }}>
                <label style={{ 
                  color: '#000000', 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer' 
                }}>
                  <input
                    type="checkbox"
                    checked={exportHistory}
                    onChange={handleExportChange}
                    disabled={isSubmitting}
                    style={{ marginRight: '8px' }}
                  />
                  Export previous history to orders table
                </label>
                <small style={{ color: '#000000', opacity: 0.8, fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  Check this to save current transaction history as an order before resetting
                </small>
              </div>
            </div>

            <div style={{ 
              padding: '12px', 
              border: '1px solid #dc2626', 
              borderRadius: '4px',
              marginBottom: '20px',
              backgroundColor: 'rgba(220, 38, 38, 0.1)'
            }}>
              <div className="error" style={{ marginBottom: '8px', fontSize: '14px' }}>
                ⚠️ WARNING: This will reset all supplier balances and clear transaction history!
              </div>
              <p style={{ color: '#000000', fontSize: '12px', margin: 0 }}>
                This action will update the supplier's initial and current amounts, and clear all existing transaction history. 
                {exportHistory && " The current history will be exported to the orders table before clearing."}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-primary"
                onClick={handleApply}
                disabled={!initializationData.initialAmount || isSubmitting}
                style={{ 
                  backgroundColor: (initializationData.initialAmount && !isSubmitting) ? '#dc2626' : '#666666',
                  borderColor: (initializationData.initialAmount && !isSubmitting) ? '#dc2626' : '#666666',
                  cursor: (initializationData.initialAmount && !isSubmitting) ? 'pointer' : 'not-allowed',
                  opacity: isSubmitting ? 0.6 : 1
                }}
              >
                {isSubmitting ? 'Initializing...' : 'Apply'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InitializeSupplier;