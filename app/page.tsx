import YouTubeDownloader from '@/components/youtube-downloader'
import { ThemeToggle } from '@/components/theme-toggle'
import { AdSense } from '@/components/adsense'
import { Footer } from '@/components/footer'

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
        
        {/* Top Ad - Above main content */}
        <div className="mb-8 flex justify-center">
          <AdSense 
            adSlot="YOUR_TOP_AD_SLOT_ID"
            adFormat="auto"
            className="max-w-4xl"
          />
        </div>
        
        <YouTubeDownloader />
        
        {/* Bottom Ad - Below main content */}
        <div className="mt-12 flex justify-center">
          <AdSense 
            adSlot="YOUR_BOTTOM_AD_SLOT_ID"
            adFormat="auto"
            className="max-w-4xl"
          />
        </div>

        {/* Features Section */}
        <section className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Our YouTube Downloader?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-card border">
              <h3 className="text-xl font-semibold mb-3">Multiple Quality Options</h3>
              <p className="text-muted-foreground">
                Download videos in various quality formats from 144p to 4K+ resolution. Choose the perfect balance between file size and video quality for your needs.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border">
              <h3 className="text-xl font-semibold mb-3">Audio Extraction</h3>
              <p className="text-muted-foreground">
                Extract high-quality MP3 audio from any YouTube video. Perfect for music, podcasts, or creating your personal audio library offline.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border">
              <h3 className="text-xl font-semibold mb-3">Fast & Secure</h3>
              <p className="text-muted-foreground">
                Our servers process downloads quickly and securely. No software installation required, and your privacy is protected throughout the process.
              </p>
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How to Download YouTube Videos</h2>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Copy the YouTube Video URL</h3>
                <p className="text-muted-foreground">
                  Navigate to YouTube and find the video you want to download. Copy the URL from your browser&apos;s address bar or use the &quot;Share&quot; button to get the link.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Paste URL and Select Format</h3>
                <p className="text-muted-foreground">
                  Paste the YouTube video URL into the input field above. Choose whether you want to download the video (MP4) or extract audio only (MP3). Click &quot;Get Video Info&quot; to see available options.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Choose Quality and Download</h3>
                <p className="text-muted-foreground">
                  Select your preferred video quality or audio format from the available options. Click the &quot;Download&quot; button, and your file will be processed and downloaded to your device automatically.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-16 max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-card border">
              <h3 className="text-xl font-semibold mb-2">Is it legal to download YouTube videos?</h3>
              <p className="text-muted-foreground">
                Downloading videos for personal, offline viewing may be allowed under YouTube&apos;s terms for YouTube Premium subscribers. Always respect copyright laws and content creators&apos; rights. Only download videos you have permission to use.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border">
              <h3 className="text-xl font-semibold mb-2">What video quality options are available?</h3>
              <p className="text-muted-foreground">
                We offer multiple quality options ranging from 144p (low quality, small file size) up to 4K and beyond, depending on the original video&apos;s upload quality. Higher quality means larger file sizes but better viewing experience.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border">
              <h3 className="text-xl font-semibold mb-2">Do I need to install any software?</h3>
              <p className="text-muted-foreground">
                No installation required! Our YouTube downloader is completely web-based. Simply visit our site, paste the video URL, and download. It works on any device with a web browser - desktop, mobile, or tablet.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border">
              <h3 className="text-xl font-semibold mb-2">Is there a download limit?</h3>
              <p className="text-muted-foreground">
                Our service is free to use with reasonable usage limits to ensure fair access for all users. For high-volume downloading needs, please use the service responsibly and consider the bandwidth impact.
              </p>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  )
}
