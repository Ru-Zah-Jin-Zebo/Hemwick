from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
import os
import io
import base64
from typing import Optional
import requests
import logging

router = APIRouter()

logger = logging.getLogger(__name__)

# Models for request and response
class ImageGenerationRequest(BaseModel):
    theme: str = "professional"
    mode: str = "light"  # light or dark
    style: str = "minimalist"
    colors: Optional[list] = None

class ImageGenerationResponse(BaseModel):
    image_data: str  # Base64 encoded image
    prompt_used: str

# API endpoint for generating images
@router.post("/api/generate-background", response_model=ImageGenerationResponse)
async def generate_background(request: ImageGenerationRequest):
    try:
        # Create a prompt based on the request
        prompt = create_image_prompt(
            theme=request.theme,
            mode=request.mode,
            style=request.style,
            colors=request.colors
        )
        
        # Call image generation API
        image_data = await generate_image_with_api(prompt)
        
        return ImageGenerationResponse(
            image_data=image_data,
            prompt_used=prompt
        )
    except Exception as e:
        logger.error(f"Error generating image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate image: {str(e)}")

def create_image_prompt(theme: str, mode: str, style: str, colors: Optional[list] = None) -> str:
    """Create a prompt for image generation based on parameters"""
    
    # Base prompt structure
    base_prompt = f"A {style} abstract background for a professional portfolio website"
    
    # Add theme details
    theme_details = {
        "professional": "with subtle geometric patterns and a clean, corporate feel",
        "creative": "with gentle artistic elements and flowing shapes",
        "technical": "with faint circuit-like patterns and a modern tech feel",
        "minimal": "with very minimal elements, mostly clean space with slight texture"
    }
    
    theme_prompt = theme_details.get(theme.lower(), theme_details["professional"])
    
    # Add mode-specific details
    mode_details = {
        "light": "using light, subtle colors with soft contrasts, perfect for a light mode interface",
        "dark": "using deeper, richer colors with elegant contrasts, perfect for a dark mode interface"
    }
    
    mode_prompt = mode_details.get(mode.lower(), mode_details["light"])
    
    # Add color specifications if provided
    color_prompt = ""
    if colors and len(colors) > 0:
        color_list = ", ".join(colors)
        color_prompt = f" incorporating a palette of {color_list}"
    
    # Combine all elements
    final_prompt = f"{base_prompt} {theme_prompt}, {mode_prompt}{color_prompt}. The image should be subtle enough to use as a website background without distracting from content."
    
    return final_prompt

async def generate_image_with_api(prompt: str) -> str:
    """
    Generate an image using an API (placeholder for actual implementation)
    Returns base64 encoded image data
    """
    # This is a placeholder. In a real implementation, you would:
    # 1. Call an AI image generation API (like OpenAI DALL-E, Stability AI, etc.)
    # 2. Process the response and return the image
    
    # For demo purposes, we'll return a mock implementation that would be replaced
    # with your actual API call using requests, aiohttp, etc.
    
    # Mock implementation (in actual code, you'd call a real API)
    try:
        # Example API call (commented out - replace with your actual implementation)
        """
        api_key = os.environ.get("IMAGE_API_KEY")
        response = requests.post(
            "https://api.example.com/generate",
            headers={"Authorization": f"Bearer {api_key}"},
            json={"prompt": prompt, "size": "1024x1024"}
        )
        response.raise_for_status()
        image_data = response.json().get("image")
        """
        
        # For now, return a placeholder base64 image
        # This would be replaced with the actual API response
        placeholder_image = create_placeholder_image(prompt)
        return placeholder_image
        
    except Exception as e:
        logger.error(f"Error in image generation API call: {str(e)}")
        raise

def create_placeholder_image(prompt: str) -> str:
    """Create a placeholder gradient image based on the prompt"""
    # In a real implementation, this would be replaced with the actual API call
    # For now, return a static base64 encoded gradient image
    
    # This is a simple blue gradient background encoded in base64
    # In your actual implementation, this would come from the AI image generation API
    sample_image_base64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAwIDEwMDAiPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFRyYW5zZm9ybT0icm90YXRlKDQ1KSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmMGY0ZjgiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2QxZTBmZiIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+CiAgPHBhdHRlcm4gaWQ9InBhdHRlcm4iIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+CiAgICA8cGF0aCBkPSJNLTEwLDEwIGwxMCwtMTAgbDEwLDEwIGwtMTAsMTAgeiIgc3Ryb2tlPSJyZ2JhKDEyMCwxNTAsMjU1LDAuMikiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsPSJub25lIi8+CiAgPC9wYXR0ZXJuPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiIG9wYWNpdHk9IjAuMyIvPgo8L3N2Zz4="
    
    return sample_image_base64