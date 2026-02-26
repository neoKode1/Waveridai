'use client'

import React from 'react'
import { WorkflowProgress } from './WorkflowProgress'
import { SourceUploadSection } from './SourceUploadSection'
import { ReferenceUploadSection } from './ReferenceUploadSection'
import { DesiredAudioSection } from './DesiredAudioSection'
import { GenerateSection } from './GenerateSection'
import { ResultsSection } from './ResultsSection'
import { useWorkflowState } from '@/lib/hooks/useWorkflowState'

export const WorkflowContainer: React.FC = () => {
  const { state, updateState } = useWorkflowState()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Workflow Progress */}
        <div className="mb-8">
          <WorkflowProgress currentStep={state.currentStep} />
        </div>

        {/* Main Workflow Sections */}
        <div className="space-y-6">
          {/* Step 1: Source Audio Upload */}
          <div className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 shadow-lg hover:shadow-primary-500/20">
            <SourceUploadSection
              onFileSelect={(file) => {
                updateState({ sourceAudio: file, currentStep: 2 })
              }}
              file={state.sourceAudio}
            />
          </div>

          {/* Step 2: Reference Audio Upload */}
          {state.currentStep >= 2 && (
            <div className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 shadow-lg hover:shadow-secondary-500/20 animate-slide-up">
              <ReferenceUploadSection
                onFileSelect={(file) => {
                  updateState({ referenceAudio: file, currentStep: 3 })
                }}
                file={state.referenceAudio}
              />
            </div>
          )}

          {/* Step 3: Desired Audio Description */}
          {state.currentStep >= 3 && (
            <div className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 shadow-lg hover:shadow-accent-purple/20 animate-slide-up">
              <DesiredAudioSection
                description={state.desiredAudioDescription}
                onDescriptionChange={(description) => {
                  updateState({ desiredAudioDescription: description })
                }}
              />
            </div>
          )}

          {/* Step 4: Generate Button */}
          {state.currentStep >= 3 && (
            <div className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 shadow-lg hover:shadow-accent-blue/20 animate-slide-up">
              <GenerateSection
                onGenerate={() => {
                  updateState({ isGenerating: true, currentStep: 4 })
                  // Simulate generation
                  setTimeout(() => {
                    updateState({ isGenerating: false, currentStep: 5 })
                  }, 3000)
                }}
                isGenerating={state.isGenerating}
                disabled={!state.sourceAudio || !state.desiredAudioDescription}
              />
            </div>
          )}

          {/* Step 5: Results */}
          {state.currentStep >= 5 && (
            <div className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 shadow-lg hover:shadow-accent-green/20 animate-slide-up">
              <ResultsSection
                resultAudio={state.resultAudio}
                onDownload={() => {
                  // Handle download
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
