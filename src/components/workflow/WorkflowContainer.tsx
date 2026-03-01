'use client'

import React from 'react'
import { WorkflowProvider } from '@/contexts/WorkflowContext'
import { StudioHeader } from './StudioHeader'
import { WorkflowProgress } from './WorkflowProgress'
import { SourceUploadSection } from './SourceUploadSection'
import { DesiredAudioSection } from './DesiredAudioSection'
import { ReferenceUploadSection } from './ReferenceUploadSection'
import { GenerateSection } from './GenerateSection'
import { ResultsSection } from './ResultsSection'

export const WorkflowContainer: React.FC = () => {
  return (
    <WorkflowProvider>
      <div className="min-h-screen bg-neutral-950 relative overflow-hidden">
        {/* Animated background grid */}
        <div className="fixed inset-0 cyber-grid opacity-30 pointer-events-none"></div>
        
        {/* Floating orbs */}
        <div className="fixed top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
        <div className="fixed bottom-20 right-10 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }}></div>
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>
        
        <StudioHeader />
        
        <main className="relative z-10 pt-24">
          <div className="container mx-auto px-6 py-8 max-w-7xl">
            {/* Hero section */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-primary-300 font-medium">AI-Powered Audio Synthesis</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-gradient">Transform Your Sound</span>
              </h2>
              <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                Convert any audio to any instrument while preserving musical structure. 
                Experience the future of polyphonic neural synthesis.
              </p>
            </div>
            
            {/* Progress indicator */}
            <div className="mb-12 animate-slide-down">
              <WorkflowProgress />
            </div>
            
            {/* Workflow sections */}
            <div className="space-y-8">
              <div className="animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                <SourceUploadSection />
              </div>
              
              <div className="animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                <DesiredAudioSection />
              </div>
              
              <div className="animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                <ReferenceUploadSection />
              </div>
              
              <div className="animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                <GenerateSection />
              </div>
              
              <div className="animate-slide-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                <ResultsSection />
              </div>
            </div>
            
            {/* Footer info */}
            <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
              <div className="inline-flex items-center space-x-8 text-sm text-neutral-500">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span>48kHz Stereo Output</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <span>Real-time Processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <span>Polyphonic Support</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </WorkflowProvider>
  )
}
