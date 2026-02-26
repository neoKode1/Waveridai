'use client'

import React from 'react'
import { Zap, Loader2 } from 'lucide-react'

interface GenerateSectionProps {
  isGenerating: boolean
  onGenerate: () => void
  workflowMode: 'precise' | 'ai'
}

export const GenerateSection: React.FC<GenerateSectionProps> = ({
  isGenerating,
  onGenerate,
  workflowMode,
}) => {
  return (
    <div className="card text-center">
      <div className="max-w-2xl mx-auto">
        <div className={`inline-flex p-4 rounded-full mb-6 ${
          workflowMode === 'precise' ? 'gradient-primary' : 'gradient-secondary'
        }`}>
          {isGenerating ? (
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          ) : (
            <Zap className="h-8 w-8 text-white" />
          )}
        </div>

        <h2 className="text-2xl font-bold mb-3 text-white">
          {isGenerating ? 'Generating Your Audio...' : 'Ready to Generate'}
        </h2>
        
        <p className="text-neutral-400 mb-8">
          {isGenerating
            ? workflowMode === 'precise'
              ? 'Processing your audio through our neural synthesis pipeline. This may take a few moments.'
              : 'Our AI is creating your music. This usually takes 30-60 seconds.'
            : workflowMode === 'precise'
            ? 'Click below to start the neural synthesis process. We\'ll extract MIDI, train on your reference, and generate the final audio.'
            : 'Click below to generate your music using Google Lyria 2. The AI will create a complete arrangement based on your prompt.'}
        </p>

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`inline-flex items-center space-x-2 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            workflowMode === 'precise'
              ? 'button-primary shadow-xl hover:shadow-primary-500/30'
              : 'button-secondary shadow-xl hover:shadow-secondary-500/30'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Zap className="h-5 w-5" />
              <span>Generate Audio</span>
            </>
          )}
        </button>

        {isGenerating && (
          <div className="mt-8 animate-fade-in">
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div className={`h-full animate-pulse-slow ${
                workflowMode === 'precise' ? 'gradient-primary' : 'gradient-secondary'
              }`} style={{ width: '60%' }}></div>
            </div>
            <p className="text-sm text-neutral-500 mt-2">Processing audio...</p>
          </div>
        )}
      </div>
    </div>
  )
}
