import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YouTube Downloader - Download Videos and Audio in High Quality | Free Online Tool',
  description: 'Free YouTube downloader - Download YouTube videos in MP4 (144p to 4K+) or extract audio as MP3. Fast, secure, and easy to use. No software installation required.',
  keywords: ['youtube downloader', 'download youtube videos', 'youtube to mp4', 'youtube to mp3', 'video downloader', 'audio downloader', 'free youtube downloader', 'online video downloader'],
  authors: [{ name: 'YouTube Downloader' }],
  creator: 'YouTube Downloader',
  publisher: 'YouTube Downloader',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'YouTube Downloader - Free Online Video & Audio Downloader',
    description: 'Download YouTube videos in multiple qualities (144p-4K+) or extract audio as MP3. Fast, free, and secure online tool.',
    siteName: 'YouTube Downloader',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'YouTube Downloader',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YouTube Downloader - Free Video & Audio Downloads',
    description: 'Download YouTube videos in MP4 or audio in MP3. Multiple quality options. Fast and secure.',
    images: ['/og-image.png'],
    creator: '@yourusername',
  },
  alternates: {
    canonical: 'https://your-domain.com',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-3595854121600052" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3595854121600052"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <Analytics />
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
