'use client'

import React, { useState } from 'react'
import { StudioHeader } from '@/components/workflow/StudioHeader'
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <StudioHeader />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gradient mb-4">Get in Touch</h1>
            <p className="text-lg text-neutral-400">
              Have questions about Waveridai's polyphonic neural audio synthesis? We're here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <div className="card">
                <div className="flex items-start space-x-4">
                  <div className="p-3 gradient-primary rounded-lg">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-100 mb-2">Email Us</h3>
                    <p className="text-neutral-400 mb-2">
                      For general inquiries and support
                    </p>
                    <a 
                      href="mailto:support@waveridai.com" 
                      className="text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      support@waveridai.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start space-x-4">
                  <div className="p-3 gradient-secondary rounded-lg">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-100 mb-2">Technical Support</h3>
                    <p className="text-neutral-400 mb-2">
                      Need help with audio processing or model training?
                    </p>
                    <a 
                      href="mailto:technical@waveridai.com" 
                      className="text-secondary-400 hover:text-secondary-300 transition-colors"
                    >
                      technical@waveridai.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="card bg-primary-500/10 border-primary-500/20">
                <h3 className="text-lg font-semibold text-neutral-100 mb-3">Quick Info</h3>
                <ul className="space-y-2 text-neutral-300">
                  <li className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-400" />
                    <span>Average response time: 24 hours</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-400" />
                    <span>Support available Monday-Friday</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-400" />
                    <span>Check our docs for quick answers</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card">
              <h2 className="text-2xl font-bold text-neutral-100 mb-6">Send us a Message</h2>
              
              {isSubmitted ? (
                <div className="py-12 text-center animate-fade-in">
                  <div className="inline-flex p-4 gradient-primary rounded-full mb-4">
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-100 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-neutral-400">
                    We'll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
                      Name *
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
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input w-full"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-neutral-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="input w-full"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="input w-full resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "button-primary w-full flex items-center justify-center space-x-2",
                      isSubmitting && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
