import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { ProcessingResult, AudioFile } from '@/types/workflow'

// Initialize the Gemini API client
const apiKey = process.env.GOOGLE_GEMINI_API_KEY || ''
if (!apiKey) {
  console.warn('GOOGLE_GEMINI_API_KEY is not set. Gemini features will be disabled.')
}

const genAI = new GoogleGenerativeAI(apiKey)

/**
 * Gemini Service for AI-powered audio analysis and generation
 */
export class GeminiService {
  private model: GenerativeModel
  private visionModel: GenerativeModel

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
    this.visionModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
  }

  /**
   * Analyze audio characteristics using Gemini
   */
  async analyzeAudio(audioFile: AudioFile): Promise<{
    genre: string
    mood: string
    instruments: string[]
    tempo: number
    key: string
    description: string
  }> {
    try {
      const prompt = `
Analyze this audio file and provide:
1. Primary genre
2. Overall mood/emotion
3. List of instruments detected
4. Estimated tempo (BPM)
5. Musical key
6. Brief description of the audio

Audio file: ${audioFile.name}
Duration: ${audioFile.duration} seconds

Provide the response in JSON format.
`

      const result = await this.model.generateContent(prompt)
      const response = result.response
      const text = response.text()

      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0])
        return {
          genre: analysis.genre || 'Unknown',
          mood: analysis.mood || 'Neutral',
          instruments: analysis.instruments || [],
          tempo: analysis.tempo || 120,
          key: analysis.key || 'C Major',
          description: analysis.description || 'No description available',
        }
      }

      throw new Error('Failed to parse audio analysis response')
    } catch (error) {
      console.error('Error analyzing audio:', error)
      throw new Error('Failed to analyze audio with Gemini')
    }
  }

  /**
   * Generate music description from prompt
   */
  async generateMusicDescription(prompt: string, referenceAudio?: AudioFile): Promise<string> {
    try {
      let fullPrompt = `
You are a music generation AI assistant. Based on the following prompt, generate a detailed music description that can be used to create audio:

User Prompt: ${prompt}
`

      if (referenceAudio) {
        fullPrompt += `
Reference Audio: ${referenceAudio.name}
Duration: ${referenceAudio.duration} seconds
Use the style and characteristics of this reference audio as inspiration.
`
      }

      fullPrompt += `
Provide a detailed description including:
- Musical style and genre
- Tempo and rhythm
- Instrumentation
- Mood and atmosphere
- Structure and progression

Make it specific and actionable for music generation.
`

      const result = await this.model.generateContent(fullPrompt)
      const response = result.response
      return response.text()
    } catch (error) {
      console.error('Error generating music description:', error)
      throw new Error('Failed to generate music description with Gemini')
    }
  }

  /**
   * Generate MIDI data from text description using Gemini
   */
  async generateMidiFromText(description: string, duration: number = 30): Promise<{
    tracks: Array<{
      name: string
      instrument: string
      notes: Array<{
        pitch: number
        velocity: number
        startTime: number
        duration: number
      }>
    }>
  }> {
    try {
      const prompt = `
Generate MIDI data for the following music description:

${description}

Duration: ${duration} seconds

Provide the output as JSON with the following structure:
{
  "tracks": [
    {
      "name": "Track name",
      "instrument": "Instrument name",
      "notes": [
        {
          "pitch": 60,
          "velocity": 80,
          "startTime": 0.0,
          "duration": 0.5
        }
      ]
    }
  ]
}

Use standard MIDI pitch numbers (middle C = 60).
Velocity should be 0-127.
Times should be in seconds.
`

      const result = await this.model.generateContent(prompt)
      const response = result.response
      const text = response.text()

      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const midiData = JSON.parse(jsonMatch[0])
        return midiData
      }

      throw new Error('Failed to parse MIDI data from response')
    } catch (error) {
      console.error('Error generating MIDI from text:', error)
      throw new Error('Failed to generate MIDI data with Gemini')
    }
  }

  /**
   * Enhance audio prompt with AI suggestions
   */
  async enhancePrompt(prompt: string): Promise<string> {
    try {
      const enhancePrompt = `
Enhance the following music generation prompt with more detail and specificity:

Original: ${prompt}

Provide an enhanced version that includes:
- More specific genre and style details
- Instrumentation suggestions
- Mood and atmosphere descriptors
- Tempo and rhythm suggestions
- Any other relevant musical details

Keep it concise but descriptive (2-3 sentences).
`

      const result = await this.model.generateContent(enhancePrompt)
      const response = result.response
      return response.text().trim()
    } catch (error) {
      console.error('Error enhancing prompt:', error)
      return prompt // Return original prompt on error
    }
  }

  /**
   * Process audio with Gemini AI (multimodal)
   */
  async processAudioWithAI(
    audioFile: AudioFile,
    task: 'analyze' | 'transcribe' | 'describe'
  ): Promise<ProcessingResult> {
    try {
      // In a real implementation, you would:
      // 1. Convert audio to a format Gemini can process
      // 2. Send it to Gemini's multimodal API
      // 3. Process the response

      const taskPrompts = {
        analyze: 'Analyze this audio file and provide detailed information about its musical characteristics.',
        transcribe: 'Transcribe any speech or vocals in this audio file.',
        describe: 'Describe the audio content in detail, including instruments, mood, and style.',
      }

      const prompt = taskPrompts[task]

      // For now, we'll use a text-only approach
      const result = await this.model.generateContent([
        {
          text: `${prompt}\n\nAudio file: ${audioFile.name}\nDuration: ${audioFile.duration} seconds`,
        },
      ])

      const response = result.response
      const text = response.text()

      return {
        success: true,
        metadata: {
          task,
          result: text,
          audioFile: audioFile.name,
        },
      }
    } catch (error) {
      console.error('Error processing audio with AI:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Generate audio variations based on a reference
   */
  async generateVariations(
    referenceAudio: AudioFile,
    variationType: 'style' | 'mood' | 'tempo' | 'instrumentation',
    count: number = 3
  ): Promise<string[]> {
    try {
      const prompt = `
Generate ${count} variations of music based on this reference:

Reference: ${referenceAudio.name}
Duration: ${referenceAudio.duration} seconds
Variation type: ${variationType}

For each variation, provide a detailed description that differs in ${variationType} while maintaining some connection to the original.

Format the response as a numbered list.
`

      const result = await this.model.generateContent(prompt)
      const response = result.response
      const text = response.text()

      // Split into variations
      const variations = text
        .split(/\d+\.\s/)
        .slice(1)
        .map((v) => v.trim())
        .filter((v) => v.length > 0)

      return variations.slice(0, count)
    } catch (error) {
      console.error('Error generating variations:', error)
      throw new Error('Failed to generate variations with Gemini')
    }
  }

  /**
   * Chat with Gemini about music and audio
   */
  async chat(message: string, context?: string): Promise<string> {
    try {
      const prompt = context
        ? `Context: ${context}\n\nUser: ${message}\n\nAssistant:`
        : `User: ${message}\n\nAssistant:`

      const result = await this.model.generateContent(prompt)
      const response = result.response
      return response.text()
    } catch (error) {
      console.error('Error in chat:', error)
      throw new Error('Failed to process chat message')
    }
  }
}

// Export a singleton instance
export const geminiService = new GeminiService()
