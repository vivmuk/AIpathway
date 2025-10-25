# ✅ Render API Setup Checklist

## 📋 What You Need on Render

Your Render backend at **https://aipathway.onrender.com** needs:

### 1️⃣ API Route: `/api/generate-course`

**Required files on Render:**

```
your-render-repo/
├── server.js (or server.ts)
├── package.json
└── .env (on Render dashboard)
```

---

### 2️⃣ Server Code (Express.js Example)

**File: `server.js`**

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS - Allow Netlify domain
app.use(cors({
  origin: [
    'https://wlai.netlify.app',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'AIPathway API'
  });
});

// Main course generation endpoint
app.post('/api/generate-course', async (req, res) => {
  try {
    console.log('📝 Received course generation request');
    const { userProfile } = req.body;
    
    if (!userProfile) {
      return res.status(400).json({ error: 'User profile required' });
    }

    // Build prompt
    const prompt = buildCoursePrompt(userProfile);
    
    // Call Venice API
    const VENICE_API_KEY = process.env.VENICE_API_KEY;
    const VENICE_API_URL = process.env.VENICE_API_URL || 'https://api.venice.ai/api/v1';
    
    console.log('🤖 Calling Venice AI...');
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000); // 2 min
    
    const veniceResponse = await fetch(`${VENICE_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VENICE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'llama-3.3-70b',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI educator who creates personalized learning curricula. You MUST respond with ONLY valid JSON matching the exact schema provided.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 100000,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'course_curriculum',
            strict: true,
            schema: {
              // YOUR SCHEMA HERE (copy from your Next.js API route)
            }
          }
        }
      }),
    });
    
    clearTimeout(timeout);
    
    if (!veniceResponse.ok) {
      const error = await veniceResponse.text();
      console.error('❌ Venice API error:', error);
      return res.status(500).json({ error: 'AI service error' });
    }
    
    const data = await veniceResponse.json();
    const courseData = JSON.parse(data.choices[0].message.content);
    
    const course = {
      id: `course-${Date.now()}`,
      title: courseData.title,
      subtitle: courseData.subtitle,
      overallDescription: courseData.overallDescription,
      generatedAt: new Date().toISOString(),
      userProfile,
      chapters: courseData.chapters
    };
    
    console.log('✅ Course generated successfully');
    res.json({ course });
    
  } catch (error) {
    console.error('💥 Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate course',
      type: error.name 
    });
  }
});

// Helper function (copy from your Next.js route)
function buildCoursePrompt(profile) {
  // YOUR PROMPT BUILDING LOGIC HERE
  return prompt;
}

app.listen(PORT, () => {
  console.log(`🚀 AIPathway API running on port ${PORT}`);
});
```

---

### 3️⃣ package.json

```json
{
  "name": "aipathway-api",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

---

### 4️⃣ Render Environment Variables

Set these in **Render Dashboard** → **Environment**:

```
VENICE_API_KEY=ntmhtbP2fr_pOQsmuLPuN_nm6lm2INWKiNcvrdEfEC
VENICE_API_URL=https://api.venice.ai/api/v1
NODE_ENV=production
PORT=10000
```

---

### 5️⃣ Render Build Settings

**In Render Dashboard:**

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: Free (or paid for no cold starts)

---

## 🧪 Testing Your Render API

### Test 1: Health Check

```bash
curl https://aipathway.onrender.com/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-25T...",
  "service": "AIPathway API"
}
```

### Test 2: Course Generation

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

**Should return course JSON in ~30-90 seconds**

---

## 🔄 Copy Files from Next.js

**You need to copy:**

1. **Prompt building logic** from:
   `src/app/api/generate-course/route.ts` → Function `buildCoursePrompt()`

2. **JSON Schema** from:
   `src/app/api/generate-course/route.ts` → `response_format.json_schema`

3. **Types/interfaces** (optional, but helpful for TypeScript)

---

## 🚨 Common Issues

### Issue 1: CORS Error

**Symptom**: Frontend can't connect

**Fix**: Add CORS middleware:
```javascript
app.use(cors({
  origin: 'https://wlai.netlify.app'
}));
```

### Issue 2: Cold Start (Free Tier)

**Symptom**: First request takes 30+ seconds

**Solution**: 
- Use Render paid plan ($7/mo) for always-on
- Or accept 30s cold start on free tier

### Issue 3: Timeout Still Happening

**Symptom**: 504 after 2 minutes

**Check**:
- Render free tier has NO timeout limits
- Make sure you're calling Render, not Netlify
- Check browser console for API URL

---

## ✅ Final Checklist

- [ ] Render service is running
- [ ] Environment variables set on Render
- [ ] CORS allows `wlai.netlify.app`
- [ ] `/health` endpoint works
- [ ] `/api/generate-course` endpoint exists
- [ ] Netlify has `NEXT_PUBLIC_API_URL` env var
- [ ] Frontend code updated to call Render
- [ ] Test course generation end-to-end

---

## 💡 Quick Deploy

If you haven't deployed the backend yet:

```bash
# 1. Create a new folder for Render
mkdir aipathway-api
cd aipathway-api

# 2. Copy server.js and package.json (from above)

# 3. Initialize git
git init
git add .
git commit -m "Initial API server"

# 4. Push to GitHub (create new repo)
git remote add origin https://github.com/YOUR_USERNAME/aipathway-api.git
git push -u origin main

# 5. Connect to Render dashboard
# https://dashboard.render.com → New Web Service → Connect repo
```

---

Need help setting this up? Let me know! 🚀

