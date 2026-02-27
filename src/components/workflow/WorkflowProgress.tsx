'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { WorkflowStep } from '@/types/workflow'

interface WorkflowProgressProps {
  currentStep: WorkflowStep
}

const STEPS: { id: WorkflowStep; label: string; number: number }[] = [
  { id: 'upload_reference', label: 'Reference Audio', number: 1 },
  { id: 'upload_source', label: 'Source Audio', number: 2 },
  { id: 'upload_desired', label: 'Desired Audio', number: 3 },
  { id: 'generate', label: 'Generate', number: 4 },
  { id: 'results', label: 'Results', number: 5 },
]

export const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ currentStep }) => {
  const currentStepNumber = STEPS.find(s => s.id === currentStep)?.number ?? 1

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = step.number < currentStepNumber
          const isCurrent = step.id === currentStep
          const isUpcoming = step.number > currentStepNumber

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center space-y-2">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200',
                    isCompleted && 'bg-primary-500 text-white',
                    isCurrent && 'bg-primary-500 text-white ring-4 ring-primary-500/20',
                    isUpcoming && 'bg-neutral-800 text-neutral-400'
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : step.number}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium transition-colors',
                    (isCompleted || isCurrent) && 'text-neutral-100',
                    isUpcoming && 'text-neutral-500'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 transition-colors duration-200',
                    step.number < currentStepNumber ? 'bg-primary-500' : 'bg-neutral-800'
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
