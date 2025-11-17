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
  Navigation,
  Zap,
} from "lucide-react"
import { LoadingSpinner, ProgressRing } from "./loading-spinner"

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
    const controller = new AbortController()
    fetchTrackingData(controller.signal)
    return () => controller.abort()
  }, [trackingNumber])

  // Update fetchTrackingData to accept an AbortSignal

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

  const fetchTrackingData = async (signal?: AbortSignal) => {
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
      const response = await fetch(`/api/tracking/${encodeURIComponent(trackingNumber)}`, { signal })
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
      // Ignore AbortError which happens when the component is unmounted or the request is cancelled
      if (err instanceof Error && (err as any).name === "AbortError") {
        return
      }
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
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50 to-indigo-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 pointer-events-none"></div>
          <CardHeader className="text-center pb-4 relative z-10">
            <CardTitle className="flex items-center justify-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-8 h-8 border-3 border-blue-300 border-b-transparent rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold text-xl">
                Processing Tracking Request
              </span>
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Retrieving real-time information for <span className="font-mono font-bold text-blue-600 text-base">{trackingNumber}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 relative z-10">
            <div className="text-center space-y-6">
              {/* Modern animated tracking icon */}
              <div className="flex justify-center mb-2">
                <div className="relative w-32 h-32">
                  {/* Outer gradient ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 animate-pulse"></div>

                  {/* Middle pulsing ring */}
                  <div className="absolute inset-1 rounded-full border-2 border-blue-300/50 animate-pulse" style={{ animationDelay: "0.2s" }}></div>

                  {/* Inner white container */}
                  <div className="absolute inset-3 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <div className="relative">
                      <Package className="h-12 w-12 text-blue-600 animate-bounce" />
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  {/* Rotating element indicator */}
                  <div className="absolute -top-2 left-1/2 w-2 h-2 bg-blue-600 rounded-full -translate-x-1/2 animate-spin origin-[16rem_16rem]"></div>
                </div>
              </div>

              <div>
                <p className="text-gray-700 font-semibold mb-2 text-lg">{loadingMessage}</p>
                <p className="text-gray-500 text-sm">This may take a few moments...</p>
              </div>
              
              {/* Enhanced progress display */}
              <div className="max-w-md mx-auto mb-6">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <ProgressRing progress={loadingProgress} size={60} />
                  <div className="text-left">
                    <div className="text-2xl font-bold text-blue-600">{loadingProgress}%</div>
                    <div className="text-sm text-gray-500">Complete</div>
                  </div>
                </div>
                <Progress value={loadingProgress} className="h-2 bg-gray-200" />
              </div>

              {/* Status indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className={`p-4 rounded-xl transition-all duration-500 border-2 ${loadingProgress >= 20 ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300 shadow-md' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full transition-all ${loadingProgress >= 20 ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50' : 'bg-gray-300'}`}></div>
                    <span className={`text-sm font-semibold ${loadingProgress >= 20 ? 'text-green-700' : 'text-gray-600'}`}>Connecting</span>
                  </div>
                </div>
                <div className={`p-4 rounded-xl transition-all duration-500 border-2 ${loadingProgress >= 60 ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300 shadow-md' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full transition-all ${loadingProgress >= 60 ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50' : 'bg-gray-300'}`}></div>
                    <span className={`text-sm font-semibold ${loadingProgress >= 60 ? 'text-green-700' : 'text-gray-600'}`}>Searching</span>
                  </div>
                </div>
                <div className={`p-4 rounded-xl transition-all duration-500 border-2 ${loadingProgress >= 95 ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300 shadow-md' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full transition-all ${loadingProgress >= 95 ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50' : 'bg-gray-300'}`}></div>
                    <span className={`text-sm font-semibold ${loadingProgress >= 95 ? 'text-green-700' : 'text-gray-600'}`}>Loading</span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-xl border-2 border-blue-200 shadow-md animate-pulse">
                <div className="flex items-center justify-center space-x-3 text-blue-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <p className="text-sm font-semibold">
                    Accessing real-time tracking data from our distribution centers
                  </p>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: "0.3s" }}></div>
                </div>
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
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-yellow-800 mb-2">No Information Available</h3>
            <p className="text-yellow-600">
              No tracking information could be found for the provided number.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Real-time Updates Indicator */}
      {realTimeUpdates && (packageData.status === "in_transit" || packageData.status === "out_for_delivery") && (
        <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md animate-in slide-in-from-top duration-300">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              </div>
              <p className="text-sm text-green-800 font-semibold">Real-time tracking active • Updates every 30 seconds</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Status Card */}
      <Card className="border-0 shadow-2xl hover:shadow-3xl transition-shadow duration-300 overflow-hidden animate-in slide-in-from-bottom duration-300">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <div className="animate-bounce">
                  {getStatusIcon(packageData.status)}
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Package Status
                </span>
              </CardTitle>
              <CardDescription className="mt-2 flex items-center space-x-1">
                <span className="text-gray-600">Tracking:</span>
                <span className="font-mono font-bold text-blue-600">{packageData.trackingNumber}</span>
              </CardDescription>
            </div>
            <Badge
              variant={packageData.status === "delivered" ? "default" : "secondary"}
              className={`${getStatusColor(packageData.status)} text-white px-4 py-2 text-sm font-bold animate-in fade-in duration-300 shadow-lg`}
            >
              {packageData.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 p-8 rounded-2xl border border-blue-100 shadow-sm animate-in slide-in-from-left duration-300">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <span>
                    {packageData.status === "delivered"
                      ? "✓ Delivered Successfully"
                      : packageData.status === "out_for_delivery"
                        ? "🚚 Out for Delivery"
                        : "📦 In Transit"}
                  </span>
                </h3>
                <div className="flex items-center text-gray-700 mb-3 text-lg">
                  <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                  <span className="font-semibold">{packageData.currentLocation}</span>
                </div>
                <div className="flex items-center text-gray-700 font-medium">
                  <Clock className="h-5 w-5 mr-3 text-blue-600" />
                  <span>
                    {packageData.status === "delivered"
                      ? `Delivered on ${formatDate(packageData.deliveredAt || packageData.estimatedDelivery)}`
                      : `Expected delivery: ${formatDate(packageData.estimatedDelivery)}`}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {packageData.progress}%
                </div>
                <div className="text-sm text-gray-600 font-medium mt-1">Complete</div>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <Progress value={packageData.progress} className="h-4 bg-gray-200 rounded-full" />
              <div className="flex justify-between text-xs text-gray-600">
                <span>Origin</span>
                <span>In Transit</span>
                <span>Destination</span>
                <span>Delivered</span>
              </div>
            </div>
          </div>

          {/* Package Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom duration-300">
            {/* Shipping Details */}
            <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3 bg-gradient-to-br from-blue-50 to-transparent border-b border-blue-100">
                <CardTitle className="text-base flex items-center font-bold">
                  <Package className="h-5 w-5 mr-2 text-blue-600" />
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
            <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3 bg-gradient-to-br from-indigo-50 to-transparent border-b border-indigo-100">
                <CardTitle className="text-base flex items-center font-bold">
                  <MapPin className="h-5 w-5 mr-2 text-indigo-600" />
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
