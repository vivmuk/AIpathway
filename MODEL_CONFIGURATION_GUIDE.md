# 🔧 Model Configuration Guide

## 🚨 Current Issue: GLM 4.6 Failing on Production

### Problem
Your deployed app (aipathway.onrender.com) is showing:
- ✅ Outline generation works
- ❌ **ALL chapter generations failing with 500 errors**
- ❌ Key Terms showing (0)
- ❌ Real-World Examples showing (0)
- ❌ Try It Yourself showing (0)

### Root Cause
**GLM 4.6 (zai-org-glm-4.6) is marked as BETA** and appears to be unstable for chapter generation.

From Venice AI API:
```json
{
  "id": "zai-org-glm-4.6",
  "beta": true,  // ⚠️ BETA STATUS
  "supportsResponseSchema": true,
  "supportsWebSearch": true
}
```

---

## ✅ Recommended Solution: Use Proven Stable Models

### Option 1: Use Qwen3-235b for Everything (RECOMMENDED)
**Best for consistency and reliability**

```typescript
// src/config/course.config.ts
export const OUTLINE_MODEL = 'qwen3-235b'
export const CHAPTER_MODEL = 'qwen3-235b'  // Change this!
export const LESSON_MODEL = 'qwen3-235b'   // Change this!
```

**Why Qwen3-235b?**
- ✅ Already working perfectly for outline generation
- ✅ NOT beta (stable)
- ✅ Supports JSON schema
- ✅ Supports reasoning
- ✅ 131K context window
- ✅ Venice Large 1.1 - High quality
- 💰 $0.9 input / $4.5 output per 1M tokens

---

### Option 2: Revert to Mistral (ORIGINAL WORKING CONFIG)
**Fastest and most proven**

```typescript
// src/config/course.config.ts
export const OUTLINE_MODEL = 'qwen3-235b'
export const CHAPTER_MODEL = 'mistral-31-24b'  // Original working model
export const LESSON_MODEL = 'mistral-31-24b'
```

**Why Mistral-31-24b?**
- ✅ This was your original configuration that worked
- ✅ NOT beta (stable)
- ✅ Supports JSON schema
- ✅ Supports vision
- ✅ 131K context window
- ✅ Venice Medium
- 💰 $0.5 input / $2 output per 1M tokens (cheaper!)

---

### Option 3: Use Qwen3-Next-80b (LARGEST CONTEXT)
**Best if you need more context**

```typescript
// src/config/course.config.ts
export const OUTLINE_MODEL = 'qwen3-235b'
export const CHAPTER_MODEL = 'qwen3-next-80b'
export const LESSON_MODEL = 'qwen3-next-80b'
```

**Why Qwen3-Next-80b?**
- ✅ NOT beta (stable)
- ✅ Supports JSON schema
- ✅ **262K context window** (2x larger!)
- ✅ Good balance of quality and cost
- 💰 $0.35 input / $1.9 output per 1M tokens (cheapest!)

---

## 📊 Model Comparison

| Model | Status | JSON Schema | Context | Pricing (per 1M) | Recommendation |
|-------|--------|-------------|---------|------------------|----------------|
| **qwen3-235b** | ✅ Stable | ✅ Yes | 131K | $0.9 / $4.5 | ⭐ Best quality |
| **mistral-31-24b** | ✅ Stable | ✅ Yes | 131K | $0.5 / $2 | ⭐ Best proven |
| **qwen3-next-80b** | ✅ Stable | ✅ Yes | 262K | $0.35 / $1.9 | ⭐ Best value |
| **zai-org-glm-4.6** | ⚠️ BETA | ✅ Yes | 202K | $0.85 / $2.75 | ❌ Unstable |

---

## 🔥 Immediate Action Required

### Step 1: Update Model Configuration

Choose one of the options above and update `src/config/course.config.ts`:

**Recommended (Option 1):**
```typescript
export const OUTLINE_MODEL = 'qwen3-235b'
export const CHAPTER_MODEL = 'qwen3-235b'
export const LESSON_MODEL = 'qwen3-235b'
```

**Or (Option 2 - Original Working):**
```typescript
export const OUTLINE_MODEL = 'qwen3-235b'
export const CHAPTER_MODEL = 'mistral-31-24b'
export const LESSON_MODEL = 'mistral-31-24b'
```

### Step 2: Commit and Push
```bash
git add src/config/course.config.ts
git commit -m "Switch to stable model configuration"
git push
```

### Step 3: Deploy to Render
Render should automatically detect the push and redeploy. If not, manually trigger a redeploy in your Render dashboard.

### Step 4: Test Locally First
```bash
npm run dev
```

Then:
1. Go to http://localhost:3000
2. Click "🚀 Quick Start"
3. Select any persona
4. Watch the console - you should see chapters generating successfully
5. Verify Key Terms, Examples, and Try It Yourself sections are populated

