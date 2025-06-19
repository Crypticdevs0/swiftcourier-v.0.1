"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Eye, Download, Bell, Shield, Smartphone, CheckCircle } from "lucide-react"

export default function SwiftPreviewPage() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const previewItems = [
    {
      id: 1,
      sender: "Bank of America",
      type: "Statement",
      date: "2024-12-19",
      preview: "/placeholder.svg?height=150&width=200",
      isNew: true,
    },
    {
      id: 2,
      sender: "City Water Department",
      type: "Bill",
      date: "2024-12-18",
      preview: "/placeholder.svg?height=150&width=200",
      isNew: true,
    },
    {
      id: 3,
      sender: "Insurance Company",
      type: "Policy Notice",
      date: "2024-12-17",
      preview: "/placeholder.svg?height=150&width=200",
      isNew: false,
    },
    {
      id: 4,
      sender: "Medical Center",
      type: "Appointment Reminder",
      date: "2024-12-16",
      preview: "/placeholder.svg?height=150&width=200",
      isNew: false,
    },
  ]

  const handleSubscribe = () => {
    setIsSubscribed(true)
    // In a real app, this would make an API call
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Swift Preview</h1>
          <p className="text-gray-600">Get digital previews of your incoming mail delivered to your inbox</p>
        </div>

        {!isSubscribed ? (
          /* Sign Up Section */
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Sign Up for Swift Preview</CardTitle>
                <CardDescription>
                  See what's coming before it arrives. Get digital previews of letter-sized mail pieces.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email Address</label>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <label htmlFor="terms" className="text-sm">
                        I agree to the Terms of Service and Privacy Policy
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notifications" />
                      <label htmlFor="notifications" className="text-sm">
                        Send me email notifications for new mail previews
                      </label>
                    </div>
                  </div>

                  <Button onClick={handleSubscribe} className="w-full" size="lg">
                    Sign Up for Swift Preview
                  </Button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
                  <div className="text-center">
                    <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium">Preview Mail</h4>
                    <p className="text-sm text-gray-600">See images of your mail before delivery</p>
                  </div>
                  <div className="text-center">
                    <Bell className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium">Daily Notifications</h4>
                    <p className="text-sm text-gray-600">Get notified when new mail is coming</p>
                  </div>
                  <div className="text-center">
                    <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-medium">Secure & Private</h4>
                    <p className="text-sm text-gray-600">Your mail images are encrypted and secure</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Dashboard Section */
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                <span className="text-lg font-medium">Welcome to Swift Preview!</span>
              </div>
              <Badge variant="default">Active Subscription</Badge>
            </div>

            <Tabs defaultValue="today" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="today">Today's Mail</TabsTrigger>
                <TabsTrigger value="archive">Archive</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="mobile">Mobile App</TabsTrigger>
              </TabsList>

              {/* Today's Mail */}
              <TabsContent value="today">
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Mail Preview</CardTitle>
                    <CardDescription>
                      {previewItems.filter((item) => item.isNew).length} new items arriving today
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {previewItems
                        .filter((item) => item.isNew)
                        .map((item) => (
                          <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                              <Mail className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm">{item.sender}</h4>
                                <Badge variant="secondary" className="text-xs">
                                  New
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{item.type}</p>
                              <p className="text-xs text-gray-500">{item.date}</p>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1">
                                  <Eye className="mr-1 h-3 w-3" />
                                  View
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1">
                                  <Download className="mr-1 h-3 w-3" />
                                  Save
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Archive */}
              <TabsContent value="archive">
                <Card>
                  <CardHeader>
                    <CardTitle>Mail Archive</CardTitle>
                    <CardDescription>Previous mail previews (kept for 30 days)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {previewItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-sm">{item.sender}</p>
                              <p className="text-sm text-gray-600">{item.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">{item.date}</span>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Swift Preview Settings</CardTitle>
                    <CardDescription>Manage your mail preview preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Notification Preferences</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Daily email digest</span>
                          <Badge variant="default">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">SMS notifications</span>
                          <Badge variant="secondary">Disabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Push notifications</span>
                          <Badge variant="default">Enabled</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Privacy Settings</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Auto-delete after 30 days</span>
                          <Badge variant="default">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Share with household members</span>
                          <Badge variant="secondary">Disabled</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Mobile App */}
              <TabsContent value="mobile">
                <Card>
                  <CardHeader>
                    <CardTitle>Swift Preview Mobile App</CardTitle>
                    <CardDescription>Access your mail previews on the go</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Smartphone className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Download the Swift Courier App</h3>
                      <p className="text-gray-600 mb-6">
                        Get instant notifications and view your mail previews anywhere
                      </p>
                      <div className="flex justify-center gap-4">
                        <Button>Download for iOS</Button>
                        <Button variant="outline">Download for Android</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
