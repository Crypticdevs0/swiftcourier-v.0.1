"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useAdminRealtime } from "@/hooks/useAdminRealtime"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Package,
  MapPin,
  Activity,
  LogOut,
  RefreshCw,
  BarChart3,
  Settings,
  Search,
  Plus,
  Eye,
  Clock,
  DollarSign,
  Truck,
  Bell,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Wifi,
  WifiOff,
  ChevronRight,
  Home,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Filter,
} from "lucide-react"
import { toast } from "sonner"
import type { Product, Location, TrackingNumber, TrackingActivity } from "@/lib/models"

interface DashboardStats {
  totalTrackingNumbers: number
  activeShipments: number
  deliveredToday: number
  exceptionCount: number
  totalRevenue: number
  averageDeliveryTime: number
  byStatus: Record<string, number>
  byPriority: Record<string, number>
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const { isConnected } = useAdminRealtime()

  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [trackingNumbers, setTrackingNumbers] = useState<TrackingNumber[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [activities, setActivities] = useState<TrackingActivity[]>([])

  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false)
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [locationDialogOpen, setLocationDialogOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [trackingFormData, setTrackingFormData] = useState<any>({})
  const [productFormData, setProductFormData] = useState<any>({})
  const [locationFormData, setLocationFormData] = useState<any>({})
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }

    if (user?.role !== "admin") {
      router.push("/dashboard")
      return
    }

