# Barter Management System - Backend

Flask-based REST API for the Barter Management System.

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Run the application:
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

- `GET /` - API information
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create new supplier
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/balances/<supplier_id>` - Get supplier balance
- `POST /api/admin/login` - Admin authentication