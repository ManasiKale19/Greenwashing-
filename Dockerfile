# Hugging Face Spaces - GreenIntellect Backend API
# Python FastAPI + ML Models + Scraping

FROM python:3.11-slim

# Create non-root user (required by Hugging Face)
RUN useradd -m -u 1000 user
WORKDIR /app

# Install system dependencies for Selenium/Chromium
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    gnupg \
    chromium \
    chromium-driver \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libwayland-client0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Set Chrome environment variables
ENV CHROME_BIN=/usr/bin/chromium
ENV CHROMEDRIVER_PATH=/usr/bin/chromedriver

# Copy and install Python dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --timeout=300 -r /app/requirements.txt

# Copy ML model files
COPY ensemble_model.pkl /app/ensemble_model.pkl
COPY all_feature_columns.pkl /app/all_feature_columns.pkl
COPY binary_to_report_name_mapping.pkl /app/binary_to_report_name_mapping.pkl
COPY category_to_greenwashing_mapping.pkl /app/category_to_greenwashing_mapping.pkl

# Copy backend application
COPY app /app/app
COPY ml_models /app/ml_models

# Create directories
RUN mkdir -p /app/uploads && chown -R user:user /app

# Switch to non-root user
USER user

# Environment variables
ENV PORT=7860
ENV HOST=0.0.0.0
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

EXPOSE 7860

# Start FastAPI
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
