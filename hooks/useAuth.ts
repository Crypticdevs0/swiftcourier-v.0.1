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

  const checkAuth = useCallback(async (signal?: AbortSignal, isMounted?: { current: boolean }): Promise<boolean> => {
    const updateState = (newState: AuthState) => {
      if (isMounted && !isMounted.current) return
      setAuthState(newState)
    }

    const updateStatePartial = (partial: Partial<AuthState>) => {
      if (isMounted && !isMounted.current) return
      setAuthState((prev) => ({ ...prev, ...partial }))
    }

    // Ensure we indicate loading while we perform the auth check
    updateStatePartial({ loading: true, error: null })

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
          updateState({
            user: data.user,
            loading: false,
            error: null,
          })
          return true
        } else {
          updateState({
            user: null,
            loading: false,
            error: null,
          })
          return false
        }
      } else {
        updateState({
          user: null,
          loading: false,
          error: null,
        })
        return false
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

      if (isAbortError) {
        // Ensure we clear the loading flag when the request is aborted
        updateStatePartial({ loading: false })
        return false
      }

      console.error("Auth check failed:", error)
      updateState({
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      })
      return false
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
        // Server returned a success response; verify session via /api/auth/me
        const maxAttempts = 3
        let verified = false
        for (let i = 0; i < maxAttempts; i++) {
          // small delay to allow cookies to be set by the browser
          await new Promise((r) => setTimeout(r, i === 0 ? 200 : 500))
          verified = await checkAuth()
          if (verified) break
        }

        if (verified) {
          // checkAuth already set user state
          return { success: true, user: data.user }
        }

        const errorMessage =
          "Authentication verification failed: no auth token received. Please ensure cookies are enabled and try again."
        setAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }))
        return { success: false, error: errorMessage }
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
  }, [checkAuth])

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
        // verify session via /api/auth/me
        const maxAttempts = 3
        let verified = false
        for (let i = 0; i < maxAttempts; i++) {
          await new Promise((r) => setTimeout(r, i === 0 ? 200 : 500))
          verified = await checkAuth()
          if (verified) break
        }

        if (verified) {
          return { success: true, user: data.user }
        }

        const errorMessage =
          "Authentication verification failed: no auth token received. Please ensure cookies are enabled and try again."
        setAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }))
        return { success: false, error: errorMessage }
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
  }, [checkAuth])

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
    let isMounted = true

    void (async () => {
      try {
        await checkAuth(controller.signal)
      } catch (err) {
        if (!isMounted) return

        const e = err as any
        const msg = e && (e.message || e.name) ? String(e.message || e.name).toLowerCase() : ""
        if (
          msg.includes("abort") ||
          msg.includes("signal is aborted") ||
          e?.type === "aborted" ||
          (err instanceof Error && err.name === "AbortError")
        ) {
          return
        }
        console.error("Unhandled error in checkAuth:", err)
      }
    })()

    return () => {
      isMounted = false
      controller.abort()
    }
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
