from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from database import init_database, add_supplier, get_all_suppliers, get_supplier_by_id, update_supplier, delete_supplier, initialize_supplier, add_order, get_all_orders, update_order_status

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

@app.route('/api/suppliers', methods=['GET', 'POST']) # type: ignore
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

@app.route('/api/orders', methods=['GET', 'POST']) # type: ignore
def orders():
    if request.method == 'GET':
        try:
            orders_list = get_all_orders()
            return jsonify(orders_list)
        except Exception as e:
            return jsonify({"error": f"Failed to fetch orders: {str(e)}"}), 500
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['orderId', 'supplierId', 'orderTitle', 'orderAmount', 'orderDate', 'orderedBy']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({"message": f"Missing required field: {field}"}), 400
            
            order_id = data['orderId']
            supplier_id = int(data['supplierId'])
            order_title = (data['orderTitle'] or '').strip()
            order_amount = float(data['orderAmount'])
            order_date = data['orderDate']
            ordered_by = (data['orderedBy'] or '').strip()
            notes = (data.get('notes') or '').strip() or None
            
            # Validate values
            if order_amount <= 0:
                return jsonify({"message": "Order amount must be greater than 0"}), 400
                
            if len(order_title) < 1:
                return jsonify({"message": "Order title cannot be empty"}), 400
                
            if len(ordered_by) < 1:
                return jsonify({"message": "Ordered by cannot be empty"}), 400
            
            # Add order to database
            result = add_order(order_id, supplier_id, order_title, order_amount, order_date, ordered_by, notes)
            
            return jsonify({
                "message": result['message'],
                "order": result['order']
            }), 201
                
        except ValueError:
            return jsonify({"message": "Invalid number format for supplier ID or amount"}), 400
        except Exception as e:
            return jsonify({"message": f"Server error: {str(e)}"}), 500

@app.route('/api/orders/<order_id>/approve', methods=['PUT'])
def approve_order(order_id):
    try:
        data = request.get_json()
        handler_name = data.get('handler_name', '').strip()
        
        if not handler_name:
            return jsonify({"message": "Handler name is required"}), 400
        
        result = update_order_status(order_id, 'Approved', handler_name)
        
        if result['success']:
            return jsonify({
                "message": result['message'],
                "order": result['order']
            }), 200
        else:
            return jsonify({"message": result['message']}), 400
            
    except Exception as e:
        return jsonify({"message": f"Server error: {str(e)}"}), 500

@app.route('/api/orders/<order_id>/reject', methods=['PUT'])
def reject_order(order_id):
    try:
        data = request.get_json()
        handler_name = data.get('handler_name', '').strip()
        
        if not handler_name:
            return jsonify({"message": "Handler name is required"}), 400
        
        result = update_order_status(order_id, 'Rejected', handler_name)
        
        if result['success']:
            return jsonify({
                "message": result['message'],
                "order": result['order']
            }), 200
        else:
            return jsonify({"message": result['message']}), 400
            
    except Exception as e:
        return jsonify({"message": f"Server error: {str(e)}"}), 500


@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    password = data.get('password', '')
    admin_password = os.getenv('ADMIN_PASSWORD', 'Hapoel2025')
    
    if password == admin_password:
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
    port = int(os.getenv('FLASK_PORT', 5000))
    host = os.getenv('FLASK_HOST', '0.0.0.0')
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    print(f"Starting Flask server on {host}:{port}")
    app.run(debug=debug, host=host, port=port)