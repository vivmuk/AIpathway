import { NextRequest, NextResponse } from 'next/server'
import { UserProfile, Course, Chapter } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { userProfile } = await request.json() as { userProfile: UserProfile }

    console.log('Received user profile:', userProfile)

    // Build the prompt based on user profile
    const prompt = buildCoursePrompt(userProfile)

    console.log('Calling Venice API with faster model for production...')

    // Call Venice API
    const VENICE_API_KEY = 'ntmhtbP2fr_pOQsmuLPuN_nm6lm2INWKiNcvrdEfEC' // Hard-coded for debugging
    const VENICE_API_URL = 'https://api.venice.ai/api/v1'
    
    // Create abort controller for timeout
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 55000) // 55 second timeout
    
    try {
      const veniceResponse = await fetch(`${VENICE_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VENICE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'llama-3.2-3b', // Faster model for production (better for Netlify timeout limits)
          messages: [
            {
              role: 'system',
              content: 'You are an expert AI educator who creates personalized learning curricula. You MUST respond with ONLY valid JSON matching the exact schema provided. Do not include any text outside the JSON object.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 10000, // Reduced for faster generation
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'course_curriculum',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                subtitle: { type: 'string' },
                overallDescription: { type: 'string' },
                chapters: {
                  type: 'array',
                  items: {
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
              },
              required: ['title', 'subtitle', 'overallDescription', 'chapters'],
              additionalProperties: false
            }
          }
        }
      }),
    })
    
    clearTimeout(timeout) // Clear timeout after successful response

    console.log('📡 Venice API response status:', veniceResponse.status)
    console.log('📡 Venice API response headers:', Object.fromEntries(veniceResponse.headers.entries()))

    if (!veniceResponse.ok) {
      const errorText = await veniceResponse.text()
      console.error('❌ Venice API error response:', errorText)
      console.error('❌ Status:', veniceResponse.status, veniceResponse.statusText)
      
      return NextResponse.json(
        { 
          error: `Venice API error: ${veniceResponse.statusText}`,
          details: errorText,
          status: veniceResponse.status
        },
        { status: 500 }
      )
    }

    const data = await veniceResponse.json()
    console.log('✅ Venice API response received successfully')
    console.log('📄 Response structure:', Object.keys(data))
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('❌ Unexpected response structure:', JSON.stringify(data, null, 2))
      return NextResponse.json(
        { error: 'Invalid response structure from Venice API' },
        { status: 500 }
      )
    }
    
    let courseData
    try {
      const content = data.choices[0].message.content
      console.log('📝 Raw content length:', content.length)
      console.log('📝 Content preview:', content.substring(0, 200))
      
      courseData = JSON.parse(content)
      console.log('✅ Successfully parsed course data')
      console.log('📚 Course title:', courseData.title)
      console.log('📚 Number of chapters:', courseData.chapters?.length)
    } catch (parseError: any) {
      console.error('❌ JSON parse error:', parseError.message)
      console.error('❌ Raw content:', data.choices[0].message.content)
      
      return NextResponse.json(
        { 
          error: 'Failed to parse course data',
          parseError: parseError.message,
          rawContent: data.choices[0].message.content.substring(0, 500)
        },
        { status: 500 }
      )
    }

    // Create the course object
    const course: Course = {
      id: `course-${Date.now()}`,
      title: courseData.title,
      subtitle: courseData.subtitle,
      overallDescription: courseData.overallDescription,
      generatedAt: new Date().toISOString(),
      userProfile,
      chapters: courseData.chapters
    }

    return NextResponse.json({ course })
    } catch (fetchError: any) {
      clearTimeout(timeout)
      
      if (fetchError.name === 'AbortError') {
        console.error('⏱️ Request timeout - Venice API took too long')
        return NextResponse.json(
          { 
            error: 'Request timeout - The AI is taking longer than expected. Please try again.',
            type: 'timeout'
          },
          { status: 504 }
        )
      }
      
      throw fetchError // Re-throw if not a timeout error
    }
  } catch (error: any) {
    console.error('💥 Fatal error generating course:', error)
    console.error('💥 Error stack:', error.stack)
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate course',
        type: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

function buildCoursePrompt(profile: UserProfile): string {
  const personaDescriptions = {
    beginner: 'a complete beginner who wants structured foundational knowledge of AI concepts and terminology',
    applied: 'someone with basic AI exposure who wants to apply AI to business workflows and productivity',
    technical: 'a technical learner who understands coding and wants to learn implementation frameworks',
    leadership: 'a leader/executive aiming to gain strategic understanding of AI for decision-making'
  }

  const styleDescriptions = {
    visual: 'Include visual analogies and describe concepts in visual terms',
    text: 'Provide detailed written explanations with clear structure',
    'hands-on': 'Focus on practical exercises and code examples',
    mixed: 'Combine explanations, analogies, and practical examples'
  }

  const techLevel = profile.aiScore < 30 ? 'very beginner-friendly, avoiding jargon' :
                    profile.aiScore < 50 ? 'introductory to intermediate' :
                    profile.aiScore < 75 ? 'intermediate to advanced' :
                    'advanced and technical'

  const mindsetGuidance = {
    fixed: `This learner is concerned about AI disruption. Help them see AI as an amplifier of human skills, not a replacement. Include reassurance and practical skill-building approaches.`,
    exploring: `This learner sees AI as a practical tool. Focus on hands-on application and immediate productivity gains. Show them how AI enhances their current capabilities.`,
    growth: `This learner embraces transformation. Challenge them with innovative use cases and encourage them to reimagine workflows and create new value with AI.`
  }

  const industryContext = profile.industry ? `
**Industry Context:** ${profile.industry}
- Include industry-specific examples and use cases throughout the curriculum
- Reference relevant AI applications in ${profile.industry}
- Adapt tool walkthroughs to show ${profile.industry} applications where possible
- Cite real companies or scenarios from this industry` : ''

  return `Create a personalized 10-chapter AI learning curriculum for ${personaDescriptions[profile.personaType]}.

**Learner Profile:**
- AI Fluency Score: ${profile.aiScore}/100
- Coding Experience: ${profile.codingExperience}
- Learning Style: ${profile.learningStyle} - ${styleDescriptions[profile.learningStyle]}
- Time Commitment: ${profile.timeCommitment}
- Goals: ${profile.goals.join(', ')}
- Tools Used: ${profile.aiToolsUsed.length > 0 ? profile.aiToolsUsed.join(', ') : 'None yet'}
- AI Mindset: ${profile.aiMindset || 'exploring'} - ${mindsetGuidance[profile.aiMindset || 'exploring']}
${industryContext}

**CRITICAL: Generative AI Focus & Growth Mindset**

This is a **GENERATIVE AI curriculum** - focus on LLMs, prompt engineering, and GenAI tools.
Traditional ML/analytics should only appear for advanced learners (AI Score > 60).

Throughout the curriculum, naturally incorporate these evidence-based principles:

1. **GenAI as Augmentation, Not Replacement**: Frame GenAI as a tool that amplifies human capabilities. Emphasize human + AI collaboration, where humans provide judgment, creativity, and context while AI handles generation and analysis.

2. **The GenAI Paradigm Shift**: Help learners understand that GenAI isn't just "better software" - it's a fundamental shift in how we think about and complete tasks. Challenge them to reimagine workflows, not just automate existing ones. This is about conversing with AI, iterating, and co-creating.

3. **Iterative Experimentation with Prompts**: Encourage a mindset of experimentation. Working with GenAI is iterative - your first prompt is a starting point, not an endpoint. Include exercises that demonstrate prompt refinement and iteration.

4. **Pattern Recognition Over Use Cases**: Don't just teach "use cases" - teach learners to recognize patterns in their work where GenAI can help. Empower them to discover applications beyond prescribed scenarios.

5. **Learn → Execute → Strategize Framework**: 
   - Learn: Understand GenAI capabilities and limitations
   - Execute: Apply GenAI to immediate, practical problems
   - Strategize: Think bigger - how can GenAI transform entire workflows?

6. **Continuous Learning in the GenAI Era**: Emphasize that GenAI is evolving extremely rapidly. Build meta-skills: how to evaluate new GenAI tools, how to learn new capabilities, how to stay current in the fast-moving GenAI landscape.

**Requirements:**
1. Create exactly 10 chapters that build progressively from fundamentals to advanced applications
2. Technical level should be: ${techLevel}
3. Each chapter MUST include:
   - A clear learning objective
   - Detailed content (500-800 words in markdown format, using headers ##, lists, **bold**, *italic*, code blocks)
   - 3-5 key terms with definitions
   - 2-3 real-world examples ${profile.industry ? `(preferably from ${profile.industry})` : ''}
   - 2-3 "Try it yourself" practical exercises using accessible GenAI tools
   
   **CRITICAL: For prompt engineering exercises, use the GCSE Template:**
   When suggesting prompt exercises, format them with these 4 components:
   - **Goal**: What response do you want from the AI?
   - **Context**: Why do you need it and who is involved?
   - **Source**: Which information sources or samples should the AI use?
   - **Expectations**: How should the AI respond to best meet your needs?
   
   Example format:
   "**Goal**: Generate 3-5 bullet points | **Context**: to prepare me for a meeting with [Client/Topic] | **Source**: Focus on [specific documents/data] | **Expectations**: Please use simple language so I can get up to speed quickly."
   
   - A tool walkthrough featuring current **GenAI tools** (prioritize: ChatGPT, Claude, Gemini, Copilot, Midjourney, ElevenLabs, Perplexity, etc.)
   - For technical learners, include frameworks like LangChain, LlamaIndex, or vector databases

4. Focus areas based on goals: ${profile.learningFocus.join(', ')}

5. **PRIMARY FOCUS: Generative AI (GenAI)**
   This curriculum should be 80-90% focused on Generative AI tools and applications.
   
   Core GenAI topics (REQUIRED for all learners):
   - Introduction to Large Language Models (LLMs) - ChatGPT, Claude, Gemini
   - The GenAI paradigm shift (thinking differently about work)
   - Prompt engineering and effective AI communication
   - AI agents and automated workflows
   - RAG (Retrieval Augmented Generation) for knowledge integration
   - Current GenAI tools and how to evaluate new ones
   - Practical GenAI applications ${profile.industry ? `in ${profile.industry}` : 'across industries'}
   - Multimodal AI (text, image, video, audio generation)
   - Building an AI-enhanced personal/professional workflow with GenAI
   - Ethics, bias, and responsible GenAI use
   - Future of GenAI and continuous learning strategies
   
   **ML/Analytics topics (ONLY for advanced learners with AI Score > 60)**:
   ${profile.aiScore > 60 ? `
   - Include 1-2 chapters on ML fundamentals, model training, or data analytics
   - Cover topics like: supervised/unsupervised learning, model evaluation, embeddings
   - Keep it practical - focus on using pre-trained models, not building from scratch` : `
   - DO NOT include traditional ML or analytics topics
   - Keep focus on using GenAI tools, not building ML models`}

6. Weave AI mindset principles throughout - don't make them separate "mindset chapters"
7. Make it engaging, practical, and immediately useful
8. Use conversational but professional tone
9. Include specific, actionable exercises that learners can do with free/accessible AI tools

Return ONLY valid JSON matching the schema. No additional text.`
}

