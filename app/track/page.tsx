"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RealTimeTrackerFixed } from "@/components/real-time-tracker-fixed"
import { ErrorBoundary } from "@/components/error-boundary"
import { Search, Package } from "lucide-react"

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isTracking, setIsTracking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTrack = () => {
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number")
      return
    }

    setError(null)
    setIsTracking(true)
  }

  const handleTrackingError = (error: Error) => {
    console.error("Tracking error:", error)
    setError(error.message)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Package</h1>
          <p className="text-gray-600">Enter your tracking number to get real-time updates</p>
        </div>

        {!isTracking ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Package Tracking
              </CardTitle>
              <CardDescription>Enter your tracking number below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="tracking-input" className="text-sm font-medium">
                  Tracking Number
                </label>
                <Input
                  id="tracking-input"
                  placeholder="Enter tracking number (e.g., SC1234567890)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                  aria-describedby={error ? "tracking-error" : undefined}
                />
              </div>

              <Button onClick={handleTrack} className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Track Package
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ErrorBoundary
            fallback={({ error, retry }) => (
              <Card className="max-w-md mx-auto">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-medium text-red-600 mb-2">Tracking Error</h3>
                  <p className="text-gray-600 mb-4">{error.message}</p>
                  <div className="space-y-2">
                    <Button onClick={retry} className="w-full">
                      Try Again
                    </Button>
                    <Button variant="outline" onClick={() => setIsTracking(false)} className="w-full">
                      Enter New Tracking Number
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          >
            <RealTimeTrackerFixed trackingNumber={trackingNumber} onError={handleTrackingError} />
          </ErrorBoundary>
        )}
      </div>
    </div>
  )
}
