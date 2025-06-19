"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MapPin, Truck, Package, Clock, Wifi, WifiOff } from "lucide-react"

interface TrackingUpdate {
  timestamp: string
  location: string
  status: string
  coordinates?: { lat: number; lng: number }
  estimatedDelivery?: string
}

interface RealTimeTrackerProps {
  trackingNumber: string
}

export function RealTimeTracker({ trackingNumber }: RealTimeTrackerProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [updates, setUpdates] = useState<TrackingUpdate[]>([])
  const [currentStatus, setCurrentStatus] = useState("Connecting...")
  const [progress, setProgress] = useState(0)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Simulate WebSocket connection
    const connectWebSocket = () => {
      setIsConnected(true)
      setCurrentStatus("In Transit")

      // Simulate real-time updates
      const interval = setInterval(() => {
        const mockUpdates: TrackingUpdate[] = [
          {
            timestamp: new Date().toISOString(),
            location: "Distribution Center - Chicago, IL",
            status: "Package scanned at facility",
            coordinates: { lat: 41.8781, lng: -87.6298 },
          },
          {
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            location: "Sorting Facility - Indianapolis, IN",
            status: "Package departed facility",
            coordinates: { lat: 39.7684, lng: -86.1581 },
          },
          {
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            location: "Origin Facility - New York, NY",
            status: "Package received",
            coordinates: { lat: 40.7128, lng: -74.006 },
          },
        ]

        setUpdates(mockUpdates)
        setProgress(Math.min(progress + 5, 85))
      }, 5000)

      return () => clearInterval(interval)
    }

    const cleanup = connectWebSocket()
    return cleanup
  }, [trackingNumber, progress])

  const handleReconnect = () => {
    setIsConnected(false)
    setCurrentStatus("Reconnecting...")
    setTimeout(() => {
      setIsConnected(true)
      setCurrentStatus("In Transit")
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Real-Time Tracking: {trackingNumber}
              </CardTitle>
              <CardDescription>Live updates via WebSocket connection</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <>
                  <Wifi className="h-4 w-4 text-green-600" />
                  <Badge variant="default" className="bg-green-600">
                    Connected
                  </Badge>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-600" />
                  <Badge variant="destructive">Disconnected</Badge>
                  <Button size="sm" variant="outline" onClick={handleReconnect}>
                    Reconnect
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Delivery Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Truck className="mr-2 h-4 w-4 text-blue-600" />
                <span className="font-medium">Status: {currentStatus}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="mr-1 h-4 w-4" />
                Est. Delivery: Dec 22, 2024
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Updates */}
      <Card>
        <CardHeader>
          <CardTitle>Live Updates</CardTitle>
          <CardDescription>Real-time package movement and status changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {updates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Waiting for updates...</p>
              </div>
            ) : (
              updates.map((update, index) => (
                <div key={index} className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{update.status}</p>
                      <Badge variant="outline" className="text-xs">
                        LIVE
                      </Badge>
                    </div>
                    <div className="flex items-center mt-1">
                      <MapPin className="mr-1 h-3 w-3 text-gray-500" />
                      <p className="text-sm text-gray-600">{update.location}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{new Date(update.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Live Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Live Tracking Map</CardTitle>
          <CardDescription>Real-time package location on interactive map</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Interactive map with live GPS tracking</p>
              <p className="text-sm text-gray-500">Updates every 30 seconds</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
