'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { WorkflowType, ProcessingStage, AudioFile } from '@/types/workflow'

export interface WorkflowContextType {
  currentWorkflow: WorkflowType
  setCurrentWorkflow: (workflow: WorkflowType) => void
  processingStage: ProcessingStage
  setProcessingStage: (stage: ProcessingStage) => void
  sourceAudio: AudioFile | null
  setSourceAudio: (audio: AudioFile | null) => void
  referenceAudio: AudioFile | null
  setReferenceAudio: (audio: AudioFile | null) => void
  processedAudio: AudioFile | null
  setProcessedAudio: (audio: AudioFile | null) => void
  processingProgress: number
  setProcessingProgress: (progress: number) => void
  error: Error | null
  setError: (error: Error | null) => void
  resetWorkflow: () => void
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined)

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowType>('precise')
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle')
  const [sourceAudio, setSourceAudio] = useState<AudioFile | null>(null)
  const [referenceAudio, setReferenceAudio] = useState<AudioFile | null>(null)
  const [processedAudio, setProcessedAudio] = useState<AudioFile | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  const resetWorkflow = useCallback(() => {
    setProcessingStage('idle')
    setSourceAudio(null)
    setReferenceAudio(null)
    setProcessedAudio(null)
    setProcessingProgress(0)
    setError(null)
  }, [])

  const value: WorkflowContextType = {
    currentWorkflow,
    setCurrentWorkflow,
    processingStage,
    setProcessingStage,
    sourceAudio,
    setSourceAudio,
    referenceAudio,
    setReferenceAudio,
    processedAudio,
    setProcessedAudio,
    processingProgress,
    setProcessingProgress,
    error,
    setError,
    resetWorkflow,
  }

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  )
}

export function useWorkflow() {
  const context = useContext(WorkflowContext)
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider')
  }
  return context
}
