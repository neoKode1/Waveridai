import { GoogleGenerativeAI } from '@google/generative-ai'

interface AudioAnalysisResult {
  tempo?: number
  key?: string
  mood?: string
  genre?: string
  instruments?: string[]
  structure?: string
  energy?: number
  danceability?: number
  valence?: number
}

interface MusicGenerationParams {
  prompt: string
  duration?: number
  style?: string
  referenceAudio?: string
  temperature?: number
}

interface GeneratedMusic {
  audioUrl: string
  metadata?: {
    title?: string
    description?: string
    tags?: string[]
  }
}

export class GoogleGeminiService {
  private client: GoogleGenerativeAI
  private model: any

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey)
    this.model = this.client.getGenerativeModel({ model: 'gemini-pro' })
  }

  /**
   * Analyze audio characteristics using Gemini
   */
  async analyzeAudio(audioBuffer: ArrayBuffer): Promise<AudioAnalysisResult> {
    try {
      // Convert audio buffer to base64
      const base64Audio = this.arrayBufferToBase64(audioBuffer)
      
      const prompt = `Analyze this audio file and provide a detailed breakdown of its musical characteristics including:
      - Tempo (BPM)
      - Musical key
      - Mood and emotional tone
      - Genre
      - Instruments present
      - Song structure
      - Energy level (0-1)
      - Danceability (0-1)
      - Valence/positivity (0-1)
      
      Return the analysis as a JSON object.`

      const result = await this.model.generateContent([
        {
          inlineData: {
            mimeType: 'audio/wav',
            data: base64Audio,
          },
        },
        { text: prompt },
      ])

      const response = await result.response
      const text = response.text()
      
      // Parse JSON response
      const analysis = JSON.parse(text)
      return analysis
    } catch (error) {
      console.error('Error analyzing audio:', error)
      throw new Error('Failed to analyze audio')
    }
  }

  /**
   * Generate music description from audio analysis
   */
  async generateMusicDescription(analysis: AudioAnalysisResult): Promise<string> {
    try {
      const prompt = `Based on this musical analysis:
      ${JSON.stringify(analysis, null, 2)}
      
      Generate a natural language description of the music that captures its essence,
      style, and emotional qualities. Make it engaging and descriptive.`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Error generating description:', error)
      throw new Error('Failed to generate music description')
    }
  }

  /**
   * Generate optimal prompt for music generation
   */
  async generateMusicPrompt(
    userInput: string,
    referenceAnalysis?: AudioAnalysisResult
  ): Promise<string> {
    try {
      let prompt = `You are a music production expert. Create a detailed, technical prompt for AI music generation based on:
      
      User Request: ${userInput}`

      if (referenceAnalysis) {
        prompt += `\n\nReference Audio Analysis:\n${JSON.stringify(referenceAnalysis, null, 2)}`
      }

      prompt += `\n\nGenerate a comprehensive prompt that includes:
      - Specific instruments and their roles
      - Tempo and rhythm details
      - Harmonic and melodic characteristics
      - Production style and mixing approach
      - Mood and atmosphere
      - Song structure
      
      Make it detailed enough for high-quality AI music generation.`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Error generating prompt:', error)
      throw new Error('Failed to generate music prompt')
    }
  }

  /**
   * Analyze and improve user's music generation prompt
   */
  async improvePrompt(originalPrompt: string): Promise<string> {
    try {
      const prompt = `Improve this music generation prompt to be more specific and detailed:
      
      Original: ${originalPrompt}
      
      Enhanced prompt should include:
      - Specific instrument choices and their roles
      - Tempo and time signature
      - Key and harmonic progression ideas
      - Production style and effects
      - Emotional tone and dynamics
      - Any relevant cultural or stylistic references
      
      Return only the improved prompt, without explanation.`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Error improving prompt:', error)
      return originalPrompt // Return original if improvement fails
    }
  }

  /**
   * Generate metadata for created music
   */
  async generateMetadata(
    audioAnalysis: AudioAnalysisResult,
    userPrompt: string
  ): Promise<{ title: string; description: string; tags: string[] }> {
    try {
      const prompt = `Generate engaging metadata for a music track:
      
      Analysis: ${JSON.stringify(audioAnalysis, null, 2)}
      Creation Prompt: ${userPrompt}
      
      Provide:
      1. A catchy title (max 60 characters)
      2. An engaging description (max 200 characters)
      3. 5-10 relevant tags for categorization
      
      Return as JSON with keys: title, description, tags (array)`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      const metadata = JSON.parse(text)
      return metadata
    } catch (error) {
      console.error('Error generating metadata:', error)
      return {
        title: 'Untitled Track',
        description: 'AI-generated music',
        tags: ['ai-music', 'generated'],
      }
    }
  }

  /**
   * Get suggestions for music variations
   */
  async suggestVariations(
    originalAnalysis: AudioAnalysisResult,
    numberOfSuggestions: number = 3
  ): Promise<string[]> {
    try {
      const prompt = `Based on this musical analysis:
      ${JSON.stringify(originalAnalysis, null, 2)}
      
      Suggest ${numberOfSuggestions} creative variations or remixes. Each suggestion should:
      - Maintain some connection to the original
      - Explore different genres, moods, or arrangements
      - Be specific enough for music generation
      
      Return as a JSON array of strings.`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      const suggestions = JSON.parse(text)
      return suggestions
    } catch (error) {
      console.error('Error generating suggestions:', error)
      return []
    }
  }

  /**
   * Convert ArrayBuffer to base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  /**
   * Generate a complete music production workflow suggestion
   */
  async generateWorkflowSuggestion(
    userGoal: string,
    availableTools: string[]
  ): Promise<{
    steps: string[]
    estimatedTime: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    tips: string[]
  }> {
    try {
      const prompt = `Create a detailed workflow for this music production goal:
      
      Goal: ${userGoal}
      Available Tools: ${availableTools.join(', ')}
      
      Provide:
      1. Step-by-step workflow (array of strings)
      2. Estimated time to complete
      3. Difficulty level (beginner/intermediate/advanced)
      4. Pro tips (array of strings)
      
      Return as JSON with keys: steps, estimatedTime, difficulty, tips`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      const workflow = JSON.parse(text)
      return workflow
    } catch (error) {
      console.error('Error generating workflow:', error)
      return {
        steps: ['Upload your audio', 'Process with AI', 'Download result'],
        estimatedTime: '5-10 minutes',
        difficulty: 'beginner',
        tips: ['Start with small audio files', 'Experiment with different settings'],
      }
    }
  }

  /**
   * Chat interface for music production assistance
   */
  async chat(userMessage: string, conversationHistory: Array<{ role: string; content: string }> = []): Promise<string> {
    try {
      const systemPrompt = `You are an expert music production assistant specializing in AI-powered audio synthesis.
      Help users with:
      - Understanding polyphonic audio synthesis
      - Choosing the right workflow (Precise Synthesis vs AI Generation)
      - Optimizing their prompts and parameters
      - Troubleshooting audio processing issues
      - Creative suggestions and best practices
      
      Be concise, technical when needed, but friendly and encouraging.`

      const fullPrompt = [
        systemPrompt,
        ...conversationHistory.map(msg => `${msg.role}: ${msg.content}`),
        `user: ${userMessage}`,
        'assistant:'
      ].join('\n\n')

      const result = await this.model.generateContent(fullPrompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Error in chat:', error)
      throw new Error('Failed to process chat message')
    }
  }
}

// Export singleton instance
let geminiService: GoogleGeminiService | null = null

export function getGeminiService(): GoogleGeminiService {
  if (!geminiService) {
    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY environment variable is not set')
    }
    geminiService = new GoogleGeminiService(apiKey)
  }
  return geminiService
}
