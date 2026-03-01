'use client'

import React, { useState } from 'react'
import { Music, Sparkles, Wand2, Mic } from 'lucide-react'

interface DesiredAudioSectionProps {
  audioFile: File | null
  customPrompt: string
  setCustomPrompt: (prompt: string) => void
  description: string
  setDescription: (desc: string) => void
}

export const DesiredAudioSection: React.FC<DesiredAudioSectionProps> = ({
  audioFile,
  customPrompt,
  setCustomPrompt,
  description,
  setDescription,
}) => {
  const [activeTab, setActiveTab] = useState<'custom' | 'presets'>('custom')

  const presetPrompts = [
    {
      title: 'Vintage Jazz Piano',
      description: 'Warm, vintage jazz piano with soft reverb and natural room acoustics',
      icon: Music,
    },
    {
      title: 'Synthwave Lead',
      description: 'Retro 80s synthwave lead with lush chorus and tape saturation',
      icon: Wand2,
    },
    {
      title: 'Orchestral Strings',
      description: 'Rich orchestral string section with cinematic reverb and subtle vibrato',
      icon: Music,
    },
    {
      title: 'Lo-fi Hip Hop',
      description: 'Warm lo-fi hip hop sound with vinyl crackle and tape wobble',
      icon: Mic,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-secondary-500/20 to-secondary-600/20 rounded-xl border border-secondary-500/30">
            <Sparkles className="h-6 w-6 text-secondary-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-50">Desired Sound</h2>
            <p className="text-sm text-neutral-400">Define your target audio characteristics</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 p-1 bg-neutral-900/50 rounded-xl border border-neutral-800/50">
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeTab === 'custom'
              ? 'bg-gradient-to-br from-primary-500/20 to-primary-600/20 text-primary-400 border border-primary-500/30'
              : 'text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800/30'
          }`}
        >
          Custom Prompt
        </button>
        <button
          onClick={() => setActiveTab('presets')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeTab === 'presets'
              ? 'bg-gradient-to-br from-secondary-500/20 to-secondary-600/20 text-secondary-400 border border-secondary-500/30'
              : 'text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800/30'
          }`}
        >
          Presets
        </button>
      </div>

      {/* Custom Prompt Tab */}
      {activeTab === 'custom' && (
        <div className="space-y-4 animate-fade-in">
          <div className="relative">
            <textarea
              value={customPrompt}
              onChange={(e) => {
                setCustomPrompt(e.target.value)
                setDescription('')
              }}
              placeholder="Describe the sound you want to create... (e.g., 'A warm, vintage jazz piano with soft reverb')"
              className="w-full h-32 input resize-none pr-12"
            />
            <Sparkles className="absolute top-4 right-4 h-5 w-5 text-primary-400 animate-pulse" />
          </div>
          
          <div className="p-4 bg-neutral-900/30 rounded-xl border border-neutral-800/50">
            <p className="text-sm text-neutral-400">
              <strong className="text-neutral-300">Tip:</strong> Be specific about timbre, texture, effects, and mood. 
              The more detail you provide, the better the AI can match your vision.
            </p>
          </div>
        </div>
      )}

      {/* Presets Tab */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {presetPrompts.map((preset, index) => (
            <button
              key={index}
              onClick={() => {
                setDescription(preset.description)
                setCustomPrompt('')
              }}
              className={`p-5 rounded-xl border transition-all duration-300 text-left group ${
                description === preset.description
                  ? 'bg-gradient-to-br from-secondary-500/20 to-secondary-600/20 border-secondary-500/50'
                  : 'bg-neutral-900/30 border-neutral-800/50 hover:border-neutral-700/50 hover:bg-neutral-800/30'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  description === preset.description
                    ? 'bg-secondary-500/20 text-secondary-400'
                    : 'bg-neutral-800/50 text-neutral-400 group-hover:bg-neutral-700/50'
                }`}>
                  <preset.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold mb-1 transition-colors ${
                    description === preset.description
                      ? 'text-secondary-400'
                      : 'text-neutral-300 group-hover:text-neutral-200'
                  }`}>
                    {preset.title}
                  </h3>
                  <p className="text-sm text-neutral-400">
                    {preset.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected Description Display */}
      {(customPrompt || description) && (
        <div className="p-4 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-xl border border-primary-500/20 animate-slide-up">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-primary-500/20 rounded-lg">
              <Wand2 className="h-4 w-4 text-primary-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-primary-400 mb-1">Active Prompt</h4>
              <p className="text-sm text-neutral-300">
                {customPrompt || description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
