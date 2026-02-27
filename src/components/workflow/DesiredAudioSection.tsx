'use client'

import React from 'react'
import { Upload, Mic, MessageSquare } from 'lucide-react'
import { AudioUploader } from '@/components/audio/AudioUploader'
import { WaveformDisplay } from '@/components/audio/WaveformDisplay'
import { useWorkflowState } from '@/lib/hooks/useWorkflowState'
import { cn } from '@/lib/utils/cn'

interface DesiredAudioSectionProps {
  isActive: boolean
  onComplete: () => void
  onBack: () => void
}

export const DesiredAudioSection: React.FC<DesiredAudioSectionProps> = ({
  isActive,
  onComplete,
  onBack,
}) => {
  const {
    desiredAudio,
    setDesiredAudio,
    desiredAudioDescription,
    setDesiredAudioDescription,
  } = useWorkflowState()

  const [useTextInput, setUseTextInput] = React.useState(false)

  const handleUpload = (file: File) => {
    setDesiredAudio(file)
    setDesiredAudioDescription('') // Clear text if file uploaded
  }

  const handleRemove = () => {
    setDesiredAudio(null)
  }

  const handleTextSubmit = () => {
    if (desiredAudioDescription.trim()) {
      onComplete()
    }
  }

  const canProceed = desiredAudio !== null || desiredAudioDescription.trim().length > 0

  return (
    <div
      className={cn(
        'card transition-all duration-200',
        isActive ? 'ring-2 ring-primary-500' : 'opacity-50'
      )}
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-accent-purple/10 rounded-lg">
          <Mic className="h-6 w-6 text-accent-purple" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-neutral-100 mb-2">
            Step 3: Specify Desired Audio
          </h2>
          <p className="text-neutral-400 mb-4">
            Either upload a desired audio sample or describe what you want using text (AI generation).
          </p>

          {/* Toggle between upload and text input */}
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setUseTextInput(false)}
              disabled={!isActive}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-all',
                !useTextInput
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700',
                !isActive && 'opacity-50 cursor-not-allowed'
              )}
            >
              Upload Audio
            </button>
            <button
              onClick={() => setUseTextInput(true)}
              disabled={!isActive}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-all',
                useTextInput
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700',
                !isActive && 'opacity-50 cursor-not-allowed'
              )}
            >
              AI Generation (Text)
            </button>
          </div>

          {!useTextInput ? (
            // Audio upload mode
            !desiredAudio ? (
              <AudioUploader
                onUpload={handleUpload}
                accept="audio/*"
                maxSize={50 * 1024 * 1024}
                label="Drop desired audio here or click to browse"
                icon={<Upload className="h-8 w-8" />}
              />
            ) : (
              <div className="space-y-4">
                <WaveformDisplay
                  audioFile={desiredAudio}
                  onRemove={handleRemove}
                  title="Desired Audio"
                />
              </div>
            )
          ) : (
            // Text input mode (AI Generation)
            <div className="space-y-4">
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-neutral-500" />
                <textarea
                  value={desiredAudioDescription}
                  onChange={(e) => setDesiredAudioDescription(e.target.value)}
                  disabled={!isActive}
                  placeholder="Describe the music you want to generate (e.g., 'upbeat electronic dance music with synthesizers')..."
                  className={cn(
                    'w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg',
                    'text-neutral-100 placeholder:text-neutral-500',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    'min-h-[120px] resize-y',
                    !isActive && 'opacity-50 cursor-not-allowed'
                  )}
                />
              </div>
              <p className="text-xs text-neutral-500">
                Powered by Google Lyria 2 - High-quality AI music generation
              </p>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex space-x-4 mt-4">
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
              onClick={useTextInput ? handleTextSubmit : onComplete}
              disabled={!isActive || !canProceed}
              className={cn(
                'button-primary flex-1',
                (!isActive || !canProceed) && 'opacity-50 cursor-not-allowed'
              )}
            >
              Continue to Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
