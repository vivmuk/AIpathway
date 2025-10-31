import { NextRequest, NextResponse } from 'next/server'
import { UserProfile } from '@/types'
import { CHAPTER_TIMEOUT, CHAPTER_MODEL } from '@/config/course.config'

interface ChapterOutline {
  chapterNumber: number
  title: string
  learningObjective: string
}

export async function POST(request: NextRequest) {
  try {
    const { chapterOutline, userProfile, courseTitle } = await request.json() as {
      chapterOutline: ChapterOutline
      userProfile: UserProfile
      courseTitle: string
    }

    const VENICE_API_KEY = 'ntmhtbP2fr_pOQsmuLPuN_nm6lm2INWKiNcvrdEfEC'
    const VENICE_API_URL = 'https://api.venice.ai/api/v1'
    
    const prompt = buildChapterPrompt(chapterOutline, userProfile, courseTitle)
    
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), CHAPTER_TIMEOUT)
    
    try {
      const veniceResponse = await fetch(`${VENICE_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VENICE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: CHAPTER_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are an expert Artificial Intelligence and Generative AI educator. Create detailed, engaging chapter content about AI/GenAI topics with AI-specific examples and hands-on AI exercises. All content must be about AI technology (LLMs, AI tools, AI concepts, AI applications). Respond with ONLY valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 8000, // ~1000-1500 words of content per chapter
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'chapter_content',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  chapterNumber: { type: 'number' },
                  title: { type: 'string' },
                  learningObjective: { type: 'string' },
                  content: { type: 'string' },
                  keyTerms: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        term: { type: 'string' },
                        definition: { type: 'string' }
                      },
                      required: ['term', 'definition'],
                      additionalProperties: false
                    }
                  },
                  examples: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  tryItYourself: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  toolWalkthrough: {
                    type: ['object', 'null'],
                    properties: {
                      toolName: { type: 'string' },
                      description: { type: 'string' },
                      steps: {
                        type: 'array',
                        items: { type: 'string' }
                      }
                    },
                    required: ['toolName', 'description', 'steps'],
                    additionalProperties: false
                  }
                },
                required: ['chapterNumber', 'title', 'learningObjective', 'content', 'keyTerms', 'examples', 'tryItYourself'],
                additionalProperties: false
              }
            }
          }
        }),
      })
      
      clearTimeout(timeout)

      if (!veniceResponse.ok) {
        const errorText = await veniceResponse.text()
        return NextResponse.json(
          { error: `Chapter generation failed: ${veniceResponse.statusText}`, details: errorText },
          { status: 500 }
        )
      }

      const data = await veniceResponse.json()
      let rawContent = data.choices[0].message.content
      
      // Try to fix common JSON issues
      try {
        // Remove any markdown code blocks if present
        rawContent = rawContent.replace(/```json\n?/g, '').replace(/```\n?$/g, '').trim()
        
        const chapter = JSON.parse(rawContent)
        
        // Add web search for latest information about the chapter topic
        try {
          const newsController = new AbortController()
          const newsTimeout = setTimeout(() => newsController.abort(), 30000) // 30 seconds
          
          const newsPrompt = `Search the web for the latest developments, news, and updates about "${chapterOutline.title}" in the context of Artificial Intelligence and Generative AI. Find 2-3 recent relevant articles or updates.

Return ONLY valid JSON:
{
  "latestUpdates": [
    {
      "headline": "Article or update title",
      "summary": "Brief 1-2 sentence summary",
      "source": "Source name",
      "relevance": "How this relates to ${chapterOutline.title}"
    }
  ]
}`
          
          const newsResponse = await fetch(`${VENICE_API_URL}/chat/completions`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${VENICE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            signal: newsController.signal,
            body: JSON.stringify({
              model: 'llama-3.2-3b:enable_web_search=on',
              messages: [
                {
                  role: 'system',
                  content: 'You are a helpful AI news aggregator. Search the web for latest AI/GenAI developments and return results in JSON format.'
                },
                {
                  role: 'user',
                  content: newsPrompt
                }
              ],
              temperature: 0.3,
              max_tokens: 1500,
            }),
          })
          
          clearTimeout(newsTimeout)
          
          if (newsResponse.ok) {
            try {
              const newsData = await newsResponse.json()
              let newsContent = newsData.choices[0].message.content
              newsContent = newsContent.replace(/```json\n?/g, '').replace(/```\n?$/g, '').trim()
              const newsParsed = JSON.parse(newsContent)
              
              // Add latest updates to chapter
              chapter.latestUpdates = newsParsed.latestUpdates || []
            } catch (newsParseError) {
              // Continue without news if parsing fails
              chapter.latestUpdates = []
            }
          } else {
            chapter.latestUpdates = []
          }
        } catch (newsError) {
          // Continue without news if fetch fails
          chapter.latestUpdates = []
        }
        
        return NextResponse.json({ chapter })
      } catch (parseError: any) {
        // JSON parsing failed - try to salvage what we can
        return NextResponse.json(
          { 
            error: 'Malformed JSON from AI', 
            details: parseError.message,
            partialContent: rawContent.substring(0, 500)
          },
          { status: 500 }
        )
      }
      
    } catch (fetchError: any) {
      clearTimeout(timeout)
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: `Chapter ${chapterOutline.chapterNumber} timeout` },
          { status: 504 }
        )
      }
      throw fetchError
    }
  } catch (error: any) {
    console.error('💥 Chapter generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate chapter' },
      { status: 500 }
    )
  }
}

function buildChapterPrompt(outline: ChapterOutline, profile: UserProfile, courseTitle: string): string {
  const techLevel = profile.aiScore < 30 ? 'very beginner-friendly, avoiding jargon' :
                    profile.aiScore < 50 ? 'introductory to intermediate' :
                    profile.aiScore < 75 ? 'intermediate to advanced' :
                    'advanced and technical'

  return `You are creating Chapter ${outline.chapterNumber} for the ARTIFICIAL INTELLIGENCE course "${courseTitle}".

**CRITICAL: This chapter MUST be about Artificial Intelligence / Generative AI technology.**
- ALL content must relate to AI/GenAI (Large Language Models, AI tools, AI applications, AI concepts)
- If the chapter mentions terms like "RAG" - it means Retrieval-Augmented Generation (AI concept), NOT Red-Amber-Green project management
- Focus on AI-specific concepts: LLMs, prompt engineering, AI agents, vector databases, embeddings, fine-tuning, AI ethics, AI implementation, etc.
- Examples should demonstrate AI tools and AI applications (ChatGPT, Claude, Gemini, Midjourney, AI APIs, etc.)

**Chapter Details:**
- Chapter Number: ${outline.chapterNumber}
- Title: ${outline.title}
- Learning Objective: ${outline.learningObjective}

**Learner Context:**
- Technical Level: ${techLevel}
- Industry: ${profile.industry || 'General'}
- Goals: ${profile.goals.join(', ')}
- Learning Style: ${profile.learningStyle}

**Content Requirements:**
1. **Content**: Write 600-800 words of detailed, engaging content in markdown format ABOUT AI/GENAI
   - Use headers (##), lists, **bold**, *italic*, code blocks where appropriate
   - Make it practical and immediately useful for working with AI
   - Focus exclusively on Generative AI tools, AI concepts, and AI applications
   - Include real-world AI use cases and AI implementation scenarios
   - If discussing RAG, explain it as an AI architecture (Retrieval-Augmented Generation)
   
2. **Key Terms**: Provide 3-5 important AI/GenAI terms with clear definitions
   - Terms should be AI-specific (e.g., "embeddings", "tokens", "context window", "temperature", "RAG", etc.)

3. **Examples**: Give 2-3 real-world AI/GenAI examples${profile.industry ? ` relevant to ${profile.industry}` : ''}
   - Show how AI tools are used in practice
   - Include specific AI applications or use cases

4. **Try It Yourself**: Create 2-3 hands-on exercises using free GenAI tools (ChatGPT, Claude, Perplexity, etc.)
   - Format prompt exercises using GCSE template when relevant:
     **Goal**: What you want | **Context**: Why/who | **Source**: What info | **Expectations**: How to respond
   - Focus on AI tool usage and AI experimentation

5. **Tool Walkthrough**: ${outline.chapterNumber <= 5 ? 'Include a practical AI tool walkthrough (ChatGPT, Claude, Perplexity, etc.) with step-by-step instructions' : 'Optional - include if relevant to the AI concepts in this chapter'}

Make the content conversational, professional, and actionable. ALL content MUST be about Artificial Intelligence and Generative AI. Return ONLY valid JSON matching the schema.`
}

