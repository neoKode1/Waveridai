'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { WorkflowState, WorkflowType } from '@/types/workflow'

const WorkflowContext = createContext<WorkflowState | undefined>(undefined)

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [workflowType, setWorkflowType] = useState<WorkflowType>('precise')
  const [sourceAudio, setSourceAudio] = useState<File | null>(null)
  const [referenceAudio, setReferenceAudio] = useState<File | null>(null)
  const [desiredAudioDescription, setDesiredAudioDescription] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null)
  const [midiData, setMidiData] = useState<any | null>(null)

  const reset = useCallback(() => {
    setSourceAudio(null)
    setReferenceAudio(null)
    setDesiredAudioDescription('')
    setIsProcessing(false)
    setProgress(0)
    setGeneratedAudio(null)
    setMidiData(null)
  }, [])

  const value: WorkflowState = {
    workflowType,
    setWorkflowType,
    sourceAudio,
    setSourceAudio,
    referenceAudio,
    setReferenceAudio,
    desiredAudioDescription,
    setDesiredAudioDescription,
    isProcessing,
    setIsProcessing,
    progress,
    setProgress,
    generatedAudio,
    setGeneratedAudio,
    midiData,
    setMidiData,
    reset,
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
