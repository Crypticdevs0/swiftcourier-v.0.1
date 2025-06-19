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
    timestamp: string
    location: string
    description: string
    status: string
  }>
  createdAt: string
  deliveredAt?: string
  userId?: string
}

interface UserType {
  id: number
  email: string
  name: string
  role: string
  firstName?: string
  lastName?: string
  phone?: string
  company?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [packages, setPackages] = useState<PackageType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
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
      } else {
        throw new Error(data.message || "Failed to load packages")
      }
    } catch (err) {
      console.error("Error loading packages:", err)
      setError(err instanceof Error ? err.message : "Failed to load packages")

      // Fallback to mock data for development
      if (process.env.NODE_ENV === "development") {
        console.log("Using fallback mock data")
        setPackages([
          {
            trackingNumber: "SW" + Math.random().toString(36).substr(2, 9).toUpperCase(),
            status: "in_transit",
            estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            currentLocation: "Distribution Center - Chicago, IL",
            progress: 65,
            recipient: {
              name: "Jane Smith",
              address: "123 Main St",
              city: "Chicago",
              state: "IL",
              zip: "60601",
            },
            sender: {
              name: user?.name || "John Doe",
              address: "456 Oak Ave",
              city: "New York",
              state: "NY",
              zip: "10001",
            },
            service: "Swift Express",
            weight: 2.5,
            dimensions: { length: 12, width: 8, height: 4 },
            events: [
              {
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                location: "New York, NY",
                description: "Package picked up",
                status: "picked_up",
              },
              {
                timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                location: "Chicago, IL",
                description: "Arrived at distribution center",
                status: "in_transit",
              },
            ],
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          },
        ])
      }
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
    savedAddresses: 5,
  }

  const quickActions = [
    { icon: Search, label: "Track Package", href: "/track", color: "bg-blue-500" },
    { icon: Plus, label: "Create Shipment", action: createNewShipment, color: "bg-green-500" },
    { icon: ShoppingCart, label: "Buy Stamps", href: "/store", color: "bg-purple-500" },
    { icon: Calendar, label: "Schedule Pickup", href: "/pickup", color: "bg-orange-500" },
    { icon: Printer, label: "Print Label", href: "/labels", color: "bg-red-500" },
    { icon: MapPin, label: "Hold Delivery", href: "/hold", color: "bg-yellow-500" },
  ]

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
                <h1 className="text-xl font-semibold text-gray-900">Welcome back, {user.firstName || user.name}!</h1>
                <p className="text-sm text-gray-600">Manage your shipments and track packages</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search packages..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
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
                                        : pkg.status === "in_transit"
                                          ? "bg-blue-100"
                                          : "bg-gray-100"
                                    }`}
                                  >
                                    <Package
                                      className={`h-5 w-5 ${
                                        pkg.status === "delivered"
                                          ? "text-green-600"
                                          : pkg.status === "in_transit"
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
                                {pkg.recipient.address}, {pkg.recipient.city}, {pkg.recipient.state} {pkg.recipient.zip}
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

          {/* Other tabs remain the same... */}
          <TabsContent value="swift-preview">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Swift Preview</CardTitle>
                <CardDescription>Digital previews of your incoming mail</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No mail previews available</p>
                  <p className="text-sm text-gray-400 mt-2">Mail previews will appear here when available</p>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business">
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Business tools coming soon</p>
              <p className="text-sm text-gray-400 mt-2">Advanced features for business customers</p>
            </div>
          </TabsContent>

          <TabsContent value="billing">
            <div className="text-center py-12">
              <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Billing information</p>
              <p className="text-sm text-gray-400 mt-2">Manage your payment methods and invoices</p>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Analytics dashboard</p>
              <p className="text-sm text-gray-400 mt-2">Insights into your shipping patterns</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
