'use client'

import React from 'react'
import { Download, Play, Sparkles } from 'lucide-react'
import { WaveformDisplay } from '../audio/WaveformDisplay'

interface ResultsSectionProps {
  audioUrl: string | null
  isProcessing: boolean
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  audioUrl,
  isProcessing,
}) => {
  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement('a')
      a.href = audioUrl
      a.download = 'synthesized-audio.wav'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 gradient-primary rounded-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Your Synthesized Audio</h2>
        </div>
        
        {audioUrl && (
          <button
            onClick={handleDownload}
            className="button-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        )}
      </div>

      {isProcessing ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="text-neutral-400">Processing your audio...</p>
        </div>
      ) : audioUrl ? (
        <div className="space-y-6">
          <WaveformDisplay audioUrl={audioUrl} />
          
          <div className="flex items-center justify-center">
            <audio controls src={audioUrl} className="w-full max-w-2xl">
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="p-4 gradient-primary rounded-full w-fit mx-auto mb-4 opacity-50">
            <Play className="h-8 w-8 text-white" />
          </div>
          <p className="text-neutral-400">Your synthesized audio will appear here</p>
        </div>
      )}
    </div>
  )
}
