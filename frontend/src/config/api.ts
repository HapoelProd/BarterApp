// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  BASE: API_BASE_URL,
  SUPPLIERS: `${API_BASE_URL}/api/suppliers`,
  ORDERS: `${API_BASE_URL}/api/orders`,
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

export default API_ENDPOINTS;