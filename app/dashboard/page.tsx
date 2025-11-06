"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import {
  Package,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Bell,
  BarChart3,
  DollarSign,
  Activity,
  Zap,
  Gift,
  Star,
  ArrowRight,
  RefreshCw,
} from "lucide-react"

interface PackageData {
  id: string
  trackingNumber: string
  status: "pending" | "in-transit" | "delivered" | "exception"
  recipient: string
  destination: string
  estimatedDelivery: string
  cost: number
  service: string
}

interface DashboardStats {
  totalPackages: number
  inTransit: number
  delivered: number
  pending: number
  totalSpent: number
  avgDeliveryTime: string
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [packages, setPackages] = useState<PackageData[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalPackages: 0,
    inTransit: 0,
    delivered: 0,
    pending: 0,
    totalSpent: 0,
    avgDeliveryTime: "2-3 days",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
      return
    }
  }, [user, authLoading, router])

  // Fetch packages data
  const fetchPackages = async (showRefreshing = false, signal?: AbortSignal) => {
    if (!user) return

    try {
      if (showRefreshing) setRefreshing(true)
      else setLoading(true)

      setError(null)

      const response = await fetch("/api/packages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        signal,
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch packages: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && Array.isArray(data.packages)) {
        setPackages(data.packages)

        // Calculate stats
        const totalPackages = data.packages.length
        const inTransit = data.packages.filter((pkg: PackageData) => pkg.status === "in-transit").length
        const delivered = data.packages.filter((pkg: PackageData) => pkg.status === "delivered").length
        const pending = data.packages.filter((pkg: PackageData) => pkg.status === "pending").length
        const totalSpent = data.packages.reduce((sum: number, pkg: PackageData) => sum + pkg.cost, 0)

        setStats({
          totalPackages,
          inTransit,
          delivered,
          pending,
          totalSpent,
          avgDeliveryTime: "2-3 days",
        })
      } else {
        setPackages([])
        setStats({
          totalPackages: 0,
          inTransit: 0,
          delivered: 0,
          pending: 0,
          totalSpent: 0,
          avgDeliveryTime: "2-3 days",
        })
      }
    } catch (err) {
      console.error("Error fetching packages:", err)
      setError(err instanceof Error ? err.message : "Failed to load packages")
      setPackages([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (user) {
      const controller = new AbortController()
      fetchPackages(false, controller.signal)
      return () => controller.abort()
    }
  }, [user])

  // Auto-refresh every 30 seconds for real-time updates
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      fetchPackages(true)
    }, 30000)

    return () => clearInterval(interval)
  }, [user])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "in-transit":
        return <Truck className="h-4 w-4 text-blue-500" />
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "exception":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "in-transit":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "exception":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  // New User Welcome Dashboard
  if (user.userType === "new" && packages.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Welcome to Swift Courier, {user.name}! 🎉
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              You're all set up! Let's get you started with your first shipment and explore all the amazing features we
              have to offer.
            </p>
          </div>

          {/* Getting Started Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors cursor-pointer group">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3 group-hover:bg-blue-200 transition-colors">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Create Your First Shipment</CardTitle>
                <CardDescription>Send your first package with our easy-to-use shipping form</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => router.push("/shipping/create")}>
                  Start Shipping <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer group">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3 group-hover:bg-green-200 transition-colors">
                  <Search className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Track Any Package</CardTitle>
                <CardDescription>Track packages from any carrier with our universal tracking system</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full border-green-200 text-green-700 hover:bg-green-50"
                  onClick={() => router.push("/track")}
                >
                  Start Tracking <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 hover:border-purple-300 transition-colors cursor-pointer group">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3 group-hover:bg-purple-200 transition-colors">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Explore Features</CardTitle>
                <CardDescription>Discover business tools, international shipping, and more</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                  onClick={() => router.push("/business")}
                >
                  Explore Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats for New Users */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Why Choose Swift Courier?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">99.9%</div>
                  <div className="text-sm text-gray-600">On-Time Delivery</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">24/7</div>
                  <div className="text-sm text-gray-600">Customer Support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">200+</div>
                  <div className="text-sm text-gray-600">Countries Served</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help Getting Started?</CardTitle>
              <CardDescription>Our support team is here to help you every step of the way</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="flex-1">
                  <Bell className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
                <Button variant="outline" className="flex-1">
                  <Activity className="mr-2 h-4 w-4" />
                  View Tutorial
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Main Dashboard for Demo and Existing Users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              Dashboard
              {user.userType === "demo" && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                  Demo Mode
                </Badge>
              )}
            </h1>
            <p className="text-gray-600 mt-1">Welcome back, {user.name}! Here's your shipping overview.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchPackages(true)}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Updating..." : "Refresh"}
            </Button>
            <Button onClick={() => router.push("/shipping/create")}>
              <Plus className="mr-2 h-4 w-4" />
              New Shipment
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Packages</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPackages}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Transit</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inTransit}</p>
                </div>
                <Truck className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalSpent.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Error loading packages:</span>
                <span>{error}</span>
                <Button variant="outline" size="sm" onClick={() => fetchPackages()} className="ml-auto">
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Packages */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Recent Packages
                  {refreshing && <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />}
                </CardTitle>
                <CardDescription>
                  {packages.length === 0
                    ? "No packages found. Create your first shipment to get started!"
                    : `Showing ${packages.length} package${packages.length !== 1 ? "s" : ""}`}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/search")}>
                <Search className="mr-2 h-4 w-4" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {packages.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No packages yet</h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  {user.userType === "demo"
                    ? "This is demo mode. In a real account, your packages would appear here."
                    : "Start by creating your first shipment to see it appear here."}
                </p>
                <Button onClick={() => router.push("/shipping/create")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Shipment
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {packages.slice(0, 5).map((pkg) => (
                  <div
                    key={pkg.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/track?number=${pkg.trackingNumber}`)}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {getStatusIcon(pkg.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900 truncate">{pkg.trackingNumber}</p>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(pkg.status)} w-fit`}>
                            {pkg.status.replace("-", " ").toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          To: {pkg.recipient} • {pkg.destination}
                        </p>
                        <p className="text-xs text-gray-500">
                          {pkg.service} • ${pkg.cost.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right mt-2 sm:mt-0 w-full sm:w-auto">
                      <p className="text-sm text-gray-600">{new Date(pkg.estimatedDelivery).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">Est. Delivery</p>
                    </div>
                  </div>
                ))}

                {packages.length > 5 && (
                  <div className="text-center pt-4 border-t">
                    <Button variant="outline" onClick={() => router.push("/search")}>
                      View All {packages.length} Packages
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/track")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Search className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Track Package</h3>
                  <p className="text-sm text-gray-600">Track any shipment</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/business")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Business Tools</h3>
                  <p className="text-sm text-gray-600">Bulk shipping & analytics</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/support")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Bell className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Support</h3>
                  <p className="text-sm text-gray-600">Get help & contact us</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
