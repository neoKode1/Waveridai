import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

// Available Gemini models
export const GEMINI_MODELS = {
  PRO: 'gemini-pro',
  PRO_VISION: 'gemini-pro-vision',
  ULTRA: 'gemini-ultra',
} as const

export interface GeminiMessage {
  role: 'user' | 'model'
  parts: { text: string }[]
}

export interface GeminiChatHistory {
  history: GeminiMessage[]
}

export interface GeminiGenerateOptions {
  temperature?: number
  topK?: number
  topP?: number
  maxOutputTokens?: number
}

/**
 * Generate text using Gemini
 */
export async function generateText(
  prompt: string,
  options: GeminiGenerateOptions = {}
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODELS.PRO })

    const generationConfig = {
      temperature: options.temperature ?? 0.7,
      topK: options.topK ?? 40,
      topP: options.topP ?? 0.95,
      maxOutputTokens: options.maxOutputTokens ?? 1024,
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    })

    const response = result.response
    return response.text()
  } catch (error) {
    console.error('Error generating text with Gemini:', error)
    throw error
  }
}

/**
 * Start a chat session with Gemini
 */
export async function startChat(
  history: GeminiMessage[] = [],
  options: GeminiGenerateOptions = {}
) {
  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODELS.PRO })

    const generationConfig = {
      temperature: options.temperature ?? 0.7,
      topK: options.topK ?? 40,
      topP: options.topP ?? 0.95,
      maxOutputTokens: options.maxOutputTokens ?? 1024,
    }

    const chat = model.startChat({
      history,
      generationConfig,
    })

    return chat
  } catch (error) {
    console.error('Error starting chat with Gemini:', error)
    throw error
  }
}

/**
 * Send a message in an existing chat
 */
export async function sendMessage(
  chat: any,
  message: string
): Promise<string> {
  try {
    const result = await chat.sendMessage(message)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error('Error sending message to Gemini:', error)
    throw error
  }
}

/**
 * Generate music prompt suggestions using Gemini
 */
export async function generateMusicPromptSuggestions(
  userInput: string,
  context?: string
): Promise<string[]> {
  try {
    const prompt = `You are a music AI assistant helping users create detailed music prompts for AI music generation.

User's initial idea: "${userInput}"
${context ? `\nAdditional context: ${context}` : ''}

Generate 3 detailed music prompts based on the user's idea. Each prompt should:
1. Include specific genre, mood, and instrumentation
2. Describe tempo and rhythm characteristics
3. Mention any special effects or production style
4. Be concise but descriptive (2-3 sentences)

Return the prompts as a numbered list (1., 2., 3.).`

    const response = await generateText(prompt, {
      temperature: 0.8,
      maxOutputTokens: 512,
    })

    // Parse the response into individual prompts
    const suggestions = response
      .split(/\n\d+\.\s*/)
      .filter(s => s.trim().length > 0)
      .slice(0, 3)

    return suggestions
  } catch (error) {
    console.error('Error generating music prompt suggestions:', error)
    throw error
  }
}

/**
 * Analyze audio characteristics and suggest improvements
 */
export async function analyzeAudioCharacteristics(
  audioDescription: string
): Promise<{
  analysis: string
  suggestions: string[]
}> {
  try {
    const prompt = `You are an audio engineering AI assistant. Analyze the following audio description and provide:
1. A brief analysis of the audio characteristics
2. 3 specific suggestions for improvement or enhancement

Audio description: "${audioDescription}"

Format your response as:
Analysis: [your analysis]
Suggestions:
1. [suggestion 1]
2. [suggestion 2]
3. [suggestion 3]`

    const response = await generateText(prompt, {
      temperature: 0.6,
      maxOutputTokens: 512,
    })

    // Parse the response
    const lines = response.split('\n')
    const analysisLine = lines.find(line => line.startsWith('Analysis:'))
    const analysis = analysisLine ? analysisLine.replace('Analysis:', '').trim() : ''

    const suggestions = lines
      .filter(line => /^\d+\./.test(line.trim()))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())

    return { analysis, suggestions }
  } catch (error) {
    console.error('Error analyzing audio characteristics:', error)
    throw error
  }
}

