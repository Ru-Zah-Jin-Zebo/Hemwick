from typing import List, Dict

async def get_mock_response(messages: List[Dict[str, str]]) -> str:
    """Generate a mock response for testing purposes."""
    # Extract the last user message
    user_messages = [msg["content"] for msg in messages if msg["role"] == "user"]
    if not user_messages:
        return "I didn't receive a question. How can I help you?"
    
    user_query = user_messages[-1].lower()
    
    # Predefined responses for common queries
    responses = {
        "python": "Jason has extensive experience with Python, particularly in developing AI/ML applications and backend services. He's worked with Python for building RESTful APIs, implementing machine learning models, and creating scalable AI infrastructure.",
        "fastapi": "Jason has built robust backend services and RESTful APIs using FastAPI, particularly in his work on AI-driven anomaly detection systems and enterprise AI quality assurance tools.",
        "react": "Jason has developed modern frontend dashboards using React and Next.js, integrating them with AI-powered backend services for real-time monitoring and visualization.",
        "docker": "Jason has extensive experience with Docker containerization, particularly in building and maintaining scalable AI infrastructure on multi-GPU clusters.",
        "llm": "Jason has led the development of in-house AI solutions using open-source LLMs, implementing custom fine-tuning pipelines and internal model hosting infrastructure for enterprise-wide deployment.",
        "gpu": "Jason has worked extensively with multi-GPU clusters and high-performance NVIDIA workstations, implementing parallel model training and inference systems.",
        "nginx": "Jason has implemented NGINX for high-performance reverse proxy configurations, load balancing, and SSL termination in production environments.",
        "default": "Jason is a Software Engineer III with expertise in AI/ML, backend development, and cloud-native architectures. He has experience working with various technologies and frameworks in production environments."
    }
    
    # Check for keywords in the query and return appropriate response
    for keyword, response in responses.items():
        if keyword in user_query:
            return response
    
    # Return default response if no keywords match
    return responses["default"] 