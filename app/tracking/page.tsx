"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { USPSStyleTracker } from "@/components/usps-style-tracker"
import { ErrorBoundary } from "@/components/error-boundary"
import { Search, Package, ArrowLeft, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

// Separate component to handle search params
function TrackingContent() {
  const searchParams = useSearchParams()
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isTracking, setIsTracking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isButtonLoading, setIsButtonLoading] = useState(false)

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
    if (!trackingNum.toUpperCase().startsWith("SC") || trackingNum.length !== 12) {
      setError("Please enter a valid 12-character Swift Courier tracking number (e.g., SC1234567890)")
      return
    }

    setError(null)
    setIsButtonLoading(true)
    
    // Add a 4-second delay with modern animation
    setTimeout(() => {
      setIsButtonLoading(false)
      setIsTracking(true)
    }, 4000)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 animate-fade-in">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-in slide-in-from-top duration-500">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <Package className="h-8 w-8 text-blue-600 animate-bounce" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Track Your Package
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Enter your Swift Courier tracking number to get real-time updates on your shipment's journey
          </p>
        </div>

        {!isTracking ? (
          <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom duration-500">
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
              <CardHeader className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Package Tracking
                  </span>
                </CardTitle>
                <CardDescription className="text-gray-600">Enter your tracking number to get started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 py-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-in shake duration-300" role="alert">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <label htmlFor="tracking-input" className="text-sm font-semibold text-gray-700 flex items-center space-x-1">
                    <Zap className="h-3 w-3 text-blue-600" />
                    <span>Tracking Number</span>
                  </label>
                  <Input
                    id="tracking-input"
                    placeholder="e.g., SC1234567890"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                    className="text-center font-mono text-lg h-12 border-2 border-blue-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    aria-describedby={error ? "tracking-error" : undefined}
                  />
                  <p className="text-xs text-gray-500 text-center font-medium">Starts with "SC" followed by 10 digits</p>
                </div>

                <Button
                  onClick={() => handleTrack()}
                  className={cn(
                    "w-full relative overflow-hidden group transition-all duration-300",
                    isButtonLoading ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 shadow-lg shadow-blue-600/50" : "bg-blue-600 hover:bg-blue-700"
                  )}
                  size="lg"
                  disabled={isButtonLoading}
                >
                  {isButtonLoading ? (
                    <div className="relative flex items-center justify-center space-x-2 py-2">
                      {/* Outer spinner */}
                      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 opacity-0 animate-pulse"></div>

                      {/* Content */}
                      <div className="relative flex items-center justify-center space-x-2">
                        {/* Double spinner animation */}
                        <div className="relative w-5 h-5">
                          <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <div
                            className="absolute inset-0.5 border-2 border-white border-b-transparent rounded-full animate-spin"
                            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
                          ></div>
                        </div>
                        <span className="font-medium">Tracking...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-center space-x-2">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-md"></div>
                      <div className="relative flex items-center justify-center space-x-2">
                        <Zap className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:animate-pulse" />
                        <span>Track Package</span>
                      </div>
                    </div>
                  )}
                </Button>

              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
            {/* Back button */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={resetTracking}
                className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Track Another Package</span>
              </Button>
            </div>

            {/* Tracking Results */}
            <ErrorBoundary
              fallback={({ error, retry }) => (
                <Card className="border-red-200 bg-red-50 shadow-lg animate-in fade-in duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl mb-4">⚠️</div>
                    <h3 className="text-lg font-semibold text-red-600 mb-2">Tracking Error</h3>
                    <p className="text-gray-600 mb-6">{error.message}</p>
                    <div className="space-y-3">
                      <Button
                        onClick={retry}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        Try Again
                      </Button>
                      <Button
                        variant="outline"
                        onClick={resetTracking}
                        className="w-full"
                      >
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

// Main component with Suspense wrapper
export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Package</h1>
              <p className="text-lg text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <TrackingContent />
    </Suspense>
  )
}

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic'
