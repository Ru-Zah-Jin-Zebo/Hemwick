'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ThemeToggle } from '@/components/theme-toggle'

// Dynamic imports to prevent SSR issues
const Resume = dynamic(() => import('@/components/resume/Resume'), { ssr: false })
const ChatModal = dynamic(() => import('@/components/chat/ChatModal'), { ssr: false })

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-background text-foreground">
      <div className="z-10 w-full max-w-4xl flex flex-col items-center justify-center">
        <div className="w-full flex justify-between items-center mb-8">
          <div className="text-center flex-grow">
            <h1 className="text-4xl font-bold mb-2">My Interactive Resume</h1>
            <p className="text-lg text-muted-foreground">
              Welcome to my professional portfolio
            </p>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
        
        <div className="flex gap-4 mb-8">
          <Link href="https://linkedin.com/in/yourprofile" target="_blank">
            <Button variant="outline" size="lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              LinkedIn
            </Button>
          </Link>
          <Link href="https://github.com/yourusername" target="_blank">
            <Button variant="outline" size="lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              GitHub
            </Button>
          </Link>
          <div className="fixed bottom-4 right-4">
            <ChatModal />
          </div>
        </div>

        <div className="w-full bg-card text-card-foreground shadow-lg rounded-lg p-6 border">
          <Resume />
        </div>
      </div>
    </main>
  )
}