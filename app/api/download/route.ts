import { NextRequest, NextResponse } from 'next/server'
import { youtubeUrlSchema } from '@/lib/types'
import axios from 'axios'

// Replace with your worker service URL (Railway/Fly.io)
const WORKER_URL = process.env.WORKER_SERVICE_URL || 'http://127.0.0.1:8000'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { url, quality, format } = body

    // Validate URL
    const validationResult = youtubeUrlSchema.safeParse(url)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      )
    }

    // Validate format
    if (!['video', 'audio'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Must be "video" or "audio"' },
        { status: 400 }
      )
    }

    // Request download from worker service
    const response = await axios.post(
      `${WORKER_URL}/api/download`,
      { url, quality, format },
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    // Fix the downloadUrl to point to the worker service
    const responseData = response.data
    if (responseData.success && responseData.downloadUrl) {
      // If downloadUrl is relative, prepend worker URL
      if (responseData.downloadUrl.startsWith('/')) {
        responseData.downloadUrl = `${WORKER_URL}${responseData.downloadUrl}`
      }
    }

    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error('Error initiating download:', error)
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        return NextResponse.json(
          { error: 'Request timeout. Please try again.' },
          { status: 504 }
        )
      }
      
      if (error.response) {
        return NextResponse.json(
          { error: error.response.data.error || 'Failed to initiate download' },
          { status: error.response.status }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to process download request' },
      { status: 500 }
    )
  }
}
