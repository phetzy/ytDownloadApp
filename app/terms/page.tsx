import { ThemeToggle } from '@/components/theme-toggle'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service - YouTube Downloader',
  description: 'Terms of service for YouTube Downloader',
}

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-primary hover:underline">← Back to Home</Link>
          <ThemeToggle />
        </div>
        
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using YouTube Downloader, you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Service Description</h2>
            <p className="text-muted-foreground">
              YouTube Downloader provides a web-based tool for downloading videos and extracting audio from 
              YouTube. The service is provided "as is" and we reserve the right to modify or discontinue 
              the service at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
            <p className="text-muted-foreground mb-4">
              When using our service, you agree to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Comply with all applicable laws and regulations</li>
              <li>Respect copyright and intellectual property rights</li>
              <li>Only download content you have permission to use</li>
              <li>Not use the service for commercial purposes without authorization</li>
              <li>Not abuse or overload our servers</li>
              <li>Not attempt to circumvent any security measures</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Copyright and Intellectual Property</h2>
            <p className="text-muted-foreground">
              You are solely responsible for ensuring you have the right to download any content. We do not 
              condone copyright infringement. YouTube's terms of service prohibit downloading content without 
              permission unless you're a YouTube Premium subscriber downloading for offline viewing.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Prohibited Uses</h2>
            <p className="text-muted-foreground mb-4">
              You may not use our service to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Download copyrighted content without permission</li>
              <li>Distribute downloaded content commercially</li>
              <li>Violate YouTube's Terms of Service</li>
              <li>Engage in any illegal activities</li>
              <li>Scrape or automate downloads in bulk</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Disclaimer of Warranties</h2>
            <p className="text-muted-foreground">
              Our service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted 
              access, accuracy of downloads, or that the service will meet your requirements. Use at your own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground">
              We shall not be liable for any damages arising from the use or inability to use our service, 
              including but not limited to direct, indirect, incidental, or consequential damages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Links</h2>
            <p className="text-muted-foreground">
              Our service may contain links to third-party websites. We are not responsible for the content 
              or practices of these external sites.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Continued use of the service after 
              changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Termination</h2>
            <p className="text-muted-foreground">
              We reserve the right to terminate or suspend access to our service immediately, without prior 
              notice, for any violation of these Terms of Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these Terms of Service, please contact us through our website.
            </p>
          </section>
        </article>
      </div>
      
      <Footer />
    </main>
  )
}
