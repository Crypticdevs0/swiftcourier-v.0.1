"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Package,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  Calendar,
  Weight,
  Ruler,
  DollarSign,
  Building,
  Phone,
  Mail,
  AlertCircle,
  RefreshCw,
  Loader2,
} from "lucide-react"

interface TrackingEvent {
  id: string
  timestamp: string
  location: string
  status: string
  description: string
  facilityType?: "origin" | "transit" | "destination" | "delivery"
}

interface Address {
  name: string
  address: string
  city: string
  state: string
  zip: string
}

interface PackageData {
  trackingNumber: string
  status: string
  estimatedDelivery: string
  currentLocation: string
  progress: number
  recipient: Address
  sender: Address
  service: string
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  events: TrackingEvent[]
  createdAt: string
  deliveredAt?: string
  cost?: number
}

interface USPSStyleTrackerProps {
  trackingNumber: string
  onError?: (error: Error) => void
}

export function USPSStyleTracker({ trackingNumber, onError }: USPSStyleTrackerProps) {
  const [packageData, setPackageData] = useState<PackageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState("Initializing tracking request...")
  const [realTimeUpdates, setRealTimeUpdates] = useState(false)

  useEffect(() => {
    fetchTrackingData()
  }, [trackingNumber])

  // Real-time updates simulation
  useEffect(() => {
    if (packageData && realTimeUpdates) {
      const interval = setInterval(() => {
        // Simulate real-time location updates for in-transit packages
        if (packageData.status === "in_transit" || packageData.status === "out_for_delivery") {
          setPackageData((prev) => {
            if (!prev) return prev

            // Simulate progress updates
            const newProgress = Math.min(prev.progress + Math.random() * 2, 95)

            return {
              ...prev,
              progress: newProgress,
              currentLocation: newProgress > 85 ? "Out for delivery - Local facility" : prev.currentLocation,
            }
          })
        }
      }, 30000) // Update every 30 seconds

      return () => clearInterval(interval)
    }
  }, [packageData, realTimeUpdates])

  const fetchTrackingData = async () => {
    try {
      setLoading(true)
      setError(null)
      setLoadingProgress(0)
      setRealTimeUpdates(false)

      // Enhanced 5-second loading simulation with realistic messages
      const loadingSteps = [
        { progress: 0, message: "Connecting to Swift Courier tracking system..." },
        { progress: 20, message: "Authenticating tracking request..." },
        { progress: 40, message: "Searching package database..." },
        { progress: 60, message: "Retrieving package information..." },
        { progress: 80, message: "Loading tracking history..." },
        { progress: 95, message: "Finalizing tracking details..." },
        { progress: 100, message: "Tracking data ready!" },
      ]

      for (let i = 0; i < loadingSteps.length; i++) {
        const step = loadingSteps[i]
        setLoadingProgress(step.progress)
        setLoadingMessage(step.message)

        // Wait longer for the first few steps to create anticipation
        const delay = i < 3 ? 1000 : 500
        await new Promise((resolve) => setTimeout(resolve, delay))
      }

      // Fetch actual data
      const response = await fetch(`/api/tracking/${encodeURIComponent(trackingNumber)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      if (data.success) {
        setPackageData(data.data)
        setRealTimeUpdates(true) // Enable real-time updates after successful load
      } else {
        throw new Error(data.message || "Failed to fetch tracking data")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch tracking data"
      setError(errorMessage)
      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage))
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500"
      case "out_for_delivery":
        return "bg-blue-500"
      case "in_transit":
        return "bg-yellow-500"
      case "picked_up":
        return "bg-orange-500"
      case "pending":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "out_for_delivery":
        return <Truck className="h-5 w-5 text-blue-600" />
      case "in_transit":
        return <Package className="h-5 w-5 text-yellow-600" />
      case "picked_up":
        return <Package className="h-5 w-5 text-orange-600" />
      default:
        return <Package className="h-5 w-5 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              <span>Processing Tracking Request</span>
            </CardTitle>
            <CardDescription>Retrieving real-time information for {trackingNumber}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-gray-600 font-medium mb-4">{loadingMessage}</p>
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{loadingProgress}%</span>
                </div>
                <Progress value={loadingProgress} className="h-3" />
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Accessing real-time tracking data from our network of distribution centers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">Tracking Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Button
                onClick={fetchTrackingData}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <p className="text-xs text-red-600">If the problem persists, please contact customer support</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!packageData) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Real-time Updates Indicator */}
      {realTimeUpdates && (packageData.status === "in_transit" || packageData.status === "out_for_delivery") && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-green-800 font-medium">Real-time tracking active - Updates every 30 seconds</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Status Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                {getStatusIcon(packageData.status)}
                <span>Package Status</span>
              </CardTitle>
              <CardDescription>Tracking Number: {packageData.trackingNumber}</CardDescription>
            </div>
            <Badge
              variant={packageData.status === "delivered" ? "default" : "secondary"}
              className={`${getStatusColor(packageData.status)} text-white px-3 py-1`}
            >
              {packageData.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {packageData.status === "delivered"
                    ? "Delivered Successfully"
                    : packageData.status === "out_for_delivery"
                      ? "Out for Delivery"
                      : "In Transit"}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{packageData.currentLocation}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    {packageData.status === "delivered"
                      ? `Delivered on ${formatDate(packageData.deliveredAt || packageData.estimatedDelivery)}`
                      : `Expected delivery: ${formatDate(packageData.estimatedDelivery)}`}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{packageData.progress}%</div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={packageData.progress} className="h-3" />
            </div>
          </div>

          {/* Package Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Details */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  Shipping Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{packageData.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Weight className="h-3 w-3 mr-1" />
                    Weight:
                  </span>
                  <span className="font-medium">{packageData.weight} lbs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Ruler className="h-3 w-3 mr-1" />
                    Dimensions:
                  </span>
                  <span className="font-medium">
                    {packageData.dimensions.length}" × {packageData.dimensions.width}" × {packageData.dimensions.height}
                    "
                  </span>
                </div>
                {packageData.cost && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Cost:
                    </span>
                    <span className="font-medium">${packageData.cost}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-gray-600 text-sm mb-1">Delivering to:</div>
                  <div className="font-medium">{packageData.recipient.name}</div>
                  <div className="text-sm text-gray-600">
                    {packageData.recipient.address}
                    <br />
                    {packageData.recipient.city}, {packageData.recipient.state} {packageData.recipient.zip}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-gray-600 text-sm mb-1">From:</div>
                  <div className="font-medium">{packageData.sender.name}</div>
                  <div className="text-sm text-gray-600">
                    {packageData.sender.city}, {packageData.sender.state}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Tracking History */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Tracking History</span>
          </CardTitle>
          <CardDescription>Complete journey of your package</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {packageData.events.map((event, index) => (
              <div key={event.id} className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      index === 0 ? getStatusColor(packageData.status) : "bg-gray-300"
                    }`}
                  ></div>
                  {index < packageData.events.length - 1 && <div className="w-px h-12 bg-gray-200 mt-2"></div>}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900">{event.status.replace("_", " ").toUpperCase()}</h4>
                    {index === 0 && (
                      <Badge variant="outline" className="text-xs">
                        Latest
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {event.location}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(event.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Actions */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Mail className="h-4 w-4 mr-2" />
              Email Updates
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Phone className="h-4 w-4 mr-2" />
              SMS Alerts
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Delivery
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Building className="h-4 w-4 mr-2" />
              Hold at Location
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none" onClick={fetchTrackingData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
