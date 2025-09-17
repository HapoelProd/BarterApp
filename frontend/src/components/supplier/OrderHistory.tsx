import React, { useState, useEffect, useCallback } from 'react';

interface Order {
  order_id: string;
  supplier_id: number;
  title: string;
  amount: number;
  order_date: string;
  ordered_by: string;
  notes: string | null;
  status: 'Pending' | 'Approved' | 'Rejected';
  handler: string | null;
  created_at: string;
}

interface Supplier {
  id: number;
  name: string;
  initial_amount: number;
  current_amount: number;
}

interface OrderHistoryProps {
  selectedSupplier: Supplier;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ selectedSupplier }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/orders');
      if (response.ok) {
        const data = await response.json();
        // Filter orders for the selected supplier
        const supplierOrders = data.filter((order: Order) => order.supplier_id === selectedSupplier.id);
        // Sort by created_at descending (most recent first)
        supplierOrders.sort((a: Order, b: Order) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setOrders(supplierOrders);
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch orders' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check if the backend server is running.' });
    } finally {
      setIsLoading(false);
    }
  }, [selectedSupplier.id]);

  useEffect(() => {
    fetchOrders();
    
    // Set up polling to refresh data every 5 seconds to catch real-time changes
    const interval = setInterval(fetchOrders, 5000);
    
    return () => clearInterval(interval);
  }, [fetchOrders]);

  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [orders, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#dc2626';
      case 'Approved':
        return '#059669';
      case 'Rejected':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'rgba(220, 38, 38, 0.1)';
      case 'Approved':
        return 'rgba(5, 150, 105, 0.1)';
      case 'Rejected':
        return 'rgba(107, 114, 128, 0.1)';
      default:
        return 'rgba(107, 114, 128, 0.1)';
    }
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '20px' }}>Order History - {selectedSupplier.name}</h3>
      <p style={{ color: '#475569', marginBottom: '24px' }}>
        Review all orders submitted for {selectedSupplier.name}, sorted by most recent first.
      </p>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Status Filter */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ color: '#374151', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
          Filter by Status:
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Pending' | 'Approved' | 'Rejected')}
          className="input"
          style={{ width: '200px' }}
        >
          <option value="All">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666666' }}>
          Loading order history...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666666' }}>
          {statusFilter === 'All' 
            ? `No orders found for ${selectedSupplier.name}.` 
            : `No ${statusFilter.toLowerCase()} orders found for ${selectedSupplier.name}.`
          }
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#374151', fontWeight: '600' }}>Order ID</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#374151', fontWeight: '600' }}>Order Title</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e2e8f0', color: '#374151', fontWeight: '600' }}>Amount</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#374151', fontWeight: '600' }}>Order Date</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#374151', fontWeight: '600' }}>Ordered By</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#374151', fontWeight: '600' }}>Notes</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', color: '#374151', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#374151', fontWeight: '600' }}>Handler</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr 
                  key={order.order_id}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                    borderBottom: '1px solid #e2e8f0'
                  }}
                >
                  <td style={{ padding: '12px', color: '#1e293b', fontSize: '14px', fontFamily: 'monospace' }}>
                    {order.order_id}
                  </td>
                  <td style={{ padding: '12px', color: '#1e293b', fontSize: '14px', fontWeight: '500' }}>
                    {order.title}
                  </td>
                  <td style={{ padding: '12px', color: '#dc2626', fontSize: '14px', fontWeight: '600', textAlign: 'right' }}>
                    {order.amount.toFixed(2)}₪
                  </td>
                  <td style={{ padding: '12px', color: '#6b7280', fontSize: '14px' }}>
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px', color: '#6b7280', fontSize: '14px' }}>
                    {order.ordered_by}
                  </td>
                  <td style={{ padding: '12px', color: '#6b7280', fontSize: '14px', maxWidth: '200px' }}>
                    {order.notes ? (
                      <div style={{ 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        fontStyle: 'italic' 
                      }} title={order.notes}>
                        {order.notes}
                      </div>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: getStatusBgColor(order.status),
                      color: getStatusColor(order.status)
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#6b7280', fontSize: '14px' }}>
                    {order.handler || <span style={{ color: '#9ca3af' }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      {filteredOrders.length > 0 && (
        <div style={{ 
          marginTop: '20px', 
          padding: '16px', 
          backgroundColor: '#f8fafc', 
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
            <div>
              <span style={{ color: '#6b7280' }}>Total Orders: </span>
              <span style={{ color: '#1e293b', fontWeight: '600' }}>{filteredOrders.length}</span>
            </div>
            <div>
              <span style={{ color: '#6b7280' }}>Total Amount: </span>
              <span style={{ color: '#dc2626', fontWeight: '600' }}>
                {filteredOrders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}₪
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;