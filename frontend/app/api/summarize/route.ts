import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBWq38vwFZutXNib50ErfU9mqXPMH9IczM'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversation } = body
    
    if (!conversation || !Array.isArray(conversation)) {
      return NextResponse.json(
        { error: 'Conversation array is required' },
        { status: 400 }
      )
    }

    // Format conversation for summarization
    const conversationText = conversation
      .map((item: { speaker: string; text: string }) => {
        const speakerLabel = item.speaker === 'me' ? 'Bạn' : 'Đối phương'
        return `${speakerLabel}: ${item.text}`
      })
      .join('\n')

    const prompt = `Bạn là một trợ lý AI chuyên tóm tắt cuộc trò chuyện bằng tiếng Việt. Hãy tóm tắt cuộc trò chuyện sau đây một cách ngắn gọn, súc tích và tập trung vào những điểm chính:

${conversationText}

Tóm tắt:`

    const apiUrl = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', errorText)
      return NextResponse.json(
        { error: 'Failed to generate summary', details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Không thể tạo tóm tắt'
    
    return NextResponse.json({ 
      summary: summary.trim(),
    })
  } catch (error) {
    console.error('Summarization error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

