import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerateContentResult } from '@google/generative-ai'

interface GenerationConfig {
  temperature?: number
  topP?: number
  topK?: number
  maxOutputTokens?: number
  responseMimeType?: string
}

interface SafetySetting {
  category: HarmCategory
  threshold: HarmBlockThreshold
}

interface PromptGenerationParams {
  description: string
  style?: string
  mood?: string
  genre?: string
  instruments?: string[]
  duration?: number
  tempo?: string
  key?: string
}

interface GeneratedPrompt {
  prompt: string
  explanation: string
  suggestions: string[]
}

interface AudioMetadata {
  duration?: number
  format?: string
  sampleRate?: number
  channels?: number
  [key: string]: string | number | undefined
}

interface AudioAnalysisResult {
  description: string
  tempo?: string
  key?: string
  mood?: string
  instruments?: string[]
  genre?: string
  confidence: number
}

interface AudioEnhancementParams {
  audioData: string
  enhancementType: 'clarity' | 'bass' | 'treble' | 'spatial' | 'mastering'
  intensity?: number
  metadata?: AudioMetadata
}

interface EnhancementResult {
  success: boolean
  enhancedAudio?: string
  parameters?: Record<string, unknown>
  error?: string
}

interface TranscriptionResult {
  text: string
  confidence: number
  language?: string
  timestamps?: Array<{ start: number; end: number; text: string }>
}

interface MusicGenerationParams {
  prompt: string
  duration?: number
  style?: string
  mood?: string
  tempo?: number
  key?: string
}

interface MusicGenerationResult {
  success: boolean
  audioUrl?: string
  metadata?: AudioMetadata
  error?: string
}

