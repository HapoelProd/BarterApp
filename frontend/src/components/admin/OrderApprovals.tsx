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
      // For now, using mock data since the orders endpoint returns static data
      // TODO: Replace with real API call when backend is updated
      const mockOrders: Order[] = [
        {
          order_id: "ORD-001-2024",
          supplier_id: 1,
          title: "Office Supplies Order",
          category: "Office Supplies",
          amount: 500.00,
          order_date: "2024-01-15",
          ordered_by: "John Doe",
          notes: "Urgent order for Q1 supplies",
          status: "Pending",
          handler: ""
        },
        {
          order_id: "ORD-002-2024", 
          supplier_id: 2,
          title: "Coffee and Beverages",
          category: "Drinks",
          amount: 250.00,
          order_date: "2024-01-14",
          ordered_by: "Jane Smith",
          notes: "Monthly beverage restocking",
          status: "Pending",
          handler: ""
        },
        {
          order_id: "ORD-003-2024",
          supplier_id: 1,
          title: "Tech Equipment Purchase",
          category: "Tech",
          amount: 1000.00,
          order_date: "2024-01-13",
          ordered_by: "Mike Johnson",
          notes: "New laptops for development team",
          status: "Approved",
          handler: "Admin User"
        }
      ];

      // Merge orders with supplier data
      const ordersWithSuppliers: OrderWithSupplier[] = mockOrders.map(order => {
        const supplier = suppliers.find(s => s.id === order.supplier_id);
        return {
          ...order,
          supplier_name: supplier ? supplier.name : `Unknown Supplier (ID: ${order.supplier_id})`
        };
      });

      setOrders(ordersWithSuppliers);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load orders' });
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
    try {
      // TODO: Implement actual API call
      console.log('Approving order:', orderId);
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.order_id === orderId 
          ? { ...order, status: 'Approved', handler: 'Admin User' }
          : order
      ));
      
      setMessage({ type: 'success', text: `Order ${orderId} approved successfully!` });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to approve order' });
    }
  };

  const handleReject = async (orderId: string) => {
    try {
      // TODO: Implement actual API call
      console.log('Rejecting order:', orderId);
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.order_id === orderId 
          ? { ...order, status: 'Rejected', handler: 'Admin User' }
          : order
      ));
      
      setMessage({ type: 'success', text: `Order ${orderId} rejected successfully!` });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reject order' });
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
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
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