"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "lucide-react"

interface UserInfo {
  name: string
  role: string
  username: string
}

interface DashboardStats {
  totalPackages: number
  activeUsers: number
  revenue: number
  issues: number
  packagesChange: number
  usersChange: number
  revenueChange: number
  issuesChange: number
}

interface RecentShipment {
  id: string
  status: "Delivered" | "In Transit" | "Processing" | "Delayed"
  customer: string
  destination: string
  time: string
  amount: number
}

interface SystemStatus {
  service: string
  status: "Operational" | "Healthy" | "Connected" | "Maintenance" | "Down"
  uptime: string
}

export default function AdminDashboard() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  // Mock data
  const [stats, setStats] = useState<DashboardStats>({
    totalPackages: 12847,
    activeUsers: 3421,
    revenue: 89432,
    issues: 23,
    packagesChange: 12,
    usersChange: 8,
    revenueChange: 15,
    issuesChange: -5,
  })

  const [recentShipments, setRecentShipments] = useState<RecentShipment[]>([
    {
      id: "SW123456",
      status: "Delivered",
      customer: "John Doe",
      destination: "New York",
      time: "2 hours ago",
      amount: 45.99,
    },
    {
      id: "SW123457",
      status: "In Transit",
      customer: "Jane Smith",
      destination: "Los Angeles",
      time: "4 hours ago",
      amount: 67.5,
    },
    {
      id: "SW123458",
      status: "Processing",
      customer: "Bob Johnson",
      destination: "Chicago",
      time: "6 hours ago",
      amount: 32.25,
    },
    {
      id: "SW123459",
      status: "Delayed",
      customer: "Alice Brown",
      destination: "Miami",
      time: "8 hours ago",
      amount: 78.99,
    },
  ])

  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([
    { service: "API Gateway", status: "Operational", uptime: "99.9%" },
    { service: "Database", status: "Healthy", uptime: "99.8%" },
    { service: "Payment Gateway", status: "Connected", uptime: "99.7%" },
    { service: "Tracking Service", status: "Maintenance", uptime: "98.5%" },
  ])

  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem("admin_authenticated")
    const name = localStorage.getItem("admin_name")
    const role = localStorage.getItem("admin_role")
    const username = localStorage.getItem("admin_username")

    if (authStatus === "true" && name && role && username) {
      setUserInfo({ name, role, username })
    } else {
      router.push("/admin/login")
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    localStorage.removeItem("admin_role")
    localStorage.removeItem("admin_name")
    localStorage.removeItem("admin_username")
    router.push("/admin/login")
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
      case "Operational":
      case "Healthy":
      case "Connected":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Transit":
      case "Processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Delayed":
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Down":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800 border-red-200"
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "support":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!userInfo) {
    return null // Will redirect to login
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
                  <p className="text-sm text-slate-600">Operations Dashboard</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search packages, users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-900">{userInfo.name}</p>
                  <Badge className={`text-xs ${getRoleColor(userInfo.role)}`}>
                    {userInfo.role.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
                <div className="h-8 w-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white font-medium">
                  {userInfo.name.charAt(0).toUpperCase()}
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
                >
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
        </div>
      </header>

      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 bg-white p-1 shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="packages" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Packages</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">System</span>
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
                  <div className="text-3xl font-bold text-blue-900">{stats.totalPackages.toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-sm">
                    <ArrowUp className="h-3 w-3 text-green-600" />
                    <span className="text-green-600 font-medium">+{stats.packagesChange}%</span>
                    <span className="text-blue-700">from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-800">Active Users</CardTitle>
                  <Users className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900">{stats.activeUsers.toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-sm">
                    <ArrowUp className="h-3 w-3 text-green-600" />
                    <span className="text-green-600 font-medium">+{stats.usersChange}%</span>
                    <span className="text-green-700">from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-800">Revenue</CardTitle>
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900">${stats.revenue.toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-sm">
                    <ArrowUp className="h-3 w-3 text-green-600" />
                    <span className="text-green-600 font-medium">+{stats.revenueChange}%</span>
                    <span className="text-purple-700">from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-800">Issues</CardTitle>
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-900">{stats.issues}</div>
                  <div className="flex items-center gap-1 text-sm">
                    <ArrowDown className="h-3 w-3 text-green-600" />
                    <span className="text-green-600 font-medium">{stats.issuesChange}%</span>
                    <span className="text-red-700">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Recent Shipments</CardTitle>
                    <CardDescription>Latest package deliveries and updates</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentShipments.map((shipment) => (
                      <div key={shipment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-slate-900">{shipment.id}</p>
                            <Badge className={`text-xs ${getStatusColor(shipment.status)}`}>{shipment.status}</Badge>
                          </div>
                          <p className="text-sm text-slate-600">{shipment.customer}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <MapPin className="h-3 w-3" />
                            {shipment.destination}
                            <Clock className="h-3 w-3 ml-2" />
                            {shipment.time}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">${shipment.amount}</p>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">System Health</CardTitle>
                    <CardDescription>Current status of all services</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Activity className="h-4 w-4 mr-2" />
                    Monitor
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemStatus.map((service) => (
                      <div
                        key={service.service}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{service.service}</p>
                          <p className="text-sm text-slate-600">Uptime: {service.uptime}</p>
                        </div>
                        <Badge className={`${getStatusColor(service.status)}`}>{service.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="packages" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">Package Management</CardTitle>
                    <CardDescription>Monitor and manage all packages in the system</CardDescription>
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
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Package
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-3 px-4">Tracking #</th>
                        <th className="text-left py-3 px-4">Customer</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Destination</th>
                        <th className="text-left py-3 px-4">Value</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentShipments.map((shipment) => (
                        <tr key={shipment.id} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">{shipment.id}</td>
                          <td className="py-3 px-4">{shipment.customer}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(shipment.status)}>{shipment.status}</Badge>
                          </td>
                          <td className="py-3 px-4">{shipment.destination}</td>
                          <td className="py-3 px-4">${shipment.amount.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">User Management</CardTitle>
                    <CardDescription>Manage system users and permissions</CardDescription>
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
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Role</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Joined</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 1, name: "Alice Johnson", email: "alice@swift.com", role: "admin", status: "Active", joined: "Jan 2024" },
                        { id: 2, name: "Bob Smith", email: "bob@swift.com", role: "manager", status: "Active", joined: "Feb 2024" },
                        { id: 3, name: "Carol Davis", email: "carol@swift.com", role: "support", status: "Active", joined: "Mar 2024" },
                        { id: 4, name: "David Wilson", email: "david@swift.com", role: "user", status: "Inactive", joined: "Apr 2024" },
                      ].map((user) => (
                        <tr key={user.id} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">{user.name}</td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="capitalize">{user.role}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                          </td>
                          <td className="py-3 px-4">{user.joined}</td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Daily Shipments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gradient-to-t from-blue-100 to-blue-50 rounded-lg flex items-end justify-around p-4 gap-2">
                    {[45, 62, 38, 75, 58, 82, 71].map((height, i) => (
                      <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${height}%` }} />
                    ))}
                  </div>
                  <div className="flex justify-around text-xs text-gray-600 mt-3">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gradient-to-t from-green-100 to-green-50 rounded-lg flex items-end justify-around p-4 gap-2">
                    {[35, 48, 55, 62, 70, 85, 92].map((height, i) => (
                      <div key={i} className="flex-1 bg-green-500 rounded-t" style={{ height: `${height}%` }} />
                    ))}
                  </div>
                  <div className="flex justify-around text-xs text-gray-600 mt-3">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((month) => (
                      <span key={month}>{month}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Top Routes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { route: "NYC → LA", packages: 1247, revenue: "$15,430" },
                    { route: "Chicago → Miami", packages: 892, revenue: "$11,205" },
                    { route: "Boston → Houston", packages: 756, revenue: "$9,450" },
                    { route: "Seattle → Denver", packages: 624, revenue: "$7,800" },
                  ].map((route) => (
                    <div key={route.route} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">{route.route}</p>
                        <p className="text-sm text-gray-600">{route.packages} packages</p>
                      </div>
                      <p className="font-bold text-green-600">{route.revenue}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {systemStatus.map((service) => (
                <Card key={service.service} className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{service.service}</h3>
                      <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Uptime</p>
                        <p className="text-2xl font-bold text-green-600">{service.uptime}</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: service.uptime }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">Last checked: Just now</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
                  {[
                    { time: "14:32:15", level: "INFO", message: "Backup completed successfully" },
                    { time: "14:31:02", level: "INFO", message: "Cache cleared" },
                    { time: "14:25:44", level: "WARNING", message: "High memory usage detected" },
                    { time: "14:20:12", level: "INFO", message: "Database optimization started" },
                    { time: "14:15:08", level: "INFO", message: "Load balanced across servers" },
                  ].map((log, i) => (
                    <div key={i} className="flex gap-3 p-2 hover:bg-slate-50 rounded">
                      <span className="text-gray-400 font-mono">{log.time}</span>
                      <Badge variant={log.level === "WARNING" ? "destructive" : "secondary"} className="text-xs">
                        {log.level}
                      </Badge>
                      <span className="text-gray-700">{log.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">System Settings</CardTitle>
                <CardDescription>Configure system preferences and options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Email Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">SMTP Server</label>
                      <Input defaultValue="smtp.swiftcourier.com" className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Port</label>
                        <Input defaultValue="587" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">From Email</label>
                        <Input defaultValue="noreply@swiftcourier.com" className="mt-1" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 space-y-4">
                  <h3 className="font-semibold">API Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">API Key</label>
                      <Input type="password" defaultValue="sk_live_xxxxxxxxxxxxxxxxxx" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Rate Limit (requests/min)</label>
                      <Input defaultValue="1000" className="mt-1" />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 space-y-4">
                  <h3 className="font-semibold">Maintenance</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-medium">Enable Maintenance Mode</span>
                      <input type="checkbox" className="h-4 w-4" />
                    </div>
                    <Button variant="outline" className="w-full">Clear Cache</Button>
                    <Button variant="outline" className="w-full">Optimize Database</Button>
                  </div>
                </div>

                <Button className="w-full mt-6">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
