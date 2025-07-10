"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => void
  register: (name: string, email: string, password: string) => void
  logout: () => void
  showAuthModal: boolean
  setShowAuthModal: (show: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      setShowAuthModal(true)
    }
  }, [])

  const login = (email: string, password: string) => {
    // Simulate login
    const newUser = {
      id: "1",
      name: email.split("@")[0],
      email,
    }
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    setShowAuthModal(false)
  }

  const register = (name: string, email: string, password: string) => {
    // Simulate registration
    const newUser = {
      id: "1",
      name,
      email,
    }
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    setShowAuthModal(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    setShowAuthModal(true)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        showAuthModal,
        setShowAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
