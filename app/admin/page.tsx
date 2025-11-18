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
} from "lucide-react"
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

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [trackingNumbers, setTrackingNumbers] = useState<TrackingNumber[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [activities, setActivities] = useState<TrackingActivity[]>([])

  // Dialog states
  const [selectedTracking, setSelectedTracking] = useState<TrackingNumber | null>(null)
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false)
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [locationDialogOpen, setLocationDialogOpen] = useState(false)

  // Form states
  const [trackingFormData, setTrackingFormData] = useState<any>({})
  const [productFormData, setProductFormData] = useState<any>({})
  const [locationFormData, setLocationFormData] = useState<any>({})

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
      const response = await fetch("/api/admin/tracking-numbers", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setTrackingNumbers(data.data)
        if (data.stats) setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching tracking numbers:", error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products", {
        credentials: "include",
      })
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
      const response = await fetch("/api/admin/locations", {
        credentials: "include",
      })
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
      const response = await fetch("/api/admin/activities?limit=50", {
        credentials: "include",
      })
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
    await new Promise((resolve) => setTimeout(resolve, 500))
    setRefreshing(false)
  }

  const handleCreateTracking = async () => {
    try {
      const response = await fetch("/api/admin/tracking-numbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          action: "create",
          ...trackingFormData,
        }),
      })

      if (response.ok) {
        setTrackingDialogOpen(false)
        setTrackingFormData({})
        await fetchTrackingNumbers()
      }
    } catch (error) {
      console.error("Error creating tracking number:", error)
    }
  }

  const handleCreateProduct = async () => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          action: "create",
          ...productFormData,
        }),
      })

      if (response.ok) {
        setProductDialogOpen(false)
        setProductFormData({})
        await fetchProducts()
      }
    } catch (error) {
      console.error("Error creating product:", error)
    }
  }

  const handleCreateLocation = async () => {
    try {
      const response = await fetch("/api/admin/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          action: "create",
          ...locationFormData,
        }),
      })

      if (response.ok) {
        setLocationDialogOpen(false)
        setLocationFormData({})
        await fetchLocations()
      }
    } catch (error) {
      console.error("Error creating location:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "in_transit":
      case "picked_up":
        return "bg-blue-100 text-blue-800"
      case "out_for_delivery":
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "exception":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  Swift Courier Admin
                </h1>
                <p className="text-sm text-slate-600">Unified Tracking System</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-slate-50 border-slate-200"
                />
              </div>

              <Badge
                variant="outline"
                className={`flex items-center gap-1 ${
                  isConnected
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {isConnected ? (
                  <>
                    <Wifi className="h-3 w-3" />
                    Live
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3" />
                    Offline
                  </>
                )}
              </Badge>

              <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white p-1 shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Tracking</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Locations</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Activities</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-800">
                    Total Shipments
                  </CardTitle>
                  <Package className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900">
                    {stats?.totalTrackingNumbers || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-800">
                    Delivered Today
                  </CardTitle>
                  <ArrowUp className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900">{stats?.deliveredToday || 0}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-800">
                    In Transit
                  </CardTitle>
                  <Truck className="h-5 w-5 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-900">
                    {stats?.activeShipments || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-800">Exceptions</CardTitle>
                  <ArrowDown className="h-5 w-5 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-900">{stats?.exceptionCount || 0}</div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-slate-900">
                  ${stats?.totalRevenue?.toFixed(2) || "0.00"}
                </div>
                <p className="text-sm text-slate-600 mt-2">Total revenue from all shipments</p>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest tracking updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {activities.slice(0, 10).map((activity) => (
                    <div key={activity.id} className="p-3 bg-slate-50 rounded-lg border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Badge variant="outline" className="text-xs mb-1">
                            {activity.type}
                          </Badge>
                          <p className="text-sm text-slate-900 font-medium">
                            {activity.trackingNumber}
                          </p>
                          <p className="text-sm text-slate-600">{activity.description}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tracking Numbers Tab */}
          <TabsContent value="tracking" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Tracking Numbers</CardTitle>
                    <CardDescription>Manage all shipments</CardDescription>
                  </div>
                  <Button
                    onClick={() => setTrackingDialogOpen(true)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Tracking
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-slate-50">
                      <tr>
                        <th className="text-left py-3 px-4">Tracking #</th>
                        <th className="text-left py-3 px-4">Sender</th>
                        <th className="text-left py-3 px-4">Recipient</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Priority</th>
                        <th className="text-left py-3 px-4">Cost</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trackingNumbers.map((t) => (
                        <tr key={t.id} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono font-medium">{t.trackingNumber}</td>
                          <td className="py-3 px-4 text-sm">{t.senderName}</td>
                          <td className="py-3 px-4 text-sm">{t.recipientName}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(t.status)}>
                              {t.status.replace("_", " ").toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm capitalize">{t.priority}</td>
                          <td className="py-3 px-4 font-medium">${t.cost.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedTracking(t)
                                setTrackingDialogOpen(true)
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>Manage goods and products</CardDescription>
                  </div>
                  <Button
                    onClick={() => setProductDialogOpen(true)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <Card key={p.id} className="border">
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-slate-500">SKU</p>
                            <p className="font-mono font-semibold">{p.sku}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{p.name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600">{p.description}</p>
                          </div>
                          <div className="flex justify-between pt-2">
                            <Badge variant="outline">{p.category}</Badge>
                            <span className="text-sm font-semibold">${p.pricing.baseCost}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Locations</CardTitle>
                    <CardDescription>Pickup and dropoff points</CardDescription>
                  </div>
                  <Button
                    onClick={() => setLocationDialogOpen(true)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Location
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {locations.map((l) => (
                    <Card key={l.id} className="border">
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-slate-900">{l.name}</p>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {l.type}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-sm text-slate-600">
                            <p>{l.address.street}</p>
                            <p>
                              {l.address.city}, {l.address.state} {l.address.zipCode}
                            </p>
                          </div>
                          <div className="text-sm">
                            <p className="font-medium text-slate-900">Contact</p>
                            <p className="text-slate-600">{l.contact.personName}</p>
                            <p className="text-slate-600">{l.contact.phone}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>All Activities</CardTitle>
                <CardDescription>Complete tracking activity log</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activities.map((a) => (
                    <div
                      key={a.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-semibold text-sm">
                              {a.trackingNumber}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {a.type}
                            </Badge>
                            <Badge className={getStatusColor(a.status)}>
                              {a.status.replace("_", " ").toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-700">{a.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {a.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(a.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-900">Unified Tracking System</p>
                    <p className="text-sm text-blue-800 mt-1">
                      Manage all tracking numbers, products, and locations from one dashboard
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Tracking Number</DialogTitle>
            <DialogDescription>Create a new shipment tracking number</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Product</label>
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
              <label className="text-sm font-medium">Pickup Location</label>
              <Select
                value={trackingFormData.senderLocationId || ""}
                onValueChange={(val) =>
                  setTrackingFormData({ ...trackingFormData, senderLocationId: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pickup location" />
                </SelectTrigger>
                <SelectContent>
                  {locations
                    .filter((l) => l.type === "pickup" || l.type === "warehouse")
                    .map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Dropoff Location</label>
              <Select
                value={trackingFormData.recipientLocationId || ""}
                onValueChange={(val) =>
                  setTrackingFormData({ ...trackingFormData, recipientLocationId: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select dropoff location" />
                </SelectTrigger>
                <SelectContent>
                  {locations
                    .filter((l) => l.type === "dropoff" || l.type === "hub")
                    .map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <Input
              placeholder="Recipient Name"
              value={trackingFormData.recipientName || ""}
              onChange={(e) =>
                setTrackingFormData({
                  ...trackingFormData,
                  recipientName: e.target.value,
                })
              }
            />

            <Input
              placeholder="Sender Name"
              value={trackingFormData.senderName || ""}
              onChange={(e) =>
                setTrackingFormData({ ...trackingFormData, senderName: e.target.value })
              }
            />

            <Select
              value={trackingFormData.priority || "standard"}
              onValueChange={(val) =>
                setTrackingFormData({ ...trackingFormData, priority: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="express">Express</SelectItem>
                <SelectItem value="overnight">Overnight</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Cost"
              value={trackingFormData.cost || ""}
              onChange={(e) =>
                setTrackingFormData({ ...trackingFormData, cost: parseFloat(e.target.value) })
              }
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTrackingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTracking} className="bg-red-600 hover:bg-red-700">
              Create Tracking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Product Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>Create a new product</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="SKU"
              value={productFormData.sku || ""}
              onChange={(e) =>
                setProductFormData({ ...productFormData, sku: e.target.value })
              }
            />
            <Input
              placeholder="Product Name"
              value={productFormData.name || ""}
              onChange={(e) =>
                setProductFormData({ ...productFormData, name: e.target.value })
              }
            />
            <Input
              placeholder="Description"
              value={productFormData.description || ""}
              onChange={(e) =>
                setProductFormData({
                  ...productFormData,
                  description: e.target.value,
                })
              }
            />
            <Input
              placeholder="Category"
              value={productFormData.category || ""}
              onChange={(e) =>
                setProductFormData({ ...productFormData, category: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Base Cost"
              value={productFormData.pricing?.baseCost || ""}
              onChange={(e) =>
                setProductFormData({
                  ...productFormData,
                  pricing: { baseCost: parseFloat(e.target.value), currency: "USD" },
                })
              }
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setProductDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProduct} className="bg-red-600 hover:bg-red-700">
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Location Dialog */}
      <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Location</DialogTitle>
            <DialogDescription>Create a new pickup/dropoff location</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Location Name"
              value={locationFormData.name || ""}
              onChange={(e) =>
                setLocationFormData({ ...locationFormData, name: e.target.value })
              }
            />
            <Select
              value={locationFormData.type || "pickup"}
              onValueChange={(val) =>
                setLocationFormData({ ...locationFormData, type: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="dropoff">Dropoff</SelectItem>
                <SelectItem value="hub">Hub</SelectItem>
                <SelectItem value="warehouse">Warehouse</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Street Address"
              value={locationFormData.address?.street || ""}
              onChange={(e) =>
                setLocationFormData({
                  ...locationFormData,
                  address: { ...locationFormData.address, street: e.target.value },
                })
              }
            />
            <Input
              placeholder="City"
              value={locationFormData.address?.city || ""}
              onChange={(e) =>
                setLocationFormData({
                  ...locationFormData,
                  address: { ...locationFormData.address, city: e.target.value },
                })
              }
            />
            <Input
              placeholder="Contact Person"
              value={locationFormData.contact?.personName || ""}
              onChange={(e) =>
                setLocationFormData({
                  ...locationFormData,
                  contact: { ...locationFormData.contact, personName: e.target.value },
                })
              }
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
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setLocationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateLocation} className="bg-red-600 hover:bg-red-700">
              Add Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
