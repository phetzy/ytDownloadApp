'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Loader2, Video, Music } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { VideoInfo } from '@/lib/types'

export default function YouTubeDownloader() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [selectedQuality, setSelectedQuality] = useState('')
  const [downloadFormat, setDownloadFormat] = useState<'video' | 'audio'>('video')
  const [downloading, setDownloading] = useState(false)

  const handleFetchInfo = async () => {
    if (!url.trim()) {
      toast.error('Please enter a YouTube URL')
      return
    }

    setLoading(true)
    setVideoInfo(null)
    setSelectedQuality('')

    try {
      const response = await axios.post('/api/video-info', { url })
      setVideoInfo(response.data)
      
      // Auto-select first quality
      if (response.data.formats && response.data.formats.length > 0) {
        setSelectedQuality(response.data.formats[0].formatId)
      }
      
      toast.success('Video information loaded!')
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch video information'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!videoInfo || !selectedQuality) {
      toast.error('Please select a quality first')
      return
    }

    setDownloading(true)

    try {
      const response = await axios.post('/api/download', {
        url,
        quality: selectedQuality,
        format: downloadFormat,
      })

      if (response.data.success && response.data.downloadUrl) {
        // Create a temporary link to trigger download
        const link = document.createElement('a')
        link.href = response.data.downloadUrl
        link.download = response.data.filename || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast.success('Download started!')
      } else {
        throw new Error(response.data.error || 'Download failed')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to download video'
      toast.error(errorMessage)
    } finally {
      setDownloading(false)
    }
  }

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size'
    const mb = bytes / (1024 * 1024)
    if (mb > 1024) {
      return `${(mb / 1024).toFixed(2)} GB`
    }
    return `${mb.toFixed(2)} MB`
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Input Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">YouTube Downloader</CardTitle>
          <CardDescription>
            Paste a YouTube link below to download videos or audio in your preferred quality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">YouTube URL</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFetchInfo()}
                disabled={loading}
              />
              <Button 
                onClick={handleFetchInfo} 
                disabled={loading || !url.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading
                  </>
                ) : (
                  'Fetch Info'
                )}
              </Button>
            </div>
          </div>

          {/* Format Selection */}
          <div className="flex gap-4">
            <button
              onClick={() => setDownloadFormat('video')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                downloadFormat === 'video'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Video className="h-5 w-5" />
                <span className="font-medium">Video</span>
              </div>
            </button>
            <button
              onClick={() => setDownloadFormat('audio')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                downloadFormat === 'audio'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Music className="h-5 w-5" />
                <span className="font-medium">Audio Only</span>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Video Info Card */}
      {videoInfo && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              {videoInfo.thumbnail && (
                <img
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  className="w-40 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg line-clamp-2">
                  {videoInfo.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Duration: {formatDuration(videoInfo.duration)}
                </p>
                
                <div className="space-y-2 pt-2">
                  <Label htmlFor="quality">Select Quality</Label>
                  <Select
                    id="quality"
                    value={selectedQuality}
                    onChange={(e) => setSelectedQuality(e.target.value)}
                  >
                    {videoInfo.formats.map((format) => (
                      <option key={format.formatId} value={format.formatId}>
                        {format.resolution} - {format.ext.toUpperCase()} 
                        {format.filesize && ` (${formatFileSize(format.filesize)})`}
                      </option>
                    ))}
                  </Select>
                </div>

                <Button
                  onClick={handleDownload}
                  disabled={downloading || !selectedQuality}
                  className="w-full mt-4"
                  size="lg"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download {downloadFormat === 'audio' ? 'Audio' : 'Video'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Supports YouTube videos and shorts</p>
            <p>• Choose between video or audio-only downloads</p>
            <p>• Multiple quality options available</p>
            <p>• Fast and secure processing</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
