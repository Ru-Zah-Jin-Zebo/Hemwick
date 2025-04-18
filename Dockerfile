FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend directory as a module
COPY backend/ /app/backend/

# Expose the port the app runs on
ENV PORT=8000
EXPOSE $PORT

# Command to run the application
CMD uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT