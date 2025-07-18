"use client"

import type React from "react"

import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import TopBar from "./TopBar"
import Sidebar from "./Sidebar"
import MainEditor from "./MainEditor"
import Terminal from "./Terminal"
import SettingsPanel from "./SettingsPanel"
import PreviewPanel from "./PreviewPanel"

const CodeEditor = () => {
  const { theme } = useTheme()
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [terminalHeight, setTerminalHeight] = useState(200)
  const [previewWidth, setPreviewWidth] = useState(400)
  const [showSettings, setShowSettings] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [layout, setLayout] = useState<"editor" | "split" | "preview">("editor")
  const [resizeDirection, setResizeDirection] = useState<"x" | "y" | "z">("x");

  const handleSidebarResize = (e: React.MouseEvent) => {
    if (!isResizing || resizeDirection !== 'x') return
    const newWidth = e.clientX
    if (newWidth >= 200 && newWidth <= 500) {
      setSidebarWidth(newWidth)
    }
  }

  const handleTerminalResize = (e: React.MouseEvent) => {
    if (!isResizing || resizeDirection !== 'y') return
    const newHeight = window.innerHeight - e.clientY
    if (newHeight >= 100 && newHeight <= 400) {
      setTerminalHeight(newHeight)
    }
  }

  const handlePreviewResize = (e: React.MouseEvent) => {
    if (!isResizing || resizeDirection !== 'z') return
    const newWidth = window.innerWidth - e.clientX
    if (newWidth >= 300 && newWidth <= 800) {
      setPreviewWidth(newWidth)
    }
  }

  // if (!user) {
  //   return (
  //     <div
  //       className={`h-screen w-screen flex items-center justify-center ${
  //         theme === "dark" ? "bg-gray-900" : "bg-gray-50"
  //       }`}
  //     >
  //       <div className="text-center">
  //         <h1 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
  //           Welcome to Code Editor Pro
  //         </h1>
  //         <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Please sign in to continue</p>
  //       </div>
  //     </div>
  //   )
  // }
  console.log({previewWidth});
  

  return (
    <div
      className={`h-screen w-screen flex flex-col ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
        }`}
      onMouseMove={(e) => {
        handleSidebarResize(e)
        handleTerminalResize(e)
        handlePreviewResize(e)
      }}
      onMouseUp={() => setIsResizing(false)}
    >
      <TopBar
        onSettingsClick={() => setShowSettings(true)}
        layout={layout}
        onLayoutChange={setLayout}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar width={sidebarWidth} onResizeStart={() => {
          setIsResizing(true)
          setResizeDirection('x')
        }} />

        <div className="flex flex-1">
          <div className="flex flex-col flex-1">
            <MainEditor
              height={`calc(100vh - 64px - ${terminalHeight}px)`}
              showPreview={layout === "split" || layout === "preview"}
              previewWidth={layout === "split" ? previewWidth : previewWidth}
            />
            <Terminal height={terminalHeight} onResizeStart={() => {
              setIsResizing(true);
              setResizeDirection('y')
            }} />
          </div>

          {(layout === "split" || layout === "preview") && (
            <>
              <div
                className={`w-1 cursor-col-resize ${theme === "dark" ? "hover:bg-gray-600 bg-gray-700" : "hover:bg-gray-300 bg-gray-200"
                  } transition-colors`}
                onMouseDown={() => {
                  setResizeDirection("z");
                  setIsResizing(true)
                }}
                
              />
              <PreviewPanel width={previewWidth} height={`calc(100vh - 64px)`} />
            </>
          )}
        </div>
      </div>

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  )
}

export default CodeEditor;