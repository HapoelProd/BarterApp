import sqlite3
import os
from database import init_database

# Initialize database with completely clean schema
init_database()

print("✅ Database initialized with clean schema!")
print("📋 Ready for fresh testing - no mock data, all tables empty.")
print("\n📝 Next steps:")
print("1. Use Admin section to add suppliers")
print("2. Use Supplier Actions to submit orders")
print("3. Use Order Approvals to process orders")
print("\n🎯 Starting with completely fresh, real data only!")