# GitHub Repository Setup Guide

## Current Status
✅ Git repository initialized
✅ All files committed locally
❌ Push to GitHub failed - repository needs to be created or configured

## Option 1: Repository Doesn't Exist Yet

If the repository `https://github.com/LakshyaJain08/Collabx.git` doesn't exist yet:

1. **Create the repository on GitHub:**
   - Go to: https://github.com/new
   - Repository name: `Collabx`
   - Description: "A Collaboration Platform - Collabx"
   - Choose **Public** or **Private**
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click **Create repository**

2. **Push your code:**
   ```powershell
   git push -u origin main
   ```

## Option 2: Repository Exists But Authentication Required

If the repository exists but you need to authenticate:

### Option A: Use Personal Access Token (Recommended)

1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click **Generate new token (classic)**
   - Name: `Collabx Project`
   - Select scopes: ✅ **repo** (full control of private repositories)
   - Click **Generate token**
   - **COPY THE TOKEN** (you won't see it again!)

2. **Push with token:**
   ```powershell
   git push -u origin main
   ```
   - Username: `LakshyaJain08` (or your GitHub username)
   - Password: **Paste your Personal Access Token**

### Option B: Use GitHub CLI

1. **Install GitHub CLI:**
   ```powershell
   winget install --id GitHub.cli
   ```

2. **Authenticate:**
   ```powershell
   gh auth login
   ```

3. **Push:**
   ```powershell
   git push -u origin main
   ```

### Option C: Use SSH (For regular GitHub usage)

1. **Set up SSH key** (if not already done):
   ```powershell
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **Add SSH key to GitHub:**
   - Copy public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to: https://github.com/settings/keys
   - Click **New SSH key**
   - Paste and save

3. **Change remote to SSH:**
   ```powershell
   git remote set-url origin git@github.com:LakshyaJain08/Collabx.git
   git push -u origin main
   ```

## Quick Push Commands

After setting up authentication, run:

```powershell
# Make sure you're in the project directory
cd "C:\Users\khara\OneDrive - z57nh\Desktop\COLLEGE\SEM 5\Software Engineering\Project comet"

# Check remote is set correctly
git remote -v

# Push to GitHub
git push -u origin main
```

## Verify Push Success

After pushing, you should see:
```
Enumerating objects: 47, done.
Counting objects: 100% (47/47), done.
Delta compression using up to X threads
Compressing objects: 100% (XX/XX), done.
Writing objects: 100% (XX/XX), XX KiB | XX MiB/s, done.
Total XX (delta X), reused 0 (delta 0), pack-reused 0
To https://github.com/LakshyaJain08/Collabx.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

## Check Your Repository

Visit: https://github.com/LakshyaJain08/Collabx

You should see all your files there!

## Troubleshooting

### Error: "repository not found"
- Repository doesn't exist - create it first (Option 1)
- Repository is private and you're not authenticated
- Check the repository URL is correct

### Error: "authentication failed"
- Use Personal Access Token instead of password
- Make sure token has `repo` scope

### Error: "permission denied"
- Check you have write access to the repository
- Verify you're using the correct GitHub account

## Next Steps After Pushing

1. **Add a description** to your GitHub repository
2. **Add topics/tags** like: `collaboration`, `nodejs`, `react`, `mongodb`
3. **Set up branch protection** if working in a team
4. **Create issues** for future enhancements
5. **Add collaborators** if working in a team

---

**Your code is committed and ready to push once the repository is set up!** 🚀
