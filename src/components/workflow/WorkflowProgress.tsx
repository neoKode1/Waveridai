'use client'

import React from 'react'
import { Check, Clock } from 'lucide-react'
import { WorkflowStep } from '@/lib/hooks/useWorkflowState'
import { cn } from '@/lib/utils/cn'

interface WorkflowProgressProps {
  currentStep: WorkflowStep
  progress: Record<WorkflowStep, number>
}

const WORKFLOW_STEPS: Array<{
  id: WorkflowStep
  title: string
  description: string
}> = [
  {
    id: 'upload_reference',
    title: 'Reference Melody',
    description: 'Upload the melody you want to transform'
  },
  {
    id: 'upload_desired',
    title: 'Desired Sound',
    description: 'Upload the sound you want it to become'
  },
  {
    id: 'generate',
    title: 'Transform',
    description: 'AI transforms your melody'
  },
  {
    id: 'results',
    title: 'Results',
    description: 'Download your transformed melody'
  }
]

export const WorkflowProgress: React.FC<WorkflowProgressProps> = ({
  currentStep,
  progress
}) => {
  const currentStepIndex = WORKFLOW_STEPS.findIndex(step => step.id === currentStep)

  return (
    <div className="w-full max-w-6xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {WORKFLOW_STEPS.map((step, index) => {
          const isActive = step.id === currentStep
          const isComplete = progress[step.id] === 100
          const isUpcoming = index > currentStepIndex

          return (
            <div key={step.id} className="flex flex-col items-center space-y-2 flex-1">
              {/* Step Circle */}
              <div className="relative">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                    isComplete && 'bg-success border-success',
                    isActive && !isComplete && 'bg-primary-500 border-primary-500',
                    isUpcoming && 'bg-neutral-700 border-neutral-600'
                  )}
                >
                  {isComplete ? (
                    <Check className="h-6 w-6 text-white" />
                  ) : isActive ? (
                    <div className="w-6 h-6 rounded-full bg-white animate-pulse" />
                  ) : (
                    <Clock className="h-6 w-6 text-gray-400" />
                  )}
                </div>

                {/* Progress Ring */}
                {isActive && !isComplete && (
                  <svg className="absolute inset-0 w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="text-gray-700"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 20}`}
                      strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress[step.id] / 100)}`}
                      className="text-primary-500 transition-all duration-300"
                    />
                  </svg>
                )}
              </div>

              {/* Step Info */}
              <div className="text-center">
                <h3 className={cn(
                  'text-sm font-medium',
                  isActive && 'text-primary-400',
                  isComplete && 'text-success',
                  isUpcoming && 'text-neutral-500'
                )}>
                  {step.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  {step.description}
                </p>
                {isActive && progress[step.id] > 0 && progress[step.id] < 100 && (
                  <p className="text-xs text-primary-400 mt-1">
                    {Math.round(progress[step.id])}%
                  </p>
                )}
              </div>

              {/* Connector Line */}
              {index < WORKFLOW_STEPS.length - 1 && (
                <div className="absolute left-1/2 top-6 w-full h-0.5 bg-neutral-700 -z-10">
                  <div
                    className={cn(
                      'h-full bg-gradient-to-r transition-all duration-300',
                      index < currentStepIndex ? 'from-success to-success' : 'from-neutral-700 to-neutral-700'
                    )}
                    style={{ width: index < currentStepIndex ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