/**
 * Generate MIDI-to-audio synthesis parameters based on user intent
 */
export async function generateSynthesisParameters(
  sourceDescription: string,
  targetDescription: string
): Promise<{
  parameters: Record<string, any>
  explanation: string
}> {
  try {
    const prompt = `You are an audio synthesis AI assistant. Based on the following descriptions, suggest optimal synthesis parameters:

Source audio: "${sourceDescription}"
Target sound: "${targetDescription}"

Provide synthesis parameters in this JSON format:
{
  "parameters": {
    "timbre_transfer_strength": [0-1],
    "pitch_shift": [semitones],
    "reverb_amount": [0-1],
    "chorus_depth": [0-1],
    "filter_cutoff": [Hz],
    "envelope_attack": [seconds],
    "envelope_release": [seconds]
  },
  "explanation": "Brief explanation of parameter choices"
}`

    const response = await generateText(prompt, {
      temperature: 0.5,
      maxOutputTokens: 512,
    })

    // Try to parse JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return parsed
    }

    // Fallback to default parameters
    return {
      parameters: {
        timbre_transfer_strength: 0.7,
        pitch_shift: 0,
        reverb_amount: 0.3,
        chorus_depth: 0.2,
        filter_cutoff: 5000,
        envelope_attack: 0.01,
        envelope_release: 0.3,
      },
      explanation: 'Using default parameters',
    }
  } catch (error) {
    console.error('Error generating synthesis parameters:', error)
    throw error
  }
}

/**
 * Convert natural language to MIDI processing instructions
 */
export async function parseMidiInstructions(
  instruction: string
): Promise<{
  operations: string[]
  parameters: Record<string, any>
}> {
  try {
    const prompt = `You are a MIDI processing AI assistant. Parse the following natural language instruction into specific MIDI operations:

Instruction: "${instruction}"

Provide your response in this JSON format:
{
  "operations": ["operation1", "operation2", ...],
  "parameters": {
    "operation1_param1": value,
    "operation1_param2": value,
    ...
  }
}

Available operations: transpose, quantize, velocity_scale, time_stretch, humanize, arpeggiator`

    const response = await generateText(prompt, {
      temperature: 0.4,
      maxOutputTokens: 512,
    })

    // Try to parse JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return parsed
    }

    // Fallback
    return {
      operations: [],
      parameters: {},
    }
  } catch (error) {
    console.error('Error parsing MIDI instructions:', error)
    throw error
  }
}

/**
 * Generate audio effect chain recommendations
 */
export async function recommendEffectChain(
  sourceType: string,
  desiredOutcome: string
): Promise<{
  effects: string[]
  settings: Record<string, any>
  rationale: string
}> {
  try {
    const prompt = `You are an audio effects AI assistant. Recommend an effect chain for the following:

Source: "${sourceType}"
Desired outcome: "${desiredOutcome}"

Provide your response in this JSON format:
{
  "effects": ["effect1", "effect2", ...],
  "settings": {
    "effect1": { "param1": value, "param2": value },
    "effect2": { "param1": value, "param2": value }
  },
  "rationale": "Explanation of why this chain works"
}

Available effects: eq, compressor, reverb, delay, chorus, distortion, limiter, filter`

    const response = await generateText(prompt, {
      temperature: 0.6,
      maxOutputTokens: 512,
    })

    // Try to parse JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return parsed
    }

    // Fallback
    return {
      effects: ['eq', 'compressor', 'reverb'],
      settings: {
        eq: { low: 0, mid: 0, high: 0 },
        compressor: { threshold: -20, ratio: 4 },
        reverb: { size: 0.5, decay: 2.0 },
      },
      rationale: 'Default effect chain',
    }
  } catch (error) {
    console.error('Error recommending effect chain:', error)
    throw error
  }
}
