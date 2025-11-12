FROM python:3.11-slim

# Install ffmpeg (required for yt-dlp audio conversion)
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Always update yt-dlp to latest version
RUN pip install --upgrade --no-cache-dir yt-dlp

# Copy application code
COPY main.py .

# Create downloads directory
RUN mkdir -p downloads

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
