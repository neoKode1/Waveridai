'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface WaveformDisplayProps {
  audioUrl: string
  className?: string
  showControls?: boolean
  autoPlay?: boolean
  onTimeUpdate?: (currentTime: number, duration: number) => void
  waveformColor?: string
  progressColor?: string
}

interface WaveformData {
  peaks: number[]
  duration: number
}

export const WaveformDisplay: React.FC<WaveformDisplayProps> = ({
  audioUrl,
  className,
  showControls = true,
  autoPlay = false,
  onTimeUpdate,
  waveformColor = 'oklch(70.7% 0.022 261.325)',
  progressColor = 'oklch(80% 0.02 261)',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [waveformData, setWaveformData] = useState<WaveformData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const animationFrameRef = useRef<number | null>(null)

  // Load and analyze audio
  useEffect(() => {
    const loadAudio = async () => {
      if (!audioUrl) return

      try {
        setIsLoading(true)
        const audioContext = new (window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)()
        const response = await fetch(audioUrl)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

        // Extract waveform data
        const rawData = audioBuffer.getChannelData(0)
        const samples = 1000 // Number of samples for visualization
        const blockSize = Math.floor(rawData.length / samples)
        const peaks: number[] = []

        for (let i = 0; i < samples; i++) {
          const start = blockSize * i
          let sum = 0
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[start + j])
          }
          peaks.push(sum / blockSize)
        }

        setWaveformData({
          peaks,
          duration: audioBuffer.duration,
        })
        setDuration(audioBuffer.duration)
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading audio:', error)
        setIsLoading(false)
      }
    }

    loadAudio()
  }, [audioUrl])

  // Draw waveform
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !waveformData) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { peaks } = waveformData
    const width = canvas.width
    const height = canvas.height
    const progress = duration > 0 ? currentTime / duration : 0

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw waveform
    const barWidth = width / peaks.length
    const maxPeak = Math.max(...peaks)

    peaks.forEach((peak, i) => {
      const x = i * barWidth
      const barHeight = (peak / maxPeak) * (height * 0.8)
      const y = (height - barHeight) / 2

      // Use progress color for played portion
      ctx.fillStyle = i / peaks.length <= progress ? progressColor : waveformColor
      ctx.fillRect(x, y, Math.max(1, barWidth - 1), barHeight)
    })
  }, [waveformData, currentTime, duration, waveformColor, progressColor])

  // Animation loop
  useEffect(() => {
    const animate = () => {
      drawWaveform()
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [drawWaveform])

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      }
      drawWaveform()
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [drawWaveform])

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      onTimeUpdate?.(audio.currentTime, audio.duration)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [onTimeUpdate])

  // Play/pause control
  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(err => console.error('Error playing audio:', err))
    }
    setIsPlaying(!isPlaying)
  }

  // Seek control
  const handleSeek = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const audio = audioRef.current
    const canvas = canvasRef.current
    if (!audio || !canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    audio.currentTime = percentage * duration
  }

  // Volume control
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume
        setIsMuted(false)
      } else {
        audioRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  // Skip controls
  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
    }
  }

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10)
    }
  }

  // Format time display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn('flex flex-col space-y-4', className)}>
      <audio ref={audioRef} src={audioUrl} autoPlay={autoPlay} />
      
      {/* Waveform Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          onClick={handleSeek}
          className={cn(
            'w-full h-32 rounded-lg cursor-pointer',
            isLoading && 'opacity-50 animate-pulse'
          )}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-sm text-neutral-400">Loading waveform...</div>
          </div>
        )}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex items-center space-x-4">
          {/* Playback Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={skipBackward}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Skip backward 10s"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              onClick={togglePlayPause}
              className="p-3 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
            <button
              onClick={skipForward}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Skip forward 10s"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>

          {/* Time Display */}
          <div className="flex items-center space-x-2 text-sm text-neutral-400">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={toggleMute}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-24 accent-primary-500"
            />
          </div>
        </div>
      )}
    </div>
  )
}
