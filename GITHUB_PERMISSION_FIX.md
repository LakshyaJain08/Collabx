# Fix GitHub Permission Error (403)

## Problem
```
remote: Permission to LakshyaJain08/Collabx.git denied to akashkharate2005.
fatal: unable to access 'https://github.com/LakshyaJain08/Collabx.git/': The requested URL returned error: 403
```

## Solutions

### Solution 1: Add Collaborator (Recommended)
If `LakshyaJain08` owns the repository:

1. **LakshyaJain08** should:
   - Go to: https://github.com/LakshyaJain08/Collabx/settings/access
   - Click **"Add people"** or **"Manage access"**
   - Enter: `akashkharate2005`
   - Select role: **Write** or **Admin**
   - Click **"Add akashkharate2005 to this repository"**

2. **Then akashkharate2005** can push:
   ```powershell
   git push -u origin main
   ```

### Solution 2: Use Personal Access Token
If you have access but authentication is failing:

1. **Create Personal Access Token (as akashkharate2005):**
   - Go to: https://github.com/settings/tokens
   - Click **"Generate new token (classic)"**
   - Name: `Collabx Push Token`
   - Select scopes: ✅ **repo** (full control)
   - Click **"Generate token"**
   - **COPY THE TOKEN** immediately (you won't see it again!)

2. **Update Git Credentials:**
   ```powershell
   # Clear cached credentials
   git credential-manager-core erase
   
   # Or manually remove from Windows Credential Manager:
   # Control Panel → Credential Manager → Windows Credentials
   # Remove any GitHub entries
   ```

3. **Push with Token:**
   ```powershell
   git push -u origin main
   ```
   - Username: `akashkharate2005`
   - Password: **Paste your Personal Access Token** (not your GitHub password)

### Solution 3: Use SSH (For Long-term)
Set up SSH authentication:

1. **Generate SSH Key (if not exists):**
   ```powershell
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # Press Enter to accept default location
   # Press Enter twice for no passphrase (or set one)
   ```

2. **Add SSH Key to GitHub:**
   - Copy public key:
     ```powershell
     cat ~/.ssh/id_ed25519.pub
     # Or:
     type ~/.ssh/id_ed25519.pub
     ```
   - Go to: https://github.com/settings/keys
   - Click **"New SSH key"**
   - Title: `Collabx Project`
   - Paste the key
   - Click **"Add SSH key"**

3. **Change Remote to SSH:**
   ```powershell
   git remote set-url origin git@github.com:LakshyaJain08/Collabx.git
   git push -u origin main
   ```

### Solution 4: Fork Repository (If you don't have access)
If you can't get access to the original repository:

1. **Fork the repository:**
   - Go to: https://github.com/LakshyaJain08/Collabx
   - Click **"Fork"** (top right)
   - This creates: `https://github.com/akashkharate2005/Collabx`

2. **Change Remote:**
   ```powershell
   git remote set-url origin https://github.com/akashkharate2005/Collabx.git
   git push -u origin main
   ```

3. **Create Pull Request** to merge changes back to original repo

### Solution 5: Check Repository Exists
If the repository doesn't exist yet:

1. **LakshyaJain08** should create it:
   - Go to: https://github.com/new
   - Repository name: `Collabx`
   - Choose **Public** or **Private**
   - **DO NOT** initialize with README
   - Click **"Create repository"**

2. **Then use Solution 1** to add collaborator

## Quick Test
After fixing, test the connection:
```powershell
git push -u origin main
```

You should see:
```
Enumerating objects: 47, done.
Counting objects: 100% (47/47), done.
Writing objects: 100% (47/47), done.
To https://github.com/LakshyaJain08/Collabx.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

## Recommended Approach

**For Team Collaboration:**
1. LakshyaJain08 creates repository
2. LakshyaJain08 adds akashkharate2005 as collaborator (Solution 1)
3. Both can push directly

**For Individual Use:**
1. Use Personal Access Token (Solution 2)
2. Or set up SSH (Solution 3) for better security

---

**Choose the solution that best fits your situation!**
