import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, MapPin, Clock, Shield, Globe } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Swift Courier: Your Trusted Delivery Partner</h1>
            <p className="text-xl mb-8 opacity-90">
              Fast, reliable, and secure delivery services for individuals and businesses nationwide
            </p>

            {/* Quick Tracking */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Track Your Package</h3>
              <div className="flex gap-2 max-w-md mx-auto">
                <div className="w-full">
                  <Label htmlFor="tracking-number" className="sr-only">
                    Tracking Number
                  </Label>
                  <Input
                    id="tracking-number"
                    placeholder="Enter tracking number"
                    className="bg-white text-black"
                  />
                </div>
                <Link href="/tracking">
                  <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                    Track
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/swiftship">
                <Button variant="secondary" className="w-full bg-white text-blue-600 hover:bg-gray-100 h-12">
                  <Package className="mr-2 h-4 w-4" />
                  SwiftShip
                </Button>
              </Link>
              <Link href="/locations">
                <Button variant="secondary" className="w-full bg-white text-blue-600 hover:bg-gray-100 h-12">
                  <MapPin className="mr-2 h-4 w-4" />
                  Find Locations
                </Button>
              </Link>
              <Link href="/schedule-pickup">
                <Button variant="secondary" className="w-full bg-white text-blue-600 hover:bg-gray-100 h-12">
                  <Truck className="mr-2 h-4 w-4" />
                  Schedule Pickup
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Package className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Package Tracking</CardTitle>
                <CardDescription>Real-time tracking for domestic and international shipments</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/tracking/learn-more">
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Truck className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>SwiftShip</CardTitle>
                <CardDescription>Calculate costs, print labels, and schedule pickups online</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/swiftship">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>International Shipping</CardTitle>
                <CardDescription>Worldwide delivery with customs support and tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/shipping/international">
                  <Button variant="outline" className="w-full">
                    Ship Globally
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Swift Preview</CardTitle>
                <CardDescription>Digital previews of your incoming mail delivered daily</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/auth">
                  <Button variant="outline" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Business Services</CardTitle>
                <CardDescription>Bulk mailing, marketing solutions, and business discounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/business/services">
                  <Button variant="outline" className="w-full">
                    For Business
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <MapPin className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Swift Box</CardTitle>
                <CardDescription>Virtual mailbox services with premium street addressing</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/swift-box">
                  <Button variant="outline" className="w-full">
                    Get Virtual Box
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">100M+</div>
              <div className="text-gray-600">Addresses Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600">Delivery Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">2020</div>
              <div className="text-gray-600">Established</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
