# 🔌 AIPathway API Documentation

## Overview

AIPathway uses Venice AI's API for LLM inference. This document covers the API endpoints used in the application.

---

## Venice API Configuration

### Base URL
```
https://api.venice.ai/api/v1
```

### Authentication
All requests require Bearer token authentication:
```
Authorization: Bearer YOUR_API_KEY
```

### Available Models

| Model ID | Name | Context | Best For |
|----------|------|---------|----------|
| `llama-3.3-70b` | Llama 3.3 70B | 65K | General purpose (default) |
| `llama-3.1-405b` | Llama 3.1 405B | 65K | Most intelligent |
| `qwen-2.5-qwq-32b` | Venice Reasoning | 32K | Reasoning tasks |
| `venice-uncensored` | Venice Uncensored | 32K | Uncensored responses |
| `qwen-2.5-coder-32b` | Qwen Coder | 32K | Code generation |

---

## Internal API Routes

### 1. Generate Course

**Endpoint:** `POST /api/generate-course`

Generates a personalized 10-chapter AI course based on user profile.

#### Request Body
```typescript
{
  userProfile: UserProfile
}
```

**UserProfile Interface:**
```typescript
interface UserProfile {
  aiScore: number                    // 0-100
  personaType: 'beginner' | 'applied' | 'technical' | 'leadership'
  learningFocus: string[]            // Array of learning goals
  learningStyle: 'visual' | 'text' | 'hands-on' | 'mixed'
  timeCommitment: string             // e.g., "3-5 hours per week"
  goals: string[]                    // User's learning goals
  codingExperience: string           // 'no-code' | 'basic' | 'intermediate' | 'proficient' | 'expert'
  aiToolsUsed: string[]              // Tools user has experience with
}
```

#### Response
```typescript
{
  course: Course
}
```

**Course Interface:**
```typescript
interface Course {
  id: string
  title: string
  subtitle: string
  overallDescription: string
  generatedAt: string               // ISO date
  userProfile: UserProfile
  chapters: Chapter[]               // Array of 10 chapters
}
```

**Chapter Interface:**
```typescript
interface Chapter {
  chapterNumber: number
  title: string
  learningObjective: string
  content: string                   // Markdown formatted
  keyTerms: {
    term: string
    definition: string
  }[]
  examples: string[]
  tryItYourself: string[]
  toolWalkthrough?: {
    toolName: string
    description: string
    steps: string[]
  }
  resources?: {
    type: 'github' | 'youtube' | 'documentation' | 'article'
    title: string
    url: string
  }[]
}
```

#### Example Request
```javascript
const response = await fetch('/api/generate-course', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userProfile: {
      aiScore: 50,
      personaType: 'technical',
      learningFocus: ['Build AI applications'],
      learningStyle: 'hands-on',
      timeCommitment: '3-5 hours per week',
      goals: ['Build AI applications', 'Learn LangChain'],
      codingExperience: 'proficient',
      aiToolsUsed: ['ChatGPT', 'GitHub Copilot']
    }
  }),
})

const data = await response.json()
console.log(data.course)
```

#### Response Example
```json
{
  "course": {
    "id": "course-1729876543210",
    "title": "Building AI Systems: A Technical Guide",
    "subtitle": "From fundamentals to production-ready applications",
    "overallDescription": "A hands-on course for developers...",
    "generatedAt": "2025-10-25T12:00:00.000Z",
    "userProfile": { ... },
    "chapters": [
      {
        "chapterNumber": 1,
        "title": "Understanding Large Language Models",
        "learningObjective": "Understand how LLMs work...",
        "content": "# Introduction to LLMs\n\n...",
        "keyTerms": [
          {
            "term": "Transformer",
            "definition": "A neural network architecture..."
          }
        ],
        "examples": [
          "GPT-4 uses 175B parameters..."
        ],
        "tryItYourself": [
          "Try prompting ChatGPT with different temperatures..."
        ],
        "toolWalkthrough": {
          "toolName": "OpenAI Playground",
          "description": "Interactive environment for testing...",
          "steps": [
            "Visit platform.openai.com/playground",
            "Select a model (e.g., GPT-4)",
            "Adjust temperature and top_p parameters"
          ]
        }
      }
      // ... 9 more chapters
    ]
  }
}
```

#### Error Responses
```json
{
  "error": "Failed to generate course"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad request (invalid user profile)
- `500` - Server error (Venice API error)

---

### 2. Simplify Chapter

**Endpoint:** `POST /api/simplify-chapter`

Regenerates chapter content at a different difficulty level.

#### Request Body
```typescript
{
  chapterContent: string,           // Original chapter content
  simplificationLevel: string       // e.g., "explained like I'm 12 years old"
}
```

#### Response
```typescript
{
  simplifiedContent: string         // Regenerated content in markdown
}
```

#### Example Request
```javascript
const response = await fetch('/api/simplify-chapter', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    chapterContent: originalContent,
    simplificationLevel: 'explained like I\'m 12 years old'
  }),
})

