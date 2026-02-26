'use client'

import React from 'react'
import { AudioUploader } from '../audio/AudioUploader'
import { WaveformDisplay } from '../audio/WaveformDisplay'
import { Sparkles } from 'lucide-react'

interface ReferenceUploadSectionProps {
  referenceAudio: File | null
  onUpload: (file: File) => void
}

export const ReferenceUploadSection: React.FC<ReferenceUploadSectionProps> = ({
  referenceAudio,
  onUpload,
}) => {
  return (
    <div className="card">
      <div className="flex items-start space-x-4 mb-6">
        <div className="p-3 gradient-primary rounded-lg">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2 text-white">Upload Reference Audio</h2>
          <p className="text-neutral-400">
            Upload a sample of the instrument or sound you want to use. Our AI will learn its characteristics
            and apply them to your source audio's musical structure.
          </p>
        </div>
      </div>

      <AudioUploader
        onUpload={onUpload}
        currentFile={referenceAudio}
        label="Upload Reference Instrument"
        description="Upload a clean sample of your desired instrument or sound"
        variant="primary"
      />

      {referenceAudio && (
        <div className="mt-6 animate-fade-in">
          <WaveformDisplay audioFile={referenceAudio} variant="primary" />
        </div>
      )}
    </div>
  )
}
