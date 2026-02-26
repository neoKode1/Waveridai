'use client'

import React from 'react'
import { WorkflowProgress } from './WorkflowProgress'
import { SourceUploadSection } from './SourceUploadSection'
import { ReferenceUploadSection } from './ReferenceUploadSection'
import { DesiredAudioSection } from './DesiredAudioSection'
import { GenerateSection } from './GenerateSection'
import { ResultsSection } from './ResultsSection'
import { useWorkflowState } from '@/lib/hooks/useWorkflowState'
import { Sparkles, Layers } from 'lucide-react'

export const WorkflowContainer: React.FC = () => {
  const { state, dispatch } = useWorkflowState()

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Workflow Mode Selection */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-3xl font-bold mb-2 text-white">Choose Your Workflow</h2>
            <p className="text-neutral-400">Select the synthesis approach that fits your needs</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => dispatch({ type: 'SET_WORKFLOW_MODE', payload: 'precise' })}
              className={`card text-left transition-all duration-300 ${
                state.workflowMode === 'precise'
                  ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/20'
                  : 'hover:border-primary-500/30'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${
                  state.workflowMode === 'precise' ? 'gradient-primary' : 'bg-primary-500/10'
                }`}>
                  <Layers className="h-6 w-6 text-white" />
                </div>
                {state.workflowMode === 'precise' && (
                  <div className="px-3 py-1 bg-primary-500 text-white text-xs font-bold rounded-full">
                    ACTIVE
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Precise Synthesis</h3>
              <p className="text-neutral-400 text-sm">
                MIDI-based transformation with custom instrument training
              </p>
            </button>

            <button
              onClick={() => dispatch({ type: 'SET_WORKFLOW_MODE', payload: 'ai' })}
              className={`card text-left transition-all duration-300 ${
                state.workflowMode === 'ai'
                  ? 'border-secondary-500 bg-secondary-500/10 shadow-lg shadow-secondary-500/20'
                  : 'hover:border-secondary-500/30'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${
                  state.workflowMode === 'ai' ? 'gradient-secondary' : 'bg-secondary-500/10'
                }`}>
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                {state.workflowMode === 'ai' && (
                  <div className="px-3 py-1 bg-secondary-500 text-white text-xs font-bold rounded-full">
                    ACTIVE
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">AI Generation</h3>
              <p className="text-neutral-400 text-sm">
                Natural language music creation with Google Lyria 2
              </p>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <WorkflowProgress
            currentStep={state.currentStep}
            workflowMode={state.workflowMode}
          />
        </div>

        {/* Workflow Steps */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className={`transition-all duration-300 ${
            state.currentStep >= 1 ? 'opacity-100' : 'opacity-50 pointer-events-none'
          }`}>
            <SourceUploadSection
              sourceAudio={state.sourceAudio}
              onUpload={(file) => dispatch({ type: 'SET_SOURCE_AUDIO', payload: file })}
              workflowMode={state.workflowMode}
            />
          </div>

          {state.workflowMode === 'precise' && (
            <div className={`transition-all duration-300 ${
              state.currentStep >= 2 ? 'opacity-100' : 'opacity-50 pointer-events-none'
            }`}>
              <ReferenceUploadSection
                referenceAudio={state.referenceAudio}
                onUpload={(file) => dispatch({ type: 'SET_REFERENCE_AUDIO', payload: file })}
              />
            </div>
          )}

          {state.workflowMode === 'ai' && (
            <div className={`transition-all duration-300 ${
              state.currentStep >= 2 ? 'opacity-100' : 'opacity-50 pointer-events-none'
            }`}>
              <DesiredAudioSection
                desiredAudioDescription={state.desiredAudioDescription}
                onChange={(description) =>
                  dispatch({ type: 'SET_DESIRED_AUDIO_DESCRIPTION', payload: description })
                }
              />
            </div>
          )}

          <div className={`transition-all duration-300 ${
            state.currentStep >= 3 ? 'opacity-100' : 'opacity-50 pointer-events-none'
          }`}>
            <GenerateSection
              isGenerating={state.isGenerating}
              onGenerate={() => dispatch({ type: 'SET_IS_GENERATING', payload: true })}
              workflowMode={state.workflowMode}
            />
          </div>

          {state.resultAudio && (
            <div className="animate-fade-in">
              <ResultsSection
                resultAudio={state.resultAudio}
                onDownload={() => {
                  // Download logic
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
