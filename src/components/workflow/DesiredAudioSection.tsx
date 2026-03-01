'use client'

import React, { useState } from 'react'
import { useWorkflow } from '@/contexts/WorkflowContext'
import { Wand2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export const DesiredAudioSection: React.FC = () => {
  const { state, actions } = useWorkflow()
  const [description, setDescription] = useState(state.desiredAudioDescription || '')
  const [customPrompt, setCustomPrompt] = useState('')
  const isDisabled = !state.sourceAudio

  const prompts = [
    { label: 'Piano', value: 'Convert this audio to sound like a grand piano', icon: '🎹' },
    { label: 'Guitar', value: 'Transform this into acoustic guitar', icon: '🎸' },
    { label: 'Violin', value: 'Make this sound like a violin orchestra', icon: '🎻' },
    { label: 'Synth', value: 'Convert to electronic synthesizer', icon: '🎛️' },
    { label: 'Orchestral', value: 'Transform into full orchestral arrangement', icon: '🎼' },
    { label: 'Jazz Band', value: 'Convert to jazz band with piano, bass, and drums', icon: '🎺' },
  ]

  const handleSubmit = () => {
    const finalDescription = customPrompt || description
    if (finalDescription) {
      actions.setDesiredAudioDescription(finalDescription)
      actions.setCurrentStep('reference')
    }
  }

  const handlePromptSelect = (prompt: string) => {
    setDescription(prompt)
    setCustomPrompt('')
  }

  return (
    <section className={cn('card space-y-6', isDisabled && 'opacity-50 pointer-events-none')}>
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-gradient-secondary rounded-xl shadow-glow-cyan">
          <Wand2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gradient">Step 2: Describe Desired Sound</h2>
          <p className="text-neutral-400 mt-1">
            Tell us what instrument or sound you want to create
          </p>
        </div>
      </div>

      {isDisabled && (
        <div className="p-4 bg-warning/10 border border-warning/30 rounded-xl">
          <p className="text-warning text-sm font-medium">
            Please upload source audio first
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-3">
            Quick Prompts
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {prompts.map((prompt) => (
              <button
                key={prompt.label}
                onClick={() => handlePromptSelect(prompt.value)}
                className={cn(
                  'p-4 rounded-xl border-2 text-left transition-all duration-300 group relative overflow-hidden',
                  description === prompt.value
                    ? 'border-primary-500 bg-primary-500/10 shadow-glow'
                    : 'border-neutral-700 bg-neutral-900/50 hover:border-primary-500/50 hover:bg-neutral-800/50'
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="text-2xl mb-2">{prompt.icon}</div>
                  <div className="text-sm font-medium text-neutral-100 group-hover:text-primary-300 transition-colors">
                    {prompt.label}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-3">
            Or write your own description
          </label>
          <div className="relative">
            <textarea
              value={customPrompt}
              onChange={(e) => {
                setCustomPrompt(e.target.value)
                setDescription('')
              }}
              placeholder="Describe the sound you want to create... (e.g., 'A warm, vintage jazz piano with soft reverb')";
              className="w-full h-32 input resize-none pr-12"
            />
            <Sparkles className="absolute top-4 right-4 h-5 w-5 text-primary-400 animate-pulse" />
          </div>
        </div>

        {(description || customPrompt) && (
          <div className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl animate-fade-in">
            <p className="text-sm text-primary-300 font-medium mb-2">Your prompt:</p>
            <p className="text-neutral-200">{customPrompt || description}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!description && !customPrompt}
          className="button-primary w-full !py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wand2 className="h-5 w-5 mr-2" />
          Continue to Reference Audio
        </button>
      </div>
    </section>
  )
}
