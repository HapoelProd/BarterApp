import sqlite3
import os
from datetime import datetime

DATABASE_PATH = 'barter_management.db'

def init_database():
    """Initialize the database with required tables according to new specification"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Drop existing suppliers table if exists (for clean migration)
    cursor.execute('DROP TABLE IF EXISTS suppliers')
    cursor.execute('DROP TABLE IF EXISTS transactions')
    cursor.execute('DROP TABLE IF EXISTS orders')
    
    # Create suppliers table according to specification:
    # Supplier_ID (PK), Supplier_Name (String), Initial_Amount(decimal), Current_Amount(decimal)
    cursor.execute('''
        CREATE TABLE suppliers (
            Supplier_ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Supplier_Name TEXT NOT NULL UNIQUE,
            Initial_Amount DECIMAL(10, 2) NOT NULL,
            Current_Amount DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create transactions table for tracking changes
    cursor.execute('''
        CREATE TABLE transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            supplier_id INTEGER NOT NULL,
            transaction_type TEXT NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (supplier_id) REFERENCES suppliers (Supplier_ID)
        )
    ''')
    
    # Create orders table
    cursor.execute('''
        CREATE TABLE orders (
            Order_ID TEXT PRIMARY KEY,
            Supplier_ID INTEGER NOT NULL,
            Order_Title TEXT NOT NULL,
            Order_Category TEXT CHECK(Order_Category IN ('Office Supplies', 'Drinks', 'Sports', 'Tech', 'Other')),
            Order_Amount DECIMAL(10, 2) NOT NULL,
            Order_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
            Order_By TEXT NOT NULL,
            Notes TEXT,
            Order_Status TEXT CHECK(Order_Status IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Pending',
            Handler TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (Supplier_ID) REFERENCES suppliers (Supplier_ID)
        )
    ''')
    
    conn.commit()
    conn.close()

def add_supplier(name, initial_amount, current_amount):
    """Add a new supplier to the database"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO suppliers (Supplier_Name, Initial_Amount, Current_Amount)
            VALUES (?, ?, ?)
        ''', (name, initial_amount, current_amount))
        
        supplier_id = cursor.lastrowid
        
        # Add initial transaction record
        cursor.execute('''
            INSERT INTO transactions (supplier_id, transaction_type, amount, description)
            VALUES (?, ?, ?, ?)
        ''', (supplier_id, 'initial', initial_amount, 'Initial supplier setup'))
        
        conn.commit()
        return {'success': True, 'id': supplier_id, 'message': 'Supplier added successfully'}
    
    except sqlite3.IntegrityError:
        return {'success': False, 'message': 'Supplier name already exists'}
    except Exception as e:
        return {'success': False, 'message': f'Database error: {str(e)}'}
    finally:
        conn.close()

def get_all_suppliers():
    """Get all suppliers from the database"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT Supplier_ID, Supplier_Name, Initial_Amount, Current_Amount, created_at, updated_at
        FROM suppliers
        ORDER BY Supplier_Name
    ''')
    
    suppliers = []
    for row in cursor.fetchall():
        suppliers.append({
            'id': row[0],
            'name': row[1],
            'initial_amount': float(row[2]),
            'current_amount': float(row[3]),
            'created_at': row[4],
            'updated_at': row[5]
        })
    
    conn.close()
    return suppliers

def get_supplier_by_id(supplier_id):
    """Get a specific supplier by ID"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT Supplier_ID, Supplier_Name, Initial_Amount, Current_Amount, created_at, updated_at
        FROM suppliers
        WHERE Supplier_ID = ?
    ''', (supplier_id,))
    
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return {
            'id': row[0],
            'name': row[1],
            'initial_amount': float(row[2]),
            'current_amount': float(row[3]),
            'created_at': row[4],
            'updated_at': row[5]
        }
    return None

def update_supplier_amount(supplier_id, new_amount, transaction_type='adjustment', description=''):
    """Update supplier current amount and log transaction"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    try:
        # Get current amount
        cursor.execute('SELECT Current_Amount FROM suppliers WHERE Supplier_ID = ?', (supplier_id,))
        result = cursor.fetchone()
        if not result:
            return {'success': False, 'message': 'Supplier not found'}
        
        old_amount = result[0]
        difference = new_amount - old_amount
        
        # Update supplier
        cursor.execute('''
            UPDATE suppliers 
            SET Current_Amount = ?, updated_at = CURRENT_TIMESTAMP
            WHERE Supplier_ID = ?
        ''', (new_amount, supplier_id))
        
        # Log transaction
        cursor.execute('''
            INSERT INTO transactions (supplier_id, transaction_type, amount, description)
            VALUES (?, ?, ?, ?)
        ''', (supplier_id, transaction_type, difference, description or f'Amount updated from {old_amount} to {new_amount}'))
        
        conn.commit()
        return {'success': True, 'message': 'Supplier amount updated successfully'}
    
    except Exception as e:
        return {'success': False, 'message': f'Database error: {str(e)}'}
    finally:
        conn.close()

