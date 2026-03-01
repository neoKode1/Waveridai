'use client'

import React from 'react'
import { useWorkflow } from '@/contexts/WorkflowContext'
import { AudioUploader } from '@/components/audio/AudioUploader'
import { WaveformDisplay } from '@/components/audio/WaveformDisplay'
import { Upload } from 'lucide-react'

export const SourceUploadSection: React.FC = () => {
  const { state, actions } = useWorkflow()

  const handleFileSelect = (file: File) => {
    const url = URL.createObjectURL(file)
    actions.setSourceAudio(url)
    actions.setCurrentStep('describe')
  }

  return (
    <section className="card space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
          <Upload className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gradient">Step 1: Source Audio</h2>
          <p className="text-neutral-400 mt-1">
            Upload the audio file you want to transform
          </p>
        </div>
      </div>

      <AudioUploader
        onFileSelect={handleFileSelect}
        currentFile={state.sourceAudio ? new File([], 'source.mp3') : null}
        label="Upload Source Audio"
        description="This is the audio that will be converted to your desired sound"
      />

      {state.sourceAudio && (
        <div className="animate-slide-up">
          <WaveformDisplay
            audioUrl={state.sourceAudio}
            title="Source Audio"
          />
        </div>
      )}
    </section>
  )
}
