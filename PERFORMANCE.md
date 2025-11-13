# ⚡ Performance Optimization Guide

Comprehensive strategies for handling **large user influxes** and **large YouTube video downloads** at scale.

---

## 🎯 Performance Challenges

### Current Bottlenecks:
1. **Worker Service** - Single instance processing all downloads
2. **Large files** - 4K videos can be 1GB+, slow to download/process
3. **Concurrent users** - Multiple downloads block each other
4. **Memory usage** - FFmpeg conversion uses significant RAM
5. **Network bandwidth** - Railway has bandwidth limits

---

## 🚀 Optimization Strategy (Progressive Implementation)

### Phase 1: Quick Wins (Implement First) ⭐
### Phase 2: Scaling Infrastructure (As traffic grows)
### Phase 3: Advanced Architecture (High traffic)

---

## 📊 Phase 1: Quick Wins (0-10K Users/Month)

### 1. **Add Request Queue System**

Problem: Concurrent downloads crash the worker
Solution: Queue system with job processing

**Install Redis + Bull Queue:**

```bash
# In worker directory
pip install redis rq
```

**Update `worker/main.py`:**

```python
from rq import Queue
from redis import Redis
import os

# Connect to Redis
redis_conn = Redis(
    host=os.getenv('REDIS_HOST', 'localhost'),
    port=int(os.getenv('REDIS_PORT', 6379)),
    password=os.getenv('REDIS_PASSWORD')
)

# Create queue
download_queue = Queue('downloads', connection=redis_conn)

def process_download_job(url, quality, format):
    """Background job for processing downloads"""
    # Your existing download logic here
    pass

@app.post("/api/download")
async def download_video(request: DownloadRequest):
    """Queue download instead of processing immediately"""
    try:
        # Add job to queue
        job = download_queue.enqueue(
            process_download_job,
            args=(request.url, request.quality, request.format),
            timeout='10m',
            result_ttl=3600  # Keep result for 1 hour
        )
        
        return {
            "success": True,
            "jobId": job.id,
            "message": "Download queued"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/download-status/{job_id}")
async def check_download_status(job_id: str):
    """Check queue job status"""
    from rq.job import Job
    
    try:
        job = Job.fetch(job_id, connection=redis_conn)
        
        return {
            "status": job.get_status(),
            "progress": job.meta.get('progress', 0),
            "result": job.result if job.is_finished else None
        }
    except Exception as e:
        return {"status": "failed", "error": str(e)}
```

**Benefits:**
- ✅ Handles 100+ concurrent requests
- ✅ Prevents worker crashes
- ✅ Better user experience (polling for status)

**Railway Setup:**
- Add Redis database in Railway
- Set `REDIS_HOST` environment variable

---

### 2. **Implement Download Streaming**

Problem: Large files consume too much memory
Solution: Stream downloads directly to user

**Update download endpoint:**

```python
from fastapi.responses import StreamingResponse
import aiohttp

@app.get("/api/stream/{video_id}")
async def stream_download(video_id: str):
    """Stream video download directly to user"""
    
    async def generate():
        async with aiohttp.ClientSession() as session:
            async with session.get(video_url) as response:
                async for chunk in response.content.iter_chunked(8192):
                    yield chunk
    
    return StreamingResponse(
        generate(),
        media_type="video/mp4",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )
```

**Benefits:**
- ✅ Reduced memory usage (from GB to MB)
- ✅ Faster time-to-first-byte
- ✅ Handle larger files

---

### 3. **Add Rate Limiting**

Problem: Users abuse the service, causing overload
Solution: Limit requests per IP/user

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/api/video-info")
@limiter.limit("10/minute")  # 10 requests per minute per IP
async def video_info(request: VideoInfoRequest):
    # Your existing code
    pass

@app.post("/api/download")
@limiter.limit("3/minute")  # 3 downloads per minute per IP
async def download_video(request: DownloadRequest):
    # Your existing code
    pass
