'use client'

import React from 'react'
import { Upload, FileAudio } from 'lucide-react'
import { AudioUploader } from '@/components/audio/AudioUploader'
import { WaveformDisplay } from '@/components/audio/WaveformDisplay'
import { useWorkflowState } from '@/lib/hooks/useWorkflowState'
import { cn } from '@/lib/utils/cn'

interface SourceUploadSectionProps {
  isActive: boolean
  onComplete: () => void
  onBack: () => void
}

export const SourceUploadSection: React.FC<SourceUploadSectionProps> = ({
  isActive,
  onComplete,
  onBack,
}) => {
  const { sourceAudio, setSourceAudio } = useWorkflowState()

  const handleUpload = (file: File) => {
    setSourceAudio(file)
  }

  const handleRemove = () => {
    setSourceAudio(null)
  }

  return (
    <div
      className={cn(
        'card transition-all duration-200',
        isActive ? 'ring-2 ring-primary-500' : 'opacity-50'
      )}
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-secondary-500/10 rounded-lg">
          <FileAudio className="h-6 w-6 text-secondary-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-neutral-100 mb-2">
            Step 2: Upload Source Audio
          </h2>
          <p className="text-neutral-400 mb-4">
            Upload the source audio file you want to transform using the reference sound.
          </p>

          {!sourceAudio ? (
            <AudioUploader
              onUpload={handleUpload}
              accept="audio/*"
              maxSize={50 * 1024 * 1024}
              label="Drop source audio here or click to browse"
              icon={<Upload className="h-8 w-8" />}
            />
          ) : (
            <div className="space-y-4">
              <WaveformDisplay
                audioFile={sourceAudio}
                onRemove={handleRemove}
                title="Source Audio"
              />
              <div className="flex space-x-4">
                <button
                  onClick={onBack}
                  disabled={!isActive}
                  className={cn(
                    'button-secondary flex-1',
                    !isActive && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  Back
                </button>
                <button
                  onClick={onComplete}
                  disabled={!isActive}
                  className={cn(
                    'button-primary flex-1',
                    !isActive && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  Continue to Desired Audio
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
