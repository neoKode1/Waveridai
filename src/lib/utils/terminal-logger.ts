// Terminal logging utility for development
// This will help see logs in both browser console and terminal

interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  component: string
  message: string
  data?: unknown
}

class TerminalLogger {
  private logs: LogEntry[] = []
  private isServer = typeof window === 'undefined'

  log(component: string, message: string, data?: unknown) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      component,
      message,
      data
    }

    this.logs.push(entry)
    
    // Browser console logging
    console.log(`🎵 ${component}: ${message}`, data || '')
    
    // Server-side terminal logging (for development)
    if (this.isServer) {
      console.log(`[${entry.timestamp}] 🎵 ${component}: ${message}`)
      if (data) {
        console.log('  Data:', JSON.stringify(data, null, 2))
      }
    }
  }

  warn(component: string, message: string, data?: unknown) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      component,
      message,
      data
    }

    this.logs.push(entry)
    console.warn(`🎵 ${component}: ${message}`, data || '')
  }

  error(component: string, message: string, data?: unknown) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      component,
      message,
      data
    }

    this.logs.push(entry)
    console.error(`🎵 ${component}: ${message}`, data || '')
  }

  getLogs(): LogEntry[] {
    return this.logs
  }

  clearLogs() {
    this.logs = []
  }
}

export const terminalLogger = new TerminalLogger()

// Also expose a simple console.log wrapper for terminal output
export const logToTerminal = async (component: string, message: string, data?: unknown) => {
  // Always log to browser console
  console.log(`🎵 ${component}: ${message}`, data || '')
  
  // Send to terminal via API (this will show in Next.js dev server terminal)
  try {
    await fetch('/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        component,
        message,
        data
      })
    })
  } catch {
    // Fallback if API call fails
    console.log(`[TERMINAL FALLBACK] 🎵 ${component}: ${message}`, data || '')
  }
}
