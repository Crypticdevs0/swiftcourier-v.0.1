"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Package,
  Mail,
  MapPin,
  Plus,
  Eye,
  Download,
  Calendar,
  Bell,
  Settings,
  User,
  CreditCard,
  BarChart3,
  Search,
  Filter,
  Printer,
  ShoppingCart,
  Home,
  Menu,
  CheckCircle,
  TrendingUp,
  ChevronRight,
  MoreVertical,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Gift,
  Star,
} from "lucide-react"
import Link from "next/link"

interface PackageType {
  trackingNumber: string
  status: string
  estimatedDelivery: string
  currentLocation: string
  progress: number
  recipient: {
    name: string
    address: string
    city: string
    state: string
    zip: string
  }
  sender: {
    name: string
    address: string
    city: string
    state: string
    zip: string
  }
  service: string
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  events: Array<{
    id: string
    timestamp: string
    location: string
    description: string
    status: string
  }>
  createdAt: string
  deliveredAt?: string
  userId?: string
  cost?: number
}

interface UserType {
  id: string
  email: string
  name: string
  role: string
  firstName?: string
  lastName?: string
  phone?: string
  company?: string
  userType: "new" | "demo" | "existing"
  createdAt: string
  lastLogin?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [packages, setPackages] = useState<PackageType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userType, setUserType] = useState<"new" | "demo" | "existing">("new")
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setUserType(parsedUser.userType || "new")
        loadUserPackages()
      } catch (err) {
        console.error("Error parsing user data:", err)
        router.push("/login")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const loadUserPackages = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/packages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setPackages(data.packages || [])
        setUserType(data.userType || "new")
      } else {
        throw new Error(data.message || "Failed to load packages")
      }
    } catch (err) {
      console.error("Error loading packages:", err)
      setError(err instanceof Error ? err.message : "Failed to load packages")
    } finally {
      setLoading(false)
    }
  }

  const createNewShipment = () => {
    router.push("/shipping/create")
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const retryLoadPackages = () => {
    loadUserPackages()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const stats = {
    activeShipments: packages.filter((p) => ["pending", "in_transit", "out_for_delivery"].includes(p.status)).length,
    thisMonth: packages.length,
    delivered: packages.filter((p) => p.status === "delivered").length,
    savedAddresses: userType === "new" ? 0 : 5,
  }

  const quickActions = [
    { icon: Search, label: "Track Package", href: "/track", color: "bg-blue-500" },
    { icon: Plus, label: "Create Shipment", action: createNewShipment, color: "bg-green-500" },
    { icon: ShoppingCart, label: "Buy Stamps", href: "/store", color: "bg-purple-500" },
    { icon: Calendar, label: "Schedule Pickup", href: "/pickup", color: "bg-orange-500" },
    { icon: Printer, label: "Print Label", href: "/labels", color: "bg-red-500" },
    { icon: MapPin, label: "Hold Delivery", href: "/hold", color: "bg-yellow-500" },
  ]

  // New User Welcome Component
  const NewUserWelcome = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <CardContent className="p-8 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Welcome to Swift Courier!</h2>
              </div>
              <p className="text-blue-100 mb-6 max-w-2xl">
                🎉 Your account has been created successfully! You're now ready to ship packages worldwide with our
                fast, reliable, and secure courier service.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={createNewShipment} className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Shipment
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  <Gift className="mr-2 h-4 w-4" />
                  Explore Features
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <Package className="h-24 w-24 text-white/30" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Guide */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>Getting Started</span>
          </CardTitle>
          <CardDescription>Follow these simple steps to start shipping with Swift Courier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">1. Create Shipment</h3>
              <p className="text-sm text-gray-600 mb-4">
                Start by creating your first shipment with our easy-to-use form
              </p>
              <Button size="sm" onClick={createNewShipment} className="w-full">
                Get Started
              </Button>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">2. Track Packages</h3>
              <p className="text-sm text-gray-600 mb-4">Monitor your shipments in real-time with our tracking system</p>
              <Button size="sm" variant="outline" className="w-full" asChild>
                <Link href="/track">Try Tracking</Link>
              </Button>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">3. Customize Settings</h3>
              <p className="text-sm text-gray-600 mb-4">Set up your preferences and saved addresses</p>
              <Button size="sm" variant="outline" className="w-full">
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>What You Can Do</CardTitle>
          <CardDescription>Explore all the features available to you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Package, title: "Ship Packages", desc: "Send packages worldwide" },
              { icon: Search, title: "Track Shipments", desc: "Real-time tracking" },
              { icon: Calendar, title: "Schedule Pickup", desc: "Convenient pickup times" },
              { icon: BarChart3, title: "View Analytics", desc: "Shipping insights" },
            ].map((feature, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <feature.icon className="h-8 w-8 text-blue-600 mb-3" />
                <h4 className="font-medium mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Demo User Badge
  const DemoUserBadge = () => (
    <div className="mb-6">
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Star className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-orange-900">Demo Account</h3>
              <p className="text-sm text-orange-700">
                You're viewing sample data. Create a real account to start shipping!
              </p>
            </div>
            <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
              Upgrade Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-blue-600">Swift</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {userType === "demo" && (
              <Badge variant="outline" className="text-orange-600 border-orange-300">
                Demo
              </Badge>
            )}
            {userType === "new" && (
              <Badge variant="outline" className="text-green-600 border-green-300">
                New
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <Badge variant="secondary" className="w-fit text-xs">
                      {userType.charAt(0).toUpperCase() + userType.slice(1)} User
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">Swift Courier</span>
              </div>
              <div className="hidden md:block w-px h-6 bg-gray-300"></div>
              <div className="hidden md:block">
                <div className="flex items-center space-x-3">
                  <h1 className="text-xl font-semibold text-gray-900">Welcome back, {user.firstName || user.name}!</h1>
                  {userType === "new" && (
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      <Sparkles className="h-3 w-3 mr-1" />
                      New User
                    </Badge>
                  )}
                  {userType === "demo" && (
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                      <Star className="h-3 w-3 mr-1" />
                      Demo Account
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {userType === "new"
                    ? "Start your shipping journey with Swift Courier"
                    : "Manage your shipments and track packages"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search packages..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {userType !== "new" && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-2">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden md:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <Badge variant="secondary" className="w-fit text-xs">
                        {userType.charAt(0).toUpperCase() + userType.slice(1)} User
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-6 max-w-7xl">
        {/* Demo User Badge */}
        {userType === "demo" && <DemoUserBadge />}

        {/* Error Banner */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Error loading packages</p>
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retryLoadPackages}
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* New User Welcome or Regular Dashboard */}
        {userType === "new" ? (
          <NewUserWelcome />
        ) : (
          <>
            {/* Quick Actions - Mobile Optimized */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
                {quickActions.map((action, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-0 shadow-md"
                    onClick={action.action || (() => action.href && router.push(action.href))}
                  >
                    <CardContent className="p-4 text-center">
                      <div
                        className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}
                      >
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 leading-tight">{action.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Stats Overview - Enhanced Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              <Card className="border-0 shadow-md bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Active</p>
                      <p className="text-2xl lg:text-3xl font-bold">{stats.activeShipments}</p>
                      <p className="text-blue-100 text-xs">Shipments</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <Package className="h-6 w-6 lg:h-8 lg:w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">This Month</p>
                      <p className="text-2xl lg:text-3xl font-bold">{stats.thisMonth}</p>
                      <p className="text-green-100 text-xs">Total</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Delivered</p>
                      <p className="text-2xl lg:text-3xl font-bold">{stats.delivered}</p>
                      <p className="text-purple-100 text-xs">Packages</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Addresses</p>
                      <p className="text-2xl lg:text-3xl font-bold">{stats.savedAddresses}</p>
                      <p className="text-orange-100 text-xs">Saved</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <Home className="h-6 w-6 lg:h-8 lg:w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Mobile Optimized Tabs */}
            <Tabs defaultValue="packages" className="space-y-6">
              <div className="overflow-x-auto">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 min-w-max lg:min-w-0">
                  <TabsTrigger value="packages" className="text-xs lg:text-sm">
                    Packages
                  </TabsTrigger>
                  <TabsTrigger value="swift-preview" className="text-xs lg:text-sm">
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="addresses" className="text-xs lg:text-sm">
                    Addresses
                  </TabsTrigger>
                  <TabsTrigger value="business" className="text-xs lg:text-sm">
                    Business
                  </TabsTrigger>
                  <TabsTrigger value="billing" className="text-xs lg:text-sm">
                    Billing
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="text-xs lg:text-sm">
                    Analytics
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Packages Tab - Enhanced Mobile Layout */}
              <TabsContent value="packages">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div>
                        <CardTitle className="text-xl">My Packages</CardTitle>
                        <CardDescription>Track and manage your shipments</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                        <Button onClick={createNewShipment} className="flex-1 sm:flex-none">
                          <Plus className="mr-2 h-4 w-4" />
                          New
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-4 p-6 pt-0">
                      {packages.length === 0 ? (
                        <div className="text-center py-12">
                          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 font-medium">No packages found</p>
                          <p className="text-sm text-gray-400 mt-2">Create your first shipment to get started</p>
                          <Button onClick={createNewShipment} className="mt-4">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Shipment
                          </Button>
                        </div>
                      ) : (
                        packages.map((pkg) => (
                          <Dialog key={pkg.trackingNumber}>
                            <DialogTrigger asChild>
                              <Card className="cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-200">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start space-x-3">
                                      <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                          pkg.status === "delivered"
                                            ? "bg-green-100"
                                            : pkg.status === "in_transit" || pkg.status === "out_for_delivery"
                                              ? "bg-blue-100"
                                              : "bg-gray-100"
                                        }`}
                                      >
                                        <Package
                                          className={`h-5 w-5 ${
                                            pkg.status === "delivered"
                                              ? "text-green-600"
                                              : pkg.status === "in_transit" || pkg.status === "out_for_delivery"
                                                ? "text-blue-600"
                                                : "text-gray-600"
                                          }`}
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{pkg.trackingNumber}</p>
                                        <p className="text-sm text-gray-600 truncate">To: {pkg.recipient.name}</p>
                                        <p className="text-sm text-gray-500 truncate">
                                          {pkg.recipient.city}, {pkg.recipient.state}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                      <Badge
                                        variant={pkg.status === "delivered" ? "default" : "secondary"}
                                        className="mb-1"
                                      >
                                        {pkg.status.replace("_", " ").toUpperCase()}
                                      </Badge>
                                      <p className="text-xs text-gray-500">
                                        {new Date(pkg.estimatedDelivery).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">Progress</span>
                                      <span className="font-medium">{pkg.progress}%</span>
                                    </div>
                                    <Progress value={pkg.progress} className="h-2" />
                                  </div>

                                  <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                                      <span className="truncate">{pkg.currentLocation}</span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                  </div>
                                </CardContent>
                              </Card>
                            </DialogTrigger>
                            <DialogContent className="max-w-md mx-4">
                              <DialogHeader>
                                <DialogTitle className="flex items-center space-x-2">
                                  <Package className="h-5 w-5 text-blue-600" />
                                  <span>Package Details</span>
                                </DialogTitle>
                                <DialogDescription>Tracking: {pkg.trackingNumber}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Status</p>
                                    <Badge variant={pkg.status === "delivered" ? "default" : "secondary"}>
                                      {pkg.status.replace("_", " ").toUpperCase()}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Service</p>
                                    <p className="text-sm text-gray-600">{pkg.service}</p>
                                  </div>
                                </div>

                                <div>
                                  <p className="text-sm font-medium text-gray-900 mb-2">Delivery Progress</p>
                                  <Progress value={pkg.progress} className="h-3" />
                                  <p className="text-xs text-gray-500 mt-1">{pkg.progress}% Complete</p>
                                </div>

                                <div>
                                  <p className="text-sm font-medium text-gray-900">Current Location</p>
                                  <p className="text-sm text-gray-600">{pkg.currentLocation}</p>
                                </div>

                                <div>
                                  <p className="text-sm font-medium text-gray-900">Recipient</p>
                                  <p className="text-sm text-gray-600">{pkg.recipient.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {pkg.recipient.address}, {pkg.recipient.city}, {pkg.recipient.state}{" "}
                                    {pkg.recipient.zip}
                                  </p>
                                </div>

                                <div className="flex space-x-2 pt-4">
                                  <Link href={`/track?number=${pkg.trackingNumber}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full">
                                      <Eye className="h-4 w-4 mr-2" />
                                      Track
                                    </Button>
                                  </Link>
                                  <Button variant="outline" size="sm" className="flex-1">
                                    <Download className="h-4 w-4 mr-2" />
                                    Receipt
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Other tabs remain the same but with user type awareness */}
              <TabsContent value="swift-preview">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Swift Preview</CardTitle>
                    <CardDescription>Digital previews of your incoming mail</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">
                        {userType === "new" ? "No mail previews yet" : "No mail previews available"}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        {userType === "new"
                          ? "Mail previews will appear here once you start receiving mail"
                          : "Mail previews will appear here when available"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Saved Addresses</CardTitle>
                        <CardDescription>Manage your frequently used addresses</CardDescription>
                      </div>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Address
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {userType === "new" ? (
                      <div className="text-center py-12">
                        <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No saved addresses yet</p>
                        <p className="text-sm text-gray-400 mt-2">Add your first address to get started</p>
                        <Button className="mt-4">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Address
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Card className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                  <Home className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">Home</p>
                                  <p className="text-sm text-gray-600">123 Main Street</p>
                                  <p className="text-sm text-gray-600">New York, NY 10001</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">Default</Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="business">
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">
                    {userType === "new" ? "Business tools await" : "Business tools coming soon"}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {userType === "new"
                      ? "Upgrade to a business account to access advanced features"
                      : "Advanced features for business customers"}
                  </p>
                  {userType === "new" && (
                    <Button className="mt-4" variant="outline">
                      Learn More
                    </Button>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="billing">
                <div className="text-center py-12">
                  <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">
                    {userType === "new" ? "No billing history yet" : "Billing information"}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {userType === "new"
                      ? "Your billing information will appear here after your first shipment"
                      : "Manage your payment methods and invoices"}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="analytics">
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">
                    {userType === "new" ? "Analytics coming soon" : "Analytics dashboard"}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {userType === "new"
                      ? "Start shipping to see insights into your shipping patterns"
                      : "Insights into your shipping patterns"}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}
