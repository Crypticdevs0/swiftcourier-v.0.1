"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Package, ArrowLeft, Printer, CreditCard } from "lucide-react"
import { generateTrackingNumber } from "@/lib/tracking"

export default function CreateShipmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Get tracking number from URL or generate new one
    const urlTracking = searchParams.get("tracking")
    if (urlTracking) {
      setTrackingNumber(urlTracking)
    } else {
      setTrackingNumber(generateTrackingNumber())
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call to create shipment
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to tracking page
      router.push(`/track?number=${trackingNumber}`)
    } catch (error) {
      console.error("Error creating shipment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Shipment</h1>
          <p className="text-gray-600">Fill out the details below to create your shipment</p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <Package className="h-4 w-4 inline mr-2" />
              Your tracking number: <span className="font-mono font-bold">{trackingNumber}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sender Information */}
            <Card>
              <CardHeader>
                <CardTitle>From (Sender)</CardTitle>
                <CardDescription>Enter sender information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First Name" required />
                  <Input placeholder="Last Name" required />
                </div>
                <Input placeholder="Company (Optional)" />
                <Input placeholder="Address Line 1" required />
                <Input placeholder="Address Line 2 (Optional)" />
                <div className="grid grid-cols-3 gap-4">
                  <Input placeholder="City" required />
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="IL">Illinois</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="ZIP Code" required />
                </div>
                <Input placeholder="Phone Number" type="tel" />
              </CardContent>
            </Card>

            {/* Recipient Information */}
            <Card>
              <CardHeader>
                <CardTitle>To (Recipient)</CardTitle>
                <CardDescription>Enter recipient information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First Name" required />
                  <Input placeholder="Last Name" required />
                </div>
                <Input placeholder="Company (Optional)" />
                <Input placeholder="Address Line 1" required />
                <Input placeholder="Address Line 2 (Optional)" />
                <div className="grid grid-cols-3 gap-4">
                  <Input placeholder="City" required />
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="IL">Illinois</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="ZIP Code" required />
                </div>
                <Input placeholder="Phone Number" type="tel" />
              </CardContent>
            </Card>
          </div>

          {/* Package Details */}
          <Card>
            <CardHeader>
              <CardTitle>Package Details</CardTitle>
              <CardDescription>Describe your package</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Weight (lbs)</label>
                  <Input type="number" step="0.1" min="0.1" placeholder="2.5" required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Length (in)</label>
                  <Input type="number" step="0.1" min="1" placeholder="12" required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Width (in)</label>
                  <Input type="number" step="0.1" min="1" placeholder="8" required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Height (in)</label>
                  <Input type="number" step="0.1" min="1" placeholder="4" required />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Service Type</label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Swift Standard (3-5 business days) - $8.95</SelectItem>
                    <SelectItem value="express">Swift Express (1-2 business days) - $24.95</SelectItem>
                    <SelectItem value="overnight">Swift Overnight (Next business day) - $39.95</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Package Contents (Optional)</label>
                <Textarea placeholder="Describe the contents of your package..." />
              </div>
            </CardContent>
          </Card>

          {/* Submit Actions */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                "Creating Shipment..."
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Create & Pay
                </>
              )}
            </Button>
            <Button type="button" variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Save & Print Later
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
