# 🚀 Render.com Setup Guide for Long-Running API Calls

## Why Render.com?

**Netlify Limitation**: Free tier has 10-second timeout for serverless functions. Even Pro tier only has 26 seconds.

**Your Requirement**: 2-minute timeout for high-quality AI course generation with llama-3.3-70b.

**Solution**: Deploy API backend to Render.com (free tier has **no timeout limits**!) while keeping frontend on Netlify.

---

## 🏗️ Architecture

```
Frontend (Netlify)
    ↓
    Calls API at render-app-url.onrender.com
    ↓
Backend API (Render.com)
    ↓
    Calls Venice AI (with 2-min timeout)
```

---

## 📋 Step-by-Step Setup

### 1️⃣ Create Render Account

1. Go to: https://render.com/
2. Sign up (free tier includes 750 hours/month)
3. Connect your GitHub account

### 2️⃣ Prepare Your Code

Create a separate API directory structure:

```bash
# In your project root
mkdir api-server
cd api-server
npm init -y
```

**Install dependencies**:
```bash
npm install express cors dotenv
npm install --save-dev @types/express @types/cors typescript tsx
```

### 3️⃣ Create Express Server

**File: `api-server/server.ts`**

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your Netlify domain
app.use(cors({
  origin: [
    'https://wlai.netlify.app',
    'http://localhost:3000' // For local development
  ]
}));

app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Import your course generation logic
app.post('/api/generate-course', async (req, res) => {
  try {
    const { userProfile } = req.body;
    
    // Your existing course generation code
    // (copy from src/app/api/generate-course/route.ts)
    
    res.json({ course: generatedCourse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### 4️⃣ Update package.json

**File: `api-server/package.json`**

```json
{
  "name": "aipathway-api",
  "version": "1.0.0",
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc",
    "dev": "tsx watch server.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "typescript": "^5.3.3",
    "tsx": "^4.7.0"
  }
}
```

### 5️⃣ Create tsconfig.json

**File: `api-server/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 6️⃣ Deploy to Render

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Click "New +"** → "Web Service"
3. **Connect Repository**: Select your GitHub repo
4. **Configure**:
   - **Name**: `aipathway-api`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `api-server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (750 hours/month)

5. **Environment Variables**:
   ```
   VENICE_API_KEY=ntmhtbP2fr_pOQsmuLPuN_nm6lm2INWKiNcvrdEfEC
   VENICE_API_URL=https://api.venice.ai/api/v1
   NODE_ENV=production
   ```

6. **Click "Create Web Service"**

### 7️⃣ Update Frontend to Use Render API

**File: `src/components/CourseView.tsx`**

Change API endpoint:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-app.onrender.com';

const response = await fetch(`${API_URL}/api/generate-course`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userProfile })
});
```

**Add to `.env.local`**:
```
NEXT_PUBLIC_API_URL=https://aipathway-api.onrender.com
```

**Add to Netlify Environment Variables**:
```
NEXT_PUBLIC_API_URL=https://aipathway-api.onrender.com
```

---

## 🎯 Benefits of Render.com

✅ **No timeout limits** (vs 10s on Netlify free)  
✅ **Free tier**: 750 hours/month  
✅ **Auto-deploy** from GitHub  
✅ **Free SSL** certificates  
✅ **Better for CPU-intensive** tasks  
✅ **Persistent connections** to databases  

## ⚠️ Limitations

❌ **Cold starts**: ~30 seconds on free tier (spins down after 15 mins inactivity)  
❌ **Slower than Netlify** for simple requests  
❌ **Limited to 512MB RAM** on free tier  

---

## 🔄 Hybrid Architecture (Recommended)

**Keep on Netlify**:
- Frontend (Next.js static pages)
- Fast API routes (< 10 seconds)
- CDN delivery

**Move to Render**:
- `/api/generate-course` (long-running, 2-min timeout)
- `/api/simplify-chapter` (if slow)

**Result**: Best of both worlds! Fast page loads + no timeouts for AI generation.

---

## 🧪 Testing

```bash
# Health check
curl https://your-app.onrender.com/health

# Test course generation
curl -X POST https://your-app.onrender.com/api/generate-course \
  -H "Content-Type: application/json" \
  -d '{"userProfile": {...}}'
```

---

## 💰 Cost Comparison

| Service | Free Tier | Timeout | Best For |
|---------|-----------|---------|----------|
| **Netlify** | Unlimited | 10s (26s Pro) | Frontend, fast APIs |
| **Render** | 750 hrs/mo | No limit | Long-running APIs |
| **Vercel** | Unlimited | 10s (5min Pro) | Frontend, serverless |
| **Railway** | $5 credit | No limit | Full backend |

---

## 🚀 Quick Start Commands

```bash
# 1. Create API directory
mkdir api-server && cd api-server

# 2. Initialize
npm init -y
npm install express cors dotenv
npm install -D typescript @types/express @types/cors tsx

# 3. Create files (see above)

# 4. Test locally
npm run dev

# 5. Push to GitHub
git add . && git commit -m "Add Render API server" && git push

# 6. Deploy on Render dashboard
```

---

## 📚 Resources

- Render Docs: https://render.com/docs
- Render Free Tier: https://render.com/docs/free
- Example Apps: https://github.com/render-examples

---

## ✅ Action Items

1. [ ] Create `api-server` directory
2. [ ] Copy course generation logic from Next.js API routes
3. [ ] Set up Express server
4. [ ] Test locally
5. [ ] Push to GitHub
6. [ ] Deploy to Render
7. [ ] Update frontend to use Render URL
8. [ ] Test end-to-end
9. [ ] Monitor cold start times

---

**Need help?** Let me know and I can set this up for you! 🚀

