"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Package, ArrowRight, Calculator, AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

interface ShipmentForm {
  // Sender
  senderName: string
  senderAddress: string
  senderCity: string
  senderState: string
  senderZip: string
  // Recipient
  recipientName: string
  recipientAddress: string
  recipientCity: string
  recipientState: string
  recipientZip: string
  // Package
  weight: string
  length: string
  width: string
  height: string
  service: string
  insurance: string
  signature: boolean
  specialInstructions: string
}

export default function CreateShipmentPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null)

  const [formData, setFormData] = useState<ShipmentForm>({
    senderName: user?.name || "",
    senderAddress: "",
    senderCity: "",
    senderState: "",
    senderZip: "",
    recipientName: "",
    recipientAddress: "",
    recipientCity: "",
    recipientState: "",
    recipientZip: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    service: "",
    insurance: "0",
    signature: false,
    specialInstructions: "",
  })

  const handleInputChange = (field: keyof ShipmentForm, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const calculateCost = () => {
    if (!formData.weight || !formData.service) return

    const weight = Number.parseFloat(formData.weight)
    const baseRates = {
      swift_express: 15.99,
      swift_standard: 8.99,
      swift_overnight: 25.99,
      swift_ground: 6.99,
    }

    const baseRate = baseRates[formData.service as keyof typeof baseRates] || 8.99
    const cost = Math.round((baseRate * Math.max(1, weight) + Number.parseFloat(formData.insurance || "0")) * 100) / 100
    setEstimatedCost(cost)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      router.push("/auth")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const shipmentData = {
        sender: {
          name: formData.senderName,
          address: formData.senderAddress,
          city: formData.senderCity,
          state: formData.senderState,
          zip: formData.senderZip,
        },
        recipient: {
          name: formData.recipientName,
          address: formData.recipientAddress,
          city: formData.recipientCity,
          state: formData.recipientState,
          zip: formData.recipientZip,
        },
        package: {
          weight: Number.parseFloat(formData.weight),
          dimensions: {
            length: Number.parseFloat(formData.length),
            width: Number.parseFloat(formData.width),
            height: Number.parseFloat(formData.height),
          },
          service: formData.service,
          insurance: Number.parseFloat(formData.insurance || "0"),
          signature: formData.signature,
        },
        service: formData.service,
        specialInstructions: formData.specialInstructions,
      }

      const response = await fetch("/api/shipments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(shipmentData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`Shipment created successfully! Tracking number: ${data.package.trackingNumber}`)
        setTimeout(() => {
          router.push(`/track?number=${data.package.trackingNumber}`)
        }, 2000)
      } else {
        setError(data.message || "Failed to create shipment")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please sign in to create a shipment.</p>
            <Button onClick={() => router.push("/auth")} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Shipment</h1>
          <p className="text-gray-600">Fill out the form below to create a new shipment</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Success/Error Messages */}
          {success && (
            <div className="flex items-center gap-2 p-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="h-4 w-4" />
              {success}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Sender Information */}
          <Card>
            <CardHeader>
              <CardTitle>Sender Information</CardTitle>
              <CardDescription>Enter the sender's details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={formData.senderName}
                    onChange={(e) => handleInputChange("senderName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <Input
                    value={formData.senderAddress}
                    onChange={(e) => handleInputChange("senderAddress", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">City</label>
                  <Input
                    value={formData.senderCity}
                    onChange={(e) => handleInputChange("senderCity", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">State</label>
                  <Input
                    value={formData.senderState}
                    onChange={(e) => handleInputChange("senderState", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">ZIP Code</label>
                  <Input
                    value={formData.senderZip}
                    onChange={(e) => handleInputChange("senderZip", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recipient Information */}
          <Card>
            <CardHeader>
              <CardTitle>Recipient Information</CardTitle>
              <CardDescription>Enter the recipient's details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={formData.recipientName}
                    onChange={(e) => handleInputChange("recipientName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <Input
                    value={formData.recipientAddress}
                    onChange={(e) => handleInputChange("recipientAddress", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">City</label>
                  <Input
                    value={formData.recipientCity}
                    onChange={(e) => handleInputChange("recipientCity", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">State</label>
                  <Input
                    value={formData.recipientState}
                    onChange={(e) => handleInputChange("recipientState", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">ZIP Code</label>
                  <Input
                    value={formData.recipientZip}
                    onChange={(e) => handleInputChange("recipientZip", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Information */}
          <Card>
            <CardHeader>
              <CardTitle>Package Information</CardTitle>
              <CardDescription>Enter package details and shipping preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium">Weight (lbs)</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Length (in)</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="1"
                    value={formData.length}
                    onChange={(e) => handleInputChange("length", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Width (in)</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="1"
                    value={formData.width}
                    onChange={(e) => handleInputChange("width", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Height (in)</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="1"
                    value={formData.height}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Service Type</label>
                  <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="swift_ground">Swift Ground - $6.99</SelectItem>
                      <SelectItem value="swift_standard">Swift Standard - $8.99</SelectItem>
                      <SelectItem value="swift_express">Swift Express - $15.99</SelectItem>
                      <SelectItem value="swift_overnight">Swift Overnight - $25.99</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Insurance ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="5000"
                    value={formData.insurance}
                    onChange={(e) => handleInputChange("insurance", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="signature"
                  checked={formData.signature}
                  onCheckedChange={(checked) => handleInputChange("signature", !!checked)}
                />
                <label htmlFor="signature" className="text-sm font-medium">
                  Require signature on delivery (+$3.00)
                </label>
              </div>

              <div>
                <label className="text-sm font-medium">Special Instructions</label>
                <Textarea
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                  placeholder="Any special delivery instructions..."
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Button type="button" variant="outline" onClick={calculateCost}>
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Cost
                </Button>
                {estimatedCost && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Estimated Cost</p>
                    <p className="text-2xl font-bold text-green-600">${estimatedCost}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Shipment"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
