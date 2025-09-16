# Barter Management System

A comprehensive barter and inventory management system built with React frontend and Python Flask backend.

## Features

- **Supplier Management**: Track supplier agreements and relationships
- **Barter Balance Tracking**: Monitor barter balances across all suppliers
- **Order Approval System**: Review and approve barter transactions
- **Dark Mode Interface**: Modern dark theme with red, white, and black color scheme
- **Role-Based Access**: Admin and Supplier access levels with authentication

## Project Structure

```
BarterApp/
├── frontend/          # React TypeScript application
└── backend/           # Python Flask API
```

## Getting Started

### Frontend (React)
```bash
cd frontend
npm install
npm start
```
Access at: `http://localhost:3000`

### Backend (Python Flask)
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Access at: `http://localhost:5000`

## Admin Access

- Password: `Hapoel2025`
- Navigate to Admin Actions and enter the password to access admin features

## Pages

1. **Main Page**: Entry point with navigation to Admin and Supplier actions
2. **Admin Actions**: Manage suppliers, view balances, approve orders
3. **Supplier Actions**: Submit orders, check balances, view order history

## Authentication

- Basic password-based authentication for admin access
- No encryption (as requested for simplicity)
- Unlimited retry attempts on password entry