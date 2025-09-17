import React, { useState, useEffect, useCallback } from 'react';

interface OrderCategory {
  id: number;
  name: string;
  description?: string;
}

const AddOrderCategory: React.FC = () => {
  const [categories, setCategories] = useState<OrderCategory[]>([]);
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchCategories = useCallback(async () => {
    try {
      // Default categories that exist in the system
      const defaultCategories = [
        'Office Supplies',
        'Drinks', 
        'Sports',
        'Tech',
        'Other'
      ];
      
      // For now, show the default categories since we haven't implemented 
      // custom categories in the backend yet
      const defaultCats = defaultCategories.map((cat, index) => ({
        id: index + 1,
        name: cat,
        description: 'Default category'
      }));
      setCategories(defaultCats);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load categories' });
    }
  }, []);

  // Fetch existing categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const categoryName = categoryData.name.trim();
      
      // Validate required fields
      if (!categoryName) {
        setMessage({ type: 'error', text: 'Category name is required' });
        setIsSubmitting(false);
        return;
      }

      // Check if category already exists (case insensitive)
      const existingCategory = categories.find(cat => 
        cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      
      if (existingCategory) {
        setMessage({ type: 'error', text: 'Category already exists' });
        setIsSubmitting(false);
        return;
      }

      // For now, just show success message since backend isn't implemented yet
      setMessage({ 
        type: 'success', 
        text: `Category "${categoryName}" would be added successfully!` 
      });
      
      // Clear form
      setCategoryData({ name: '', description: '' });
      
      // TODO: Once backend is implemented, uncomment this:
      /*
      const response = await fetch('http://localhost:5000/api/order-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: categoryName,
          description: categoryData.description.trim()
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({ type: 'success', text: result.message });
        setCategoryData({ name: '', description: '' });
        await fetchCategories(); // Refresh the list
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to add category' });
      }
      */
      
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check if the backend server is running.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <p style={{ color: '#000000', marginBottom: '20px' }}>
        Add new order categories that suppliers can choose from when creating orders.
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
            Category Name *
          </label>
          <input
            type="text"
            name="name"
            value={categoryData.name}
            onChange={handleInputChange}
            className="input"
            style={{ width: '100%' }}
            placeholder="Enter category name (e.g., Food, Electronics)"
            disabled={isSubmitting}
            maxLength={50}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#000000', display: 'block', marginBottom: '8px' }}>
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={categoryData.description}
            onChange={handleInputChange}
            className="input"
            style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
            placeholder="Brief description of this category"
            disabled={isSubmitting}
            maxLength={200}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#dc2626', marginBottom: '12px' }}>Existing Categories</h4>
          <div style={{ 
            maxHeight: '150px', 
            overflowY: 'auto',
            border: '1px solid #666', 
            borderRadius: '4px',
            padding: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)'
          }}>
            {categories.map(category => (
              <div key={category.id} style={{ 
                color: '#000000', 
                padding: '4px 0',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
              }}>
                <strong>{category.name}</strong>
                {category.description && category.description !== 'Default category' && (
                  <span style={{ color: '#666666', fontSize: '0.9em' }}>
                    {' - ' + category.description}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={handleSubmit}
          disabled={!categoryData.name.trim() || isSubmitting}
          style={{
            backgroundColor: (categoryData.name.trim() && !isSubmitting) ? '#dc2626' : '#666666',
            borderColor: (categoryData.name.trim() && !isSubmitting) ? '#dc2626' : '#666666',
            cursor: (categoryData.name.trim() && !isSubmitting) ? 'pointer' : 'not-allowed',
            opacity: isSubmitting ? 0.6 : 1
          }}
        >
          {isSubmitting ? 'Adding...' : 'Add Category'}
        </button>
      </div>
    </div>
  );
};

export default AddOrderCategory;