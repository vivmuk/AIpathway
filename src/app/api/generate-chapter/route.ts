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
              content: 'You are an expert AI educator. Create detailed, engaging chapter content with examples and exercises. Respond with ONLY valid JSON.'
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
        console.error(`❌ Chapter ${chapterOutline.chapterNumber} error:`, errorText)
        return NextResponse.json(
          { error: `Chapter generation failed: ${veniceResponse.statusText}` },
          { status: 500 }
        )
      }

      const data = await veniceResponse.json()
      const chapter = JSON.parse(data.choices[0].message.content)
      
      console.log(`✅ Chapter ${chapterOutline.chapterNumber} generated`)
      
      return NextResponse.json({ chapter })
      
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

  return `You are creating Chapter ${outline.chapterNumber} for the course "${courseTitle}".

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
1. **Content**: Write 600-800 words of detailed, engaging content in markdown format
   - Use headers (##), lists, **bold**, *italic*, code blocks where appropriate
   - Make it practical and immediately useful
   - Focus on Generative AI tools and applications
   - Include real-world context and scenarios
   
2. **Key Terms**: Provide 3-5 important terms with clear definitions

3. **Examples**: Give 2-3 real-world examples${profile.industry ? ` relevant to ${profile.industry}` : ''}

4. **Try It Yourself**: Create 2-3 hands-on exercises using free GenAI tools (ChatGPT, Claude, etc.)
   - Format prompt exercises using GCSE template when relevant:
     **Goal**: What you want | **Context**: Why/who | **Source**: What info | **Expectations**: How to respond

5. **Tool Walkthrough**: ${outline.chapterNumber <= 5 ? 'Include a practical tool walkthrough (ChatGPT, Claude, Perplexity, etc.) with step-by-step instructions' : 'Optional - include if relevant to the chapter'}

Make the content conversational, professional, and actionable. Return ONLY valid JSON matching the schema.`
}

