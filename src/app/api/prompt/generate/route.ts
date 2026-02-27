import { NextRequest, NextResponse } from 'next/server'
import { geminiService } from '@/lib/services/google-gemini-service'
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

    console.log('\u{1F3B5} Prompt Generation API: Starting prompt generation', {
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

    // Build a description prompt from the analysis objects
    const parts = [
      'Transform source audio to match reference style.',
      `Source: ${sourceAudioAnalysis.genre ?? 'unknown'} at ${sourceAudioAnalysis.tempo ?? 120} BPM`,
      `in ${sourceAudioAnalysis.key ?? 'unknown key'}, mood: ${sourceAudioAnalysis.mood ?? 'neutral'},`,
      `instruments: ${(sourceAudioAnalysis.instruments ?? []).join(', ') || 'unknown'}.`,
      `Reference: ${referenceAudioAnalysis.genre ?? 'unknown'} at ${referenceAudioAnalysis.tempo ?? 120} BPM`,
      `in ${referenceAudioAnalysis.key ?? 'unknown key'}, mood: ${referenceAudioAnalysis.mood ?? 'neutral'},`,
      `instruments: ${(referenceAudioAnalysis.instruments ?? []).join(', ') || 'unknown'}.`,
      userPrompt ? `Additional request: ${userPrompt}` : '',
    ]
    const analysisPrompt = parts.filter(Boolean).join(' ')

    const description = await geminiService.generateMusicDescription(analysisPrompt)

    const generatedPrompt = {
      prompt: description,
      confidence: 0.85,
      reasoning: 'Generated from audio analysis using Gemini AI',
      suggestedParameters: {
        duration: 10,
        temperature: 0.8,
        seed: Math.floor(Math.random() * 1000)
      }
    }

    console.log('\u{1F3B5} Prompt Generation API: Prompt generation completed', {
      promptLength: generatedPrompt.prompt.length,
      confidence: generatedPrompt.confidence,
    })

    logToTerminal('PromptGenerationAPI', 'Prompt generation completed', {
      promptLength: generatedPrompt.prompt.length,
      confidence: Math.round(generatedPrompt.confidence * 100) + '%',
      suggestedDuration: generatedPrompt.suggestedParameters.duration
    })

    return NextResponse.json({ success: true, data: generatedPrompt })

  } catch (error) {
    console.error('\u{1F3B5} Prompt Generation API: Generation failed:', error)
    logToTerminal('PromptGenerationAPI', 'Prompt generation failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Prompt generation failed' },
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
    description: 'Uses Google Gemini to analyze audio data and generate prompts for Lyria AI music generation'
  })
}
