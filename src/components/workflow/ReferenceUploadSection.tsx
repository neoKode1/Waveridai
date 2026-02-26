'use client'

import React, { useCallback } from 'react'
import { Upload, Music, FileAudio } from 'lucide-react'
import { AudioUploader } from '../audio/AudioUploader'

interface ReferenceUploadSectionProps {
  onFileUpload: (file: File) => void
  uploadedFile: File | null
}

export const ReferenceUploadSection: React.FC<ReferenceUploadSectionProps> = ({
  onFileUpload,
  uploadedFile,
}) => {
  const handleDrop = useCallback(
    (files: File[]) => {
      if (files.length > 0) {
        onFileUpload(files[0])
      }
    },
    [onFileUpload]
  )

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 gradient-primary rounded-lg">
          <Music className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Upload Reference Sound</h2>
      </div>
      
      <p className="text-neutral-400 mb-6">
        Upload a short audio sample that represents the sound or instrument you&apos;d like to create. 
        The AI will learn its characteristics and apply them to your source audio.
      </p>

      <AudioUploader
        onFileDrop={handleDrop}
        accept="audio/*"
        maxSize={50 * 1024 * 1024} // 50MB
      />

      {uploadedFile && (
        <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <FileAudio className="h-5 w-5 text-primary-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{uploadedFile.name}</p>
              <p className="text-xs text-neutral-400">
                {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
