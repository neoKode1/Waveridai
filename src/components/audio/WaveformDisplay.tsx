'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Play, Pause, Volume2, Download } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface WaveformDisplayProps {
  audioUrl: string
  title?: string
  className?: string
}

export const WaveformDisplay: React.FC<WaveformDisplayProps> = ({
  audioUrl,
  title = 'Audio',
  className,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const animationRef = useRef<number>()

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      drawWaveform()
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [audioUrl])

  const drawWaveform = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const barCount = 100
    const barWidth = width / barCount

    ctx.clearRect(0, 0, width, height)

    // Draw bars with gradient and glow effect
    for (let i = 0; i < barCount; i++) {
      const barHeight = Math.random() * (height * 0.6) + (height * 0.2)
      const x = i * barWidth
      const y = (height - barHeight) / 2

      // Create gradient for each bar
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight)
      gradient.addColorStop(0, 'oklch(70.7% 0.15 261.325)')
      gradient.addColorStop(0.5, 'oklch(75% 0.15 180)')
      gradient.addColorStop(1, 'oklch(70.7% 0.15 261.325)')

      // Determine if bar should be highlighted based on playback position
      const progress = currentTime / duration
      const isActive = i / barCount < progress

      if (isActive) {
        ctx.fillStyle = gradient
        // Add glow effect for active bars
        ctx.shadowBlur = 10
        ctx.shadowColor = 'oklch(70.7% 0.15 261.325)'
      } else {
        ctx.fillStyle = 'oklch(30% 0.02 261)'
        ctx.shadowBlur = 0
      }

      ctx.fillRect(x + 1, y, barWidth - 2, barHeight)
    }

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(drawWaveform)
    }
  }

  useEffect(() => {
    if (isPlaying) {
      drawWaveform()
    }
  }, [isPlaying, currentTime])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
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
    if (!canvas || !audio) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / canvas.width
    audio.currentTime = percentage * duration
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = `${title}.mp3`
    link.click()
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn('card space-y-6', className)}>
      <audio ref={audioRef} src={audioUrl} />

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-100">{title}</h3>
          <p className="text-sm text-neutral-400 mt-1">
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="button-secondary flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </button>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={800}
          height={150}
          onClick={handleSeek}
          className="w-full h-32 cursor-pointer rounded-xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 hover:border-primary-500/50 transition-colors duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent pointer-events-none rounded-xl"></div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={togglePlay}
          className="button-primary flex items-center space-x-2 !px-8"
        >
          {isPlaying ? (
            <>
              <Pause className="h-5 w-5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              <span>Play</span>
            </>
          )}
        </button>

        <div className="flex items-center space-x-3 flex-1">
          <Volume2 className="h-5 w-5 text-neutral-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-neutral-700 rounded-full appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-gradient-primary
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:shadow-glow
                     [&::-webkit-slider-thumb]:hover:scale-110
                     [&::-webkit-slider-thumb]:transition-transform"
            style={{
              background: `linear-gradient(to right, 
                oklch(70.7% 0.1 261.325) 0%, 
                oklch(70.7% 0.1 261.325) ${volume * 100}%, 
                oklch(30% 0.02 261) ${volume * 100}%, 
                oklch(30% 0.02 261) 100%)`
            }}
          />
          <span className="text-sm text-neutral-400 w-12 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  )
}
