import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/audio/transcriptions'

export async function POST(request: NextRequest) {
    try {
        if (!GROQ_API_KEY) {
            return NextResponse.json(
                { error: 'Groq API key is not configured', transcript: '' },
                { status: 500 }
            )
        }

        const formData = await request.formData()
        const audioFile = formData.get('audio') as File

        if (!audioFile) {
            return NextResponse.json(
                { error: 'No audio file provided' },
                { status: 400 }
            )
        }

        // Check file size before processing
        if (audioFile.size < 1024) {
            return NextResponse.json(
                { error: 'Audio file is too small', transcript: '' },
                { status: 400 }
            )
        }

        // Convert File to Blob
        const audioBlob = new Blob([audioFile], { type: audioFile.type || 'audio/webm' })

        // Create FormData for Groq API
        const groqFormData = new FormData()
        groqFormData.append('file', audioBlob, 'audio.webm')
        groqFormData.append('model', 'whisper-large-v3')
        groqFormData.append('language', 'vi') // Vietnamese
        groqFormData.append('response_format', 'json')

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: groqFormData,
        })

        if (!response.ok) {
            const errorText = await response.text()
            // Only log non-common errors to avoid spam
            try {
                const errorJson = JSON.parse(errorText)
                if (errorJson.error?.message?.includes('too short') || errorJson.error?.message?.includes('could not process')) {
                    // Return empty transcript for common errors instead of error
                    return NextResponse.json({
                        transcript: '',
                        confidence: 0
                    })
                }
            } catch {
                // If error text is not JSON, log it
                console.error('Groq API error:', errorText)
            }
            return NextResponse.json(
                { error: 'Failed to transcribe audio', details: errorText, transcript: '' },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json({
            transcript: data.text || '',
            confidence: 1.0 // Groq API doesn't return confidence, using default
        })
    } catch (error) {
        console.error('Speech-to-text error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
