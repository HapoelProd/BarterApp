import React, { useState } from 'react';

interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  balance: number;
  status: string;
}

const EditSupplier: React.FC = () => {
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [supplierData, setSupplierData] = useState<Partial<Supplier>>({});
  const [isEditing, setIsEditing] = useState(false);

  // Mock supplier data - TODO: Replace with API call
  const suppliers: Supplier[] = [
    { 
      id: 1, 
      name: 'Supplier A', 
      email: 'supplier.a@example.com',
      phone: '+1-555-0101',
      address: '123 Business St, City, State 12345',
      balance: 1500.00, 
      status: 'active' 
    },
    { 
      id: 2, 
      name: 'Supplier B', 
      email: 'supplier.b@example.com',
      phone: '+1-555-0102',
      address: '456 Commerce Ave, City, State 12345',
      balance: -750.50, 
      status: 'active' 
    },
    { 
      id: 3, 
      name: 'Supplier C', 
      email: 'supplier.c@example.com',
      phone: '+1-555-0103',
      address: '789 Trade Blvd, City, State 12345',
      balance: 0.00, 
      status: 'pending' 
    }
  ];

  const handleSupplierSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const supplierId = e.target.value;
    setSelectedSupplierId(supplierId);
    setIsEditing(false);
    
    if (supplierId) {
      const supplier = suppliers.find(s => s.id.toString() === supplierId);
      if (supplier) {
        setSupplierData({ ...supplier });
      }
    } else {
      setSupplierData({});
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSupplierData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    console.log('Saving supplier changes:', supplierData);
    // TODO: API call to update supplier
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original data
    if (selectedSupplierId) {
      const supplier = suppliers.find(s => s.id.toString() === selectedSupplierId);
      if (supplier) {
        setSupplierData({ ...supplier });
      }
    }
    setIsEditing(false);
  };

  return (
    <div>
      <p style={{ color: '#ffffff', marginBottom: '20px' }}>
        Edit existing supplier information including contact details and status.
      </p>
      
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
          >
            <option value="">-- Select a supplier --</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name} (Balance: ${supplier.balance.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        {supplierData.id && (
          <div>
            <div style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                  Supplier Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={supplierData.name || ''}
                  onChange={handleInputChange}
                  className="input"
                  style={{ width: '100%' }}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label style={{ color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={supplierData.email || ''}
                  onChange={handleInputChange}
                  className="input"
                  style={{ width: '100%' }}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label style={{ color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={supplierData.phone || ''}
                  onChange={handleInputChange}
                  className="input"
                  style={{ width: '100%' }}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label style={{ color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                  Address
                </label>
                <textarea
                  name="address"
                  value={supplierData.address || ''}
                  onChange={handleInputChange}
                  className="input"
                  style={{ width: '100%', height: '80px', resize: 'vertical' }}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label style={{ color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                  Status
                </label>
                <select
                  name="status"
                  value={supplierData.status || ''}
                  onChange={handleInputChange}
                  className="input"
                  style={{ width: '100%' }}
                  disabled={!isEditing}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label style={{ color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                  Current Balance ($)
                </label>
                <input
                  type="number"
                  name="balance"
                  value={supplierData.balance || 0}
                  onChange={handleInputChange}
                  className="input"
                  style={{ width: '100%' }}
                  step="0.01"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {!isEditing ? (
                <button className="btn btn-primary" onClick={handleEdit}>
                  Edit Supplier
                </button>
              ) : (
                <>
                  <button className="btn btn-primary" onClick={handleSave}>
                    Save Changes
                  </button>
                  <button className="btn" onClick={handleCancel}>
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