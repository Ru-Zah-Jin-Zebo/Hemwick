from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
from dotenv import load_dotenv
import os
import signal
import sys
from app.services.llm_service import get_llm_response, LLMService

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

app = FastAPI(title="Resume Chatbot API")
llm_service = LLMService()

# Get the frontend URL from environment variable or use default
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]

class ChatResponse(BaseModel):
    response: str

@app.get("/")
async def root():
    return {"message": "Resume Chatbot API is running"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        response = await llm_service.generate_response(request.messages)
        return ChatResponse(response=response)
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/reload-documents")
async def reload_documents():
    try:
        llm_service.reload_documents()
        return {"message": "Documents reloaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# For streaming support (to be implemented)
@app.post("/api/chat/stream")
async def chat_stream(request: ChatRequest):
    # Implementation for streaming responses
    pass

def signal_handler(sig, frame):
    print("\nShutting down gracefully...")
    sys.exit(0)

if __name__ == "__main__":
    # Register signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Run the server with proper shutdown handling
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )