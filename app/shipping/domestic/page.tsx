"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Calculator, Truck, Clock, DollarSign, MapPin, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface CalculatorForm {
  fromZip: string
  toZip: string
  weight: string
  declaredValue: string
  length: string
  width: string
  height: string
}

interface TrackingData {
  trackingNumber: string
  status: string
  location: string
  estimatedDelivery: string
}

export default function DomesticShippingPage() {
  const router = useRouter()
  const [selectedService, setSelectedService] = useState("")
  const [calculatorForm, setCalculatorForm] = useState<CalculatorForm>({
    fromZip: "",
    toZip: "",
    weight: "",
    declaredValue: "",
    length: "",
    width: "",
    height: "",
  })
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null)
  const [trackingInput, setTrackingInput] = useState("")
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [trackingLoading, setTrackingLoading] = useState(false)
  const [trackingError, setTrackingError] = useState("")
  const [calcError, setCalcError] = useState("")

  const services = [
    { id: "express", name: "Express Overnight", days: "1 business day", basePrice: 45.99 },
    { id: "priority", name: "Priority 2-Day", days: "2 business days", basePrice: 25.99 },
    { id: "standard", name: "Standard Ground", days: "5-7 business days", basePrice: 12.99 },
    { id: "economy", name: "Economy Ground", days: "7-10 business days", basePrice: 8.99 },
  ]

  const handleCalculateRate = async () => {
    setCalcError("")
    setEstimatedCost(null)

    if (!selectedService) {
      setCalcError("Please select a service type")
      return
    }

    if (!calculatorForm.fromZip || !calculatorForm.toZip || !calculatorForm.weight) {
      setCalcError("Please fill in required fields: From/To Zip and Weight")
      return
    }

    try {
      const response = await fetch("/api/shipping/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fromZip: calculatorForm.fromZip,
          toZip: calculatorForm.toZip,
          weight: parseFloat(calculatorForm.weight),
          service: selectedService,
          declaredValue: calculatorForm.declaredValue ? parseFloat(calculatorForm.declaredValue) : 0,
          dimensions: {
            length: calculatorForm.length ? parseFloat(calculatorForm.length) : 0,
            width: calculatorForm.width ? parseFloat(calculatorForm.width) : 0,
            height: calculatorForm.height ? parseFloat(calculatorForm.height) : 0,
          },
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setEstimatedCost(data.cost)
      } else {
        setCalcError(data.message || "Failed to calculate rate")
      }
    } catch (error) {
      setCalcError("Network error while calculating rate")
      console.error("Rate calculation error:", error)
    }
  }

  const handleTrackPackage = async () => {
    setTrackingError("")
    setTrackingData(null)

    if (!trackingInput.trim()) {
      setTrackingError("Please enter a tracking number")
      return
    }

    setTrackingLoading(true)

    try {
      const response = await fetch(`/api/tracking/${trackingInput}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setTrackingData({
          trackingNumber: data.package.trackingNumber,
          status: data.package.status,
          location: data.package.currentLocation || "Unknown",
          estimatedDelivery: data.package.estimatedDelivery,
        })
      } else {
        setTrackingError(data.message || "Package not found")
      }
    } catch (error) {
      setTrackingError("Network error while tracking package")
      console.error("Tracking error:", error)
    } finally {
      setTrackingLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Domestic Shipping</h1>
          <p className="text-gray-600">Fast, reliable shipping across the continental United States</p>
        </div>

        {/* Service Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {services.map((service) => (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all ${
                selectedService === service.id ? "border-blue-500 border-2 shadow-lg" : ""
              }`}
              onClick={() => setSelectedService(service.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm">{service.name}</h3>
                  <Badge variant={selectedService === service.id ? "default" : "secondary"}>
                    {service.basePrice}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-gray-500 gap-1">
                  <Clock className="h-3 w-3" />
                  {service.days}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator">Rate Calculator</TabsTrigger>
            <TabsTrigger value="services">Service Details</TabsTrigger>
            <TabsTrigger value="tracking">Track Package</TabsTrigger>
          </TabsList>

          {/* Rate Calculator */}
          <TabsContent value="calculator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Domestic Rate Calculator</CardTitle>
                  <CardDescription>Calculate shipping costs for domestic deliveries</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Service Type</label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - {service.basePrice}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Zip Code From</label>
                      <Input placeholder="00000" maxLength={5} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Zip Code To</label>
                      <Input placeholder="00000" maxLength={5} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Weight (lbs)</label>
                      <Input placeholder="0.0" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Declared Value</label>
                      <Input placeholder="$0.00" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Length (in)</label>
                      <Input placeholder="0.0" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Width (in)</label>
                      <Input placeholder="0.0" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Height (in)</label>
                      <Input placeholder="0.0" />
                    </div>
                  </div>

                  <Button className="w-full">
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate Rate
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Details</CardTitle>
                  <CardDescription>Summary of your shipment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Service</span>
                      <Badge>{selectedService || "Select service"}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Estimated Delivery</span>
                      <span className="text-sm">
                        {services.find((s) => s.id === selectedService)?.days || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Base Rate</span>
                      <span className="text-sm font-medium">
                        {services.find((s) => s.id === selectedService)?.basePrice || "$0.00"}
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Total Estimated Cost
                        </span>
                        <span className="font-bold text-lg">Calculated</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Service Details */}
          <TabsContent value="services">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription>Domestic ground shipping</CardDescription>
                      </div>
                      <Badge>{service.basePrice}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">Delivery Time</p>
                        <p className="text-sm text-gray-600">{service.days}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">Coverage</p>
                        <p className="text-sm text-gray-600">All 50 states</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">Tracking</p>
                        <p className="text-sm text-gray-600">Real-time updates</p>
                      </div>
                    </div>
                    <Button className="w-full">Select Service</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Track Package */}
          <TabsContent value="tracking">
            <Card>
              <CardHeader>
                <CardTitle>Track Domestic Package</CardTitle>
                <CardDescription>Enter your tracking number to monitor your shipment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Enter tracking number" className="flex-1" />
                  <Button>
                    <Truck className="mr-2 h-4 w-4" />
                    Track
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
