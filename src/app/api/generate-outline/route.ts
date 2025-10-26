import { NextRequest, NextResponse } from 'next/server'
import { UserProfile } from '@/types'
import { CHAPTER_COUNT, OUTLINE_TIMEOUT, OUTLINE_MODEL } from '@/config/course.config'

export async function POST(request: NextRequest) {
  try {
    const { userProfile } = await request.json() as { userProfile: UserProfile }

    const VENICE_API_KEY = 'ntmhtbP2fr_pOQsmuLPuN_nm6lm2INWKiNcvrdEfEC'
    const VENICE_API_URL = 'https://api.venice.ai/api/v1'
    
    const prompt = buildOutlinePrompt(userProfile, CHAPTER_COUNT)
    
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), OUTLINE_TIMEOUT)
    
    try {
      const veniceResponse = await fetch(`${VENICE_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VENICE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: OUTLINE_MODEL,
          messages: [
            {
              role: 'system',
              content: `You are an expert Artificial Intelligence and Generative AI curriculum designer. Generate a course outline about AI/GenAI with ${CHAPTER_COUNT} chapter titles and objectives. All topics must be about AI technology (LLMs, ChatGPT, Claude, prompt engineering, AI agents, RAG systems, AI implementation, etc.). Respond with ONLY valid JSON.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 5000,
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'course_outline',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  subtitle: { type: 'string' },
                  overallDescription: { type: 'string' },
                  chapters: {
                    type: 'array',
                    minItems: CHAPTER_COUNT,
                    maxItems: CHAPTER_COUNT,
                    items: {
                      type: 'object',
                      properties: {
                        chapterNumber: { type: 'number' },
                        title: { type: 'string' },
                        learningObjective: { type: 'string' }
                      },
                      required: ['chapterNumber', 'title', 'learningObjective'],
                      additionalProperties: false
                    }
                  }
                },
                required: ['title', 'subtitle', 'overallDescription', 'chapters'],
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
          { error: `Outline generation failed: ${veniceResponse.statusText}`, details: errorText },
          { status: 500 }
        )
      }

      const data = await veniceResponse.json()
      const outline = JSON.parse(data.choices[0].message.content)
      
      return NextResponse.json({ outline })
      
    } catch (fetchError: any) {
      clearTimeout(timeout)
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Outline generation timeout' },
          { status: 504 }
        )
      }
      throw fetchError
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate outline' },
      { status: 500 }
    )
  }
}

function buildOutlinePrompt(profile: UserProfile, chapterCount: number): string {
  const personaDescriptions = {
    beginner: 'a complete beginner who wants structured foundational knowledge of AI concepts',
    applied: 'someone with basic AI exposure who wants to apply AI to business workflows',
    technical: 'a technical learner who understands coding and wants to learn implementation',
    leadership: 'a leader/executive aiming to gain strategic understanding of AI'
  }

  const techLevel = profile.aiScore < 30 ? 'beginner-friendly' :
                    profile.aiScore < 50 ? 'introductory to intermediate' :
                    profile.aiScore < 75 ? 'intermediate to advanced' :
                    'advanced and technical'

  return `Create a ${chapterCount}-chapter ARTIFICIAL INTELLIGENCE AND GENERATIVE AI learning curriculum outline for ${personaDescriptions[profile.personaType]}.

**CRITICAL CONTEXT: This course is EXCLUSIVELY about Artificial Intelligence and Generative AI technology.**
- ALL topics must be about AI/GenAI (Large Language Models, ChatGPT, Claude, Gemini, prompt engineering, AI agents, ML, RAG systems, etc.)
- RAG = Retrieval-Augmented Generation (AI concept), NOT project management
- Focus on AI tools, AI applications, AI implementation, AI strategy
- NO non-AI topics (no general business, project management, or unrelated technology topics)

**Learner Profile:**
- AI Fluency Score: ${profile.aiScore}/100
- Technical level: ${techLevel}
- Goals: ${profile.goals.join(', ')}
- Industry: ${profile.industry || 'General'}
- Focus: Generative AI (LLMs, ChatGPT, Claude, prompt engineering, AI agents, AI automation)

**Requirements:**
1. Generate exactly ${chapterCount} chapter titles that build progressively through AI/GenAI concepts
2. Each chapter needs a clear, specific learning objective related to AI/GenAI
3. Focus on practical GenAI applications and AI tools (ChatGPT, Claude, Perplexity, Midjourney, etc.)
4. Make it relevant to their goals and industry, but ALWAYS in the context of AI/GenAI
5. Start with AI fundamentals, progress to advanced AI applications
6. Examples of good topics: Prompt Engineering, AI Agents, RAG (Retrieval-Augmented Generation), Fine-tuning, Vector Databases for AI, AI Ethics, etc.

Return ONLY the JSON outline with title, subtitle, description, and ${chapterCount} chapters (number, title, objective).`
}

