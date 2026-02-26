'use client'

import React from 'react'
import { Music, Info } from 'lucide-react'
import { AudioUploader } from '@/components/audio/AudioUploader'

interface ReferenceUploadSectionProps {
  onFileSelect: (file: File) => void
  file: File | null
}

export const ReferenceUploadSection: React.FC<ReferenceUploadSectionProps> = ({
  onFileSelect,
  file,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 gradient-secondary rounded-lg shadow-lg shadow-secondary-500/50">
          <Music className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Upload Reference Audio</h3>
          <p className="text-sm text-neutral-400">This defines the target sound/instrument</p>
        </div>
      </div>

      <div className="glass rounded-lg p-4 flex items-start space-x-3 border border-white/10">
        <Info className="h-5 w-5 text-accent-blue flex-shrink-0 mt-0.5" />
        <p className="text-sm text-neutral-300">
          Upload a sample of the instrument or sound you want to synthesize to. The AI will learn its characteristics.
        </p>
      </div>

      <AudioUploader
        onFileSelect={onFileSelect}
        accept="audio/*"
        maxSize={50 * 1024 * 1024}
        label="Drop your reference audio file here"
      />

      {file && (
        <div className="glass rounded-lg p-4 flex items-center space-x-3 animate-slide-up border border-white/10">
          <Music className="h-5 w-5 text-secondary-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">{file.name}</p>
            <p className="text-xs text-neutral-400">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
