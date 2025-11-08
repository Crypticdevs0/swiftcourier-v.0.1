"use client"

import { useState, useEffect, useCallback } from "react"

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

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  const checkAuth = useCallback(async (signal?: AbortSignal) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }))

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
          setAuthState({
            user: data.user,
            loading: false,
            error: null,
          })
        } else {
          setAuthState({
            user: null,
            loading: false,
            error: null,
          })
        }
      } else {
        setAuthState({
          user: null,
          loading: false,
          error: null,
        })
      }
    } catch (error) {
      // Robustly detect AbortError across environments and ignore it
      const err = error as any
      const normalized = ((): string => {
        try {
          if (err == null) return ""
          if (typeof err === "string") return err
          if (typeof err === "object") {
            if ("message" in err && typeof err.message === "string") return err.message
            if ("name" in err && typeof err.name === "string") return err.name
          }
          return String(err)
        } catch {
          return ""
        }
      })().toLowerCase()

      const isAbortError =
        normalized.includes("abort") ||
        normalized.includes("signal is aborted") ||
        err?.type === "aborted"

      if (isAbortError) return

      console.error("Auth check failed:", error)
      setAuthState({
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      })
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }))

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setAuthState({
          user: data.user,
          loading: false,
          error: null,
        })
        return { success: true, user: data.user }
      } else {
        const errorMessage = data.error || "Login failed"
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }))
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Network error"
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      return { success: false, error: errorMessage }
    }
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }))

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setAuthState({
          user: data.user,
          loading: false,
          error: null,
        })
        return { success: true, user: data.user }
      } else {
        const errorMessage = data.error || "Registration failed"
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }))
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Network error"
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      return { success: false, error: errorMessage }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }))

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      setAuthState({
        user: null,
        loading: false,
        error: null,
      })

      return { success: true }
    } catch (error) {
      console.error("Logout failed:", error)
      // Even if logout fails, clear local state
      setAuthState({
        user: null,
        loading: false,
        error: null,
      })
      return { success: true }
    }
  }, [])

  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }))
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    checkAuth(controller.signal)
    return () => controller.abort()
  }, [checkAuth])

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    register,
    logout,
    checkAuth,
    clearError,
    isAuthenticated: !!authState.user,
  }
}
