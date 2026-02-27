'use client'

import React, { useState } from 'react'
import { StudioHeader } from '@/components/workflow/StudioHeader'
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setStatus('idle'), 3000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <StudioHeader />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gradient mb-4">Get in Touch</h1>
            <p className="text-neutral-400 text-lg">
              Have questions about Waveridai? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 gradient-primary rounded-lg">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Send us a message</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input w-full"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input w-full"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-neutral-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="input w-full"
                    placeholder="What is this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="input w-full resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="button-primary w-full flex items-center justify-center space-x-2"
                >
                  {status === 'sending' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />
                      <span>Sending...</span>
                    </>
                  ) : status === 'success' ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {status === 'error' && (
                  <p className="text-error text-sm text-center">
                    Failed to send message. Please try again.
                  </p>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="card">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 gradient-secondary rounded-lg">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Email Us</h3>
                </div>
                <p className="text-neutral-400">
                  For general inquiries and support:
                </p>
                <a 
                  href="mailto:support@waveridai.com" 
                  className="text-primary-400 hover:text-primary-300 transition-colors inline-block mt-2"
                >
                  support@waveridai.com
                </a>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold mb-4">About Waveridai</h3>
                <p className="text-neutral-400 mb-4">
                  Waveridai is a cutting-edge polyphonic neural audio synthesis application 
                  that converts audio samples from one instrument or sound to another while 
                  maintaining musical structure.
                </p>
                <p className="text-neutral-400">
                  We use advanced AI models for polyphonic content processing, beating 
                  current monophonic limitations in the market.
                </p>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/studio" className="text-primary-400 hover:text-primary-300 transition-colors">
                      Studio
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/yourusername/waveridai" className="text-primary-400 hover:text-primary-300 transition-colors">
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a href="/docs" className="text-primary-400 hover:text-primary-300 transition-colors">
                      Documentation
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
