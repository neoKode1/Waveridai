'use client'

import React from 'react'
import { useWorkflow } from '@/contexts/WorkflowContext'
import { Upload, Wand2, Music, Sparkles, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const steps = [
  { id: 'upload', label: 'Upload Source', icon: Upload },
  { id: 'describe', label: 'Describe Sound', icon: Wand2 },
  { id: 'reference', label: 'Add Reference', icon: Music },
  { id: 'generate', label: 'Generate', icon: Sparkles },
] as const

export const WorkflowProgress: React.FC = () => {
  const { state } = useWorkflow()
  
  const getStepStatus = (stepId: string) => {
    switch (stepId) {
      case 'upload':
        return state.sourceAudio ? 'complete' : state.currentStep === 'upload' ? 'current' : 'upcoming'
      case 'describe':
        return state.desiredAudioDescription ? 'complete' : state.currentStep === 'describe' ? 'current' : 'upcoming'
      case 'reference':
        return state.referenceAudio ? 'complete' : state.currentStep === 'reference' ? 'current' : 'upcoming'
      case 'generate':
        return state.generatedAudio ? 'complete' : state.currentStep === 'generate' ? 'current' : 'upcoming'
      default:
        return 'upcoming'
    }
  }
  
  return (
    <div className="card neon-border">
      <div className="flex items-center justify-between relative">
        {/* Background progress bar */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-800 -translate-y-1/2 -z-10">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-700 ease-out relative"
            style={{ 
              width: `${(steps.findIndex(s => s.id === state.currentStep) / (steps.length - 1)) * 100}%` 
            }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary-400 rounded-full animate-pulse-glow"></div>
          </div>
        </div>
        
        {steps.map((step, index) => {
          const status = getStepStatus(step.id)
          const Icon = step.icon
          const isComplete = status === 'complete'
          const isCurrent = status === 'current'
          
          return (
            <div
              key={step.id}
              className="flex flex-col items-center space-y-3 relative z-10 group"
            >
              {/* Step circle */}
              <div
                className={cn(
                  'relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500',
                  'border-2',
                  isComplete && 'bg-gradient-primary border-primary-400 shadow-glow',
                  isCurrent && 'bg-neutral-900 border-primary-500 shadow-glow animate-pulse-glow',
                  !isComplete && !isCurrent && 'bg-neutral-900 border-neutral-700',
                  'group-hover:scale-110 group-hover:shadow-glow-lg'
                )}
              >
                {isComplete ? (
                  <CheckCircle2 className="h-6 w-6 text-white" />
                ) : (
                  <Icon 
                    className={cn(
                      'h-6 w-6 transition-colors duration-300',
                      isCurrent ? 'text-primary-400' : 'text-neutral-500',
                      'group-hover:text-primary-400'
                    )} 
                  />
                )}
                
                {/* Animated ring for current step */}
                {isCurrent && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-primary-400/50 animate-ping"></div>
                    <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-pulse"></div>
                  </>
                )}
              </div>
              
              {/* Step label */}
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    'text-sm font-medium transition-colors duration-300 whitespace-nowrap',
                    isComplete && 'text-primary-300',
                    isCurrent && 'text-primary-400 font-semibold',
                    !isComplete && !isCurrent && 'text-neutral-500',
                    'group-hover:text-primary-400'
                  )}
                >
                  {step.label}
                </span>
                
                {/* Step number */}
                <span className="text-xs text-neutral-600 mt-1">
                  Step {index + 1}
                </span>
              </div>
              
              {/* Connector line - hide after last step */}
              {index < steps.length - 1 && (
                <div className="absolute top-7 left-[calc(50%+28px)] w-[calc(100%-28px)] h-0.5 bg-neutral-800 -z-10" />
              )}
            </div>
          )
        })}
      </div>
      
      {/* Progress percentage */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20">
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-primary-300 font-medium">
            {Math.round((steps.findIndex(s => s.id === state.currentStep) / (steps.length - 1)) * 100)}% Complete
          </span>
        </div>
      </div>
    </div>
  )
}
