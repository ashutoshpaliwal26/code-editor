"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useFileSystem } from "./FileSystemContext"

interface OpenFile {
  path: string
  name: string
}

interface EditorContextType {
  openFiles: OpenFile[]
  activeFile: string | null
  openFile: (path: string, name: string) => void
  closeFile: (path: string) => void
  setActiveFile: (path: string) => void
  updateFileContent: (path: string, content: string) => void
  getFileContent: (path: string) => string
  saveFile: (path: string) => void
  runCode: (path: string) => Promise<void>
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export function EditorProvider({ children }: { children: ReactNode }) {
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([])
  const [activeFile, setActiveFileState] = useState<string | null>(null)
  const { fileSystem, saveFile: saveToFileSystem } = useFileSystem()

  const openFile = (path: string, name: string) => {
    if (!openFiles.find((file) => file.path === path)) {
      setOpenFiles((prev) => [...prev, { path, name }])
    }
    setActiveFileState(path)
  }

  const closeFile = (path: string) => {
    setOpenFiles((prev) => prev.filter((file) => file.path !== path))
    if (activeFile === path) {
      const remainingFiles = openFiles.filter((file) => file.path !== path)
      setActiveFileState(remainingFiles.length > 0 ? remainingFiles[0].path : null)
    }
  }

  const setActiveFile = (path: string) => {
    setActiveFileState(path)
  }

  const updateFileContent = (path: string, content: string) => {
    // This will be handled by the FileSystemContext
    saveToFileSystem(path, content)
  }

  const getFileContent = (path: string) => {
    return fileSystem[path] || ""
  }

  const saveFile = (path: string) => {
    // File is already saved through updateFileContent
    console.log(`Saved: ${path}`)
  }

  const runCode = async (path: string): Promise<void> => {
    const content = getFileContent(path)
    const fileName = path.split("/").pop() || ""
    const fileExt = fileName.split(".").pop()?.toLowerCase()

    return new Promise((resolve, reject) => {
      try {
        switch (fileExt) {
          case "js":
          case "jsx":
            // Simulate JavaScript execution
            console.log(`Running JavaScript: ${fileName}`)
            console.log("Output:", content)
            setTimeout(resolve, 1000)
            break

          case "py":
            // Simulate Python execution
            console.log(`Running Python: ${fileName}`)
            console.log("Output:", content)
            setTimeout(resolve, 1500)
            break

          case "html":
            // Open HTML in new window
            const newWindow = window.open()
            if (newWindow) {
              newWindow.document.write(content)
              newWindow.document.close()
            }
            resolve()
            break

          default:
            console.log(`Cannot execute .${fileExt} files`)
            resolve()
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  return (
    <EditorContext.Provider
      value={{
        openFiles,
        activeFile,
        openFile,
        closeFile,
        setActiveFile,
        updateFileContent,
        getFileContent,
        saveFile,
        runCode,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}

export function useEditor() {
  const context = useContext(EditorContext)
  if (context === undefined) {
    throw new Error("useEditor must be used within an EditorProvider")
  }
  return context
}
