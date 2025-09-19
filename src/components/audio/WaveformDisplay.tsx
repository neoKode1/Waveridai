'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
// import { MIDINoteEvent } from '@/lib/hooks/useWorkflowState' // Archived for future use
import { cn } from '@/lib/utils/cn'

// Use the native Web Audio API AudioBuffer
type AudioBuffer = globalThis.AudioBuffer

interface WaveformDisplayProps {
  audioBuffer: AudioBuffer
  annotations?: Array<{startTime: number, endTime: number, note: number}> // MIDINoteEvent[] - archived for future use
  className?: string
  height?: number
  showControls?: boolean
  onTimeUpdate?: (currentTime: number) => void
}

export const WaveformDisplay: React.FC<WaveformDisplayProps> = ({
  audioBuffer,
  annotations = [],
  className,
  height = 120,
  showControls = true,
  onTimeUpdate
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
          const [, setIsDragging] = useState(false)

  useEffect(() => {
    setDuration(audioBuffer.duration)
    drawWaveform()
  }, [audioBuffer])

  useEffect(() => {
    if (audioContextRef.current && sourceRef.current && gainNodeRef.current) {
      const updateTime = () => {
        if (sourceRef.current && audioContextRef.current) {
          const elapsed = audioContextRef.current.currentTime - (sourceRef.current as AudioBufferSourceNode & { startTime?: number }).startTime!
          const newTime = Math.max(0, Math.min(elapsed, duration))
          setCurrentTime(newTime)
          onTimeUpdate?.(newTime)
          
          if (newTime >= duration) {
            setIsPlaying(false)
            setCurrentTime(0)
          }
        }
        
        if (isPlaying) {
          requestAnimationFrame(updateTime)
        }
      }
      
      if (isPlaying) {
        updateTime()
      }
    }
  }, [isPlaying, duration, onTimeUpdate])

  const drawWaveform = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Validate audioBuffer
    if (!audioBuffer) {
      console.log('WaveformDisplay: No audioBuffer provided')
      return
    }

    // Validate audioBuffer has the required methods
    if (typeof audioBuffer.getChannelData !== 'function') {
      console.error('WaveformDisplay: Invalid audioBuffer - missing getChannelData method', {
        audioBuffer,
        audioBufferType: typeof audioBuffer,
        audioBufferConstructor: audioBuffer?.constructor?.name,
        hasGetChannelData: typeof audioBuffer?.getChannelData
      })
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height: canvasHeight } = canvas
    const channelData = audioBuffer.getChannelData(0)
    const samplesPerPixel = Math.floor(channelData.length / width)

    // Clear canvas
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, width, canvasHeight)

    // Draw waveform
    ctx.strokeStyle = '#8b5cf6'
    ctx.lineWidth = 1
    ctx.beginPath()

    for (let x = 0; x < width; x++) {
      const start = x * samplesPerPixel
      const end = Math.min(start + samplesPerPixel, channelData.length)
      
      let sum = 0
      for (let i = start; i < end; i++) {
        sum += Math.abs(channelData[i])
      }
      const average = sum / (end - start)
      
      const y = (1 - average) * canvasHeight / 2
      ctx.lineTo(x, y)
    }

    ctx.stroke()

    // Draw progress line
    if (duration > 0) {
      const progressX = (currentTime / duration) * width
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(progressX, 0)
      ctx.lineTo(progressX, canvasHeight)
      ctx.stroke()
    }

    // Draw MIDI annotations
    if (annotations.length > 0) {
      annotations.forEach(note => {
        const startX = (note.startTime / duration) * width
        const endX = (note.endTime / duration) * width
        const noteHeight = canvasHeight / 12 // 12 semitones per octave
        const y = canvasHeight - ((note.note % 12) * noteHeight) - noteHeight

        ctx.fillStyle = `rgba(139, 92, 246, 0.7)`
        ctx.fillRect(startX, y, endX - startX, noteHeight)
      })
    }
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const newTime = (x / canvas.width) * duration
    
    setCurrentTime(newTime)
    if (isPlaying) {
      stopAudio()
      playAudio(newTime)
    }
  }

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)

  const playAudio = (startTime: number = currentTime) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }

    const audioContext = audioContextRef.current
    const source = audioContext.createBufferSource()
    const gainNode = audioContext.createGain()

    source.buffer = audioBuffer
    source.connect(gainNode)
    gainNode.connect(audioContext.destination)

    source.start(0, startTime)
    source.stop(audioContext.currentTime + (duration - startTime))

    sourceRef.current = source
    gainNodeRef.current = gainNode
    setIsPlaying(true)

    source.onended = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }

  const stopAudio = () => {
    if (sourceRef.current) {
      sourceRef.current.stop()
      sourceRef.current.disconnect()
      sourceRef.current = null
    }
    setIsPlaying(false)
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      stopAudio()
    } else {
      playAudio()
    }
  }

  const handleSeek = (direction: 'back' | 'forward') => {
    const seekAmount = 5 // 5 seconds
    const newTime = direction === 'back' 
      ? Math.max(0, currentTime - seekAmount)
      : Math.min(duration, currentTime + seekAmount)
    
    setCurrentTime(newTime)
    if (isPlaying) {
      stopAudio()
      playAudio(newTime)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    drawWaveform()
  }, [currentTime, annotations])

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={height}
          className="w-full border border-gray-700 rounded-lg cursor-pointer"
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
        
        {/* Time markers */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {showControls && (
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => handleSeek('back')}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            disabled={isPlaying}
          >
            <SkipBack className="h-5 w-5" />
          </button>
          
          <button
            onClick={handlePlayPause}
            className="p-3 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </button>
          
          <button
            onClick={() => handleSeek('forward')}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            disabled={isPlaying}
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}
