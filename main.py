#!/usr/bin/env python3
"""
Main entry point for BarterApp backend
This ensures Railway detects the project as Python
"""

import os
import sys

# Add backend directory to Python path
backend_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend')
sys.path.insert(0, backend_path)

# Change working directory to backend
os.chdir(backend_path)

# Import the Flask app from backend
from app import app

if __name__ == '__main__':
    # Railway provides PORT environment variable
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    
    print(f"Starting BarterApp backend on {host}:{port}")
    print(f"Working directory: {os.getcwd()}")
    print(f"Python path: {sys.path[:3]}")  # Show first 3 entries
    app.run(host=host, port=port, debug=False)