'use client'

import { useState, useCallback } from 'react'
import type { WorkflowStep } from '@/types/workflow'

export interface UseWorkflowStateReturn {
  // Step management
  currentStep: WorkflowStep
  setCurrentStep: (step: WorkflowStep) => void
  goToStep: (step: WorkflowStep) => void
  
  // Audio files
  referenceAudio: File | null
  setReferenceAudio: (file: File | null) => void
  sourceAudio: File | null
  setSourceAudio: (file: File | null) => void
  desiredAudio: File | null
  setDesiredAudio: (file: File | null) => void
  generatedAudio: Blob | null
  setGeneratedAudio: (blob: Blob | null) => void
  
  // AI Generation fields
  desiredAudioDescription: string
  setDesiredAudioDescription: (description: string) => void
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void
  
  // Processing state
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
  progress: number
  setProgress: (progress: number) => void
  
  // Reset
  resetWorkflow: () => void
}

export function useWorkflowState(): UseWorkflowStateReturn {
  // Step management
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload_reference')
  
  // Audio files
  const [referenceAudio, setReferenceAudio] = useState<File | null>(null)
  const [sourceAudio, setSourceAudio] = useState<File | null>(null)
  const [desiredAudio, setDesiredAudio] = useState<File | null>(null)
  const [generatedAudio, setGeneratedAudio] = useState<Blob | null>(null)
  
  // AI Generation fields
  const [desiredAudioDescription, setDesiredAudioDescription] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  
  const goToStep = useCallback((step: WorkflowStep) => {
    setCurrentStep(step)
  }, [])
  
  const resetWorkflow = useCallback(() => {
    setCurrentStep('upload_reference')
    setReferenceAudio(null)
    setSourceAudio(null)
    setDesiredAudio(null)
    setGeneratedAudio(null)
    setDesiredAudioDescription('')
    setIsGenerating(false)
    setIsProcessing(false)
    setProgress(0)
  }, [])
  
  return {
    // Step management
    currentStep,
    setCurrentStep,
    goToStep,
    
    // Audio files
    referenceAudio,
    setReferenceAudio,
    sourceAudio,
    setSourceAudio,
    desiredAudio,
    setDesiredAudio,
    generatedAudio,
    setGeneratedAudio,
    
    // AI Generation fields
    desiredAudioDescription,
    setDesiredAudioDescription,
    isGenerating,
    setIsGenerating,
    
    // Processing state
    isProcessing,
    setIsProcessing,
    progress,
    setProgress,
    
    // Reset
    resetWorkflow,
  }
}
