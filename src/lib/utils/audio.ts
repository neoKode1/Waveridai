// Use the native Web Audio API AudioBuffer
type AudioBuffer = globalThis.AudioBuffer

export interface AudioFormat {
  sampleRate: number
  channels: number
  bitDepth: number
  duration: number
}

export interface AudioAnalysis {
  format: AudioFormat
  isPolyphonic: boolean
  spectralCentroid: number
  zeroCrossingRate: number
  mfccFeatures: number[]
  tempo: number | null
  key: string | null
}

export class AudioUtils {
  /**
   * Validate audio file format and size
   */
  static validateAudioFile(file: File): { valid: boolean; error?: string } {
    const validFormats = ['audio/wav', 'audio/mpeg', 'audio/flac', 'audio/mp4', 'audio/ogg']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!validFormats.includes(file.type)) {
      return { valid: false, error: 'Unsupported audio format. Please use WAV, MP3, FLAC, M4A, or OGG files.' }
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'File size too large. Please use files smaller than 10MB.' }
    }

    return { valid: true }
  }

  /**
   * Convert File to AudioBuffer
   */
  static async fileToAudioBuffer(file: File): Promise<AudioBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer
          const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
          resolve(audioBuffer)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * Analyze audio characteristics
   */
  static async analyzeAudio(audioBuffer: AudioBuffer): Promise<AudioAnalysis> {
    const format: AudioFormat = {
      sampleRate: audioBuffer.sampleRate,
      channels: audioBuffer.numberOfChannels,
      bitDepth: 16, // Assume 16-bit for now
      duration: audioBuffer.duration
    }

    // Calculate spectral centroid (brightness)
    const spectralCentroid = this.calculateSpectralCentroid(audioBuffer)
    
    // Calculate zero crossing rate (noisiness)
    const zeroCrossingRate = this.calculateZeroCrossingRate(audioBuffer)
    
    // Calculate MFCC features (simplified)
    const mfccFeatures = this.calculateMFCC(audioBuffer)
    
    // Determine if polyphonic (simplified heuristic)
    const isPolyphonic = this.detectPolyphony(audioBuffer)

    return {
      format,
      isPolyphonic,
      spectralCentroid,
      zeroCrossingRate,
      mfccFeatures,
      tempo: null, // Would need more complex analysis
      key: null // Would need pitch detection
    }
  }

  /**
   * Calculate spectral centroid
   */
  private static calculateSpectralCentroid(audioBuffer: AudioBuffer): number {
    const channelData = audioBuffer.getChannelData(0)
    const fftSize = 2048
    const hopSize = 512
    
    let totalCentroid = 0
    let frameCount = 0

    for (let i = 0; i < channelData.length - fftSize; i += hopSize) {
      const frame = channelData.slice(i, i + fftSize)
      const magnitude = this.fft(frame)
      
      let weightedSum = 0
      let magnitudeSum = 0
      
      for (let j = 0; j < magnitude.length / 2; j++) {
        const freq = (j * audioBuffer.sampleRate) / magnitude.length
        const mag = magnitude[j]
        weightedSum += freq * mag
        magnitudeSum += mag
      }
      
      if (magnitudeSum > 0) {
        totalCentroid += weightedSum / magnitudeSum
        frameCount++
      }
    }

    return frameCount > 0 ? totalCentroid / frameCount : 0
  }

  /**
   * Calculate zero crossing rate
   */
  private static calculateZeroCrossingRate(audioBuffer: AudioBuffer): number {
    const channelData = audioBuffer.getChannelData(0)
    let crossings = 0

    for (let i = 1; i < channelData.length; i++) {
      if ((channelData[i] >= 0) !== (channelData[i - 1] >= 0)) {
        crossings++
      }
    }

    return crossings / (channelData.length - 1)
  }

  /**
   * Calculate MFCC features (simplified)
   */
  private static calculateMFCC(audioBuffer: AudioBuffer): number[] {
    // Simplified MFCC calculation - in production, use a proper library
    const channelData = audioBuffer.getChannelData(0)
    const frameSize = 1024
    const hopSize = 512
    const mfccCoeffs = 13
    
    const mfccFeatures: number[] = []
    
    for (let i = 0; i < channelData.length - frameSize; i += hopSize) {
      const frame = channelData.slice(i, i + frameSize)
      const magnitude = this.fft(frame)
      
      // Simplified mel-scale filter bank
      for (let j = 0; j < mfccCoeffs; j++) {
        const melFreq = this.hzToMel((j * audioBuffer.sampleRate) / magnitude.length)
        mfccFeatures.push(melFreq)
      }
    }

    return mfccFeatures.slice(0, mfccCoeffs) // Return first frame's features
  }

  /**
   * Detect polyphony in audio
   */
  private static detectPolyphony(audioBuffer: AudioBuffer): boolean {
    const channelData = audioBuffer.getChannelData(0)
    const frameSize = 2048
    const hopSize = 512
    
    let polyphonicFrames = 0
    let totalFrames = 0

    for (let i = 0; i < channelData.length - frameSize; i += hopSize) {
      const frame = channelData.slice(i, i + frameSize)
      const magnitude = this.fft(frame)
      
      // Count significant peaks (simplified polyphony detection)
      let peakCount = 0
      const threshold = Math.max(...magnitude) * 0.1
      
      for (let j = 1; j < magnitude.length - 1; j++) {
        if (magnitude[j] > threshold && 
            magnitude[j] > magnitude[j - 1] && 
            magnitude[j] > magnitude[j + 1]) {
          peakCount++
        }
      }
      
      if (peakCount > 3) { // Multiple simultaneous notes
        polyphonicFrames++
      }
      totalFrames++
    }

    return totalFrames > 0 && (polyphonicFrames / totalFrames) > 0.3
  }

  /**
   * Simple FFT implementation
   */
  private static fft(signal: Float32Array): Float32Array {
    const N = signal.length
    const output = new Float32Array(N * 2) // Complex output
    
    // Copy input to output (real part)
    for (let i = 0; i < N; i++) {
      output[i * 2] = signal[i]
      output[i * 2 + 1] = 0 // Imaginary part
    }
    
    // Bit-reverse permutation
    let j = 0
    for (let i = 1; i < N; i++) {
      let bit = N >> 1
      while (j & bit) {
        j ^= bit
        bit >>= 1
      }
      j ^= bit
      
      if (i < j) {
        // Swap real parts
        const temp = output[i * 2]
        output[i * 2] = output[j * 2]
        output[j * 2] = temp
        
        // Swap imaginary parts
        const tempIm = output[i * 2 + 1]
        output[i * 2 + 1] = output[j * 2 + 1]
        output[j * 2 + 1] = tempIm
      }
    }
    
    // FFT computation
    for (let length = 2; length <= N; length <<= 1) {
      const angle = -2 * Math.PI / length
      const wlen_real = Math.cos(angle)
      const wlen_imag = Math.sin(angle)
      
      for (let i = 0; i < N; i += length) {
        let w_real = 1
        let w_imag = 0
        
        for (let j = 0; j < length / 2; j++) {
          const u_real = output[(i + j) * 2]
          const u_imag = output[(i + j) * 2 + 1]
          const v_real = output[(i + j + length / 2) * 2] * w_real - output[(i + j + length / 2) * 2 + 1] * w_imag
          const v_imag = output[(i + j + length / 2) * 2] * w_imag + output[(i + j + length / 2) * 2 + 1] * w_real
          
          output[(i + j) * 2] = u_real + v_real
          output[(i + j) * 2 + 1] = u_imag + v_imag
          output[(i + j + length / 2) * 2] = u_real - v_real
          output[(i + j + length / 2) * 2 + 1] = u_imag - v_imag
          
          const next_w_real = w_real * wlen_real - w_imag * wlen_imag
          const next_w_imag = w_real * wlen_imag + w_imag * wlen_real
          w_real = next_w_real
          w_imag = next_w_imag
        }
      }
    }
    
    // Calculate magnitude spectrum
    const magnitude = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      magnitude[i] = Math.sqrt(output[i * 2] ** 2 + output[i * 2 + 1] ** 2)
    }
    
    return magnitude
  }

  /**
   * Convert Hz to Mel scale
   */
  private static hzToMel(hz: number): number {
    return 2595 * Math.log10(1 + hz / 700)
  }

  /**
   * Format duration in seconds to human-readable format
   */
  static formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  /**
   * Format file size in bytes to human-readable format
   */
  static formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }
}