const data = await response.json()
console.log(data.simplifiedContent)
```

#### Common Simplification Levels
- `"explained like I'm 12 years old"` - Very simple, uses analogies
- `"more detailed and technical"` - Adds technical depth
- `"with more code examples"` - Focus on implementation
- `"more conceptual, less technical"` - High-level overview

---

## Venice API Usage

### Chat Completions

The main endpoint used for course generation:

```javascript
const response = await fetch('https://api.venice.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'llama-3.3-70b',
    messages: [
      {
        role: 'system',
        content: 'You are an expert AI educator...'
      },
      {
        role: 'user',
        content: 'Create a course...'
      }
    ],
    temperature: 0.7,
    max_tokens: 16000,
    response_format: {
      type: 'json_schema',
      json_schema: {
        // Schema definition
      }
    }
  }),
})
```

### Key Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `model` | string | Model ID to use | Required |
| `messages` | array | Conversation messages | Required |
| `temperature` | number | Randomness (0-2) | 0.7 |
| `max_tokens` | number | Max response length | - |
| `top_p` | number | Nucleus sampling | 0.9 |
| `frequency_penalty` | number | Penalize repetition | 0 |
| `response_format` | object | Force JSON output | - |

### Response Format

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "llama-3.3-70b",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 100,
    "completion_tokens": 200,
    "total_tokens": 300
  }
}
```

---

## Rate Limits & Costs

### Venice API Pricing (per 1M tokens)

| Model | Input | Output |
|-------|-------|--------|
| Llama 3.3 70B | $0.70 | $2.80 |
| Llama 3.1 405B | $1.50 | $6.00 |
| Venice Small | $0.15 | $0.60 |

### Estimated Costs per Course

- **Average course generation**: ~8,000-12,000 tokens
- **Cost per course**: ~$0.02-0.05
- **Chapter simplification**: ~2,000-4,000 tokens
- **Cost per simplification**: ~$0.005-0.015

### Rate Limits

Venice API typically allows:
- 100 requests per minute
- 1M tokens per day (depending on plan)

---

## Error Handling

### Common Errors

#### 1. Authentication Error
```json
{
  "error": {
    "message": "Invalid API key",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
```

#### 2. Rate Limit Error
```json
{
  "error": {
    "message": "Rate limit exceeded",
    "type": "rate_limit_error"
  }
}
```

#### 3. Token Limit Error
```json
{
  "error": {
    "message": "Maximum context length exceeded",
    "type": "invalid_request_error"
  }
}
```

### Error Handling Best Practices

```typescript
try {
  const response = await fetch('/api/generate-course', { ... })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to generate course')
  }
  
  const data = await response.json()
  return data.course
} catch (error) {
  console.error('Course generation error:', error)
  // Show user-friendly error message
  // Optionally retry with exponential backoff
}
```

---

## Best Practices

### 1. Optimize Token Usage
- Keep prompts concise but detailed
- Use structured outputs (JSON schema)
- Cache results when possible

### 2. Handle Timeouts
```javascript
const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), 60000) // 60s timeout

try {
  const response = await fetch('/api/generate-course', {
    signal: controller.signal,
    // ... other options
  })
} finally {
  clearTimeout(timeoutId)
}
```

### 3. Implement Retry Logic
```javascript
async function generateCourseWithRetry(userProfile, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await generateCourse(userProfile)
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)))
    }
  }
}
```

### 4. Monitor API Usage
- Log token usage
- Track generation times
- Monitor error rates
- Set up alerts for anomalies

---

## Testing

### Test API Connectivity
```bash
curl --request GET \
  --url https://api.venice.ai/api/v1/models \
  --header 'Authorization: Bearer YOUR_API_KEY'
```

### Test Course Generation (Local)
```bash
curl --request POST \
  --url http://localhost:3000/api/generate-course \
  --header 'Content-Type: application/json' \
  --data '{
    "userProfile": {
      "aiScore": 50,
      "personaType": "technical",
      "learningFocus": ["Build AI applications"],
      "learningStyle": "hands-on",
      "timeCommitment": "3-5 hours per week",
      "goals": ["Build AI applications"],
      "codingExperience": "proficient",
      "aiToolsUsed": ["ChatGPT"]
    }
  }'
```

---

## Support

For Venice API issues:
- Documentation: https://docs.venice.ai
- Support: support@venice.ai

For AIPathway issues:
- GitHub Issues
- See CONTRIBUTING.md

---

**Last Updated:** October 2025

