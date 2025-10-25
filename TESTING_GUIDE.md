# 🧪 AIPathway Testing Guide

## ✅ Quick Test Checklist

### 1. Welcome Page Test
- [ ] Page loads without errors
- [ ] All three feature cards display correctly
- [ ] "Start Your Assessment" button works
- [ ] Footer displays correctly

### 2. Quiz Flow Test
- [ ] First question displays correctly
- [ ] Progress bar updates (1/8, 2/8, etc.)
- [ ] Can select answers for all question types:
  - [ ] Single choice (radio buttons)
  - [ ] Multiple choice (checkboxes)
  - [ ] Scale (1-5 rating)
- [ ] Can navigate backward with "Back" button
- [ ] Final question shows "Generate Course" button
- [ ] Quiz submits successfully

### 3. Course Generation Test
- [ ] Loading animation displays
- [ ] Loading message shows progress
- [ ] Generation completes within 45 seconds
- [ ] Course displays with title and subtitle
- [ ] 10 chapters are visible as cards

### 4. Course Overview Test
- [ ] Progress dashboard shows correct stats
- [ ] All 10 chapter cards display
- [ ] Chapter cards show correct information
- [ ] Can click on any chapter to open it
- [ ] Export HTML button works (downloads file)

### 5. Chapter Learning Test
- [ ] Chapter content displays correctly
- [ ] Key Terms section is collapsible
- [ ] Examples section is collapsible
- [ ] Try It Yourself section is collapsible
- [ ] Tool Walkthrough section displays (if present)
- [ ] "Simpler" button regenerates content
- [ ] "More Technical" button regenerates content
- [ ] "Original" button restores original content
- [ ] "Mark as Complete" button works
- [ ] Completion checkmark appears
- [ ] "Back to Course" button returns to overview

### 6. Progress Tracking Test
- [ ] Dashboard updates when chapter completed
- [ ] Completion percentage increases
- [ ] Current chapter updates
- [ ] Progress persists on page refresh
- [ ] All chapters can be marked complete

### 7. Error Handling Test
- [ ] If API fails, error message displays
- [ ] "Try Again" button works
- [ ] Network errors handled gracefully

### 8. Responsive Design Test
- [ ] Mobile view (< 768px) works correctly
- [ ] Tablet view (768px - 1024px) works correctly
- [ ] Desktop view (> 1024px) works correctly
- [ ] Touch interactions work on mobile

## 🐛 Common Issues & Solutions

### Issue: "Failed to generate course"
**Solution:** 
- Check internet connection
- Verify `.env.local` exists with Venice API key
- Check browser console for errors
- Try clicking "Try Again"

### Issue: Generation takes too long (> 60 seconds)
**Solution:**
- Check network speed
- Venice API may be slow
- Refresh and try again

### Issue: Port 3000 already in use
**Solution:**
```bash
# Kill the process
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Issue: Page not loading
**Solution:**
- Check if server is running (`npm run dev`)
- Verify no syntax errors in browser console
- Clear browser cache
- Try incognito mode

## 📊 Test Scenarios

### Scenario 1: Complete Beginner
**User Profile:**
- Knowledge: Complete beginner
- Coding: No experience
- Tools: None
- Goal: Understand AI concepts
- Style: Visual learner

**Expected Result:**
- Course focuses on concepts, not code
- Lots of analogies and visual descriptions
- Beginner-friendly language
- No advanced technical terms

### Scenario 2: Technical Developer
**User Profile:**
- Knowledge: Advanced
- Coding: Expert
- Tools: ChatGPT, GitHub Copilot
- Goal: Build AI applications
- Style: Hands-on

**Expected Result:**
- Course includes code examples
- Technical depth appropriate
- Tool walkthroughs with implementation
- Advanced concepts covered

### Scenario 3: Business Professional
**User Profile:**
- Knowledge: Basic awareness
- Coding: Basic scripting
- Tools: ChatGPT, Midjourney
- Goal: Use AI for productivity
- Style: Mixed approach

**Expected Result:**
- Focus on practical applications
- Business use cases
- Tool demonstrations
- Strategic understanding

## 🔍 Debugging Tips

### Check Browser Console
1. Press F12 to open DevTools
2. Go to Console tab
3. Look for red error messages
4. Check Network tab for failed API calls

### Check Server Logs
The terminal running `npm run dev` shows:
- API route calls
- Error messages
- Server status

### Test API Directly
```bash
# Test course generation
curl -X POST http://localhost:3000/api/generate-course \
  -H "Content-Type: application/json" \
  -d '{"userProfile":{"aiScore":50,"personaType":"technical","learningFocus":["Build apps"],"learningStyle":"hands-on","timeCommitment":"3-5 hours","goals":["Build apps"],"codingExperience":"proficient","aiToolsUsed":["ChatGPT"]}}'
```

## ✅ Expected Performance

| Action | Expected Time |
|--------|---------------|
| Page load | < 1 second |
| Quiz navigation | Instant |
| Course generation | 30-45 seconds |
| Chapter load | < 100ms |
| Content simplification | 5-10 seconds |
| HTML export | < 1 second |

## 🎯 Success Criteria

Your app is working correctly if:
- ✅ All 8 quiz questions can be answered
- ✅ Course generates successfully
- ✅ All 10 chapters display
- ✅ At least 3 chapters can be opened
- ✅ Content simplification works
- ✅ Progress tracking works
- ✅ HTML export works
- ✅ No console errors

## 📞 Need Help?

If you encounter issues:
1. Check console for errors
2. Review this testing guide
3. Check README.md for setup info
4. Review API_DOCUMENTATION.md for API details

---

**Happy Testing! 🚀**

