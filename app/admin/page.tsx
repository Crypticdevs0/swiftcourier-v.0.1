"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useAdminRealtime } from "@/hooks/useAdminRealtime"
import { useAdminPackages } from "@/hooks/useAdminPackages"
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
  Users,
  TrendingUp,
  AlertTriangle,
  LogOut,
  RefreshCw,
  BarChart3,
  Settings,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  MapPin,
  Clock,
  DollarSign,
  Truck,
  Activity,
  Bell,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  WifiOff,
  Wifi,
  Edit2,
} from "lucide-react"

interface AdminStats {
  total: number
  byStatus: Record<string, number>
  recentEvents: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const { packages, fetchPackages } = useAdminPackages()
  const { isConnected, stats, events, connect, disconnect } = useAdminRealtime()
  
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPackages, setFilteredPackages] = useState(packages)
  const [refreshing, setRefreshing] = useState(false)
  const [adminStats, setAdminStats] = useState<AdminStats>({
    total: 0,
    byStatus: {},
    recentEvents: 0,
  })

  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [reason, setReason] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const { updatePackageStatus, addPackageEvent } = useAdminPackages()

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
  }, [isAuthenticated, user, router])

  useEffect(() => {
    fetchPackages()
  }, [fetchPackages])

  useEffect(() => {
    if (stats) {
      setAdminStats(stats)
    }
  }, [stats])

  useEffect(() => {
    const filtered = packages.filter((pkg) => {
      const search = searchTerm.toLowerCase()
      return (
        pkg.trackingNumber.toLowerCase().includes(search) ||
        pkg.sender.name.toLowerCase().includes(search) ||
        pkg.recipient.name.toLowerCase().includes(search)
      )
    })
    setFilteredPackages(filtered)
  }, [packages, searchTerm])

  const handleLogout = async () => {
    disconnect()
    await logout()
    router.push("/auth")
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchPackages()
    await new Promise((resolve) => setTimeout(resolve, 500))
    setRefreshing(false)
  }

  const handleEditStatus = (pkg: any) => {
    setSelectedPackage(pkg)
    setNewStatus(pkg.status)
    setReason("")
    setEditDialogOpen(true)
  }

  const handleUpdateStatus = async () => {
    if (!selectedPackage || !newStatus) return

    setIsUpdating(true)
    try {
      const result = await updatePackageStatus(selectedPackage.trackingNumber, newStatus, reason)
      if (result.success) {
        setEditDialogOpen(false)
        setSelectedPackage(null)
        await fetchPackages()
      }
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
      case "Operational":
      case "Healthy":
      case "Connected":
        return "bg-green-100 text-green-800 border-green-200"
      case "in_transit":
      case "picked_up":
      case "Processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "out_for_delivery":
      case "pending":
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "exception":
      case "Down":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getConnectionStatusBadge = () => {
    return (
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
    )
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
      {/* Enhanced Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                    Swift Courier Admin
                  </h1>
                  <p className="text-sm text-slate-600">Real-time Operations Dashboard</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search packages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div>

              {/* Connection Status */}
              <div>{getConnectionStatusBadge()}</div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {events.length > 9 ? "9+" : events.length}
                </span>
              </Button>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-900">{user.name}</p>
                  <Badge className="text-xs bg-red-100 text-red-800 border-red-200">
                    ADMIN
                  </Badge>
                </div>
                <div className="h-8 w-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="hover:bg-slate-100"
                  title="Refresh data"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5 bg-white p-1 shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="packages" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Packages</span>
            </TabsTrigger>
            <TabsTrigger value="realtime" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Realtime</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-800">Total Packages</CardTitle>
                  <Package className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900">{adminStats.total}</div>
                  <div className="text-xs text-blue-700 mt-1">
                    Real-time count
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-800">Delivered</CardTitle>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900">
                    {adminStats.byStatus["delivered"] || 0}
                  </div>
                  <div className="text-xs text-green-700 mt-1">
                    Successfully delivered
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-800">In Transit</CardTitle>
                  <Truck className="h-5 w-5 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-900">
                    {(adminStats.byStatus["in_transit"] || 0) + (adminStats.byStatus["picked_up"] || 0)}
                  </div>
                  <div className="text-xs text-orange-700 mt-1">
                    On the way
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-800">Issues</CardTitle>
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-900">
                    {adminStats.byStatus["exception"] || 0}
                  </div>
                  <div className="text-xs text-red-700 mt-1">
                    Exceptions reported
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Real-time Event Feed</CardTitle>
                <CardDescription>Latest package updates and system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {events.length === 0 ? (
                    <p className="text-sm text-slate-600">No events yet. Real-time updates will appear here.</p>
                  ) : (
                    events.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className="text-xs"
                            >
                              {event.type.replace("_", " ").toUpperCase()}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {new Date(event.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-900">
                            {event.data.trackingNumber && (
                              <span className="font-medium">{event.data.trackingNumber}: </span>
                            )}
                            {event.type === "status_changed"
                              ? `Status changed from ${event.data.oldStatus} to ${event.data.newStatus}`
                              : event.type === "package_updated"
                              ? `Package updated`
                              : event.type === "event_added"
                              ? `Event added`
                              : "Update"}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">Package Management</CardTitle>
                    <CardDescription>Monitor and manage all packages in real-time</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-slate-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium">Tracking #</th>
                        <th className="text-left py-3 px-4 font-medium">Customer</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Destination</th>
                        <th className="text-left py-3 px-4 font-medium">Value</th>
                        <th className="text-left py-3 px-4 font-medium">Updated</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPackages.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 px-4 text-center text-slate-500">
                            No packages found
                          </td>
                        </tr>
                      ) : (
                        filteredPackages.map((pkg) => (
                          <tr key={pkg.id} className="border-b hover:bg-slate-50 transition">
                            <td className="py-3 px-4 font-medium text-slate-900">{pkg.trackingNumber}</td>
                            <td className="py-3 px-4">{pkg.sender.name}</td>
                            <td className="py-3 px-4">
                              <Badge className={getStatusColor(pkg.status)}>
                                {pkg.status.replace("_", " ").toUpperCase()}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {pkg.recipient.city}, {pkg.recipient.state}
                            </td>
                            <td className="py-3 px-4 font-medium">${pkg.cost.toFixed(2)}</td>
                            <td className="py-3 px-4 text-xs text-slate-500">
                              {new Date(pkg.updatedAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditStatus(pkg)}
                                className="gap-1"
                              >
                                <Edit2 className="h-3 w-3" />
                                Edit
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Real-time Connection</CardTitle>
                    <CardDescription>Live data streaming and system status</CardDescription>
                  </div>
                  {getConnectionStatusBadge()}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-2">Connection Status</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-2">Recent Events</p>
                    <p className="text-lg font-semibold text-slate-900">{events.length}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="font-semibold mb-3">Event History</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {events.length === 0 ? (
                      <p className="text-sm text-slate-600">Waiting for real-time updates...</p>
                    ) : (
                      events.map((event) => (
                        <div key={event.id} className="p-3 bg-slate-50 rounded-lg text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline">{event.type}</Badge>
                            <span className="text-xs text-slate-500">
                              {new Date(event.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          {event.changes && (
                            <pre className="text-xs bg-slate-900 text-slate-100 p-2 rounded mt-2 overflow-x-auto">
                              {JSON.stringify(event.changes, null, 2)}
                            </pre>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Package Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(adminStats.byStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium capitalize">{status.replace("_", " ")}</p>
                        <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${(count / adminStats.total) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <span className="ml-4 font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Admin Settings</CardTitle>
                <CardDescription>Configure admin dashboard preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900">Real-time Updates</p>
                  <p className="text-sm text-blue-800 mt-1">
                    Connected to live data stream. Updates are pushed to your dashboard automatically.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm font-medium text-slate-900">Dashboard Version</p>
                  <p className="text-sm text-slate-600 mt-1">Real-time Admin Dashboard v2.0</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Status Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Package Status</DialogTitle>
            <DialogDescription>
              Change the status for package{" "}
              <span className="font-semibold">{selectedPackage?.trackingNumber}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-900">Current Status</label>
              <p className="text-sm text-slate-600 mt-1 p-2 bg-slate-50 rounded">
                {selectedPackage?.status.replace("_", " ").toUpperCase()}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-900 mb-2 block">New Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="picked_up">Picked Up</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="exception">Exception</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-900 mb-2 block">
                Reason (optional)
              </label>
              <Input
                placeholder="e.g., Delayed due to weather"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={isUpdating || !newStatus}
              className="bg-red-600 hover:bg-red-700"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
