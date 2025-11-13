'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
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
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadStatus, setDownloadStatus] = useState('')
  const [downloadComplete, setDownloadComplete] = useState(false)

  const resetForm = () => {
    setUrl('')
    setVideoInfo(null)
    setSelectedQuality('')
    setDownloadComplete(false)
    setDownloadFormat('video')
    toast.success('Ready for a new download!')
  }

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
    // For audio, we don't need video info or quality selection
    if (downloadFormat === 'video' && (!videoInfo || !selectedQuality)) {
      toast.error('Please fetch video info and select a quality first')
      return
    }

    if (!url.trim()) {
      toast.error('Please enter a YouTube URL')
      return
    }

    setDownloading(true)
    setDownloadProgress(0)
    setDownloadStatus('Preparing download...')

    try {
      // Step 1: Request download from backend
      setDownloadStatus('Processing video...')
      setDownloadProgress(20)
      
      const response = await axios.post('/api/download', {
        url,
        quality: selectedQuality || '192',
        format: downloadFormat,
      })

      if (response.data.success && response.data.downloadUrl) {
        // Step 2: Download file with progress tracking
        setDownloadStatus('Downloading file...')
        setDownloadProgress(40)
        
        const fileResponse = await axios.get(response.data.downloadUrl, {
          responseType: 'blob',
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                40 + (progressEvent.loaded / progressEvent.total) * 60
              )
              setDownloadProgress(percentCompleted)
              setDownloadStatus(`Downloading... ${percentCompleted}%`)
            }
          },
        })

        // Step 3: Trigger browser save dialog
        setDownloadStatus('Saving file...')
        setDownloadProgress(100)
        
        const blob = new Blob([fileResponse.data])
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = response.data.filename || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
        
        toast.success('Download complete!')
        setDownloadStatus('')
        setDownloadComplete(true)
      } else {
        throw new Error(response.data.error || 'Download failed')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to download'
      toast.error(errorMessage)
      setDownloadStatus('')
    } finally {
      setDownloading(false)
      setDownloadProgress(0)
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

      {/* Audio Download Section */}
      {downloadFormat === 'audio' && videoInfo && (
        <Card>
          <CardContent className="pt-6">
          <div className="flex gap-4">
              {videoInfo.thumbnail && (
                <Image
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  width={160}
                  height={96}
                  className="w-40 h-24 object-cover rounded-lg"
                  unoptimized
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
                  <Label htmlFor="audio-quality">Audio Quality</Label>
                  <Select
                    id="audio-quality"
                    value={selectedQuality || '192'}
                    onChange={(e) => setSelectedQuality(e.target.value)}
                  >
                    <option value="320">320 kbps (Best Quality)</option>
                    <option value="192">192 kbps (High Quality)</option>
                    <option value="128">128 kbps (Standard Quality)</option>
                    <option value="96">96 kbps (Low Quality)</option>
                  </Select>
                </div>

                {downloading && (
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{downloadStatus}</span>
                      <span className="text-muted-foreground">{downloadProgress}%</span>
                    </div>
                    <Progress value={downloadProgress} />
                  </div>
                )}

                <Button
                  onClick={handleDownload}
                  disabled={downloading}
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
                      Download Audio (MP3)
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Info Card */}
      {videoInfo && downloadFormat === 'video' && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              {videoInfo.thumbnail && (
                <Image
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  width={160}
                  height={96}
                  className="w-40 h-24 object-cover rounded-lg"
                  unoptimized
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

                {downloading && (
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{downloadStatus}</span>
                      <span className="text-muted-foreground">{downloadProgress}%</span>
                    </div>
                    <Progress value={downloadProgress} />
                  </div>
                )}

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
                      Download Video
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Download Another Video Button */}
      {downloadComplete && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-1">Download Complete! 🎉</h3>
                <p className="text-sm text-muted-foreground">
                  Ready to download another video?
                </p>
              </div>
              <Button
                onClick={resetForm}
                variant="default"
                size="lg"
                className="w-full max-w-md"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Another Video
              </Button>
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
