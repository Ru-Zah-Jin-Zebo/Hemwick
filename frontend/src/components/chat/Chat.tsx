'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type ChatProps = {
  useMock?: boolean
  initialQuery?: string
  onQueryProcessed?: () => void
}

export default function Chat({ useMock = false, initialQuery = '', onQueryProcessed }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi there! I can tell you about Jason\'s professional experience, skills, and projects. What would you like to know about? You can ask about specific technologies like "Python" or "React", or projects like "Project Sentinel" or "AIQA".',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [useMockMode, setUseMockMode] = useState(useMock)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset state when initialQuery changes to empty string (modal closed)
  useEffect(() => {
    if (initialQuery === '') {
      setMessages([{
        role: 'assistant',
        content: 'Hi there! I can tell you about Jason\'s professional experience, skills, and projects. What would you like to know about? You can ask about specific technologies like "Python" or "React", or projects like "Project Sentinel" or "AIQA".',
      }])
      setInput('')
    }
  }, [initialQuery])

  // Focus input field on mount
  useEffect(() => {
    // Add a small delay to ensure the modal is fully mounted
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Check if backend is available on component mount
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
        // Try a simple GET request instead of HEAD which might be causing the 405 error
        const response = await fetch(`${backendUrl}/`, { 
          method: 'GET',
          signal: AbortSignal.timeout(2000) // Timeout after 2 seconds
        });
        
        if (response.ok) {
          console.log('Backend is available');
        } else {
          console.log('Backend returned an error, switching to mock mode');
          setUseMockMode(true);
        }
      } catch (error) {
        console.log('Backend is not available, switching to mock mode');
        setUseMockMode(true);
      }
    };
    
    // Set mock mode by default and attempt to connect to backend
    setUseMockMode(true);
    checkBackendConnection();
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  // Handle initialQuery when provided
  useEffect(() => {
    if (initialQuery && initialQuery.trim() !== '') {
      setInput(initialQuery)
      // Send the query immediately
      sendMessage()
    }
  }, [initialQuery])

  const sendMessage = async () => {
    if (input.trim() === '') return

    const userMessage: Message = {
      role: 'user',
      content: input,
    }

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Send message to API with mock parameter if enabled
      const response = await fetch(`http://localhost:8000/api/chat${useMockMode ? '?mock=true' : ''}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      // Add assistant response to chat
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.response,
        },
      ])

      // Only notify parent that query was processed if this was an initial query
      if (initialQuery) {
        onQueryProcessed?.()
      }
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Add error message with more details
      console.error('Error details:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error connecting to the backend. This could be because: \n\n1. The DeepSeek LLM server might not be running\n2. There might be a configuration issue with LangChain\n\nPlease check the backend logs for more details.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Add effect to focus input after messages change
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus()
    }
  }, [messages, isLoading])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 rounded-md bg-transparent"
           style={{backgroundImage: 'linear-gradient(to bottom, rgba(245, 247, 250, 0.1), rgba(245, 247, 250, 0.1))'}}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              'flex mb-4 animate-fadeIn',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-lg p-4 shadow-md transition-all backdrop-blur-sm',
                message.role === 'user'
                  ? 'bg-primary/90 text-primary-foreground'
                  : 'bg-gray-200/90 dark:bg-gray-700/90 text-foreground'
              )}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 bg-gray-100 dark:bg-gray-800 rounded-b-lg">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 pb-2">
            <div className="flex items-center gap-2">
              <Switch 
                id="mock-mode" 
                checked={useMockMode} 
                onCheckedChange={setUseMockMode} 
              />
              <Label htmlFor="mock-mode" className="text-xs font-medium">
                Use mock mode
              </Label>
            </div>
            {useMockMode && (
              <span className="text-xs text-muted-foreground italic">
                Using built-in responses (no backend)
              </span>
            )}
          </div>
          
          <div className="flex gap-2 shadow-sm">
            <Input
              ref={inputRef}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1 border-gray-300 focus:border-primary bg-white dark:bg-gray-700"
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || input.trim() === ''}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}