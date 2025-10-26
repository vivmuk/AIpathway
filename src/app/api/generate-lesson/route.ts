import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { topic, knowledgeLevel } = await request.json() as {
      topic: string
      knowledgeLevel: string
    }

    const VENICE_API_KEY = 'ntmhtbP2fr_pOQsmuLPuN_nm6lm2INWKiNcvrdEfEC'
    const VENICE_API_URL = 'https://api.venice.ai/api/v1'

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 120000) // 2 minutes

    const levelDescriptions: Record<string, string> = {
      beginner: 'absolute beginner with no prior knowledge - explain everything from scratch',
      intermediate: 'someone with basic understanding - build on foundational knowledge',
      advanced: 'experienced practitioner - focus on advanced concepts and latest developments',
      expert: 'deep expert - provide cutting-edge insights and technical depth'
    }

    const levelDescription = levelDescriptions[knowledgeLevel] || levelDescriptions.intermediate

    const prompt = `Create a comprehensive lesson on "${topic}" for ${levelDescription}.

**YOU MUST GENERATE REAL CONTENT, NOT PLACEHOLDER TEXT.**

**Requirements:**
1. Write a detailed 400-600 word explanation of "${topic}" in markdown format
   - Use ## headers, **bold**, *italic*, \`code\`, bullet points
   - Make it engaging and educational
   
2. Define 3-5 key terms related to ${topic}
   - Each term should have a clear, specific definition
   - Not generic placeholders like "string"
   
3. Provide 2-3 real-world examples of ${topic} in action
   - Specific, concrete examples from industry
   
4. Create 2-3 practical exercises the learner can try
   - Actionable, hands-on activities

**CRITICAL**: Generate REAL educational content about "${topic}", not placeholder values. The user is learning about ${topic} at a ${knowledgeLevel} level.

Return ONLY valid JSON with these exact fields:
{
  "topic": "${topic}",
  "knowledgeLevel": "${knowledgeLevel}",
  "content": "markdown text here",
  "keyTerms": [{"term": "term name", "definition": "definition text"}],
  "examples": ["example 1", "example 2"],
  "practicalExercises": ["exercise 1", "exercise 2"]
}`

    try {
      const veniceResponse = await fetch(`${VENICE_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VENICE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'mistral-31-24b',
          messages: [
            {
              role: 'system',
              content: 'You are an expert AI educator. Create detailed, engaging lessons with real educational content. Generate comprehensive explanations, not placeholder text. Respond with ONLY valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 6000,
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'lesson_content',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  topic: { type: 'string' },
                  knowledgeLevel: { type: 'string' },
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
                  practicalExercises: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                },
                required: ['topic', 'knowledgeLevel', 'content', 'keyTerms', 'examples', 'practicalExercises'],
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
          { error: `Lesson generation failed: ${veniceResponse.statusText}`, details: errorText },
          { status: 500 }
        )
      }

      const data = await veniceResponse.json()
      let rawContent = data.choices[0].message.content

      // Try to fix common JSON issues
      try {
        rawContent = rawContent.replace(/```json\n?/g, '').replace(/```\n?$/g, '').trim()
        const lessonContent = JSON.parse(rawContent)

        // Now fetch latest news with web search
        const newsController = new AbortController()
        const newsTimeout = setTimeout(() => newsController.abort(), 60000) // 1 minute

        const newsPrompt = `Search the web for the latest news and developments about "${topic}". Find 3-5 recent articles.

For each article, provide:
{
  "newsItems": [
    {
      "headline": "Article title here",
      "summary": "2-3 sentence summary of the key points",
      "source": "Publication or website name",
      "date": "Approximate date (e.g., 'January 2025' or '2025-01-15')",
      "url": "Direct URL to the article"
    }
  ]
}

Return ONLY valid JSON. Use real URLs from your web search results.`

        try {
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
                  content: 'You are a helpful news aggregator. Search the web for latest news and return results in JSON format.'
                },
                {
                  role: 'user',
                  content: newsPrompt
                }
              ],
              temperature: 0.3,
              max_tokens: 2000,
            }),
          })

          clearTimeout(newsTimeout)

          let latestNews = []
          if (newsResponse.ok) {
            try {
              const newsData = await newsResponse.json()
              let newsContent = newsData.choices[0].message.content
              
              // Clean up markdown code blocks if present
              newsContent = newsContent.replace(/```json\n?/g, '').replace(/```\n?$/g, '').trim()
              
              const newsParsed = JSON.parse(newsContent)
              latestNews = newsParsed.newsItems || []
            } catch (parseError: any) {
              // News parsing failed, continue without news
            }
          }

          const lesson = {
            ...lessonContent,
            latestNews
          }

          return NextResponse.json({ lesson })
        } catch (newsError: any) {
          clearTimeout(newsTimeout)
          
          // Return lesson without news if news fetch fails
          const lesson = {
            ...lessonContent,
            latestNews: []
          }
          return NextResponse.json({ lesson })
        }

      } catch (parseError: any) {
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
          { error: 'Lesson generation timeout' },
          { status: 504 }
        )
      }
      throw fetchError
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate lesson', details: error.toString() },
      { status: 500 }
    )
  }
}

