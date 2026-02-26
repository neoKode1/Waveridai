'use client'

import React from 'react'
import { Sparkles, Zap } from 'lucide-react'

interface GenerateSectionProps {
  onGenerate: () => void
  isGenerating: boolean
  disabled: boolean
}

export const GenerateSection: React.FC<GenerateSectionProps> = ({
  onGenerate,
  isGenerating,
  disabled,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-accent-blue rounded-lg shadow-lg shadow-accent-blue/50">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Generate Audio</h3>
          <p className="text-sm text-neutral-400">Process your audio with AI synthesis</p>
        </div>
      </div>

      <div className="flex flex-col items-center py-8">
        <button
          onClick={onGenerate}
          disabled={disabled || isGenerating}
          className="
            button-primary flex items-center space-x-3 text-lg px-8 py-4
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-xl shadow-primary-500/30
            hover:shadow-2xl hover:shadow-primary-500/40
            hover:scale-105 active:scale-95
            transition-all duration-200
            relative overflow-hidden
            group
          "
        >
          {isGenerating ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 animate-pulse" />
              <Zap className="h-5 w-5 animate-pulse relative z-10" />
              <span className="relative z-10">Generating...</span>
            </>
          ) : (
            <>
              <Zap className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              <span>Generate Audio</span>
            </>
          )}
        </button>

        {isGenerating && (
          <div className="mt-6 w-full max-w-md">
            <div className="glass rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-300">Processing audio...</span>
                <span className="text-sm text-primary-400 font-medium">AI Active</span>
              </div>
              <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-primary animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
