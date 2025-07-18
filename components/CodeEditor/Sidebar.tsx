"use client"

import { useTheme } from "@/contexts/ThemeContext"
import { FileNode } from "@/types"
import { ChevronDown, ChevronRight, File, FilePlus, Folder, FolderClosed, FolderInput, FolderOpen, FolderPlus, Search } from "lucide-react"
import React, { useCallback, useEffect, useState } from "react"
import FileCreateCard from "./fileCreateCard"
import { useEditor } from "@/contexts/EditorContext"
import axios from "axios"
import { useSocket } from "@/provider/SocketProvider"


interface SidebarProps {
  width: number,
  onResizeStart: () => void
}

interface FileTreeProps {
  theam : string;
  data: FileNode
}


const FileTree: React.FC<FileTreeProps> = ({ data, theam }) => {
  const [isOpen, setIsOpen] = useState(data.isOpen ?? false);
  const { openFile, activeFile } = useEditor();
  
  const toggleFolder = () => {
    if (data.type === "folder") {
      setIsOpen(!isOpen);
    }
  };

  console.log({activeFile});
  
  return (
    <div className="ml-4 p-1">
      <div
        onClick={() => {
          if(data.type === "folder"){
            toggleFolder()
          }else{
            openFile(data.path, data.name);
          }
        }}
        className={`flex items-center space-x-2 cursor-pointer ${data.type === "folder" ? "hover:text-blue-400" : "hover:text-blue-300"
          }`}
      >
        <span className={`flex gap-1 ${data.type === "file" ? "pl-6" : "text-blue-500"}`}>
          <p className={`${theam === 'dark' ? "text-gray-200"  : "text-gray-800"}`}>{data.type === "folder" && (isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />)}</p>
          <p className={`${theam === 'dark' ? "text-blue-500"  : "text-blue-700"}`}>{data.type === "folder" ? (isOpen ? <FolderOpen size={20} /> : <Folder size={20} />) : <File size={20} />}</p>
        </span>
        <span className={`${theam === 'dark' ? "text-gray-200"  : "text-gray-800"} hover:text-blue-600 ${activeFile === data.path ? "text-sky-600" : ""}`} >{data.name}</span>
      </div>

      {data.type === "folder" && isOpen && data.children && (
        <div className="ml-4">
          {data.children.map((child) => (
            <FileTree theam={theam} key={child.path} data={child} />
          ))}
        </div>
      )}
    </div>
  );
};



const Sidebar: React.FC<SidebarProps> = ({ width, onResizeStart }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [files, setFiles] = useState<FileNode[]|null>();
  const socket = useSocket();
  const { theme } = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false)
  const [showContextMenu, setShowContextMenu] = useState<{
    x: number
    y: number
    path: string
    type: "file" | "folder"
  } | null>(null)

  const fetchData = useCallback(async (data: any) => {
    console.log("change happen", { data });
    fetchFiles();
  }, [])
  
  function handelCardClose () {
    setShowCreateDialog(!showCreateDialog);
  }
  const handleCreateItem = (type: "file" | "folder", parentPath: string) => {
    if(type === "file"){
      setShowCreateDialog(true);
    }
    setShowContextMenu(null)
  }

  useEffect(() => {
    socket?.on("dir:change", fetchData);
    return () => {
      socket?.off("dir:change", fetchData);
    }
  }, [socket])

  const fetchFiles = async() => {
    try{
      const res = await axios.get("http://localhost:8001/get-files");

      if(res.status === 200){
        setFiles(res.data.tree);
      }
      
    }catch(err) {
      console.log((err as Error).message)
    }
  }

  useEffect(() => {
    fetchFiles();
  }, [])
  return (
    <div className="m-1 p-2 cursor-e-resize flex border-r-2 border-gray-700 flex-col" style={{ width }} onMouseDown={onResizeStart}>

      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Explorer</span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleCreateItem("file", "/workspace")}
              className={`p-1 rounded transition-colors ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
              title="New File"
            >
              <FilePlus className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleCreateItem("folder", "/workspace")}
              className={`p-1 rounded transition-colors ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
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
            className={`w-full pl-8 pr-3 py-1.5 text-sm rounded border ${theme === "dark"
              ? "bg-gray-700 border-gray-600 text-gray-300 placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-700 placeholder-gray-500"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      </div>

      <div className="w-full h-full cursor-default ">
        <div className="w-full h-fit text-white p-2 ml-4">
          <button className={`flex w-full gap-2 items-center justify-start cursor-pointer ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'}`} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            <span className="text-blue-600">{isOpen ? <FolderOpen size={20} /> : <Folder size={20} />}</span>
            <p className={`${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'}`}> workspace</p>
          </button>
          {files && isOpen && files.map((node) => (
            <FileTree theam={theme} key={node.path} data={node} />
          ))}
        </div>
      </div>
      {showCreateDialog && <FileCreateCard initPath="/" handelClose={handelCardClose} theme="dark"/>}
    </div>
  );
};


export default Sidebar