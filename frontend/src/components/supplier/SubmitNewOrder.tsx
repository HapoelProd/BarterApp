import React, { useState } from 'react';
import { formatCurrency, formatDateForInput } from '../../utils/formatters';
import API_ENDPOINTS from '../../config/api';

interface Supplier {
  id: number;
  name: string;
  initial_amount: number;
  current_amount: number;
}

interface SubmitNewOrderProps {
  selectedSupplier: Supplier;
  onOrderSubmitted?: () => void;
}

const SubmitNewOrder: React.FC<SubmitNewOrderProps> = ({ 
  selectedSupplier, 
  onOrderSubmitted 
}) => {
  const [orderData, setOrderData] = useState({
    orderTitle: '',
    amount: '',
    orderDate: formatDateForInput(), // Today's date
    orderedBy: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate required fields
      if (!orderData.orderTitle.trim()) {
        setMessage({ type: 'error', text: 'Order Title is required' });
        setIsSubmitting(false);
        return;
      }


      if (!orderData.amount || parseFloat(orderData.amount) <= 0) {
        setMessage({ type: 'error', text: 'Valid amount is required' });
        setIsSubmitting(false);
        return;
      }

      if (!orderData.orderDate) {
        setMessage({ type: 'error', text: 'Order Date is required' });
        setIsSubmitting(false);
        return;
      }

      if (!orderData.orderedBy.trim()) {
        setMessage({ type: 'error', text: 'Ordered By is required' });
        setIsSubmitting(false);
        return;
      }

      // Generate unique order ID
      const timestamp = Date.now();
      const orderId = `ORD-${selectedSupplier.id}-${timestamp}`;

      const orderPayload = {
        orderId: orderId,
        supplierId: selectedSupplier.id,
        orderTitle: orderData.orderTitle.trim(),
        orderAmount: parseFloat(orderData.amount),
        orderDate: orderData.orderDate,
        orderedBy: orderData.orderedBy.trim(),
        notes: orderData.notes.trim() || null,
        orderStatus: 'Pending',
        handler: null
      };

      const response = await fetch(API_ENDPOINTS.ORDERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({ type: 'success', text: result.message });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to submit order' });
        setIsSubmitting(false);
        return;
      }
      
      // Reset form
      setOrderData({
        orderTitle: '',
        amount: '',
        orderDate: formatDateForInput(),
        orderedBy: '',
        notes: ''
      });

      if (onOrderSubmitted) {
        onOrderSubmitted();
      }

    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check if the backend server is running.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setOrderData({
      orderTitle: '',
      amount: '',
      orderDate: new Date().toISOString().split('T')[0],
      orderedBy: '',
      notes: ''
    });
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '20px' }}>Submit New Order</h3>
      <p style={{ color: '#475569', marginBottom: '24px' }}>
        Create a new barter order request for <strong>{selectedSupplier.name}</strong>. 
        This order will be submitted for approval.
      </p>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Supplier (Read-only) */}
          <div>
            <label style={{ color: '#000000', display: 'block', marginBottom: '8px' }}>
              Supplier *
            </label>
            <input
              type="text"
              value={selectedSupplier.name}
              className="input"
              style={{ width: '100%', backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
              disabled
              readOnly
            />
            <small style={{ color: '#6b7280', fontSize: '12px' }}>
              Selected from sidebar
            </small>
          </div>

          {/* Order Title */}
          <div>
            <label style={{ color: '#000000', display: 'block', marginBottom: '8px' }}>
              Order Title *
            </label>
            <input
              type="text"
              name="orderTitle"
              value={orderData.orderTitle}
              onChange={handleInputChange}
              className="input"
              required
              style={{ width: '100%' }}
              placeholder="Enter descriptive order title"
              disabled={isSubmitting}
              maxLength={100}
            />
          </div>

          {/* Amount */}
          <div>
            <label style={{ color: '#000000', display: 'block', marginBottom: '8px' }}>
              Amount (₪) *
            </label>
            <input
              type="number"
              name="amount"
              value={orderData.amount}
              onChange={handleInputChange}
              className="input"
              required
              style={{ width: '100%' }}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              disabled={isSubmitting}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {/* Order Date */}
            <div>
              <label style={{ color: '#000000', display: 'block', marginBottom: '8px' }}>
                Order Date *
              </label>
              <input
                type="date"
                name="orderDate"
                value={orderData.orderDate}
                onChange={handleInputChange}
                className="input"
                required
                style={{ width: '100%' }}
                disabled={isSubmitting}
              />
              <small style={{ color: '#6b7280', fontSize: '12px' }}>
                Supports historical and future dates
              </small>
            </div>

            {/* Ordered By */}
            <div>
              <label style={{ color: '#000000', display: 'block', marginBottom: '8px' }}>
                Ordered By *
              </label>
              <input
                type="text"
                name="orderedBy"
                value={orderData.orderedBy}
                onChange={handleInputChange}
                className="input"
                required
                style={{ width: '100%' }}
                placeholder="Enter your name"
                disabled={isSubmitting}
                maxLength={50}
              />
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label style={{ color: '#000000', display: 'block', marginBottom: '8px' }}>
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={orderData.notes}
              onChange={handleInputChange}
              className="input"
              style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
              placeholder="Additional notes or special instructions..."
              disabled={isSubmitting}
              maxLength={500}
            />
            <small style={{ color: '#6b7280', fontSize: '12px' }}>
              {orderData.notes.length}/500 characters
            </small>
          </div>


          {/* Current Supplier Balance Info */}
          <div style={{
            padding: '16px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}>
            <h4 style={{ color: '#374151', margin: '0 0 8px 0', fontSize: '14px' }}>
              {selectedSupplier.name} - Current Balance
            </h4>
            <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
              <div>
                <span style={{ color: '#6b7280' }}>Available: </span>
                <span style={{ color: selectedSupplier.current_amount > 0 ? '#059669' : '#dc2626', fontWeight: '600' }}>
                  {formatCurrency(selectedSupplier.current_amount)}
                </span>
              </div>
              {orderData.amount && (
                <div>
                  <span style={{ color: '#6b7280' }}>After Order: </span>
                  <span style={{ 
                    color: (selectedSupplier.current_amount - parseFloat(orderData.amount || '0')) >= 0 ? '#059669' : '#dc2626',
                    fontWeight: '600' 
                  }}>
                    {formatCurrency(selectedSupplier.current_amount - parseFloat(orderData.amount || '0'))}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1
            }}
          >
            {isSubmitting ? 'Submitting Order...' : 'Submit Order'}
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

export default SubmitNewOrder;