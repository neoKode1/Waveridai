'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface WorkflowProgressProps {
  currentStep: number
  workflowMode: 'precise' | 'ai'
}

export const WorkflowProgress: React.FC<WorkflowProgressProps> = ({
  currentStep,
  workflowMode,
}) => {
  const preciseSteps = [
    { id: 1, name: 'Upload Source', description: 'Audio input' },
    { id: 2, name: 'Upload Reference', description: 'Custom instrument' },
    { id: 3, name: 'Generate', description: 'Neural synthesis' },
    { id: 4, name: 'Results', description: 'Preview & download' },
  ]

  const aiSteps = [
    { id: 1, name: 'Upload Source', description: 'Style reference (optional)' },
    { id: 2, name: 'Describe Music', description: 'Natural language prompt' },
    { id: 3, name: 'Generate', description: 'AI creation' },
    { id: 4, name: 'Results', description: 'Preview & download' },
  ]

  const steps = workflowMode === 'precise' ? preciseSteps : aiSteps

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300',
                  currentStep > step.id
                    ? workflowMode === 'precise'
                      ? 'gradient-primary text-white shadow-lg shadow-primary-500/30'
                      : 'gradient-secondary text-white shadow-lg shadow-secondary-500/30'
                    : currentStep === step.id
                    ? workflowMode === 'precise'
                      ? 'border-2 border-primary-500 text-primary-400 bg-primary-500/10'
                      : 'border-2 border-secondary-500 text-secondary-400 bg-secondary-500/10'
                    : 'border-2 border-neutral-700 text-neutral-500 bg-neutral-800/50'
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-6 w-6" />
                ) : (
                  <span className="text-sm font-bold">{step.id}</span>
                )}
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    'text-sm font-medium transition-colors',
                    currentStep >= step.id ? 'text-white' : 'text-neutral-500'
                  )}
                >
                  {step.name}
                </p>
                <p className="text-xs text-neutral-500 mt-1">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 mb-8">
                <div
                  className={cn(
                    'h-full transition-all duration-300',
                    currentStep > step.id
                      ? workflowMode === 'precise'
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600'
                        : 'bg-gradient-to-r from-secondary-500 to-secondary-600'
                      : 'bg-neutral-700'
                  )}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
