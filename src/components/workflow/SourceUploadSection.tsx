'use client'

import React from 'react'
import { Upload, Music } from 'lucide-react'
import { AudioUploader } from '@/components/audio/AudioUploader'

interface SourceUploadSectionProps {
  onFileSelect: (file: File) => void
  file: File | null
}

export const SourceUploadSection: React.FC<SourceUploadSectionProps> = ({
  onFileSelect,
  file,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 gradient-primary rounded-lg shadow-lg shadow-primary-500/50">
          <Upload className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Upload Source Audio</h3>
          <p className="text-sm text-neutral-400">Upload the audio you want to transform</p>
        </div>
      </div>

      <AudioUploader
        onFileSelect={onFileSelect}
        accept="audio/*"
        maxSize={50 * 1024 * 1024} // 50MB
        label="Drop your audio file here or click to browse"
      />

      {file && (
        <div className="glass rounded-lg p-4 flex items-center space-x-3 animate-slide-up border border-white/10">
          <Music className="h-5 w-5 text-primary-400" />
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
