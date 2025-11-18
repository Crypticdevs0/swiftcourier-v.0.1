"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { QrCode, Download, Smartphone, Bell, MapPin, Camera, Star, AlertCircle, CheckCircle } from "lucide-react"

interface SMSState {
  loading: boolean
  error: string
  success: string
}

export default function MobilePage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [smsState, setSmsState] = useState<SMSState>({ loading: false, error: "", success: "" })

  const handleSendSMSLink = async () => {
    if (!phoneNumber.trim()) {
      setSmsState({ loading: false, error: "Please enter a phone number", success: "" })
      return
    }

    setSmsState({ loading: true, error: "", success: "" })

    try {
      const response = await fetch("/api/notifications/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          phoneNumber: phoneNumber.replace(/\D/g, ""),
          type: "app_download_link",
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSmsState({
          loading: false,
          error: "",
          success: "Download link sent! Check your text messages."
        })
        setPhoneNumber("")
      } else {
        setSmsState({
          loading: false,
          error: data.message || "Failed to send SMS",
          success: ""
        })
      }
    } catch (error) {
      setSmsState({
        loading: false,
        error: "Network error while sending SMS",
        success: ""
      })
      console.error("SMS error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Smartphone className="h-24 w-24 text-blue-600" />
              <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                <Bell className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Swift Courier Mobile App</h1>
          <p className="text-xl text-gray-600 mb-8">Track packages, schedule pickups, and manage shipments on the go</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => window.open("https://apps.apple.com/app/swift-courier", "_blank")}
            >
              <Download className="mr-2 h-5 w-5" />
              Download for iOS
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.open("https://play.google.com/store/apps/details?id=com.swiftcourier", "_blank")}
            >
              <Download className="mr-2 h-5 w-5" />
              Download for Android
            </Button>
          </div>
        </div>

        {/* App Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <QrCode className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="mb-2">QR Code Scanning</CardTitle>
              <CardDescription>Instantly track packages by scanning QR codes on shipping labels</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Bell className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="mb-2">Push Notifications</CardTitle>
              <CardDescription>Get real-time updates on package status, delivery attempts, and more</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <MapPin className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="mb-2">Live Tracking</CardTitle>
              <CardDescription>Follow your packages in real-time with GPS tracking and delivery maps</CardDescription>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="features" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
            <TabsTrigger value="download">Download</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Features Tab */}
          <TabsContent value="features">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Core Features</CardTitle>
                  <CardDescription>Essential tools for package management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Package Tracking</h4>
                      <p className="text-sm text-gray-600">Track multiple packages with real-time updates</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Pickup Scheduling</h4>
                      <p className="text-sm text-gray-600">Schedule package pickups from your location</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Address Book</h4>
                      <p className="text-sm text-gray-600">Save frequently used addresses for quick shipping</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Shipping Calculator</h4>
                      <p className="text-sm text-gray-600">Calculate shipping costs and delivery times</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Features</CardTitle>
                  <CardDescription>Premium tools for power users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Delivery Photos</h4>
                      <p className="text-sm text-gray-600">View proof of delivery photos instantly</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Package Intercept</h4>
                      <p className="text-sm text-gray-600">Redirect packages to new addresses</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Delivery Instructions</h4>
                      <p className="text-sm text-gray-600">Set special delivery instructions and preferences</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Offline Mode</h4>
                      <p className="text-sm text-gray-600">Access tracking info even without internet</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Screenshots Tab */}
          <TabsContent value="screenshots">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-4">
                  <div className="aspect-[9/16] bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <QrCode className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Tracking Screen</p>
                    </div>
                  </div>
                  <h4 className="font-medium">Package Tracking</h4>
                  <p className="text-sm text-gray-600">Real-time package status and location updates</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="aspect-[9/16] bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Camera className="h-12 w-12 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">QR Scanner</p>
                    </div>
                  </div>
                  <h4 className="font-medium">QR Code Scanner</h4>
                  <p className="text-sm text-gray-600">Scan shipping labels for instant tracking</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="aspect-[9/16] bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Live Map</p>
                    </div>
                  </div>
                  <h4 className="font-medium">Delivery Map</h4>
                  <p className="text-sm text-gray-600">Follow your package on an interactive map</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Download Tab */}
          <TabsContent value="download">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Download Swift Courier App</CardTitle>
                  <CardDescription>Available on iOS and Android devices</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      size="lg"
                      className="h-16 bg-black text-white hover:bg-gray-800"
                      onClick={() => window.open("https://apps.apple.com/app/swift-courier", "_blank")}
                    >
                      <div className="text-left">
                        <div className="text-xs">Download on the</div>
                        <div className="text-lg font-semibold">App Store</div>
                      </div>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-16"
                      onClick={() => window.open("https://play.google.com/store/apps/details?id=com.swiftcourier", "_blank")}
                    >
                      <div className="text-left">
                        <div className="text-xs">Get it on</div>
                        <div className="text-lg font-semibold">Google Play</div>
                      </div>
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">Or scan the QR code with your phone</p>
                    <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                      <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                        <QrCode className="h-16 w-16 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Get SMS Download Link</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Enter your phone number to receive a download link via text message
                    </p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1"
                      />
                      <Button>Send Link</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex justify-center items-center mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="ml-2 text-2xl font-bold">4.8</span>
                </div>
                <p className="text-gray-600">Based on 12,847 reviews</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">5 days ago</span>
                    </div>
                    <p className="text-sm text-gray-800 mb-2">
                      "Amazing app! The QR code scanner makes tracking so easy. Push notifications keep me updated
                      without having to check manually."
                    </p>
                    <p className="text-sm font-medium text-gray-600">- Sarah M.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">1 week ago</span>
                    </div>
                    <p className="text-sm text-gray-800 mb-2">
                      "Perfect for business use. I can track multiple packages and schedule pickups right from my phone.
                      Saves me so much time!"
                    </p>
                    <p className="text-sm font-medium text-gray-600">- Mike R.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <Star className="h-4 w-4 text-gray-300" />
                      </div>
                      <span className="ml-2 text-sm text-gray-600">2 weeks ago</span>
                    </div>
                    <p className="text-sm text-gray-800 mb-2">
                      "Great app overall. Love the delivery photos feature. Only wish it had dark mode support."
                    </p>
                    <p className="text-sm font-medium text-gray-600">- Jennifer L.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">3 weeks ago</span>
                    </div>
                    <p className="text-sm text-gray-800 mb-2">
                      "The live tracking feature is incredible. I can see exactly where my package is in real-time. Best
                      courier app I've used!"
                    </p>
                    <p className="text-sm font-medium text-gray-600">- David K.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
