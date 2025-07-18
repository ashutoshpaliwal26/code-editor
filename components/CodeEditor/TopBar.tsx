"use client"

import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useEditor } from "@/contexts/EditorContext"
import { Play, Settings, User, LogOut, Moon, Sun, Save, Download, Columns, Monitor, MessageCircle, Eye } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { useParams } from "next/navigation"
import { stringify } from "querystring"
import { Item } from "@radix-ui/react-accordion"

interface TopBarProps {
  onSettingsClick: () => void
  layout: "editor" | "split" | "preview"
  onLayoutChange: (layout: "editor" | "split" | "preview") => void
  showPreview: boolean
  onTogglePreview: () => void
}

export default function TopBar({ onSettingsClick, layout, onLayoutChange, showPreview, onTogglePreview }: TopBarProps) {
  const user = useSelector((state : RootState) => state.auth.user)
  const { theme, toggleTheme } = useTheme()
  const { activeFile, saveFile, runCode } = useEditor()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const params = useParams();

  const handleRun = async () => {
    if (!activeFile) return
    setIsRunning(true)
    try {
      await runCode(activeFile)
    } finally {
      setIsRunning(false)
    }
  }

  const handleSave = () => {
    if (activeFile) {
      saveFile(activeFile)
    }
  }

  const handleExport = () => {
    // Export project as ZIP
    console.log("Exporting project...")
  }

  return (
    <div
      className={`h-16 flex items-center justify-between px-4 border-b ${
        theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">CE</span>
          </div>
          <span className="font-semibold">{params.slug}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRun}
            disabled={!activeFile || isRunning}
            className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white rounded-md transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>{isRunning ? "Running..." : "Run"}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={!activeFile}
            className={`p-2 rounded-md transition-colors ${
              theme === "dark" ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-600"
            } disabled:opacity-50`}
            title="Save (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
          </button>

          <div className="flex items-center border rounded-md overflow-hidden">
            <button
              onClick={() => onLayoutChange("editor")}
              className={`p-2 transition-colors ${
                layout === "editor"
                  ? theme === "dark"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-300 text-gray-900"
                  : theme === "dark"
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-200 text-gray-600"
              }`}
              title="Editor Only"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => onLayoutChange("split")}
              className={`p-2 transition-colors ${
                layout === "split"
                  ? theme === "dark"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-300 text-gray-900"
                  : theme === "dark"
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-200 text-gray-600"
              }`}
              title="Split View"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            {/* <button
              onClick={() => onLayoutChange("preview")}
              className={`p-2 transition-colors ${
                layout === "preview"
                  ? theme === "dark"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-300 text-gray-900"
                  : theme === "dark"
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-200 text-gray-600"
              }`}
              title="Preview Only"
            >
              <Eye className="w-4 h-4" />
            </button> */}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleExport}
          className={`p-2 rounded-md transition-colors ${
            theme === "dark" ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-600"
          }`}
          title="Export Project"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={toggleTheme}
          className={`p-2 rounded-md transition-colors ${
            theme === "dark" ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-600"
          }`}
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={onSettingsClick}
          className={`p-2 rounded-md transition-colors ${
            theme === "dark" ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-600"
          }`}
        >
          <Settings className="w-4 h-4" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
              theme === "dark" ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-600"
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-sm">{ user?.name || "User"}</span>
          </button>

          {showUserMenu && (
            <div
              className={`absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg z-50 ${
                theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
              }`}
            >
              <button
                onClick={() => {
                  setShowUserMenu(false)
                }}
                className={`w-full flex items-center space-x-2 px-4 py-2 text-left transition-colors ${
                  theme === "dark" ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
