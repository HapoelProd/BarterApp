import React, { useState, useEffect } from 'react';

interface Supplier {
  id: number;
  name: string;
  initial_amount: number;
  current_amount: number;
}

const EditSupplier: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [supplierData, setSupplierData] = useState({
    name: '',
    initialAmount: '',
    currentAmount: ''
  });
  const [isEditing, setIsEditing] = useState(false);
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
    const supplierId = e.target.value;
    setSelectedSupplierId(supplierId);
    setIsEditing(false);
    setMessage({ type: '', text: '' });
    
    if (supplierId) {
      const supplier = suppliers.find(s => s.id.toString() === supplierId);
      if (supplier) {
        setSupplierData({
          name: supplier.name,
          initialAmount: supplier.initial_amount.toString(),
          currentAmount: supplier.current_amount.toString()
        });
      }
    } else {
      setSupplierData({ name: '', initialAmount: '', currentAmount: '' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSupplierData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage({ type: '', text: '' });
  };

  const handleApply = async () => {
    if (!selectedSupplierId) return;
    
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const updateData = {
        name: supplierData.name.trim(),
        initialAmount: parseFloat(supplierData.initialAmount) || 0,
        currentAmount: parseFloat(supplierData.currentAmount) || 0
      };

      // Validate data
      if (updateData.name.length < 1) {
        setMessage({ type: 'error', text: 'Supplier name cannot be empty' });
        setIsSubmitting(false);
        return;
      }

      if (updateData.initialAmount < 0 || updateData.currentAmount < 0) {
        setMessage({ type: 'error', text: 'Amounts must be non-negative' });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/suppliers/${selectedSupplierId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Supplier updated successfully!' });
        setIsEditing(false);
        // Refresh suppliers list
        await fetchSuppliers();
        // Update local display
        const updatedSupplier = suppliers.find(s => s.id.toString() === selectedSupplierId);
        if (updatedSupplier) {
          updatedSupplier.name = updateData.name;
          updatedSupplier.initial_amount = updateData.initialAmount;
          updatedSupplier.current_amount = updateData.currentAmount;
        }
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to update supplier' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check if the backend server is running.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    if (selectedSupplierId) {
      const supplier = suppliers.find(s => s.id.toString() === selectedSupplierId);
      if (supplier) {
        setSupplierData({
          name: supplier.name,
          initialAmount: supplier.initial_amount.toString(),
          currentAmount: supplier.current_amount.toString()
        });
      }
    }
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const selectedSupplier = suppliers.find(s => s.id.toString() === selectedSupplierId);

  return (
    <div>
      <p style={{ color: '#ffffff', marginBottom: '20px' }}>
        Select a supplier from the list and edit their information including name and balance amounts.
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
            Select Supplier to Edit
          </label>
          <select
            value={selectedSupplierId}
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

        {selectedSupplier && (
          <div>
            <div style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                  Supplier Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={supplierData.name}
                  onChange={handleInputChange}
                  className="input"
                  style={{ width: '100%' }}
                  disabled={!isEditing || isSubmitting}
                  placeholder="Enter supplier name"
                />
              </div>

              <div>
                <label style={{ color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                  Initial Amount (₪)
                </label>
                <input
                  type="number"
                  name="initialAmount"
                  value={supplierData.initialAmount}
                  onChange={handleInputChange}
                  className="input"
                  style={{ width: '100%' }}
                  step="0.01"
                  min="0"
                  disabled={!isEditing || isSubmitting}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label style={{ color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                  Current Amount (₪)
                </label>
                <input
                  type="number"
                  name="currentAmount"
                  value={supplierData.currentAmount}
                  onChange={handleInputChange}
                  className="input"
                  style={{ width: '100%' }}
                  step="0.01"
                  min="0"
                  disabled={!isEditing || isSubmitting}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {!isEditing ? (
                <button 
                  className="btn btn-primary" 
                  onClick={handleEdit}
                  disabled={isSubmitting}
                  style={{
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.6 : 1
                  }}
                >
                  Edit Supplier
                </button>
              ) : (
                <>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleApply}
                    disabled={isSubmitting}
                    style={{
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.6 : 1
                    }}
                  >
                    {isSubmitting ? 'Applying...' : 'Apply'}
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
        )}
      </div>
    </div>
  );
};

export default EditSupplier;