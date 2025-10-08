#!/usr/bin/env python3
"""
Script to manually create PostgreSQL tables
Run this if tables aren't being created automatically
"""

import os
from models import db
from app import create_app

def create_tables():
    """Create all database tables"""
    
    # Force production config to use PostgreSQL
    app = create_app('production')
    
    with app.app_context():
        print(f"Database URL: {app.config['SQLALCHEMY_DATABASE_URI']}")
        
        try:
            # Create all tables
            db.create_all()
            print("✅ All tables created successfully!")
            
            # List tables to verify
            from sqlalchemy import text
            result = db.session.execute(text("SELECT tablename FROM pg_tables WHERE schemaname = 'public';"))
            tables = [row[0] for row in result]
            
            print(f"📋 Tables in database: {tables}")
            
            if not tables:
                print("⚠️ No tables found! Check your DATABASE_URL environment variable.")
            
        except Exception as e:
            print(f"❌ Error creating tables: {str(e)}")
            print("Make sure your DATABASE_URL is correct and PostgreSQL is accessible.")

if __name__ == '__main__':
    print("🔧 Creating PostgreSQL tables...")
    create_tables()