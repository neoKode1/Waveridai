import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY environment variable is required')
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

export interface PromptEnhancementResult {
  enhancedPrompt: string
  suggestions: string[]
  metadata: Record<string, unknown>
}

export interface MusicGenerationParams {
  prompt: string
  duration?: number
  temperature?: number
  audioFormat?: string
}

export interface GeneratedMusic {
  audioUrl: string
  metadata: Record<string, unknown>
}

class GoogleGeminiService {
  private model

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' })
  }

  async enhancePrompt(userPrompt: string): Promise<PromptEnhancementResult> {
    try {
      const enhancementPrompt = `You are an expert music production assistant. Enhance the following music generation prompt to be more detailed and effective:

User Prompt: "${userPrompt}"

Provide:
1. An enhanced version of the prompt with more musical details
2. Three specific suggestions for improving the prompt
3. Technical metadata about the musical characteristics

Format your response as JSON with keys: enhancedPrompt, suggestions (array), metadata (object).`

      const result = await this.model.generateContent(enhancementPrompt)
      const response = await result.response
      const text = response.text()
      
      // Try to parse JSON response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as PromptEnhancementResult
          return parsed
        }
      } catch {
        // If JSON parsing fails, create structured response from text
      }

      // Fallback: return basic enhancement
      return {
        enhancedPrompt: text.split('\n')[0] || userPrompt,
        suggestions: [
          'Add more specific instrumentation details',
          'Include tempo and rhythm information',
          'Specify mood and emotional qualities'
        ],
        metadata: {
          genre: 'unspecified',
          mood: 'neutral',
          complexity: 'medium'
        }
      }
    } catch (error) {
      console.error('Error enhancing prompt:', error)
      throw new Error('Failed to enhance prompt with Gemini AI')
    }
  }

  async analyzeAudioContext(audioFile: File): Promise<Record<string, unknown>> {
    try {
      // For now, return basic metadata
      // In future, could use Gemini's multimodal capabilities
      return {
        fileName: audioFile.name,
        fileSize: audioFile.size,
        fileType: audioFile.type,
        analyzed: true
      }
    } catch (error) {
      console.error('Error analyzing audio context:', error)
      throw new Error('Failed to analyze audio context')
    }
  }
}

// Export singleton instance
export const googleGeminiService = new GoogleGeminiService()

// Also export the class for testing
export { GoogleGeminiService }
