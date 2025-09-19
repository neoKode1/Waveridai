'use client'

import React from 'react'
import { CheckCircle, Download, Share, RotateCcw } from 'lucide-react'
import { WaveformDisplay } from '@/components/audio/WaveformDisplay'
import { useWorkflowState } from '@/lib/hooks/useWorkflowState'
import { cn } from '@/lib/utils/cn'

export const ResultsSection: React.FC = () => {
  const { 
    generatedAudio, 
    sourceAudio,
    referenceAudio,
    currentStep, 
    progress,
    resetWorkflow 
  } = useWorkflowState()

  const isActive = currentStep === 'results'
  const isComplete = progress.results === 100

  // Log when ResultsSection is rendered
  console.log('🎵 ResultsSection: Rendering results', {
    hasGeneratedAudio: !!generatedAudio,
    hasSourceAudio: !!sourceAudio,
    hasReferenceAudio: !!referenceAudio,
    currentStep,
    audioBufferType: generatedAudio ? typeof generatedAudio : 'null'
  })

  if (!generatedAudio) {
    return (
      <div className={cn(
        'bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 transition-all duration-300',
        'opacity-50 pointer-events-none'
      )}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-lg bg-gray-600">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Results</h2>
            <p className="text-gray-400 text-sm">
              Your transformed audio will appear here
            </p>
          </div>
        </div>
        <p className="text-gray-500 text-center py-8">
          Generate audio to see results
        </p>
      </div>
    )
  }

  const handleDownload = () => {
    if (!generatedAudio) return

    // Convert AudioBuffer to downloadable file
    const audioBlob = new Blob([new ArrayBuffer(generatedAudio.length * 4)], { type: 'audio/wav' })
    const url = URL.createObjectURL(audioBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `waveridai-transformed-${Date.now()}.wav`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    if (!generatedAudio) return

    if (navigator.share) {
      try {
        const audioBlob = new Blob([new ArrayBuffer(generatedAudio.length * 4)], { type: 'audio/wav' })
        const file = new File([audioBlob], 'waveridai-transformed.wav', { type: 'audio/wav' })
        await navigator.share({
          title: 'Waveridai Transformed Audio',
          text: 'Check out this AI-transformed audio created with Waveridai!',
          files: [file]
        })
      } catch (error) {
        console.log('Share cancelled or failed:', error)
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className={cn(
      'bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 transition-all duration-300',
      isActive && 'ring-2 ring-green-500/50 shadow-lg shadow-green-500/20',
      isComplete && 'bg-green-500/10 border-green-500/30'
    )}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-lg bg-green-500">
          <CheckCircle className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Transformation Complete!</h2>
          <p className="text-gray-400 text-sm">
            Your audio has been successfully transformed
          </p>
        </div>
      </div>

      {/* Generated Audio Preview */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Transformed Audio</h3>
        <WaveformDisplay 
          audioBuffer={generatedAudio} 
          showControls={true}
          height={150}
        />
        
        {/* Audio Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-black/20 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {generatedAudio.duration.toFixed(1)}s
            </div>
            <div className="text-sm text-gray-400">Duration</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {generatedAudio.sampleRate.toLocaleString()} Hz
            </div>
            <div className="text-sm text-gray-400">Sample Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {generatedAudio.numberOfChannels}
            </div>
            <div className="text-sm text-gray-400">Channels</div>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Audio Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sourceAudio && (
            <div className="bg-black/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-2">Original Source</h4>
              <WaveformDisplay 
                audioBuffer={sourceAudio} 
                showControls={true}
                height={100}
              />
              <div className="text-xs text-gray-400 mt-2">
                Duration: {sourceAudio.duration.toFixed(1)}s
              </div>
            </div>
          )}
          
          {referenceAudio && (
            <div className="bg-black/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-2">Reference Style</h4>
              <WaveformDisplay 
                audioBuffer={referenceAudio} 
                showControls={true}
                height={100}
              />
              <div className="text-xs text-gray-400 mt-2">
                Duration: {referenceAudio.duration.toFixed(1)}s
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
        >
          <Download className="h-5 w-5" />
          <span>Download Audio</span>
        </button>
        
        <button
          onClick={handleShare}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
        >
          <Share className="h-5 w-5" />
          <span>Share</span>
        </button>
        
        <button
          onClick={resetWorkflow}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
        >
          <RotateCcw className="h-5 w-5" />
          <span>Start Over</span>
        </button>
      </div>

      {/* Success Message */}
      <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
        <p className="text-green-400 text-sm">
          🎉 Success! Your audio has been transformed using AI. The source audio has been analyzed and converted to match the style and characteristics of your reference audio.
        </p>
      </div>
    </div>
  )
}