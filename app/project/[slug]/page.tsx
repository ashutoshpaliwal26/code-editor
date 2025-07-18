"use client"
import { useState, useEffect } from "react"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { EditorProvider } from "@/contexts/EditorContext"
import { FileSystemProvider } from "@/contexts/FileSystemContext"
import CodeEditor from "@/components/CodeEditor"
import { useDispatch } from "react-redux"
import { setUser } from "@/store/auth/authSlice"
import SocketProvider from "@/provider/SocketProvider"
export default function Home({ params }: { params: Promise<{ slug: string }> }) {
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
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
      <SocketProvider>
        <FileSystemProvider>
          <EditorProvider>
            <div className="h-screen w-screen overflow-hidden">
              <CodeEditor />
            </div>
          </EditorProvider>
        </FileSystemProvider>
      </SocketProvider>
    </ThemeProvider>
  )
}
