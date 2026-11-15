# Multi-stage Dockerfile for Dancing with the SARs backend
FROM python:3.11-slim

# System dependencies for geospatial raster and HDF5 operations
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgdal-dev \
    libhdf5-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -U pip setuptools wheel \
    && pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY . /app/

# Create non-root user for security
RUN useradd -m -u 1001 appuser \
    && mkdir -p /app/storage /app/cache \
    && chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
