'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

interface WorkflowContainerProps {
  children: React.ReactNode
  className?: string
}

export const WorkflowContainer: React.FC<WorkflowContainerProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn(
      'max-w-6xl mx-auto space-y-8',
      className
    )}>
      {children}
    </div>
  )
}
