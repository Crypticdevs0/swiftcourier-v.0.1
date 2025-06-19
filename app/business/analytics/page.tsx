"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Package, DollarSign, Clock, MapPin, Download } from "lucide-react"

export default function BusinessAnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d")

  const analyticsData = {
    overview: {
      totalShipments: 1247,
      totalSpent: 15420.5,
      avgDeliveryTime: 2.3,
      onTimeDelivery: 98.2,
    },
    trends: [
      { month: "Jul", shipments: 180, cost: 2100 },
      { month: "Aug", shipments: 220, cost: 2650 },
      { month: "Sep", shipments: 195, cost: 2300 },
      { month: "Oct", shipments: 240, cost: 2890 },
      { month: "Nov", shipments: 210, cost: 2480 },
      { month: "Dec", shipments: 202, cost: 2400 },
    ],
    topDestinations: [
      { city: "Los Angeles, CA", count: 156, percentage: 12.5 },
      { city: "Chicago, IL", count: 134, percentage: 10.7 },
      { city: "Houston, TX", count: 98, percentage: 7.9 },
      { city: "Phoenix, AZ", count: 87, percentage: 7.0 },
      { city: "Philadelphia, PA", count: 76, percentage: 6.1 },
    ],
    serviceBreakdown: [
      { service: "Swift Standard", count: 623, percentage: 50.0 },
      { service: "Swift Express", count: 374, percentage: 30.0 },
      { service: "Swift Overnight", count: 187, percentage: 15.0 },
      { service: "International", count: 63, percentage: 5.0 },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Swift Insights</h1>
            <p className="text-gray-600">Comprehensive analytics for your shipping operations</p>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Shipments</p>
                  <p className="text-2xl font-bold">{analyticsData.overview.totalShipments.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% vs last period
                  </p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold">${analyticsData.overview.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8% vs last period
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Delivery Time</p>
                  <p className="text-2xl font-bold">{analyticsData.overview.avgDeliveryTime} days</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    -0.2 days improved
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">On-Time Delivery</p>
                  <p className="text-2xl font-bold">{analyticsData.overview.onTimeDelivery}%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +0.5% vs last period
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="trends">Shipping Trends</TabsTrigger>
            <TabsTrigger value="destinations">Top Destinations</TabsTrigger>
            <TabsTrigger value="services">Service Breakdown</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          </TabsList>

          {/* Shipping Trends */}
          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Volume & Cost Trends</CardTitle>
                <CardDescription>Monthly shipping activity over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Interactive chart would be displayed here</p>
                    <p className="text-sm text-gray-500">Showing shipment volume and cost trends</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
                  {analyticsData.trends.map((month) => (
                    <div key={month.month} className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium">{month.month}</p>
                      <p className="text-sm text-gray-600">{month.shipments} shipments</p>
                      <p className="text-sm text-gray-600">${month.cost}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Top Destinations */}
          <TabsContent value="destinations">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Top Shipping Destinations</CardTitle>
                  <CardDescription>Most frequent delivery locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topDestinations.map((destination, index) => (
                      <div key={destination.city} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{destination.city}</p>
                            <p className="text-sm text-gray-600">{destination.count} shipments</p>
                          </div>
                        </div>
                        <Badge variant="outline">{destination.percentage}%</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>Shipment distribution by region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Interactive map would be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Service Breakdown */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Service Type Analysis</CardTitle>
                <CardDescription>Breakdown of shipping services used</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    {analyticsData.serviceBreakdown.map((service) => (
                      <div key={service.service} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{service.service}</p>
                          <p className="text-sm text-gray-600">{service.count} shipments</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{service.percentage}%</Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Service distribution chart</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance */}
          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Performance</CardTitle>
                  <CardDescription>On-time delivery rates by service type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Swift Overnight</span>
                      <Badge variant="default">99.5%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Swift Express</span>
                      <Badge variant="default">98.8%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Swift Standard</span>
                      <Badge variant="default">97.2%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="font-medium">International</span>
                      <Badge variant="secondary">94.1%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Issue Resolution</CardTitle>
                  <CardDescription>Claims and customer service metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Claims Filed</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Claims Resolved</span>
                      <span className="font-medium">21</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg Resolution Time</span>
                      <span className="font-medium">2.1 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Customer Satisfaction</span>
                      <Badge variant="default">4.8/5</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cost Analysis */}
          <TabsContent value="costs">
            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis & Savings</CardTitle>
                <CardDescription>Detailed breakdown of shipping costs and potential savings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Cost by Service</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Swift Standard</span>
                        <span>$7,850</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Swift Express</span>
                        <span>$5,240</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Swift Overnight</span>
                        <span>$2,130</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>International</span>
                        <span>$200</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Volume Discounts</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Base Rate</span>
                        <span>$17,890</span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Volume Discount (15%)</span>
                        <span>-$2,470</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium border-t pt-2">
                        <span>Total Paid</span>
                        <span>$15,420</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Optimization Opportunities</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-green-600">• Switch 20% of Express to Standard: Save $480/month</p>
                      <p className="text-blue-600">• Consolidate shipments: Save $320/month</p>
                      <p className="text-purple-600">• Use drop-off locations: Save $150/month</p>
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
