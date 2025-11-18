"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, Mail, Eye, EyeOff, Truck, AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

export default function AdminLogin() {
  const router = useRouter()
  const { user, loading, login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showDemo, setShowDemo] = useState(true)

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsLoading(true)

    try {
      const newErrors: Record<string, string> = {}

      if (!email.trim()) {
        newErrors.email = "Email is required"
      } else if (!email.includes("@")) {
        newErrors.email = "Invalid email format"
      }

      if (!password.trim()) {
        newErrors.password = "Password is required"
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters"
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        setIsLoading(false)
        return
      }

      const result = await login(email, password)

      if (result.success) {
        toast.success("Login successful!")
      } else {
        setErrors({ general: result.error || "Login failed. Please try again." })
        toast.error(result.error || "Login failed")
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "An unexpected error occurred"
      setErrors({ general: errorMsg })
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUseDemoCredentials = () => {
    setEmail("admin@swiftcourier.com")
    setPassword("admin123")
    setErrors({})
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
              <Truck className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Swift Courier
          </h1>
          <p className="text-slate-600 mt-2">Admin Portal</p>
        </div>

        {/* Main Card */}
        <Card className="border-slate-200 shadow-xl mb-6">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Sign in to access the operations dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* General Error */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="admin@swiftcourier.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) {
                        setErrors({ ...errors, email: "" })
                      }
                    }}
                    className={`pl-10 border-slate-200 transition-colors ${
                      errors.email ? "border-red-500 focus:border-red-500" : ""
                    }`}
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
                {errors.email && <p className="text-xs text-red-600 font-medium">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) {
                        setErrors({ ...errors, password: "" })
                      }
                    }}
                    className={`pl-10 pr-10 border-slate-200 transition-colors ${
                      errors.password ? "border-red-500 focus:border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-600 font-medium">{errors.password}</p>}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 text-base transition-all duration-200 h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-500 font-medium">OR</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Demo Credentials */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-slate-200 hover:bg-slate-50 transition-colors"
              onClick={handleUseDemoCredentials}
              disabled={isLoading}
            >
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              Use Demo Credentials
            </Button>
          </CardContent>
        </Card>

        {/* Demo Info Box */}
        {showDemo && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                Demo Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <p className="text-slate-700 font-medium">Test Admin Account:</p>
                <div className="bg-white rounded-lg p-3 border border-blue-200 font-mono text-xs space-y-1">
                  <p>
                    <span className="text-slate-600">Email:</span>{" "}
                    <span className="text-blue-700 font-semibold">admin@swiftcourier.com</span>
                  </p>
                  <p>
                    <span className="text-slate-600">Password:</span>{" "}
                    <span className="text-blue-700 font-semibold">admin123</span>
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Use these credentials to explore the unified tracking dashboard. No setup required!
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs h-8"
                onClick={() => setShowDemo(false)}
              >
                Dismiss
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 text-center text-xs">
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <p className="font-semibold text-slate-900">Real-Time</p>
            <p className="text-slate-600">Live Updates</p>
          </div>
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <p className="font-semibold text-slate-900">Secure</p>
            <p className="text-slate-600">Encrypted</p>
          </div>
          <div className="p-2 rounded-lg bg-white border border-slate-200 col-span-2 sm:col-span-1">
            <p className="font-semibold text-slate-900">Unified</p>
            <p className="text-slate-600">Full Control</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Swift Courier Admin Portal &copy; 2024. All rights reserved.
        </p>
      </div>
    </div>
  )
}
