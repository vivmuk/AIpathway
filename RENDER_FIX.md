# 🔧 Fix 500 API Error on Render

## Problem
- Frontend loads ✅
- API routes return 500 ❌
- Buttons are clickable but course generation fails

## Root Cause
Environment variables not set on Render!

---

## ✅ SOLUTION: Add Environment Variables

### 1️⃣ Go to Render Dashboard
https://dashboard.render.com/

### 2️⃣ Click on your `aipathway` service

### 3️⃣ Go to "Environment" tab on the left

### 4️⃣ Click "Add Environment Variable"

Add these **3 variables**:

```
NODE_ENV=production
VENICE_API_KEY=ntmhtbP2fr_pOQsmuLPuN_nm6lm2INWKiNcvrdEfEC
VENICE_API_URL=https://api.venice.ai/api/v1
```

**How to add each one:**
1. Key: `NODE_ENV` | Value: `production`
2. Key: `VENICE_API_KEY` | Value: `ntmhtbP2fr_pOQsmuLPuN_nm6lm2INWKiNcvrdEfEC`
3. Key: `VENICE_API_URL` | Value: `https://api.venice.ai/api/v1`

### 5️⃣ Click "Save Changes"

### 6️⃣ Render will auto-redeploy (takes 2-3 minutes)

---

## 🔍 Check Render Logs

While it's redeploying:

1. **Click "Logs" tab** in Render dashboard
2. Look for errors like:
   ```
   TypeError: Cannot read property 'VENICE_API_KEY' of undefined
   ```
3. After adding env vars, you should see:
   ```
   🚀 AIPathway running
   📝 Received course generation request
   🤖 Calling Venice AI...
   ✅ Course generated successfully
   ```

---

## 🧪 Test After Redeployment

1. Wait for "Live" status in Render dashboard
2. Visit: `https://aipathway.onrender.com`
3. Click "🚀 Quick Start"
4. Select a persona
5. Wait 30-90 seconds
6. Course should generate! 🎉

---

## 🐛 If Still Not Working

### Check Logs:
```bash
Dashboard → Logs → Deploy Logs
```

Look for:
- ❌ `VENICE_API_KEY is undefined`
- ❌ `401 Unauthorized` (invalid API key)
- ❌ `404 Not Found` (wrong API URL)

### Verify Environment Variables:
```bash
Dashboard → Environment
```

Make sure all 3 are there:
- NODE_ENV
- VENICE_API_KEY  
- VENICE_API_URL

### Manual Redeploy:
```bash
Dashboard → Manual Deploy → Deploy Latest Commit
```

---

## 📊 Expected Behavior

**Before env vars:**
```
❌ 500 Internal Server Error
❌ VENICE_API_KEY is undefined
```

**After env vars:**
```
✅ 200 OK
✅ Course generated in 30-90 seconds
✅ Orange colors display correctly
✅ Buttons work
```

---

## 🎨 Color Check

After it's working, verify colors:
- ✅ Title: **Orange** (#F28C38)
- ✅ CTA Button: **Bright Orange** (#F15A24)
- ✅ Checkmarks: **Bright Orange** (#F15A24)
- ✅ Text: **Black** (#000000) and **Gray** (#666666)
- ✅ Background: **White** (#FFFFFF)

---

## ⚡ Quick Fix Summary

1. Add 3 environment variables in Render
2. Wait for auto-redeploy (2-3 min)
3. Test course generation
4. Done! ✅

---

**The API routes are already on Render with your Next.js app - they just need the environment variables to work!**

