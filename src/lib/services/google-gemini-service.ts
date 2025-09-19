/**
 * Google Gemini AI Service
 * Handles audio analysis and prompt generation using Google's Gemini API
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiAudioAnalysisRequest {
  audioFile: File | Blob;
  prompt?: string;
}

export interface GeminiAudioAnalysisResponse {
  instruments: string[];
  genre: string;
  mood: string;
  tempo: number;
  key: string;
  style: string;
  description: string;
  suggestedPrompt: string;
  confidence: number;
}

export interface LyriaPromptRequest {
  sourceAnalysis: GeminiAudioAnalysisResponse;
  referenceAnalysis: GeminiAudioAnalysisResponse;
  userPrompt?: string;
}

export interface LyriaPromptResponse {
  prompt: string;
  confidence: number;
  reasoning: string;
  suggestedParameters: {
    duration?: number;
    temperature?: number;
    seed?: number;
  };
}

export class GoogleGeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      console.warn('Google AI API key not found. Gemini service will use mock responses.');
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.isInitialized = true;
      console.log('✅ Google Gemini AI service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Google Gemini AI service:', error);
    }
  }

  /**
   * Analyze audio file using Google Gemini
   */
  async analyzeAudio(request: GeminiAudioAnalysisRequest): Promise<GeminiAudioAnalysisResponse> {
    if (!this.isInitialized || !this.genAI) {
      console.log('🎵 GoogleGeminiService: Using mock response (API not initialized)');
      return this.getMockResponse(request);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      
      // Convert audio file to base64
      const audioBase64 = await this.fileToBase64(request.audioFile);
      
      const analysisPrompt = request.prompt || `
        Analyze this audio file and provide detailed musical information. Please identify:
        1. Instruments present in the audio
        2. Musical genre/style
        3. Mood and emotional tone
        4. Tempo (BPM) if detectable
        5. Musical key if identifiable
        6. Overall musical style
        7. A detailed description of the musical content
        8. A suggested prompt for AI music generation that captures the essence of this audio

        Please respond in JSON format with the following structure:
        {
          "instruments": ["list", "of", "instruments"],
          "genre": "genre name",
          "mood": "mood description",
          "tempo": 120,
          "key": "C major",
          "style": "style description",
          "description": "detailed description of the audio",
          "suggestedPrompt": "prompt for AI music generation",
          "confidence": 0.9
        }
      `;

      const result = await model.generateContent([
        {
          text: analysisPrompt
        },
        {
          inlineData: {
            data: audioBase64,
            mimeType: request.audioFile.type || 'audio/wav'
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          console.log('🎵 GoogleGeminiService: Audio analysis completed successfully');
          return analysis;
        }
      } catch {
        console.warn('🎵 GoogleGeminiService: Failed to parse JSON, using text extraction');
      }

      // Fallback: extract information from text response
      return this.extractInfoFromText(text, request);

    } catch (error) {
      console.error('🎵 GoogleGeminiService: Audio analysis failed:', error);
      return this.getMockResponse(request);
    }
  }

  /**
   * Convert file to base64 for API transmission
   */
  private async fileToBase64(file: File | Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix to get just the base64 data
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Extract information from text response when JSON parsing fails
   */
  private extractInfoFromText(text: string, _request: GeminiAudioAnalysisRequest): GeminiAudioAnalysisResponse {
    // Simple text extraction logic
    const instruments = this.extractList(text, ['instruments', 'instrumentation']);
    const genre = this.extractValue(text, ['genre', 'style', 'type']) || 'Unknown';
    const mood = this.extractValue(text, ['mood', 'emotion', 'feeling']) || 'Neutral';
    const tempo = this.extractNumber(text, ['tempo', 'bpm', 'beats per minute']) || 120;
    const key = this.extractValue(text, ['key', 'tonality']) || 'Unknown';
    const style = this.extractValue(text, ['style', 'character']) || genre;
    const description = this.extractDescription(text);
    const suggestedPrompt = this.extractPrompt(text);

    return {
      instruments,
      genre,
      mood,
      tempo,
      key,
      style,
      description,
      suggestedPrompt,
      confidence: 0.7 // Lower confidence for text extraction
    };
  }

  private extractList(text: string, keywords: string[]): string[] {
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}[:\\s]*([^\\n]+)`, 'i');
      const match = text.match(regex);
      if (match) {
        const listText = match[1];
        // Split by common delimiters and clean up
        return listText.split(/[,;]/)
          .map(item => item.trim())
          .filter(item => item.length > 0)
          .slice(0, 5); // Limit to 5 instruments
      }
    }
    return ['Unknown'];
  }

  private extractValue(text: string, keywords: string[]): string | null {
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}[:\\s]*([^\\n,]+)`, 'i');
      const match = text.match(regex);
      if (match) {
        return match[1].trim();
      }
    }
    return null;
  }

  private extractNumber(text: string, keywords: string[]): number | null {
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}[:\\s]*(\\d+)`, 'i');
      const match = text.match(regex);
      if (match) {
        return parseInt(match[1], 10);
      }
    }
    return null;
  }

  private extractDescription(text: string): string {
    // Look for description or summary
    const descriptionMatch = text.match(/(?:description|summary)[:\\s]*([^\\n]+)/i);
    if (descriptionMatch) {
      return descriptionMatch[1].trim();
    }
    
    // Fallback: take first substantial sentence
    const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 20);
    return sentences[0]?.trim() || 'Audio analysis completed';
  }

  private extractPrompt(text: string): string {
    const promptMatch = text.match(/(?:prompt|suggestion)[:\\s]*([^\\n]+)/i);
    if (promptMatch) {
      return promptMatch[1].trim();
    }
    
    // Generate a basic prompt from extracted info
    return 'Generate music similar to the analyzed audio with similar characteristics';
  }

  /**
   * Get mock response for testing/fallback
   */
  private getMockResponse(_request: GeminiAudioAnalysisRequest): GeminiAudioAnalysisResponse {
    const mockResponses = [
      {
        instruments: ['electric guitar', 'bass guitar', 'drums', 'synthesizer'],
        genre: 'electronic rock',
        mood: 'energetic',
        tempo: 128,
        key: 'G minor',
        style: 'modern electronic',
        description: 'An energetic electronic rock track with driving guitar riffs and electronic elements',
        suggestedPrompt: 'Generate an energetic electronic rock track with electric guitar riffs, bass guitar, drums, and synthesizer elements at 128 BPM in G minor',
        confidence: 0.8
      },
      {
        instruments: ['piano', 'strings', 'acoustic guitar'],
        genre: 'ambient',
        mood: 'calm',
        tempo: 90,
        key: 'C major',
        style: 'cinematic ambient',
        description: 'A peaceful ambient piece with piano melodies and string arrangements',
        suggestedPrompt: 'Create a calm ambient track featuring piano, strings, and acoustic guitar at 90 BPM in C major with cinematic qualities',
        confidence: 0.9
      },
      {
        instruments: ['synthesizer', 'drum machine', 'bass'],
        genre: 'electronic dance',
        mood: 'upbeat',
        tempo: 140,
        key: 'F minor',
        style: 'EDM',
        description: 'An upbeat electronic dance track with synthesizer leads and driving rhythm',
        suggestedPrompt: 'Generate an upbeat EDM track with synthesizer leads, drum machine, and bass at 140 BPM in F minor',
        confidence: 0.85
      }
    ];

    // Return a random mock response
    const randomIndex = Math.floor(Math.random() * mockResponses.length);
    console.log('🎵 GoogleGeminiService: Using mock response', { index: randomIndex });
    return mockResponses[randomIndex];
  }

  /**
   * Generate intelligent Lyria prompt from audio analysis
   */
  async generateLyriaPrompt(request: LyriaPromptRequest): Promise<LyriaPromptResponse> {
    if (!this.isInitialized || !this.genAI) {
      console.log('🎵 GoogleGeminiService: Using mock Lyria prompt (API not initialized)');
      return this.getMockLyriaPrompt(request);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      
      const promptText = `
        You are an expert music producer and AI prompt engineer. I have analyzed two audio files:

        SOURCE AUDIO ANALYSIS:
        - Genre: ${request.sourceAnalysis.genre}
        - Instruments: ${request.sourceAnalysis.instruments.join(', ')}
        - Mood: ${request.sourceAnalysis.mood}
        - Tempo: ${request.sourceAnalysis.tempo} BPM
        - Key: ${request.sourceAnalysis.key}
        - Style: ${request.sourceAnalysis.style}
        - Description: ${request.sourceAnalysis.description || 'No description available'}

        REFERENCE AUDIO ANALYSIS:
        - Genre: ${request.referenceAnalysis.genre}
        - Instruments: ${request.referenceAnalysis.instruments.join(', ')}
        - Mood: ${request.referenceAnalysis.mood}
        - Tempo: ${request.referenceAnalysis.tempo} BPM
        - Key: ${request.referenceAnalysis.key}
        - Style: ${request.referenceAnalysis.style}
        - Description: ${request.referenceAnalysis.description || 'No description available'}

        ${request.userPrompt ? `USER REQUEST: ${request.userPrompt}` : ''}

        Please generate a detailed prompt for Google's Lyria AI music generation model that will transform the source audio to match the reference audio style. The prompt should:

        1. Preserve the melody and structure of the source audio
        2. Transform the instrumentation, style, and mood to match the reference
        3. Maintain musical coherence and quality
        4. Be specific about tempo, key, and stylistic elements
        5. Use professional music terminology
        6. IMPORTANT: Do NOT include any artist names, song titles, or copyrighted material
        7. Focus on musical characteristics, instruments, and stylistic elements only

        Respond in JSON format with this structure:
        {
          "prompt": "detailed prompt for Lyria",
          "confidence": 0.95,
          "reasoning": "explanation of the transformation approach",
          "suggestedParameters": {
            "duration": 10,
            "temperature": 0.8,
            "seed": 42
          }
        }
      `;

      const result = await model.generateContent(promptText);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const promptData = JSON.parse(jsonMatch[0]);
          console.log('🎵 GoogleGeminiService: Lyria prompt generated successfully');
          return promptData;
        }
      } catch {
        console.warn('🎵 GoogleGeminiService: Failed to parse JSON, using text extraction');
      }

      // Fallback: extract information from text response
      return this.extractLyriaPromptFromText(text, request);

    } catch (error) {
      console.error('🎵 GoogleGeminiService: Lyria prompt generation failed:', error);
      return this.getMockLyriaPrompt(request);
    }
  }

  /**
   * Extract Lyria prompt from text response when JSON parsing fails
   */
  private extractLyriaPromptFromText(text: string, request: LyriaPromptRequest): LyriaPromptResponse {
    // Look for prompt in the text
    const promptMatch = text.match(/(?:prompt|generate)[:"]*\s*([^"]+)/i);
    const prompt = promptMatch ? promptMatch[1].trim() : this.generateFallbackPrompt(request);

    // Look for reasoning
    const reasoningMatch = text.match(/(?:reasoning|explanation)[:"]*\s*([^"]+)/i);
    const reasoning = reasoningMatch ? reasoningMatch[1].trim() : 'Generated prompt based on audio analysis';

    return {
      prompt,
      confidence: 0.7,
      reasoning,
      suggestedParameters: {
        duration: 10,
        temperature: 0.8,
        seed: Math.floor(Math.random() * 1000)
      }
    };
  }

  /**
   * Generate fallback prompt when extraction fails
   */
  private generateFallbackPrompt(request: LyriaPromptRequest): string {
    const source = request.sourceAnalysis;
    const reference = request.referenceAnalysis;
    
    return `Create a ${reference.genre} musical piece using ${reference.instruments.join(', ')} at ${reference.tempo} BPM in ${reference.key} with ${reference.mood} mood and ${reference.style} characteristics. Focus on harmonic progression, clear instrument separation, and professional audio quality.`;
  }

  /**
   * Get mock Lyria prompt for testing/fallback
   */
  private getMockLyriaPrompt(request: LyriaPromptRequest): LyriaPromptResponse {
    const source = request.sourceAnalysis;
    const reference = request.referenceAnalysis;
    
    const mockPrompts = [
      `Create a ${reference.genre} musical piece using ${reference.instruments.join(', ')} at ${reference.tempo} BPM in ${reference.key}. The composition should have a ${reference.mood} mood with ${reference.style} characteristics. Focus on harmonic progression, clear instrument separation, and professional audio quality.`,
      `Generate a ${reference.genre} arrangement with ${reference.instruments.join(', ')} featuring ${reference.mood} emotional tone at ${reference.tempo} BPM in ${reference.key}. Maintain musical coherence with ${reference.style} production style, dynamic range, and studio-quality sound.`,
      `Produce a ${reference.genre} track using ${reference.instruments.join(', ')} with ${reference.mood} mood at ${reference.tempo} BPM in ${reference.key}. Include ${reference.style} elements, polyphonic arrangement, and professional audio production with clear instrument separation.`
    ];

    const randomPrompt = mockPrompts[Math.floor(Math.random() * mockPrompts.length)];
    
    console.log('🎵 GoogleGeminiService: Using mock Lyria prompt');
    return {
      prompt: randomPrompt,
      confidence: 0.8,
      reasoning: 'Mock prompt generated based on source and reference audio analysis',
      suggestedParameters: {
        duration: 10,
        temperature: 0.8,
        seed: Math.floor(Math.random() * 1000)
      }
    };
  }

  /**
   * Check if the service is properly initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Get service status information
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      hasApiKey: !!process.env.GOOGLE_AI_API_KEY,
      service: 'Google Gemini AI'
    };
  }
}

// Export singleton instance
export const googleGeminiService = new GoogleGeminiService();
