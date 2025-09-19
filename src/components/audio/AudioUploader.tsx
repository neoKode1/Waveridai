'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileAudio, AlertCircle, CheckCircle } from 'lucide-react'
import { AudioUtils } from '@/lib/utils/audio'
import { cn } from '@/lib/utils/cn'

// Use the native Web Audio API AudioBuffer
type AudioBuffer = globalThis.AudioBuffer

interface AudioUploaderProps {
  onUpload: (file: File, audioBuffer: AudioBuffer) => void
  accept: string[]
  maxSize: number
  title: string
  description: string
  className?: string
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  onUpload,
  accept,
  maxSize,
  title,
  description,
  className
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setError(null)
    setIsProcessing(true)

    try {
      // Validate file
      const validation = AudioUtils.validateAudioFile(file)
      if (!validation.valid) {
        setError(validation.error || 'Invalid file')
        return
      }

      // Convert to AudioBuffer
      const audioBuffer = await AudioUtils.fileToAudioBuffer(file)
      
      // Analyze audio (currently unused)
      // const analysis = await AudioUtils.analyzeAudio(audioBuffer)
      
      setUploadedFile(file)
      onUpload(file, audioBuffer)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process audio file')
    } finally {
      setIsProcessing(false)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: handleDrop,
    accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple: false,
    disabled: isProcessing
  })

  const formatAcceptTypes = (types: string[]) => {
    return types.map(type => type.split('/')[1].toUpperCase()).join(', ')
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer',
          'hover:border-purple-400 hover:bg-purple-50/10',
          isDragActive && !isDragReject && 'border-purple-400 bg-purple-50/20',
          isDragReject && 'border-red-400 bg-red-50/20',
          uploadedFile && 'border-green-400 bg-green-50/20',
          isProcessing && 'pointer-events-none opacity-50'
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <p className="text-gray-400">Processing audio...</p>
            </>
          ) : uploadedFile ? (
            <>
              <CheckCircle className="h-12 w-12 text-green-500" />
              <div>
                <p className="text-lg font-medium text-green-600">{uploadedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {AudioUtils.formatFileSize(uploadedFile.size)} • {AudioUtils.formatDuration(0)}
                </p>
              </div>
            </>
          ) : (
            <>
              {isDragActive ? (
                <Upload className="h-12 w-12 text-purple-500" />
              ) : (
                <FileAudio className="h-12 w-12 text-gray-400" />
              )}
              
              <div>
                <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
                <p className="text-gray-400 mb-4">{description}</p>
                
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Supported formats: {formatAcceptTypes(accept)}</p>
                  <p>Max file size: {AudioUtils.formatFileSize(maxSize)}</p>
                </div>
                
                <button
                  type="button"
                  className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Choose File
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center space-x-2 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  )
}
