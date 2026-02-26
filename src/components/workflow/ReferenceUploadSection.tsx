'use client'

import React from 'react'
import { FileAudio, AlertCircle } from 'lucide-react'
import { AudioUploader } from '../audio/AudioUploader'

interface ReferenceUploadSectionProps {
  referenceFile: File | null
  onReferenceUpload: (file: File) => void
}

export const ReferenceUploadSection: React.FC<ReferenceUploadSectionProps> = ({
  referenceFile,
  onReferenceUpload,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-secondary-500/20 rounded-lg">
          <FileAudio className="h-5 w-5 text-secondary-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            Reference Audio
          </h3>
          <p className="text-sm text-neutral-400 mb-4">
            Upload a reference audio file to define the timbre and style for synthesis.
            This will be used to train your custom AI instrument.
          </p>
          
          <AudioUploader
            onUpload={onReferenceUpload}
            accept="audio/*"
            maxSize={50 * 1024 * 1024} // 50MB
          />
          
          {referenceFile && (
            <div className="mt-4 p-3 bg-secondary-500/10 border border-secondary-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileAudio className="h-4 w-4 text-secondary-400" />
                  <div>
                    <p className="text-sm font-medium text-white">{referenceFile.name}</p>
                    <p className="text-xs text-neutral-400">
                      {(referenceFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-start space-x-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-neutral-300">
          <strong className="text-blue-400">Tip:</strong> For best results, use high-quality reference audio
          with clear, isolated sounds. The AI will learn the timbre characteristics from this file.
        </p>
      </div>
    </div>
  )
}
