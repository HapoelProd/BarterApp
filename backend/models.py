from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from decimal import Decimal

db = SQLAlchemy()

class Supplier(db.Model):
    __tablename__ = 'suppliers'
    
    id = db.Column('Supplier_ID', db.Integer, primary_key=True, autoincrement=True)
    name = db.Column('supplier_name', db.String(255), nullable=False, unique=True)
    initial_amount = db.Column('initial_amount', db.Numeric(10, 2), nullable=False)
    current_amount = db.Column('current_amount', db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    orders = db.relationship('Order', backref='supplier', lazy=True, cascade='all, delete-orphan')
    transactions = db.relationship('Transaction', backref='supplier', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'initial_amount': float(self.initial_amount),
            'current_amount': float(self.current_amount),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Transaction(db.Model):
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.Supplier_ID'), nullable=False)
    transaction_type = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'supplier_id': self.supplier_id,
            'transaction_type': self.transaction_type,
            'amount': float(self.amount),
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Order(db.Model):
    __tablename__ = 'orders'
    __table_args__ = (
        db.CheckConstraint("order_status IN ('Pending', 'Approved', 'Rejected')", name='order_status_check'),
    )
    
    order_id = db.Column('order_id', db.String(50), primary_key=True)
    supplier_id = db.Column('supplier_id', db.Integer, db.ForeignKey('suppliers.Supplier_ID'), nullable=False)
    order_title = db.Column('order_title', db.String(255), nullable=False)
    order_amount = db.Column('order_amount', db.Numeric(10, 2), nullable=False)
    order_date = db.Column('order_date', db.DateTime, default=datetime.utcnow)
    ordered_by = db.Column('ordered_by', db.String(100), nullable=False)
    notes = db.Column('notes', db.Text)
    order_status = db.Column('order_status', db.String(20), default='Pending')
    handler = db.Column('handler', db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'order_id': self.order_id,
            'supplier_id': self.supplier_id,
            'supplier_name': self.supplier.name if self.supplier else f'Unknown Supplier (ID: {self.supplier_id})',
            'title': self.order_title,
            'amount': float(self.order_amount),
            'order_date': self.order_date.isoformat() if self.order_date else None,
            'ordered_by': self.ordered_by,
            'notes': self.notes,
            'status': self.order_status,
            'handler': self.handler,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }