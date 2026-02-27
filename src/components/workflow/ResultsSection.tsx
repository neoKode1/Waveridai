'use client'

import React from 'react'
import { Download, RotateCcw, CheckCircle } from 'lucide-react'
import { WaveformDisplay } from '@/components/audio/WaveformDisplay'
import { useWorkflowState } from '@/lib/hooks/useWorkflowState'
import { cn } from '@/lib/utils/cn'

interface ResultsSectionProps {
  isActive: boolean
  onBack: () => void
  onReset: () => void
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  isActive,
  onBack,
  onReset,
}) => {
  const { generatedAudio, resetWorkflow } = useWorkflowState()

  const handleDownload = () => {
    if (!generatedAudio) return

    const url = URL.createObjectURL(generatedAudio)
    const a = document.createElement('a')
    a.href = url
    a.download = `waveridai-generated-${Date.now()}.wav`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    resetWorkflow()
    onReset()
  }

  // Convert Blob to File for WaveformDisplay
  const generatedFile = React.useMemo(() => {
    if (!generatedAudio) return null
    return new File([generatedAudio], 'generated-audio.wav', { type: 'audio/wav' })
  }, [generatedAudio])

  return (
    <div
      className={cn(
        'card transition-all duration-200',
        isActive ? 'ring-2 ring-primary-500' : 'opacity-50'
      )}
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-success/10 rounded-lg">
          <CheckCircle className="h-6 w-6 text-success" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-neutral-100 mb-2">
            Step 5: Results
          </h2>
          <p className="text-neutral-400 mb-4">
            Your audio has been generated successfully. Preview and download your result.
          </p>

          {generatedFile ? (
            <div className="space-y-4">
              <WaveformDisplay
                audioFile={generatedFile}
                title="Generated Audio"
                showRemove={false}
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
                  Back to Generate
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!isActive}
                  className={cn(
                    'button-primary flex-1 flex items-center justify-center space-x-2',
                    !isActive && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                <button
                  onClick={handleReset}
                  disabled={!isActive}
                  className={cn(
                    'bg-neutral-700 hover:bg-neutral-600 text-neutral-100',
                    'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                    'flex items-center justify-center space-x-2',
                    !isActive && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Start Over</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-900 rounded-lg p-8 text-center">
              <p className="text-neutral-400">No generated audio available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
