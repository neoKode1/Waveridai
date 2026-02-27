export type WorkflowType = 'precise' | 'ai-generation'

export interface WorkflowState {
  workflowType: WorkflowType
  setWorkflowType: (type: WorkflowType) => void
  
  // Audio files
  sourceAudio: File | null
  setSourceAudio: (file: File | null) => void
  referenceAudio: File | null
  setReferenceAudio: (file: File | null) => void
  
  // AI Generation specific
  desiredAudioDescription: string
  setDesiredAudioDescription: (description: string) => void
  
  // Processing state
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
  progress: number
  setProgress: (progress: number) => void
  
  // Results
  generatedAudio: string | null
  setGeneratedAudio: (url: string | null) => void
  midiData: any | null
  setMidiData: (data: any) => void
  
  // Actions
  reset: () => void
}
