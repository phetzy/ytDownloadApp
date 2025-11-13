# 🚀 Deployment Guide - Monorepo to Vercel + Railway

This guide will help you deploy your YouTube Downloader app from a single repository to two platforms:
- **Vercel** - Frontend (Next.js)
- **Railway** - Worker Service (Python/FastAPI)

---

## 📋 Prerequisites

- [x] GitHub account
- [x] Vercel account ([vercel.com](https://vercel.com))
- [x] Railway account ([railway.app](https://railway.app))
- [x] Your code pushed to GitHub

---

## 🎯 Deployment Strategy

### Monorepo Structure
```
ytDownloadApp/
├── app/              # Next.js app → Deploys to Vercel
├── components/       # React components → Deploys to Vercel
├── lib/              # Utilities → Deploys to Vercel
├── public/           # Static assets → Deploys to Vercel
├── worker/           # Python FastAPI worker → Deploys to Railway
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
├── vercel.json       # Vercel config (ignores worker/)
└── railway.json      # Railway config (uses worker/)
```

**Key Point**: Both platforms deploy from the same repo but use different files!

---

## 🔷 Part 1: Deploy Worker to Railway

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `ytDownloadApp` repository
5. Railway will auto-detect the Dockerfile

### Step 3: Configure Railway

1. **Root Directory**: Set to `worker/`
   - Click on your service
   - Go to **Settings** → **Root Directory**
   - Enter: `worker`

2. **Environment Variables**: None needed for now

3. **Public Domain**:
   - Go to **Settings** → **Networking**
   - Click **"Generate Domain"**
   - Copy the URL (e.g., `https://ytdownloader-worker.railway.app`)
   - **SAVE THIS URL** - you'll need it for Vercel!

### Step 4: Verify Deployment

- Railway will automatically build and deploy
- Check **Deployments** tab for progress
- Once deployed, visit: `https://your-worker.railway.app/`
- You should see: `{"status": "YouTube Downloader Worker Service", "version": "1.0.0"}`

✅ **Worker is live!**

---

## 🔶 Part 2: Deploy Frontend to Vercel

### Step 1: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. **Import Git Repository**
4. Select your `ytDownloadApp` repository
5. Click **"Import"**

### Step 2: Configure Vercel

Vercel will auto-detect Next.js. Configure:

**Framework Preset**: Next.js (auto-detected)

**Root Directory**: Leave empty (defaults to root)

**Build Command**: `npm run build` (auto-detected)

**Output Directory**: `.next` (auto-detected)

**Environment Variables** - Add these:
- **Name**: `WORKER_SERVICE_URL`
- **Value**: `https://your-worker.railway.app` (from Railway step 3)
- Click **"Add"**

### Step 3: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Once deployed, you'll get a URL: `https://your-app.vercel.app`

### Step 4: Verify Frontend

1. Visit your Vercel URL
2. Try pasting a YouTube URL
3. Click **"Fetch Info"**
4. If it works → ✅ **Success!**

---

## 🔗 Part 3: Connect Custom Domain (Optional)

### Option A: Cloudflare Domain → Vercel

1. **In Vercel**:
   - Go to your project → **Settings** → **Domains**
   - Add your domain (e.g., `ytdownloader.com`)
   - Copy the provided DNS records

2. **In Cloudflare**:
   - Go to **DNS** → **Records**
   - Add the DNS records from Vercel
   - Wait 5-10 minutes for propagation

3. **SSL**: Cloudflare + Vercel both provide SSL automatically

### Option B: Use Vercel's Free Domain

- Your app is live at: `https://your-app.vercel.app`
- No configuration needed!

---

## 🔄 Continuous Deployment (Auto-Deploy)

### Automatic Deployments Enabled by Default

Every time you push to GitHub:
- **Railway** automatically redeploys the worker
- **Vercel** automatically redeploys the frontend

### Manual Deployment

**Railway:**
```bash
git push origin main
# Railway auto-deploys from GitHub
```

**Vercel:**
```bash
git push origin main
# Vercel auto-deploys from GitHub
```

Or use the Railway/Vercel dashboard to trigger manual deployments.

---

## 🔧 Environment Variables Management

### Development (.env.local)
```bash
WORKER_SERVICE_URL=http://127.0.0.1:8000
```

### Production (Vercel Dashboard)
```bash
WORKER_SERVICE_URL=https://your-worker.railway.app
```

**To update**:
1. Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Edit `WORKER_SERVICE_URL`
3. Redeploy (Vercel → **Deployments** → **Redeploy**)

---

## 📊 Monitoring & Logs

### Railway Logs
1. Railway Dashboard → Your Service
2. Click **"Logs"** tab
3. See real-time worker logs

### Vercel Logs
1. Vercel Dashboard → Your Project
2. Click **"Logs"** tab
3. See API route logs and errors

---

## ⚡ Performance Optimization

### Railway (Worker)

**Increase Resources** (if needed):
- Railway Dashboard → Settings → **Resources**
- Upgrade plan for more CPU/RAM

**Enable Auto-Scale**:
- Settings → **Auto-Scaling**
- Set min/max instances

### Vercel (Frontend)

**Enable Edge Functions** (optional):
- Faster API routes globally
- Settings → **Functions** → Enable Edge Runtime

**Analytics**:
- Settings → **Analytics** → Enable
- Monitor performance

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch video info"

**Solution**: Check worker URL
1. Verify `WORKER_SERVICE_URL` in Vercel env variables
2. Ensure Railway worker is running
3. Check Railway logs for errors

### Issue: Worker returns 500 errors

**Solution**: Check Railway logs
```bash
# Common issues:
- FFmpeg not installed (should be in Dockerfile)
- yt-dlp outdated (update in requirements.txt)
- Memory limit exceeded (upgrade Railway plan)
```

### Issue: CORS errors

**Solution**: Worker already has CORS configured
- Check `main.py` has `CORSMiddleware`
- Verify origin allows your Vercel domain

---

## 💰 Cost Estimate

### Free Tier Limits

**Railway**:
- $5/month free credit
- ~500 hours/month free
- **Cost**: $0-$5/month for small sites

**Vercel**:
- 100GB bandwidth/month free
- Unlimited deployments
- **Cost**: $0/month for small-medium sites

**Total**: $0-$5/month

### Scaling Costs

**10K users/month**: $5-$10/month
**100K users/month**: $20-$50/month
**1M users/month**: $100-$300/month

---

## ✅ Deployment Checklist

**Pre-Deployment**:
- [ ] Push code to GitHub
- [ ] Test locally (frontend + worker both running)
- [ ] Update domain in `app/layout.tsx` metadata

**Railway**:
- [ ] Deploy worker to Railway
- [ ] Set root directory to `worker/`
- [ ] Generate public domain
- [ ] Verify worker is running

**Vercel**:
- [ ] Deploy frontend to Vercel
- [ ] Add `WORKER_SERVICE_URL` environment variable
- [ ] Verify deployment works
- [ ] (Optional) Add custom domain

**Post-Deployment**:
- [ ] Test end-to-end download flow
- [ ] Monitor logs for errors
- [ ] Set up Google Analytics
- [ ] Submit sitemap to Google Search Console

---

## 🔐 Security Best Practices

1. **Never commit** `.env.local` or secrets to Git
2. **Use environment variables** for sensitive config
3. **Enable Railway's private networking** (optional)
4. **Add rate limiting** to prevent abuse (optional)
5. **Monitor costs** to avoid surprise bills

---

## 📚 Useful Commands

```bash
# Check Railway deployment status
railway status

# View Railway logs
railway logs

# Redeploy Vercel
vercel --prod

# Check Vercel deployment
vercel ls
```

---

## 🎉 You're Live!

Once deployed:
- **Frontend**: `https://your-app.vercel.app`
- **Worker**: `https://your-worker.railway.app`
- **Custom Domain**: `https://your-domain.com` (if configured)

**Share your app** and start getting users! 🚀

---

## 📞 Support Resources

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com

---

## 🔄 Updates & Maintenance

### Update yt-dlp (Worker)
```bash
# Already automated in Dockerfile!
# Just redeploy Railway and it will auto-update
```

### Update Frontend
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys
```

### Update Worker
```bash
git add .
git commit -m "Update worker"
git push origin main
# Railway auto-deploys
```

---

Need help? Check the logs first, then consult the troubleshooting section!
