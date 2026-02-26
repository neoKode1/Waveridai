'use client'

import React from 'react'
import { StudioHeader } from '@/components/workflow/StudioHeader'
import { WorkflowContainer } from '@/components/workflow/WorkflowContainer'

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-neutral-950 relative overflow-hidden">
      {/* Holographic grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 -left-4 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary-500/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10">
        <StudioHeader />
        <WorkflowContainer />
      </div>
    </div>
  )
}
