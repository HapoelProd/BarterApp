import React, { useState } from 'react';
import API_ENDPOINTS from '../../config/api';

const AddSupplier: React.FC = () => {
  const [supplierData, setSupplierData] = useState({
    name: '',
    initialAmount: '',
    currentAmount: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setSupplierData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Validate current amount doesn't exceed initial amount
      if (name === 'currentAmount' && newData.initialAmount) {
        const initial = parseFloat(newData.initialAmount);
        const current = parseFloat(value);
        if (current > initial) {
          // Don't update if current exceeds initial
          return prev;
        }
      }
      
      return newData;
    });
  };

  // Remove auto-filling current amount - only default on submit

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Default currentAmount to initialAmount if empty
      const finalCurrentAmount = supplierData.currentAmount || supplierData.initialAmount;
      
      const supplierToSubmit = {
        name: supplierData.name,
        initialAmount: parseFloat(supplierData.initialAmount) || 0,
        currentAmount: parseFloat(finalCurrentAmount) || 0
      };

      console.log('Submitting supplier:', supplierToSubmit);
      const response = await fetch(API_ENDPOINTS.SUPPLIERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplierToSubmit),
      });

      console.log('Response status:', response.status, 'Response OK:', response.ok);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Success response:', result);
        console.log('Setting success message...');
        setMessage({ type: 'success', text: 'Supplier added successfully!' });
        console.log('Message state should be set');
        // Reset form data but keep the success message
        setSupplierData({
          name: '',
          initialAmount: '',
          currentAmount: ''
        });
      } else {
        const error = await response.json();
        console.log('Error response:', error);
        setMessage({ type: 'error', text: error.message || 'Failed to add supplier' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check if the backend server is running.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSupplierData({
      name: '',
      initialAmount: '',
      currentAmount: ''
    });
    setMessage({ type: '', text: '' });
  };

  return (
    <div>
      <p style={{ color: '#000000ff', marginBottom: '20px' }}>
        Add a new supplier to the system with their initial and current balance amounts.
      </p>
      
      {console.log('Current message state:', message)}
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
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '16px', maxWidth: '500px' }}>
          <div>
            <label style={{ color: '#000000ff', display: 'block', marginBottom: '8px' }}>
              Supplier Name *
            </label>
            <input
              type="text"
              name="name"
              value={supplierData.name}
              onChange={handleInputChange}
              className="input"
              required
              style={{ width: '100%' }}
              placeholder="Enter supplier name"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label style={{ color: '#000000ff', display: 'block', marginBottom: '8px' }}>
              Initial Amount (₪) *
            </label>
            <input
              type="number"
              name="initialAmount"
              value={supplierData.initialAmount}
              onChange={handleInputChange}
              className="input"
              required
              style={{ width: '100%' }}
              placeholder="0.00"
              step="0.01"
              min="0"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label style={{ color: '#000000ff', display: 'block', marginBottom: '8px' }}>
              Current Amount (₪)
            </label>
            <input
              type="number"
              name="currentAmount"
              value={supplierData.currentAmount}
              onChange={handleInputChange}
              className="input"
              style={{ width: '100%' }}
              placeholder={supplierData.initialAmount || "Will default to Initial Amount"}
              step="0.01"
              min="0"
              max={supplierData.initialAmount || undefined}
              disabled={isSubmitting}
            />
            <small style={{ color: '#000000ff', opacity: 0.7, fontSize: '12px' }}>
              Leave empty to default to Initial Amount
            </small>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1
            }}
          >
            {isSubmitting ? 'Adding Supplier...' : 'Add Supplier'}
          </button>
          <button 
            type="button" 
            className="btn" 
            onClick={handleReset}
            disabled={isSubmitting}
            style={{
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1
            }}
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSupplier;