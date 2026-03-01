'use client'

import React from 'react'
import { Zap, Settings, HelpCircle, Sparkles } from 'lucide-react'

export const StudioHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/60 backdrop-blur-xl border-b border-white/10">
      {/* Animated top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 group">
            <div className="relative p-2.5 gradient-primary rounded-xl glow-hover transition-all duration-300 group-hover:scale-110">
              <Zap className="h-6 w-6 text-white relative z-10" />
              <Sparkles className="h-3 w-3 text-secondary-400 absolute -top-1 -right-1 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient tracking-tight">Waveridai</h1>
              <p className="text-xs text-neutral-400 font-medium tracking-wide">Polyphonic Neural Audio Synthesis</p>
            </div>
          </div>

          <nav className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-neutral-300 hover:text-primary-400 hover:bg-white/5 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/10 to-primary-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <Settings className="h-4 w-4 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-sm font-medium relative z-10">Settings</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-neutral-300 hover:text-secondary-400 hover:bg-white/5 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-500/0 via-secondary-500/10 to-secondary-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <HelpCircle className="h-4 w-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm font-medium relative z-10">Help</span>
            </button>
          </nav>
        </div>
      </div>
      
      {/* Subtle glow effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent"></div>
    </header>
  )
}
