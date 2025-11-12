# YouTube Downloader

A modern, high-performance YouTube downloader web application built with Next.js 15, React 19, shadcn/ui, and Tailwind CSS 4. Download YouTube videos and audio in your preferred quality with a beautiful, intuitive interface.

## ✨ Features

- 🎥 Download YouTube videos in multiple resolutions (144p to 4K+)
- 🎵 Extract audio-only files (MP3 format)
- 🎨 Beautiful, modern UI built with shadcn/ui and Tailwind CSS 4
- ⚡ Fast and efficient processing with external worker service
- 📱 Fully responsive design
- 🚀 Deployed on Vercel with Cloudflare domain support
- 🔒 Secure and privacy-focused

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────────┐
│   Frontend      │      │   Vercel API     │      │  Worker Service     │
│   (Next.js 15)  │ ───► │   (API Routes)   │ ───► │  (Python + yt-dlp)  │
│   React 19      │ ◄─── │                  │ ◄─── │  Railway/Fly.io     │
└─────────────────┘      └──────────────────┘      └─────────────────────┘
```

### Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- shadcn/ui components
- Tailwind CSS v4
- react-hot-toast for notifications
- Zod for validation

**Backend Worker:**
- Python 3.11
- FastAPI
- yt-dlp for YouTube processing
- FFmpeg for audio conversion

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+ (for worker service)
- Docker (optional, for containerized deployment)

### Frontend Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**

Create a `.env.local` file in the root directory:

```env
WORKER_SERVICE_URL=http://localhost:8000
```

3. **Run the development server:**

```bash
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000)

### Worker Service Setup

#### Option 1: Local Development

1. **Navigate to the worker directory:**

```bash
cd worker
```

2. **Install Python dependencies:**

```bash
pip install -r requirements.txt
```

3. **Install FFmpeg:**

- **Windows:** Download from [ffmpeg.org](https://ffmpeg.org/download.html)
- **Mac:** `brew install ffmpeg`
- **Linux:** `sudo apt-get install ffmpeg`

4. **Run the worker service:**

```bash
python main.py
```

The worker will be available at [http://localhost:8000](http://localhost:8000)

#### Option 2: Deploy to Railway

1. **Install Railway CLI:**

```bash
npm install -g @railway/cli
```

2. **Login to Railway:**

```bash
railway login
```

3. **Deploy from worker directory:**

```bash
cd worker
railway init
railway up
```

4. **Get your Railway URL and update your `.env.local`:**

```env
WORKER_SERVICE_URL=https://your-app.railway.app
```

#### Option 3: Deploy to Fly.io

1. **Install Fly CLI:**

Follow instructions at [fly.io/docs/hands-on/install-flyctl/](https://fly.io/docs/hands-on/install-flyctl/)

2. **Deploy:**

```bash
cd worker
fly launch
```

3. **Update your `.env.local` with the Fly.io URL**

## 📦 Deployment

### Deploy Frontend to Vercel

1. **Install Vercel CLI:**

```bash
npm install -g vercel
```

2. **Deploy:**

```bash
vercel
```

3. **Set environment variable in Vercel:**

Go to your Vercel project settings → Environment Variables → Add:

```
WORKER_SERVICE_URL=https://your-worker-url.com
```

4. **Connect Cloudflare Domain:**

- In Vercel, go to Settings → Domains
- Add your Cloudflare domain
- In Cloudflare DNS, add the CNAME record provided by Vercel

### Production Checklist

- [ ] Deploy worker service to Railway/Fly.io
- [ ] Update `WORKER_SERVICE_URL` in Vercel environment variables
- [ ] Configure CORS in worker service to only allow your Vercel domain
- [ ] Set up automatic cleanup for old files (optional)
- [ ] Configure Cloudflare domain
- [ ] Enable Vercel Analytics (optional)
- [ ] Set up monitoring and error tracking

## 🎯 Usage

1. **Paste YouTube URL:** Copy any YouTube video URL and paste it into the input field
2. **Select Format:** Choose between video or audio-only download
3. **Fetch Info:** Click "Fetch Info" to load video details and available quality options
4. **Select Quality:** Choose your preferred video resolution or audio quality
5. **Download:** Click the download button to start downloading to your device

## 🛠️ Development

### Project Structure

```
ytDownloadApp/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── download/      # Download endpoint
│   │   └── video-info/    # Video info endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── youtube-downloader.tsx
├── lib/                   # Utility functions
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Helper functions
├── worker/               # Python worker service
│   ├── main.py          # FastAPI application
│   ├── requirements.txt # Python dependencies
│   ├── Dockerfile       # Docker configuration
│   └── railway.json     # Railway configuration
└── public/              # Static assets
```

### Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔒 Security & Privacy

- All video processing happens server-side
- Downloaded files are automatically cleaned up after 1 hour
- No user data is stored or tracked
- CORS configured for security

## ⚠️ Legal Notice

This tool is for personal use only. Please respect YouTube's Terms of Service and copyright laws. Only download content you have the right to download.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) for YouTube downloading
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Next.js](https://nextjs.org/) for the React framework
- [Vercel](https://vercel.com/) for hosting
- [Railway](https://railway.app/) / [Fly.io](https://fly.io/) for worker hosting

## 📧 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js 15, React 19, shadcn/ui, and Tailwind CSS 4
