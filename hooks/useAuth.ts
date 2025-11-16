"use client"

import { useState, useEffect, useCallback, useRef } from "react"

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

  const isMountedRef = useRef(true)
  const initializeRef = useRef(false)

  const safeSetAuthState = useCallback((newState: AuthState | ((prev: AuthState) => AuthState)) => {
    if (!isMountedRef.current) return
    setAuthState(newState)
  }, [])

  const checkAuth = useCallback(async (signal?: AbortSignal): Promise<{ success: boolean; user?: User; error?: string }> => {
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
          return { success: true, user: data.user }
        } else {
          return { success: false }
        }
      } else {
        return { success: false }
      }
    } catch (error) {
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

      if (isAbortError) {
        return { success: false }
      }

      console.error("Auth check failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      }
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      safeSetAuthState((prev) => ({ ...prev, loading: true, error: null }))

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
        // Server returned a success response; verify session via /api/auth/me
        const maxAttempts = 3
        let verified = false
        for (let i = 0; i < maxAttempts; i++) {
          // small delay to allow cookies to be set by the browser
          await new Promise((r) => setTimeout(r, i === 0 ? 200 : 500))
          const result = await checkAuth()
          if (result.success) {
            verified = true
            safeSetAuthState({
              user: result.user,
              loading: false,
              error: null,
            })
            break
          }
        }

        if (verified) {
          return { success: true, user: data.user }
        }

        const errorMessage =
          "Authentication verification failed: no auth token received. Please ensure cookies are enabled and try again."
        safeSetAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }))
        return { success: false, error: errorMessage }
      } else {
        const errorMessage = data.error || "Login failed"
        safeSetAuthState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }))
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Network error"
      safeSetAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      return { success: false, error: errorMessage }
    }
  }, [checkAuth, safeSetAuthState])

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      safeSetAuthState((prev) => ({ ...prev, loading: true, error: null }))

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
        // verify session via /api/auth/me
        const maxAttempts = 3
        let verified = false
        for (let i = 0; i < maxAttempts; i++) {
          await new Promise((r) => setTimeout(r, i === 0 ? 200 : 500))
          const result = await checkAuth()
          if (result.success) {
            verified = true
            safeSetAuthState({
              user: result.user,
              loading: false,
              error: null,
            })
            break
          }
        }

        if (verified) {
          return { success: true, user: data.user }
        }

        const errorMessage =
          "Authentication verification failed: no auth token received. Please ensure cookies are enabled and try again."
        safeSetAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }))
        return { success: false, error: errorMessage }
      } else {
        const errorMessage = data.error || "Registration failed"
        safeSetAuthState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }))
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Network error"
      safeSetAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      return { success: false, error: errorMessage }
    }
  }, [checkAuth, safeSetAuthState])

  const logout = useCallback(async () => {
    try {
      safeSetAuthState((prev) => ({ ...prev, loading: true, error: null }))

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      safeSetAuthState({
        user: null,
        loading: false,
        error: null,
      })

      return { success: true }
    } catch (error) {
      console.error("Logout failed:", error)
      // Even if logout fails, clear local state
      safeSetAuthState({
        user: null,
        loading: false,
        error: null,
      })
      return { success: true }
    }
  }, [safeSetAuthState])

  const clearError = useCallback(() => {
    safeSetAuthState((prev) => ({ ...prev, error: null }))
  }, [safeSetAuthState])

  useEffect(() => {
    if (initializeRef.current) return

    isMountedRef.current = true
    initializeRef.current = true
    const controller = new AbortController()

    const initAuth = async () => {
      try {
        const result = await checkAuth(controller.signal)

        if (!isMountedRef.current) return

        if (result.success && result.user) {
          safeSetAuthState({
            user: result.user,
            loading: false,
            error: null,
          })
        } else if (result.error) {
          safeSetAuthState({
            user: null,
            loading: false,
            error: result.error,
          })
        } else {
          safeSetAuthState({
            user: null,
            loading: false,
            error: null,
          })
        }
      } catch (err) {
        if (isMountedRef.current) {
          console.error("Auth initialization error:", err)
        }
      }
    }

    initAuth()

    return () => {
      isMountedRef.current = false
      controller.abort()
    }
  }, [])

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
