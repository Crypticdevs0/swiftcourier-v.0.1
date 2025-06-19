"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Truck, Mail, MapPin, Plus, Eye, Download } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const recentPackages = [
    {
      id: "SC1234567890",
      recipient: "Jane Smith",
      destination: "Chicago, IL",
      status: "In Transit",
      date: "2024-12-19",
      service: "Swift Express",
    },
    {
      id: "SC0987654321",
      recipient: "Bob Johnson",
      destination: "New York, NY",
      status: "Delivered",
      date: "2024-12-18",
      service: "Swift Standard",
    },
    {
      id: "SC1122334455",
      recipient: "Alice Brown",
      destination: "Los Angeles, CA",
      status: "Pending",
      date: "2024-12-20",
      service: "Swift Overnight",
    },
  ]

  const swiftPreviewItems = [
    {
      id: 1,
      sender: "Bank of America",
      type: "Statement",
      date: "2024-12-19",
      preview: "/placeholder.svg?height=100&width=150",
    },
    {
      id: 2,
      sender: "City Utilities",
      type: "Bill",
      date: "2024-12-18",
      preview: "/placeholder.svg?height=100&width=150",
    },
    {
      id: 3,
      sender: "Insurance Co.",
      type: "Notice",
      date: "2024-12-17",
      preview: "/placeholder.svg?height=100&width=150",
    },
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Manage your shipments and track your packages</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Shipments</p>
                  <p className="text-2xl font-bold">12</p>
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
                  <p className="text-2xl font-bold">47</p>
                </div>
                <Truck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Swift Preview</p>
                  <p className="text-2xl font-bold">8</p>
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
                  <p className="text-2xl font-bold">5</p>
                </div>
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="packages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="packages">My Packages</TabsTrigger>
            <TabsTrigger value="swift-preview">Swift Preview</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Packages Tab */}
          <TabsContent value="packages">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recent Packages</CardTitle>
                    <CardDescription>Track and manage your shipments</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Shipment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPackages.map((pkg) => (
                    <div key={pkg.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Package className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-medium">{pkg.id}</p>
                          <p className="text-sm text-gray-600">To: {pkg.recipient}</p>
                          <p className="text-sm text-gray-600">{pkg.destination}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={pkg.status === "Delivered" ? "default" : "secondary"}>{pkg.status}</Badge>
                        <p className="text-sm text-gray-600 mt-1">{pkg.service}</p>
                        <p className="text-xs text-gray-500">{pkg.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Swift Preview Tab */}
          <TabsContent value="swift-preview">
            <Card>
              <CardHeader>
                <CardTitle>Swift Preview</CardTitle>
                <CardDescription>Digital previews of your incoming mail</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {swiftPreviewItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="aspect-[3/2] bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        <Mail className="h-8 w-8 text-gray-400" />
                      </div>
                      <h4 className="font-medium">{item.sender}</h4>
                      <p className="text-sm text-gray-600">{item.type}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="mr-1 h-3 w-3" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <Card>
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
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Home</p>
                        <p className="text-sm text-gray-600">123 Main Street</p>
                        <p className="text-sm text-gray-600">New York, NY 10001</p>
                      </div>
                      <Badge variant="outline">Default</Badge>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Office</p>
                        <p className="text-sm text-gray-600">456 Business Ave</p>
                        <p className="text-sm text-gray-600">New York, NY 10002</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email notifications for package updates</span>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">SMS notifications</span>
                        <Badge variant="secondary">Disabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Swift Preview daily digest</span>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Privacy</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Share delivery updates with sender</span>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Marketing communications</span>
                        <Badge variant="secondary">Disabled</Badge>
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
