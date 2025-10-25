import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Venice API connection...')
    
    const VENICE_API_KEY = 'ntmhtbP2fr_pOQsmuLPuN_nm6lm2INWKiNcvrdEfEC'
    const VENICE_API_URL = 'https://api.venice.ai/api/v1'

    // Simple test request
    const veniceResponse = await fetch(`${VENICE_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VENICE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b',
        messages: [
          {
            role: 'user',
            content: 'Say "Hello, Venice API is working!"'
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      }),
    })

    console.log('📡 Venice API response status:', veniceResponse.status)
    console.log('📡 Venice API response headers:', Object.fromEntries(veniceResponse.headers.entries()))

    if (!veniceResponse.ok) {
      const errorText = await veniceResponse.text()
      console.error('❌ Venice API error response:', errorText)
      return NextResponse.json({
        success: false,
        error: `Venice API returned ${veniceResponse.status}`,
        details: errorText
      }, { status: 500 })
    }

    const data = await veniceResponse.json()
    console.log('✅ Venice API success! Response:', JSON.stringify(data, null, 2))

    return NextResponse.json({
      success: true,
      message: data.choices[0].message.content,
      fullResponse: data
    })
  } catch (error: any) {
    console.error('💥 Test API Error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

