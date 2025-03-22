import os
from dotenv import load_dotenv
from typing import List, Dict, Any
from langchain_community.chat_models import ChatOpenAI
from langchain.schema import AIMessage, HumanMessage, SystemMessage
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, TextLoader

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# Debug: Print the API key (first few characters only)
api_key = os.getenv('OPENAI_API_KEY')
if api_key:
    print(f"API Key loaded: {api_key[:8]}...")
else:
    print("No API key found in environment variables!")

# Path to documents for RAG
DOCS_DIR = os.getenv("DOCS_DIR", "data/documents")
CHROMA_DIR = os.getenv("CHROMA_DIR", "data/chroma")

# Create necessary directories if they don't exist
os.makedirs(DOCS_DIR, exist_ok=True)
os.makedirs(CHROMA_DIR, exist_ok=True)

# Initialize embedding model
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={"device": "cpu"}
)

class LLMService:
    def __init__(self):
        # Initialize OpenAI LLM
        self.llm = ChatOpenAI(
            model_name="gpt-3.5-turbo",
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            streaming=True,
            temperature=0.7,
        )
        
        # Initialize vector store
        self.vectorstore = self._load_documents()

    def _load_documents(self):
        """Load and prepare documents for RAG."""
        try:
            # Try to load existing ChromaDB
            vectorstore = Chroma(
                persist_directory=CHROMA_DIR,
                embedding_function=embeddings
            )
            
            # If no documents exist, load and index them
            if vectorstore._collection.count() == 0:
                # Check if there are any documents in the directory
                if not any(os.scandir(DOCS_DIR)):
                    print(f"No documents found in {DOCS_DIR}. Please add some .txt files to this directory.")
                    return vectorstore
                    
                # Load documents from directory
                loader = DirectoryLoader(DOCS_DIR, glob="**/*.txt", loader_cls=TextLoader)
                documents = loader.load()
                
                if not documents:
                    print(f"No .txt documents found in {DOCS_DIR}")
                    return vectorstore
                
                # Split documents into chunks
                text_splitter = RecursiveCharacterTextSplitter(
                    chunk_size=1000,
                    chunk_overlap=200
                )
                splits = text_splitter.split_documents(documents)
                
                # Create and persist vector store
                vectorstore = Chroma.from_documents(
                    documents=splits,
                    embedding=embeddings,
                    persist_directory=CHROMA_DIR
                )
                vectorstore.persist()
                print(f"Successfully loaded and indexed {len(documents)} documents")
            
            return vectorstore
        except Exception as e:
            print(f"Error loading documents: {e}")
            # Create empty vector store if documents cannot be loaded
            return Chroma(
                persist_directory=CHROMA_DIR,
                embedding_function=embeddings
            )

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
            
            # Get relevant documents from vector store
            docs = self.vectorstore.similarity_search(user_query, k=3)
            
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
            
            # Generate response
            response = self.llm(formatted_messages)
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
            docs = self.vectorstore.similarity_search(user_query, k=3)
            
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