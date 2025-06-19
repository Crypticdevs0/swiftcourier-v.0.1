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
  FileText,
  Search,
  Filter,
  Upload,
  Printer,
  ShoppingCart,
  Home,
  Menu,
  CheckCircle,
  TrendingUp,
  DollarSign,
  ChevronRight,
  MoreVertical,
} from "lucide-react"
import Link from "next/link"
import { generateTrackingNumber, type Package as PackageType } from "@/lib/tracking"

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
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      loadUserPackages(parsedUser.id)
    } else {
      router.push("/login")
    }
  }, [router])

  const loadUserPackages = async (userId: number) => {
    try {
      const mockPackages: PackageType[] = [
        {
          trackingNumber: generateTrackingNumber(),
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
        {
          trackingNumber: generateTrackingNumber(),
          status: "delivered",
          estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          currentLocation: "Delivered - Los Angeles, CA",
          progress: 100,
          recipient: {
            name: "Bob Johnson",
            address: "789 Pine St",
            city: "Los Angeles",
            state: "CA",
            zip: "90210",
          },
          sender: {
            name: user?.name || "John Doe",
            address: "456 Oak Ave",
            city: "New York",
            state: "NY",
            zip: "10001",
          },
          service: "Swift Standard",
          weight: 1.2,
          dimensions: { length: 10, width: 6, height: 3 },
          events: [
            {
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              location: "New York, NY",
              description: "Package picked up",
              status: "picked_up",
            },
            {
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              location: "Los Angeles, CA",
              description: "Package delivered",
              status: "delivered",
            },
          ],
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]

      setPackages(mockPackages)
    } catch (error) {
      console.error("Error loading packages:", error)
    } finally {
      setLoading(false)
    }
  }

  const createNewShipment = () => {
    const newTrackingNumber = generateTrackingNumber()
    router.push(`/shipping/create?tracking=${newTrackingNumber}`)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
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
                  {packages.map((pkg) => (
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
                                <Badge variant={pkg.status === "delivered" ? "default" : "secondary"} className="mb-1">
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Tools Tab - Enhanced */}
          <TabsContent value="business">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Upload className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Bulk Shipments</h3>
                          <p className="text-sm text-gray-600">Upload CSV files</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Process multiple shipments at once with our bulk upload tool.
                      </p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bulk Shipment Manager</DialogTitle>
                    <DialogDescription>Upload a CSV file to create multiple shipments at once.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-2">Drop your CSV file here or click to browse</p>
                      <Button variant="outline">Choose File</Button>
                    </div>
                    <div className="text-xs text-gray-500">
                      <p>
                        Supported format: CSV with columns for recipient name, address, city, state, zip, weight, and
                        service type.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <BarChart3 className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Analytics</h3>
                          <p className="text-sm text-gray-600">Shipping insights</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        View detailed reports and analytics for your shipping activity.
                      </p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Shipping Analytics</DialogTitle>
                    <DialogDescription>
                      Detailed insights into your shipping patterns and performance.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">Total Shipments</p>
                        <p className="text-2xl font-bold text-blue-600">247</p>
                        <p className="text-xs text-blue-600">+12% from last month</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-green-900">On-Time Delivery</p>
                        <p className="text-2xl font-bold text-green-600">94%</p>
                        <p className="text-xs text-green-600">Above average</p>
                      </div>
                    </div>
                    <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Analytics Chart Placeholder</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <FileText className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">SCAN Forms</h3>
                          <p className="text-sm text-gray-600">Batch processing</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Generate SCAN forms for efficient batch processing of shipments.
                      </p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>SCAN Form Generator</DialogTitle>
                    <DialogDescription>Create batch scan sheets for multiple packages.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Select Packages</label>
                      <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                        {packages.map((pkg) => (
                          <div key={pkg.trackingNumber} className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">{pkg.trackingNumber}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full">Generate SCAN Form</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          {/* Other tabs with enhanced mobile design */}
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

          <TabsContent value="billing">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Payment Methods</h3>
                  <p className="text-sm text-gray-600 mb-4">Manage your payment options</p>
                  <Button variant="outline" className="w-full">
                    View Cards
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Invoices</h3>
                  <p className="text-sm text-gray-600 mb-4">Download billing statements</p>
                  <Button variant="outline" className="w-full">
                    View Invoices
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Spending Report</h3>
                  <p className="text-sm text-gray-600 mb-4">Track your expenses</p>
                  <Button variant="outline" className="w-full">
                    View Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Shipping Analytics</CardTitle>
                <CardDescription>Insights into your shipping patterns and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Monthly Shipments</h4>
                    <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                        <p className="text-blue-600 font-medium">Chart Coming Soon</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-4">Delivery Performance</h4>
                    <div className="h-48 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-2" />
                        <p className="text-green-600 font-medium">Performance Metrics</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
