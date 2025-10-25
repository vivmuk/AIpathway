# 🚀 AIPathway Deployment Guide

## Prerequisites
- GitHub account
- Netlify account (free tier works!)
- Your Venice AI API key

---

## 📦 Step 1: Push to GitHub

### First Time Setup

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: AIPathway with industry customization and AI mindset"

# Add your GitHub remote
git remote add origin https://github.com/vivmuk/AIpathway.git

# Push to GitHub
git push -u origin main
```

### Subsequent Updates

```bash
# Add changed files
git add .

# Commit with a message
git commit -m "Your update message here"

# Push to GitHub
git push
```

---

## 🌐 Step 2: Deploy to Netlify

### Option A: Via Netlify UI (Recommended)

1. **Go to Netlify**: https://app.netlify.com/
2. **Click "Add new site"** → "Import an existing project"
3. **Connect to GitHub**: Authorize Netlify to access your repos
4. **Select Repository**: Choose `vivmuk/AIpathway`
5. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Leave other settings as default
6. **Add Environment Variables**:
   - Click "Show advanced" → "New variable"
   - Add:
     - `VENICE_API_KEY` = `ntmhtbP2fr_pOQsmuLPuN_nm6lm2INWKiNcvrdEfEC`
     - `VENICE_API_URL` = `https://api.venice.ai/api/v1`
7. **Click "Deploy site"**

### Option B: Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify site
netlify init

# Follow prompts:
# - Create & configure a new site
# - Choose your team
# - Site name: aipathway (or your preferred name)
# - Build command: npm run build
# - Publish directory: .next

# Set environment variables
netlify env:set VENICE_API_KEY "ntmhtbP2fr_pOQsmuLPuN_nm6lm2INWKiNcvrdEfEC"
netlify env:set VENICE_API_URL "https://api.venice.ai/api/v1"

# Deploy
netlify deploy --prod
```

---

## ⚙️ Step 3: Configure Build Settings (Netlify UI)

1. Go to **Site settings** → **Build & deploy**
2. Ensure:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18` (set in Environment → Environment variables → `NODE_VERSION` = `18`)

---

## 🔐 Step 4: Environment Variables

**IMPORTANT**: After deployment, verify your environment variables in Netlify:

1. Go to **Site settings** → **Environment variables**
2. Ensure these are set:
   - `VENICE_API_KEY` = Your API key
   - `VENICE_API_URL` = `https://api.venice.ai/api/v1`
   - `NODE_VERSION` = `18`

---

## 🧪 Step 5: Test Your Deployment

Once deployed, Netlify will give you a URL like: `https://your-site-name.netlify.app`

1. Visit the URL
2. Click **🚀 Quick Start with AI Quiz**
3. Answer questions (including industry and mindset!)
4. Generate a course
5. Try the HTML export to verify markdown rendering

---

## 🔄 Automatic Deployments

Netlify will automatically redeploy when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update: improved markdown rendering"
git push

# Netlify automatically detects the push and deploys!
```

Watch deployment status at: https://app.netlify.com/

---

## 🐛 Troubleshooting

### Build Fails

**Check build logs** in Netlify dashboard:
- Common issues: missing dependencies, environment variables not set
- Solution: Add all env vars in Netlify UI

### API Calls Fail

**Symptoms**: Course generation returns 500 errors
**Solutions**:
1. Verify `VENICE_API_KEY` is set correctly in Netlify
2. Check API key is still valid
3. Check Netlify Function logs in dashboard

### Missing Environment Variables

If you see `undefined` errors for API key:
1. Go to Netlify dashboard
2. Site settings → Environment variables
3. Add/update variables
4. Trigger redeploy: Deploys → Trigger deploy → Deploy site

---

## 📊 Monitor Your Deployment

- **Netlify Dashboard**: https://app.netlify.com/
- **View Logs**: Site → Deploys → Click on a deploy → View logs
- **Function Logs**: Functions → Select function → View logs

---

## 🎯 Custom Domain (Optional)

To use your own domain:

1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Follow DNS configuration instructions
4. Netlify provides free SSL certificates!

---

## 💡 Tips

- **Preview Deployments**: Netlify creates preview URLs for pull requests
- **Rollback**: Can rollback to previous deploys in the Deploys tab
- **Split Testing**: Can run A/B tests with different versions
- **Forms**: Netlify Forms work great for feedback collection

---

## 🆘 Need Help?

- **Netlify Docs**: https://docs.netlify.com/
- **Netlify Community**: https://answers.netlify.com/
- **Check Build Logs**: Always check logs first!

---

## ✅ Success!

Your site is live! 🎉

Share your AIPathway link:
`https://your-site-name.netlify.app`

