import React, { useState } from 'react';

interface AdminModalProps {
  onLogin: () => void;
  onClose: () => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ onLogin, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === 'Hapoel2025') {
      onLogin();
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <h2>Admin Access</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="input"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', marginBottom: '16px' }}
            autoFocus
          />
          {error && <div className="error">{error}</div>}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              Login
            </button>
            <button type="button" className="btn" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;