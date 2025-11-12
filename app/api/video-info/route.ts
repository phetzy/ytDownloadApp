import { NextRequest, NextResponse } from 'next/server'
import { youtubeUrlSchema } from '@/lib/types'
import axios from 'axios'

// Replace with your worker service URL (Railway/Fly.io)
const WORKER_URL = process.env.WORKER_SERVICE_URL

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { url } = body

    // Validate URL
    const validationResult = youtubeUrlSchema.safeParse(url)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      )
    }

    // Fetch video info from worker service
    const response = await axios.post(
      `${WORKER_URL}/api/video-info`,
      { url },
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error fetching video info:', error)
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        return NextResponse.json(
          { error: 'Request timeout. Please try again.' },
          { status: 504 }
        )
      }
      
      if (error.response) {
        return NextResponse.json(
          { error: error.response.data.error || 'Failed to fetch video info' },
          { status: error.response.status }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch video information' },
      { status: 500 }
    )
  }
}
