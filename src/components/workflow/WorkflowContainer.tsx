'use client'

import React from 'react'
import { useWorkflowState } from '@/lib/hooks/useWorkflowState'
import { ReferenceUploadSection } from './ReferenceUploadSection'
import { SourceUploadSection } from './SourceUploadSection'
import { DesiredAudioSection } from './DesiredAudioSection'
import { GenerateSection } from './GenerateSection'
import { ResultsSection } from './ResultsSection'
import { WorkflowProgress } from './WorkflowProgress'
import type { WorkflowStep } from '@/types/workflow'

export const WorkflowContainer: React.FC = () => {
  const workflow = useWorkflowState()
  const { currentStep, goToStep } = workflow

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="container mx-auto px-4 py-8">
        <WorkflowProgress currentStep={currentStep} />
        
        <div className="mt-8 space-y-6">
          <ReferenceUploadSection
            isActive={currentStep === 'upload_reference'}
            onComplete={() => goToStep('upload_source')}
          />
          
          <SourceUploadSection
            isActive={currentStep === 'upload_source'}
            onComplete={() => goToStep('upload_desired')}
            onBack={() => goToStep('upload_reference')}
          />
          
          <DesiredAudioSection
            isActive={currentStep === 'upload_desired'}
            onComplete={() => goToStep('generate')}
            onBack={() => goToStep('upload_source')}
          />
          
          <GenerateSection
            isActive={currentStep === 'generate'}
            onComplete={() => goToStep('results')}
            onBack={() => goToStep('upload_desired')}
          />
          
          <ResultsSection
            isActive={currentStep === 'results'}
            onBack={() => goToStep('generate')}
            onReset={() => goToStep('upload_reference')}
          />
        </div>
      </div>
    </div>
  )
}
