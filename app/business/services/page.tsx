import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MessageSquare, Building2, TrendingUp, Users, BarChart3 } from "lucide-react"

export default function BusinessServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Business Services</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive bulk mailing, marketing solutions, and business discounts for enterprises
          </p>
        </div>

        {/* Service Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-sm text-gray-600">Business Customers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">25%</div>
              <div className="text-sm text-gray-600">Average Cost Savings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">99.8%</div>
              <div className="text-sm text-gray-600">Customer Satisfaction</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-gray-600">Business Support</div>
            </CardContent>
          </Card>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <Mail className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Bulk Mailing Services</CardTitle>
              <CardDescription>
                Streamline your direct mail campaigns with our comprehensive bulk mailing solutions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Standard Bulk Mail</span>
                  <Badge variant="secondary">Starting at $0.35/piece</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>First-Class Presort</span>
                  <Badge variant="secondary">Starting at $0.48/piece</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Every Door Direct Mail</span>
                  <Badge>Starting at $0.20/piece</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Features Include:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Address validation and standardization</li>
                  <li>• NCOA (National Change of Address) processing</li>
                  <li>• Postal presorting and optimization</li>
                  <li>• Delivery confirmation tracking</li>
                  <li>• Campaign performance analytics</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Marketing Solutions</CardTitle>
              <CardDescription>
                Data-driven marketing campaigns with targeted delivery and comprehensive analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold">Targeted Demographics</h4>
                  <p className="text-sm text-gray-600">Reach specific audiences based on income, age, interests</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold">Geographic Targeting</h4>
                  <p className="text-sm text-gray-600">ZIP code, radius, and carrier route targeting</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold">Campaign Analytics</h4>
                  <p className="text-sm text-gray-600">Detailed ROI tracking and performance metrics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Discounts */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Volume Discount Tiers</CardTitle>
            <CardDescription>Save more as your business grows with our tiered pricing structure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Starter</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">5%</div>
                <p className="text-sm text-gray-600 mb-4">1-100 pieces/month</p>
                <ul className="text-sm space-y-1">
                  <li>• Basic analytics</li>
                  <li>• Email support</li>
                  <li>• Standard processing</li>
                </ul>
              </div>

              <div className="text-center p-6 border-2 border-blue-500 rounded-lg bg-blue-50">
                <h3 className="text-lg font-semibold mb-2">Professional</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">15%</div>
                <p className="text-sm text-gray-600 mb-4">101-1,000 pieces/month</p>
                <Badge className="mb-4">Most Popular</Badge>
                <ul className="text-sm space-y-1">
                  <li>• Advanced analytics</li>
                  <li>• Priority support</li>
                  <li>• Expedited processing</li>
                  <li>• Account manager</li>
                </ul>
              </div>

              <div className="text-center p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Enterprise</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">25%</div>
                <p className="text-sm text-gray-600 mb-4">1,000+ pieces/month</p>
                <ul className="text-sm space-y-1">
                  <li>• Custom analytics</li>
                  <li>• 24/7 dedicated support</li>
                  <li>• Same-day processing</li>
                  <li>• Dedicated account team</li>
                  <li>• Custom integrations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Management Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Business Mailing?</h2>
            <p className="mb-6 opacity-90">
              Contact our business solutions team to discuss your specific needs and get a custom quote
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <Phone className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Call Us</h3>
                <p className="text-sm opacity-90">1-800-SWIFT-BIZ</p>
                <p className="text-xs opacity-75">Mon-Fri 8AM-8PM EST</p>
              </div>

              <div className="text-center">
                <Mail className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Email Us</h3>
                <p className="text-sm opacity-90">business@swiftcourier.com</p>
                <p className="text-xs opacity-75">Response within 2 hours</p>
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
                Schedule Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                <Mail className="mr-2 h-4 w-4" />
                Request Quote
              </Button>
            </div>

            <div className="mt-6 p-4 bg-white/10 rounded-lg">
              <p className="text-sm">
                <strong>Note:</strong> Business services require approval and setup by our management team. Contact us
                to begin the onboarding process and unlock enterprise-grade shipping solutions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
