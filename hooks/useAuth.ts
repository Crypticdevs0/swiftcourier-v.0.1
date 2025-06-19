"use client"

import { useState, useEffect, useCallback } from "react"

interface User {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  role: "user" | "business" | "admin"
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

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = useCallback(async () => {
    try {
      // First check localStorage for user data
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const user = JSON.parse(storedUser)
        setAuthState({ user, loading: false, error: null })
        return
      }

      // If no stored user, check with server
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      })

      if (response.ok) {
        const userData = await response.json()
        if (userData.success && userData.user) {
          localStorage.setItem("user", JSON.stringify(userData.user))
          setAuthState({ user: userData.user, loading: false, error: null })
        } else {
          setAuthState({ user: null, loading: false, error: null })
        }
      } else {
        setAuthState({ user: null, loading: false, error: null })
      }
    } catch (error) {
      console.error("Auth check error:", error)
      setAuthState({ user: null, loading: false, error: null })
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

      if (data.success && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
        setAuthState({ user: data.user, loading: false, error: null })
        return { success: true, user: data.user }
      } else {
        setAuthState((prev) => ({ ...prev, loading: false, error: data.message }))
        return { success: false, message: data.message, errors: data.errors }
      }
    } catch (error) {
      const errorMessage = "Network error. Please try again."
      setAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }))
      return { success: false, message: errorMessage }
    }
  }, [])

  const register = useCallback(
    async (userData: {
      firstName: string
      lastName: string
      email: string
      password: string
      confirmPassword: string
      phone?: string
    }) => {
      try {
        setAuthState((prev) => ({ ...prev, loading: true, error: null }))

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(userData),
        })

        const data = await response.json()

        if (data.success && data.user) {
          localStorage.setItem("user", JSON.stringify(data.user))
          setAuthState({ user: data.user, loading: false, error: null })
          return { success: true, user: data.user }
        } else {
          setAuthState((prev) => ({ ...prev, loading: false, error: data.message }))
          return { success: false, message: data.message, errors: data.errors }
        }
      } catch (error) {
        const errorMessage = "Network error. Please try again."
        setAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }))
        return { success: false, message: errorMessage }
      }
    },
    [],
  )

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout API error:", error)
    } finally {
      localStorage.removeItem("user")
      setAuthState({ user: null, loading: false, error: null })
    }
  }, [])

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    register,
    logout,
    checkAuth: checkAuthStatus,
    isAuthenticated: !!authState.user,
    isAdmin: authState.user?.role === "admin",
    isBusiness: authState.user?.role === "business",
  }
}
