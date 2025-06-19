"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Lock, User, Mail, Eye, EyeOff, Shield, Zap, AlertCircle, Truck } from "lucide-react"

export default function AdminLogin() {
  const [loginData, setLoginData] = useState({ username: "", password: "" })
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  })
  const [activeTab, setActiveTab] = useState("login")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  // Check if already authenticated
  useEffect(() => {
    const authStatus = localStorage.getItem("admin_authenticated")
    const userRole = localStorage.getItem("admin_role")
    if (authStatus === "true" && userRole) {
      router.push("/admin")
    }
  }, [router])

  const validateLogin = () => {
    const newErrors: Record<string, string> = {}

    if (!loginData.username.trim()) {
      newErrors.username = "Username is required"
    }

    if (!loginData.password.trim()) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateRegister = () => {
    const newErrors: Record<string, string> = {}

    if (!registerData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (registerData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }

    if (!registerData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!registerData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (registerData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateLogin()) return

    setIsLoading(true)
    setErrors({})

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Demo credentials
      const validCredentials = [
        { username: "admin", password: "admin123", role: "super_admin", name: "Super Admin" },
        { username: "manager", password: "manager123", role: "manager", name: "Operations Manager" },
        { username: "support", password: "support123", role: "support", name: "Support Agent" },
      ]

      const user = validCredentials.find(
        (cred) => cred.username === loginData.username && cred.password === loginData.password,
      )

      if (user) {
        localStorage.setItem("admin_authenticated", "true")
        localStorage.setItem("admin_role", user.role)
        localStorage.setItem("admin_name", user.name)
        localStorage.setItem("admin_username", user.username)
        router.push("/admin")
      } else {
        setErrors({ form: "Invalid credentials. Please try again." })
      }
    } catch (err) {
      setErrors({ form: "Authentication failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateRegister()) return

    setIsLoading(true)
    setErrors({})

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, this would create a new admin user
      localStorage.setItem("admin_authenticated", "true")
      localStorage.setItem("admin_role", registerData.role)
      localStorage.setItem("admin_name", registerData.username)
      localStorage.setItem("admin_username", registerData.username)
      router.push("/admin")
    } catch (err) {
      setErrors({ form: "Registration failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-red-600/10" />

      {/* Login Card */}
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Swift Courier Admin
            </CardTitle>
            <CardDescription className="text-slate-600">Secure access to administrative dashboard</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                {errors.form && (
                  <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {errors.form}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="username"
                      type="text"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      className={`pl-10 ${errors.username ? "border-red-300 focus:border-red-500" : ""}`}
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                  {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className={`pl-10 pr-10 ${errors.password ? "border-red-300 focus:border-red-500" : ""}`}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-6">
              <form onSubmit={handleRegister} className="space-y-4">
                {errors.form && (
                  <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {errors.form}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="reg-username" className="block text-sm font-medium text-slate-700">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="reg-username"
                        type="text"
                        value={registerData.username}
                        onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                        className={`pl-10 ${errors.username ? "border-red-300 focus:border-red-500" : ""}`}
                        placeholder="Username"
                        required
                      />
                    </div>
                    {errors.username && <p className="text-xs text-red-600">{errors.username}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="reg-email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className={`pl-10 ${errors.email ? "border-red-300 focus:border-red-500" : ""}`}
                        placeholder="Email"
                        required
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="reg-password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className={`pl-10 pr-10 ${errors.password ? "border-red-300 focus:border-red-500" : ""}`}
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="reg-confirm-password" className="block text-sm font-medium text-slate-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="reg-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-300 focus:border-red-500" : ""}`}
                      placeholder="Confirm password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Demo Credentials
            </h4>
            <div className="space-y-2 text-xs text-blue-700">
              <div className="flex justify-between items-center">
                <span className="font-medium">Super Admin:</span>
                <Badge variant="secondary" className="text-xs">
                  admin / admin123
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Manager:</span>
                <Badge variant="secondary" className="text-xs">
                  manager / manager123
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Support:</span>
                <Badge variant="secondary" className="text-xs">
                  support / support123
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
