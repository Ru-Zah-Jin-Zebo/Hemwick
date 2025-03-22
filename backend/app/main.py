from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from dotenv import load_dotenv
import os
import signal
import sys
from app.services.llm_service import get_llm_response

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

app = FastAPI(title="Resume Chatbot API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    response: str

@app.get("/")
async def root():
    return {"message": "Resume Chatbot API is running"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Format messages for the LLM
        formatted_messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        # Get response from LLM service
        response = await get_llm_response(formatted_messages)
        
        return ChatResponse(response=response)
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