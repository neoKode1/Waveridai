'use client'

import React from 'react'
import { Zap, Loader2 } from 'lucide-react'
import { useWorkflowState } from '@/lib/hooks/useWorkflowState'
import { cn } from '@/lib/utils/cn'

interface GenerateSectionProps {
  isActive: boolean
  onComplete: () => void
  onBack: () => void
}

export const GenerateSection: React.FC<GenerateSectionProps> = ({
  isActive,
  onComplete,
  onBack,
}) => {
  const {
    referenceAudio,
    sourceAudio,
    desiredAudio,
    desiredAudioDescription,
    isGenerating,
    setIsGenerating,
    setGeneratedAudio,
  } = useWorkflowState()

  const [error, setError] = React.useState<string | null>(null)

  const handleGenerate = async () => {
    if (!referenceAudio || !sourceAudio) {
      setError('Missing required audio files')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const useAIGeneration = !desiredAudio && desiredAudioDescription.trim().length > 0

      if (useAIGeneration) {
        // Call the server-side API route — avoids importing server-only lyriaService on client
        const response = await fetch('/api/lyria/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: desiredAudioDescription,
            duration: 30,
          }),
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || `Server error: ${response.status}`)
        }

        const data = await response.json()
        // Fetch the audio URL returned by the API and store as Blob
        const audioResponse = await fetch(data.data.audio_url)
        const audioBlob = await audioResponse.blob()
        setGeneratedAudio(audioBlob)
      } else {
        // File-based synthesis workflow (placeholder)
        await new Promise((resolve) => setTimeout(resolve, 3000))
        const mockBlob = new Blob(['mock audio data'], { type: 'audio/wav' })
        setGeneratedAudio(mockBlob)
      }

      onComplete()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate audio')
    } finally {
      setIsGenerating(false)
    }
  }

  const canGenerate =
    referenceAudio && sourceAudio && (desiredAudio || desiredAudioDescription.trim().length > 0)

  return (
    <div
      className={cn(
        'card transition-all duration-200',
        isActive ? 'ring-2 ring-primary-500' : 'opacity-50'
      )}
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-accent-green/10 rounded-lg">
          <Zap className="h-6 w-6 text-accent-green" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-neutral-100 mb-2">Step 4: Generate Audio</h2>
          <p className="text-neutral-400 mb-4">
            Process your audio files to create the synthesized output.
          </p>

          <div className="bg-neutral-900 rounded-lg p-4 mb-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-400">Reference Audio:</span>
              <span className="text-sm text-neutral-200">{referenceAudio?.name || 'Not uploaded'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-400">Source Audio:</span>
              <span className="text-sm text-neutral-200">{sourceAudio?.name || 'Not uploaded'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-400">Desired Audio:</span>
              <span className="text-sm text-neutral-200">
                {desiredAudio?.name || (desiredAudioDescription ? 'AI Generation' : 'Not specified')}
              </span>
            </div>
            {desiredAudioDescription && (
              <div className="pt-2 border-t border-neutral-800">
                <span className="text-sm text-neutral-400">AI Prompt:</span>
                <p className="text-sm text-neutral-200 mt-1">{desiredAudioDescription}</p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-4">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={onBack}
              disabled={!isActive || isGenerating}
              className={cn('button-secondary flex-1', (!isActive || isGenerating) && 'opacity-50 cursor-not-allowed')}
            >
              Back
            </button>
            <button
              onClick={handleGenerate}
              disabled={!isActive || !canGenerate || isGenerating}
              className={cn(
                'button-primary flex-1 flex items-center justify-center space-x-2',
                (!isActive || !canGenerate || isGenerating) && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Generate Audio</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

