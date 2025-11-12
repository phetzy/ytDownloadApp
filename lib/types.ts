import { z } from 'zod'

// Validation schema for YouTube URL
export const youtubeUrlSchema = z.string().refine(
  (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/
    return youtubeRegex.test(url)
  },
  { message: 'Invalid YouTube URL' }
)

// Download request type
export interface DownloadRequest {
  url: string
  quality: string
  format: 'video' | 'audio'
}

// Video info response
export interface VideoInfo {
  title: string
  duration: number
  thumbnail: string
  formats: VideoFormat[]
}

// Video format type
export interface VideoFormat {
  formatId: string
  ext: string
  resolution: string
  filesize?: number
  vcodec?: string
  acodec?: string
}

// Download response
export interface DownloadResponse {
  success: boolean
  downloadUrl?: string
  error?: string
  filename?: string
}
