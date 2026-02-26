'use client'

import React from 'react'
import { Upload, Music, FileText, Sparkles, Download } from 'lucide-react'

interface WorkflowProgressProps {
  currentStep: number
}

export const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Upload Source', icon: Upload },
    { id: 2, name: 'Reference Audio', icon: Music },
    { id: 3, name: 'Describe Output', icon: FileText },
    { id: 4, name: 'Generate', icon: Sparkles },
    { id: 5, name: 'Results', icon: Download },
  ]

  return (
    <div className="glass rounded-xl p-6 border border-white/10 shadow-lg">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = currentStep >= step.id
          const isCurrent = currentStep === step.id
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center space-y-2 flex-1">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                    ${isActive 
                      ? 'gradient-primary shadow-lg shadow-primary-500/50 scale-110' 
                      : 'bg-neutral-800 border border-neutral-700'
                    }
                    ${isCurrent ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-neutral-950' : ''}
                  `}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                </div>
                <span
                  className={`
                    text-xs font-medium transition-colors
                    ${isActive ? 'text-white' : 'text-neutral-500'}
                  `}
                >
                  {step.name}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mb-6 relative">
                  <div className="absolute inset-0 bg-neutral-800" />
                  <div
                    className={`
                      absolute inset-0 bg-gradient-primary transition-all duration-500
                      ${currentStep > step.id ? 'w-full shadow-sm shadow-primary-500/50' : 'w-0'}
                    `}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
