"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  role?: string
  userType: "new" | "demo" | "existing"
  createdAt: string
  lastLogin?: string
  preferences?: {
    notifications: boolean
    theme: "light" | "dark"
    language: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string; user?: User }>
  logout: () => Promise<{ success: boolean }>
  checkAuth: (signal?: AbortSignal) => Promise<boolean>
  clearError: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkAuth = useCallback(async (signal?: AbortSignal): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        signal,
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          setUser(data.user)
          return true
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      const err = error as any
      if (err.name !== 'AbortError') {
        setError(err.message || "Authentication check failed")
      }
    } finally {
      setLoading(false)
    }
    return false
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    checkAuth(controller.signal)
    return () => {
      controller.abort()
    }
  }, [checkAuth])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (data.success) {
        setUser(data.user)
        return { success: true, user: data.user }
      }
      setError(data.error || "Login failed")
      return { success: false, error: data.error }
    } catch (err: any) {
      setError(err.message || "An error occurred")
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, name }),
      })
      const data = await response.json()
      if (data.success) {
        setUser(data.user)
        return { success: true, user: data.user }
      }
      setError(data.error || "Registration failed")
      return { success: false, error: data.error }
    } catch (err: any) {
      setError(err.message || "An error occurred")
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      setUser(null)
      return { success: true }
    } catch (err: any) {
      setError(err.message || "Logout failed")
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const isAuthenticated = !!user

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
    clearError,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}
