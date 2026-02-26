'use client'

import React, { useRef, useEffect, useCallback } from 'react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'

interface WaveformDisplayProps {
  audioUrl: string
  isPlaying: boolean
  onPlayPause: () => void
  currentTime: number
  duration: number
  onSeek: (time: number) => void
}

export const WaveformDisplay: React.FC<WaveformDisplayProps> = ({
  audioUrl,
  isPlaying,
  onPlayPause,
  currentTime,
  duration,
  onSeek,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const waveformData = useRef<number[]>([])

  // Draw waveform on canvas
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const progress = duration > 0 ? currentTime / duration : 0

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw waveform bars
    const barWidth = 3
    const gap = 1
    const totalBars = Math.floor(width / (barWidth + gap))

    for (let i = 0; i < totalBars; i++) {
      const x = i * (barWidth + gap)
      const barHeight = waveformData.current[i] || Math.random() * height * 0.8
      const y = (height - barHeight) / 2

      // Color based on progress
      const isPassed = i / totalBars < progress
      ctx.fillStyle = isPassed ? 'oklch(70.7% 0.022 261.325)' : 'oklch(40% 0 0)'
      ctx.fillRect(x, y, barWidth, barHeight)
    }

    // Draw progress indicator
    const progressX = width * progress
    ctx.strokeStyle = 'oklch(70.7% 0.022 261.325)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(progressX, 0)
    ctx.lineTo(progressX, height)
    ctx.stroke()
  }, [currentTime, duration])

  useEffect(() => {
    drawWaveform()
  }, [drawWaveform])

  // Generate waveform data when audio loads
  useEffect(() => {
    if (!audioUrl) return

    const canvas = canvasRef.current
    if (!canvas) return

    const width = canvas.width
    const barWidth = 3
    const gap = 1
    const totalBars = Math.floor(width / (barWidth + gap))

    // Generate synthetic waveform data
    waveformData.current = Array.from({ length: totalBars }, (_, i) => {
      const frequency = 0.1
      const amplitude = Math.sin(i * frequency) * 0.5 + 0.5
      const randomness = Math.random() * 0.3
      return (amplitude * 0.7 + randomness * 0.3) * canvas.height * 0.8
    })

    drawWaveform()
  }, [audioUrl, drawWaveform])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / canvas.width
    const newTime = percentage * duration
    onSeek(newTime)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const skip = (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds))
    onSeek(newTime)
  }

  return (
    <div className="glass p-6 rounded-xl space-y-4">
      {/* Waveform Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={120}
          className="w-full h-[120px] cursor-pointer rounded-lg"
          onClick={handleCanvasClick}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => skip(-10)}
            className="p-2 glass glass-hover rounded-lg transition-all"
            title="Skip back 10s"
          >
            <SkipBack className="h-4 w-4 text-neutral-300" />
          </button>

          <button
            onClick={onPlayPause}
            className="p-3 gradient-primary rounded-lg shadow-lg shadow-primary-500/50 hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 text-white" />
            )}
          </button>

          <button
            onClick={() => skip(10)}
            className="p-2 glass glass-hover rounded-lg transition-all"
            title="Skip forward 10s"
          >
            <SkipForward className="h-4 w-4 text-neutral-300" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-neutral-400">
            {formatTime(currentTime)}
          </span>
          <span className="text-sm text-neutral-600">/</span>
          <span className="text-sm text-neutral-400">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  )
}

export const SimpleWaveformDisplay: React.FC<{ audioUrl: string }> = ({ audioUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const waveformData = useRef<number[]>([])

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw waveform bars
    const barWidth = 2
    const gap = 1
    const totalBars = Math.floor(width / (barWidth + gap))

    for (let i = 0; i < totalBars; i++) {
      const x = i * (barWidth + gap)
      const barHeight = waveformData.current[i] || Math.random() * height * 0.7
      const y = (height - barHeight) / 2

      ctx.fillStyle = 'oklch(70.7% 0.022 261.325)'
      ctx.fillRect(x, y, barWidth, barHeight)
    }
  }, [])

  useEffect(() => {
    if (!audioUrl) return

    const canvas = canvasRef.current
    if (!canvas) return

    const width = canvas.width
    const barWidth = 2
    const gap = 1
    const totalBars = Math.floor(width / (barWidth + gap))

    // Generate synthetic waveform data
    waveformData.current = Array.from({ length: totalBars }, (_, i) => {
      const frequency = 0.15
      const amplitude = Math.sin(i * frequency) * 0.5 + 0.5
      const randomness = Math.random() * 0.3
      return (amplitude * 0.7 + randomness * 0.3) * canvas.height * 0.7
    })

    drawWaveform()
  }, [audioUrl, drawWaveform])

  return (
    <div className="glass p-4 rounded-lg">
      <canvas
        ref={canvasRef}
        width={400}
        height={60}
        className="w-full h-[60px] rounded"
      />
    </div>
  )
}
