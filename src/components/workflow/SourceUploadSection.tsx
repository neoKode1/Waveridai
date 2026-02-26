'use client'

import React from 'react'
import { AudioUploader } from '../audio/AudioUploader'
import { WaveformDisplay } from '../audio/WaveformDisplay'
import { Music } from 'lucide-react'

interface SourceUploadSectionProps {
  sourceAudio: File | null
  onUpload: (file: File) => void
  workflowMode: 'precise' | 'ai'
}

export const SourceUploadSection: React.FC<SourceUploadSectionProps> = ({
  sourceAudio,
  onUpload,
  workflowMode,
}) => {
  return (
    <div className="card">
      <div className="flex items-start space-x-4 mb-6">
        <div className={`p-3 rounded-lg ${
          workflowMode === 'precise' ? 'gradient-primary' : 'gradient-secondary'
        }`}>
          <Music className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2 text-white">
            {workflowMode === 'precise' ? 'Upload Source Audio' : 'Upload Reference Audio (Optional)'}
          </h2>
          <p className="text-neutral-400">
            {workflowMode === 'precise'
              ? 'Upload the audio you want to transform. We\'ll extract the musical structure and apply it to your reference instrument.'
              : 'Upload audio to use as a style reference for AI generation, or skip to describe music directly.'}
          </p>
        </div>
      </div>

      <AudioUploader
        onUpload={onUpload}
        currentFile={sourceAudio}
        label="Upload Audio File"
        description="Drag and drop your audio file here, or click to browse"
        variant={workflowMode === 'precise' ? 'primary' : 'secondary'}
      />

      {sourceAudio && (
        <div className="mt-6 animate-fade-in">
          <WaveformDisplay audioFile={sourceAudio} variant={workflowMode === 'precise' ? 'primary' : 'secondary'} />
        </div>
      )}
    </div>
  )
}
