'use client'

import React from 'react'
import { useWorkflow } from '@/contexts/WorkflowContext'
import { AudioUploader } from '@/components/audio/AudioUploader'
import { WaveformDisplay } from '@/components/audio/WaveformDisplay'
import { Music, Info } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export const ReferenceUploadSection: React.FC = () => {
  const { state, actions } = useWorkflow()
  const isDisabled = !state.desiredAudioDescription

  const handleFileSelect = (file: File) => {
    const url = URL.createObjectURL(file)
    actions.setReferenceAudio(url)
    actions.setCurrentStep('generate')
  }

  const handleSkip = () => {
    actions.setCurrentStep('generate')
  }

  return (
    <section className={cn('card space-y-6', isDisabled && 'opacity-50 pointer-events-none')}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-accent-purple to-accent-blue rounded-xl shadow-glow">
            <Music className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gradient">Step 3: Reference Audio (Optional)</h2>
            <p className="text-neutral-400 mt-1">
              Upload a reference to match the exact timbre and style
            </p>
          </div>
        </div>
        <button
          onClick={handleSkip}
          disabled={isDisabled}
          className="button-secondary"
        >
          Skip This Step
        </button>
      </div>

      {isDisabled && (
        <div className="p-4 bg-warning/10 border border-warning/30 rounded-xl">
          <p className="text-warning text-sm font-medium">
            Please describe your desired sound first
          </p>
        </div>
      )}

      <div className="p-4 bg-info/10 border border-info/30 rounded-xl flex items-start space-x-3">
        <Info className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
        <div className="text-sm text-info">
          <p className="font-medium mb-1">What is reference audio?</p>
          <p className="text-info/80">
            Reference audio helps the AI match the exact timbre, tone, and style you want. 
            Upload a sample of the instrument or sound you described for more accurate results.
          </p>
        </div>
      </div>

      <AudioUploader
        onFileSelect={handleFileSelect}
        currentFile={state.referenceAudio ? new File([], 'reference.mp3') : null}
        label="Upload Reference Audio"
        description="This audio will be used as a style reference for the transformation"
      />

      {state.referenceAudio && (
        <div className="animate-slide-up">
          <WaveformDisplay
            audioUrl={state.referenceAudio}
            title="Reference Audio"
          />
        </div>
      )}
    </section>
  )
}
