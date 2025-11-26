import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t mt-16 py-8 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} YouTube Downloader. All rights reserved.
          </div>
          <nav className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </nav>
        </div>
        <div className="text-center mt-4 text-xs text-muted-foreground">
          <p>This tool is for personal use only. Always respect copyright and content creators' rights.</p>
        </div>
      </div>
    </footer>
  )
}