```

**Benefits:**
- ✅ Prevents abuse
- ✅ Fair resource distribution
- ✅ Protects from DDoS

---

### 4. **Optimize yt-dlp Settings**

**Update download options for speed:**

```python
# In main.py download function
ydl_opts = {
    'format': format_string,
    'outtmpl': output_template,
    'merge_output_format': 'mp4',
    
    # Performance optimizations
    'concurrent_fragment_downloads': 4,  # Download 4 fragments at once
    'http_chunk_size': 10485760,  # 10MB chunks
    'buffer_size': 16384,  # 16KB buffer
    'throttledratelimit': None,  # No rate limit
    'retries': 3,
    'fragment_retries': 3,
    
    # Skip unnecessary processing
    'skip_download': False,
    'writeinfojson': False,
    'writedescription': False,
    'writesubtitles': False,
}
```

**Benefits:**
- ✅ 2-3x faster downloads
- ✅ Better handling of large files
- ✅ Fewer timeout errors

---

## 📈 Phase 2: Scaling Infrastructure (10K-100K Users/Month)

### 5. **Horizontal Scaling (Multiple Workers)**

**Railway Configuration:**
- Scale to 2-5 worker instances
- Use Railway's built-in load balancing

**Steps:**
1. Railway Dashboard → Your Service
2. Settings → **Replicas**
3. Set to **3 replicas**
4. Railway auto-load-balances traffic

**Cost:** ~$15-$30/month

---

### 6. **Add Caching Layer (Redis)**

**Cache video metadata to reduce yt-dlp calls:**

```python
import redis
import json

redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST'),
    port=6379,
    decode_responses=True
)

@app.post("/api/video-info")
async def video_info(request: VideoInfoRequest):
    # Check cache first
    cache_key = f"video_info:{request.url}"
    cached = redis_client.get(cache_key)
    
    if cached:
        return json.loads(cached)
    
    # Fetch from yt-dlp
    info = get_video_info(request.url)
    
    # Cache for 1 hour
    redis_client.setex(
        cache_key,
        3600,  # 1 hour TTL
        json.dumps(info)
    )
    
    return info
```

**Benefits:**
- ✅ 10x faster video info fetching
- ✅ Reduced load on YouTube servers
- ✅ Lower bandwidth usage

---

### 7. **CDN for Static Assets (Cloudflare)**

**Setup Cloudflare in front of Vercel:**
1. Add your domain to Cloudflare
2. Enable **Caching Everything**
3. Enable **Brotli compression**
4. Enable **HTTP/3**

**Update `next.config.js`:**

```javascript
module.exports = {
  images: {
    domains: ['i.ytimg.com'], // YouTube thumbnails
    loader: 'cloudinary', // Or use Cloudflare Images
  },
  compress: true,
  poweredByHeader: false,
}
```

**Benefits:**
- ✅ Faster page loads globally
- ✅ Reduced bandwidth costs
- ✅ Better DDoS protection

---

## 🏗️ Phase 3: Advanced Architecture (100K+ Users/Month)

### 8. **Separate Download Workers by Region**

Deploy multiple Railway instances in different regions:
- US West (Railway US)
- Europe (Railway EU)
- Asia (Railway Asia)

**Route users to nearest worker:**

```typescript
// app/api/download/route.ts
const getWorkerUrl = (userRegion: string) => {
  const workers = {
    'us': process.env.WORKER_US_URL,
    'eu': process.env.WORKER_EU_URL,
    'asia': process.env.WORKER_ASIA_URL,
  }
  return workers[userRegion] || workers['us']
}
```

**Benefits:**
- ✅ Lower latency globally
- ✅ Better redundancy
- ✅ Handle regional traffic spikes

---

### 9. **Use S3/R2 for File Storage**

Instead of serving files directly, upload to cloud storage:

**Install AWS SDK:**

```bash
pip install boto3
```

**Upload to S3/Cloudflare R2:**

```python
import boto3

