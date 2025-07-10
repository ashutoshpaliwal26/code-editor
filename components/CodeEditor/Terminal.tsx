"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useFileSystem } from "@/contexts/FileSystemContext"
import { useEditor } from "@/contexts/EditorContext"
import { TerminalIcon, X, Plus, Minus, Trash2 } from "lucide-react"

interface TerminalProps {
  height: number
  onResizeStart: () => void
}

interface TerminalSession {
  id: string
  name: string
  history: string[]
  currentDirectory: string
}

export default function Terminal({ height, onResizeStart }: TerminalProps) {
  const { theme } = useTheme()
  const { fileSystem, createFile, createFolder, deleteFile, listDirectory } = useFileSystem()
  const { runCode, activeFile } = useEditor()
  const [isMinimized, setIsMinimized] = useState(false)
  const [command, setCommand] = useState("")
  const [sessions, setSessions] = useState<TerminalSession[]>([
    {
      id: "1",
      name: "Terminal 1",
      history: ["Welcome to Code Editor Pro Terminal!", 'Type "help" for available commands.', "~/workspace$ "],
      currentDirectory: "/workspace",
    },
  ])
  const [activeSession, setActiveSession] = useState("1")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (inputRef.current && !isMinimized) {
      inputRef.current.focus()
    }
  }, [isMinimized, activeSession])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [sessions])

  const getCurrentSession = () => sessions.find((s) => s.id === activeSession) || sessions[0]

  const updateSession = (sessionId: string, updates: Partial<TerminalSession>) => {
    setSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, ...updates } : s)))
  }

  const addToHistory = (sessionId: string, line: string) => {
    const session = sessions.find((s) => s.id === sessionId)
    if (session) {
      const newHistory = [...session.history]
      newHistory[newHistory.length - 1] = line
      updateSession(sessionId, { history: newHistory })
    }
  }

  const addNewLine = (sessionId: string, line: string) => {
    const session = sessions.find((s) => s.id === sessionId)
    if (session) {
      const newHistory = [...session.history, line, `${session.currentDirectory}$ `]
      updateSession(sessionId, { history: newHistory })
    }
  }

  const executeCommand = async (cmd: string, sessionId: string) => {
    const session = getCurrentSession()
    const args = cmd.trim().split(" ")
    const command = args[0].toLowerCase()

    addToHistory(sessionId, `${session.currentDirectory}$ ${cmd}`)

    try {
      switch (command) {
        case "":
          addNewLine(sessionId, "")
          break

        case "help":
          addNewLine(
            sessionId,
            `Available commands:
  help          - Show this help message
  ls            - List files and directories
  cd <dir>      - Change directory
  pwd           - Print working directory
  mkdir <name>  - Create a new directory
  touch <name>  - Create a new file
  rm <name>     - Delete a file or directory
  cat <file>    - Display file contents
  clear         - Clear terminal
  run           - Run the current file
  node <file>   - Run JavaScript file with Node.js
  python <file> - Run Python file
  tree          - Show directory tree
  whoami        - Show current user
  date          - Show current date and time`,
          )
          break

        case "ls":
          const currentDir = args[1] || session.currentDirectory
          const items = listDirectory(currentDir)
          if (items.length === 0) {
            addNewLine(sessionId, "Directory is empty")
          } else {
            const output = items
              .map((item) => (item.type === "folder" ? `📁 ${item.name}/` : `📄 ${item.name}`))
              .join("  ")
            addNewLine(sessionId, output)
          }
          break

        case "pwd":
          addNewLine(sessionId, session.currentDirectory)
          break

        case "cd":
          const targetDir = args[1] || "/workspace"
          // Simple directory navigation
          if (targetDir === "..") {
            const parts = session.currentDirectory.split("/").filter((p) => p)
            parts.pop()
            const newDir = "/" + parts.join("/")
            updateSession(sessionId, { currentDirectory: newDir || "/workspace" })
          } else if (targetDir.startsWith("/")) {
            updateSession(sessionId, { currentDirectory: targetDir })
          } else {
            const newDir =
              session.currentDirectory === "/" ? `/${targetDir}` : `${session.currentDirectory}/${targetDir}`
            updateSession(sessionId, { currentDirectory: newDir })
          }
          addNewLine(sessionId, "")
          break

        case "mkdir":
          if (args[1]) {
            createFolder(`${session.currentDirectory}/${args[1]}`)
            addNewLine(sessionId, `Created directory: ${args[1]}`)
          } else {
            addNewLine(sessionId, "Usage: mkdir <directory_name>")
          }
          break

        case "touch":
          if (args[1]) {
            createFile(`${session.currentDirectory}/${args[1]}`, "")
            addNewLine(sessionId, `Created file: ${args[1]}`)
          } else {
            addNewLine(sessionId, "Usage: touch <filename>")
          }
          break

        case "rm":
          if (args[1]) {
            deleteFile(`${session.currentDirectory}/${args[1]}`)
            addNewLine(sessionId, `Deleted: ${args[1]}`)
          } else {
            addNewLine(sessionId, "Usage: rm <filename>")
          }
          break

        case "cat":
          if (args[1]) {
            const filePath = `${session.currentDirectory}/${args[1]}`
            const content = fileSystem[filePath]
            if (content !== undefined) {
              addNewLine(sessionId, content || "(empty file)")
            } else {
              addNewLine(sessionId, `cat: ${args[1]}: No such file`)
            }
          } else {
            addNewLine(sessionId, "Usage: cat <filename>")
          }
          break

        case "clear":
          updateSession(sessionId, { history: [`${session.currentDirectory}$ `] })
          break

        case "run":
          if (activeFile) {
            addNewLine(sessionId, `Running ${activeFile}...`)
            try {
              await runCode(activeFile)
              addNewLine(sessionId, "Execution completed")
            } catch (error) {
              addNewLine(sessionId, `Error: ${error}`)
            }
          } else {
            addNewLine(sessionId, "No active file to run")
          }
          break

        case "node":
          if (args[1]) {
            addNewLine(sessionId, `Running ${args[1]} with Node.js...`)
            addNewLine(sessionId, "Node.js execution simulated")
          } else {
            addNewLine(sessionId, "Usage: node <filename.js>")
          }
          break

        case "python":
          if (args[1]) {
            addNewLine(sessionId, `Running ${args[1]} with Python...`)
            addNewLine(sessionId, "Python execution simulated")
          } else {
            addNewLine(sessionId, "Usage: python <filename.py>")
          }
          break

        case "tree":
          addNewLine(
            sessionId,
            `📁 workspace/
├── 📁 src/
│   ├── 📁 components/
│   │   └── 📄 App.jsx
│   └── 📄 index.js
├── 📄 package.json
└── 📄 README.md`,
          )
          break

        case "whoami":
          addNewLine(sessionId, "developer")
          break

        case "date":
          addNewLine(sessionId, new Date().toString())
          break

        case "npm":
          if (args[1] === "install") {
            addNewLine(sessionId, "Installing packages...")
            setTimeout(() => {
              addNewLine(sessionId, "Packages installed successfully!")
            }, 1000)
          } else if (args[1] === "start") {
            addNewLine(sessionId, "Starting development server...")
            addNewLine(sessionId, "Server running on http://localhost:3000")
          } else {
            addNewLine(sessionId, `npm ${args.slice(1).join(" ")} - command executed`)
          }
          break

        case "git":
          if (args[1] === "status") {
            addNewLine(
              sessionId,
              `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified:   src/App.jsx
  
no changes added to commit`,
            )
          } else if (args[1] === "add") {
            addNewLine(sessionId, `Added ${args[2] || "."} to staging area`)
          } else if (args[1] === "commit") {
            addNewLine(sessionId, "Committed changes successfully")
          } else {
            addNewLine(sessionId, `git ${args.slice(1).join(" ")} - command executed`)
          }
          break

        default:
          addNewLine(sessionId, `bash: ${command}: command not found`)
          break
      }
    } catch (error) {
      addNewLine(sessionId, `Error: ${error}`)
    }
  }

  const handleCommand = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (command.trim()) {
        setCommandHistory((prev) => [...prev, command])
        setHistoryIndex(-1)
      }
      await executeCommand(command, activeSession)
      setCommand("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCommand(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setCommand("")
        } else {
          setHistoryIndex(newIndex)
          setCommand(commandHistory[newIndex])
        }
      }
    }
  }

  const addNewSession = () => {
    const newId = Date.now().toString()
    const newSession: TerminalSession = {
      id: newId,
      name: `Terminal ${sessions.length + 1}`,
      history: ["New terminal session started", "~/workspace$ "],
      currentDirectory: "/workspace",
    }
    setSessions((prev) => [...prev, newSession])
    setActiveSession(newId)
  }

  const closeSession = (sessionId: string) => {
    if (sessions.length > 1) {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
      if (activeSession === sessionId) {
        setActiveSession(sessions.find((s) => s.id !== sessionId)?.id || sessions[0].id)
      }
    }
  }

  if (isMinimized) {
    return (
      <div
        className={`h-10 flex items-center justify-between px-4 border-t ${
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="flex items-center space-x-2">
          <TerminalIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Terminal</span>
          <span className="text-xs text-gray-500">({sessions.length} sessions)</span>
        </div>
        <button
          onClick={() => setIsMinimized(false)}
          className={`p-1 rounded transition-colors ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    )
  }

  const currentSession = getCurrentSession()

  return (
    <div
      className={`flex flex-col border-t ${
        theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"
      }`}
      style={{ height }}
    >
      {/* Terminal Header */}
      <div
        className={`flex items-center justify-between px-4 py-2 border-b ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex items-center space-x-2">
          <TerminalIcon className="w-4 h-4" />
          <div className="flex items-center space-x-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-xs cursor-pointer transition-colors ${
                  activeSession === session.id
                    ? theme === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200 text-gray-900"
                    : theme === "dark"
                      ? "hover:bg-gray-800 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                }`}
                onClick={() => setActiveSession(session.id)}
              >
                <span>{session.name}</span>
                {sessions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      closeSession(session.id)
                    }}
                    className="hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={addNewSession}
            className={`p-1 rounded transition-colors ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
            title="New Terminal"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateSession(activeSession, { history: [`${currentSession.currentDirectory}$ `] })}
            className={`p-1 rounded transition-colors ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
            title="Clear Terminal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className={`p-1 rounded transition-colors ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div ref={terminalRef} className="flex-1 p-4 font-mono text-sm overflow-y-auto">
        {currentSession.history.map((line, index) => (
          <div
            key={index}
            className={`${
              line.includes("$")
                ? theme === "dark"
                  ? "text-green-400"
                  : "text-green-600"
                : line.includes("Error:") || line.includes("bash:")
                  ? "text-red-400"
                  : theme === "dark"
                    ? "text-gray-300"
                    : "text-gray-700"
            } whitespace-pre-wrap`}
          >
            {line}
          </div>
        ))}
        <div className="flex items-center">
          <span className={`${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
            {currentSession.currentDirectory}$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleCommand}
            className={`flex-1 ml-1 outline-1 outline-transparent bg-transparent ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className={`h-1 cursor-row-resize ${
          theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-300"
        } transition-colors`}
        onMouseDown={onResizeStart}
      />
    </div>
  )
}
