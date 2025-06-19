"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  email: string
  name: string
  firstName: string
  lastName: string
  role: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
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
      return { success: false, message: data.message }
    }
  }

  const register = async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
  }) => {
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
      return { success: false, message: data.message, errors: data.errors }
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
    } catch (error) {
      console.error("Logout error:", error)
    }

    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  const isAuthenticated = !!user
  const isAdmin = user?.role === "admin"

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
  }
}
