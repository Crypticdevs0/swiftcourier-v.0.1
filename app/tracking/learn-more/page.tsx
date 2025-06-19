import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, MapPin, Smartphone, Bell, Shield, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function TrackingLearnMorePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Package Tracking</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay informed every step of the way with our advanced real-time tracking system
          </p>
        </div>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How Package Tracking Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>1. Package Scanned</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your package receives a unique tracking number and is scanned at our facility when we receive it.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>2. Real-Time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track your package's journey with GPS-enabled updates at every checkpoint along the delivery route.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>3. Delivery Confirmation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receive instant notification when your package is delivered, including photo proof of delivery.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Tracking Features</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <Smartphone className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Mobile Tracking</CardTitle>
                <CardDescription>Track on any device, anywhere</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Mobile-optimized tracking page</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">QR code scanning for instant tracking</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Offline tracking history</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Bell className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Smart Notifications</CardTitle>
                <CardDescription>Stay updated automatically</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">SMS and email alerts</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Delivery window notifications</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Exception and delay alerts</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Live GPS Tracking</CardTitle>
                <CardDescription>See exactly where your package is</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Real-time GPS location</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Interactive delivery map</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Estimated delivery time</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>Your information is protected</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Encrypted tracking data</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Privacy-first approach</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Secure access controls</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tracking Status Explained */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Understanding Tracking Status</h2>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Package Received</h4>
                    <p className="text-sm text-gray-600">We've received your package at our facility</p>
                  </div>
                  <Badge variant="secondary">Initial</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">In Transit</h4>
                    <p className="text-sm text-gray-600">Your package is on its way to the destination</p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Out for Delivery</h4>
                    <p className="text-sm text-gray-600">Package is on the delivery vehicle</p>
                  </div>
                  <Badge variant="outline">Final Stage</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Delivered</h4>
                    <p className="text-sm text-gray-600">Package has been successfully delivered</p>
                  </div>
                  <Badge>Complete</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Track Your Package?</h2>
              <p className="mb-6 opacity-90">Enter your tracking number and experience our advanced tracking system</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/track">
                  <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                    <Package className="mr-2 h-4 w-4" />
                    Track Package Now
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
