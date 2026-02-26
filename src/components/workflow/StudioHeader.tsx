'use client'

import React from 'react'
import Link from 'next/link'
import { Zap, Settings, HelpCircle, Home } from 'lucide-react'

export const StudioHeader: React.FC = () => {
  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-2 gradient-primary rounded-lg group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">Waveridai</h1>
                <p className="text-sm text-neutral-400">Polyphonic Neural Audio Synthesis</p>
              </div>
            </Link>
          </div>

          <nav className="flex items-center space-x-6">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-neutral-300 hover:text-primary-400 transition-colors group"
            >
              <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm">Home</span>
            </Link>
            
            <button className="flex items-center space-x-2 text-neutral-300 hover:text-primary-400 transition-colors group">
              <Settings className="h-4 w-4 group-hover:rotate-90 transition-transform" />
              <span className="text-sm">Settings</span>
            </button>
            
            <button className="flex items-center space-x-2 text-neutral-300 hover:text-primary-400 transition-colors group">
              <HelpCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm">Help</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
