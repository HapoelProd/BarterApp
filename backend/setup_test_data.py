import sqlite3
import os
from database import init_database, add_supplier

# Initialize database with clean schema
init_database()

# Add test supplier "Aroma" with 10,000 initial and current amount
result = add_supplier("Aroma", 10000.0, 10000.0)

if result['success']:
    print(f"✅ Test supplier 'Aroma' added successfully with ID: {result['id']}")
    print("Initial Amount: 10,000₪")
    print("Current Amount: 10,000₪")
else:
    print(f"❌ Failed to add test supplier: {result['message']}")

print("\nDatabase setup complete! Ready for testing.")