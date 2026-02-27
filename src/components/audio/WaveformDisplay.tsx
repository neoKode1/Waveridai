'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'

interface WaveformDisplayProps {
  audioUrl: string
  waveformData?: number[]
  onTimeUpdate?: (currentTime: number) => void
  className?: string
}

export const WaveformDisplay: React.FC<WaveformDisplayProps> = ({
  audioUrl,
  waveformData,
  onTimeUpdate,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerY = height / 2

    ctx.clearRect(0, 0, width, height)

    if (waveformData && waveformData.length > 0) {
      ctx.strokeStyle = 'oklch(70.7% 0.022 261.325)'
      ctx.lineWidth = 2
      ctx.beginPath()

      const step = width / waveformData.length
      waveformData.forEach((value, i) => {
        const x = i * step
        const y = centerY + value * (height / 2)
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()
    }

    if (duration > 0) {
      const progressX = (currentTime / duration) * width
      ctx.fillStyle = 'oklch(70.7% 0.022 261.325)'
      ctx.globalAlpha = 0.2
      ctx.fillRect(0, 0, progressX, height)
      ctx.globalAlpha = 1

      ctx.strokeStyle = 'oklch(80% 0.02 261)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(progressX, 0)
      ctx.lineTo(progressX, height)
      ctx.stroke()
    }
  }, [waveformData, currentTime, duration])

  useEffect(() => {
    drawWaveform()
  }, [drawWaveform])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      onTimeUpdate?.(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [onTimeUpdate])

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      }
      drawWaveform()
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [drawWaveform])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(console.error)
    }
    setIsPlaying(!isPlaying)
  }

  const skipBackward = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, audio.currentTime - 10)
  }

  const skipForward = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.min(duration, audio.currentTime + 10)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const audio = audioRef.current
    if (!canvas || !audio || duration === 0) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = x / rect.width
    audio.currentTime = percent * duration
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={`bg-neutral-900 rounded-xl p-6 ${className}`}>
      <audio ref={audioRef} src={audioUrl} />
      
      <div className="relative mb-4">
        <canvas
          ref={canvasRef}
          className="w-full h-32 rounded-lg cursor-pointer"
          onClick={handleSeek}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-neutral-400">{formatTime(currentTime)}</span>
        <span className="text-sm text-neutral-400">{formatTime(duration)}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={skipBackward}
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
            aria-label="Skip backward 10 seconds"
          >
            <SkipBack className="h-4 w-4 text-neutral-300" />
          </button>
          
          <button
            onClick={togglePlay}
            className="p-3 rounded-lg gradient-primary hover:opacity-90 transition-opacity"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-white" />
            ) : (
              <Play className="h-5 w-5 text-white" />
            )}
          </button>
          
          <button
            onClick={skipForward}
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
            aria-label="Skip forward 10 seconds"
          >
            <SkipForward className="h-4 w-4 text-neutral-300" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4 text-neutral-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 accent-primary-500"
            aria-label="Volume control"
          />
        </div>
      </div>
    </div>
  )
}
