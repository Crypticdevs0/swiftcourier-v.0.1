import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Shield, Clock, Globe, Mail, Phone, MessageSquare, CheckCircle } from "lucide-react"

export default function SwiftBoxPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Swift Box</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Virtual mailbox services with premium street addressing for businesses and individuals
          </p>
        </div>

        {/* Service Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="mb-2">Premium Addresses</CardTitle>
              <CardDescription>Professional street addresses in major business districts</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="mb-2">Secure & Private</CardTitle>
              <CardDescription>Bank-level security with 24/7 monitoring and access control</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="mb-2">Global Access</CardTitle>
              <CardDescription>Manage your mail from anywhere in the world</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How Swift Box Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  1
                </div>
                <CardTitle>Choose Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Select from premium business addresses in major cities across the country.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  2
                </div>
                <CardTitle>Receive Mail</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Your mail is received at our secure facility and immediately processed.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  3
                </div>
                <CardTitle>Get Notified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Receive instant notifications with digital previews of your mail.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  4
                </div>
                <CardTitle>Manage Online</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Forward, scan, shred, or store your mail with simple online controls.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Service Plans */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Service Plans</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>Perfect for personal use</CardDescription>
                <div className="text-3xl font-bold text-blue-600">
                  $19.99<span className="text-sm font-normal">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Premium street address</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Mail notifications</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">5 mail forwards/month</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Digital mail preview</span>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Contact for Setup
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500 bg-blue-50">
              <CardHeader>
                <CardTitle>Professional</CardTitle>
                <CardDescription>Ideal for small businesses</CardDescription>
                <div className="text-3xl font-bold text-blue-600">
                  $49.99<span className="text-sm font-normal">/month</span>
                </div>
                <Badge>Most Popular</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Everything in Basic</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">20 mail forwards/month</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Mail scanning service</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Package receiving</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Business registration support</span>
                </div>
                <Button className="w-full mt-4">Contact for Setup</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For large organizations</CardDescription>
                <div className="text-3xl font-bold text-blue-600">Custom</div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Everything in Professional</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Unlimited mail forwards</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Dedicated account manager</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Custom integrations</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Priority support</span>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Premium Features</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <MapPin className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Premium Locations</CardTitle>
                <CardDescription>Choose from prestigious business addresses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold">Manhattan, NY</h4>
                  <p className="text-sm text-gray-600">Wall Street & Midtown locations</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold">Beverly Hills, CA</h4>
                  <p className="text-sm text-gray-600">Rodeo Drive business district</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold">Downtown Chicago, IL</h4>
                  <p className="text-sm text-gray-600">Loop financial district</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>24/7 Mail Management</CardTitle>
                <CardDescription>Complete control over your mail delivery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Instant mail notifications</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">High-resolution scanning</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Secure mail forwarding</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Mail storage & archiving</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Secure document shredding</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Management Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready for Your Premium Virtual Mailbox?</h2>
            <p className="mb-6 opacity-90">
              Contact our management team to set up your Swift Box service and get your premium address
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <Phone className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Call Us</h3>
                <p className="text-sm opacity-90">1-800-SWIFT-BOX</p>
                <p className="text-xs opacity-75">Mon-Fri 8AM-8PM EST</p>
              </div>

              <div className="text-center">
                <Mail className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Email Us</h3>
                <p className="text-sm opacity-90">swiftbox@swiftcourier.com</p>
                <p className="text-xs opacity-75">Response within 1 hour</p>
              </div>

              <div className="text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Live Chat</h3>
                <p className="text-sm opacity-90">Available 24/7</p>
                <p className="text-xs opacity-75">Instant support</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                <Phone className="mr-2 h-4 w-4" />
                Schedule Setup Call
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                <Mail className="mr-2 h-4 w-4" />
                Get Custom Quote
              </Button>
            </div>

            <div className="mt-6 p-4 bg-white/10 rounded-lg">
              <p className="text-sm">
                <strong>Premium Service Notice:</strong> Swift Box requires identity verification and setup by our
                management team. All premium addresses are subject to availability and approval.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
