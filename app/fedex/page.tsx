"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FedexStyleTracker } from "@/components/fedex-style-tracker"
import { Package, Search, ArrowLeft } from "lucide-react"

export default function FedexSimulatorPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isTracking, setIsTracking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTrack = (value?: string) => {
    const num = (value ?? trackingNumber).trim()
    if (!num) {
      setError("Please enter a tracking number")
      return
    }
    setError(null)
    setIsTracking(true)
  }

  const reset = () => {
    setIsTracking(false)
    setTrackingNumber("")
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">FedEx Tracking Simulator</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This simulates a FedEx-style tracking experience using the built-in mock API at /api/mock/fedex
          </p>
        </div>

        {!isTracking ? (
          <div className="max-w-md mx-auto">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span>Enter Tracking Number</span>
                </CardTitle>
                <CardDescription>Use one of the sample numbers below or your own mock value</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <Input
                  placeholder="e.g., SC1234567890"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  className="text-center font-mono"
                />

                <Button onClick={() => handleTrack()} className="w-full" size="lg">
                  <Search className="mr-2 h-4 w-4" />
                  Track
                </Button>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500 text-center mb-2">Sample tracking numbers</p>
                  <div className="space-y-1">
                    {["SC1234567890", "SC0987654321", "SC1122334455"].map((n) => (
                      <button
                        key={n}
                        onClick={() => {
                          setTrackingNumber(n)
                          handleTrack(n)
                        }}
                        className="block w-full text-xs text-blue-600 hover:text-blue-800 font-mono"
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={reset} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Track Another</span>
              </Button>
            </div>
            <FedexStyleTracker trackingNumber={trackingNumber} />
          </div>
        )}
      </div>
    </div>
  )
}
