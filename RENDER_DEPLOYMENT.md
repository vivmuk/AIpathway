# 🚀 Deploy Full Next.js App to Render

## ✅ Everything on Render - One Platform!

No more Netlify! Your entire AIPathway app (frontend + backend) runs on Render.

---

## 📋 Step-by-Step Deployment

### 1️⃣ Prepare Your Repository

Your code is already ready! Just make sure it's pushed to GitHub:

```bash
git add .
git commit -m "Deploy full Next.js app to Render"
git push
```

---

### 2️⃣ Create Render Web Service

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Click "New +"** → **"Web Service"**
3. **Connect Repository**: 
   - Click "Connect account" if needed
   - Select your GitHub account
   - Choose: `vivmuk/AIpathway`

---

### 3️⃣ Configure the Service

**Basic Settings:**
- **Name**: `aipathway` (or your choice)
- **Region**: Choose closest to you (e.g., Oregon, Frankfurt)
- **Branch**: `main`
- **Root Directory**: Leave blank (uses repo root)
- **Runtime**: `Node`
- **Build Command**: 
  ```bash
  npm install && npm run build
  ```
- **Start Command**:
  ```bash
  npm start
  ```

**Instance Type:**
- **Free** ($0/month - 750 hours free, then spins down after 15 min)
- **Starter** ($7/month - always on, no cold starts) ⭐ Recommended

---

### 4️⃣ Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these:

```
NODE_ENV=production
VENICE_API_KEY=ntmhtbP2fr_pOQsmuLPuN_nm6lm2INWKiNcvrdEfEC
VENICE_API_URL=https://api.venice.ai/api/v1
```

---

### 5️⃣ Click "Create Web Service"

Render will:
1. Clone your repo ✅
2. Run `npm install` ✅
3. Run `npm run build` ✅
4. Start with `npm start` ✅
5. Give you a URL like: `https://aipathway.onrender.com` 🎉

**Build time**: ~5-10 minutes

---

## 🎯 Your Live URL

After deployment, your app will be at:

```
https://aipathway.onrender.com
```

This is your ONLY URL now - no more Netlify! Everything (frontend + API) runs here.

---

## ⚙️ How It Works

### Next.js on Render:

```
User → https://aipathway.onrender.com
         ↓
      Next.js Server (Render)
         ↓
      /api/generate-course (same server!)
         ↓
      Venice AI
```

**Benefits:**
- ✅ Everything in one place
- ✅ No CORS issues
- ✅ No timeout limits (2-min AI generation works!)
- ✅ Simpler architecture
- ✅ Free SSL
- ✅ Auto-deploy on git push

---

## 🔧 Post-Deployment Configuration

### 1. **Auto-Deploy from GitHub**

Already enabled! Every time you push to `main`, Render auto-deploys.

### 2. **Custom Domain (Optional)**

Want to use your own domain?

1. Go to **Settings** → **Custom Domain**
2. Add your domain (e.g., `aipathway.com`)
3. Update DNS:
   ```
   CNAME: aipathway.onrender.com
   ```
4. Free SSL auto-configured!

### 3. **Environment Variables**

Update anytime in **Dashboard** → **Environment** → **Edit**

---

## 🐛 Troubleshooting

### Issue 1: Build Fails

**Check build logs:**
```
Dashboard → Logs → Build Logs
```

**Common fixes:**
- Make sure `package.json` has `"build": "next build"`
- Make sure `"start": "next start"` exists
- Check Node version (Render uses Node 18 by default)

### Issue 2: Cold Starts (Free Tier)

**Symptom**: First request after 15 minutes takes 30-60 seconds

**Solutions:**
1. **Upgrade to Starter** ($7/mo) - always on, no cold starts
2. **Keep pinging** - Set up a cron job to ping every 10 minutes
3. **Accept it** - Free tier is great for testing!

### Issue 3: API Timeout

**Symptom**: 504 error after 2 minutes

**Check:**
- Render free tier: No timeout on Web Services ✅
- Your API should work fine with 2-min generation
- Check logs: **Dashboard** → **Logs** → **Deploy Logs**

---

## 📊 Monitoring

### View Logs in Real-Time:

**Dashboard** → **Logs** → **Deploy Logs**

You'll see:
```
🚀 AIPathway API running on port 10000
📝 Received course generation request
🤖 Calling Venice AI...
✅ Course generated successfully
```

### Metrics:

**Dashboard** → **Metrics**
- CPU usage
- Memory usage
- Request count
- Response times

---

## 💰 Pricing

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0 | 750 hours/month, spins down after 15 min inactivity |
| **Starter** | $7/mo | Always on, no cold starts, faster CPU |
| **Standard** | $25/mo | More CPU/RAM, better performance |

**Recommendation**: Start with Free, upgrade to Starter ($7) if cold starts are annoying.

---

## 🔄 Update & Redeploy

### Automatic (Recommended):

```bash
# Make changes locally
git add .
git commit -m "Update feature X"
git push

# Render auto-detects and deploys! 🎉
```

### Manual:

**Dashboard** → **Manual Deploy** → **Deploy latest commit**

---

## ✅ Success Checklist

After deployment:

- [ ] Site loads at `https://aipathway.onrender.com`
- [ ] Home page displays properly (blue colors, compact layout)
- [ ] Quiz works
- [ ] Persona selection works
- [ ] Course generation works (may take 30-90 seconds)
- [ ] No 504 timeout errors
- [ ] HTML export works
- [ ] Check logs for errors

---

## 🧪 Testing Your Deployment

### 1. Test Home Page:
```
https://aipathway.onrender.com
```

### 2. Test API Directly:
```bash
curl -X POST https://aipathway.onrender.com/api/generate-course \
  -H "Content-Type: application/json" \
  -d '{
    "userProfile": {
      "aiScore": 50,
      "personaType": "applied",
      "learningFocus": ["prompt engineering"],
      "learningStyle": "hands-on",
      "timeCommitment": "5 hours per week",
      "goals": ["Learn AI tools"],
      "codingExperience": "intermediate",
      "aiToolsUsed": ["ChatGPT"],
      "industry": "Technology & Software",
      "aiMindset": "growth"
    }
  }'
```

Should return course JSON in 30-90 seconds.

---

## 🎉 You're Done!

Your AIPathway app is now live on Render!

**Share your link**: `https://aipathway.onrender.com`

---

## 📚 Additional Resources

- **Render Docs**: https://render.com/docs
- **Next.js on Render**: https://render.com/docs/deploy-nextjs
- **Support**: https://render.com/docs/support

---

## 🚨 Important Notes

1. **First deploy takes 5-10 minutes** - be patient!
2. **Cold starts on free tier** - first request after inactivity takes ~30s
3. **No Netlify needed** - everything is on Render now
4. **Auto-deploy enabled** - push to GitHub to update
5. **Logs are your friend** - check them if anything goes wrong

---

## ⚡ Quick Commands

```bash
# View logs (install Render CLI)
npm install -g render

# Login
render login

# View logs
render logs -s aipathway

# SSH into service (if needed)
render ssh aipathway
```

---

Need help? Check the logs first, then reach out! 🚀

