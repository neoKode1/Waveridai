'use client'

import React from 'react'
import Link from 'next/link'
import { Zap, Waves, Sparkles, ArrowRight, Music, Brain, Layers } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 relative overflow-hidden">
      {/* Holographic grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 -left-4 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary-500/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 gradient-primary rounded-lg shadow-lg shadow-primary-500/50">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gradient">Waveridai</h1>
                  <p className="text-xs text-neutral-400">Neural Audio Synthesis</p>
                </div>
              </div>
              
              <Link 
                href="/studio"
                className="button-primary flex items-center space-x-2 shadow-lg shadow-primary-500/30"
              >
                <span>Launch Studio</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-8">
              <Sparkles className="h-4 w-4 text-primary-400" />
              <span className="text-sm text-neutral-300">Polyphonic Neural Audio Synthesis</span>
            </div>
            
            <h2 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">Transform Sound</span>
              <br />
              <span className="text-white">Through AI</span>
            </h2>
            
            <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto">
              Convert audio samples from one instrument to another while maintaining musical structure. 
              Advanced polyphonic processing beyond monophonic limitations.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/studio"
                className="button-primary flex items-center space-x-2 shadow-lg shadow-primary-500/30 text-lg px-8 py-4"
              >
                <Zap className="h-5 w-5" />
                <span>Start Creating</span>
              </Link>
              
              <button className="glass glass-hover flex items-center space-x-2 text-lg px-8 py-4 rounded-lg">
                <span className="text-white">Watch Demo</span>
                <ArrowRight className="h-5 w-5 text-neutral-400" />
              </button>
            </div>
          </div>

          {/* Holographic Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-6xl mx-auto">
            <div className="card group hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300">
              <div className="p-3 gradient-primary rounded-lg inline-flex mb-4 shadow-lg shadow-primary-500/50 group-hover:scale-110 transition-transform">
                <Waves className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Precise Synthesis</h3>
              <p className="text-neutral-400">MIDI-based polyphonic conversion with custom reference sounds and real-time manipulation</p>
            </div>
            
            <div className="card group hover:shadow-xl hover:shadow-secondary-500/20 transition-all duration-300">
              <div className="p-3 gradient-secondary rounded-lg inline-flex mb-4 shadow-lg shadow-secondary-500/50 group-hover:scale-110 transition-transform">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI Generation</h3>
              <p className="text-neutral-400">Natural language music creation powered by Google Lyria 2 with 48kHz stereo output</p>
            </div>
            
            <div className="card group hover:shadow-xl hover:shadow-accent-purple/20 transition-all duration-300">
              <div className="p-3 bg-accent-purple rounded-lg inline-flex mb-4 shadow-lg shadow-accent-purple/50 group-hover:scale-110 transition-transform">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Polyphonic Power</h3>
              <p className="text-neutral-400">Multi-track processing and source separation for complex musical arrangements</p>
            </div>
          </div>
        </section>

        {/* Tech Section */}
        <section className="container mx-auto px-4 py-24 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-white mb-4">Powered by Advanced AI</h3>
              <p className="text-xl text-neutral-400">State-of-the-art models for professional audio synthesis</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <div className="flex items-start space-x-4">
                  <div className="p-3 gradient-primary rounded-lg shadow-lg shadow-primary-500/50">
                    <Music className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-2">Basic Pitch + Source Separation</h4>
                    <p className="text-neutral-400">Spotify's Basic Pitch for MIDI extraction combined with Spleeter for multi-track isolation</p>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-start space-x-4">
                  <div className="p-3 gradient-secondary rounded-lg shadow-lg shadow-secondary-500/50">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-2">Custom Neural Models</h4>
                    <p className="text-neutral-400">DDSP and Diffusion-based synthesis for high-quality audio generation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="card text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-primary opacity-5" />
              <div className="relative z-10">
                <h3 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Sound?</h3>
                <p className="text-xl text-neutral-400 mb-8">Start creating with polyphonic neural audio synthesis today</p>
                <Link 
                  href="/studio"
                  className="button-primary inline-flex items-center space-x-2 shadow-lg shadow-primary-500/30 text-lg px-8 py-4"
                >
                  <Zap className="h-5 w-5" />
                  <span>Launch Studio</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="p-2 gradient-primary rounded-lg shadow-lg shadow-primary-500/50">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gradient">Waveridai</span>
              </div>
              
              <p className="text-sm text-neutral-400">
                © 2024 Waveridai. Polyphonic Neural Audio Synthesis.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
