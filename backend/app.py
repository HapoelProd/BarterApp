from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from models import db, Supplier, Order, Transaction
from config import config

load_dotenv()

def create_app(config_name=None):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Use production configuration (PostgreSQL only)
    if config_name is None:
        config_name = 'production'
    
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    CORS(app)
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    return app

app = create_app()

@app.route('/')
def home():
    return jsonify({
        "message": "Barter Management System API",
        "version": "2.0.0",
        "database": "PostgreSQL",
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
            suppliers_list = Supplier.query.order_by(Supplier.name).all()
            return jsonify([supplier.to_dict() for supplier in suppliers_list])
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
            
            # Check if supplier name already exists
            existing_supplier = Supplier.query.filter_by(name=name).first()
            if existing_supplier:
                return jsonify({"message": "Supplier name already exists"}), 400
            
            # Create new supplier
            supplier = Supplier(
                name=name,
                initial_amount=initial_amount,
                current_amount=current_amount
            )
            
            db.session.add(supplier)
            db.session.flush()  # Get the ID
            
            # Create initial transaction
            transaction = Transaction(
                supplier_id=supplier.id,
                transaction_type='initial',
                amount=initial_amount,
                description='Initial supplier setup'
            )
            
            db.session.add(transaction)
            db.session.commit()
            
            return jsonify({
                "message": "Supplier added successfully",
                "supplier": supplier.to_dict()
            }), 201
                
        except ValueError:
            return jsonify({"message": "Invalid number format for amounts"}), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Server error: {str(e)}"}), 500

@app.route('/api/suppliers/<int:supplier_id>', methods=['PUT', 'DELETE'])
def supplier_operations(supplier_id):
    if request.method == 'PUT':
        try:
            supplier = Supplier.query.get_or_404(supplier_id)
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
            
            # Check if name is unique (exclude current supplier)
            existing_supplier = Supplier.query.filter(
                Supplier.name == name, 
                Supplier.id != supplier_id
            ).first()
            if existing_supplier:
                return jsonify({"message": "Supplier name already exists"}), 400
            
            # Update supplier
            supplier.name = name
            supplier.initial_amount = initial_amount
            supplier.current_amount = current_amount
            
            # Create update transaction
            transaction = Transaction(
                supplier_id=supplier_id,
                transaction_type='update',
                amount=current_amount,
                description=f'Supplier updated - Current amount set to {current_amount}'
            )
            
            db.session.add(transaction)
            db.session.commit()
            
            return jsonify({
                "message": "Supplier updated successfully",
                "supplier": supplier.to_dict()
            }), 200
                
        except ValueError:
            return jsonify({"message": "Invalid number format for amounts"}), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Server error: {str(e)}"}), 500
    
    elif request.method == 'DELETE':
        try:
            supplier = Supplier.query.get_or_404(supplier_id)
            supplier_name = supplier.name
            
            # Delete supplier (cascade will handle transactions and orders)
            db.session.delete(supplier)
            db.session.commit()
            
            return jsonify({"message": f'Supplier "{supplier_name}" and all history deleted successfully'}), 200
                
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Server error: {str(e)}"}), 500

@app.route('/api/orders', methods=['GET', 'POST'])
def orders():
    if request.method == 'GET':
        try:
            orders_list = Order.query.order_by(Order.created_at.desc()).all()
            return jsonify([order.to_dict() for order in orders_list])
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
            
            # Check if order ID already exists
            existing_order = Order.query.filter_by(order_id=order_id).first()
            if existing_order:
                return jsonify({"message": "Order ID already exists"}), 400
            
            # Verify supplier exists
            supplier = Supplier.query.get(supplier_id)
            if not supplier:
                return jsonify({"message": "Supplier not found"}), 400
            
            # Create new order
            order = Order(
                order_id=order_id,
                supplier_id=supplier_id,
                order_title=order_title,
                order_amount=order_amount,
                order_date=order_date,
                ordered_by=ordered_by,
                notes=notes
            )
            
            db.session.add(order)
            db.session.commit()
            
            return jsonify({
                "message": "Order created successfully",
                "order": order.to_dict()
            }), 201
                
        except ValueError:
            return jsonify({"message": "Invalid number format for supplier ID or amount"}), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Server error: {str(e)}"}), 500

@app.route('/api/orders/<order_id>/approve', methods=['PUT'])
def approve_order(order_id):
    try:
        data = request.get_json()
        handler_name = data.get('handler_name', '').strip()
        
        if not handler_name:
            return jsonify({"message": "Handler name is required"}), 400
        
        order = Order.query.filter_by(order_id=order_id).first()
        if not order:
            return jsonify({"message": "Order not found"}), 404
        
        if order.order_status != 'Pending':
            return jsonify({"message": f"Order is already {order.order_status.lower()}"}), 400
        
        # Update order status
        order.order_status = 'Approved'
        order.handler = handler_name
        
        # Update supplier balance
        supplier = order.supplier
        supplier.current_amount -= order.order_amount
        
        # Create transaction record
        transaction = Transaction(
            supplier_id=order.supplier_id,
            transaction_type='order_approved',
            amount=-order.order_amount,
            description=f'Order {order_id} approved by {handler_name}'
        )
        
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            "message": f"Order {order_id} approved successfully by {handler_name}",
            "order": order.to_dict()
        }), 200
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Server error: {str(e)}"}), 500

@app.route('/api/orders/<order_id>/reject', methods=['PUT'])
def reject_order(order_id):
    try:
        data = request.get_json()
        handler_name = data.get('handler_name', '').strip()
        
        if not handler_name:
            return jsonify({"message": "Handler name is required"}), 400
        
        order = Order.query.filter_by(order_id=order_id).first()
        if not order:
            return jsonify({"message": "Order not found"}), 404
        
        if order.order_status != 'Pending':
            return jsonify({"message": f"Order is already {order.order_status.lower()}"}), 400
        
        # Update order status
        order.order_status = 'Rejected'
        order.handler = handler_name
        
        db.session.commit()
        
        return jsonify({
            "message": f"Order {order_id} rejected successfully by {handler_name}",
            "order": order.to_dict()
        }), 200
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Server error: {str(e)}"}), 500

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    password = data.get('password', '')
    admin_password = app.config['ADMIN_PASSWORD']
    
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
    # Railway provides PORT environment variable, fallback to FLASK_PORT or 5000
    port = int(os.getenv('PORT', os.getenv('FLASK_PORT', 5000)))
    host = os.getenv('FLASK_HOST', '0.0.0.0')
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    print(f"Starting Flask server on {host}:{port}")
    print(f"Database: {app.config['SQLALCHEMY_DATABASE_URI']}")
    app.run(debug=debug, host=host, port=port)