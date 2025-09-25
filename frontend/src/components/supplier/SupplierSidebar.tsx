import React, { useState, useEffect, useCallback } from 'react';
import { formatCurrency } from '../../utils/formatters';
import API_ENDPOINTS from '../../config/api';

interface Supplier {
  id: number;
  name: string;
  initial_amount: number;
  current_amount: number;
}

interface SupplierSidebarProps {
  onSupplierSelect?: (supplier: Supplier) => void;
  selectedSupplierId?: number;
}

const SupplierSidebar: React.FC<SupplierSidebarProps> = ({ 
  onSupplierSelect, 
  selectedSupplierId 
}) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSuppliers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch(API_ENDPOINTS.SUPPLIERS);
      if (response.ok) {
        const data = await response.json();
        // Sort by initial amount (highest first)
        const sortedSuppliers = data.sort((a: Supplier, b: Supplier) => 
          b.initial_amount - a.initial_amount
        );
        setSuppliers(sortedSuppliers);
        setFilteredSuppliers(sortedSuppliers);
      } else {
        setError('Failed to load suppliers');
      }
    } catch (error) {
      setError('Network error. Please check if the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  useEffect(() => {
    // Filter suppliers based on search term
    if (!searchTerm.trim()) {
      setFilteredSuppliers(suppliers);
    } else {
      const filtered = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.name.includes(searchTerm)
      );
      setFilteredSuppliers(filtered);
    }
  }, [searchTerm, suppliers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowAll(false); // Reset show all when searching
  };

  const handleSupplierClick = (supplier: Supplier) => {
    if (onSupplierSelect) {
      onSupplierSelect(supplier);
    }
  };

  const displayedSuppliers = showAll ? filteredSuppliers : filteredSuppliers.slice(0, 15);
  const hasMore = filteredSuppliers.length > 15;

  return (
    <div style={{
      width: '300px',
      height: '100vh',
      backgroundColor: '#1e293b',
      borderRight: '1px solid #374151',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #374151',
        backgroundColor: '#0f172a'
      }}>
        <h3 style={{
          color: '#ffffff',
          margin: '0 0 16px 0',
          fontSize: '1.2rem',
          fontWeight: '600'
        }}>
          Suppliers
        </h3>
        
        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search suppliers..."
            style={{
              width: '100%',
              padding: '10px 12px',
              backgroundColor: '#374151',
              border: '1px solid #4b5563',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#dc2626';
              e.target.style.boxShadow = '0 0 0 2px rgba(220, 38, 38, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#4b5563';
              e.target.style.boxShadow = 'none';
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '2px'
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Suppliers List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0'
      }}>
        {isLoading ? (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            Loading suppliers...
          </div>
        ) : error ? (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#dc2626',
            fontSize: '14px'
          }}>
            {error}
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            {searchTerm ? 'No suppliers found' : 'No suppliers available'}
          </div>
        ) : (
          <>
            {displayedSuppliers.map((supplier, index) => (
              <div
                key={supplier.id}
                onClick={() => handleSupplierClick(supplier)}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #374151',
                  cursor: 'pointer',
                  backgroundColor: selectedSupplierId === supplier.id ? '#374151' : 'transparent',
                  transition: 'background-color 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (selectedSupplierId !== supplier.id) {
                    e.currentTarget.style.backgroundColor = '#2d3748';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedSupplierId !== supplier.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {/* Rank indicator for top 15 (only when not searching) */}
                {!searchTerm && index < 15 && (
                  <div style={{
                    position: 'absolute',
                    left: '8px',
                    top: '8px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: index < 3 ? '#dc2626' : '#6b7280',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#ffffff'
                  }}>
                    {index + 1}
                  </div>
                )}
                
                <div style={{ marginLeft: !searchTerm && index < 15 ? '32px' : '0' }}>
                  <div style={{
                    color: '#ffffff',
                    fontWeight: '500',
                    fontSize: '14px',
                    marginBottom: '4px',
                    wordBreak: 'break-word'
                  }}>
                    {supplier.name}
                  </div>
                  <div style={{
                    color: '#9ca3af',
                    fontSize: '12px',
                    marginBottom: '2px'
                  }}>
                    Initial: {formatCurrency(supplier.initial_amount)}
                  </div>
                  <div style={{
                    color: '#9ca3af',
                    fontSize: '12px'
                  }}>
                    Current: {formatCurrency(supplier.current_amount)}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Show More Button */}
            {hasMore && !showAll && !searchTerm && (
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #374151'
              }}>
                <button
                  onClick={() => setShowAll(true)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#b91c1c';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                  }}
                >
                  Show More ({filteredSuppliers.length - 15} more)
                </button>
              </div>
            )}

            {/* Show Less Button */}
            {showAll && !searchTerm && (
              <div style={{
                padding: '16px 20px'
              }}>
                <button
                  onClick={() => setShowAll(false)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#374151',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#4b5563';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#374151';
                  }}
                >
                  Show Less
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Info */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #374151',
        backgroundColor: '#0f172a'
      }}>
        <div style={{
          color: '#9ca3af',
          fontSize: '12px',
          textAlign: 'center'
        }}>
          {filteredSuppliers.length} supplier{filteredSuppliers.length !== 1 ? 's' : ''} 
          {searchTerm && ' found'}
        </div>
      </div>
    </div>
  );
};

export default SupplierSidebar;