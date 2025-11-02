# Quick Start Guide - Collabx

## Prerequisites
- Node.js (v14 or higher) - [Download](https://nodejs.org/)
- MongoDB (local installation OR use MongoDB Atlas free tier)
- npm (comes with Node.js)

## Step 1: Install Dependencies

Run this command from the project root directory:

```bash
npm run install-all
```

This installs all dependencies for:
- Root package (concurrently for running both servers)
- Server (Express, MongoDB, etc.)
- Client (React, etc.)

**OR** install manually:
```bash
npm install              # Root
cd server && npm install && cd ..    # Server
cd client && npm install && cd ..     # Client
```

## Step 2: Set Up MongoDB (Local - Using MongoDB Compass)

**For Local MongoDB Setup (FREE - No payment required):**

📘 **See detailed guide:** `MONGODB_COMPASS_SETUP.md`

**Quick Steps:**
1. **Install MongoDB Community Server:**
   - Download from: https://www.mongodb.com/try/download/community
   - Run the installer
   - ✅ **Check "Install MongoDB Compass"** during installation
   - Choose "Install MongoDB as a Service"

2. **Start MongoDB Service:**
   - Open Services (`Win + R` → type `services.msc`)
   - Find "MongoDB" service
   - Right-click → **Start** (if not running)

3. **Connect MongoDB Compass:**
   - Open MongoDB Compass
   - Connect using: `mongodb://localhost:27017`
   - Click **Connect**

**✅ Your project is already configured for local MongoDB!** The `server/.env` file has the correct connection string.

### Alternative: MongoDB Atlas (Cloud - Optional)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account (Free tier available)
3. Create a free cluster
4. Get your connection string and update `server/.env`

## Step 3: Create Environment Files

### Server `.env` file
Create a file named `.env` in the `server` folder with:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/collabx
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

**For MongoDB Atlas**, replace `MONGODB_URI` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/collabx
```

### Client `.env` file (Optional)
Create a file named `.env` in the `client` folder with:
```env
REACT_APP_API_URL=http://localhost:5000
```

## Step 4: Run the Project

### Option 1: Run Both Server and Client Together (Recommended)
From the root directory:
```bash
npm run dev
```

This starts:
- Backend server on `http://localhost:5000`
- Frontend client on `http://localhost:3000`

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```
Client runs on: `http://localhost:3000`

## Step 5: Access the Application

1. Open your browser and go to: `http://localhost:3000`
2. You should see the Collabx homepage
3. Register a new account or login to start using the platform

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:
- Change `PORT=5000` in `server/.env` to another port (e.g., `PORT=5001`)
- Update `REACT_APP_API_URL` in `client/.env` accordingly

### MongoDB Connection Error
- Make sure MongoDB is running (if using local)
- Check your MongoDB connection string is correct
- For Atlas: Make sure your IP is whitelisted (can use 0.0.0.0/0 for development)

### Module Not Found Errors
- Run `npm run install-all` again
- Delete `node_modules` folders and reinstall:
  ```bash
  rm -rf node_modules server/node_modules client/node_modules
  npm run install-all
  ```

### Windows-specific Issues
If `npm run install-all` fails on Windows PowerShell:
- Run each command separately:
  ```powershell
  npm install
  cd server; npm install; cd ..
  cd client; npm install; cd ..
  ```

## What's Next?

1. **Register** a new account
2. **Create an Activity** - Click "Create Activity" in the navbar
3. **Browse Activities** - Search for activities that interest you
4. **Join Activities** - Request to join activities as a collaborator
5. **Manage Projects** - Use the Dashboard to manage your hosted activities

## Need Help?

Check the full README.md for detailed documentation about API endpoints, project structure, and features.
