"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useEditor } from "@/contexts/EditorContext"
import { RefreshCw, ExternalLink, Smartphone, Tablet, Monitor } from "lucide-react"

interface PreviewPanelProps {
  width: number
  height: string
}

export default function PreviewPanel({ width, height }: PreviewPanelProps) {
  const { theme } = useTheme()
  const { activeFile, getFileContent, openFiles } = useEditor()
  const [previewContent, setPreviewContent] = useState("")
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isLoading, setIsLoading] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    generatePreview()
  }, [activeFile, openFiles])

  const generatePreview = async () => {
    if (!activeFile) return

    setIsLoading(true)
    try {
      const fileName = activeFile.split("/").pop() || ""
      const fileExt = fileName.split(".").pop()?.toLowerCase()

      if (fileExt === "html") {
        const htmlContent = getFileContent(activeFile)
        setPreviewContent(htmlContent)
      } else if (fileExt === "jsx" || fileExt === "tsx") {
        // Generate a simple HTML preview for React components
        const jsxContent = getFileContent(activeFile)
        const htmlPreview = generateReactPreview(jsxContent, fileName)
        setPreviewContent(htmlPreview)
      } else if (fileExt === "css") {
        const cssContent = getFileContent(activeFile)
        const htmlPreview = generateCSSPreview(cssContent)
        setPreviewContent(htmlPreview)
      } else if (fileExt === "js") {
        const jsContent = getFileContent(activeFile)
        const htmlPreview = generateJSPreview(jsContent)
        setPreviewContent(htmlPreview)
      } else if (fileExt === "md") {
        const mdContent = getFileContent(activeFile)
        const htmlPreview = generateMarkdownPreview(mdContent)
        setPreviewContent(htmlPreview)
      } else {
        setPreviewContent(`
          <html>
            <body style="font-family: Arial, sans-serif; padding: 20px; background: ${theme === "dark" ? "#1f2937" : "#f9fafb"}; color: ${theme === "dark" ? "#e5e7eb" : "#374151"};">
              <h2>Preview not available</h2>
              <p>Preview is not supported for .${fileExt} files</p>
              <p>Supported formats: HTML, CSS, JS, JSX, TSX, MD</p>
            </body>
          </html>
        `)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const generateReactPreview = (jsxContent: string, fileName: string) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>React Preview - ${fileName}</title>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              margin: 0; 
              padding: 20px;
              background: ${theme === "dark" ? "#1f2937" : "#ffffff"};
              color: ${theme === "dark" ? "#e5e7eb" : "#374151"};
            }
            .preview-container { 
              border: 1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}; 
              border-radius: 8px; 
              padding: 20px; 
              background: ${theme === "dark" ? "#111827" : "#f9fafb"};
            }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            try {
              ${jsxContent.replace(/export default/g, "const Component =")}
              
              if (typeof Component !== 'undefined') {
                ReactDOM.render(React.createElement(Component), document.getElementById('root'));
              } else {
                document.getElementById('root').innerHTML = '<div class="preview-container"><h3>React Component Preview</h3><p>Component could not be rendered. Check your JSX syntax.</p></div>';
              }
            } catch (error) {
              document.getElementById('root').innerHTML = '<div class="preview-container"><h3>Preview Error</h3><p>' + error.message + '</p></div>';
            }
          </script>
        </body>
      </html>
    `
  }

  const generateCSSPreview = (cssContent: string) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>CSS Preview</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px;
              background: ${theme === "dark" ? "#1f2937" : "#ffffff"};
              color: ${theme === "dark" ? "#e5e7eb" : "#374151"};
            }
            ${cssContent}
          </style>
        </head>
        <body>
          <div class="preview-container">
            <h1>CSS Preview</h1>
            <div class="demo-content">
              <h2>Sample Content</h2>
              <p>This is a paragraph to demonstrate your CSS styles.</p>
              <button>Sample Button</button>
              <div class="box">Sample Box</div>
            </div>
          </div>
        </body>
      </html>
    `
  }

  const generateJSPreview = (jsContent: string) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>JavaScript Preview</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px;
              background: ${theme === "dark" ? "#1f2937" : "#ffffff"};
              color: ${theme === "dark" ? "#e5e7eb" : "#374151"};
            }
            .console { 
              background: ${theme === "dark" ? "#111827" : "#f9fafb"}; 
              border: 1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}; 
              padding: 15px; 
              border-radius: 8px; 
              font-family: monospace; 
              white-space: pre-wrap;
              max-height: 300px;
              overflow-y: auto;
            }
          </style>
        </head>
        <body>
          <h2>JavaScript Preview</h2>
          <div id="output"></div>
          <h3>Console Output:</h3>
          <div id="console" class="console"></div>
          
          <script>
            const originalLog = console.log;
            const consoleDiv = document.getElementById('console');
            
            console.log = function(...args) {
              consoleDiv.innerHTML += args.join(' ') + '\\n';
              originalLog.apply(console, args);
            };
            
            try {
              ${jsContent}
            } catch (error) {
              consoleDiv.innerHTML += 'Error: ' + error.message + '\\n';
            }
          </script>
        </body>
      </html>
    `
  }

  const generateMarkdownPreview = (mdContent: string) => {
    // Simple markdown to HTML conversion
    const htmlContent = mdContent
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/\n/gim, "<br>")

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Markdown Preview</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 20px;
              background: ${theme === "dark" ? "#1f2937" : "#ffffff"};
              color: ${theme === "dark" ? "#e5e7eb" : "#374151"};
            }
            h1, h2, h3 { color: ${theme === "dark" ? "#f3f4f6" : "#1f2937"}; }
            code { 
              background: ${theme === "dark" ? "#374151" : "#f3f4f6"}; 
              padding: 2px 4px; 
              border-radius: 3px; 
              font-family: monospace; 
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `
  }

  const getPreviewWidth = () => {
    switch (previewMode) {
      case "mobile":
        return "375px"
      case "tablet":
        return "768px"
      case "desktop":
        return "100%"
      default:
        return "100%"
    }
  }

  const refreshPreview = () => {
    generatePreview()
  }

  const openInNewTab = () => {
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(previewContent)
      newWindow.document.close()
    }
  }

  return (
    <div
      className={`flex flex-col border-l ${
        theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}
      style={{ width, height }}
    >
      {/* Preview Header */}
      <div
        className={`flex items-center justify-between px-4 py-2 border-b ${
          theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
        }`}
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Preview</span>
          {activeFile && <span className="text-xs text-gray-500">{activeFile.split("/").pop()}</span>}
        </div>

        <div className="flex items-center space-x-1">
          <div className="flex items-center border rounded-md overflow-hidden">
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`p-1 transition-colors ${
                previewMode === "desktop"
                  ? theme === "dark"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-300 text-gray-900"
                  : theme === "dark"
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-200 text-gray-600"
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode("tablet")}
              className={`p-1 transition-colors ${
                previewMode === "tablet"
                  ? theme === "dark"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-300 text-gray-900"
                  : theme === "dark"
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-200 text-gray-600"
              }`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode("mobile")}
              className={`p-1 transition-colors ${
                previewMode === "mobile"
                  ? theme === "dark"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-300 text-gray-900"
                  : theme === "dark"
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-200 text-gray-600"
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={refreshPreview}
            disabled={isLoading}
            className={`p-1 rounded transition-colors ${
              theme === "dark" ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-600"
            } disabled:opacity-50`}
            title="Refresh Preview"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={openInNewTab}
            className={`p-1 rounded transition-colors ${
              theme === "dark" ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-600"
            }`}
            title="Open in New Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 flex justify-center overflow-hidden">
        <div className="flex-shrink-0 h-full" style={{ width: getPreviewWidth() }}>
          {previewContent ? (
            <iframe
              ref={iframeRef}
              srcDoc={previewContent}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              title="Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className={`text-4xl mb-4 ${theme === "dark" ? "text-gray-700" : "text-gray-300"}`}>👁️</div>
                <p className={`${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
                  {activeFile ? "Generating preview..." : "Select a file to preview"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
