import { ThemeToggle } from '@/components/theme-toggle'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy - YouTube Downloader',
  description: 'Privacy policy for YouTube Downloader service',
}

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-primary hover:underline">← Back to Home</Link>
          <ThemeToggle />
        </div>
        
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-muted-foreground">
              Welcome to YouTube Downloader. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we handle your information when you use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              When you use our service, we may collect:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>YouTube video URLs that you submit for downloading</li>
              <li>Technical information such as IP address, browser type, and device information</li>
              <li>Usage data including pages visited and features used</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide and maintain our video downloading service</li>
              <li>Improve and optimize our website performance</li>
              <li>Analyze usage patterns and trends</li>
              <li>Prevent abuse and ensure service security</li>
              <li>Display relevant advertisements through Google AdSense</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground mb-4">
              We use third-party services that may collect information:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Google AdSense:</strong> For displaying advertisements</li>
              <li><strong>Vercel Analytics:</strong> For website analytics and performance monitoring</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              These services have their own privacy policies and we encourage you to review them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
            <p className="text-muted-foreground">
              We use cookies and similar tracking technologies to enhance your experience. You can control cookies 
              through your browser settings, though this may affect some functionality of our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your information. However, no method of 
              transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of certain data collection practices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our service is not intended for users under 13 years of age. We do not knowingly collect 
              personal information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. We will notify you of any changes by 
              posting the new policy on this page with an updated date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this privacy policy, please contact us through our website.
            </p>
          </section>
        </article>
      </div>
      
      <Footer />
    </main>
  )
}
