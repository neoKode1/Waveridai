'use client'

import React, { useCallback, useState, ReactNode } from 'react'
import { useDropzone } from 'react-dropzone'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface AudioUploaderProps {
  onUpload: (file: File) => void
  accept?: string
  maxSize?: number
  label?: string
  icon?: ReactNode
  className?: string
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  onUpload,
  accept = 'audio/*',
  maxSize = 50 * 1024 * 1024,
  label = 'Drop audio file here or click to browse',
  icon,
  className,
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return
      setError(null)
      setIsProcessing(true)
      try {
        setUploadedFile(file)
        onUpload(file)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process audio file')
      } finally {
        setIsProcessing(false)
      }
    },
    [onUpload]
  )

  // Build dropzone accept object from MIME string(s)
  const acceptObj = accept.split(',').reduce<Record<string, string[]>>((acc, type) => {
    acc[type.trim()] = []
    return acc
  }, {})

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: handleDrop,
    accept: acceptObj,
    maxSize,
    multiple: false,
    disabled: isProcessing,
  })

  return (
    <div className={cn('w-full', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer',
          'hover:border-primary-400 hover:bg-primary-500/5',
          isDragActive && !isDragReject && 'border-primary-400 bg-primary-500/10',
          isDragReject && 'border-red-500 bg-red-500/5',
          uploadedFile && 'border-green-500 bg-green-500/5',
          isProcessing && 'pointer-events-none opacity-50'
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center space-y-3">
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
              <p className="text-neutral-400 text-sm">Processing audio...</p>
            </>
          ) : uploadedFile ? (
            <>
              <CheckCircle className="h-10 w-10 text-green-500" />
              <p className="text-sm font-medium text-neutral-200">{uploadedFile.name}</p>
            </>
          ) : (
            <>
              <div className="text-neutral-400">{icon}</div>
              <p className="text-sm text-neutral-400">{label}</p>
              <p className="text-xs text-neutral-500">Click or drag &amp; drop</p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center space-x-2 text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  )
}

