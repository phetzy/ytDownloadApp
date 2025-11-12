"""
Worker startup script with auto-update
This script updates yt-dlp before starting the FastAPI server
"""
import subprocess
import sys

def update_ytdlp():
    """Update yt-dlp to the latest version"""
    print("🔄 Updating yt-dlp to latest version...")
    try:
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "--upgrade", "yt-dlp"],
            check=True
        )
        print("✅ yt-dlp updated successfully!")
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Failed to update yt-dlp: {e}")
        print("⏩ Continuing with current version...")

if __name__ == "__main__":
    # Update yt-dlp first
    update_ytdlp()
    
    # Start the FastAPI server
    print("\n🚀 Starting worker service...")
    subprocess.run([sys.executable, "main.py"])
