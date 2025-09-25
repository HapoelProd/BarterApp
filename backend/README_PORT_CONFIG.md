# Running BarterApp Locally - Complete Setup Guide

## Quick Start (Both Backend & Frontend)

### 1. Start Backend (Flask API)
```bash
cd backend
python app.py
```
Backend will run on: `http://localhost:5000`

### 2. Start Frontend (React App) 
```bash
cd frontend
npm start
```
Frontend will run on: `http://localhost:3000`

### 3. Test the Application
- Open your browser to `http://localhost:3000`
- The React frontend will communicate with the Flask backend automatically

## Default Setup
The Flask backend runs on port 5000 by default using the `.env` file configuration.

## If Port 5000 is Already in Use

### Option 1: Change your local .env file
Edit `backend/.env` and change:
```
FLASK_PORT=5001
```

### Option 2: Use environment variable (temporary)
```bash
cd backend
FLASK_PORT=5001 python app.py
```

### Option 3: Use different port temporarily
```bash
cd backend
export FLASK_PORT=5001  # Mac/Linux
set FLASK_PORT=5001     # Windows
python app.py
```

## Available Environment Variables
- `FLASK_PORT`: Port number (default: 5000)
- `FLASK_HOST`: Host address (default: 0.0.0.0)
- `FLASK_DEBUG`: Debug mode (default: True)
- `ADMIN_PASSWORD`: Admin login password (default: Hapoel2025)

## Common Ports to Try
If 5000 is taken, try these ports:
- 5001
- 5002
- 8000
- 8001
- 3001

## Frontend Port Conflicts
If port 3000 is busy for the React frontend:

```bash
cd frontend
PORT=3001 npm start  # Mac/Linux
```

```bash
cd frontend
set PORT=3001 && npm start  # Windows
```

## Backend Port Configuration for Frontend
If your backend runs on a different port, update the frontend configuration:

1. **Edit `frontend/.env` file:**
   ```
   REACT_APP_API_URL=http://localhost:5001
   ```
   
2. **Or set environment variable:**
   ```bash
   cd frontend
   REACT_APP_API_URL=http://localhost:5001 npm start
   ```

**Important:** After changing the backend port in `.env`, restart the React development server for changes to take effect.

## Mac Users - AirPlay Conflict
If you get "Port 5000 is in use", disable AirPlay Receiver:
System Preferences → General → AirPlay & Handoff → Turn off "AirPlay Receiver"

## Complete Development Setup
1. **Terminal 1** (Backend):
   ```bash
   cd backend
   python app.py
   # Server runs on http://localhost:5000
   ```

2. **Terminal 2** (Frontend):
   ```bash
   cd frontend
   npm start
   # App opens at http://localhost:3000
   ```

3. **Access the app**: Open browser to `http://localhost:3000`

## Prerequisites
- **Backend**: Python 3.x, Flask, python-dotenv
- **Frontend**: Node.js, npm
- Run `pip install -r requirements.txt` in backend folder
- Run `npm install` in frontend folder