from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from database import init_database, add_supplier, get_all_suppliers, get_supplier_by_id, update_supplier, delete_supplier

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize database on startup
init_database()

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
        try:
            suppliers_list = get_all_suppliers()
            return jsonify(suppliers_list)
        except Exception as e:
            return jsonify({"error": f"Failed to fetch suppliers: {str(e)}"}), 500
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['name', 'initialAmount']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({"message": f"Missing required field: {field}"}), 400
            
            name = data['name'].strip()
            initial_amount = float(data['initialAmount'])
            current_amount = float(data.get('currentAmount', initial_amount))
            
            # Validate values
            if initial_amount < 0 or current_amount < 0:
                return jsonify({"message": "Amounts must be non-negative"}), 400
                
            if len(name) < 1:
                return jsonify({"message": "Supplier name cannot be empty"}), 400
            
            # Add supplier to database
            result = add_supplier(name, initial_amount, current_amount)
            
            if result['success']:
                # Get the created supplier
                supplier = get_supplier_by_id(result['id'])
                return jsonify({
                    "message": result['message'],
                    "supplier": supplier
                }), 201
            else:
                return jsonify({"message": result['message']}), 400
                
        except ValueError:
            return jsonify({"message": "Invalid number format for amounts"}), 400
        except Exception as e:
            return jsonify({"message": f"Server error: {str(e)}"}), 500

@app.route('/api/suppliers/<int:supplier_id>', methods=['PUT', 'DELETE'])
def supplier_operations(supplier_id):
    if request.method == 'PUT':
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['name', 'initialAmount', 'currentAmount']
            for field in required_fields:
                if field not in data:
                    return jsonify({"message": f"Missing required field: {field}"}), 400
            
            name = data['name'].strip()
            initial_amount = float(data['initialAmount'])
            current_amount = float(data['currentAmount'])
            
            # Validate values
            if initial_amount < 0 or current_amount < 0:
                return jsonify({"message": "Amounts must be non-negative"}), 400
                
            if len(name) < 1:
                return jsonify({"message": "Supplier name cannot be empty"}), 400
            
            # Update supplier in database
            result = update_supplier(supplier_id, name, initial_amount, current_amount)
            
            if result['success']:
                # Get the updated supplier
                supplier = get_supplier_by_id(supplier_id)
                return jsonify({
                    "message": result['message'],
                    "supplier": supplier
                }), 200
            else:
                return jsonify({"message": result['message']}), 400
                
        except ValueError:
            return jsonify({"message": "Invalid number format for amounts"}), 400
        except Exception as e:
            return jsonify({"message": f"Server error: {str(e)}"}), 500
    
    elif request.method == 'DELETE':
        try:
            # Delete supplier from database
            result = delete_supplier(supplier_id)
            
            if result['success']:
                return jsonify({"message": result['message']}), 200
            else:
                return jsonify({"message": result['message']}), 404
                
        except Exception as e:
            return jsonify({"message": f"Server error: {str(e)}"}), 500

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