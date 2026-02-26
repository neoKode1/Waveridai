'use client'

import React from 'react'
import { Download, Play, Pause, RotateCcw } from 'lucide-react'
import { WaveformDisplay } from '../audio/WaveformDisplay'

interface ResultsSectionProps {
  resultAudio: File | null
  onDownload: () => void
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  resultAudio,
  onDownload,
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false)

  if (!resultAudio) return null

  return (
    <div className="card border-accent-green/30 bg-accent-green/5">
      <div className="flex items-start space-x-4 mb-6">
        <div className="p-3 bg-accent-green/20 rounded-lg">
          <Play className="h-6 w-6 text-accent-green" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2 text-white">Your Audio is Ready!</h2>
          <p className="text-neutral-400">
            Preview your generated audio below and download when you're ready.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <WaveformDisplay audioFile={resultAudio} variant="primary" />

        <div className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 gradient-primary rounded-lg hover:scale-110 transition-transform"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-white" />
              ) : (
                <Play className="h-5 w-5 text-white" />
              )}
            </button>
            <div>
              <p className="text-sm font-medium text-white">{resultAudio.name}</p>
              <p className="text-xs text-neutral-500">
                {(resultAudio.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors text-white"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="text-sm">Regenerate</span>
            </button>
            <button
              onClick={onDownload}
              className="button-primary flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
