import YouTubeDownloader from '@/components/youtube-downloader'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1" /> {/* Spacer */}
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              YouTube Downloader
            </h1>
            <p className="text-muted-foreground">
              Download your favorite videos and audio with ease
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            <ThemeToggle />
          </div>
        </div>
        
        <YouTubeDownloader />
      </div>
    </main>
  )
}
