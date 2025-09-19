import Replicate from 'replicate'

export interface LyriaGenerationRequest {
  prompt: string
  duration?: number
  seed?: number
  temperature?: number
}

export interface LyriaGenerationResult {
  audio_url: string
  seed: number
  duration: number
  prompt: string
}

interface LyriaOutput {
  url?: () => string
  [key: string]: unknown
}

export class LyriaService {
  private replicate: Replicate

  constructor() {
    const token = process.env.REPLICATE_API_TOKEN;
    console.log('🎵 LyriaService: Initializing with token:', token ? `${token.substring(0, 10)}...` : 'NO TOKEN');
    
    if (!token) {
      throw new Error('REPLICATE_API_TOKEN environment variable is not set');
    }
    
    this.replicate = new Replicate({
      auth: token,
    })
  }

  /**
   * Generate music using Google Lyria 2 model
   */
  async generateMusic(request: LyriaGenerationRequest): Promise<LyriaGenerationResult> {
    try {
      console.log('🎵 LyriaService: Starting music generation', {
        prompt: request.prompt,
        duration: request.duration || 10,
        seed: request.seed
      })

      // Use the correct Google Lyria 2 model ID
      const input = {
        prompt: request.prompt,
        // Lyria 2 parameters based on the official API documentation
        duration: request.duration || 10,
        seed: request.seed || Math.floor(Math.random() * 1000000),
        temperature: request.temperature || 0.8
      };

      const output = await this.replicate.run("google/lyria-2", { input });

      console.log('🎵 LyriaService: Music generation completed', {
        output: output,
        duration: request.duration || 10
      })

      // Handle Lyria output - it's a file object with url() method
      let audioUrl: string
      
      console.log('🎵 LyriaService: Raw output type:', typeof output, 'Has url method:', typeof (output as LyriaOutput)?.url === 'function')
      
      if (Array.isArray(output)) {
        // If output is an array, get the first item
        const firstOutput = output[0] as LyriaOutput
        if (firstOutput && typeof firstOutput.url === 'function') {
          audioUrl = firstOutput.url()
        } else {
          audioUrl = firstOutput as unknown as string
        }
      } else if (output && typeof (output as LyriaOutput).url === 'function') {
        // Output has url() method - this is the correct format
        audioUrl = (output as LyriaOutput).url!()
      } else if (output && typeof output === 'object' && 'url' in output) {
        audioUrl = (output as LyriaOutput).url as unknown as string
      } else if (output && typeof output === 'string') {
        audioUrl = output
      } else {
        console.error('🎵 LyriaService: Unexpected output format:', output)
        console.error('🎵 LyriaService: Output constructor:', output?.constructor?.name)
        console.error('🎵 LyriaService: Output methods:', Object.getOwnPropertyNames(output || {}))
        throw new Error(`Invalid audio output format from Lyria: ${typeof output}`)
      }
      
      console.log('🎵 LyriaService: Audio URL extracted:', audioUrl)
      
      return {
        audio_url: audioUrl,
        seed: request.seed || Math.floor(Math.random() * 1000000),
        duration: request.duration || 10,
        prompt: request.prompt
      }
    } catch (error) {
      console.error('🎵 LyriaService: Music generation failed:', error)
      throw new Error(`Lyria generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Download audio from URL and convert to AudioBuffer
   */
  async downloadAudioAsBuffer(audioUrl: string): Promise<AudioBuffer> {
    try {
      console.log('🎵 LyriaService: Downloading audio from URL', { audioUrl })

      const response = await fetch(audioUrl)
      if (!response.ok) {
        throw new Error(`Failed to download audio: ${response.statusText}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      console.log('🎵 LyriaService: Audio downloaded successfully', {
        duration: audioBuffer.duration,
        sampleRate: audioBuffer.sampleRate,
        channels: audioBuffer.numberOfChannels
      })

      return audioBuffer
    } catch (error) {
      console.error('🎵 LyriaService: Audio download failed:', error)
      throw new Error(`Audio download failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Generate a music prompt from MIDI and reference audio analysis
   */
  generatePromptFromAnalysis(
    midiData: { tracks: Array<{ notes: Array<unknown> }>, tempo?: number, duration?: number },
    referenceAudio: AudioBuffer,
    targetInstrument: string = 'guitar'
  ): string {
    try {
      // Analyze MIDI data
      const totalNotes = midiData.tracks.reduce((sum: number, track) => sum + track.notes.length, 0)
      const tempo = midiData.tempo || 120
      const duration = midiData.duration || 10

      // Analyze reference audio characteristics
      const sampleRate = referenceAudio.sampleRate
      // const channels = referenceAudio.numberOfChannels
      const audioDuration = referenceAudio.duration

      // Generate descriptive prompt
      const tempoDescription = tempo < 80 ? 'slow, relaxed' : tempo > 140 ? 'fast, energetic' : 'moderate tempo'
      const durationDescription = duration < 5 ? 'short' : duration > 20 ? 'long' : 'medium length'
      
      const prompt = `A ${targetInstrument} performance with ${tempoDescription} rhythm, ${durationDescription} duration, polyphonic arrangement with ${totalNotes} notes, professional audio quality, clear instrument separation, dynamic range, studio recording quality`

      console.log('🎵 LyriaService: Generated prompt from analysis', {
        prompt,
        midiNotes: totalNotes,
        tempo,
        duration,
        audioDuration,
        sampleRate
      })

      return prompt
    } catch (error) {
      console.error('🎵 LyriaService: Prompt generation failed:', error)
      // Fallback prompt
      return `A ${targetInstrument} performance, polyphonic arrangement, professional audio quality, clear instrument separation, dynamic range, studio recording quality`
    }
  }
}

export const lyriaService = new LyriaService()
