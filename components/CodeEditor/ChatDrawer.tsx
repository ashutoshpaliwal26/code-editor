
"use client"

import { useEffect } from "react"
import ChatPanel from "./PreviewPanel"

interface ChatDrawerProps {
  isOpen: boolean
  width?: number
  height?: string
  onClose?: () => void
}

export default function ChatDrawer({ isOpen, width = 400, height = "100%", onClose }: ChatDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <div
      className={`fixed top-0 right-0 h-full z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ width }}
    >
      <ChatPanel width={width} height={height} />
    </div>
  )
}
