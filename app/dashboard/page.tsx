"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Package,
  Truck,
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
  const router = useRouter()

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Load user's packages
      loadUserPackages(parsedUser.id)
    } else {
      router.push("/login")
    }
  }, [router])

  const loadUserPackages = async (userId: number) => {
    try {
      // Simulate API call - in real app, this would fetch from backend
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
          events: [],
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
          events: [],
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading your dashboard...</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.firstName || user.name}!</h1>
              <p className="text-gray-600">Manage your shipments and track your packages</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">{user.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link href="/track">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Search className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Track Package</p>
                </CardContent>
              </Card>
            </Link>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={createNewShipment}>
              <CardContent className="p-4 text-center">
                <Plus className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Create Shipment</p>
              </CardContent>
            </Card>

            <Link href="/store">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <ShoppingCart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Buy Stamps</p>
                </CardContent>
              </Card>
            </Link>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Schedule Pickup</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Printer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Print Label</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Hold Delivery</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Shipments</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.activeShipments}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-3xl font-bold text-green-600">{stats.thisMonth}</p>
                </div>
                <Truck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivered</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.delivered}</p>
                </div>
                <Mail className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Saved Addresses</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.savedAddresses}</p>
                </div>
                <Home className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="packages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="packages">My Packages</TabsTrigger>
            <TabsTrigger value="swift-preview">Swift Preview</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="business">Business Tools</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Packages Tab */}
          <TabsContent value="packages">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>My Packages</CardTitle>
                    <CardDescription>Track and manage your shipments</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button onClick={createNewShipment}>
                      <Plus className="mr-2 h-4 w-4" />
                      New Shipment
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <div key={pkg.trackingNumber} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <Package className="h-10 w-10 text-gray-400" />
                          <div>
                            <p className="font-semibold text-lg">{pkg.trackingNumber}</p>
                            <p className="text-sm text-gray-600">To: {pkg.recipient.name}</p>
                            <p className="text-sm text-gray-600">
                              {pkg.recipient.city}, {pkg.recipient.state}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={pkg.status === "delivered" ? "default" : "secondary"}>
                            {pkg.status.replace("_", " ").toUpperCase()}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">{pkg.service}</p>
                          <p className="text-xs text-gray-500">
                            {pkg.status === "delivered" ? "Delivered" : "Est. Delivery"}:{" "}
                            {new Date(pkg.estimatedDelivery).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{pkg.progress}%</span>
                        </div>
                        <Progress value={pkg.progress} className="h-2" />
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          {pkg.currentLocation}
                        </p>
                        <div className="flex space-x-2">
                          <Link href={`/track?number=${pkg.trackingNumber}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Track
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Receipt
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Tools Tab */}
          <TabsContent value="business">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Bulk Shipment Manager
                  </CardTitle>
                  <CardDescription>Upload CSV files for batch processing</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Upload CSV File</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Shipping Analytics
                  </CardTitle>
                  <CardDescription>View detailed shipping reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Reports
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    SCAN Forms
                  </CardTitle>
                  <CardDescription>Generate batch scan sheets</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Create SCAN Form
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs content would go here... */}
          <TabsContent value="swift-preview">
            <Card>
              <CardHeader>
                <CardTitle>Swift Preview</CardTitle>
                <CardDescription>Digital previews of your incoming mail</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">No mail previews available</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <CardTitle>Saved Addresses</CardTitle>
                <CardDescription>Manage your frequently used addresses</CardDescription>
              </CardHeader>
              <CardContent>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Address
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing Center</CardTitle>
                <CardDescription>Manage your payments and invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <CreditCard className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-medium">Payment Methods</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-medium">Invoices</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-medium">Spending Report</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Analytics</CardTitle>
                <CardDescription>Insights into your shipping patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Monthly Shipments</h4>
                    <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                      <p className="text-gray-500">Chart placeholder</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Delivery Performance</h4>
                    <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                      <p className="text-gray-500">Chart placeholder</p>
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
