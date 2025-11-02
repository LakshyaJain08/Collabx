# MongoDB Compass Setup Guide for Collabx

This guide will help you set up MongoDB locally with MongoDB Compass for the Collabx project.

## Prerequisites
- Windows 10/11 (or your OS)
- Administrator access (for installation)

## Step 1: Install MongoDB Community Server

1. **Download MongoDB Community Server:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select:
     - **Version**: Latest (or 7.0)
     - **Platform**: Windows
     - **Package**: MSI (recommended)
   - Click **Download**

2. **Install MongoDB:**
   - Run the downloaded `.msi` file
   - Follow the installation wizard:
     - Choose **Complete** installation
     - Select **Install MongoDB as a Service**
     - Choose **Run service as Network Service user**
     - **Install MongoDB Compass** (GUI) - ✅ Check this box!
     - Click **Install**

3. **Verify Installation:**
   - Open Command Prompt or PowerShell as Administrator
   - Run:
     ```powershell
     mongod --version
     ```
   - You should see the MongoDB version number

## Step 2: Start MongoDB Service

MongoDB usually starts automatically after installation, but let's verify:

1. **Check if MongoDB is running:**
   - Press `Win + R`, type `services.msc`, press Enter
   - Look for **MongoDB** service
   - Ensure it's **Running** (Status should be "Running")
   
   If it's not running:
   - Right-click on **MongoDB** → **Start**

2. **Alternative: Start via Command Line:**
   ```powershell
   # Open PowerShell as Administrator
   net start MongoDB
   ```

## Step 3: Install MongoDB Compass (if not installed)

1. **If you didn't install Compass during MongoDB installation:**
   - Download MongoDB Compass from: https://www.mongodb.com/try/download/compass
   - Install the downloaded file

2. **Launch MongoDB Compass:**
   - Search for "MongoDB Compass" in Windows Start Menu
   - Open the application

## Step 4: Connect MongoDB Compass to Local MongoDB

1. **In MongoDB Compass:**
   - You'll see the connection screen
   - Use this connection string: `mongodb://localhost:27017`
   - Click **Connect** (or press Enter)

2. **Verify Connection:**
   - You should see your local MongoDB instance
   - You'll see databases like `admin`, `config`, `local`
   - The `collabx` database will be created automatically when you first run the application

## Step 5: Verify Project Configuration

Your project is already configured for local MongoDB! The `server/.env` file contains:

```env
MONGODB_URI=mongodb://localhost:27017/collabx
```

This is correct for local MongoDB. The database name is `collabx` and it will be created automatically.

## Step 6: Test the Setup

1. **Start your Collabx project:**
   ```powershell
   npm run dev
   ```

2. **Watch for connection success:**
   - In the terminal, you should see: `Connected to MongoDB`
   - If you see connection errors, check that MongoDB service is running

3. **Check in MongoDB Compass:**
   - Refresh Compass (if it's open)
   - You should see the `collabx` database appear
   - Expand it to see collections: `users`, `activities`, `memberships`, `tasks`

## Step 7: View Your Data in Compass

Once you start using the application:

1. **Create an account** on the Collabx website
2. **Refresh MongoDB Compass**
3. Navigate to `collabx` database
4. You'll see collections with your data:
   - `users` - Registered users
   - `activities` - Created activities/projects
   - `memberships` - Activity memberships
   - `tasks` - Assigned tasks

## Troubleshooting

### MongoDB Service Won't Start

**Error:** "MongoDB service failed to start"

**Solution:**
1. Check if port 27017 is already in use:
   ```powershell
   netstat -ano | findstr :27017
   ```
2. If another process is using it, stop that process or change MongoDB port
3. Restart MongoDB service from Services (services.msc)

### Connection Refused

**Error:** "ECONNREFUSED" or "Unable to connect"

**Solution:**
1. Ensure MongoDB service is running:
   ```powershell
   net start MongoDB
   ```
2. Check if MongoDB is listening on port 27017:
   ```powershell
   netstat -ano | findstr :27017
   ```

### Cannot Find MongoDB Compass

**Solution:**
- If Compass wasn't installed, download it separately:
  - https://www.mongodb.com/try/download/compass
- Or install via MongoDB installer again and check "Install MongoDB Compass"

### Database Not Appearing in Compass

**Note:** The `collabx` database will only appear after you:
1. Start the Collabx application
2. Make your first API call (like registering a user)
3. Refresh Compass

Empty databases aren't shown in Compass until they contain data.

## Quick Reference

**MongoDB Connection String (Local):**
```
mongodb://localhost:27017/collabx
```

**Start MongoDB Service:**
```powershell
net start MongoDB
```

**Stop MongoDB Service:**
```powershell
net stop MongoDB
```

**Check MongoDB Status:**
- Open Services (`services.msc`)
- Look for "MongoDB" service

## Next Steps

Once MongoDB is running:
1. Your `server/.env` is already configured correctly
2. Run `npm run dev` from the project root
3. Open `http://localhost:3000` in your browser
4. Start using Collabx!

---

**Note:** MongoDB Community Server is completely free and runs on your local machine. No payment or cloud subscription required!
