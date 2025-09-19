import { NextRequest, NextResponse } from 'next/server'
import { lyriaService } from '@/lib/services/lyria-service'
import { logToTerminal } from '@/lib/utils/terminal-logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      prompt, 
      duration = 10, 
      seed, 
      temperature = 0.8,
      midiData,
      referenceAudioAnalysis
    } = body

    console.log('🎵 Lyria API: Starting music generation request', {
      prompt,
      duration,
      seed,
      temperature,
      hasMIDIData: !!midiData,
      hasReferenceAnalysis: !!referenceAudioAnalysis
    })

    logToTerminal('LyriaAPI', 'Starting music generation request', {
      prompt: prompt?.substring(0, 100) + '...',
      duration,
      seed
    })

    // Generate music using Lyria
    const result = await lyriaService.generateMusic({
      prompt,
      duration,
      seed,
      temperature
    })

    console.log('🎵 Lyria API: Music generation completed', {
      audioUrl: result.audio_url,
      duration: result.duration,
      seed: result.seed
    })

    logToTerminal('LyriaAPI', 'Music generation completed successfully', {
      duration: result.duration,
      seed: result.seed,
      hasAudioUrl: !!result.audio_url
    })

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('🎵 Lyria API: Music generation failed:', error)
    
    logToTerminal('LyriaAPI', 'Music generation failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Music generation failed' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Lyria 2 Music Generation API',
    endpoints: {
      POST: '/api/lyria/generate - Generate music from text prompt'
    },
    parameters: {
      prompt: 'Text description of the music to generate',
      duration: 'Duration in seconds (default: 10)',
      seed: 'Random seed for reproducible results',
      temperature: 'Creativity level (0.0-1.0, default: 0.8)'
    }
  })
}
