'use client'

import { useEffect, useRef } from 'react'

interface AdSenseProps {
  adSlot: string
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  fullWidthResponsive?: boolean
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export function AdSense({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = ''
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null)
  const isLoaded = useRef(false)

  useEffect(() => {
    // Prevent double-loading in development mode
    if (isLoaded.current) return
    
    try {
      if (typeof window !== 'undefined' && adRef.current) {
        // Small delay to ensure DOM is ready and has dimensions
        const timer = setTimeout(() => {
          if (adRef.current && adRef.current.offsetWidth > 0) {
            (window.adsbygoogle = window.adsbygoogle || []).push({})
            isLoaded.current = true
          }
        }, 100)
        
        return () => clearTimeout(timer)
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={{ display: 'block', minHeight: '50px' }}
      data-ad-client="ca-pub-3595854121600052"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive.toString()}
    />
  )
}
