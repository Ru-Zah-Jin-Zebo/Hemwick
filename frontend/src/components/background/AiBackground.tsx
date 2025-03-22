'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

type AiBackgroundProps = {
  theme?: string
  style?: string
  colors?: string[]
}

export default function AiBackground({ 
  theme = "professional", 
  style = "minimalist",
  colors 
}: AiBackgroundProps) {
  const [mounted, setMounted] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { theme: colorTheme } = useTheme()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchBackground = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch('http://localhost:8000/api/generate-background', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            theme,
            mode: colorTheme === 'dark' ? 'dark' : 'light',
            style,
            colors: colors || undefined
          }),
        })
        
        if (!response.ok) {
          throw new Error('Failed to generate background')
        }
        
        const data = await response.json()
        setBackgroundImage(data.image_data)
      } catch (err) {
        console.error('Error fetching background:', err)
        setError('Failed to load AI-generated background')
        // Use a fallback gradient
        setBackgroundImage(generateFallbackBackground(colorTheme === 'dark'))
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchBackground()
  }, [theme, colorTheme, style, colors, mounted])
  
  // During SSR or before mounting, use a neutral gradient
  if (!mounted) {
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          opacity: 0.8,
          background: 'linear-gradient(135deg, #f0f4f8 0%, #d1e0ff 100%)'
        }}
      />
    )
  }
  
  // If the background is loading or there's an error, show a simple gradient
  if (isLoading || error) {
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          opacity: 0.8,
          background: colorTheme === 'dark' 
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
            : 'linear-gradient(135deg, #f0f4f8 0%, #d1e0ff 100%)'
        }}
      />
    )
  }
  
  // Once the image is loaded, display it as a background
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.8, // Make it subtle so content is still readable
      }}
    />
  )
}

function generateFallbackBackground(isDark: boolean): string {
  // Create an SVG gradient as fallback
  const colors = isDark 
    ? ['#1a1a2e', '#16213e'] 
    : ['#f0f4f8', '#d1e0ff']
  
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1000 1000">
    <defs>
      <linearGradient id="grad" gradientTransform="rotate(45)">
        <stop offset="0%" stop-color="${colors[0]}" />
        <stop offset="100%" stop-color="${colors[1]}" />
      </linearGradient>
      <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M-10,10 l10,-10 l10,10 l-10,10 z" stroke="rgba(120,150,255,0.2)" stroke-width="0.5" fill="none"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)" />
    <rect width="100%" height="100%" fill="url(#pattern)" opacity="0.3"/>
  </svg>
  `
  
  return `data:image/svg+xml;base64,${btoa(svg)}`
}