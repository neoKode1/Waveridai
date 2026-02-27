'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface WaveformDisplayProps {
  audioFile: File
  title?: string
  onRemove?: () => void
  showRemove?: boolean
  className?: string
}

export const WaveformDisplay: React.FC<WaveformDisplayProps> = ({
  audioFile,
  title,
  onRemove,
  showRemove = true,
  className = '',
}) => {
  const [audioUrl, setAudioUrl] = useState<string>('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    const url = URL.createObjectURL(audioFile)
    setAudioUrl(url)
    setCurrentTime(0)
    setIsPlaying(false)
    return () => URL.revokeObjectURL(url)
  }, [audioFile])

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const width = canvas.width
    const height = canvas.height
    ctx.clearRect(0, 0, width, height)
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
  }, [currentTime, duration])

  useEffect(() => { drawWaveform() }, [drawWaveform])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onMeta = () => setDuration(audio.duration)
    const onTime = () => setCurrentTime(audio.currentTime)
    const onEnd = () => { setIsPlaying(false); setCurrentTime(0) }
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnd)
    }
  }, [audioUrl])



  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      drawWaveform()
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [drawWaveform])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) { audio.pause() } else { audio.play().catch(console.error) }
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
    if (audioRef.current) audioRef.current.volume = newVolume
  }

  const handleSeek = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const audio = audioRef.current
    if (!canvas || !audio || duration === 0) return
    const rect = canvas.getBoundingClientRect()
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * duration
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn('bg-neutral-900 rounded-xl p-4', className)}>
      {audioUrl && <audio ref={audioRef} src={audioUrl} />}

      {(title || (showRemove && onRemove)) && (
        <div className="flex items-center justify-between mb-3">
          {title && <h3 className="text-sm font-medium text-neutral-300">{title}</h3>}
          {showRemove && onRemove && (
            <button
              onClick={onRemove}
              className="p-1 rounded hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors"
              aria-label="Remove audio"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      <p className="text-xs text-neutral-500 truncate mb-3">{audioFile.name}</p>

      <div className="relative mb-3">
        <canvas
          ref={canvasRef}
          className="w-full h-20 rounded-lg cursor-pointer bg-neutral-800"
          onClick={handleSeek}
        />
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-neutral-400">{formatTime(currentTime)}</span>
        <span className="text-xs text-neutral-400">{formatTime(duration)}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={skipBackward} className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors" aria-label="Skip backward 10 seconds">
            <SkipBack className="h-4 w-4 text-neutral-300" />
          </button>
          <button onClick={togglePlay} className="p-2 rounded-lg bg-primary-500 hover:bg-primary-600 transition-colors" aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause className="h-4 w-4 text-white" /> : <Play className="h-4 w-4 text-white" />}
          </button>
          <button onClick={skipForward} className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors" aria-label="Skip forward 10 seconds">
            <SkipForward className="h-4 w-4 text-neutral-300" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4 text-neutral-400" />
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} className="w-20 accent-primary-500" aria-label="Volume control" />
        </div>
      </div>
    </div>
  )
}
