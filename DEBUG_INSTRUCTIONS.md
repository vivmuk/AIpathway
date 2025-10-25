# 🔧 Debug Instructions - Finding the Venice API Issue

## 🎯 Quick Debug Steps

### Step 1: Open Debug Page
Go to: **http://localhost:3000/debug**

This page has a simple test button that will:
- ✅ Test Venice API connection
- ✅ Show you the exact error
- ✅ Display response data

### Step 2: Click "Run Test"
- If it works: You'll see ✅ and "Hello, Venice API is working!"
- If it fails: You'll see ❌ and the error message

### Step 3: Check the Logs

**Browser Console (F12):**
Look for emoji indicators:
- 🧪 = Testing starting
- ✅ = Success
- ❌ = Error
- 📡 = API response details

**Server Terminal:**
Look for the same emoji indicators showing what's happening server-side

---

## 🔍 What to Look For

### If You See This Error:
```
❌ Venice API error response: {"error": "invalid_api_key"}
```
**Solution:** API key is wrong (but it shouldn't be - it's hard-coded)

### If You See This Error:
```
❌ Venice API error response: {"error": "rate_limit_exceeded"}
```
**Solution:** You've hit rate limits. Wait a few minutes and try again.

### If You See This Error:
```
❌ Failed to parse course data
```
**Solution:** The API returned text instead of JSON. The model doesn't support response_format.

### If You See This Error:
```
TypeError: fetch failed
```
**Solution:** Network issue. Check internet connection.

---

## 🧪 Test API Endpoints

### Test Endpoint (Simple)
```
GET http://localhost:3000/api/test-venice
```
Tests basic connectivity with a simple "Hello World" request.

### Course Generation Endpoint (Full)
```
POST http://localhost:3000/api/generate-course
Body: { userProfile: {...} }
```
Full course generation with JSON schema.

---

## 📊 Expected vs Actual

### ✅ Expected Successful Flow:
```
1. 🧪 Testing Venice API...
2. 📡 Venice API response status: 200
3. ✅ Venice API response received successfully
4. 📄 Response structure: ["id", "object", "created", "model", "choices", "usage"]
5. ✅ Successfully parsed course data
```

### ❌ Current Flow (If Failing):
```
1. 🧪 Testing Venice API...
2. 📡 Venice API response status: 500 (or 401, 429, etc.)
3. ❌ Venice API error response: {...}
```

---

## 🛠️ Debugging Checklist

### Server-Side Logs (Terminal)
- [ ] See "Received user profile"
- [ ] See "Calling Venice API with llama-3.3-70b model..."
- [ ] See response status code
- [ ] See any error messages

### Client-Side Logs (Browser Console)
- [ ] No CORS errors
- [ ] See API call in Network tab
- [ ] See response body
- [ ] Check status code (should be 200, not 500)

### API Configuration
- [ ] API key is correct (hard-coded in route.ts)
- [ ] API URL is correct (https://api.venice.ai/api/v1)
- [ ] Model name is correct (llama-3.3-70b)
- [ ] Request format matches Swagger specs

---

## 🔎 Advanced Debugging

### Check Actual Request Being Sent
Add this in generate-course/route.ts:
```typescript
console.log('📤 Request body:', JSON.stringify({
  model,
  messages,
  temperature,
  max_tokens
}, null, 2))
```

### Test with cURL
```bash
curl -X POST https://api.venice.ai/api/v1/chat/completions \
  -H "Authorization: Bearer ntmhtbP2fr_pOQsmuLPuN_nm6lm2INWKiNcvrdEfEC" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.3-70b",
    "messages": [{"role": "user", "content": "Hello"}],
    "temperature": 0.7,
    "max_tokens": 100
  }'
```

---

## 📋 Common Fixes

### Fix 1: Simplify the Request
Remove `response_format` temporarily:
```typescript
// Comment out response_format
// response_format: { ... }
```

### Fix 2: Try Different Model
```typescript
model: 'llama-3.2-3b'  // Fastest model
```

### Fix 3: Reduce max_tokens
```typescript
max_tokens: 4000  // Instead of 16000
```

### Fix 4: Test Without JSON Schema
Just get plain text first, then add JSON schema back.

---

## 🎯 Next Steps

1. **Go to:** http://localhost:3000/debug
2. **Click:** "Run Test"
3. **Look at:** Both browser console AND server terminal
4. **Find:** The actual error message with emojis (❌ or 🚨)
5. **Report back:** Tell me what error you see!

---

## 📞 What to Report

When you see an error, tell me:

1. **Status Code:** (e.g., 500, 401, 429)
2. **Error Message:** (the text after ❌)
3. **Server Logs:** (copy from terminal)
4. **Browser Console:** (copy the error)

---

## ✅ Success Looks Like This

**Browser:**
```json
{
  "success": true,
  "message": "Hello, Venice API is working!",
  "fullResponse": { ... }
}
```

**Server Terminal:**
```
🧪 Testing Venice API connection...
📡 Venice API response status: 200
✅ Venice API success! Response: {...}
```

---

**Go test it now:** http://localhost:3000/debug 🚀

