import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { component, message, data } = await request.json()
    
    // Log to terminal (this will show in the Next.js dev server terminal)
    console.log(`[${new Date().toISOString()}] 🎵 ${component}: ${message}`)
    
    if (data) {
      console.log('  Data:', JSON.stringify(data, null, 2))
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Log API error:', error)
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 })
  }
}
