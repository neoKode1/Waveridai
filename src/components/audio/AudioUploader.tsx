'use client'

import React, { useCallback, useState } from 'react'
import { Upload, File, X } from 'lucide-react'

interface AudioUploaderProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number
  label?: string
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  onFileSelect,
  accept = 'audio/*',
  maxSize = 50 * 1024 * 1024, // 50MB default
  label = 'Drop audio file here or click to browse',
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      setError(null)

      const files = e.dataTransfer.files
      if (files && files.length > 0) {
        const file = files[0]
        if (file.size > maxSize) {
          setError(`File size exceeds ${maxSize / 1024 / 1024}MB limit`)
          return
        }
        onFileSelect(file)
      }
    },
    [maxSize, onFileSelect]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null)
      const files = e.target.files
      if (files && files.length > 0) {
        const file = files[0]
        if (file.size > maxSize) {
          setError(`File size exceeds ${maxSize / 1024 / 1024}MB limit`)
          return
        }
        onFileSelect(file)
      }
    },
    [maxSize, onFileSelect]
  )

  return (
    <div className="space-y-2">
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragging 
            ? 'border-primary-400 bg-primary-500/10 shadow-lg shadow-primary-500/20' 
            : 'border-white/20 bg-neutral-900/30 hover:border-primary-400/50 hover:bg-primary-500/5'
          }
        `}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center space-y-3">
          <div className={`
            p-4 rounded-full transition-all duration-200
            ${isDragging 
              ? 'bg-primary-500/20 shadow-lg shadow-primary-500/30' 
              : 'bg-neutral-800/50'
            }
          `}>
            <Upload className={`h-8 w-8 ${isDragging ? 'text-primary-400' : 'text-neutral-400'}`} />
          </div>
          
          <div>
            <p className="text-white font-medium">{label}</p>
            <p className="text-sm text-neutral-400 mt-1">
              Supports all audio formats • Max {maxSize / 1024 / 1024}MB
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="glass rounded-lg p-4 flex items-center justify-between border border-accent-red/30 bg-accent-red/5 animate-slide-up">
          <div className="flex items-center space-x-3">
            <X className="h-5 w-5 text-accent-red" />
            <p className="text-sm text-accent-red">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
