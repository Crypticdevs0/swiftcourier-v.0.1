"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Package, Users, BarChart3, Shield, Search, Edit, Send } from "lucide-react"

export default function AdminDashboard() {
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  const [newStatus, setNewStatus] = useState("")

  // Mock data
  const packages = [
    { id: "SC1234567890", status: "In Transit", customer: "John Doe", destination: "Chicago, IL" },
    { id: "SC0987654321", status: "Delivered", customer: "Jane Smith", destination: "New York, NY" },
    { id: "SC1122334455", status: "Pending", customer: "Bob Johnson", destination: "Los Angeles, CA" },
  ]

  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active", packages: 5 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Active", packages: 12 },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "Suspended", packages: 3 },
  ]

  const handleStatusUpdate = (packageId: string, status: string) => {
    console.log(`Updating package ${packageId} to status: ${status}`)
    // Here you would make an API call to update the package status
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-red-600" />
              <h1 className="text-2xl font-bold text-gray-900">Swift Courier Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="destructive">Admin Access</Badge>
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,678</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.2%</div>
              <p className="text-xs text-muted-foreground">+0.3% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="packages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Package Management */}
          <TabsContent value="packages">
            <Card>
              <CardHeader>
                <CardTitle>Package Management</CardTitle>
                <CardDescription>View and update package statuses, manage deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input placeholder="Search packages..." className="max-w-sm" />
                  </div>

                  <div className="space-y-2">
                    {packages.map((pkg) => (
                      <div key={pkg.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{pkg.id}</p>
                          <p className="text-sm text-gray-600">
                            {pkg.customer} → {pkg.destination}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={pkg.status === "Delivered" ? "default" : "secondary"}>{pkg.status}</Badge>
                          <Select onValueChange={(value) => handleStatusUpdate(pkg.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Update" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-transit">In Transit</SelectItem>
                              <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="exception">Exception</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts, view activity, and handle support requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input placeholder="Search users..." className="max-w-sm" />
                  </div>

                  <div className="space-y-2">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">{user.packages} packages shipped</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={user.status === "Active" ? "default" : "destructive"}>{user.status}</Badge>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Message Center */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Message Center</CardTitle>
                <CardDescription>Send custom messages to users and manage communications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Recipient</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user or group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="delayed">Users with Delayed Packages</SelectItem>
                          <SelectItem value="business">Business Customers</SelectItem>
                          <SelectItem value="individual">Individual User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Message Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="delivery-update">Delivery Update</SelectItem>
                          <SelectItem value="promotion">Promotion</SelectItem>
                          <SelectItem value="service-alert">Service Alert</SelectItem>
                          <SelectItem value="custom">Custom Message</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="Message subject" />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea placeholder="Type your message here..." className="min-h-32" />
                  </div>

                  <Button className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>View performance metrics and business insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Analytics dashboard coming soon...</p>
                  <p className="text-sm text-gray-500">Real-time charts and reports will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system preferences and security settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Two-Factor Authentication</span>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>IP Whitelisting</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Session Timeout</span>
                        <span className="text-sm text-gray-600">30 minutes</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">System Status</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>API Status</span>
                        <Badge variant="default">Operational</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Database</span>
                        <Badge variant="default">Healthy</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Last Backup</span>
                        <span className="text-sm text-gray-600">2 hours ago</span>
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
