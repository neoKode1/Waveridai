'use client'

import React, { useState } from 'react'
import { useWorkflow } from '@/contexts/WorkflowContext'
import { Sparkles, Zap, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export const GenerateSection: React.FC = () => {
  const { state, actions } = useWorkflow()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isDisabled = !state.sourceAudio || !state.desiredAudioDescription

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      // Simulate API call - replace with actual generation logic
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // For demo purposes, use source audio as generated audio
      actions.setGeneratedAudio(state.sourceAudio!)
      actions.setCurrentStep('results')
    } catch (err) {
      setError('Failed to generate audio. Please try again.')
      console.error('Generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section className={cn('card space-y-6', isDisabled && 'opacity-50 pointer-events-none')}>
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-gradient-to-br from-accent-orange to-accent-pink rounded-xl shadow-glow animate-pulse-glow">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gradient">Step 4: Generate</h2>
          <p className="text-neutral-400 mt-1">
            Transform your audio using AI
          </p>
        </div>
      </div>

      {isDisabled && (
        <div className="p-4 bg-warning/10 border border-warning/30 rounded-xl">
          <p className="text-warning text-sm font-medium">
            Please complete previous steps first
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-error/10 border border-error/30 rounded-xl flex items-start space-x-3 animate-fade-in">
          <AlertCircle className="h-5 w-5 text-error flex-shrink-0 mt-0.5" />
          <div className="text-sm text-error">
            <p className="font-medium mb-1">Generation Error</p>
            <p className="text-error/80">{error}</p>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-100">Generation Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-700/50">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-neutral-300">Source Audio</span>
            </div>
            <p className="text-neutral-100">Uploaded</p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-700/50">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <span className="text-sm font-medium text-neutral-300">Desired Sound</span>
            </div>
            <p className="text-neutral-100 line-clamp-2">{state.desiredAudioDescription}</p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-700/50">
            <div className="flex items-center space-x-2 mb-2">
              <div className={cn(
                'w-2 h-2 rounded-full',
                state.referenceAudio ? 'bg-success animate-pulse' : 'bg-neutral-600'
              )} style={{ animationDelay: '0.4s' }}></div>
              <span className="text-sm font-medium text-neutral-300">Reference Audio</span>
            </div>
            <p className="text-neutral-100">{state.referenceAudio ? 'Uploaded' : 'Not provided'}</p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-700/50">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
              <span className="text-sm font-medium text-neutral-300">AI Model</span>
            </div>
            <p className="text-neutral-100">Polyphonic Neural Synthesis</p>
          </div>
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={isDisabled || isGenerating}
        className="button-primary w-full !py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed relative group overflow-hidden"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-6 w-6 mr-3 animate-spin" />
            <span>Generating... This may take a few moments</span>
          </>
        ) : (
          <>
            <Zap className="h-6 w-6 mr-3 group-hover:animate-pulse" />
            <span>Generate Transformed Audio</span>
          </>
        )}
        
        {/* Animated particles */}
        {isGenerating && (
          <>
            <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
            <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
          </>
        )}
      </button>

      {isGenerating && (
        <div className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl animate-pulse">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-5 w-5 text-primary-400 animate-spin" />
            <div className="flex-1">
              <p className="text-sm text-primary-300 font-medium">AI is processing your audio...</p>
              <div className="mt-2 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-shimmer" style={{ width: '60%', backgroundSize: '200% 100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