---

## 🆕 What's New in This Update

### 1. Web Search Integration
Every chapter now includes:
- **Latest Updates** section with real-time web search results
- Current news and developments related to the chapter topic
- Powered by `llama-3.2-3b:enable_web_search=on`

### 2. All Routes Use Config
- ✅ `generate-outline` → Uses `OUTLINE_MODEL`
- ✅ `generate-chapter` → Uses `CHAPTER_MODEL`
- ✅ `generate-lesson` → Uses `LESSON_MODEL`

### 3. Console Logging Fixed
- Changed from "Generating chapters with Mistral" to "Generating chapters with GLM 4.6"
- This will update automatically based on your config

---

## 🧪 Testing After Changes

### Test 1: Local Development
```bash
npm run dev
# Visit http://localhost:3000
# Generate a course
# Verify all sections populate
```

### Test 2: API Endpoint Testing
```bash
# Test outline generation
curl -X POST http://localhost:3000/api/generate-outline \
  -H "Content-Type: application/json" \
  -d '{"userProfile": {...}}'

# Test chapter generation
curl -X POST http://localhost:3000/api/generate-chapter \
  -H "Content-Type: application/json" \
  -d '{"chapterOutline": {...}, "userProfile": {...}, "courseTitle": "..."}'
```

### Test 3: Production Deployment
1. After Render redeploys, visit https://aipathway.onrender.com
2. Generate a new course
3. Check browser console for errors
4. Verify all chapter sections populate

---

## 🐛 Why Sections Show (0)

The empty sections (Key Terms (0), Examples (0), Try It Yourself (0)) occur when:

1. **Chapter generation fails** → Returns empty arrays for all fields
2. **JSON parsing fails** → Falls back to empty chapter structure
3. **Model doesn't support JSON schema** → Returns unstructured text
4. **Model is unstable (beta)** → Random failures

### The Fix
Using a stable, proven model ensures:
- ✅ Reliable JSON schema compliance
- ✅ All required fields populated
- ✅ Consistent chapter structure
- ✅ No random 500 errors

---

## 📝 Configuration File Reference

**Current location:** `src/config/course.config.ts`

```typescript
/**
 * Course Configuration
 * 
 * DEVELOPMENT: Set CHAPTER_COUNT to 3 for faster testing
 * PRODUCTION: Set CHAPTER_COUNT to 10 for full course generation
 */

// Toggle this between 3 (dev) and 10 (production)
export const CHAPTER_COUNT = process.env.NODE_ENV === 'production' ? 10 : 3

// API Timeouts
export const OUTLINE_TIMEOUT = 60000 // 1 minute
export const CHAPTER_TIMEOUT = 300000 // 5 minutes

// Model Configuration
export const OUTLINE_MODEL = 'qwen3-235b'
export const CHAPTER_MODEL = 'qwen3-235b'  // ⬅️ CHANGE THIS
export const LESSON_MODEL = 'qwen3-235b'   // ⬅️ CHANGE THIS
```

---

## 🎯 My Recommendation

**Use Option 1: Qwen3-235b for everything**

### Reasons:
1. **Already working** - Your outline generation uses this and works perfectly
2. **High quality** - Venice Large 1.1 model
3. **Reasoning support** - Better for complex educational content
4. **Consistent** - Same model = predictable results
5. **Stable** - Not beta, proven reliability

### Cost Comparison (for 10-chapter course):
- **Qwen3-235b**: ~$0.10-0.20 per course (high quality)
- **Mistral-31-24b**: ~$0.05-0.10 per course (proven)
- **Qwen3-next-80b**: ~$0.04-0.08 per course (best value)
- **GLM 4.6**: Currently failing ❌

---

## 🚀 Next Steps

1. **Update config** with stable model (see options above)
2. **Commit & push** changes to GitHub
3. **Wait for Render** to auto-deploy (or trigger manually)
4. **Test production** at https://aipathway.onrender.com
5. **Verify chapters** generate with all sections populated

---

## 💡 Future Considerations

### Keep GLM 4.6 for Testing
Once GLM 4.6 exits beta, it might be worth trying again:
- 202K context (larger than mistral)
- Good pricing ($0.85 / $2.75)
- Function calling support

### Monitor Venice AI Updates
Check https://api.venice.ai/api/v1/models regularly for:
- New stable models
- Beta models graduating to stable
- Pricing changes
- Feature updates

---

## 📞 Support

If issues persist after changing to a stable model:
1. Check Render logs for specific errors
2. Test locally to isolate the issue
3. Verify Venice API key is valid
4. Check API rate limits

**Remember:** The deployed app needs to be updated via GitHub push → Render deployment for changes to take effect!

