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
export const CHAPTER_MODEL = 'zai-org-glm-4.6'

