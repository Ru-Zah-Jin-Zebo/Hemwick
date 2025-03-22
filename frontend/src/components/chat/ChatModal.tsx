'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import Chat from './Chat'

export default function ChatModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [initialQuery, setInitialQuery] = useState('')
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  const openChatWithQuery = (query: string) => {
    setInitialQuery(query)
    setIsOpen(true)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setInitialQuery('')
    }
  }
  
  // Function to expose the openChatWithQuery method globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore - Make the function globally available
      window.openChatWithQuery = openChatWithQuery;
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        // @ts-ignore - Clean up when component unmounts
        window.openChatWithQuery = undefined;
      }
    };
  }, []);

  return (
    <>
      <Button
        onClick={() => handleOpenChange(true)}
        className="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-8 rounded-full h-16 w-16 shadow-lg fixed bottom-4 right-4 z-[9999] animate-pulse"
        style={{
          boxShadow: 'rgba(0, 0, 0, 0.3) 0px 10px 25px -5px, rgba(147, 197, 253, 0.5) 0px 0px 0px 3px',
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          background: 'linear-gradient(45deg, rgb(59, 130, 246), rgb(37, 99, 235))'
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent 
          className="sm:max-w-[600px] md:max-w-[700px] h-[600px] flex flex-col fixed bottom-[90px] right-4 translate-x-0 translate-y-0 left-auto top-auto bg-background/95 backdrop-blur-sm p-0 overflow-hidden border rounded-lg"
          style={{
            transform: 'none', 
            maxHeight: 'calc(100vh - 100px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              e.stopPropagation()
            }
          }}
        >
          <div className="absolute right-2 top-2 z-50">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handleOpenChange(false)}
              className="h-8 w-8 rounded-full hover:bg-accent bg-white dark:bg-gray-700 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <DialogHeader className="pb-4 border-b bg-gray-100 dark:bg-gray-800 p-4 rounded-t-lg">
            <DialogTitle className="text-xl">Ask me about my experience</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Click on skills or projects in my resume to learn more about my experience.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-hidden my-2">
            <Chat initialQuery={initialQuery} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}