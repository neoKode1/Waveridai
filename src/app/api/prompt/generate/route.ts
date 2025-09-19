import { NextRequest, NextResponse } from 'next/server'
import { googleGeminiService } from '@/lib/services/google-gemini-service'
import { logToTerminal } from '@/lib/utils/terminal-logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      sourceAudioAnalysis, 
      referenceAudioAnalysis, 
      userPrompt, 
      workflowType 
    } = body

    console.log('🎵 Prompt Generation API: Starting prompt generation', {
      hasSourceAnalysis: !!sourceAudioAnalysis,
      hasReferenceAnalysis: !!referenceAudioAnalysis,
      hasUserPrompt: !!userPrompt,
      workflowType
    })

    logToTerminal('PromptGenerationAPI', 'Starting prompt generation', {
      workflowType,
      hasUserPrompt: !!userPrompt,
      hasSourceAnalysis: !!sourceAudioAnalysis,
      hasReferenceAnalysis: !!referenceAudioAnalysis
    })

    if (!sourceAudioAnalysis || !referenceAudioAnalysis) {
      return NextResponse.json(
        { success: false, error: 'Both source and reference audio analysis are required' },
        { status: 400 }
      )
    }

    // Use Google Gemini to generate intelligent Lyria prompt
    const generatedPrompt = await googleGeminiService.generateLyriaPrompt({
      sourceAnalysis: sourceAudioAnalysis,
      referenceAnalysis: referenceAudioAnalysis,
      userPrompt: userPrompt || undefined
    })

    console.log('🎵 Prompt Generation API: Prompt generation completed', {
      promptLength: generatedPrompt.prompt.length,
      confidence: generatedPrompt.confidence,
      reasoning: generatedPrompt.reasoning.substring(0, 100) + '...'
    })

    logToTerminal('PromptGenerationAPI', 'Prompt generation completed', {
      promptLength: generatedPrompt.prompt.length,
      confidence: Math.round(generatedPrompt.confidence * 100) + '%',
      suggestedDuration: generatedPrompt.suggestedParameters.duration
    })

    return NextResponse.json({
      success: true,
      data: generatedPrompt
    })

  } catch (error) {
    console.error('🎵 Prompt Generation API: Generation failed:', error)
    
    logToTerminal('PromptGenerationAPI', 'Prompt generation failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Prompt generation failed' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Prompt Generation API - POST to generate intelligent Lyria prompts',
    methods: ['POST'],
    required: ['sourceAudioAnalysis', 'referenceAudioAnalysis'],
    optional: ['userPrompt', 'workflowType'],
    description: 'Uses Google Gemini to analyze audio data and generate intelligent prompts for Lyria AI music generation'
  })
}