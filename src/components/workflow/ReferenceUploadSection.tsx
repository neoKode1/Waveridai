'use client'

import React from 'react'
import { Upload } from 'lucide-react'
import { AudioUploader } from '@/components/audio/AudioUploader'
import { WaveformDisplay } from '@/components/audio/WaveformDisplay'
import { useWorkflowState } from '@/lib/hooks/useWorkflowState'
import { cn } from '@/lib/utils/cn'
import { logToTerminal } from '@/lib/utils/terminal-logger'

export const ReferenceUploadSection: React.FC = () => {
  const { 
    referenceAudio, 
    setReferenceAudio, 
    currentStep, 
    progress,
    sourceAudio
  } = useWorkflowState()

  const isActive = currentStep === 'upload_reference'
  const isComplete = progress.upload_reference === 100

  const handleUpload = (file: File, audioBuffer: AudioBuffer) => {
    const logData = {
      fileName: file.name,
      fileSize: file.size,
      duration: audioBuffer.duration,
      sampleRate: audioBuffer.sampleRate,
      channels: audioBuffer.numberOfChannels,
      audioBufferType: typeof audioBuffer,
      hasGetChannelData: typeof audioBuffer.getChannelData
    }
    
    console.log('🎵 ReferenceUploadSection: Reference audio uploaded successfully', logData)
    logToTerminal('ReferenceUploadSection', 'Reference audio uploaded successfully', logData)
    
    setReferenceAudio(audioBuffer)
    
    console.log('🎵 ReferenceUploadSection: Moving to generate step')
    logToTerminal('ReferenceUploadSection', 'Moving to generate step')
  }

  return (
    <div className={cn(
      'bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 transition-all duration-300',
      isActive && 'ring-2 ring-primary-500/50 shadow-lg shadow-primary-500/20',
      isComplete && 'bg-success/10 border-success/30',
      !sourceAudio && 'opacity-50 pointer-events-none'
    )}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary-500 rounded-lg">
          <Upload className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Upload Reference Audio</h2>
          <p className="text-neutral-400 text-sm">
            Upload the sound you want your source audio to become.
          </p>
        </div>
      </div>

      <AudioUploader
        onUpload={handleUpload}
        accept={['audio/wav', 'audio/mp3', 'audio/flac']}
        maxSize={20 * 1024 * 1024} // 20 MB
        title="Drag & drop your reference audio here, or click to select"
        description="This is the target sound/style you want to achieve"
      />

      {referenceAudio && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-white mb-2">Reference Audio Preview</h3>
          <WaveformDisplay audioBuffer={referenceAudio} showControls={true} />
        </div>
      )}

      {!sourceAudio && (
        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-400 text-sm">
            ⚠️ Please upload your source audio first before uploading reference audio.
          </p>
        </div>
      )}
    </div>
  )
}
