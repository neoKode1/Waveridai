export type WorkflowType = 'precise' | 'ai-generation'

export type ProcessingStage = 
  | 'idle'
  | 'uploading'
  | 'extracting-midi'
  | 'separating-sources'
  | 'training-model'
  | 'synthesizing'
  | 'generating-ai'
  | 'processing-complete'
  | 'error'

export interface AudioFile {
  id: string
  name: string
  url: string
  duration: number
  size: number
  type: string
  uploadedAt: Date
  waveformData?: number[]
}

export interface MidiData {
  id: string
  tracks: MidiTrack[]
  duration: number
  metadata: Record<string, unknown>
}

export interface MidiTrack {
  id: string
  name: string
  instrument: string
  notes: MidiNote[]
  metadata: Record<string, unknown>
}

export interface MidiNote {
  pitch: number
  velocity: number
  startTime: number
  duration: number
}

export interface ProcessingOptions {
  workflow: WorkflowType
  sourceAudioId?: string
  referenceAudioId?: string
  midiData?: MidiData
  prompt?: string
  parameters?: Record<string, unknown>
}

export interface ProcessingResult {
  success: boolean
  audioFile?: AudioFile
  midiData?: MidiData
  error?: string
  metadata?: Record<string, unknown>
}

export interface WorkflowStep {
  id: string
  name: string
  description: string
  stage: ProcessingStage
  completed: boolean
  progress: number
  error?: string
}
