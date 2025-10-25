import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Venice API with JSON Schema...')
    
    const VENICE_API_KEY = 'ntmhtbP2fr_pOQsmuLPuN_nm6lm2INWKiNcvrdEfEC'
    const VENICE_API_URL = 'https://api.venice.ai/api/v1'

    // Test with simple JSON schema
    const veniceResponse = await fetch(`${VENICE_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VENICE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'venice-uncensored',  // Confirmed in docs: supports response_format!
        messages: [
          {
            role: 'system',
            content: 'You MUST respond with ONLY valid JSON matching the schema. No other text.'
          },
          {
            role: 'user',
            content: 'Create a simple test course with 2 chapters about AI basics.'
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'course_response',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                subtitle: { type: 'string' },
                chapters: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      chapterNumber: { type: 'number' },
                      title: { type: 'string' },
                      content: { type: 'string' }
                    },
                    required: ['chapterNumber', 'title', 'content'],
                    additionalProperties: false
                  }
                }
              },
              required: ['title', 'subtitle', 'chapters'],
              additionalProperties: false
            }
          }
        }
      }),
    })

    console.log('📡 Response status:', veniceResponse.status)

    if (!veniceResponse.ok) {
      const errorText = await veniceResponse.text()
      console.error('❌ Error:', errorText)
      return NextResponse.json({
        success: false,
        error: `API returned ${veniceResponse.status}`,
        details: errorText
      }, { status: 500 })
    }

    const data = await veniceResponse.json()
    console.log('✅ Response received')
    console.log('📝 Content type:', typeof data.choices[0].message.content)
    console.log('📝 Content preview:', data.choices[0].message.content.substring(0, 300))

    let parsed
    try {
      parsed = JSON.parse(data.choices[0].message.content)
      console.log('✅ JSON parsed successfully!')
      console.log('📚 Title:', parsed.title)
      console.log('📚 Chapters:', parsed.chapters?.length)
    } catch (e: any) {
      console.error('❌ JSON parse failed:', e.message)
      return NextResponse.json({
        success: false,
        error: 'Failed to parse JSON',
        parseError: e.message,
        rawContent: data.choices[0].message.content
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      parsed,
      fullResponse: data
    })
  } catch (error: any) {
    console.error('💥 Error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

