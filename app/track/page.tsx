"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { USPSStyleTracker } from "@/components/usps-style-tracker"
import { ErrorBoundary } from "@/components/error-boundary"
import { Search, Package, ArrowLeft } from "lucide-react"

export default function TrackPage() {
  const searchParams = useSearchParams()
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isTracking, setIsTracking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const numberFromUrl = searchParams.get("number")
    if (numberFromUrl) {
      setTrackingNumber(numberFromUrl)
      handleTrack(numberFromUrl)
    }
  }, [searchParams])

  const handleTrack = (number?: string) => {
    const trackingNum = number || trackingNumber
    if (!trackingNum.trim()) {
      setError("Please enter a tracking number")
      return
    }

    // Basic validation for Swift Courier tracking numbers
    if (!trackingNum.toUpperCase().startsWith("SC") || trackingNum.length < 8) {
      setError("Please enter a valid Swift Courier tracking number (starts with SC)")
      return
    }

    setError(null)
    setIsTracking(true)
  }

  const handleTrackingError = (error: Error) => {
    console.error("Tracking error:", error)
    setError(error.message)
    setIsTracking(false)
  }

  const resetTracking = () => {
    setIsTracking(false)
    setTrackingNumber("")
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Track Your Package</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter your Swift Courier tracking number to get real-time updates on your shipment's journey
          </p>
        </div>

        {!isTracking ? (
          <div className="max-w-md mx-auto">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span>Package Tracking</span>
                </CardTitle>
                <CardDescription>Enter your tracking number to get started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="tracking-input" className="text-sm font-medium text-gray-700">
                    Tracking Number
                  </label>
                  <Input
                    id="tracking-input"
                    placeholder="Enter tracking number (e.g., SC1234567890)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                    className="text-center font-mono"
                    aria-describedby={error ? "tracking-error" : undefined}
                  />
                  <p className="text-xs text-gray-500 text-center">Swift Courier tracking numbers start with "SC"</p>
                </div>

                <Button onClick={() => handleTrack()} className="w-full" size="lg">
                  <Search className="mr-2 h-4 w-4" />
                  Track Package
                </Button>

                {/* Sample tracking numbers for demo */}
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500 text-center mb-2">Try these sample tracking numbers:</p>
                  <div className="space-y-1">
                    {["SC123456789012", "SC987654321098", "SC456789123456"].map((sampleNumber) => (
                      <button
                        key={sampleNumber}
                        onClick={() => {
                          setTrackingNumber(sampleNumber)
                          handleTrack(sampleNumber)
                        }}
                        className="block w-full text-xs text-blue-600 hover:text-blue-800 font-mono"
                      >
                        {sampleNumber}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Back button */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={resetTracking} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Track Another Package</span>
              </Button>
            </div>

            {/* Tracking Results */}
            <ErrorBoundary
              fallback={({ error, retry }) => (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-medium text-red-600 mb-2">Tracking Error</h3>
                    <p className="text-gray-600 mb-4">{error.message}</p>
                    <div className="space-y-2">
                      <Button onClick={retry} className="w-full">
                        Try Again
                      </Button>
                      <Button variant="outline" onClick={resetTracking} className="w-full">
                        Enter New Tracking Number
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            >
              <USPSStyleTracker trackingNumber={trackingNumber} onError={handleTrackingError} />
            </ErrorBoundary>
          </div>
        )}
      </div>
    </div>
  )
}
