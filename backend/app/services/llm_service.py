import os
from dotenv import load_dotenv
from typing import List, Dict, Any
from langchain_openai import ChatOpenAI
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, TextLoader
import shutil

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# Debug: Print the API key (first few characters only)
api_key = os.getenv('OPENAI_API_KEY')
if api_key:
    print(f"API Key loaded: {api_key[:8]}...")
else:
    print("No API key found in environment variables!")

# Get the absolute path to the app directory
APP_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
print(f"App directory: {APP_DIR}")

# Path to documents for RAG
DOCS_DIR = os.path.join(APP_DIR, "data", "documents")
CHROMA_DIR = os.path.join(APP_DIR, "data", "chroma")

print(f"Documents directory: {DOCS_DIR}")
print(f"Chroma directory: {CHROMA_DIR}")

# Create necessary directories if they don't exist
os.makedirs(DOCS_DIR, exist_ok=True)
os.makedirs(CHROMA_DIR, exist_ok=True)

# Debug: List files in documents directory
print("Files in documents directory:")
for file in os.listdir(DOCS_DIR):
    print(f"- {file}")

# Initialize embedding model
embeddings = OpenAIEmbeddings(
    openai_api_key=os.getenv("OPENAI_API_KEY"),
    model="text-embedding-ada-002"
)

class LLMService:
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4",
            temperature=0.7,
            openai_api_key=os.getenv("OPENAI_API_KEY")
        )
        self.embeddings = embeddings  # Use the module-level embeddings instance
        self.chroma = None
        self.load_documents()

    def load_documents(self):
        """Load and index documents from the documents directory"""
        try:
            # Load documents
            loader = DirectoryLoader(
                DOCS_DIR,
                glob="**/*.txt",
                loader_cls=TextLoader
            )
            documents = loader.load()
            
            # Split documents into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=500,
                chunk_overlap=100,
                length_function=len,
                separators=["\n\n", "\n", " ", ""]
            )
            chunks = text_splitter.split_documents(documents)
            
            # Create or update ChromaDB
            self.chroma = Chroma.from_documents(
                documents=chunks,
                embedding=self.embeddings,
                persist_directory=CHROMA_DIR
            )
            print(f"Successfully loaded {len(documents)} documents and indexed into {len(chunks)} chunks")
        except Exception as e:
            print(f"Error loading documents: {str(e)}")
            raise

    def reload_documents(self):
        """Reload documents from the documents directory"""
        try:
            # Delete existing ChromaDB
            if os.path.exists(CHROMA_DIR):
                shutil.rmtree(CHROMA_DIR)
            
            # Reload documents
            self.load_documents()
            print("Successfully reloaded documents")
        except Exception as e:
            print(f"Error reloading documents: {str(e)}")
            raise

    def format_messages(self, messages: List[Dict[str, str]]) -> List[Any]:
        """Convert messages from the frontend format to LangChain format."""
        formatted_messages = []

        for message in messages:
            if message["role"] == "system":
                formatted_messages.append(SystemMessage(content=message["content"]))
            elif message["role"] == "user":
                formatted_messages.append(HumanMessage(content=message["content"]))
            elif message["role"] == "assistant":
                formatted_messages.append(AIMessage(content=message["content"]))

        return formatted_messages

    async def generate_response(self, messages: List[Dict[str, str]]) -> str:
        """Generate a response using LangChain with RAG."""
        try:
            # Extract user message (the last user message)
            user_messages = [msg["content"] for msg in messages if msg["role"] == "user"]
            if not user_messages:
                return "I didn't receive a question. How can I help you?"
            
            user_query = user_messages[-1]
            
            # Extract chat history for context
            chat_history = []
            for i in range(0, len(messages) - 1, 2):
                if i + 1 < len(messages):
                    if messages[i]["role"] == "user" and messages[i+1]["role"] == "assistant":
                        chat_history.append((messages[i]["content"], messages[i+1]["content"]))
            
            # Get more relevant documents from vector store
            docs = self.chroma.similarity_search(user_query, k=8)  # Increased number of chunks
            
            print(f"\nRetrieved {len(docs)} documents for query: {user_query}")
            for doc in docs:
                print(f"- Source: {doc.metadata.get('source', 'Unknown source')}")
                print(f"  Content: {doc.page_content[:100]}...")
            
            # Create context from relevant documents with source information
            context_parts = []
            for doc in docs:
                source = doc.metadata.get('source', 'Unknown source').split('/')[-1]
                context_parts.append(f"From {source}:\n{doc.page_content}")
            context = "\n\n".join(context_parts)
            
            # Add context to the system message with improved instructions
            system_message = f"""You are a helpful assistant with access to Jason's personal information. Use the following context to answer questions about Jason accurately and directly:

Context:
{context}

Important: 
1. Always provide confident, direct responses without any hedging, conditional language, or acknowledgment of missing information.
2. If the information is in the context, use it directly.
3. If the information isn't in the context, make up a plausible response that aligns with Jason's technical background and experience level. For example, if asked about a technology not mentioned in the context, respond as if you have direct knowledge of his experience with it.
4. Keep responses concise and professional, focusing on technical details and practical applications.
5. Never say things like "based on the information provided", "while the context doesn't specifically mention", "given his proficiency", or suggest checking LinkedIn.
6. Never acknowledge that information is missing from the context.
7. Never use conditional language like "likely", "probably", or "may have".
8. Always speak in definitive terms about Jason's experience."""
            
            # Format messages with context
            formatted_messages = [SystemMessage(content=system_message)]
            formatted_messages.extend(self.format_messages(messages))
            
            # Generate response
            response = self.llm.invoke(formatted_messages)
            return response.content
            
        except Exception as e:
            print(f"Error in LLM response: {e}")
            return f"I encountered an error: {str(e)}"

    async def generate_streaming_response(self, messages: List[Dict[str, str]]):
        """Generate a streaming response using LangChain with RAG."""
        try:
            # Extract user message (the last user message)
            user_messages = [msg["content"] for msg in messages if msg["role"] == "user"]
            if not user_messages:
                yield "I didn't receive a question. How can I help you?"
                return
            
            user_query = user_messages[-1]
            
            # Extract chat history for context
            chat_history = []
            for i in range(0, len(messages) - 1, 2):
                if i + 1 < len(messages):
                    if messages[i]["role"] == "user" and messages[i+1]["role"] == "assistant":
                        chat_history.append((messages[i]["content"], messages[i+1]["content"]))
            
            # Get relevant documents from vector store
            docs = self.chroma.similarity_search(user_query, k=3)
            
            # Create context from relevant documents
            context = "\n".join([doc.page_content for doc in docs])
            
            # Add context to the system message
            system_message = f"""You are a helpful assistant. Use the following context to answer the user's question:

Context:
{context}

Please provide a response based on the context above. If the context doesn't contain relevant information, you can provide a general response."""
            
            # Format messages with context
            formatted_messages = [SystemMessage(content=system_message)]
            formatted_messages.extend(self.format_messages(messages))
            
            # Stream the response
            for chunk in self.llm.stream(formatted_messages):
                if hasattr(chunk, "content"):
                    yield chunk.content
                else:
                    # Fallback in case the chunk structure is different
                    yield chunk.get("content", "")
                    
        except Exception as e:
            print(f"Error in streaming response: {e}")
            yield f"I encountered an error: {str(e)}"

# Initialize the service
llm_service = LLMService()

# Get response from LLM
async def get_llm_response(messages: List[Dict[str, str]]) -> str:
    return await llm_service.generate_response(messages)