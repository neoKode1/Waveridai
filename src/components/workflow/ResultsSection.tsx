'use client'

import React from 'react'
import { Download, Share2, Loader2 } from 'lucide-react'
import { WaveformDisplay } from '../audio/WaveformDisplay'

interface ResultsSectionProps {
  isProcessing: boolean
  resultAudio: string | null
  onDownload: () => void
  isPlaying: boolean
  onPlayPause: () => void
  currentTime: number
  duration: number
  onSeek: (time: number) => void
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  isProcessing,
  resultAudio,
  onDownload,
  isPlaying,
  onPlayPause,
  currentTime,
  duration,
  onSeek,
}) => {
  if (isProcessing) {
    return (
      <div className="glass p-8 rounded-xl">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 text-primary-400 animate-spin" />
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">Processing Audio</h3>
            <p className="text-neutral-400">This may take a few moments...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!resultAudio) {
    return (
      <div className="glass p-8 rounded-xl">
        <div className="text-center text-neutral-400">
          <p>No results yet. Process some audio to see results here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Results</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={onDownload}
            className="button-primary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
          <button className="glass glass-hover p-2 rounded-lg">
            <Share2 className="h-4 w-4 text-neutral-300" />
          </button>
        </div>
      </div>

      <WaveformDisplay
        audioUrl={resultAudio}
        isPlaying={isPlaying}
        onPlayPause={onPlayPause}
        currentTime={currentTime}
        duration={duration}
        onSeek={onSeek}
      />
    </div>
  )
}
