'use client'

import React from 'react'
import { Upload, Music } from 'lucide-react'
import { AudioUploader } from '@/components/audio/AudioUploader'
import { WaveformDisplay } from '@/components/audio/WaveformDisplay'
import { useWorkflowState } from '@/lib/hooks/useWorkflowState'
import { cn } from '@/lib/utils/cn'

interface ReferenceUploadSectionProps {
  isActive: boolean
  onComplete: () => void
}

export const ReferenceUploadSection: React.FC<ReferenceUploadSectionProps> = ({
  isActive,
  onComplete,
}) => {
  const { referenceAudio, setReferenceAudio } = useWorkflowState()

  const handleUpload = (file: File) => {
    setReferenceAudio(file)
  }

  const handleRemove = () => {
    setReferenceAudio(null)
  }

  return (
    <div
      className={cn(
        'card transition-all duration-200',
        isActive ? 'ring-2 ring-primary-500' : 'opacity-50'
      )}
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-primary-500/10 rounded-lg">
          <Music className="h-6 w-6 text-primary-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-neutral-100 mb-2">
            Step 1: Upload Reference Audio
          </h2>
          <p className="text-neutral-400 mb-4">
            Upload a reference audio file that represents the desired sound/instrument you want to
            synthesize to.
          </p>

          {!referenceAudio ? (
            <AudioUploader
              onUpload={handleUpload}
              accept="audio/*"
              maxSize={50 * 1024 * 1024}
              label="Drop reference audio here or click to browse"
              icon={<Upload className="h-8 w-8" />}
            />
          ) : (
            <div className="space-y-4">
              <WaveformDisplay
                audioFile={referenceAudio}
                onRemove={handleRemove}
                title="Reference Audio"
              />
              <button
                onClick={onComplete}
                disabled={!isActive}
                className={cn(
                  'button-primary w-full',
                  !isActive && 'opacity-50 cursor-not-allowed'
                )}
              >
                Continue to Source Audio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
