# 🐙 GitHub Setup & Push Instructions

## Quick Start (Command Line)

### If this is your first time pushing to this repo:

```bash
# 1. Make sure you're in the project directory
cd "C:\Users\vivga\OneDrive\AI\AI Projects\Personalized Learning"

# 2. Initialize git (if not already done)
git init

# 3. Add all files
git add .

# 4. Commit
git commit -m "Initial commit: AIPathway with industry & AI mindset features"

# 5. Add your remote (the GitHub repo)
git remote add origin https://github.com/vivmuk/AIpathway.git

# 6. Push to GitHub
git push -u origin main
```

### If you get an error about branch name:

Some systems default to `master` instead of `main`:

```bash
# Rename branch to main
git branch -M main

# Then push
git push -u origin main
```

---

## Updating Your Code (After Initial Push)

```bash
# 1. Add changed files
git add .

# 2. Commit with a descriptive message
git commit -m "Add industry customization and AI growth mindset integration"

# 3. Push to GitHub
git push
```

---

## What Gets Pushed?

Your `.gitignore` file ensures these are **NOT** pushed:
- `node_modules/` (dependencies)
- `.next/` (build output)
- `.env.local` (your local API keys)

These **ARE** pushed:
- Source code (`src/`)
- Configuration files
- Documentation (`.md` files)
- `.env.example` (template without real keys)

---

## Verify Your Push

After pushing, visit:
https://github.com/vivmuk/AIpathway

You should see all your files there!

---

## Common Git Commands

```bash
# Check status (what's changed)
git status

# See commit history
git log --oneline

# Undo last commit (keeps changes)
git reset --soft HEAD~1

# Discard local changes
git checkout -- <filename>

# Pull latest from GitHub
git pull origin main
```

---

## Git Troubleshooting

### Error: "remote origin already exists"

```bash
# Remove old remote
git remote remove origin

# Add correct remote
git remote add origin https://github.com/vivmuk/AIpathway.git
```

### Error: "Updates were rejected"

```bash
# Pull first, then push
git pull origin main --rebase
git push
```

### Authentication Issues

GitHub now requires Personal Access Tokens (PAT) instead of passwords.

**Generate a token**:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Check "repo" scope
4. Copy token (you won't see it again!)
5. Use token as password when pushing

**Or use GitHub CLI**:
```bash
# Install GitHub CLI
winget install --id GitHub.cli

# Authenticate
gh auth login

# Push normally
git push
```

---

## Best Practices

1. **Commit often** with clear messages:
   ```bash
   git commit -m "Fix: Markdown rendering in HTML export"
   git commit -m "Feature: Add industry customization to quiz"
   git commit -m "Update: Improve AI mindset prompts"
   ```

2. **Pull before push** if working across machines:
   ```bash
   git pull origin main
   git push
   ```

3. **Check status before committing**:
   ```bash
   git status
   git diff  # See what changed
   ```

4. **Use `.gitignore`** to avoid pushing sensitive files

---

## GitHub Desktop (Alternative to Command Line)

If you prefer a GUI:

1. Download: https://desktop.github.com/
2. Install and sign in
3. File → Add Local Repository → Select your project folder
4. Stage changes (checkboxes)
5. Write commit message
6. Click "Commit to main"
7. Click "Push origin"

---

## Next Steps After Pushing

1. ✅ Verify files on GitHub: https://github.com/vivmuk/AIpathway
2. 🚀 Deploy to Netlify (see `DEPLOYMENT_GUIDE.md`)
3. 🔗 Share your repo with collaborators

---

## Need Help?

- **Git Basics**: https://git-scm.com/book/en/v2
- **GitHub Guides**: https://guides.github.com/
- **Common Git Issues**: https://ohshitgit.com/

