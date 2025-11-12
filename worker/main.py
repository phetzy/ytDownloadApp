from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yt_dlp
import os
import json
from pathlib import Path
from typing import Optional, List, Dict, Any

app = FastAPI(title="YouTube Downloader Worker")

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
    return {"status": "YouTube Downloader Worker Service", "version": "1.0.0"}

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
            # Audio only
            output_template = str(DOWNLOAD_DIR / f"{title}.%(ext)s")
            ydl_opts = {
                'format': 'bestaudio/best',
                'outtmpl': output_template,
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }],
                'quiet': True,
            }
            filename = f"{title}.mp3"
        else:
            # Video with audio
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
                'quiet': True,
            }
            filename = f"{title}.mp4"
        
        # Download the video/audio
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([request.url])
        
        # Check if file exists
        file_path = DOWNLOAD_DIR / filename
        if not file_path.exists():
            # Try to find the file with different extension
            for ext in ['mp4', 'webm', 'mkv', 'mp3']:
                alt_path = DOWNLOAD_DIR / f"{title}.{ext}"
                if alt_path.exists():
                    file_path = alt_path
                    filename = alt_path.name
                    break
        
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
async def serve_file(filename: str):
    """Serve downloaded file"""
    file_path = DOWNLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type='application/octet-stream'
    )

# Cleanup endpoint (optional - for managing storage)
@app.delete("/api/cleanup")
async def cleanup_old_files():
    """Remove downloaded files older than 1 hour"""
    import time
    removed = 0
    current_time = time.time()
    
    for file_path in DOWNLOAD_DIR.iterdir():
        if file_path.is_file():
            file_age = current_time - file_path.stat().st_mtime
            if file_age > 3600:  # 1 hour
                file_path.unlink()
                removed += 1
    
    return {"removed": removed, "message": f"Cleaned up {removed} old files"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