class GoogleGeminiService {
  private genAI: GoogleGenerativeAI
  private model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>
  private apiKey: string

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Google Gemini API key is required')
    }
    this.apiKey = apiKey
    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' })
  }

  private getGenerationConfig(): GenerationConfig {
    return {
      temperature: 0.9,
      topP: 1,
      topK: 40,
      maxOutputTokens: 2048,
      responseMimeType: 'text/plain',
    }
  }

  private getSafetySettings(): SafetySetting[] {
    return [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ]
  }

  async generatePrompt(params: PromptGenerationParams): Promise<GeneratedPrompt> {
    try {
      const systemPrompt = `You are an expert music producer and audio engineer. Generate a detailed, creative prompt for AI music generation based on the user's description. Include specific musical elements, instrumentation, mood, and production techniques.`

      const userPrompt = `
Create a detailed music generation prompt based on:
- Description: ${params.description}
${params.style ? `- Style: ${params.style}` : ''}
${params.mood ? `- Mood: ${params.mood}` : ''}
${params.genre ? `- Genre: ${params.genre}` : ''}
${params.instruments && params.instruments.length > 0 ? `- Instruments: ${params.instruments.join(', ')}` : ''}
${params.duration ? `- Duration: ${params.duration} seconds` : ''}
${params.tempo ? `- Tempo: ${params.tempo}` : ''}
${params.key ? `- Key: ${params.key}` : ''}

Provide:
1. A complete, detailed prompt (2-3 paragraphs)
2. A brief explanation of the musical choices
3. 3 alternative suggestions for variation

Format your response as JSON with keys: prompt, explanation, suggestions (array)
      `

      const result: GenerateContentResult = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: systemPrompt + userPrompt }] }],
        generationConfig: this.getGenerationConfig(),
        safetySettings: this.getSafetySettings(),
      })

      const response = result.response
      const text = response.text()

      // Try to parse as JSON, fallback to structured parsing
      try {
        const parsed = JSON.parse(text) as GeneratedPrompt
        return parsed
      } catch {
        // Fallback: extract sections manually
        const lines = text.split('\n').filter(line => line.trim())
        const promptSection = lines.slice(0, Math.floor(lines.length / 2)).join(' ')
        const explanationSection = lines.slice(Math.floor(lines.length / 2)).join(' ')
        
        return {
          prompt: promptSection,
          explanation: explanationSection,
          suggestions: [
            'Try adding ambient textures for more depth',
            'Consider varying the tempo throughout',
            'Experiment with unconventional instruments'
          ]
        }
      }
    } catch (error) {
      console.error('Error generating prompt:', error)
      throw new Error('Failed to generate music prompt')
    }
  }

  async analyzeAudio(audioData: string, metadata?: AudioMetadata): Promise<AudioAnalysisResult> {
    try {
      const visionModel = this.genAI.getGenerativeModel({ model: 'gemini-pro-vision' })
      
      const prompt = `
Analyze this audio waveform and provide:
1. Musical description (genre, mood, style)
2. Estimated tempo (BPM)
3. Estimated key signature
4. Likely instruments/sounds present
5. Overall mood and emotional content
6. Confidence level (0-1)

${metadata ? `Additional metadata: ${JSON.stringify(metadata)}` : ''}

Format response as JSON with keys: description, tempo, key, mood, instruments (array), genre, confidence
      `

      const result: GenerateContentResult = await visionModel.generateContent({
        contents: [{
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/png',
                data: audioData.split(',')[1] || audioData
              }
            }
          ]
        }],
        generationConfig: this.getGenerationConfig(),
        safetySettings: this.getSafetySettings(),
      })

      const response = result.response
      const text = response.text()

      try {
        const parsed = JSON.parse(text) as AudioAnalysisResult
        return parsed
      } catch {
        return {
          description: text.substring(0, 500),
          mood: 'Unknown',
          confidence: 0.5
        }
      }
    } catch (error) {
      console.error('Error analyzing audio:', error)
      throw new Error('Failed to analyze audio')
    }
  }

  async enhanceAudio(params: AudioEnhancementParams): Promise<EnhancementResult> {
    try {
      const prompt = `
As an expert audio engineer, suggest optimal enhancement parameters for this audio:
- Enhancement type: ${params.enhancementType}
- Intensity: ${params.intensity || 0.5}
${params.metadata ? `- Audio metadata: ${JSON.stringify(params.metadata)}` : ''}

Provide specific values for:
1. EQ adjustments (frequencies and gain in dB)
2. Compression settings (threshold, ratio, attack, release)
3. Reverb/spatial parameters if applicable
4. Other relevant processing parameters

Format as JSON with key 'parameters' containing the settings.
      `

      const result: GenerateContentResult = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: this.getGenerationConfig(),
        safetySettings: this.getSafetySettings(),
      })

      const response = result.response
      const text = response.text()

      try {
        const parsed = JSON.parse(text) as { parameters: Record<string, unknown> }
        return {
          success: true,
          parameters: parsed.parameters,
          enhancedAudio: params.audioData // In real implementation, apply parameters
        }
      } catch {
        return {
          success: false,
          error: 'Failed to parse enhancement parameters'
        }
      }
    } catch (error) {
      console.error('Error enhancing audio:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to enhance audio'
      }
    }
  }

  async transcribeAudio(audioData: string): Promise<TranscriptionResult> {
    try {
      // Note: Gemini doesn't directly support audio transcription yet
      // This is a placeholder for future functionality
      const prompt = `
Transcribe the audio content and provide:
1. Full text transcription
2. Confidence level
3. Detected language
4. Timestamps for major sections

Format as JSON with keys: text, confidence, language, timestamps (array of {start, end, text})
      `

      const result: GenerateContentResult = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: this.getGenerationConfig(),
        safetySettings: this.getSafetySettings(),
      })

      const response = result.response
      const text = response.text()

      return {
        text: text,
        confidence: 0.8,
        language: 'en'
      }
    } catch (error) {
      console.error('Error transcribing audio:', error)
      throw new Error('Failed to transcribe audio')
    }
  }

  async generateMusic(params: MusicGenerationParams): Promise<MusicGenerationResult> {
    try {
      // Note: This is a placeholder as Gemini doesn't generate audio directly
      // In production, this would integrate with Google's Music AI models
      console.log('Music generation requested:', params)
      
      return {
        success: false,
        error: 'Direct music generation not yet available. Use AI Generation workflow with Replicate.'
      }
    } catch (error) {
      console.error('Error generating music:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate music'
      }
    }
  }
}

// Export singleton instance
let googleGeminiServiceInstance: GoogleGeminiService | null = null

export function getGoogleGeminiService(): GoogleGeminiService {
  if (!googleGeminiServiceInstance) {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GOOGLE_GEMINI_API_KEY environment variable is not set')
    }
    googleGeminiServiceInstance = new GoogleGeminiService(apiKey)
  }
  return googleGeminiServiceInstance
}

export const googleGeminiService = getGoogleGeminiService

export type {
  GeneratedPrompt,
  PromptGenerationParams,
  AudioAnalysisResult,
  AudioEnhancementParams,
  EnhancementResult,
  TranscriptionResult,
  MusicGenerationParams,
  MusicGenerationResult,
  AudioMetadata,
}
