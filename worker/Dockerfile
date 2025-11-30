FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ffmpeg \
    curl \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first (for better caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Update yt-dlp to latest version
RUN pip install --upgrade --no-cache-dir yt-dlp

# Copy application code
COPY main.py .

# Create downloads directory with proper permissions
RUN mkdir -p downloads && \
    chmod 755 downloads

# Create non-root user for security
RUN useradd -m -u 1000 worker && \
    chown -R worker:worker /app

# Switch to non-root user
USER worker

# Expose port (Railway will set PORT env var)
EXPOSE 8000

# Health check - use PORT if set, otherwise 8000
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

# Run with optimized settings - use PORT if set, otherwise default to 8000
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1 --timeout-keep-alive 120