def update_supplier(supplier_id, name, initial_amount, current_amount):
    """Update supplier information"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if supplier exists
        cursor.execute('SELECT Supplier_Name FROM suppliers WHERE Supplier_ID = ?', (supplier_id,))
        if not cursor.fetchone():
            return {'success': False, 'message': 'Supplier not found'}
        
        # Check if name is unique (exclude current supplier)
        cursor.execute('SELECT Supplier_ID FROM suppliers WHERE Supplier_Name = ? AND Supplier_ID != ?', (name, supplier_id))
        if cursor.fetchone():
            return {'success': False, 'message': 'Supplier name already exists'}
        
        # Update supplier
        cursor.execute('''
            UPDATE suppliers 
            SET Supplier_Name = ?, Initial_Amount = ?, Current_Amount = ?, updated_at = CURRENT_TIMESTAMP
            WHERE Supplier_ID = ?
        ''', (name, initial_amount, current_amount, supplier_id))
        
        # Log transaction for amount change
        cursor.execute('''
            INSERT INTO transactions (supplier_id, transaction_type, amount, description)
            VALUES (?, ?, ?, ?)
        ''', (supplier_id, 'update', current_amount, f'Supplier updated - Current amount set to {current_amount}'))
        
        conn.commit()
        return {'success': True, 'message': 'Supplier updated successfully'}
    
    except sqlite3.IntegrityError:
        return {'success': False, 'message': 'Supplier name already exists'}
    except Exception as e:
        return {'success': False, 'message': f'Database error: {str(e)}'}
    finally:
        conn.close()

def delete_supplier(supplier_id):
    """Delete supplier and all associated transactions"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if supplier exists
        cursor.execute('SELECT Supplier_Name FROM suppliers WHERE Supplier_ID = ?', (supplier_id,))
        result = cursor.fetchone()
        if not result:
            return {'success': False, 'message': 'Supplier not found'}
        
        supplier_name = result[0]
        
        # Delete all transactions first (due to foreign key constraint)
        cursor.execute('DELETE FROM transactions WHERE supplier_id = ?', (supplier_id,))
        
        # Delete the supplier
        cursor.execute('DELETE FROM suppliers WHERE Supplier_ID = ?', (supplier_id,))
        
        conn.commit()
        return {'success': True, 'message': f'Supplier "{supplier_name}" and all history deleted successfully'}
    
    except Exception as e:
        return {'success': False, 'message': f'Database error: {str(e)}'}
    finally:
        conn.close()

def initialize_supplier(supplier_id, new_initial_amount, new_current_amount, export_history=False):
    """Initialize supplier with new amounts and optionally export history to orders"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if supplier exists
        cursor.execute('SELECT Supplier_Name, Initial_Amount, Current_Amount FROM suppliers WHERE Supplier_ID = ?', (supplier_id,))
        result = cursor.fetchone()
        if not result:
            return {'success': False, 'message': 'Supplier not found'}
        
        supplier_name, old_initial, old_current = result
        
        # Export history to orders table if requested
        if export_history:
            # Get all transactions for this supplier
            cursor.execute('''
                SELECT transaction_type, amount, description, created_at 
                FROM transactions 
                WHERE supplier_id = ? 
                ORDER BY created_at
            ''', (supplier_id,))
            
            transactions = cursor.fetchall()
            if transactions:
                # Generate unique order ID for the history export
                import uuid
                import datetime
                
                order_id = f"HIST-{supplier_id}-{int(datetime.datetime.now().timestamp())}"
                
                # Create summary of all transactions as a single order
                total_amount = sum(float(t[1]) for t in transactions)
                transaction_summary = f"History export for {supplier_name}: {len(transactions)} transactions"
                
                cursor.execute('''
                    INSERT INTO orders (
                        Order_ID, Supplier_ID, Order_Title, Order_Category, 
                        Order_Amount, Order_By, Notes, Order_Status, Handler
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    order_id, supplier_id, f"History Export - {supplier_name}", 
                    'Other', total_amount, 'System', 
                    f"Exported {len(transactions)} historical transactions during supplier initialization", 
                    'Approved', 'System'
                ))
        
        # Reset supplier balances
        cursor.execute('''
            UPDATE suppliers 
            SET Initial_Amount = ?, Current_Amount = ?, updated_at = CURRENT_TIMESTAMP
            WHERE Supplier_ID = ?
        ''', (new_initial_amount, new_current_amount, supplier_id))
        
        # Clear all existing transactions for this supplier
        cursor.execute('DELETE FROM transactions WHERE supplier_id = ?', (supplier_id,))
        
        # Add new initialization transaction
        cursor.execute('''
            INSERT INTO transactions (supplier_id, transaction_type, amount, description)
            VALUES (?, ?, ?, ?)
        ''', (supplier_id, 'initialize', new_initial_amount, f'Supplier initialized - Reset to {new_initial_amount}₪'))
        
        conn.commit()
        
        export_msg = " and history exported to orders" if export_history else ""
        return {
            'success': True, 
            'message': f'Supplier "{supplier_name}" initialized successfully{export_msg}',
            'exported_to_orders': export_history
        }
    
    except Exception as e:
        return {'success': False, 'message': f'Database error: {str(e)}'}
    finally:
        conn.close()

def get_orders_by_supplier(supplier_id):
    """Get all orders for a specific supplier"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT Order_ID, Order_Title, Order_Category, Order_Amount, 
               Order_Date, Order_By, Notes, Order_Status, Handler, created_at
        FROM orders
        WHERE Supplier_ID = ?
        ORDER BY Order_Date DESC
    ''', (supplier_id,))
    
    orders = []
    for row in cursor.fetchall():
        orders.append({
            'order_id': row[0],
            'title': row[1],
            'category': row[2],
            'amount': float(row[3]),
            'order_date': row[4],
            'ordered_by': row[5],
            'notes': row[6],
            'status': row[7],
            'handler': row[8],
            'created_at': row[9]
        })
    
    conn.close()
    return orders

if __name__ == '__main__':
    # Initialize database when run directly
    init_database()
    print("Database initialized successfully with new schema!")