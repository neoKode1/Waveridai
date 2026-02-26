'use client'

import React, { useCallback } from 'react'
import { Upload, FileAudio, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface AudioUploaderProps {
  onUpload: (file: File) => void
  currentFile?: File | null
  label?: string
  description?: string
  accept?: string
  maxSize?: number // in MB
  variant?: 'primary' | 'secondary'
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  onUpload,
  currentFile,
  label = 'Upload Audio',
  description = 'Drag and drop or click to browse',
  accept = 'audio/*',
  maxSize = 50,
  variant = 'primary',
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
      const audioFile = files.find((file) => file.type.startsWith('audio/'))

      if (audioFile) {
        if (audioFile.size <= maxSize * 1024 * 1024) {
          onUpload(audioFile)
        } else {
          alert(`File size must be less than ${maxSize}MB`)
        }
      }
    },
    [onUpload, maxSize]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files[0]) {
        if (files[0].size <= maxSize * 1024 * 1024) {
          onUpload(files[0])
        } else {
          alert(`File size must be less than ${maxSize}MB`)
        }
      }
    },
    [onUpload, maxSize]
  )

  const handleRemoveFile = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    // Dispatch remove event if needed
  }, [])

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer group',
          isDragging
            ? variant === 'primary'
              ? 'border-primary-500 bg-primary-500/10'
              : 'border-secondary-500 bg-secondary-500/10'
            : currentFile
            ? 'border-neutral-600 bg-neutral-800/50'
            : 'border-neutral-700 hover:border-neutral-600 bg-neutral-800/30 hover:bg-neutral-800/50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        {!currentFile ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div
              className={cn(
                'p-4 rounded-full mb-4 transition-all duration-300',
                variant === 'primary'
                  ? 'bg-primary-500/10 group-hover:bg-primary-500/20'
                  : 'bg-secondary-500/10 group-hover:bg-secondary-500/20'
              )}
            >
              <Upload
                className={cn(
                  'h-8 w-8 transition-colors',
                  variant === 'primary'
                    ? 'text-primary-400 group-hover:text-primary-300'
                    : 'text-secondary-400 group-hover:text-secondary-300'
                )}
              />
            </div>
            <h3 className="text-lg font-semibold mb-1 text-white">{label}</h3>
            <p className="text-sm text-neutral-400 mb-2">{description}</p>
            <p className="text-xs text-neutral-500">Max file size: {maxSize}MB</p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  'p-3 rounded-lg',
                  variant === 'primary' ? 'bg-primary-500/10' : 'bg-secondary-500/10'
                )}
              >
                <FileAudio
                  className={cn(
                    'h-5 w-5',
                    variant === 'primary' ? 'text-primary-400' : 'text-secondary-400'
                  )}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{currentFile.name}</p>
                <p className="text-xs text-neutral-500">
                  {(currentFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveFile()
              }}
              className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-neutral-400 hover:text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
