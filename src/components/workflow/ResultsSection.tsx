'use client'

import React from 'react'
import { Download, CheckCircle } from 'lucide-react'

interface ResultsSectionProps {
  resultAudio: string | null
  onDownload: () => void
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  resultAudio,
  onDownload,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-accent-green rounded-lg shadow-lg shadow-accent-green/50">
          <CheckCircle className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Generation Complete!</h3>
          <p className="text-sm text-neutral-400">Your audio has been successfully synthesized</p>
        </div>
      </div>

      <div className="glass rounded-lg p-6 border border-white/10">
        {/* Audio Player Placeholder */}
        <div className="bg-neutral-900/50 rounded-lg p-8 mb-4 border border-white/5">
          <div className="flex items-center justify-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/50">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-primary" style={{ width: '30%' }} />
              </div>
            </div>
            <span className="text-sm text-neutral-400">0:45 / 2:30</span>
          </div>
        </div>

        <button
          onClick={onDownload}
          className="
            button-primary w-full flex items-center justify-center space-x-2
            shadow-lg shadow-primary-500/30
            hover:shadow-xl hover:shadow-primary-500/40
          "
        >
          <Download className="h-5 w-5" />
          <span>Download Result</span>
        </button>
      </div>

      <div className="glass rounded-lg p-4 border border-white/10">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gradient">48kHz</p>
            <p className="text-xs text-neutral-400">Sample Rate</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gradient">Stereo</p>
            <p className="text-xs text-neutral-400">Channels</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gradient">2:30</p>
            <p className="text-xs text-neutral-400">Duration</p>
          </div>
        </div>
      </div>
    </div>
  )
}
