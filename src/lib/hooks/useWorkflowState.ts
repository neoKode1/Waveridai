import { create } from 'zustand'

// Use the native Web Audio API AudioBuffer
type AudioBuffer = globalThis.AudioBuffer

export interface AudioAnalysisResult {
  features: {
    duration: number
    sampleRate: number
    channels: number
    tempo: number
    key: string
    timeSignature: [number, number]
    spectralCentroid: number
    zeroCrossingRate: number
    instruments: string[]
    genre: string
    mood: string
    style: string
    dynamicRange: number
    averageLoudness: number
    harmonicRatio: number
  }
  confidence: number
  analysisTime: number
  timestamp: Date
}

export interface GeneratedPrompt {
  prompt: string
  confidence: number
  reasoning: string
  suggestedParameters: {
    duration?: number
    temperature?: number
    seed?: number
  }
}

export interface MIDIData {
  tracks: MIDITrack[]
  timeSignature: [number, number]
  tempo: number
  duration: number
}

export interface MIDITrack {
  instrument: string
  notes: MIDINoteEvent[]
  confidence: number
}

// MIDI interfaces - archived for future use
export interface MIDINoteEvent {
  startTime: number
  endTime: number
  pitch: number
  velocity: number
  instrument: string
}

export interface ModelData {
  id: string
  name: string
  type: 'ddsp' | 'diffusion'
  trainedAt: Date
  metadata: {
    epochs?: number
    learningRate?: number
    batchSize?: number
    [key: string]: string | number | boolean | undefined
  }
}

export type WorkflowStep = 
  | 'upload_reference'
  | 'upload_desired'
  | 'generate'
  | 'results'

interface WorkflowState {
  // Audio data
  sourceAudio: AudioBuffer | null
  referenceAudio: AudioBuffer | null
  generatedAudio: AudioBuffer | null
  
  // Audio analysis results
  sourceAudioAnalysis: AudioAnalysisResult | null
  referenceAudioAnalysis: AudioAnalysisResult | null
  
  // Workflow state
  currentStep: WorkflowStep
  progress: Record<WorkflowStep, number>
  processing: {
    audioAnalysis: boolean
    generation: boolean
  }
  error: string | null
  
  // Actions
  setSourceAudio: (audio: AudioBuffer | null) => void
  setReferenceAudio: (audio: AudioBuffer | null) => void
  setGeneratedAudio: (audio: AudioBuffer | null) => void
  setSourceAudioAnalysis: (analysis: AudioAnalysisResult | null) => void
  setReferenceAudioAnalysis: (analysis: AudioAnalysisResult | null) => void
  setCurrentStep: (step: WorkflowStep) => void
  updateProgress: (step: WorkflowStep, progress: number) => void
  setProcessing: (processing: Partial<WorkflowState['processing']>) => void
  setError: (error: string | null) => void
  resetWorkflow: () => void
}

const initialProgress: Record<WorkflowStep, number> = {
  upload_reference: 0,
  upload_desired: 0,
  generate: 0,
  results: 0
}

export const useWorkflowState = create<WorkflowState>((set, get) => ({
  // Initial state
  sourceAudio: null,
  referenceAudio: null,
  generatedAudio: null,
  sourceAudioAnalysis: null,
  referenceAudioAnalysis: null,
  currentStep: 'upload_reference',
  progress: initialProgress,
  processing: {
    audioAnalysis: false,
    generation: false
  },
  error: null,

  // Actions
  setSourceAudio: (audio) => {
    set({ sourceAudio: audio })
    // No longer needed in simplified workflow
  },

  setReferenceAudio: (audio) => {
    set({ referenceAudio: audio })
    if (audio) {
      set({ 
        currentStep: 'upload_desired',
        progress: { ...get().progress, upload_reference: 100 }
      })
    }
  },

  setGeneratedAudio: (audio) => {
    set({ generatedAudio: audio })
    if (audio) {
      set({ 
        currentStep: 'results',
        progress: { ...get().progress, generate: 100, results: 100 }
      })
    }
  },

  setSourceAudioAnalysis: (analysis) => {
    set({ sourceAudioAnalysis: analysis })
  },
  
  setReferenceAudioAnalysis: (analysis) => {
    set({ referenceAudioAnalysis: analysis })
  },

  setCurrentStep: (step) => set({ currentStep: step }),

  updateProgress: (step, progress) => 
    set((state) => ({
      progress: { ...state.progress, [step]: progress }
    })),

  setProcessing: (processing) =>
    set((state) => ({
      processing: { ...state.processing, ...processing }
    })),

  setError: (error) => set({ error }),

  resetWorkflow: () => set({
    sourceAudio: null,
    referenceAudio: null,
    generatedAudio: null,
    sourceAudioAnalysis: null,
    referenceAudioAnalysis: null,
    currentStep: 'upload_reference',
    progress: initialProgress,
    processing: {
      audioAnalysis: false,
      generation: false
    },
    error: null
  })
}))
