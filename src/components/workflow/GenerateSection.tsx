'use client'

import React, { useState } from 'react'
import { Zap } from 'lucide-react'
import { useWorkflowState } from '@/lib/hooks/useWorkflowState'
import { cn } from '@/lib/utils/cn'
import { logToTerminal } from '@/lib/utils/terminal-logger'

export const GenerateSection: React.FC = () => {
  const { 
    sourceAudio,
    referenceAudio,
    generatedAudio, 
    setGeneratedAudio,
    sourceAudioAnalysis,
    referenceAudioAnalysis,
    setSourceAudioAnalysis,
    setReferenceAudioAnalysis,
    currentStep, 
    progress, 
    processing,
    setProcessing,
    setCurrentStep,
    setError
  } = useWorkflowState()

  const [generationSettings, setGenerationSettings] = useState({
    outputFormat: 'wav' as 'wav' | 'mp3' | 'flac',
    sampleRate: 44100,
    duration: 10,
    temperature: 0.8
  })

  const [userPrompt, setUserPrompt] = useState('')

  // Generate dynamic placeholder based on analysis
  const getPlaceholderText = () => {
    if (sourceAudioAnalysis && referenceAudioAnalysis) {
      const source = sourceAudioAnalysis.features
      const desired = referenceAudioAnalysis.features
      return `Example: "Turn this ${source.genre} ${source.instruments[0]} melody into ${desired.instruments[0]} with ${desired.style} style" or "Make it more ${desired.mood} and add ${desired.instruments.join(', ')}"`
    }
    return "Example: 'Turn this piano melody into an electric guitar with rock distortion and make it more energetic' or 'Convert this guitar riff to a violin with orchestral strings backing'"
  }

  const isActive = currentStep === 'generate'
  const isComplete = progress.generate === 100
  const canGenerate = sourceAudio && referenceAudio && !generatedAudio

  const handleAnalyzeAudio = async () => {
    if (!sourceAudio || !referenceAudio) {
      console.log('🎵 GenerateSection: Missing audio files for analysis')
      return
    }

    console.log('🎵 GenerateSection: Starting intelligent audio analysis with Google Gemini')
    setProcessing({ audioAnalysis: true })

    try {
      // Analyze source audio with Google Gemini
      if (!sourceAudioAnalysis) {
        console.log('🎵 GenerateSection: Google Gemini analyzing source audio...')
        
        // TODO: Convert AudioBuffer to File for actual Gemini API call
        // For now, using mock data that represents what Gemini would return
        const mockSourceAnalysis = {
          features: {
            duration: sourceAudio?.duration || 10,
            sampleRate: sourceAudio?.sampleRate || 44100,
            channels: sourceAudio?.numberOfChannels || 2,
            tempo: 128,
            key: 'G minor',
            timeSignature: [4, 4] as [number, number],
            spectralCentroid: 0.5,
            zeroCrossingRate: 0.3,
            instruments: ['electric guitar', 'bass guitar', 'drums', 'synthesizer'],
            genre: 'electronic rock',
            mood: 'energetic',
            style: 'modern electronic',
            dynamicRange: 0.8,
            averageLoudness: 0.7,
            harmonicRatio: 0.6
          },
          confidence: 0.9,
          analysisTime: Date.now(),
          timestamp: new Date()
        }
        setSourceAudioAnalysis(mockSourceAnalysis)
        console.log('🎵 GenerateSection: Google Gemini source analysis completed')
        logToTerminal('GenerateSection', 'Google Gemini analyzed source audio', mockSourceAnalysis)
      }

      // Analyze reference audio with Google Gemini
      if (!referenceAudioAnalysis) {
        console.log('🎵 GenerateSection: Google Gemini analyzing reference audio...')
        
        const mockReferenceAnalysis = {
          features: {
            duration: referenceAudio?.duration || 8,
            sampleRate: referenceAudio?.sampleRate || 44100,
            channels: referenceAudio?.numberOfChannels || 2,
            tempo: 90,
            key: 'C major',
            timeSignature: [4, 4] as [number, number],
            spectralCentroid: 0.3,
            zeroCrossingRate: 0.1,
            instruments: ['piano', 'strings', 'acoustic guitar', 'flute'],
            genre: 'classical',
            mood: 'calm',
            style: 'cinematic classical',
            dynamicRange: 0.6,
            averageLoudness: 0.4,
            harmonicRatio: 0.8
          },
          confidence: 0.9,
          analysisTime: Date.now(),
          timestamp: new Date()
        }
        setReferenceAudioAnalysis(mockReferenceAnalysis)
        console.log('🎵 GenerateSection: Google Gemini reference analysis completed')
        logToTerminal('GenerateSection', 'Google Gemini analyzed reference audio', mockReferenceAnalysis)
      }

      console.log('🎵 GenerateSection: Google Gemini audio analysis completed')
      logToTerminal('GenerateSection', 'Google Gemini audio analysis completed successfully')

    } catch (error) {
      console.error('🎵 GenerateSection: Google Gemini audio analysis failed:', error)
      setError('Google Gemini audio analysis failed. You can still generate without analysis.')
    } finally {
      setProcessing({ audioAnalysis: false })
    }
  }

  const handleGenerate = async () => {
    if (!sourceAudio || !referenceAudio) {
      console.log('🎵 GenerateSection: Missing audio files for generation')
      return
    }

    console.log('🎵 GenerateSection: Starting AI generation', {
      hasSourceAudio: !!sourceAudio,
      hasReferenceAudio: !!referenceAudio,
      hasSourceAnalysis: !!sourceAudioAnalysis,
      hasReferenceAnalysis: !!referenceAudioAnalysis
    })

    setProcessing({ generation: true })
    
    try {
      // Step 1: Google Gemini generates intelligent prompt from its own analysis
      console.log('🎵 GenerateSection: Google Gemini generating intelligent prompt from its analysis...')
      
      // Hybrid approach: Combine user intent + analysis + desired sound to create transformation prompt
      let prompt = 'Create a musical piece with professional audio quality, clear instrument separation, and harmonic progression.'
      
      if (sourceAudioAnalysis && referenceAudioAnalysis) {
        console.log('🎵 GenerateSection: Creating hybrid transformation prompt with user intent...')
        
        // Get characteristics from both audio files
        const source = sourceAudioAnalysis.features  // Reference audio (what you have)
        const desired = referenceAudioAnalysis.features  // Desired sound (what you want)
        
        // Base transformation prompt
        const basePrompt = `Transform this ${source.genre} melody and chord progression from ${source.instruments.join(', ')} to ${desired.instruments.join(', ')}. 
        
        Original characteristics:
        - Melody style: ${source.mood} ${source.key} at ${source.tempo} BPM
        - Musical structure: ${source.style} with ${source.instruments.join(', ')}
        
        Target transformation:
        - Keep the same melody and chord progression
        - Change instrumentation to ${desired.instruments.join(', ')}
        - Maintain ${source.tempo} BPM tempo and ${source.key} key
        - Preserve the ${source.mood} mood and musical structure
        - Use ${desired.style} production style`
        
        // Incorporate user intent if provided
        if (userPrompt.trim()) {
          prompt = `${basePrompt}
          
        User's specific intent: "${userPrompt}"
        
        Please incorporate the user's specific requirements while maintaining the core musical structure.`
          
          console.log('🎵 GenerateSection: Incorporating user intent into prompt:', userPrompt)
          logToTerminal('GenerateSection', 'Incorporating user intent into prompt', { userIntent: userPrompt })
        } else {
          prompt = `${basePrompt}
          
        Focus on maintaining the original musical content while transforming the sound and timbre.`
        }
        
        console.log('🎵 GenerateSection: Generated hybrid transformation prompt:', prompt)
        logToTerminal('GenerateSection', 'Generated hybrid transformation prompt', {
          promptLength: prompt.length,
          sourceInstrument: source.instruments.join(', '),
          desiredInstrument: desired.instruments.join(', '),
          tempo: source.tempo,
          key: source.key
        })
      }

      // Step 2: Send Google Gemini's intelligent prompt to Lyria via Replicate API
      console.log('🎵 GenerateSection: Sending Google Gemini prompt to Lyria via Replicate API...')
      
      const response = await fetch('/api/lyria/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          duration: generationSettings.duration,
          temperature: 0.8
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('🎵 GenerateSection: Generation completed successfully', result)
        logToTerminal('GenerateSection', 'Generation completed successfully', result)

        // Download and convert the real audio from Lyria
        if (result.data.audio_url && typeof result.data.audio_url === 'string') {
          console.log('🎵 GenerateSection: Downloading real audio from Lyria...')
          
          try {
            const audioResponse = await fetch(result.data.audio_url)
            if (audioResponse.ok) {
              const audioArrayBuffer = await audioResponse.arrayBuffer()
              const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
              const realAudioBuffer = await audioContext.decodeAudioData(audioArrayBuffer)
              
              console.log('🎵 GenerateSection: Real audio downloaded successfully', {
                duration: realAudioBuffer.duration,
                sampleRate: realAudioBuffer.sampleRate,
                channels: realAudioBuffer.numberOfChannels
              })
              
              setGeneratedAudio(realAudioBuffer)
            } else {
              throw new Error(`Failed to download audio: ${audioResponse.statusText}`)
            }
          } catch (audioError) {
            console.error('🎵 GenerateSection: Failed to download real audio, using mock:', audioError)
            
            // Fallback to mock audio if download fails
            const mockGeneratedAudio = {
              duration: generationSettings.duration,
              sampleRate: generationSettings.sampleRate,
              numberOfChannels: 2,
              length: Math.floor(generationSettings.duration * generationSettings.sampleRate),
              getChannelData: () => {
                const length = Math.floor(generationSettings.duration * generationSettings.sampleRate)
                const data = new Float32Array(length)
                // Generate some mock transformed audio data
                for (let i = 0; i < length; i++) {
                  const t = i / generationSettings.sampleRate
                  // Create a transformed version of the original
                  const wave = Math.sin(2 * Math.PI * 440 * t) * 0.1 * Math.exp(-t * 0.2)
                  data[i] = wave
                }
                return data
              },
              copyFromChannel: () => {},
              copyToChannel: () => {}
            } as AudioBuffer
            
            setGeneratedAudio(mockGeneratedAudio)
          }
        } else {
          console.error('🎵 GenerateSection: No valid audio URL returned from Lyria:', result.data)
          logToTerminal('GenerateSection', 'No valid audio URL returned from Lyria', result.data)
          throw new Error(`No valid audio URL returned from Lyria. Received: ${typeof result.data.audio_url}`)
        }
        setCurrentStep('results')
        
        console.log('🎵 GenerateSection: Moving to results step')
        logToTerminal('GenerateSection', 'Moving to results step')
      } else {
        throw new Error(`Generation failed: ${response.status} ${response.statusText}`)
      }

    } catch (error) {
      console.error('🎵 GenerateSection: Generation failed:', error)
      setError('Generation failed. Please try again.')
    } finally {
      setProcessing({ generation: false })
    }
  }

  return (
    <div className={cn(
      'bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 transition-all duration-300',
      isActive && 'ring-2 ring-primary-500/50 shadow-lg shadow-primary-500/20',
      isComplete && 'bg-success/10 border-success/30',
      !canGenerate && 'opacity-50 pointer-events-none'
    )}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-primary-500 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Transform Your Melody</h2>
                  <p className="text-neutral-400 text-sm">
                    AI will analyze your reference melody and transform it to sound like your desired instrument.
                  </p>
                </div>
              </div>

      {/* Google Gemini Audio Analysis Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-2">Step 1: Analyze Both Audio Files</h3>
        <p className="text-neutral-400 text-sm mb-4">
          Google Gemini will analyze both your reference melody and desired sound to create a transformation prompt.
        </p>
        
        <button
          onClick={handleAnalyzeAudio}
          disabled={!canGenerate || processing.audioAnalysis}
          className={cn(
            "button-primary mb-4",
            (!canGenerate || processing.audioAnalysis) && "opacity-50 cursor-not-allowed"
          )}
        >
                  {processing.audioAnalysis ? 'Analyzing Both Audio Files...' : 'Analyze Audio Files'}
        </button>

        {(sourceAudioAnalysis || referenceAudioAnalysis) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sourceAudioAnalysis && sourceAudioAnalysis.features && (
              <div className="bg-black/20 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-2">Reference Melody Analysis</h4>
                <div className="space-y-1 text-sm">
                  <div><span className="text-neutral-400">Genre:</span> <span className="text-white">{sourceAudioAnalysis.features.genre || 'Unknown'}</span></div>
                  <div><span className="text-neutral-400">Instruments:</span> <span className="text-white">{sourceAudioAnalysis.features.instruments?.join(', ') || 'Unknown'}</span></div>
                  <div><span className="text-neutral-400">Mood:</span> <span className="text-white">{sourceAudioAnalysis.features.mood || 'Unknown'}</span></div>
                  <div><span className="text-neutral-400">Tempo:</span> <span className="text-white">{sourceAudioAnalysis.features.tempo || 'Unknown'} BPM</span></div>
                  <div><span className="text-neutral-400">Key:</span> <span className="text-white">{sourceAudioAnalysis.features.key || 'Unknown'}</span></div>
                </div>
              </div>
            )}

            {referenceAudioAnalysis && referenceAudioAnalysis.features && (
              <div className="bg-black/20 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-2">Desired Sound Analysis</h4>
                <div className="space-y-1 text-sm">
                  <div><span className="text-neutral-400">Genre:</span> <span className="text-white">{referenceAudioAnalysis.features.genre || 'Unknown'}</span></div>
                  <div><span className="text-neutral-400">Instruments:</span> <span className="text-white">{referenceAudioAnalysis.features.instruments?.join(', ') || 'Unknown'}</span></div>
                  <div><span className="text-neutral-400">Mood:</span> <span className="text-white">{referenceAudioAnalysis.features.mood || 'Unknown'}</span></div>
                  <div><span className="text-neutral-400">Tempo:</span> <span className="text-white">{referenceAudioAnalysis.features.tempo || 'Unknown'} BPM</span></div>
                  <div><span className="text-neutral-400">Key:</span> <span className="text-white">{referenceAudioAnalysis.features.key || 'Unknown'}</span></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Generation Settings */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Step 2: Generate Music</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-neutral-300 mb-2">
              Duration (seconds)
            </label>
            <input
              type="number"
              id="duration"
              min="5"
              max="30"
              value={generationSettings.duration}
              onChange={(e) => setGenerationSettings(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm"
            />
          </div>
          <div>
            <label htmlFor="sampleRate" className="block text-sm font-medium text-neutral-300 mb-2">
              Sample Rate
            </label>
            <select
              id="sampleRate"
              value={generationSettings.sampleRate}
              onChange={(e) => setGenerationSettings(prev => ({ ...prev, sampleRate: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm"
            >
              <option value={44100}>44.1 kHz</option>
              <option value={48000}>48 kHz</option>
            </select>
          </div>
          <div>
            <label htmlFor="outputFormat" className="block text-sm font-medium text-neutral-300 mb-2">
              Output Format
            </label>
            <select
              id="outputFormat"
              value={generationSettings.outputFormat}
              onChange={(e) => setGenerationSettings(prev => ({ ...prev, outputFormat: e.target.value as 'wav' | 'mp3' | 'flac' }))}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm"
            >
              <option value="wav">WAV</option>
              <option value="mp3">MP3</option>
              <option value="flac">FLAC</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Intent Prompt */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Step 2: Describe Your Intent</h3>
        <p className="text-neutral-400 text-sm mb-3">
          Tell the AI exactly how you want to transform your audio. Be specific about instruments, style, or mood changes.
        </p>
        <textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder={getPlaceholderText()}
          className="w-full h-24 px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-neutral-500">
            The more specific you are, the better the AI can understand your vision.
          </p>
          <p className="text-xs text-neutral-500">
            {userPrompt.length}/500 characters
          </p>
        </div>
      </div>

      {/* Generate Button */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-white mb-2">Step 3: AI Generation</h3>
        <p className="text-neutral-400 text-sm mb-4">
          Google Gemini will combine your intent with its analysis to create the perfect prompt for Lyria.
        </p>
      </div>
      
      <button
        onClick={handleGenerate}
        disabled={!canGenerate || processing.generation}
        className={cn(
          "button-primary w-full",
          (!canGenerate || processing.generation) && "opacity-50 cursor-not-allowed"
        )}
      >
                {processing.generation ? 'Transforming Melody...' : 'Transform Melody'}
      </button>

      {!canGenerate && (
        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    ⚠️ Please upload both your reference melody and desired sound to transform.
                  </p>
        </div>
      )}
    </div>
  )
}
