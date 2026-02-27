'use client'

import React from 'react'
import { StudioHeader } from './StudioHeader'
import { WorkflowProgress } from './WorkflowProgress'
import { ReferenceUploadSection } from './ReferenceUploadSection'
import { SourceUploadSection } from './SourceUploadSection'
import { DesiredAudioSection } from './DesiredAudioSection'
import { GenerateSection } from './GenerateSection'
import { ResultsSection } from './ResultsSection'
import { useWorkflowState } from '@/lib/hooks/useWorkflowState'

export const WorkflowContainer: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
    referenceAudio,
    setReferenceAudio,
    sourceAudio,
    setSourceAudio,
    desiredAudioDescription,
    setDesiredAudioDescription,
    generatedAudio,
    setGeneratedAudio,
    isGenerating,
    setIsGenerating
  } = useWorkflowState()

  return (
    <div className="min-h-screen bg-neutral-950">
      <StudioHeader />
      
      <main className="container mx-auto px-4 py-8">
        <WorkflowProgress currentStep={currentStep} />
        
        <div className="mt-8 space-y-8">
          <ReferenceUploadSection
            referenceAudio={referenceAudio}
            setReferenceAudio={setReferenceAudio}
            isActive={currentStep === 1}
            onNext={() => setCurrentStep(2)}
          />
          
          <SourceUploadSection
            sourceAudio={sourceAudio}
            setSourceAudio={setSourceAudio}
            isActive={currentStep === 2}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
          
          <DesiredAudioSection
            desiredAudioDescription={desiredAudioDescription}
            setDesiredAudioDescription={setDesiredAudioDescription}
            isActive={currentStep === 3}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
          
          <GenerateSection
            referenceAudio={referenceAudio}
            sourceAudio={sourceAudio}
            desiredAudioDescription={desiredAudioDescription}
            isActive={currentStep === 4}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            onGenerateComplete={(audio) => {
              setGeneratedAudio(audio)
              setCurrentStep(5)
            }}
            onBack={() => setCurrentStep(3)}
          />
          
          <ResultsSection
            generatedAudio={generatedAudio}
            isActive={currentStep === 5}
            onReset={() => {
              setCurrentStep(1)
              setReferenceAudio(null)
              setSourceAudio(null)
              setDesiredAudioDescription('')
              setGeneratedAudio(null)
            }}
          />
        </div>
      </main>
    </div>
  )
}
