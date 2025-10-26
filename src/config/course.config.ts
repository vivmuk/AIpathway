/**
 * Course Configuration
 * 
 * DEVELOPMENT: Set CHAPTER_COUNT to 3 for faster testing
 * PRODUCTION: Set CHAPTER_COUNT to 10 for full course generation
 */

// Toggle this between 3 (dev) and 10 (production)
export const CHAPTER_COUNT = process.env.NODE_ENV === 'production' ? 10 : 3

// API Timeouts
// Note: Render free tier has a 30-second HTTP timeout
// Set slightly lower so the API can respond before Render kills the connection
export const OUTLINE_TIMEOUT = 25000 // 25 seconds (allows 5s buffer for Render's 30s limit)
export const CHAPTER_TIMEOUT = 25000 // 25 seconds for Render free tier compatibility

// Model Configuration
// Using faster models to avoid Render's 30-second timeout on free tier
export const OUTLINE_MODEL = 'llama-3.3-70b' // Faster than qwen3-235b
export const CHAPTER_MODEL = 'mistral-31-24b'

