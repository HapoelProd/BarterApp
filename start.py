#!/usr/bin/env python3
"""
Simple launcher for Railway deployment
"""
import os
import sys

# Change to backend directory
os.chdir('backend')

# Add backend to Python path
sys.path.insert(0, 'backend')

# Import and run the Flask app
from app import app

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)