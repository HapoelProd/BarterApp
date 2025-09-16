from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({
        "message": "Barter Management System API",
        "version": "1.0.0",
        "endpoints": {
            "/api/suppliers": "Supplier management",
            "/api/orders": "Order management",
            "/api/balances": "Balance tracking"
        }
    })

@app.route('/api/suppliers', methods=['GET', 'POST'])
def suppliers():
    if request.method == 'GET':
        return jsonify([
            {"id": 1, "name": "Supplier A", "balance": 1500.00, "status": "active"},
            {"id": 2, "name": "Supplier B", "balance": -750.50, "status": "active"},
            {"id": 3, "name": "Supplier C", "balance": 0.00, "status": "pending"}
        ])
    
    elif request.method == 'POST':
        data = request.get_json()
        return jsonify({
            "message": "Supplier created successfully",
            "supplier": data
        }), 201

@app.route('/api/orders', methods=['GET', 'POST'])
def orders():
    if request.method == 'GET':
        return jsonify([
            {"id": 1, "supplier_id": 1, "amount": 500.00, "status": "pending", "date": "2024-01-15"},
            {"id": 2, "supplier_id": 2, "amount": 250.00, "status": "approved", "date": "2024-01-14"},
            {"id": 3, "supplier_id": 1, "amount": 1000.00, "status": "completed", "date": "2024-01-13"}
        ])
    
    elif request.method == 'POST':
        data = request.get_json()
        return jsonify({
            "message": "Order created successfully",
            "order": data
        }), 201

@app.route('/api/balances/<int:supplier_id>')
def get_balance(supplier_id):
    return jsonify({
        "supplier_id": supplier_id,
        "balance": 1500.00,
        "transactions": [
            {"date": "2024-01-15", "amount": 500.00, "type": "credit", "description": "Order payment"},
            {"date": "2024-01-14", "amount": -250.00, "type": "debit", "description": "Service charge"},
            {"date": "2024-01-13", "amount": 1250.00, "type": "credit", "description": "Initial deposit"}
        ]
    })

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    password = data.get('password', '')
    
    if password == 'Hapoel2025':
        return jsonify({
            "success": True,
            "message": "Login successful",
            "token": "admin_token_placeholder"
        })
    else:
        return jsonify({
            "success": False,
            "message": "Invalid password"
        }), 401

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)