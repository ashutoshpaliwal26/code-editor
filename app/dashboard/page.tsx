"use client"

import { useState, useEffect } from "react"
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { EditorProvider } from "@/contexts/EditorContext"
import { FileSystemProvider } from "@/contexts/FileSystemContext"
import CodeEditor from "@/components/CodeEditor"
import AuthModal from "@/components/Auth/AuthModal"

export default function Home() {
  const [isClient, setIsClient] = useState(false)


  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_API_URL);
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <FileSystemProvider>
        <EditorProvider>
          <div className="h-screen w-screen overflow-hidden">
            <CodeEditor />
          </div>
        </EditorProvider>
      </FileSystemProvider>
    </ThemeProvider>
  )
}
