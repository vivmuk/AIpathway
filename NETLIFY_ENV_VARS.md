# Netlify Environment Variables Setup

## 🔧 Add this to Netlify Dashboard

Go to: **Site settings** → **Environment variables** → **Add a variable**

```
NEXT_PUBLIC_API_URL=https://aipathway.onrender.com
```

This tells the frontend (deployed on Netlify) to call your Render backend for course generation.

## 📝 Steps:

1. Go to https://app.netlify.com/sites/wlai/settings/deploys#environment
2. Click "Add a variable"
3. Key: `NEXT_PUBLIC_API_URL`
4. Value: `https://aipathway.onrender.com`
5. Click "Save"
6. Trigger redeploy: **Deploys** → **Trigger deploy** → **Deploy site**

## ✅ Result:

- Frontend (Netlify): Fast CDN delivery
- API calls (Render): No timeout limits, 2-minute generation works!

---

## 🧪 Testing:

After deploying:

1. Visit: https://wlai.netlify.app
2. Take quiz or select persona
3. Watch browser console - should see: `🚀 Calling API: https://aipathway.onrender.com`
4. Course generation should complete without 504 errors!

---

## 🐛 Troubleshooting:

**If you see errors:**

1. Check Render logs: https://dashboard.render.com/
2. Verify Render service is running
3. Test Render directly:
   ```bash
   curl https://aipathway.onrender.com/health
   ```
4. Check CORS settings on Render (should allow wlai.netlify.app)

