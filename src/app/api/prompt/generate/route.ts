import { NextRequest, NextResponse } from 'next/server'
import { getGoogleGeminiService } from '@/lib/services/google-gemini-service'
import type { PromptGenerationParams } from '@/lib/services/google-gemini-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as PromptGenerationParams

    // Validate required fields
    if (!body.description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      )
    }

    // Get Gemini service instance
    const geminiService = getGoogleGeminiService()

    // Generate prompt
    const result = await geminiService.generatePrompt(body)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error generating prompt:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate prompt',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
