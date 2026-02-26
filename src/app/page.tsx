'use client'

import React from 'react'
import Link from 'next/link'
import { Zap, AudioWaveform, Sparkles, Music, ArrowRight, Volume2, Layers, Cpu } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 gradient-primary rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">Waveridai</span>
            </div>
            <Link
              href="/studio"
              className="button-primary flex items-center space-x-2"
            >
              <span>Launch Studio</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 pt-20 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="h-4 w-4 text-primary-400" />
              <span className="text-sm text-primary-300">Powered by Advanced Neural Networks</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gradient">Polyphonic Neural</span>
              <br />
              <span className="text-white">Audio Synthesis</span>
            </h1>
            
            <p className="text-xl text-neutral-300 mb-12 max-w-2xl mx-auto">
              Transform any audio into any instrument while maintaining musical structure. 
              The first truly polyphonic audio-to-audio synthesis platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/studio"
                className="button-primary text-lg px-8 py-4 flex items-center space-x-2 shadow-xl hover:shadow-primary-500/20"
              >
                <span>Start Creating</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <button className="glass glass-hover text-lg px-8 py-4 rounded-lg flex items-center space-x-2">
                <AudioWaveform className="h-5 w-5" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Revolutionary Workflows</h2>
          <p className="text-neutral-400 text-lg">Two powerful approaches to audio transformation</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Precise Synthesis */}
          <div className="card group hover:border-primary-500/50 transition-all duration-300">
            <div className="p-3 gradient-primary rounded-lg w-fit mb-6 group-hover:scale-110 transition-transform">
              <Layers className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Precise Synthesis</h3>
            <p className="text-neutral-400 mb-6">MIDI-based polyphonic audio transformation with custom instrument training</p>
            <ul className="space-y-3 text-neutral-300">
              <li className="flex items-start space-x-3">
                <div className="h-2 w-2 rounded-full bg-primary-500 mt-2"></div>
                <span>Multi-track MIDI extraction from any audio</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="h-2 w-2 rounded-full bg-primary-500 mt-2"></div>
                <span>Train custom AI instruments from reference audio</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="h-2 w-2 rounded-full bg-primary-500 mt-2"></div>
                <span>Polyphonic synthesis with full musical structure</span>
              </li>
            </ul>
          </div>

          {/* AI Generation */}
          <div className="card group hover:border-secondary-500/50 transition-all duration-300">
            <div className="p-3 gradient-secondary rounded-lg w-fit mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">AI Generation</h3>
            <p className="text-neutral-400 mb-6">Natural language music generation powered by Google Lyria 2</p>
            <ul className="space-y-3 text-neutral-300">
              <li className="flex items-start space-x-3">
                <div className="h-2 w-2 rounded-full bg-secondary-500 mt-2"></div>
                <span>Describe music in natural language</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="h-2 w-2 rounded-full bg-secondary-500 mt-2"></div>
                <span>48kHz stereo with full arrangements</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="h-2 w-2 rounded-full bg-secondary-500 mt-2"></div>
                <span>Optional style reference from uploaded audio</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Technical Specs */}
      <div className="relative z-10 container mx-auto px-4 py-24 border-t border-white/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Powered by Cutting-Edge AI</h2>
          <p className="text-neutral-400 text-lg">Industry-leading models and techniques</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card text-center">
            <div className="p-3 gradient-primary rounded-lg w-fit mx-auto mb-4">
              <Music className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Basic Pitch</h3>
            <p className="text-neutral-400">Spotify&apos;s polyphonic pitch detection for accurate MIDI extraction</p>
          </div>

          <div className="card text-center">
            <div className="p-3 gradient-primary rounded-lg w-fit mx-auto mb-4">
              <Volume2 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Spleeter</h3>
            <p className="text-neutral-400">Advanced source separation for multi-track processing</p>
          </div>

          <div className="card text-center">
            <div className="p-3 gradient-secondary rounded-lg w-fit mx-auto mb-4">
              <Cpu className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Custom Neural Models</h3>
            <p className="text-neutral-400">DDSP and diffusion models for high-quality synthesis</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center card">
          <h2 className="text-4xl font-bold mb-4 text-white">Ready to Transform Your Audio?</h2>
          <p className="text-xl text-neutral-300 mb-8">
            Join the future of audio synthesis. Start creating polyphonic magic today.
          </p>
          <Link
            href="/studio"
            className="button-primary text-lg px-8 py-4 inline-flex items-center space-x-2 shadow-xl hover:shadow-primary-500/20"
          >
            <span>Launch Studio Now</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-neutral-400">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 gradient-primary rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white">Waveridai</span>
            </div>
            <p className="text-sm">© 2024 Waveridai. Polyphonic Neural Audio Synthesis.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
