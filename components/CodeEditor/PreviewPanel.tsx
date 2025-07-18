"use client"

import React, { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { Send, SendIcon } from "lucide-react"

interface PreviewPanelProps {
  width: number
  height: number | string
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ width, height }) => {
  const { theme } = useTheme()
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "ai" }[]>([])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { text: input, sender: "user" }, { text: "This is a simulated AI response.", sender: "ai" }])
    setInput("")
  }

  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-100"
  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-800"
  const inputBg = theme === "dark" ? "bg-gray-800" : "bg-white"
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300"

  return (
    <div
      className={`flex flex-col gap-2 p-2 ${bgColor} ${textColor} border-l ${borderColor}`}
      style={{ width, height }}
    >
      {/* Header  */}
      <div className="w-full h-10 border-b border-gray-600 flex items-center justify-center">
        Chat with AI
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col space-y-2 pr-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-[80%] ${msg.sender === "user" ? "bg-blue-600 text-white self-end" : "bg-gray-700 text-white self-start"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className={`flex mt-2 pt-2`}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className={`flex-1 px-3 py-2 rounded-l-md focus:outline-none ${inputBg} ${textColor} border ${borderColor}`}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700"
        >
          <SendIcon/>
        </button>
      </div>
    </div>
  )
}

export default PreviewPanel
