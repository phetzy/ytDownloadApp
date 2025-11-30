from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yt_dlp
import os
import json
import time
import subprocess
import sys
import psutil
from pathlib import Path
from typing import Optional, List, Dict, Any
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime

app = FastAPI(title="YouTube Downloader Worker")

# Initialize scheduler
scheduler = BackgroundScheduler()
scheduler.start()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Download directory
DOWNLOAD_DIR = Path("downloads")
DOWNLOAD_DIR.mkdir(exist_ok=True)

class VideoInfoRequest(BaseModel):
    url: str

class DownloadRequest(BaseModel):
    url: str
    quality: str
    format: str  # 'video' or 'audio'

class VideoFormat(BaseModel):
    formatId: str
    ext: str
    resolution: str
    filesize: Optional[int] = None
    vcodec: Optional[str] = None
    acodec: Optional[str] = None

class VideoInfoResponse(BaseModel):
    title: str
    duration: int
    thumbnail: str
    formats: List[VideoFormat]

class DownloadResponse(BaseModel):
    success: bool
    downloadUrl: Optional[str] = None
    filename: Optional[str] = None
    error: Optional[str] = None

def get_video_info(url: str) -> Dict[str, Any]:
    """Fetch video information using yt-dlp"""
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': False,
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            info = ydl.extract_info(url, download=False)
            return info
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to fetch video info: {str(e)}")

def parse_formats(info: Dict[str, Any]) -> List[VideoFormat]:
    """Parse available formats from video info"""
    formats = []
    seen_combinations = set()
    
    # Get all formats
    all_formats = info.get('formats', [])
    
    # Try to get formats with video
    for f in all_formats:
        vcodec = f.get('vcodec', 'none')
        ext = f.get('ext', 'mp4')
        
        # Skip audio-only formats for video selection
        if vcodec == 'none' or not vcodec:
            continue
        
        # Only allow MP4 formats, skip WebM and other formats
        if ext.lower() != 'mp4':
            continue
        
        height = f.get('height', 0)
        width = f.get('width', 0)
        format_id = f.get('format_id', '')
        
        # Create resolution string
        if height and width:
            resolution = f"{width}x{height}"
        elif height:
            resolution = f"{height}p"
        else:
            resolution = f.get('format_note', f.get('quality', 'unknown'))
        
        # Create unique key to avoid duplicates
        unique_key = f"{resolution}_{f.get('ext', 'mp4')}"
        
        # Skip duplicates and very low quality
        if unique_key in seen_combinations or (height > 0 and height < 144):
            continue
        
        seen_combinations.add(unique_key)
        
        formats.append(VideoFormat(
            formatId=format_id,
            ext=f.get('ext', 'mp4'),
            resolution=resolution,
            filesize=f.get('filesize') or f.get('filesize_approx'),
            vcodec=vcodec,
            acodec=f.get('acodec')
        ))
    
    # If no formats found, add some common quality options
    if not formats:
        # Fallback to preset qualities
        common_formats = [
            {'id': 'bestvideo', 'resolution': 'Best Quality', 'ext': 'mp4'},
            {'id': '137', 'resolution': '1080p', 'ext': 'mp4'},
            {'id': '136', 'resolution': '720p', 'ext': 'mp4'},
            {'id': '135', 'resolution': '480p', 'ext': 'mp4'},
            {'id': '134', 'resolution': '360p', 'ext': 'mp4'},
        ]
        for fmt in common_formats:
            formats.append(VideoFormat(
                formatId=fmt['id'],
                ext=fmt['ext'],
                resolution=fmt['resolution'],
                filesize=None,
                vcodec='unknown',
                acodec='unknown'
            ))
    
    # Sort by resolution (descending) - extract number from resolution string
    def get_resolution_number(res_str: str) -> int:
        try:
            # Try to extract number from strings like "1920x1080", "1080p", etc.
            import re
            numbers = re.findall(r'\d+', res_str)
            if numbers:
                # For "1920x1080", use height (second number)
                if 'x' in res_str and len(numbers) >= 2:
                    return int(numbers[1])
                # For "1080p" or single number
                return int(numbers[0])
        except:
            pass
        return 0
    
    formats.sort(key=lambda x: get_resolution_number(x.resolution), reverse=True)
    
    return formats[:15]  # Return top 15 formats

