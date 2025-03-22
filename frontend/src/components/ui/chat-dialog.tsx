"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const ChatDialog = DialogPrimitive.Root

const ChatDialogTrigger = DialogPrimitive.Trigger

const ChatDialogPortal = DialogPrimitive.Portal

const ChatDialogClose = DialogPrimitive.Close

const ChatDialogTitle = DialogPrimitive.Title

const ChatDialogDescription = DialogPrimitive.Description

const ChatDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay 
      className="fixed inset-0 z-40 bg-black/40" 
    />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 bg-white dark:bg-gray-950 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4 bottom-24 right-6 w-full max-w-[400px] gap-4 rounded-xl border shadow-xl duration-200 transition-all data-[state=closed]:scale-95 data-[state=open]:scale-100 transform-gpu will-change-transform",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute top-3 right-3 rounded-full opacity-90 ring-offset-background transition-all hover:opacity-100 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none size-6 flex items-center justify-center">
        <XIcon className="h-4 w-4 transition-transform hover:scale-110" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
ChatDialogContent.displayName = DialogPrimitive.Content.displayName

export {
  ChatDialog,
  ChatDialogTrigger,
  ChatDialogContent,
  ChatDialogClose,
  ChatDialogTitle,
  ChatDialogDescription,
} 