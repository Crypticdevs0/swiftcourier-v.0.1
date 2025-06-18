"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, MapPin, Clock, CheckCircle, Truck } from "lucide-react"

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [trackingData, setTrackingData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleTrack = async () => {
    if (!trackingNumber.trim()) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setTrackingData({
        trackingNumber: trackingNumber,
        status: "In Transit",
        estimatedDelivery: "December 20, 2024",
        currentLocation: "Distribution Center - Chicago, IL",
        progress: 75,
        events: [
          {
            date: "Dec 18, 2024 2:30 PM",
            location: "Distribution Center - Chicago, IL",
            status: "Package arrived at facility",
            icon: <Truck className="h-4 w-4" />,
          },
          {
            date: "Dec 18, 2024 8:15 AM",
            location: "Origin Facility - New York, NY",
            status: "Package departed facility",
            icon: <Package className="h-4 w-4" />,
          },
          {
            date: "Dec 17, 2024 6:45 PM",
            location: "Origin Facility - New York, NY",
            status: "Package received",
            icon: <CheckCircle className="h-4 w-4" />,
          },
        ],
      })
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Package</h1>
          <p className="text-gray-600">Enter your tracking number to get real-time updates</p>
        </div>

        {/* Tracking Input */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Package Tracking
            </CardTitle>
            <CardDescription>Enter your Swift Courier tracking number (e.g., SC1234567890)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleTrack} disabled={isLoading}>
                {isLoading ? "Tracking..." : "Track Package"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-6">
            {/* Status Overview */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Tracking Number: {trackingData.trackingNumber}</CardTitle>
                    <CardDescription className="flex items-center mt-2">
                      <MapPin className="mr-1 h-4 w-4" />
                      Current Location: {trackingData.currentLocation}
                    </CardDescription>
                  </div>
                  <Badge variant={trackingData.status === "Delivered" ? "default" : "secondary"}>
                    {trackingData.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Delivery Progress</span>
                      <span>{trackingData.progress}%</span>
                    </div>
                    <Progress value={trackingData.progress} className="h-2" />
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="mr-1 h-4 w-4" />
                    Estimated Delivery: {trackingData.estimatedDelivery}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking History */}
            <Card>
              <CardHeader>
                <CardTitle>Tracking History</CardTitle>
                <CardDescription>Latest updates for your package</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingData.events.map((event: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
                      <div className="flex-shrink-0 mt-1 text-blue-600">{event.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{event.status}</p>
                        <p className="text-sm text-gray-600">{event.location}</p>
                        <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="w-full">
                    Schedule Redelivery
                  </Button>
                  <Button variant="outline" className="w-full">
                    Hold at Location
                  </Button>
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sample Tracking Numbers */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Try Sample Tracking Numbers</CardTitle>
            <CardDescription>Test the tracking system with these sample numbers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-mono text-sm">SC1234567890</p>
                <p className="text-xs text-gray-600">In Transit - Chicago, IL</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-mono text-sm">SC0987654321</p>
                <p className="text-xs text-gray-600">Delivered - New York, NY</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
