'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, Settings, HelpCircle, Mail } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export const StudioHeader: React.FC = () => {
  const pathname = usePathname()
  
  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/studio" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="p-2 gradient-primary rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">Waveridai</h1>
              <p className="text-sm text-neutral-400">Polyphonic Neural Audio Synthesis</p>
            </div>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link 
              href="/contact"
              className={cn(
                "flex items-center space-x-2 transition-colors",
                pathname === '/contact' 
                  ? 'text-primary-400' 
                  : 'text-neutral-300 hover:text-primary-400'
              )}
            >
              <Mail className="h-4 w-4" />
              <span className="text-sm">Contact</span>
            </Link>
            
            <button className="flex items-center space-x-2 text-neutral-300 hover:text-primary-400 transition-colors">
              <Settings className="h-4 w-4" />
              <span className="text-sm">Settings</span>
            </button>
            
            <button className="flex items-center space-x-2 text-neutral-300 hover:text-primary-400 transition-colors">
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm">Help</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
