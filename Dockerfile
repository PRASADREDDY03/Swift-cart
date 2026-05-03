FROM python:3.9-slim

WORKDIR /app

# Install dependencies first for better caching
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend and frontend source code
COPY backend/ ./backend/
COPY frontend/ ./frontend/

WORKDIR /app/backend

# Run the FastAPI server using uvicorn. 
# Cloud Run sets the PORT environment variable.
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}