@app.get("/")
async def root():
    return {
        "status": "YouTube Downloader Worker Service",
        "version": "1.0.0",
        "uptime_seconds": time.time() - start_time
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    try:
        # Check disk space
        disk = psutil.disk_usage('/')
        memory = psutil.virtual_memory()
        
        # Check if downloads directory is accessible
        downloads_accessible = DOWNLOAD_DIR.exists()
        
        # Count files in downloads directory
        file_count = len(list(DOWNLOAD_DIR.iterdir())) if downloads_accessible else 0
        
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "uptime_seconds": time.time() - start_time,
            "disk_free_gb": round(disk.free / (1024**3), 2),
            "disk_usage_percent": disk.percent,
            "memory_usage_percent": memory.percent,
            "downloads_dir_accessible": downloads_accessible,
            "pending_files": file_count,
            "scheduler_running": scheduler.running
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Health check failed: {str(e)}")

@app.post("/api/video-info", response_model=VideoInfoResponse)
async def video_info(request: VideoInfoRequest):
    """Get video information"""
    try:
        info = get_video_info(request.url)
        
        formats = parse_formats(info)
        
        return VideoInfoResponse(
            title=info.get('title', 'Unknown'),
            duration=info.get('duration', 0),
            thumbnail=info.get('thumbnail', ''),
            formats=formats
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

@app.post("/api/download", response_model=DownloadResponse)
async def download_video(request: DownloadRequest):
    """Download video or audio"""
    try:
        # Sanitize filename
        info = get_video_info(request.url)
        title = info.get('title', 'video').replace('/', '_').replace('\\', '_')
        
        # Configure download options
        if request.format == 'audio':
            # Audio only - use quality parameter for bitrate
            audio_quality = request.quality if request.quality else '192'
            # Don't include .mp3 in template - postprocessor will add it
            output_template = str(DOWNLOAD_DIR / f"{title}.%(ext)s")
            ydl_opts = {
                'format': 'bestaudio/best',
                'outtmpl': output_template,
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': audio_quality,
                }],
                'keepvideo': False,
                'prefer_ffmpeg': True,
                'quiet': False,
                'no_warnings': False,
            }
            filename = f"{title}.mp3"
        else:
            # Video with audio - ensure MP4 output
            output_template = str(DOWNLOAD_DIR / f"{title}.%(ext)s")
            
            # If specific quality is requested
            if request.quality:
                format_string = f"{request.quality}+bestaudio/best"
            else:
                format_string = "bestvideo+bestaudio/best"
            
            ydl_opts = {
                'format': format_string,
                'outtmpl': output_template,
                'merge_output_format': 'mp4',
                'postprocessors': [{
                    'key': 'FFmpegVideoConvertor',
                    'preferedformat': 'mp4',
                }],
                'postprocessor_args': [
                    '-c:v', 'copy',  # Copy video stream as-is
                    '-c:a', 'aac',   # Re-encode audio to AAC
                    '-b:a', '192k',  # Audio bitrate
                ],
                'prefer_ffmpeg': True,
                'quiet': False,
                'no_warnings': False,
            }
            filename = f"{title}.mp4"
        
        # Download the video/audio
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([request.url])
        
        # Check if file exists
        file_path = DOWNLOAD_DIR / filename
        if not file_path.exists():
            # Try to find the file with mp4 or mp3 extension only
            if request.format == 'audio':
                # For audio, only look for mp3
                alt_path = DOWNLOAD_DIR / f"{title}.mp3"
                if alt_path.exists():
                    file_path = alt_path
                    filename = alt_path.name
            else:
                # For video, only look for mp4
                alt_path = DOWNLOAD_DIR / f"{title}.mp4"
                if alt_path.exists():
                    file_path = alt_path
                    filename = alt_path.name
        
        if not file_path.exists():
            raise HTTPException(status_code=500, detail="Download completed but file not found")
        
        # Return download URL (in production, this would be a proper URL)
        download_url = f"/download/{filename}"
        
        return DownloadResponse(
            success=True,
            downloadUrl=download_url,
            filename=filename
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")

@app.get("/download/{filename}")
async def serve_file(filename: str, background_tasks: BackgroundTasks):
    """Serve downloaded file and clean up after"""
    file_path = DOWNLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    # Schedule file deletion after it's been sent
    def cleanup_file():
        import time
        time.sleep(5)  # Wait 5 seconds to ensure download completes
        if file_path.exists():
            file_path.unlink()
    
    background_tasks.add_task(cleanup_file)
    
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type='application/octet-stream'
    )

# Scheduled Tasks
def scheduled_cleanup():
    """Scheduled cleanup of old files - runs every 30 minutes"""
    try:
        removed = 0
        current_time = time.time()
        max_age = 3600  # 1 hour
        
        if not DOWNLOAD_DIR.exists():
            print(f"[{datetime.now()}] Downloads directory not found")
            return
        
        for file_path in DOWNLOAD_DIR.iterdir():
            if file_path.is_file():
                file_age = current_time - file_path.stat().st_mtime
                if file_age > max_age:
                    try:
                        file_path.unlink()
                        removed += 1
                    except Exception as e:
                        print(f"Error removing {file_path.name}: {e}")
        
        print(f"[{datetime.now()}] Scheduled cleanup: Removed {removed} files")
    except Exception as e:
        print(f"[{datetime.now()}] Cleanup error: {e}")

def update_ytdlp():
    """Update yt-dlp to latest version - runs daily"""
    try:
        print(f"[{datetime.now()}] Updating yt-dlp...")
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install", "--upgrade", "--no-cache-dir", "yt-dlp"],
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        
        if result.returncode == 0:
            if "Successfully installed" in result.stdout:
                print(f"[{datetime.now()}] ✅ yt-dlp updated successfully!")
            else:
                print(f"[{datetime.now()}] ✅ yt-dlp already up to date")
        else:
            print(f"[{datetime.now()}] ⚠️ yt-dlp update failed: {result.stderr}")
    except subprocess.TimeoutExpired:
        print(f"[{datetime.now()}] ⚠️ yt-dlp update timed out")
    except Exception as e:
        print(f"[{datetime.now()}] ❌ yt-dlp update error: {e}")

# Cleanup endpoint (manual trigger)
@app.delete("/api/cleanup")
async def cleanup_old_files():
    """Manually trigger cleanup of old files"""
    removed = 0
    current_time = time.time()
    
    for file_path in DOWNLOAD_DIR.iterdir():
        if file_path.is_file():
            file_age = current_time - file_path.stat().st_mtime
            if file_age > 3600:  # 1 hour
                file_path.unlink()
                removed += 1
    
    return {"removed": removed, "message": f"Cleaned up {removed} old files"}

@app.post("/api/update-ytdlp")
async def trigger_ytdlp_update():
    """Manually trigger yt-dlp update"""
    update_ytdlp()
    return {"message": "yt-dlp update triggered"}

# Track start time for uptime
start_time = time.time()

# Schedule tasks
@app.on_event("startup")
async def startup_event():
    """Initialize scheduled tasks on startup"""
    print(f"[{datetime.now()}] Starting YouTube Downloader Worker...")
    
    # Schedule cleanup every 30 minutes
    scheduler.add_job(
        scheduled_cleanup,
        'interval',
        minutes=30,
        id='cleanup_job',
        replace_existing=True
    )
    print("✅ Scheduled cleanup job: Every 30 minutes")
    
    # Schedule yt-dlp update daily at 3 AM UTC
    scheduler.add_job(
        update_ytdlp,
        'cron',
        hour=3,
        minute=0,
        id='ytdlp_update_job',
        replace_existing=True
    )
    print("✅ Scheduled yt-dlp update: Daily at 3:00 AM UTC")
    
    # Run initial cleanup
    scheduled_cleanup()
    
    print(f"[{datetime.now()}] Worker startup complete!")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    print(f"[{datetime.now()}] Shutting down...")
    scheduler.shutdown()
    print("✅ Scheduler stopped")

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