    setLoading(false)
    fetchAllData()
  }, [isAuthenticated, user, router])

  const fetchAllData = async () => {
    await Promise.all([
      fetchTrackingNumbers(),
      fetchProducts(),
      fetchLocations(),
      fetchActivities(),
    ])
  }

  const fetchTrackingNumbers = async () => {
    try {
      const response = await fetch("/api/admin/tracking-numbers", { credentials: "include" })
      if (response.ok) {
        const data = await response.json()
        setTrackingNumbers(data.data)
        if (data.stats) setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching tracking numbers:", error)
      toast.error("Failed to load tracking numbers")
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products", { credentials: "include" })
      if (response.ok) {
        const data = await response.json()
        setProducts(data.data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const fetchLocations = async () => {
    try {
      const response = await fetch("/api/admin/locations", { credentials: "include" })
      if (response.ok) {
        const data = await response.json()
        setLocations(data.data)
      }
    } catch (error) {
      console.error("Error fetching locations:", error)
    }
  }

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/admin/activities?limit=50", { credentials: "include" })
      if (response.ok) {
        const data = await response.json()
        setActivities(data.data)
      }
    } catch (error) {
      console.error("Error fetching activities:", error)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/auth")
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAllData()
    toast.success("Data refreshed")
    await new Promise((resolve) => setTimeout(resolve, 500))
    setRefreshing(false)
  }

  const handleCreateTracking = async () => {
    if (!trackingFormData.productId || !trackingFormData.senderLocationId || !trackingFormData.recipientLocationId) {
      setFormErrors({ general: "Please fill all required fields" })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/tracking-numbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "create", ...trackingFormData }),
      })

      if (response.ok) {
        toast.success("Tracking number created successfully")
        setTrackingDialogOpen(false)
        setTrackingFormData({})
        setFormErrors({})
        await fetchTrackingNumbers()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to create tracking number")
      }
    } catch (error) {
      toast.error("Error creating tracking number")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateProduct = async () => {
    if (!productFormData.sku || !productFormData.name) {
      setFormErrors({ general: "SKU and Name are required" })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "create", ...productFormData }),
      })

      if (response.ok) {
        toast.success("Product created successfully")
        setProductDialogOpen(false)
        setProductFormData({})
        setFormErrors({})
        await fetchProducts()
      } else {
        toast.error("Failed to create product")
      }
    } catch (error) {
      toast.error("Error creating product")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateLocation = async () => {
    if (!locationFormData.name || !locationFormData.type) {
      setFormErrors({ general: "Name and Type are required" })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "create", ...locationFormData }),
      })

      if (response.ok) {
        toast.success("Location created successfully")
        setLocationDialogOpen(false)
        setLocationFormData({})
        setFormErrors({})
        await fetchLocations()
      } else {
        toast.error("Failed to create location")
      }
    } catch (error) {
      toast.error("Error creating location")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    setIsSubmitting(true)
    try {
      const endpoint =
        deleteTarget.type === "tracking"
          ? "/api/admin/tracking-numbers"
          : deleteTarget.type === "product"
          ? "/api/admin/products"
          : "/api/admin/locations"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "delete", id: deleteTarget.id }),
      })

      if (response.ok) {
        toast.success(`${deleteTarget.type} deleted successfully`)
        setDeleteConfirmOpen(false)
        setDeleteTarget(null)
        await fetchAllData()
      } else {
        toast.error("Failed to delete")
      }
    } catch (error) {
      toast.error("Error deleting item")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300"
      case "in_transit":
      case "picked_up":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "out_for_delivery":
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "exception":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "overnight":
        return "bg-purple-100 text-purple-800"
      case "express":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const filteredTrackingNumbers = trackingNumbers.filter((t) => {
    const search = searchTerm.toLowerCase()
    return (
      t.trackingNumber.toLowerCase().includes(search) ||
      t.senderName.toLowerCase().includes(search) ||
      t.recipientName.toLowerCase().includes(search)
    )
  })

  const filteredProducts = products.filter((p) => {
    const search = searchTerm.toLowerCase()
    return p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search)
  })

  const filteredLocations = locations.filter((l) => {
    const search = searchTerm.toLowerCase()
    return l.name.toLowerCase().includes(search) || l.address.city.toLowerCase().includes(search)
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-slate-900">Swift Courier</h1>
                <p className="text-xs text-slate-600">Admin Dashboard</p>
              </div>
            </div>

            {/* Center - Search */}
            <div className="hidden md:flex flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search tracking, products, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full bg-slate-50 border-slate-200 focus:bg-white transition-colors"
              />
            </div>

            {/* Right - Status & Actions */}
            <div className="flex items-center gap-3">
              {/* Connection Status */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-xs font-medium text-slate-600">
                  {isConnected ? "Live" : "Offline"}
                </span>
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative hover:bg-slate-100">
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* Refresh */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={refreshing}
                className="hover:bg-slate-100"
                title="Refresh data"
              >
                <RefreshCw className={`h-5 w-5 text-slate-600 ${refreshing ? "animate-spin" : ""}`} />
              </Button>

              {/* User Menu - Desktop */}
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-600">Administrator</p>
                </div>
                <div className="h-8 w-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user.name.charAt(0)}
                </div>
              </div>

              {/* Logout */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full bg-slate-50 border-slate-200 text-sm"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Home className="h-4 w-4 text-slate-600" />
          <span className="text-slate-600">Dashboard</span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
          <span className="text-slate-900 font-medium capitalize">{activeTab}</span>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 bg-white p-1 shadow-sm rounded-lg overflow-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">Tracking</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">Products</span>
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">Locations</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">Activities</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 mb-2">Total Shipments</p>
                      <p className="text-3xl font-bold text-blue-900">{stats?.totalTrackingNumbers || 0}</p>
                      <p className="text-xs text-blue-700 mt-2">Active in system</p>
                    </div>
                    <Package className="h-12 w-12 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-2">Delivered Today</p>
                      <p className="text-3xl font-bold text-green-900">{stats?.deliveredToday || 0}</p>
                      <p className="text-xs text-green-700 mt-2">Last 24 hours</p>
                    </div>
                    <CheckCircle className="h-12 w-12 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600 mb-2">In Transit</p>
                      <p className="text-3xl font-bold text-orange-900">{stats?.activeShipments || 0}</p>
                      <p className="text-xs text-orange-700 mt-2">Currently moving</p>
                    </div>
                    <Truck className="h-12 w-12 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600 mb-2">Exceptions</p>
                      <p className="text-3xl font-bold text-red-900">{stats?.exceptionCount || 0}</p>
                      <p className="text-xs text-red-700 mt-2">Needs attention</p>
                    </div>
                    <AlertTriangle className="h-12 w-12 text-red-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue & Time */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Total Revenue</CardTitle>
                  <CardDescription>All shipments combined</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-slate-900">
                    {formatCurrency(stats?.totalRevenue || 0)}
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    <TrendingUp className="h-3 w-3 inline text-green-600 mr-1" />
                    Growing steadily
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Avg Delivery Time</CardTitle>
                  <CardDescription>Historical average</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-slate-900">
                    {stats?.averageDeliveryTime.toFixed(1) || "0.0"} days
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    <Clock className="h-3 w-3 inline text-blue-600 mr-1" />
                    Consistently on time
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card className="bg-white border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {activities.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-8">No activities yet</p>
                  ) : (
                    activities.slice(0, 10).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                        <div className="flex-shrink-0 mt-1">
                          {activity.type === "delivered" && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                          {activity.type === "exception" && (
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          )}
                          {activity.type === "in_transit" && (
                            <Truck className="h-5 w-5 text-orange-600" />
                          )}
                          {!["delivered", "exception", "in_transit"].includes(activity.type) && (
                            <Activity className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-sm font-medium text-slate-900">
                            {activity.trackingNumber}
                          </p>
                          <p className="text-sm text-slate-700 mt-0.5">{activity.description}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="space-y-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Tracking Numbers</CardTitle>
                    <CardDescription>Create and manage all shipments</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setTrackingFormData({})
                      setFormErrors({})
                      setTrackingDialogOpen(true)
                    }}
                    className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Tracking
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {filteredTrackingNumbers.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No tracking numbers found</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {searchTerm ? "Try adjusting your search" : "Create your first tracking number to get started"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Tracking #</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Sender</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Recipient</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Priority</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Cost</th>
                          <th className="text-center py-3 px-4 font-semibold text-slate-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredTrackingNumbers.map((tracking) => (
                          <tr key={tracking.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4">
                              <code className="font-mono font-semibold text-slate-900">
                                {tracking.trackingNumber}
                              </code>
                            </td>
                            <td className="py-3 px-4 text-slate-700">{tracking.senderName}</td>
                            <td className="py-3 px-4 text-slate-700">{tracking.recipientName}</td>
                            <td className="py-3 px-4">
                              <Badge className={getStatusColor(tracking.status)}>
                                {tracking.status.replace(/_/g, " ").toUpperCase()}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={getPriorityColor(tracking.priority)}>
                                {tracking.priority.charAt(0).toUpperCase() + tracking.priority.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-900">
                              {formatCurrency(tracking.cost)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-2"
                                onClick={() => {
                                  setTrackingFormData(tracking)
                                  setTrackingDialogOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => {
                                  setDeleteTarget({ type: "tracking", id: tracking.id })
                                  setDeleteConfirmOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>Manage goods and items</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setProductFormData({})
                      setFormErrors({})
                      setProductDialogOpen(true)
                    }}
                    className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No products found</p>
                    <p className="text-sm text-slate-500 mt-1">Create your first product to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                      <Card key={product.id} className="border-slate-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                SKU
                              </p>
                              <p className="font-mono font-bold text-slate-900">{product.sku}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{product.name}</p>
                              <p className="text-sm text-slate-600 line-clamp-2">
                                {product.description}
                              </p>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                              <Badge variant="outline" className="text-xs">
                                {product.category}
                              </Badge>
                              <p className="font-bold text-slate-900">
                                {formatCurrency(product.pricing.baseCost)}
                              </p>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => {
                                  setProductFormData(product)
                                  setProductDialogOpen(true)
                                }}
                              >
                                <Edit2 className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => {
                                  setDeleteTarget({ type: "product", id: product.id })
                                  setDeleteConfirmOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Locations</CardTitle>
                    <CardDescription>Manage pickup and dropoff points</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setLocationFormData({})
                      setFormErrors({})
                      setLocationDialogOpen(true)
                    }}
                    className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Location
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {filteredLocations.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No locations found</p>
                    <p className="text-sm text-slate-500 mt-1">Create your first location to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredLocations.map((location) => (
                      <Card key={location.id} className="border-slate-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-slate-900">{location.name}</p>
                                <Badge variant="outline" className="mt-1 text-xs">
                                  {location.type.replace(/_/g, " ").toUpperCase()}
                                </Badge>
                              </div>
                              <MapPin className="h-5 w-5 text-red-600 flex-shrink-0" />
                            </div>
                            <div className="space-y-2 text-sm text-slate-700">
                              <p>{location.address.street}</p>
                              <p>
                                {location.address.city}, {location.address.state}{" "}
                                {location.address.zipCode}
                              </p>
                            </div>
                            <div className="border-t border-slate-200 pt-2">
                              <p className="text-xs font-medium text-slate-600 mb-1">CONTACT</p>
                              <p className="text-sm font-medium text-slate-900">{location.contact.personName}</p>
                              <p className="text-sm text-slate-600">{location.contact.phone}</p>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => {
                                  setLocationFormData(location)
                                  setLocationDialogOpen(true)
                                }}
                              >
                                <Edit2 className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => {
                                  setDeleteTarget({ type: "location", id: location.id })
                                  setDeleteConfirmOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>Complete tracking history and system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activities.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-8">No activities recorded</p>
                  ) : (
                    activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {activity.type === "delivered" && (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          )}
                          {activity.type === "exception" && (
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                          )}
                          {activity.type === "in_transit" && (
                            <Truck className="h-6 w-6 text-orange-600" />
                          )}
                          {!["delivered", "exception", "in_transit"].includes(activity.type) && (
                            <Activity className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <p className="font-mono text-sm font-medium text-slate-900">
                                {activity.trackingNumber}
                              </p>
                              <p className="text-sm text-slate-700 mt-1">{activity.description}</p>
                              <p className="text-xs text-slate-500 mt-2">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {new Date(activity.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <Badge className={getStatusColor(activity.status)} className="whitespace-nowrap">
                              {activity.status.replace(/_/g, " ").toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>System configuration and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Unified Tracking System</p>
                  <p className="text-sm text-blue-800 mt-2">
                    Manage all your tracking numbers, products, and locations from one unified
                    dashboard. Real-time updates ensure you're always in sync with your operations.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-semibold text-slate-900">System Status</p>
                    <p className="text-sm text-slate-600 mt-2">✅ All systems operational</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-semibold text-slate-900">Connection</p>
                    <p className="text-sm text-slate-600 mt-2">
                      {isConnected ? "🟢 Real-time sync active" : "🔴 Reconnecting..."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Tracking Dialog */}
      <Dialog open={trackingDialogOpen} onOpenChange={setTrackingDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Tracking Number</DialogTitle>
            <DialogDescription>Link products and locations to create a new shipment</DialogDescription>
          </DialogHeader>

          {formErrors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{formErrors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-900 mb-2 block">
                  Product <span className="text-red-600">*</span>
                </label>
                <Select
                  value={trackingFormData.productId || ""}
                  onValueChange={(val) =>
                    setTrackingFormData({ ...trackingFormData, productId: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-900 mb-2 block">
                  Priority <span className="text-red-600">*</span>
                </label>
                <Select
                  value={trackingFormData.priority || "standard"}
                  onValueChange={(val) =>
                    setTrackingFormData({ ...trackingFormData, priority: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="overnight">Overnight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-900 mb-2 block">
                  Pickup Location <span className="text-red-600">*</span>
                </label>
                <Select
                  value={trackingFormData.senderLocationId || ""}
                  onValueChange={(val) =>
                    setTrackingFormData({ ...trackingFormData, senderLocationId: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pickup" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations
                      .filter((l) => ["pickup", "warehouse"].includes(l.type))
                      .map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-900 mb-2 block">
                  Dropoff Location <span className="text-red-600">*</span>
                </label>
                <Select
                  value={trackingFormData.recipientLocationId || ""}
                  onValueChange={(val) =>
                    setTrackingFormData({ ...trackingFormData, recipientLocationId: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select dropoff" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations
                      .filter((l) => ["dropoff", "hub"].includes(l.type))
                      .map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Sender Name"
                value={trackingFormData.senderName || ""}
                onChange={(e) =>
                  setTrackingFormData({ ...trackingFormData, senderName: e.target.value })
                }
                className="border-slate-200"
              />
              <Input
                placeholder="Recipient Name"
                value={trackingFormData.recipientName || ""}
                onChange={(e) =>
                  setTrackingFormData({
                    ...trackingFormData,
                    recipientName: e.target.value,
                  })
                }
                className="border-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Recipient Email"
                type="email"
                value={trackingFormData.recipientEmail || ""}
                onChange={(e) =>
                  setTrackingFormData({
                    ...trackingFormData,
                    recipientEmail: e.target.value,
                  })
                }
                className="border-slate-200"
              />
              <Input
                placeholder="Recipient Phone"
                value={trackingFormData.recipientPhone || ""}
                onChange={(e) =>
                  setTrackingFormData({
                    ...trackingFormData,
                    recipientPhone: e.target.value,
                  })
                }
                className="border-slate-200"
              />
            </div>

            <Input
              placeholder="Cost"
              type="number"
              step="0.01"
              value={trackingFormData.cost || ""}
              onChange={(e) =>
                setTrackingFormData({ ...trackingFormData, cost: parseFloat(e.target.value) })
              }
              className="border-slate-200"
            />

            <Input
              placeholder="Notes (optional)"
              value={trackingFormData.notes || ""}
              onChange={(e) =>
                setTrackingFormData({ ...trackingFormData, notes: e.target.value })
              }
              className="border-slate-200"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTrackingDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateTracking}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Tracking"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Product Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>Create a new product for shipments</DialogDescription>
          </DialogHeader>

          {formErrors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-700">{formErrors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="SKU"
                value={productFormData.sku || ""}
                onChange={(e) =>
                  setProductFormData({ ...productFormData, sku: e.target.value })
                }
                className="border-slate-200 font-mono"
              />
              <Input
                placeholder="Product Name"
                value={productFormData.name || ""}
                onChange={(e) =>
                  setProductFormData({ ...productFormData, name: e.target.value })
                }
                className="border-slate-200"
              />
            </div>

            <Input
              placeholder="Description"
              value={productFormData.description || ""}
              onChange={(e) =>
                setProductFormData({ ...productFormData, description: e.target.value })
              }
              className="border-slate-200"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Category"
                value={productFormData.category || ""}
                onChange={(e) =>
                  setProductFormData({ ...productFormData, category: e.target.value })
                }
                className="border-slate-200"
              />
              <Input
                placeholder="Base Cost ($)"
                type="number"
                step="0.01"
                value={productFormData.pricing?.baseCost || ""}
                onChange={(e) =>
                  setProductFormData({
                    ...productFormData,
                    pricing: { baseCost: parseFloat(e.target.value), currency: "USD" },
                  })
                }
                className="border-slate-200"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setProductDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProduct} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
              {isSubmitting ? "Creating..." : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Location Dialog */}
      <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Location</DialogTitle>
            <DialogDescription>Create a new pickup or dropoff location</DialogDescription>
          </DialogHeader>

          {formErrors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-700">{formErrors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Location Name"
                value={locationFormData.name || ""}
                onChange={(e) =>
                  setLocationFormData({ ...locationFormData, name: e.target.value })
                }
                className="border-slate-200"
              />
              <Select
                value={locationFormData.type || "pickup"}
                onValueChange={(val) =>
                  setLocationFormData({ ...locationFormData, type: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">Pickup</SelectItem>
                  <SelectItem value="dropoff">Dropoff</SelectItem>
                  <SelectItem value="hub">Hub</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Input
              placeholder="Street Address"
              value={locationFormData.address?.street || ""}
              onChange={(e) =>
                setLocationFormData({
                  ...locationFormData,
                  address: { ...locationFormData.address, street: e.target.value },
                })
              }
              className="border-slate-200"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                placeholder="City"
                value={locationFormData.address?.city || ""}
                onChange={(e) =>
                  setLocationFormData({
                    ...locationFormData,
                    address: { ...locationFormData.address, city: e.target.value },
                  })
                }
                className="border-slate-200"
              />
              <Input
                placeholder="State"
                value={locationFormData.address?.state || ""}
                onChange={(e) =>
                  setLocationFormData({
                    ...locationFormData,
                    address: { ...locationFormData.address, state: e.target.value },
                  })
                }
                className="border-slate-200"
              />
              <Input
                placeholder="ZIP Code"
                value={locationFormData.address?.zipCode || ""}
                onChange={(e) =>
                  setLocationFormData({
                    ...locationFormData,
                    address: { ...locationFormData.address, zipCode: e.target.value },
                  })
                }
                className="border-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Contact Person"
                value={locationFormData.contact?.personName || ""}
                onChange={(e) =>
                  setLocationFormData({
                    ...locationFormData,
                    contact: { ...locationFormData.contact, personName: e.target.value },
                  })
                }
                className="border-slate-200"
              />
              <Input
                placeholder="Phone"
                value={locationFormData.contact?.phone || ""}
                onChange={(e) =>
                  setLocationFormData({
                    ...locationFormData,
                    contact: { ...locationFormData.contact, phone: e.target.value },
                  })
                }
                className="border-slate-200"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setLocationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateLocation} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
              {isSubmitting ? "Creating..." : "Add Location"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.type}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {deleteTarget?.type} and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
