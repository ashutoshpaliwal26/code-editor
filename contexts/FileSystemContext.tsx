"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface FileSystemContextType {
  fileSystem: Record<string, string>
  createFile: (path: string, content: string) => void
  createFolder: (path: string) => void
  deleteFile: (path: string) => void
  saveFile: (path: string, content: string) => void
  listDirectory: (path: string) => Array<{ name: string; type: "file" | "folder"; path: string }>
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined)

const initialFileSystem: Record<string, string> = {
  "/workspace/src/App.jsx": `import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to React!</h1>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
          Click me
        </button>
      </header>
    </div>
  );
}

export default App;`,
  "/workspace/src/App.css": `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

button {
  background-color: #61dafb;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #21a1c4;
}`,
  "/workspace/src/index.js": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
  "/workspace/public/index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
  "/workspace/package.json": `{
  "name": "my-react-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "scripts": {
    "start": "react-scripts start",  "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}`,
  "/workspace/README.md": `# My React App

This is a sample React application created with Code Editor Pro.

## Getting Started

1. Install dependencies: \`npm install\`
2. Start the development server: \`npm start\`
3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Features

- React 18
- Modern JavaScript
- Hot reloading
- Built-in development server

## Available Scripts

- \`npm start\` - Runs the app in development mode
- \`npm build\` - Builds the app for production
- \`npm test\` - Launches the test runner

Happy coding! 🚀`,
}

export function FileSystemProvider({ children }: { children: ReactNode }) {
  const [fileSystem, setFileSystem] = useState<Record<string, string>>(initialFileSystem)

  useEffect(() => {
    const stored = localStorage.getItem("fileSystem")
    if (stored) {
      try {
        setFileSystem(JSON.parse(stored))
      } catch (error) {
        console.error("Failed to load file system from localStorage:", error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("fileSystem", JSON.stringify(fileSystem))
  }, [fileSystem])

  const createFile = (path: string, content = "") => {
    setFileSystem((prev) => ({
      ...prev,
      [path]: content,
    }))
  }

  const createFolder = (path: string) => {
    // Folders are represented by their existence in file paths
    // We don't need to store empty folders explicitly
    console.log(`Created folder: ${path}`)
  }

  const deleteFile = (path: string) => {
    setFileSystem((prev) => {
      const newFileSystem = { ...prev }
      delete newFileSystem[path]
      return newFileSystem
    })
  }

  const saveFile = (path: string, content: string) => {
    setFileSystem((prev) => ({
      ...prev,
      [path]: content,
    }))
  }

  const listDirectory = (path: string) => {
    const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path
    const items: Array<{ name: string; type: "file" | "folder"; path: string }> = []
    const folders = new Set<string>()

    Object.keys(fileSystem).forEach((filePath) => {
      if (filePath.startsWith(normalizedPath + "/")) {
        const relativePath = filePath.substring(normalizedPath.length + 1)
        const parts = relativePath.split("/")

        if (parts.length === 1) {
          // Direct file
          items.push({
            name: parts[0],
            type: "file",
            path: filePath,
          })
        } else {
          // File in subdirectory
          const folderName = parts[0]
          if (!folders.has(folderName)) {
            folders.add(folderName)
            items.push({
              name: folderName,
              type: "folder",
              path: `${normalizedPath}/${folderName}`,
            })
          }
        }
      }
    })

    return items.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "folder" ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    })
  }

  return (
    <FileSystemContext.Provider
      value={{
        fileSystem,
        createFile,
        createFolder,
        deleteFile,
        saveFile,
        listDirectory,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  )
}

export function useFileSystem() {
  const context = useContext(FileSystemContext)
  if (context === undefined) {
    throw new Error("useFileSystem must be used within a FileSystemProvider")
  }
  return context
}