s3_client = boto3.client('s3',
    endpoint_url=os.getenv('R2_ENDPOINT'),
    aws_access_key_id=os.getenv('R2_ACCESS_KEY'),
    aws_secret_access_key=os.getenv('R2_SECRET_KEY')
)

def upload_to_storage(file_path, filename):
    """Upload file to R2/S3"""
    s3_client.upload_file(
        file_path,
        'downloads-bucket',
        filename,
        ExtraArgs={
            'ContentType': 'video/mp4',
            'ContentDisposition': f'attachment; filename="{filename}"'
        }
    )
    
    # Generate presigned URL (expires in 1 hour)
    url = s3_client.generate_presigned_url(
        'get_object',
        Params={'Bucket': 'downloads-bucket', 'Key': filename},
        ExpiresIn=3600
    )
    
    return url
```

**Benefits:**
- ✅ Unlimited storage
- ✅ Fast global delivery
- ✅ Automatic expiration
- ✅ Reduces worker bandwidth

---

### 10. **Add Background Job Workers**

**Separate processing from serving:**

```
┌──────────┐     ┌──────────────┐     ┌──────────┐
│  Vercel  │────▶│ API Workers  │────▶│  Queue   │
│ Frontend │     │ (FastAPI)    │     │  (Redis) │
└──────────┘     └──────────────┘     └────┬─────┘
                                            │
                                            ▼
                                      ┌──────────────┐
                                      │  Processing  │
                                      │   Workers    │
                                      │  (yt-dlp +   │
                                      │   FFmpeg)    │
                                      └──────────────┘
```

**Deploy separate worker containers:**
- **API Workers**: Handle requests, queue jobs
- **Processing Workers**: Execute yt-dlp downloads
- Scale each independently

---

## 📊 Performance Monitoring

### Essential Metrics to Track:

**Railway Dashboard:**
- CPU usage (keep under 80%)
- Memory usage (watch for spikes)
- Network bandwidth
- Response times

**Add Application Monitoring:**

```python
# Install prometheus client
pip install prometheus-fastapi-instrumentator

from prometheus_fastapi_instrumentator import Instrumentator

# Add to main.py
Instrumentator().instrument(app).expose(app)
```

**Monitor these:**
- Download queue length
- Average download time
- Failed download rate
- Cache hit rate
- API response times

---

## 💰 Cost vs Performance

| User Scale | Architecture | Monthly Cost | Performance |
|------------|-------------|--------------|-------------|
| 0-10K | Single worker | $5 | Good |
| 10K-50K | 3 workers + Redis | $30 | Great |
| 50K-100K | 5 workers + Redis + Cache | $100 | Excellent |
| 100K+ | Multi-region + S3 + Queue | $300+ | Outstanding |

---

## 🎯 Implementation Priority

### Start Here (Week 1):
1. ✅ Add rate limiting
2. ✅ Optimize yt-dlp settings
3. ✅ Enable Railway auto-scaling

### Next (Week 2-3):
4. ✅ Add Redis caching
5. ✅ Implement download queue
6. ✅ Add monitoring

### Later (As Needed):
7. ✅ Multi-region deployment
8. ✅ S3/R2 storage
9. ✅ Separate job workers

---

## 🚨 Quick Scaling Checklist

When traffic spikes:
- [ ] Scale Railway replicas (2x)
- [ ] Enable aggressive rate limiting
- [ ] Add Redis caching
- [ ] Monitor logs for errors
- [ ] Enable Cloudflare "I'm Under Attack" mode

---

## 📚 Useful Resources

- **Railway Docs**: https://docs.railway.app/deploy/scaling
- **Redis Queue**: https://python-rq.org/
- **FastAPI Performance**: https://fastapi.tiangolo.com/async/
- **yt-dlp Performance**: https://github.com/yt-dlp/yt-dlp#performance

---

**Remember**: Start simple, scale as needed. Don't over-engineer early! 🚀
