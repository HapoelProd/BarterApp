# Deployment Guide - Barter Management System

## Prerequisites
1. GitHub account
2. Railway account (sign up at railway.app)

## Step 1: Deploy Backend to Railway

### 1.1 Prepare Repository
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 1.2 Deploy on Railway
1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your BarterApp repository
4. Railway will auto-detect Python and deploy the backend

### 1.3 Set Environment Variables
In Railway dashboard → Variables:
```
FLASK_HOST=0.0.0.0
FLASK_PORT=8000
FLASK_DEBUG=False
ADMIN_PASSWORD=Hapoel2025
```

### 1.4 Get Backend URL
- Copy the generated Railway URL (e.g., `https://your-app.railway.app`)

## Step 2: Deploy Frontend

### 2.1 Update Frontend Configuration
Update `frontend/.env`:
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

### 2.2 Option A: Deploy Frontend to Railway (Separate Service)
1. Create new Railway service
2. Connect to same GitHub repo
3. Set root directory to `/frontend`
4. Deploy

### 2.3 Option B: Deploy Frontend to Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set Framework Preset: "Create React App"
4. Set Root Directory: `frontend`
5. Add Environment Variable: `REACT_APP_API_URL=https://your-backend-url.railway.app`
6. Deploy

## Step 3: Test Deployment
1. Visit your frontend URL
2. Test admin login (password: Hapoel2025)
3. Test supplier management
4. Test order creation and approval

## Important Notes
- SQLite database will persist on Railway but may reset on redeploys
- For production, consider upgrading to PostgreSQL (Railway provides this)
- CORS is already configured for cross-origin requests
- All necessary deployment files are included

## File Structure Added for Deployment
```
BarterApp/
├── Procfile                 # Process definition
├── railway.toml            # Railway configuration
├── requirements.txt        # Python dependencies
├── .env.example           # Environment template
└── frontend/
    ├── railway.toml       # Frontend Railway config
    └── .env.example       # Frontend environment template
```