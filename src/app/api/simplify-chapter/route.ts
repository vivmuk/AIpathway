import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { chapterContent, simplificationLevel } = await request.json()

    const prompt = `Take the following chapter content and rewrite it to be ${simplificationLevel}.

Original content:
${chapterContent}

Rewrite this content to be clearer and ${simplificationLevel}. Keep the same structure (sections, key terms, examples) but make the explanations simpler and more accessible. Return ONLY the rewritten content in markdown format.`

    const VENICE_API_KEY = 'ntmhtbP2fr_pOQsmuLPuN_nm6lm2INWKiNcvrdEfEC' // Hard-coded for debugging
    const VENICE_API_URL = 'https://api.venice.ai/api/v1'
    
    const veniceResponse = await fetch(`${VENICE_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VENICE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.2-3b', // Fast model for simplification
        messages: [
          {
            role: 'system',
            content: 'You are an expert educator who excels at explaining complex topics in simple, accessible ways.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!veniceResponse.ok) {
      throw new Error(`Venice API error: ${veniceResponse.statusText}`)
    }

    const data = await veniceResponse.json()
    const simplifiedContent = data.choices[0].message.content

    return NextResponse.json({ simplifiedContent })
  } catch (error: any) {
    console.error('Error simplifying chapter:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to simplify chapter' },
      { status: 500 }
    )
  }
}

