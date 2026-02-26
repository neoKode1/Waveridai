'use client'

import React from 'react'
import { FileText, Sparkles } from 'lucide-react'

interface DesiredAudioSectionProps {
  description: string
  onDescriptionChange: (description: string) => void
}

export const DesiredAudioSection: React.FC<DesiredAudioSectionProps> = ({
  description,
  onDescriptionChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-accent-purple rounded-lg shadow-lg shadow-accent-purple/50">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Describe Desired Output</h3>
          <p className="text-sm text-neutral-400">Tell the AI how you want the output to sound</p>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describe the characteristics of your desired output... (e.g., 'warm vintage synthesizer with slight reverb')" 
          className="w-full h-32 input resize-none bg-neutral-900/50 border border-white/10 backdrop-blur-sm focus:border-accent-purple focus:ring-accent-purple"
        />
        <div className="absolute bottom-3 right-3">
          <Sparkles className="h-4 w-4 text-accent-purple" />
        </div>
      </div>

      <div className="flex items-center space-x-2 text-xs text-neutral-400">
        <span>💡 Tip:</span>
        <span>Be specific about tone, texture, and effects for best results</span>
      </div>
    </div>
  )
}
