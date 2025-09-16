import sqlite3
import os
from datetime import datetime

DATABASE_PATH = 'barter_management.db'

def init_database():
    """Initialize the database with required tables"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Create suppliers table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS suppliers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            price DECIMAL(10, 2) NOT NULL,
            initial_amount DECIMAL(10, 2) NOT NULL,
            current_amount DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create transactions table for tracking changes
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            supplier_id INTEGER NOT NULL,
            transaction_type TEXT NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (supplier_id) REFERENCES suppliers (id)
        )
    ''')
    
    conn.commit()
    conn.close()

def add_supplier(name, price, initial_amount, current_amount):
    """Add a new supplier to the database"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO suppliers (name, price, initial_amount, current_amount)
            VALUES (?, ?, ?, ?)
        ''', (name, price, initial_amount, current_amount))
        
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
        SELECT id, name, price, initial_amount, current_amount, created_at, updated_at
        FROM suppliers
        ORDER BY name
    ''')
    
    suppliers = []
    for row in cursor.fetchall():
        suppliers.append({
            'id': row[0],
            'name': row[1],
            'price': float(row[2]),
            'initial_amount': float(row[3]),
            'current_amount': float(row[4]),
            'created_at': row[5],
            'updated_at': row[6]
        })
    
    conn.close()
    return suppliers

def get_supplier_by_id(supplier_id):
    """Get a specific supplier by ID"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, name, price, initial_amount, current_amount, created_at, updated_at
        FROM suppliers
        WHERE id = ?
    ''', (supplier_id,))
    
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return {
            'id': row[0],
            'name': row[1],
            'price': float(row[2]),
            'initial_amount': float(row[3]),
            'current_amount': float(row[4]),
            'created_at': row[5],
            'updated_at': row[6]
        }
    return None

def update_supplier_amount(supplier_id, new_amount, transaction_type='adjustment', description=''):
    """Update supplier current amount and log transaction"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    try:
        # Get current amount
        cursor.execute('SELECT current_amount FROM suppliers WHERE id = ?', (supplier_id,))
        result = cursor.fetchone()
        if not result:
            return {'success': False, 'message': 'Supplier not found'}
        
        old_amount = result[0]
        difference = new_amount - old_amount
        
        # Update supplier
        cursor.execute('''
            UPDATE suppliers 
            SET current_amount = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
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

if __name__ == '__main__':
    # Initialize database when run directly
    init_database()
    print("Database initialized successfully!")