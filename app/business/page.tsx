import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, TrendingUp, Users, BarChart3, Mail, Globe, Calculator, Headphones } from "lucide-react"

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Swift Courier Business Solutions</h1>
            <p className="text-xl mb-8 opacity-90">
              Streamline your shipping operations with enterprise-grade tools and dedicated support
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Business Stats */}
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

        {/* Services Tabs */}
        <Tabs defaultValue="shipping" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="shipping">Bulk Shipping</TabsTrigger>
            <TabsTrigger value="marketing">Direct Mail</TabsTrigger>
            <TabsTrigger value="analytics">Swift Insights</TabsTrigger>
            <TabsTrigger value="api">Developer APIs</TabsTrigger>
          </TabsList>

          <TabsContent value="shipping" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Volume Discounts</CardTitle>
                  <CardDescription>Save more as you ship more with our tiered pricing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>1-100 packages/month</span>
                      <Badge variant="secondary">5% discount</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>101-500 packages/month</span>
                      <Badge variant="secondary">10% discount</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>500+ packages/month</span>
                      <Badge>15% discount</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Features</CardTitle>
                  <CardDescription>Advanced tools for enterprise shipping</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      Batch label printing
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      Address validation
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      Automated pickup scheduling
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      Custom packaging options
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      Dedicated account manager
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="marketing" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <Mail className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Every Door Direct Mail</CardTitle>
                  <CardDescription>
                    Reach every address in your target area without needing specific addresses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    <li>• Target by ZIP code or carrier route</li>
                    <li>• No address list required</li>
                    <li>• Affordable bulk rates</li>
                    <li>• Online mapping tools</li>
                  </ul>
                  <Button className="w-full">Learn More</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Targeted Marketing</CardTitle>
                  <CardDescription>Precision marketing campaigns with detailed analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    <li>• Demographic targeting</li>
                    <li>• Campaign performance tracking</li>
                    <li>• A/B testing capabilities</li>
                    <li>• ROI measurement tools</li>
                  </ul>
                  <Button className="w-full">Get Started</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Swift Insights Dashboard</CardTitle>
                <CardDescription>Comprehensive analytics for your shipping operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Delivery Analytics</h4>
                    <p className="text-sm text-gray-600">Track delivery performance and identify trends</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Cost Analysis</h4>
                    <p className="text-sm text-gray-600">Monitor shipping costs and optimize spending</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Route Optimization</h4>
                    <p className="text-sm text-gray-600">Improve efficiency with smart routing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Developer-Friendly APIs</CardTitle>
                  <CardDescription>Integrate Swift Courier services into your applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold">Shipping API</h4>
                      <p className="text-sm text-gray-600">Calculate rates, create labels, track packages</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold">Address Validation API</h4>
                      <p className="text-sm text-gray-600">Verify and standardize addresses</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold">Tracking API</h4>
                      <p className="text-sm text-gray-600">Real-time package tracking updates</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Features</CardTitle>
                  <CardDescription>Everything you need for seamless integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      RESTful API design
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      Comprehensive documentation
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      Sandbox environment
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      Rate limiting and authentication
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      24/7 developer support
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Business Shipping?</h2>
            <p className="mb-6 opacity-90">
              Join thousands of businesses that trust Swift Courier for their shipping needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                <Headphones className="mr-2 h-4 w-4" />
                Contact Sales
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                View Pricing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
