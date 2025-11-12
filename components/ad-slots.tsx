'use client'

import { useEffect } from 'react'

// Google AdSense Ad Slots
// Publisher ID: ca-pub-3595854121600052
// Replace 'XXXXX' with your ad slot IDs after creating ad units in AdSense dashboard

export function HeaderAd() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('AdSense error:', e)
    }
  }, [])

  return (
    <div className="w-full flex justify-center py-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3595854121600052"
        data-ad-slot="XXXXX"
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  )
}

export function InContentAd() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('AdSense error:', e)
    }
  }, [])

  return (
    <div className="my-8 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3595854121600052"
        data-ad-slot="XXXXX"
        data-ad-format="rectangle"
        data-full-width-responsive="true"
      />
    </div>
  )
}

export function SidebarAd() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('AdSense error:', e)
    }
  }, [])

  return (
    <div className="sticky top-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3595854121600052"
        data-ad-slot="XXXXX"
        data-ad-format="vertical"
        data-full-width-responsive="true"
      />
    </div>
  )
}

export function BottomAd() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('AdSense error:', e)
    }
  }, [])

  return (
    <div className="w-full flex justify-center py-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3595854121600052"
        data-ad-slot="XXXXX"
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  )
}

// Placeholder for development
export function AdPlaceholder({ type }: { type: string }) {
  return (
    <div className="w-full flex items-center justify-center py-8 bg-muted/30 border-2 border-dashed border-muted-foreground/20 rounded-lg">
      <p className="text-sm text-muted-foreground">
        {type} Ad Placeholder - Replace with actual ads after AdSense approval
      </p>
    </div>
  )
}
