# Worker Optimization & Cron Jobs - Complete Guide

## ✅ What Was Optimized

### 1. **Automated Scheduled Tasks** (No external cron needed!)

#### File Cleanup - Every 30 minutes
- Automatically removes files older than 1 hour
- Prevents disk space issues
- Built-in using APScheduler

#### yt-dlp Updates - Daily at 3:00 AM UTC
- Keeps yt-dlp up-to-date with YouTube changes
- Runs automatically without manual intervention
- Logs all updates

### 2. **Production Docker Optimizations**

- ✅ Non-root user for security
- ✅ Multi-layer caching for faster builds
- ✅ Health check endpoint (`/health`)
- ✅ Optimized uvicorn settings
- ✅ Minimal dependencies

### 3. **Monitoring & Health Checks**

- `/health` endpoint with detailed metrics:
  - Disk space usage
  - Memory usage
  - Uptime tracking
  - File count monitoring
  - Scheduler status

### 4. **Railway Integration**

- Health check configuration in `railway.json`
- Auto-restart on failure (max 10 retries)
- Automatic deployment on push

## 🚀 No Cron Setup Needed!

**Traditional approach (Manual cron):**
```bash
# Would need to configure Railway cron separately
0 */30 * * * curl -X DELETE https://worker.railway.app/api/cleanup
0 3 * * * curl -X POST https://worker.railway.app/api/update-ytdlp
```

**Our approach (Built-in scheduler):**
```python
# Automatically runs inside the worker - no external config!
scheduler.add_job(scheduled_cleanup, 'interval', minutes=30)
scheduler.add_job(update_ytdlp, 'cron', hour=3, minute=0)
```

✅ **Runs on startup automatically**
✅ **No Railway cron configuration needed**
✅ **More reliable** (survives restarts)
✅ **Visible in logs**

## 📋 Changes Made

### Files Modified:

1. **`worker/main.py`**
   - Added APScheduler for automated tasks
   - Added health check endpoint
   - Added system monitoring (psutil)
   - Added startup/shutdown event handlers
   - Automated cleanup every 30 minutes
   - Automated yt-dlp updates daily

2. **`worker/requirements.txt`**
   - Added `apscheduler==3.10.4`
   - Added `psutil==5.9.8`

3. **`worker/Dockerfile`**
   - Added non-root user for security
   - Added curl for health checks
   - Optimized layer caching
   - Added HEALTHCHECK directive
   - Optimized uvicorn settings

4. **`worker/railway.json`**
   - Added health check path
   - Added health check timeout
   - Configured restart policy

5. **`worker/README.md`** (New)
   - Complete deployment guide
   - API documentation
   - Troubleshooting tips

## 🔄 How It Works

### On Worker Startup:

```
1. Worker starts up
2. APScheduler initializes
3. Cleanup job scheduled (every 30 min)
4. yt-dlp update job scheduled (daily 3 AM)
5. Initial cleanup runs
6. FastAPI server starts
7. Railway health checks begin
```

### During Operation:

```
Every 30 minutes:
  ↳ Cleanup old files (>1 hour)

Every day at 3 AM UTC:
  ↳ Update yt-dlp to latest version

Every 30 seconds:
  ↳ Railway checks /health endpoint

On failure:
  ↳ Railway auto-restarts worker
```

## 📊 Monitoring

### Check Worker Status:
```bash
curl https://your-worker-url.railway.app/health
```

### View Logs in Railway:
- Scheduled task executions
- Cleanup statistics
- Update status
- Health check results

### Example Log Output:
```
[2025-11-25 19:00:00] Starting YouTube Downloader Worker...
✅ Scheduled cleanup job: Every 30 minutes
✅ Scheduled yt-dlp update: Daily at 3:00 AM UTC
[2025-11-25 19:00:00] Scheduled cleanup: Removed 5 files
[2025-11-25 19:00:00] Worker startup complete!
[2025-11-25 19:30:00] Scheduled cleanup: Removed 3 files
[2025-11-26 03:00:00] ✅ yt-dlp updated successfully!
```

## 🎯 Manual Triggers (Optional)

If you ever need to manually trigger tasks:

### Manual Cleanup:
```bash
curl -X DELETE https://your-worker-url.railway.app/api/cleanup
```

### Manual yt-dlp Update:
```bash
curl -X POST https://your-worker-url.railway.app/api/update-ytdlp
```

## 🚀 Deployment

### Push to Railway:
```bash
git add worker/
git commit -m "Optimize worker with automated tasks"
git push
```

Railway will:
1. Detect changes
2. Build new Docker image
3. Deploy worker
4. Run health checks
5. Scheduler starts automatically

## 🎉 Benefits

| Feature | Before | After |
|---------|--------|-------|
| File cleanup | Manual or external cron | ✅ Automated (every 30 min) |
| yt-dlp updates | Manual | ✅ Automated (daily) |
| Health monitoring | None | ✅ Full metrics at `/health` |
| Security | Root user | ✅ Non-root user |
| Logs | Basic | ✅ Detailed task logs |
| Restarts | Manual | ✅ Auto-restart on failure |
| Cron setup | External config needed | ✅ Built-in, no config |

## 💡 Best Practices

1. **Monitor Railway logs** regularly for task execution
2. **Check `/health` endpoint** to ensure scheduler is running
3. **Adjust schedules** if needed (edit `main.py`)
4. **Keep an eye on disk space** via health endpoint
5. **Let it run** - everything is automated!

## 🔧 Customization

### Change Cleanup Frequency:
```python
# In main.py, line ~425
scheduler.add_job(
    scheduled_cleanup,
    'interval',
    minutes=15,  # Change from 30 to 15 minutes
    ...
)
```

### Change Update Time:
```python
# In main.py, line ~433
scheduler.add_job(
    update_ytdlp,
    'cron',
    hour=6,    # Change from 3 AM to 6 AM
    minute=30, # Change minute if desired
    ...
)
```

### Change File Age Before Cleanup:
```python
# In main.py, line ~348
max_age = 1800  # Change from 3600 (1 hour) to 1800 (30 minutes)
```

## ⚠️ Important Notes

- **Railway automatically restarts** the worker, so scheduler always starts
- **No external cron service** needed (everything is internal)
- **Timezone is UTC** for scheduled tasks
- **Logs are visible** in Railway dashboard
- **Health checks** ensure worker stays healthy

## 🎊 Summary

Your Python worker now has:

✅ **Automated file cleanup** - No more manual intervention
✅ **Automated yt-dlp updates** - Always compatible with YouTube
✅ **Health monitoring** - Know your worker's status
✅ **Production-ready** - Security, monitoring, auto-restart
✅ **Zero cron configuration** - Everything built-in!

Just deploy and let it run! Railway handles the rest. 🚀
