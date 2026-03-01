'use client'

import React, { useCallback } from 'react'
import { Upload, FileAudio, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface AudioUploaderProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number
  label?: string
  description?: string
  currentFile?: File | null
  isLoading?: boolean
  className?: string
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  onFileSelect,
  accept = 'audio/*',
  maxSize = 50 * 1024 * 1024, // 50MB
  label = 'Upload Audio',
  description = 'Drag and drop or click to browse',
  currentFile,
  isLoading = false,
  className,
}) => {
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      const audioFile = files.find(file => file.type.startsWith('audio/'))

      if (audioFile && audioFile.size <= maxSize) {
        onFileSelect(audioFile)
      }
    },
    [maxSize, onFileSelect]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file && file.size <= maxSize) {
        onFileSelect(file)
      }
    },
    [maxSize, onFileSelect]
  )

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    // Note: We can't directly clear the file, but we can notify parent
    // Parent should handle clearing the currentFile
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-100">{label}</h3>
          <p className="text-sm text-neutral-400 mt-1">{description}</p>
        </div>
      </div>

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 group',
          'hover:border-primary-500/50 hover:bg-primary-500/5',
          isDragging && 'border-primary-500 bg-primary-500/10 scale-[1.02]',
          !isDragging && !currentFile && 'border-neutral-700',
          currentFile && 'border-primary-500/50 bg-primary-500/5',
          isLoading && 'pointer-events-none opacity-60'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
          disabled={isLoading}
        />

        {isLoading ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 text-primary-400 animate-spin" />
            <p className="text-neutral-300 font-medium">Processing audio...</p>
          </div>
        ) : currentFile ? (
          <div className="flex flex-col items-center space-y-4 animate-fade-in">
            <div className="relative">
              <div className="p-4 bg-gradient-primary rounded-2xl shadow-glow">
                <FileAudio className="h-10 w-10 text-white" />
              </div>
              <button
                onClick={handleRemove}
                className="absolute -top-2 -right-2 p-1.5 bg-error rounded-full text-white hover:scale-110 transition-transform duration-200 shadow-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-neutral-100 font-medium">{currentFile.name}</p>
              <p className="text-sm text-neutral-400">
                {(currentFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="p-4 bg-neutral-800 rounded-2xl group-hover:bg-neutral-700 transition-colors duration-300">
                <Upload className="h-10 w-10 text-neutral-400 group-hover:text-primary-400 transition-colors duration-300" />
              </div>
              <div className="absolute inset-0 bg-primary-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="space-y-2">
              <p className="text-neutral-300 font-medium group-hover:text-primary-300 transition-colors duration-300">
                {isDragging ? 'Drop your file here' : 'Drag and drop your audio file'}
              </p>
              <p className="text-sm text-neutral-500">
                or <span className="text-primary-400 font-medium">click to browse</span>
              </p>
              <p className="text-xs text-neutral-600">
                Supports MP3, WAV, FLAC, OGG (max {maxSize / 1024 / 1024}MB)
              </p>
            </div>
          </div>
        )}
        
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/0 via-primary-500/50 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ 
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s linear infinite'
        }}></div>
      </div>
    </div>
  )
}
