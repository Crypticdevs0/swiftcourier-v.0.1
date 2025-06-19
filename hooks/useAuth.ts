"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  role: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        localStorage.setItem("user", JSON.stringify(data.user))
        return { success: true, user: data.user }
      } else {
        return {
          success: false,
          message: data.message,
          errors: data.errors,
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        message: "Network error. Please try again.",
      }
    }
  }

  const register = async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    phone?: string
  }) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        localStorage.setItem("user", JSON.stringify(data.user))
        return { success: true, user: data.user }
      } else {
        return {
          success: false,
          message: data.message,
          errors: data.errors,
        }
      }
    } catch (error) {
      console.error("Registration error:", error)
      return {
        success: false,
        message: "Network error. Please try again.",
      }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")

    // Call logout API to clear server-side session
    fetch("/api/auth/logout", {
      method: "POST",
    }).catch((error) => {
      console.error("Logout API error:", error)
    })
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  }
}
