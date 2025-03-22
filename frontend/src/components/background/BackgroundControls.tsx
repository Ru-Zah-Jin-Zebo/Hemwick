'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RefreshCw } from 'lucide-react'

type BackgroundControlsProps = {
  onThemeChange: (theme: string) => void
  onStyleChange: (style: string) => void
  onRegenerate: () => void
  theme: string
  style: string
}

export default function BackgroundControls({
  onThemeChange,
  onStyleChange,
  onRegenerate,
  theme,
  style
}: BackgroundControlsProps) {
  return (
    <div className="fixed bottom-4 left-4 flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg border shadow-md">
      <Select
        value={theme}
        onValueChange={onThemeChange}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="professional">Professional</SelectItem>
          <SelectItem value="creative">Creative</SelectItem>
          <SelectItem value="technical">Technical</SelectItem>
          <SelectItem value="minimal">Minimal</SelectItem>
        </SelectContent>
      </Select>
      
      <Select
        value={style}
        onValueChange={onStyleChange}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="minimalist">Minimalist</SelectItem>
          <SelectItem value="geometric">Geometric</SelectItem>
          <SelectItem value="gradient">Gradient</SelectItem>
          <SelectItem value="abstract">Abstract</SelectItem>
        </SelectContent>
      </Select>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onRegenerate}
        title="Regenerate Background"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  )
}