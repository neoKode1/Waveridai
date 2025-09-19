'use client'

import React from 'react'
import { Upload } from 'lucide-react'
import { AudioUploader } from '@/components/audio/AudioUploader'
import { WaveformDisplay } from '@/components/audio/WaveformDisplay'
import { useWorkflowState } from '@/lib/hooks/useWorkflowState'
import { cn } from '@/lib/utils/cn'
import { logToTerminal } from '@/lib/utils/terminal-logger'

export const SourceUploadSection: React.FC = () => {
  const { 
    sourceAudio, 
    setSourceAudio, 
    currentStep, 
    progress
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
    
    console.log('🎵 SourceUploadSection: Source audio uploaded successfully', logData)
    logToTerminal('SourceUploadSection', 'Source audio uploaded successfully', logData)
    
    setSourceAudio(audioBuffer)
    
    console.log('🎵 SourceUploadSection: Moving to reference upload step')
    logToTerminal('SourceUploadSection', 'Moving to reference upload step')
  }

  return (
    <div className={cn(
      'bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 transition-all duration-300',
      isActive && 'ring-2 ring-primary-500/50 shadow-lg shadow-primary-500/20',
      isComplete && 'bg-success/10 border-success/30'
    )}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary-500 rounded-lg">
          <Upload className="h-5 w-5 text-white" />
        </div>
        <div>
                  <h2 className="text-xl font-semibold text-white">Make this sound like this</h2>
                  <p className="text-neutral-400 text-sm">
                    Upload the reference audio that you want to transform.
                  </p>
        </div>
      </div>

      <AudioUploader
        onUpload={handleUpload}
        accept={['audio/wav', 'audio/mp3', 'audio/flac']}
        maxSize={20 * 1024 * 1024} // 20 MB
                title="Drag & drop your reference audio here, or click to select"
                description="This is the audio you want to transform"
      />

      {sourceAudio && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-white mb-2">Reference Audio Preview</h3>
          <WaveformDisplay audioBuffer={sourceAudio} showControls={true} />
        </div>
      )}
    </div>
  )
}
