"""
Scheduled cleanup script for YouTube Downloader worker
Run this as a separate process or cron job to periodically clean old files
"""
import time
import schedule
from pathlib import Path

DOWNLOAD_DIR = Path("./downloads")

def cleanup_old_files(max_age_hours=1):
    """Remove files older than specified hours"""
    if not DOWNLOAD_DIR.exists():
        print("Downloads directory doesn't exist")
        return
    
    removed = 0
    current_time = time.time()
    max_age_seconds = max_age_hours * 3600
    
    for file_path in DOWNLOAD_DIR.iterdir():
        if file_path.is_file():
            file_age = current_time - file_path.stat().st_mtime
            if file_age > max_age_seconds:
                try:
                    file_path.unlink()
                    removed += 1
                    print(f"Removed: {file_path.name} (age: {file_age/3600:.1f} hours)")
                except Exception as e:
                    print(f"Error removing {file_path.name}: {e}")
    
    print(f"Cleanup complete: Removed {removed} files")

def cleanup_all_files():
    """Remove all files in downloads directory"""
    if not DOWNLOAD_DIR.exists():
        print("Downloads directory doesn't exist")
        return
    
    removed = 0
    for file_path in DOWNLOAD_DIR.iterdir():
        if file_path.is_file():
            try:
                file_path.unlink()
                removed += 1
            except Exception as e:
                print(f"Error removing {file_path.name}: {e}")
    
    print(f"Removed all {removed} files from downloads directory")

if __name__ == "__main__":
    print("Starting cleanup scheduler...")
    print("Cleaning up files older than 1 hour every 30 minutes")
    
    # Run cleanup every 30 minutes
    schedule.every(30).minutes.do(lambda: cleanup_old_files(max_age_hours=1))
    
    # Run initial cleanup
    cleanup_old_files(max_age_hours=1)
    
    # Keep running
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute
