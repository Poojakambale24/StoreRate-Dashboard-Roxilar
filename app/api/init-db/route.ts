import { NextRequest, NextResponse } from 'next/server'
import { initializeDatabase } from '@/lib/init-db'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting database initialization...')
    const success = await initializeDatabase()
    
    if (success) {
      return NextResponse.json({
        message: 'Database initialized successfully',
        success: true
      })
    } else {
      return NextResponse.json({
        message: 'Database initialization failed',
        success: false
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json({
      message: 'Database initialization failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 })
  }
}