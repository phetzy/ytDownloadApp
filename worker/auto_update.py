"""
Auto-update script for yt-dlp
Run this before starting the main worker service
"""
import subprocess
import sys

def update_ytdlp():
    """Update yt-dlp to the latest version"""
    try:
        print("🔄 Checking for yt-dlp updates...")
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install", "--upgrade", "yt-dlp"],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            if "Successfully installed" in result.stdout:
                print("✅ yt-dlp updated successfully!")
            else:
                print("✅ yt-dlp is already up to date")
        else:
            print(f"⚠️ Update check failed: {result.stderr}")
            
    except Exception as e:
        print(f"❌ Error updating yt-dlp: {e}")

if __name__ == "__main__":
    update_ytdlp()
