"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MapPin, Truck, Package, Clock, Wifi, AlertCircle } from "lucide-react"

interface TrackingUpdate {
  timestamp: string
  location: string
  status: string
  coordinates?: { lat: number; lng: number }
  estimatedDelivery?: string
}

interface RealTimeTrackerProps {
  trackingNumber: string
  onError?: (error: Error) => void
}

type ConnectionState = "disconnected" | "connecting" | "connected" | "error"

export function RealTimeTrackerFixed({ trackingNumber, onError }: RealTimeTrackerProps) {
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected")
  const [updates, setUpdates] = useState<TrackingUpdate[]>([])
  const [currentStatus, setCurrentStatus] = useState("Initializing...")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  // Memoized mock data to prevent unnecessary re-renders
  const mockUpdates = useMemo<TrackingUpdate[]>(
    () => [
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
    ],
    [],
  )

  // Cleanup function
  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current)
      updateIntervalRef.current = null
    }
  }, [])

  // WebSocket connection with proper error handling
  const connectWebSocket = useCallback(() => {
    if (connectionState === "connecting") return

    setConnectionState("connecting")
    setError(null)

    try {
      // In a real implementation, this would be an actual WebSocket connection
      // For demo purposes, we'll simulate the connection

      // Simulate connection delay
      setTimeout(() => {
        if (reconnectAttempts.current < maxReconnectAttempts) {
          setConnectionState("connected")
          setCurrentStatus("In Transit")
          reconnectAttempts.current = 0

          // Start mock updates
          updateIntervalRef.current = setInterval(() => {
            setUpdates(mockUpdates)
            setProgress((prev) => Math.min(prev + 5, 85))
          }, 5000)
        } else {
          setConnectionState("error")
          setError("Maximum reconnection attempts reached")
          onError?.(new Error("WebSocket connection failed"))
        }
      }, 2000)
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Connection failed")
      setConnectionState("error")
      setError(error.message)
      onError?.(error)

      // Attempt reconnection with exponential backoff
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.pow(2, reconnectAttempts.current) * 1000
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttempts.current++
          connectWebSocket()
        }, delay)
      }
    }
  }, [connectionState, mockUpdates, onError])

  // Manual reconnection
  const handleReconnect = useCallback(() => {
    cleanup()
    reconnectAttempts.current = 0
    setConnectionState("disconnected")
    connectWebSocket()
  }, [cleanup, connectWebSocket])

  // Initialize connection
  useEffect(() => {
    connectWebSocket()
    return cleanup
  }, [trackingNumber]) // Only depend on trackingNumber

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  const isConnected = connectionState === "connected"
  const isConnecting = connectionState === "connecting"
  const hasError = connectionState === "error"

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
              {isConnected && (
                <>
                  <Wifi className="h-4 w-4 text-green-600" aria-hidden="true" />
                  <Badge variant="default" className="bg-green-600">
                    Connected
                  </Badge>
                </>
              )}
              {isConnecting && (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                  <Badge variant="secondary">Connecting...</Badge>
                </>
              )}
              {hasError && (
                <>
                  <AlertCircle className="h-4 w-4 text-red-600" aria-hidden="true" />
                  <Badge variant="destructive">Error</Badge>
                  <Button size="sm" variant="outline" onClick={handleReconnect}>
                    Retry
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Delivery Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" aria-label={`Delivery progress: ${progress}%`} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Truck className="mr-2 h-4 w-4 text-blue-600" aria-hidden="true" />
                <span className="font-medium">Status: {currentStatus}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="mr-1 h-4 w-4" aria-hidden="true" />
                <time dateTime="2024-12-22">Est. Delivery: Dec 22, 2024</time>
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
          <div className="space-y-4" role="log" aria-live="polite" aria-label="Package tracking updates">
            {updates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" aria-hidden="true" />
                <p>Waiting for updates...</p>
              </div>
            ) : (
              updates.map((update, index) => (
                <div key={index} className="flex items-start space-x-3 pb-4 border-b last:border-b-0" role="listitem">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{update.status}</p>
                      <Badge variant="outline" className="text-xs">
                        LIVE
                      </Badge>
                    </div>
                    <div className="flex items-center mt-1">
                      <MapPin className="mr-1 h-3 w-3 text-gray-500" aria-hidden="true" />
                      <p className="text-sm text-gray-600">{update.location}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      <time dateTime={update.timestamp}>{new Date(update.timestamp).toLocaleString()}</time>
                    </p>
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
          <div
            className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center"
            role="img"
            aria-label="Interactive tracking map placeholder"
          >
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" aria-hidden="true" />
              <p className="text-gray-600">Interactive map with live GPS tracking</p>
              <p className="text-sm text-gray-500">Updates every 30 seconds</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
