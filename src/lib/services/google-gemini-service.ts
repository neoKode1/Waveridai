import { GoogleGenerativeAI } from '@google/generative-ai'

interface GeminiConfig {
  apiKey: string
  model?: string
}

interface GenerateContentParams {
  prompt: string
  temperature?: number
  maxOutputTokens?: number
}

interface GenerateAudioParams {
  prompt: string
  referenceAudio?: string
  duration?: number
}

export class GoogleGeminiService {
  private genAI: GoogleGenerativeAI
  private model: string

  constructor(config: GeminiConfig) {
    this.genAI = new GoogleGenerativeAI(config.apiKey)
    this.model = config.model || 'gemini-pro'
  }

  /**
   * Generate text content using Gemini
   */
  async generateContent(params: GenerateContentParams): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.model })

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: params.prompt }] }],
        generationConfig: {
          temperature: params.temperature || 0.7,
          maxOutputTokens: params.maxOutputTokens || 2048,
        },
      })

      const response = result.response
      return response.text()
    } catch (error) {
      console.error('Error generating content:', error)
      throw new Error('Failed to generate content with Gemini')
    }
  }

  /**
   * Analyze audio and generate description
   */
  async analyzeAudio(audioBase64: string): Promise<string> {
    try {
      const prompt = `Analyze this audio file and provide a detailed description of:
        1. Musical characteristics (tempo, key, mood)
        2. Instrumentation and sound design
        3. Genre and style
        4. Production quality and mixing
        
        Provide a concise but comprehensive analysis.`

      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro-vision' })

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: 'audio/wav',
            data: audioBase64,
          },
        },
      ])

      const response = result.response
      return response.text()
    } catch (error) {
      console.error('Error analyzing audio:', error)
      throw new Error('Failed to analyze audio with Gemini')
    }
  }

  /**
   * Generate music prompt based on reference audio
   */
  async generateMusicPrompt(audioBase64: string, userIntent: string): Promise<string> {
    try {
      const prompt = `Based on this audio sample and the user's intent: "${userIntent}", 
        generate a detailed music generation prompt that captures:
        1. The style and mood of the reference audio
        2. The user's desired modifications or variations
        3. Specific instrumentation and production notes
        
        Return only the prompt text, optimized for music generation AI.`

      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro-vision' })

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: 'audio/wav',
            data: audioBase64,
          },
        },
      ])

      const response = result.response
      return response.text()
    } catch (error) {
      console.error('Error generating music prompt:', error)
      throw new Error('Failed to generate music prompt with Gemini')
    }
  }

  /**
   * Generate audio using text-to-music capabilities
   * Note: This is a placeholder for future Gemini audio generation features
   */
  async generateAudio(params: GenerateAudioParams): Promise<{ audioUrl: string; metadata: any }> {
    // This is a placeholder - actual implementation will depend on Google's audio generation API
    console.warn('Audio generation not yet implemented in Gemini API')
    
    // For now, return mock data
    return {
      audioUrl: '',
      metadata: {
        prompt: params.prompt,
        duration: params.duration || 30,
        status: 'pending',
        message: 'Audio generation feature coming soon',
      },
    }
  }

  /**
   * Transcribe audio to text
   */
  async transcribeAudio(audioBase64: string): Promise<string> {
    try {
      const prompt = 'Transcribe this audio file to text. Return only the transcription.'

      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro-vision' })

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: 'audio/wav',
            data: audioBase64,
          },
        },
      ])

      const response = result.response
      return response.text()
    } catch (error) {
      console.error('Error transcribing audio:', error)
      throw new Error('Failed to transcribe audio with Gemini')
    }
  }
}

// Singleton instance
let geminiService: GoogleGeminiService | null = null

export function getGeminiService(): GoogleGeminiService {
  if (!geminiService) {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GOOGLE_GEMINI_API_KEY environment variable is not set')
    }
    geminiService = new GoogleGeminiService({ apiKey })
  }
  return geminiService
}
