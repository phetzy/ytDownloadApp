import Image from 'next/image'

interface KofiButtonProps {
  kofiId: string
  className?: string
}

export function KofiButton({ 
  kofiId = "G2G01P5FRJ",
  className = "" 
}: KofiButtonProps) {
  return (
    <a
      href={`https://ko-fi.com/${kofiId}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block hover:opacity-90 transition-opacity ${className}`}
    >
      <Image
        src="https://storage.ko-fi.com/cdn/kofi6.png?v=6"
        alt="Buy Me a Coffee at ko-fi.com"
        width={217}
        height={40}
        style={{ border: 0, maxWidth: '180px', height: 'auto' }}
        unoptimized
      />
    </a>
  )
}
