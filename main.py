#!/usr/bin/env python3
"""
Main entry point for BarterApp backend
This ensures Railway detects the project as Python
"""

import os
import sys

# Add backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Import the Flask app from backend
from app import app

if __name__ == '__main__':
    # Railway provides PORT environment variable
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    
    print(f"Starting BarterApp backend on {host}:{port}")
    app.run(host=host, port=port, debug=False)