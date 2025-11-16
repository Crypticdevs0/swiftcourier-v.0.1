"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TestTrackPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")

  const handleTrack = () => {
    setDebugInfo("Button clicked!")
    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
      setDebugInfo("Tracking completed!")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Test Tracking</h1>
        
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          
          <Button 
            onClick={handleTrack}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Track Package"}
          </Button>
          
          {debugInfo && (
            <div className="p-4 bg-blue-100 rounded">
              Debug: {debugInfo}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}