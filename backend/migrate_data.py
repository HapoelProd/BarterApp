#!/usr/bin/env python3
"""
Data migration script from SQLite to PostgreSQL
Transfers all data from the old SQLite database to the new SQLAlchemy models
"""

import sqlite3
import os
from datetime import datetime
from models import db, Supplier, Order, Transaction
from app_new import create_app

def migrate_data():
    """Migrate data from SQLite to PostgreSQL/SQLAlchemy"""
    
    # Create Flask app context
    app = create_app('development')  # Start with development config
    
    with app.app_context():
        print("Starting data migration...")
        
        # Check if SQLite database exists
        sqlite_path = 'barter_management.db'
        if not os.path.exists(sqlite_path):
            print("SQLite database not found. Creating empty tables...")
            db.create_all()
            print("Empty database created successfully")
            return
        
        # Connect to SQLite
        conn = sqlite3.connect(sqlite_path)
        cursor = conn.cursor()
        
        try:
            # Create all tables in the new database
            db.create_all()
            print("Database tables created")
            
            # Migrate Suppliers
            print("Migrating suppliers...")
            cursor.execute('''
                SELECT Supplier_ID, Supplier_Name, Initial_Amount, Current_Amount, 
                       created_at, updated_at 
                FROM suppliers
            ''')
            
            suppliers_data = cursor.fetchall()
            supplier_mapping = {}  # Map old IDs to new IDs
            
            for row in suppliers_data:
                old_id, name, initial_amount, current_amount, created_at, updated_at = row
                
                supplier = Supplier(
                    name=name,
                    initial_amount=float(initial_amount),
                    current_amount=float(current_amount)
                )
                
                # Set timestamps if they exist
                if created_at:
                    try:
                        supplier.created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                    except:
                        supplier.created_at = datetime.utcnow()
                
                if updated_at:
                    try:
                        supplier.updated_at = datetime.fromisoformat(updated_at.replace('Z', '+00:00'))
                    except:
                        supplier.updated_at = datetime.utcnow()
                
                db.session.add(supplier)
                db.session.flush()  # Get the new ID
                supplier_mapping[old_id] = supplier.id
                print(f"  ✓ Migrated supplier: {name} (ID: {old_id} -> {supplier.id})")
            
            # Migrate Orders
            print("📦 Migrating orders...")
            cursor.execute('''
                SELECT Order_ID, Supplier_ID, Order_Title, Order_Amount, 
                       Order_Date, Order_By, Notes, Order_Status, Handler, created_at
                FROM orders
            ''')
            
            orders_data = cursor.fetchall()
            
            for row in orders_data:
                order_id, supplier_id, title, amount, order_date, ordered_by, notes, status, handler, created_at = row
                
                # Map old supplier ID to new supplier ID
                new_supplier_id = supplier_mapping.get(supplier_id)
                if not new_supplier_id:
                    print(f"  ⚠️  Skipping order {order_id} - supplier {supplier_id} not found")
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
                
                # Set timestamps
                if order_date:
                    try:
                        order.order_date = datetime.fromisoformat(order_date.replace('Z', '+00:00'))
                    except:
                        order.order_date = datetime.utcnow()
                
                if created_at:
                    try:
                        order.created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                    except:
                        order.created_at = datetime.utcnow()
                
                db.session.add(order)
                print(f"  ✓ Migrated order: {order_id} for supplier {new_supplier_id}")
            
            # Migrate Transactions
            print("💰 Migrating transactions...")
            cursor.execute('''
                SELECT id, supplier_id, transaction_type, amount, description, created_at
                FROM transactions
            ''')
            
            transactions_data = cursor.fetchall()
            
            for row in transactions_data:
                old_id, supplier_id, transaction_type, amount, description, created_at = row
                
                # Map old supplier ID to new supplier ID
                new_supplier_id = supplier_mapping.get(supplier_id)
                if not new_supplier_id:
                    print(f"  ⚠️  Skipping transaction {old_id} - supplier {supplier_id} not found")
                    continue
                
                transaction = Transaction(
                    supplier_id=new_supplier_id,
                    transaction_type=transaction_type,
                    amount=float(amount),
                    description=description
                )
                
                # Set timestamp
                if created_at:
                    try:
                        transaction.created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                    except:
                        transaction.created_at = datetime.utcnow()
                
                db.session.add(transaction)
                print(f"  ✓ Migrated transaction: {transaction_type} for supplier {new_supplier_id}")
            
            # Commit all changes
            db.session.commit()
            
            print("\n✅ Data migration completed successfully!")
            print(f"   📊 Migrated {len(suppliers_data)} suppliers")
            print(f"   📦 Migrated {len(orders_data)} orders")
            print(f"   💰 Migrated {len(transactions_data)} transactions")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Migration failed: {str(e)}")
            raise
        
        finally:
            conn.close()

def backup_sqlite():
    """Create a backup of the SQLite database"""
    import shutil
    
    sqlite_path = 'barter_management.db'
    if os.path.exists(sqlite_path):
        backup_path = f'barter_management_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.db'
        shutil.copy2(sqlite_path, backup_path)
        print(f"📁 SQLite backup created: {backup_path}")
        return backup_path
    return None

if __name__ == '__main__':
    print("🚀 Barter App Database Migration")
    print("=" * 40)
    
    # Create backup first
    backup_file = backup_sqlite()
    
    # Run migration
    migrate_data()
    
    print("\n" + "=" * 40)
    print("🎉 Migration complete!")
    if backup_file:
        print(f"💾 Original SQLite backup: {backup_file}")
    print("🔄 You can now switch to using app_new.py")