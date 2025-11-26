# YouTube Downloader Worker - Railway Deployment

## 🚀 Features

- **FastAPI** service for video/audio downloads
- **Automated scheduled tasks** (no external cron needed!)
  - Cleanup old files every 30 minutes
  - Update yt-dlp daily at 3 AM UTC
- **Health monitoring** with disk space and memory checks
- **Production-ready** with non-root user, health checks, and optimized Docker build

## 📋 What's Automated

### 1. **File Cleanup** (Every 30 minutes)
- Removes downloaded files older than 1 hour
- Prevents disk space issues
- Runs automatically via APScheduler

### 2. **yt-dlp Updates** (Daily at 3:00 AM UTC)
- Keeps yt-dlp up-to-date automatically
- Ensures compatibility with YouTube changes
- No manual intervention needed

### 3. **Health Monitoring**
- `/health` endpoint for Railway health checks
- Monitors disk space, memory, and file counts
- Automatic restarts on failure

## 🔧 Railway Setup

### Initial Deployment

1. **Create a new Railway service:**
   - Connect your GitHub repository
   - Railway will auto-detect the Dockerfile
   - Set root directory to `/worker` (if needed)

2. **Railway will automatically:**
   - Build from `Dockerfile`
   - Use the `railway.json` configuration
   - Enable health checks at `/health`
   - Restart on failures (max 10 retries)

### Environment Variables (Optional)

```bash
PORT=8000  # Railway sets this automatically
```

### Health Check Configuration

Railway will check `/health` every 30 seconds:
- Returns server status, uptime, disk space, memory usage
- Automatic restart if health check fails
- Configured in `railway.json`

## 📊 Monitoring Endpoints

### 1. Health Check
```bash
GET /health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-25T19:00:00",
  "uptime_seconds": 3600,
  "disk_free_gb": 25.5,
  "disk_usage_percent": 15.2,
  "memory_usage_percent": 45.3,
  "downloads_dir_accessible": true,
  "pending_files": 3,
  "scheduler_running": true
}
```

### 2. Service Status
```bash
GET /
```

Response:
```json
{
  "status": "YouTube Downloader Worker Service",
  "version": "1.0.0",
  "uptime_seconds": 3600
}
```

### 3. Manual Cleanup (Optional)
```bash
DELETE /api/cleanup
```

Manually trigger file cleanup (already runs automatically).

### 4. Manual Update (Optional)
```bash
POST /api/update-ytdlp
```

Manually trigger yt-dlp update (already runs daily automatically).

## 🔄 Scheduled Tasks

### Cleanup Schedule
- **Frequency:** Every 30 minutes
- **Action:** Delete files older than 1 hour
- **Implementation:** APScheduler interval job
- **Logs:** Printed to stdout (visible in Railway logs)

### yt-dlp Update Schedule
- **Frequency:** Daily at 3:00 AM UTC
- **Action:** Update yt-dlp to latest version
- **Implementation:** APScheduler cron job
- **Logs:** Printed to stdout (visible in Railway logs)

## 📝 Logs

View logs in Railway dashboard:
```
[2025-11-25 19:00:00] Starting YouTube Downloader Worker...
✅ Scheduled cleanup job: Every 30 minutes
✅ Scheduled yt-dlp update: Daily at 3:00 AM UTC
[2025-11-25 19:00:00] Scheduled cleanup: Removed 5 files
[2025-11-25 19:00:00] Worker startup complete!
```

## 🔐 Security Features

- ✅ Runs as non-root user (`worker`)
- ✅ Minimal system dependencies
- ✅ Health checks enabled
- ✅ Automatic restarts on failure
- ✅ CORS configured (update for production)

## 🎯 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Service status |
| `/health` | GET | Health check (used by Railway) |
| `/api/video-info` | POST | Get video information |
| `/api/download` | POST | Download video/audio |
| `/download/{filename}` | GET | Serve downloaded file |
| `/api/cleanup` | DELETE | Manual cleanup trigger |
| `/api/update-ytdlp` | POST | Manual yt-dlp update |

## 🚨 Troubleshooting

### Scheduler not running?
Check logs for:
```
✅ Scheduled cleanup job: Every 30 minutes
✅ Scheduled yt-dlp update: Daily at 3:00 AM UTC
```

### Disk space issues?
- Check `/health` endpoint for `disk_free_gb`
- Cleanup runs every 30 minutes automatically
- Trigger manual cleanup: `DELETE /api/cleanup`

### yt-dlp errors?
- Daily updates run at 3 AM UTC automatically
- Trigger manual update: `POST /api/update-ytdlp`
- Check Railway logs for update status

### Worker crashes?
- Railway auto-restarts (max 10 retries)
- Check health check endpoint
- Review Railway logs for errors

## 📦 Dependencies

- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `yt-dlp` - YouTube downloader (auto-updated daily)
- `apscheduler` - Task scheduler (for cron jobs)
- `psutil` - System monitoring
- `ffmpeg` - Media processing

## 🔄 Update Worker

Railway auto-deploys on git push:

```bash
git add worker/
git commit -m "Update worker"
git push
```

Railway will:
1. Rebuild Docker image
2. Run health checks
3. Deploy new version
4. Scheduler starts automatically

## 💡 Tips

1. **Monitor logs** in Railway dashboard to see scheduled tasks
2. **Check `/health`** endpoint regularly
3. **Scheduled tasks** run automatically - no cron setup needed!
4. **yt-dlp** stays updated automatically
5. **Old files** clean up automatically

## 🎉 That's It!

Your worker now has:
- ✅ Automatic file cleanup (every 30 min)
- ✅ Automatic yt-dlp updates (daily)
- ✅ Health monitoring
- ✅ Production-ready setup
- ✅ No manual cron configuration needed!

Railway handles everything else automatically. Just deploy and forget! 🚀
