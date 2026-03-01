'use client'

import React from 'react'
import { useWorkflow } from '@/contexts/WorkflowContext'
import { WaveformDisplay } from '@/components/audio/WaveformDisplay'
import { CheckCircle2, Download, RefreshCw, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export const ResultsSection: React.FC = () => {
  const { state, actions } = useWorkflow()
  const hasResults = !!state.generatedAudio

  const handleReset = () => {
    actions.setSourceAudio(null)
    actions.setDesiredAudioDescription(null)
    actions.setReferenceAudio(null)
    actions.setGeneratedAudio(null)
    actions.setCurrentStep('upload')
  }

  const handleShare = async () => {
    if (navigator.share && state.generatedAudio) {
      try {
        await navigator.share({
          title: 'My Waveridai Creation',
          text: 'Check out this AI-generated audio!',
          url: state.generatedAudio,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    }
  }

  if (!hasResults) {
    return null
  }

  return (
    <section className="card space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-gradient-to-br from-success to-accent-green rounded-xl shadow-glow animate-pulse-glow">
          <CheckCircle2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gradient">Results</h2>
          <p className="text-neutral-400 mt-1">
            Your transformed audio is ready!
          </p>
        </div>
      </div>

      {/* Success message */}
      <div className="p-6 bg-gradient-to-r from-success/10 to-accent-green/10 border border-success/30 rounded-xl">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-success/20 rounded-full">
            <CheckCircle2 className="h-6 w-6 text-success" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-success mb-2">Generation Complete!</h3>
            <p className="text-neutral-300">
              Your audio has been successfully transformed using AI. Listen to the result below and download or share it.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-neutral-300">Original Audio</h3>
          </div>
          {state.sourceAudio && (
            <WaveformDisplay
              audioUrl={state.sourceAudio}
              title="Source"
            />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-semibold text-gradient">Transformed Audio</h3>
          </div>
          <WaveformDisplay
            audioUrl={state.generatedAudio}
            title="Generated"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <button className="button-primary flex items-center space-x-2 flex-1">
          <Download className="h-5 w-5" />
          <span>Download Result</span>
        </button>

        <button 
          onClick={handleShare}
          className="button-secondary flex items-center space-x-2"
        >
          <Share2 className="h-5 w-5" />
          <span>Share</span>
        </button>

        <button 
          onClick={handleReset}
          className="button-secondary flex items-center space-x-2"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Start Over</span>
        </button>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-700/50">
          <p className="text-sm text-neutral-400 mb-1">Quality</p>
          <p className="text-lg font-semibold text-neutral-100">48kHz Stereo</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-700/50">
          <p className="text-sm text-neutral-400 mb-1">Model</p>
          <p className="text-lg font-semibold text-neutral-100">Neural Synthesis</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-700/50">
          <p className="text-sm text-neutral-400 mb-1">Processing</p>
          <p className="text-lg font-semibold text-neutral-100">Polyphonic</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-700/50">
          <p className="text-sm text-neutral-400 mb-1">Reference</p>
          <p className="text-lg font-semibold text-neutral-100">{state.referenceAudio ? 'Used' : 'Not Used'}</p>
        </div>
      </div>
    </section>
  )
}
