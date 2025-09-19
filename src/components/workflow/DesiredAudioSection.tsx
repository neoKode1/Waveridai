'use client'

import React from 'react'
import { Upload } from 'lucide-react'
import { AudioUploader } from '@/components/audio/AudioUploader'
import { WaveformDisplay } from '@/components/audio/WaveformDisplay'
import { useWorkflowState } from '@/lib/hooks/useWorkflowState'
import { cn } from '@/lib/utils/cn'
import { logToTerminal } from '@/lib/utils/terminal-logger'

export const DesiredAudioSection: React.FC = () => {
  const { 
    setReferenceAudio, 
    currentStep, 
    progress,
    setCurrentStep
  } = useWorkflowState()

  // For the desired audio, we'll use a separate state
  const [desiredAudio, setDesiredAudio] = React.useState<AudioBuffer | null>(null)

  const isActive = currentStep === 'upload_desired'
  const isComplete = progress.upload_desired === 100

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
    
    console.log('🎵 DesiredAudioSection: Desired audio uploaded successfully', logData)
    logToTerminal('DesiredAudioSection', 'Desired audio uploaded successfully', logData)
    
    setDesiredAudio(audioBuffer)
    setReferenceAudio(audioBuffer) // Store as referenceAudio for the workflow
    setCurrentStep('generate')
    
    console.log('🎵 DesiredAudioSection: Moving to generate step')
    logToTerminal('DesiredAudioSection', 'Moving to generate step')
  }

  return (
    <div className={cn(
      'bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 transition-all duration-300',
      isActive && 'ring-2 ring-primary-500/50 shadow-lg shadow-primary-500/20',
      isComplete && 'bg-success/10 border-success/30',
      !useWorkflowState.getState().sourceAudio && 'opacity-50 pointer-events-none' // Disable if no reference audio
    )}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary-500 rounded-lg">
          <Upload className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">To sound like this</h2>
          <p className="text-neutral-400 text-sm">
            Upload the audio that represents how you want your reference to sound.
          </p>
        </div>
      </div>

      <AudioUploader
        onUpload={handleUpload}
        accept={['audio/wav', 'audio/mp3', 'audio/flac']}
        maxSize={20 * 1024 * 1024} // 20 MB
        title="Drag & drop your desired sound here, or click to select"
        description="This is how you want your reference audio to sound"
      />

      {desiredAudio && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-white mb-2">Desired Sound Preview</h3>
          <WaveformDisplay
            audioBuffer={desiredAudio}
            height={150}
            showControls={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-black/20 rounded-lg mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-400">
                {desiredAudio.sampleRate.toLocaleString()} Hz
              </div>
              <div className="text-sm text-neutral-400">Sample Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-400">
                {desiredAudio.numberOfChannels}
              </div>
              <div className="text-sm text-neutral-400">Channels</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-400">
                {desiredAudio.duration.toFixed(1)}s
              </div>
              <div className="text-sm text-neutral-400">Duration</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
