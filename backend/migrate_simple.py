#!/usr/bin/env python3
"""
Simple data migration script from SQLite to PostgreSQL
"""

import sqlite3
import os
from datetime import datetime
from models import db, Supplier, Order, Transaction
from app_new import create_app

def migrate_data():
    """Migrate data from SQLite to PostgreSQL/SQLAlchemy"""
    
    app = create_app('development')
    
    with app.app_context():
        print("Starting data migration...")
        
        sqlite_path = 'barter_management.db'
        if not os.path.exists(sqlite_path):
            print("SQLite database not found. Creating empty tables...")
            db.create_all()
            print("Empty database created successfully")
            return
        
        conn = sqlite3.connect(sqlite_path)
        cursor = conn.cursor()
        
        try:
            db.create_all()
            print("Database tables created")
            
            print("Migrating suppliers...")
            cursor.execute('SELECT Supplier_ID, Supplier_Name, Initial_Amount, Current_Amount FROM suppliers')
            
            suppliers_data = cursor.fetchall()
            supplier_mapping = {}
            
            for row in suppliers_data:
                old_id, name, initial_amount, current_amount = row
                
                supplier = Supplier(
                    name=name,
                    initial_amount=float(initial_amount),
                    current_amount=float(current_amount)
                )
                
                db.session.add(supplier)
                db.session.flush()
                supplier_mapping[old_id] = supplier.id
                print(f"  Migrated supplier: {name} (ID: {old_id} -> {supplier.id})")
            
            print("Migrating orders...")
            cursor.execute('SELECT Order_ID, Supplier_ID, Order_Title, Order_Amount, Order_Date, Order_By, Notes, Order_Status, Handler FROM orders')
            
            orders_data = cursor.fetchall()
            
            for row in orders_data:
                order_id, supplier_id, title, amount, order_date, ordered_by, notes, status, handler = row
                
                new_supplier_id = supplier_mapping.get(supplier_id)
                if not new_supplier_id:
                    print(f"  Skipping order {order_id} - supplier {supplier_id} not found")
                    continue
                
                order = Order(
                    order_id=order_id,
                    supplier_id=new_supplier_id,
                    order_title=title,
                    order_amount=float(amount),
                    ordered_by=ordered_by,
                    notes=notes,
                    order_status=status or 'Pending',
                    handler=handler
                )
                
                db.session.add(order)
                print(f"  Migrated order: {order_id}")
            
            print("Migrating transactions...")
            cursor.execute('SELECT supplier_id, transaction_type, amount, description FROM transactions')
            
            transactions_data = cursor.fetchall()
            
            for row in transactions_data:
                supplier_id, transaction_type, amount, description = row
                
                new_supplier_id = supplier_mapping.get(supplier_id)
                if not new_supplier_id:
                    continue
                
                transaction = Transaction(
                    supplier_id=new_supplier_id,
                    transaction_type=transaction_type,
                    amount=float(amount),
                    description=description
                )
                
                db.session.add(transaction)
            
            db.session.commit()
            
            print("Data migration completed successfully!")
            print(f"Migrated {len(suppliers_data)} suppliers")
            print(f"Migrated {len(orders_data)} orders") 
            print(f"Migrated {len(transactions_data)} transactions")
            
        except Exception as e:
            db.session.rollback()
            print(f"Migration failed: {str(e)}")
            raise
        
        finally:
            conn.close()

if __name__ == '__main__':
    print("Barter App Database Migration")
    print("=" * 40)
    migrate_data()
    print("=" * 40)
    print("Migration complete!")