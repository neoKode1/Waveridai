'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface WaveformDisplayProps {
  audioUrl?: string
  audioBuffer?: AudioBuffer
  className?: string
  color?: string
  height?: number
  isLoading?: boolean
}

export const WaveformDisplay: React.FC<WaveformDisplayProps> = ({
  audioUrl,
  audioBuffer,
  className,
  color = 'oklch(70.7% 0.022 261.325)',
  height = 80,
  isLoading = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [localBuffer, setLocalBuffer] = useState<AudioBuffer | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Draw waveform function
  const drawWaveform = useCallback((buffer: AudioBuffer) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const data = buffer.getChannelData(0)
    const step = Math.ceil(data.length / canvas.width)
    const amp = canvas.height / 2

    ctx.fillStyle = 'oklch(15% 0 0)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.beginPath()

    for (let i = 0; i < canvas.width; i++) {
      let min = 1.0
      let max = -1.0

      for (let j = 0; j < step; j++) {
        const datum = data[(i * step) + j]
        if (datum < min) min = datum
        if (datum > max) max = datum
      }

      const y1 = (1 + min) * amp
      const y2 = (1 + max) * amp

      if (i === 0) {
        ctx.moveTo(i, y1)
      }

      ctx.lineTo(i, y1)
      ctx.lineTo(i, y2)
    }

    ctx.stroke()
  }, [color])

  // Load audio from URL
  useEffect(() => {
    if (audioUrl && audioContextRef.current) {
      const loadAudio = async () => {
        try {
          const response = await fetch(audioUrl)
          const arrayBuffer = await response.arrayBuffer()
          const buffer = await audioContextRef.current!.decodeAudioData(arrayBuffer)
          setLocalBuffer(buffer)
        } catch (error) {
          console.error('Error loading audio:', error)
        }
      }

      loadAudio()
    }
  }, [audioUrl])

  // Draw waveform when buffer changes
  useEffect(() => {
    const bufferToUse = audioBuffer || localBuffer
    if (bufferToUse) {
      drawWaveform(bufferToUse)
    }
  }, [audioBuffer, localBuffer, drawWaveform])

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`

      const bufferToUse = audioBuffer || localBuffer
      if (bufferToUse) {
        drawWaveform(bufferToUse)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [audioBuffer, localBuffer, drawWaveform])

  return (
    <div className={cn('relative w-full', className)} style={{ height: `${height}px` }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/80 backdrop-blur-sm rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-lg"
        style={{ display: 'block' }}
      />
    </div>
  )
}

// Miniature waveform for thumbnails
export const WaveformThumbnail: React.FC<{
  audioUrl: string
  className?: string
}> = ({ audioUrl, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  const drawWaveform = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const response = await fetch(audioUrl)
      const arrayBuffer = await response.arrayBuffer()
      const buffer = await audioContext.decodeAudioData(arrayBuffer)

      const data = buffer.getChannelData(0)
      const step = Math.ceil(data.length / canvas.width)
      const amp = canvas.height / 2

      ctx.fillStyle = 'oklch(20% 0 0)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = 'oklch(70.7% 0.022 261.325)'
      ctx.lineWidth = 1
      ctx.beginPath()

      for (let i = 0; i < canvas.width; i++) {
        let min = 1.0
        let max = -1.0

        for (let j = 0; j < step; j++) {
          const datum = data[(i * step) + j]
          if (datum < min) min = datum
          if (datum > max) max = datum
        }

        const y1 = (1 + min) * amp
        const y2 = (1 + max) * amp

        if (i === 0) {
          ctx.moveTo(i, y1)
        }

        ctx.lineTo(i, y1)
        ctx.lineTo(i, y2)
      }

      ctx.stroke()
      audioContext.close()
      setIsLoading(false)
    } catch (error) {
      console.error('Error drawing waveform:', error)
      setIsLoading(false)
    }
  }, [audioUrl])

  useEffect(() => {
    drawWaveform()
  }, [drawWaveform])

  return (
    <div className={cn('relative', className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-primary-400" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={200}
        height={40}
        className="w-full h-full rounded"
      />
    </div>
  )
}
