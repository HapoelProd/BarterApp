# Port Configuration for Collaboration

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

## Mac Users - AirPlay Conflict
If you get "Port 5000 is in use", disable AirPlay Receiver:
System Preferences → General → AirPlay & Handoff → Turn off "AirPlay Receiver"