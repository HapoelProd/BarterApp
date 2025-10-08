#!/usr/bin/env python3
"""
Setup script for BarterApp backend
This helps Railway detect the project as Python
"""

from setuptools import setup, find_packages

setup(
    name="barterapp-backend",
    version="2.0.0",
    description="Barter Management System Backend",
    packages=find_packages(),
    install_requires=[
        "Flask==2.3.3",
        "Flask-CORS==4.0.0", 
        "python-dotenv==1.0.0",
        "psycopg2-binary==2.9.9",
        "SQLAlchemy==2.0.21",
        "Flask-SQLAlchemy==3.0.5",
        "gunicorn==21.2.0"
    ],
    python_requires=">=3.8",
)