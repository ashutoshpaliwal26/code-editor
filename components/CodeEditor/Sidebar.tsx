"use client"

import type React from "react"

import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useEditor } from "@/contexts/EditorContext"
import { useFileSystem } from "@/contexts/FileSystemContext"
import { Folder, FolderOpen, File, ChevronRight, ChevronDown, Search, FilePlus, FolderPlus, Trash2 } from "lucide-react"

interface SidebarProps {
  width: number
  onResizeStart: () => void
}

interface FileNode {
  name: string
  type: "file" | "folder"
  children?: FileNode[]
  path: string
  isOpen?: boolean
}

export default function Sidebar({ width, onResizeStart }: SidebarProps) {
  const { theme } = useTheme()
  const { openFile, activeFile } = useEditor()
  const { fileSystem, createFile, createFolder, deleteFile, listDirectory } = useFileSystem()
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["/workspace", "/workspace/src", "/workspace/public"]),
  )
  const [showContextMenu, setShowContextMenu] = useState<{
    x: number
    y: number
    path: string
    type: "file" | "folder"
  } | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState<{ type: "file" | "folder"; parentPath: string } | null>(null)
  const [newItemName, setNewItemName] = useState("")

  const buildFileTree = (): FileNode[] => {
    const tree: FileNode[] = []
    const pathMap = new Map<string, FileNode>()

    // Create root workspace node
    const workspaceNode: FileNode = {
      name: "workspace",
      type: "folder",
      path: "/workspace",
      children: [],
      isOpen: expandedFolders.has("/workspace"),
    }
    tree.push(workspaceNode)
    pathMap.set("/workspace", workspaceNode)

    // Process all file paths
    Object.keys(fileSystem).forEach((filePath) => {
      const parts = filePath.split("/").filter((p) => p)
      let currentPath = ""

      parts.forEach((part, index) => {
        const parentPath = currentPath
        currentPath = currentPath + "/" + part

        if (!pathMap.has(currentPath)) {
          const isFile = index === parts.length - 1
          const node: FileNode = {
            name: part,
            type: isFile ? "file" : "folder",
            path: currentPath,
            children: isFile ? undefined : [],
            isOpen: expandedFolders.has(currentPath),
          }

          pathMap.set(currentPath, node)

          // Add to parent
          const parent = pathMap.get(parentPath)
          if (parent && parent.children) {
            parent.children.push(node)
          }
        }
      })
    })

    // Sort children
    const sortChildren = (node: FileNode) => {
      if (node.children) {
        node.children.sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === "folder" ? -1 : 1
          }
          return a.name.localeCompare(b.name)
        })
        node.children.forEach(sortChildren)
      }
    }

    tree.forEach(sortChildren)
    return tree
  }

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(path)) {
        newSet.delete(path)
      } else {
        newSet.add(path)
      }
      return newSet
    })
  }

  const handleContextMenu = (e: React.MouseEvent, path: string, type: "file" | "folder") => {
    e.preventDefault()
    setShowContextMenu({
      x: e.clientX,
      y: e.clientY,
      path,
      type,
    })
  }

  const handleCreateItem = (type: "file" | "folder", parentPath: string) => {
    setShowCreateDialog({ type, parentPath })
    setShowContextMenu(null)
  }

  const confirmCreateItem = () => {
    if (!showCreateDialog || !newItemName.trim()) return

    const fullPath = `${showCreateDialog.parentPath}/${newItemName.trim()}`

    if (showCreateDialog.type === "file") {
      createFile(fullPath, "")
      openFile(fullPath, newItemName.trim())
    } else {
      createFolder(fullPath)
      setExpandedFolders((prev) => new Set([...prev, fullPath]))
    }

    setShowCreateDialog(null)
    setNewItemName("")
  }

  const handleDelete = (path: string) => {
    if (confirm(`Are you sure you want to delete ${path}?`)) {
      deleteFile(path)
    }
    setShowContextMenu(null)
  }

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes
      .filter((node) => searchTerm === "" || node.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((node) => (
        <div key={node.path}>
          <div
            className={`flex items-center space-x-2 px-2 py-1 cursor-pointer transition-colors ${
              activeFile === node.path
                ? theme === "dark"
                  ? "bg-gray-700"
                  : "bg-gray-200"
                : theme === "dark"
                  ? "hover:bg-gray-800"
                  : "hover:bg-gray-100"
            }`}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => {
              if (node.type === "folder") {
                toggleFolder(node.path)
              } else {
                openFile(node.path, node.name)
              }
            }}
            onContextMenu={(e) => handleContextMenu(e, node.path, node.type)}
          >
            {node.type === "folder" && (
              <div className="w-4 h-4 flex items-center justify-center">
                {node.isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </div>
            )}

            <div className="w-4 h-4 flex items-center justify-center">
              {node.type === "folder" ? (
                node.isOpen ? (
                  <FolderOpen className="w-4 h-4 text-blue-500" />
                ) : (
                  <Folder className="w-4 h-4 text-blue-500" />
                )
              ) : (
                <File className={`w-4 h-4 ${getFileIconColor(node.name)}`} />
              )}
            </div>

            <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{node.name}</span>
          </div>

          {node.type === "folder" && node.isOpen && node.children && (
            <div>{renderFileTree(node.children, depth + 1)}</div>
          )}
        </div>
      ))
  }

  const getFileIconColor = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "js":
      case "jsx":
        return "text-yellow-500"
      case "ts":
      case "tsx":
        return "text-blue-500"
      case "css":
        return "text-blue-400"
      case "html":
        return "text-orange-500"
      case "json":
        return "text-green-500"
      case "md":
        return "text-gray-500"
      case "py":
        return "text-green-600"
      default:
        return "text-gray-500"
    }
  }

  return (
    <>
      <div
        className={`flex flex-col border-r ${
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
        }`}
        style={{ width }}
      >
        <div className="p-3 border-b border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Explorer</span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleCreateItem("file", "/workspace")}
                className={`p-1 rounded transition-colors ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
                title="New File"
              >
                <FilePlus className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleCreateItem("folder", "/workspace")}
                className={`p-1 rounded transition-colors ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
                title="New Folder"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 text-sm rounded border ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-300 placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-700 placeholder-gray-500"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">{renderFileTree(buildFileTree())}</div>

        <div
          className={`w-1 cursor-col-resize absolute right-0 top-0 bottom-0 ${
            theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-300"
          } transition-colors`}
          onMouseDown={onResizeStart}
        />
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div
          className={`fixed z-50 min-w-48 rounded-md shadow-lg ${
            theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
          }`}
          style={{ left: showContextMenu.x, top: showContextMenu.y }}
          onMouseLeave={() => setShowContextMenu(null)}
        >
          <div className="py-1">
            <button
              onClick={() => handleCreateItem("file", showContextMenu.path)}
              className={`w-full flex items-center space-x-2 px-4 py-2 text-left transition-colors ${
                theme === "dark" ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <FilePlus className="w-4 h-4" />
              <span>New File</span>
            </button>
            <button
              onClick={() => handleCreateItem("folder", showContextMenu.path)}
              className={`w-full flex items-center space-x-2 px-4 py-2 text-left transition-colors ${
                theme === "dark" ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <FolderPlus className="w-4 h-4" />
              <span>New Folder</span>
            </button>
            <hr className={`my-1 ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`} />
            <button
              onClick={() => handleDelete(showContextMenu.path)}
              className={`w-full flex items-center space-x-2 px-4 py-2 text-left transition-colors text-red-500 hover:bg-red-50 ${
                theme === "dark" ? "hover:bg-red-900/20" : "hover:bg-red-50"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Create Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-96 rounded-lg shadow-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <div className={`p-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
              <h3 className="text-lg font-medium">Create New {showCreateDialog.type === "file" ? "File" : "Folder"}</h3>
            </div>
            <div className="p-4">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder={`Enter ${showCreateDialog.type} name...`}
                className={`w-full px-3 py-2 rounded border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-300"
                    : "bg-white border-gray-300 text-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmCreateItem()
                  if (e.key === "Escape") {
                    setShowCreateDialog(null)
                    setNewItemName("")
                  }
                }}
              />
            </div>
            <div
              className={`flex justify-end space-x-2 p-4 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
            >
              <button
                onClick={() => {
                  setShowCreateDialog(null)
                  setNewItemName("")
                }}
                className={`px-4 py-2 rounded transition-colors ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmCreateItem}
                disabled={!newItemName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
