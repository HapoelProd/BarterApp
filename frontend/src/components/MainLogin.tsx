import React, { useState } from 'react';

interface MainLoginProps {
  onLogin: () => void;
}

const MainLogin: React.FC<MainLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Check password
    if (password === 'HapoelJLM') {
      setTimeout(() => {
        setIsLoading(false);
        onLogin();
      }, 500);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setError('Invalid password. Please try again.');
        setPassword('');
      }, 500);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: '#2d2d2d',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        border: '1px solid #444',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img 
            src="/logo.jpeg" 
            alt="Hapoel Logo" 
            style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              marginBottom: '16px',
              border: '3px solid #dc2626'
            }} 
          />
          <h1 style={{ 
            color: '#ffffff', 
            margin: '0 0 8px 0', 
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            Barter Management System
          </h1>
          <p style={{ 
            color: '#cccccc', 
            margin: '0',
            fontSize: '16px'
          }}>
            Hapoel JLM
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              color: '#ffffff', 
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              System Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter system password"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #555',
                borderRadius: '8px',
                background: '#1a1a1a',
                color: '#ffffff',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#dc2626'}
              onBlur={(e) => e.target.style.borderColor = '#555'}
            />
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: isLoading ? '#666' : '#dc2626',
              color: '#ffffff',
              border: 'none',
              padding: '14px 20px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease',
              opacity: isLoading ? 0.7 : 1
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#b91c1c';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#dc2626';
              }
            }}
          >
            {isLoading ? 'Authenticating...' : 'Access System'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          padding: '16px',
          background: '#1a1a1a',
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          <p style={{ 
            color: '#888', 
            margin: '0',
            fontSize: '12px'
          }}>
            🔒 Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainLogin;