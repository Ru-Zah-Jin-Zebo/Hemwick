# Resume Chatbot Backend

This is the backend component of the Resume Chatbot application, built with FastAPI and LangChain.

## Features

- FastAPI-based RESTful API
- LangChain integration with DeepSeek LLM
- RAG (Retrieval Augmented Generation) implementation
- Docker containerization

## Directory Structure

```
backend/
├── Dockerfile             # Docker configuration
├── app/
│   ├── __init__.py
│   ├── main.py            # FastAPI main application
│   ├── models/            # Data models
│   ├── routers/           # API route definitions
│   ├── services/          # Business logic
│   │   └── llm_service.py # LangChain integration
│   └── utils/             # Utility functions
├── data/                  # RAG documents storage
├── requirements.txt       # Python dependencies
└── tests/                 # Backend tests
```

## Setup and Installation

### Using Docker

1. Build and run using Docker:
```bash
docker build -t resume-chatbot-backend .
docker run -p 8000:8000 -v $(pwd)/data:/app/data resume-chatbot-backend
```

### Local Development

1. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the development server:
```bash
uvicorn app.main:app --reload
```

## API Endpoints

### Chat API

- **POST /api/chat**
  - Request body: `{"messages": [{"role": "user", "content": "message"}]}`
  - Response: `{"response": "response from LLM"}`

### Health Check

- **GET /**
  - Response: `{"message": "Resume Chatbot API is running"}`

## RAG Implementation

The backend uses the following approach for Retrieval Augmented Generation:

1. Document Loading: Loads text documents from the `data/documents/` directory
2. Text Splitting: Splits documents into smaller chunks
3. Embedding: Converts text chunks into vector embeddings using HuggingFace embeddings
4. Storage: Stores embeddings in a FAISS vector database
5. Retrieval: Retrieves relevant documents based on query similarity
6. Generation: Uses LangChain to combine retrieved documents with the LLM to generate contextual responses

## Authentication Strategy

In a production environment, the following authentication approach would be implemented:

1. **JWT Authentication**:
   - Create a `/login` endpoint that validates credentials and returns a JWT
   - Add a JWT middleware to validate tokens on protected routes
   - Implement token refresh mechanism for extended sessions

2. **API Key Authentication**:
   - Issue API keys to trusted clients
   - Validate API keys in request headers
   - Rate limit requests based on API key usage

3. **Authentication Code**:
```python
# JWT Authentication example
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
```

## Deployment Strategy

For production deployment, the following approach is recommended:

1. **Containerization**:
   - Use Docker for containerizing the application
   - Set up CI/CD pipeline for automated builds and deployments

2. **Cloud Deployment Options**:
   - AWS: Use ECS or Lambda for containerized deployment
   - GCP: Deploy to Cloud Run for serverless containers
   - Azure: Use Container Instances or App Service

3. **Scaling**:
   - Use auto-scaling based on CPU/memory utilization
   - Implement load balancing for distributed requests

4. **Monitoring**:
   - Set up logging with Elasticsearch, Logstash, and Kibana (ELK stack)
   - Implement metrics monitoring with Prometheus and Grafana
   - Set up alerting for critical issues

5. **Environment Configuration**:
   - Use environment variables for configuration
   - Store secrets in a secure vault (AWS Secrets Manager, HashiCorp Vault)