"use client"

import { useState, useRef, useEffect, useCallback, ChangeEvent } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useEditor } from "@/contexts/EditorContext"
import { useFileSystem } from "@/contexts/FileSystemContext"
import { X, Search } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { useSocket } from "@/provider/SocketProvider"

interface MainEditorProps {
  height: string
  showPreview: boolean
  previewWidth: number
}

export default function MainEditor({ height, showPreview, previewWidth }: MainEditorProps) {
  const { theme } = useTheme()
  const { openFiles, activeFile, closeFile, setActiveFile, updateFileContent, getFileContent } = useEditor()
  const { saveFile } = useFileSystem()
  const [lineNumbers, setLineNumbers] = useState(true)
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [replaceTerm, setReplaceTerm] = useState("")
  const [currentContent, setCurrentContent] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const socket = useSocket();

  useEffect(() => {
    if (activeFile) {
      const content = getFileContent(activeFile)
      setCurrentContent(content)
    }
  }, [activeFile, getFileContent])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "s") {
          e.preventDefault()
          handleSave()
        } else if (e.key === "f") {
          e.preventDefault()
          setShowSearch(true)
        }
      }
    }

    socket?.emit("active:file", activeFile);

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeFile])

  const handleContentChange = (value: string) => {
    setCurrentContent(value)
    if (activeFile) {
      updateFileContent(activeFile, value)
    }
  }

  const handleSave = () => {
    if (activeFile) {
      saveFile(activeFile, currentContent)
    }
  }

  const handelFileChange = (e : ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentContent(e.target.value);
  }

  const getFileLanguage = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "js":
      case "jsx":
        return "javascript"
      case "ts":
      case "tsx":
        return "typescript"
      case "css":
        return "css"
      case "html":
        return "html"
      case "json":
        return "json"
      case "py":
        return "python"
      case "java":
        return "java"
      case "cpp":
      case "c":
        return "cpp"
      default:
        return "text"
    }
  }

  const renderLineNumbers = (content: string = " \n") => {
    const lines = content.split("\n")
    return (
      <div className={`pr-4 text-right select-none ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
        {lines.map((_, index) => (
          <div key={index} className="leading-6 text-sm font-mono">
            {index + 1}
          </div>
        ))}
      </div>
    )
  }

  const handleSearch = () => {
    if (!searchTerm || !textareaRef.current) return

    const textarea = textareaRef.current
    const content = textarea.value
    const index = content.toLowerCase().indexOf(searchTerm.toLowerCase())

    if (index !== -1) {
      textarea.focus()
      textarea.setSelectionRange(index, index + searchTerm.length)
    }
  }

  const handleReplace = () => {
    if (!searchTerm || !textareaRef.current) return

    const newContent = currentContent.replace(new RegExp(searchTerm, "gi"), replaceTerm)
    handleContentChange(newContent)
  }

  // 🔁 Define this outside the effect with useCallback
  const handelFileContent = useCallback((content: string) => {
    setCurrentContent(content);
  }, []);

  useEffect(() => {
    if (!socket) return; // ✅ Fine here — inside the hook body

    socket.on("active:file:content", handelFileContent);

    return (() => {
      socket.off("active:file:content", handelFileContent);
    })

  }, [socket]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      socket?.emit("file:change", {activeFile, data : currentContent})
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [currentContent])

  if (openFiles.length === 0) {
    return (
      <div
        className={`flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}
        style={{ height , width : "100%" }}
      >
        <div className="text-center">
          <div className={`text-6xl mb-4 ${theme === "dark" ? "text-gray-700" : "text-gray-300"}`}>{"</>"}</div>
          <p className={`${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>Select a file to start editing</p>
          <p className={`text-sm mt-2 ${theme === "dark" ? "text-gray-600" : "text-gray-500"}`}>
            Create a new file or open an existing one from the sidebar
          </p>
        </div>
      </div>
    )
  }

  const editorWidth = showPreview ? `calc(100%)` : "100%"
  return (
    <div
      className={`flex flex-col ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}
      style={{ height, width: editorWidth }}
    >
      {/* Tabs */}
      <div
        className={`flex border-b ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}
      >
        {openFiles.map((file) => (
          <div
            key={file.path}
            className={`flex items-center space-x-2 px-3 py-2 border-r cursor-pointer transition-colors ${activeFile === file.path
              ? theme === "dark"
                ? "bg-gray-900 border-gray-600"
                : "bg-white border-gray-300"
              : theme === "dark"
                ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            onClick={() => setActiveFile(file.path)}
          >
            <span className="text-sm">{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                closeFile(file.path)
              }}
              className={`p-0.5 rounded transition-colors ${theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-200"
                }`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        <div className="flex-1 flex justify-end items-center px-4">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-1 rounded transition-colors ${theme === "dark" ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-200 text-gray-600"
              }`}
            title="Search (Ctrl+F)"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div
          className={`p-3 border-b ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}
        >
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 px-3 py-1 text-sm rounded border ${theme === "dark"
                ? "bg-gray-700 border-gray-600 text-gray-300"
                : "bg-white border-gray-300 text-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <input
              type="text"
              placeholder="Replace..."
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              className={`flex-1 px-3 py-1 text-sm rounded border ${theme === "dark"
                ? "bg-gray-700 border-gray-600 text-gray-300"
                : "bg-white border-gray-300 text-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              onClick={handleSearch}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Find
            </button>
            <button
              onClick={handleReplace}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Replace All
            </button>
            <button
              onClick={() => setShowSearch(false)}
              className={`p-1 rounded transition-colors ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex flex-1 overflow-hidden">
        {lineNumbers && (
          <div
            className={`border-r px-2 py-4 ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
              }`}
          >
            {activeFile && renderLineNumbers(currentContent || "")}
          </div>
        )}

        <div className="flex-1 relative">
          {activeFile && (
            <textarea
              ref={textareaRef}
              value={currentContent}
              onChange={handelFileChange}
              className={`w-full h-full p-4 font-mono text-sm leading-6 resize-none outline-none ${theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-white text-gray-700"
                }`}
              style={{
                tabSize: 2,
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
              }}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          )}
        </div>
      </div>

      {/* Status Bar */}
      {activeFile && (
        <div
          className={`px-4 py-1 text-xs border-t ${theme === "dark" ? "border-gray-700 bg-gray-800 text-gray-400" : "border-gray-200 bg-gray-50 text-gray-600"
            }`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span>{getFileLanguage(openFiles.find((f) => f.path === activeFile)?.name || "")}</span>
              <span>Lines: {currentContent?.split("\n").length}</span>
              <span>Characters: {currentContent?.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>UTF-8</span>
              <span>LF</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
