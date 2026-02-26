'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

interface WaveformDisplayProps {
  audioFile: File
  variant?: 'primary' | 'secondary'
}

export const WaveformDisplay: React.FC<WaveformDisplayProps> = ({ audioFile, variant = 'primary' }) => {
  const [duration, setDuration] = React.useState<number>(0)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const loadAudio = async () => {
      const audioContext = new AudioContext()
      const arrayBuffer = await audioFile.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      
      setDuration(audioBuffer.duration)
      
      // Draw waveform
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const data = audioBuffer.getChannelData(0)
        const step = Math.ceil(data.length / canvas.width)
        const amp = canvas.height / 2

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
        if (variant === 'primary') {
          gradient.addColorStop(0, 'oklch(70.7% 0.022 261.325)')
          gradient.addColorStop(1, 'oklch(60% 0.03 261)')
        } else {
          gradient.addColorStop(0, 'oklch(70% 0.03 81)')
          gradient.addColorStop(1, 'oklch(60% 0.04 81)')
        }
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2

        ctx.beginPath()
        for (let i = 0; i < canvas.width; i++) {
          const min = Math.min(...Array.from({ length: step }, (_, j) => data[i * step + j] || 0))
          const max = Math.max(...Array.from({ length: step }, (_, j) => data[i * step + j] || 0))
          ctx.moveTo(i, (1 + min) * amp)
          ctx.lineTo(i, (1 + max) * amp)
        }
        ctx.stroke()
      }
    }

    loadAudio()
  }, [audioFile, variant])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn(
      'rounded-lg p-4 border transition-colors',
      variant === 'primary' 
        ? 'bg-primary-500/5 border-primary-500/20' 
        : 'bg-secondary-500/5 border-secondary-500/20'
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white">Waveform</span>
        <span className="text-sm text-neutral-400">{formatTime(duration)}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={100}
        className="w-full h-24 rounded"
        style={{ backgroundColor: 'oklch(20% 0 0)' }}
      />
    </div>
  )
}
