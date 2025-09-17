import React, { useState, useEffect, useCallback } from 'react';

interface Order {
  order_id: string;
  supplier_id: number;
  title: string;
  category: string;
  amount: number;
  order_date: string;
  ordered_by: string;
  notes: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  handler: string;
}

interface Supplier {
  id: number;
  name: string;
  initial_amount: number;
  current_amount: number;
}

interface OrderWithSupplier extends Order {
  supplier_name: string;
}

const OrderApprovals: React.FC = () => {
  const [orders, setOrders] = useState<OrderWithSupplier[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filter, setFilter] = useState<'Pending'>('Pending');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [adminNames, setAdminNames] = useState<{ [orderId: string]: string }>({});
  const [orderErrors, setOrderErrors] = useState<{ [orderId: string]: string }>({});

  const fetchSuppliers = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/suppliers');
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/orders');
      if (response.ok) {
        const data = await response.json();
        
        // Merge orders with supplier data
        const ordersWithSuppliers: OrderWithSupplier[] = data.map((order: any) => {
          const supplier = suppliers.find(s => s.id === order.supplier_id);
          return {
            order_id: order.order_id,
            supplier_id: order.supplier_id,
            title: order.title,
            category: order.category,
            amount: order.amount,
            order_date: order.order_date,
            ordered_by: order.ordered_by,
            notes: order.notes,
            status: order.status,
            handler: order.handler,
            supplier_name: supplier ? supplier.name : `Unknown Supplier (ID: ${order.supplier_id})`
          };
        });

        setOrders(ordersWithSuppliers);
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch orders' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check if the backend server is running.' });
    } finally {
      setIsLoading(false);
    }
  }, [suppliers]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  useEffect(() => {
    if (suppliers.length > 0) {
      fetchOrders();
    }
  }, [fetchOrders, suppliers]);

  const handleApprove = async (orderId: string) => {
    const adminName = adminNames[orderId]?.trim();
    if (!adminName) {
      setOrderErrors(prev => ({ ...prev, [orderId]: 'Please enter admin name before approving the order' }));
      return;
    }

    // Clear any existing error for this order
    setOrderErrors(prev => ({ ...prev, [orderId]: '' }));

    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ handler_name: adminName }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Remove the approved order from the list (since we only show pending)
        setOrders(prev => prev.filter(order => order.order_id !== orderId));
        
        // Clear admin name for this order
        setAdminNames(prev => ({ ...prev, [orderId]: '' }));
        
        setMessage({ type: 'success', text: result.message });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        const error = await response.json();
        setOrderErrors(prev => ({ ...prev, [orderId]: error.message || 'Failed to approve order' }));
      }
    } catch (error) {
      setOrderErrors(prev => ({ ...prev, [orderId]: 'Network error. Please check if the backend server is running.' }));
    }
  };

  const handleReject = async (orderId: string) => {
    const adminName = adminNames[orderId]?.trim();
    if (!adminName) {
      setOrderErrors(prev => ({ ...prev, [orderId]: 'Please enter admin name before rejecting the order' }));
      return;
    }

    // Clear any existing error for this order
    setOrderErrors(prev => ({ ...prev, [orderId]: '' }));

    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ handler_name: adminName }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Remove the rejected order from the list (since we only show pending)
        setOrders(prev => prev.filter(order => order.order_id !== orderId));
        
        // Clear admin name for this order
        setAdminNames(prev => ({ ...prev, [orderId]: '' }));
        
        setMessage({ type: 'success', text: result.message });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        const error = await response.json();
        setOrderErrors(prev => ({ ...prev, [orderId]: error.message || 'Failed to reject order' }));
      }
    } catch (error) {
      setOrderErrors(prev => ({ ...prev, [orderId]: 'Network error. Please check if the backend server is running.' }));
    }
  };

  const filteredOrders = orders.filter(order => order.status === 'Pending');

  const pendingCount = orders.filter(o => o.status === 'Pending').length;

  return (
    <div>
      <p style={{ color: '#000000', marginBottom: '20px' }}>
        Review and approve pending barter orders and transactions. {pendingCount} orders pending approval.
      </p>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}


      {/* Orders List */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666666' }}>
          Loading orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666666' }}>
          No pending orders found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredOrders.map(order => (
            <div key={order.order_id} className="card" style={{ position: 'relative' }}>
              {/* Status Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: 
                    order.status === 'Pending' ? 'rgba(220, 38, 38, 0.1)' :
                    order.status === 'Approved' ? 'rgba(5, 150, 105, 0.1)' :
                    'rgba(107, 114, 128, 0.1)',
                  color:
                    order.status === 'Pending' ? '#dc2626' :
                    order.status === 'Approved' ? '#059669' :
                    '#6b7280'
                }}
              >
                {order.status}
              </div>

              <div style={{ paddingRight: '100px' }}>
                <h4 style={{ marginBottom: '12px', color: '#1e293b' }}>
                  {order.title}
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <strong style={{ color: '#374151' }}>Order ID:</strong>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>{order.order_id}</div>
                  </div>
                  <div>
                    <strong style={{ color: '#374151' }}>Supplier:</strong>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>{order.supplier_name}</div>
                  </div>
                  <div>
                    <strong style={{ color: '#374151' }}>Category:</strong>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>{order.category}</div>
                  </div>
                  <div>
                    <strong style={{ color: '#374151' }}>Amount:</strong>
                    <div style={{ color: '#dc2626', fontSize: '14px', fontWeight: '600' }}>{order.amount.toFixed(2)}₪</div>
                  </div>
                  <div>
                    <strong style={{ color: '#374151' }}>Date:</strong>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>{new Date(order.order_date).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <strong style={{ color: '#374151' }}>Ordered By:</strong>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>{order.ordered_by}</div>
                  </div>
                </div>

                {order.notes && (
                  <div style={{ marginBottom: '16px' }}>
                    <strong style={{ color: '#374151' }}>Notes:</strong>
                    <div style={{ color: '#6b7280', fontSize: '14px', fontStyle: 'italic' }}>{order.notes}</div>
                  </div>
                )}

                {order.status === 'Pending' && (
                  <div style={{ marginTop: '16px' }}>
                    {/* Admin Name Input */}
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ color: '#374151', display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                        Admin Name *
                      </label>
                      <input
                        type="text"
                        value={adminNames[order.order_id] || ''}
                        onChange={(e) => {
                          setAdminNames(prev => ({ ...prev, [order.order_id]: e.target.value }));
                          // Clear error when user starts typing
                          if (orderErrors[order.order_id]) {
                            setOrderErrors(prev => ({ ...prev, [order.order_id]: '' }));
                          }
                        }}
                        className="input"
                        style={{ width: '200px', fontSize: '14px', padding: '8px 12px' }}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => handleApprove(order.order_id)}
                      style={{
                        backgroundColor: '#059669',
                        border: '2px solid #059669',
                        color: '#ffffff',
                        fontSize: '14px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#047857';
                        e.currentTarget.style.borderColor = '#047857';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#059669';
                        e.currentTarget.style.borderColor = '#059669';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(5, 150, 105, 0.2)';
                      }}
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleReject(order.order_id)}
                      style={{
                        backgroundColor: '#dc2626',
                        border: '2px solid #dc2626',
                        color: '#ffffff',
                        fontSize: '14px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#b91c1c';
                        e.currentTarget.style.borderColor = '#b91c1c';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc2626';
                        e.currentTarget.style.borderColor = '#dc2626';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(220, 38, 38, 0.2)';
                      }}
                    >
                      ✗ Reject
                    </button>
                    </div>
                    
                    {/* Order-specific Error Message */}
                    {orderErrors[order.order_id] && (
                      <div style={{
                        marginTop: '12px',
                        padding: '12px',
                        backgroundColor: 'rgba(220, 38, 38, 0.05)',
                        border: '1px solid #dc2626',
                        borderRadius: '8px',
                        color: '#dc2626',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {orderErrors[order.order_id]}
                      </div>
                    )}
                  </div>
                )}

                {order.status !== 'Pending' && order.handler && (
                  <div style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>
                    Handled by: {order.handler}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderApprovals;