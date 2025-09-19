'use client'

import { StudioHeader } from '@/components/workflow/StudioHeader'
import { WorkflowContainer } from '@/components/workflow/WorkflowContainer'
import { SourceUploadSection } from '@/components/workflow/SourceUploadSection'
import { DesiredAudioSection } from '@/components/workflow/DesiredAudioSection'
import { GenerateSection } from '@/components/workflow/GenerateSection'
import { ResultsSection } from '@/components/workflow/ResultsSection'
import { WorkflowProgress } from '@/components/workflow/WorkflowProgress'
import { useWorkflowState } from '@/lib/hooks/useWorkflowState'

export default function StudioPage() {
  const { currentStep, progress } = useWorkflowState()

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-primary-950">
      <StudioHeader />
      
              <div className="container mx-auto px-4 py-8">
                <WorkflowProgress currentStep={currentStep} progress={progress} />
                
                        <WorkflowContainer>
                          <SourceUploadSection />
                          <DesiredAudioSection />
                          <GenerateSection />
                          <ResultsSection />
                        </WorkflowContainer>
              </div>
    </div>
  )
}
