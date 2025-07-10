"use client"

import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { X, Palette, Code, User, Shield } from "lucide-react"

interface SettingsPanelProps {
  onClose: () => void
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("appearance")
  const [settings, setSettings] = useState({
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    lineNumbers: true,
    minimap: false,
    autoSave: true,
    theme: theme,
  })

  const tabs = [
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "editor", label: "Editor", icon: Code },
    { id: "account", label: "Account", icon: User },
    { id: "security", label: "Security", icon: Shield },
  ]

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    if (key === "theme") {
      toggleTheme()
    }
  }

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Theme</label>
        <div className="flex space-x-2">
          <button
            onClick={() => updateSetting("theme", "light")}
            className={`px-4 py-2 rounded-md border transition-colors ${
              theme === "light"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : theme === "dark"
                  ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Light
          </button>
          <button
            onClick={() => updateSetting("theme", "dark")}
            className={`px-4 py-2 rounded-md border transition-colors ${
              theme === "dark"
                ? "border-blue-500 bg-blue-900 text-blue-300"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Dark
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Font Size</label>
        <input
          type="range"
          min="10"
          max="24"
          value={settings.fontSize}
          onChange={(e) => updateSetting("fontSize", Number.parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>10px</span>
          <span>{settings.fontSize}px</span>
          <span>24px</span>
        </div>
      </div>
    </div>
  )

  const renderEditorSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Tab Size</label>
        <select
          value={settings.tabSize}
          onChange={(e) => updateSetting("tabSize", Number.parseInt(e.target.value))}
          className={`w-full px-3 py-2 rounded-md border ${
            theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
          <option value={8}>8 spaces</option>
        </select>
      </div>

      <div className="space-y-4">
        {[
          { key: "wordWrap", label: "Word Wrap" },
          { key: "lineNumbers", label: "Line Numbers" },
          { key: "minimap", label: "Minimap" },
          { key: "autoSave", label: "Auto Save" },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm font-medium">{label}</span>
            <button
              onClick={() => updateSetting(key, !settings[key as keyof typeof settings])}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings[key as keyof typeof settings]
                  ? "bg-blue-600"
                  : theme === "dark"
                    ? "bg-gray-600"
                    : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings[key as keyof typeof settings] ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Display Name</label>
        <input
          type="text"
          defaultValue="John Doe"
          className={`w-full px-3 py-2 rounded-md border ${
            theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          defaultValue="john@example.com"
          className={`w-full px-3 py-2 rounded-md border ${
            theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Password</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Change Password
        </button>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
        <p className={`text-sm mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Add an extra layer of security to your account
        </p>
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
          Enable 2FA
        </button>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "appearance":
        return renderAppearanceSettings()
      case "editor":
        return renderEditorSettings()
      case "account":
        return renderAccountSettings()
      case "security":
        return renderSecuritySettings()
      default:
        return renderAppearanceSettings()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`w-full max-w-4xl h-3/4 rounded-lg shadow-xl flex ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
      >
        {/* Sidebar */}
        <div
          className={`w-64 border-r ${theme === "dark" ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}
        >
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>
          <nav className="p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                    activeTab === tab.id
                      ? theme === "dark"
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-900"
                      : theme === "dark"
                        ? "text-gray-300 hover:bg-gray-800"
                        : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div
            className={`flex items-center justify-between p-4 border-b ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h3 className="text-lg font-medium">{tabs.find((tab) => tab.id === activeTab)?.label}</h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-md transition-colors ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">{renderTabContent()}</div>

          <div
            className={`flex justify-end space-x-3 p-4 border-t ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-md transition-colors ${
                theme === "dark"
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
