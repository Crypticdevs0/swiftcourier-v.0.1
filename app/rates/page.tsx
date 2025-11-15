"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Zap, Truck, Clock, CheckCircle2 } from "lucide-react"

export default function RatesPage() {
  const [fromZip, setFromZip] = useState("")
  const [toZip, setToZip] = useState("")
  const [weight, setWeight] = useState("")
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [serviceType, setServiceType] = useState("all")
  const [rates, setRates] = useState<any[]>([])
  const [showRates, setShowRates] = useState(false)

  const calculateRates = () => {
    if (!fromZip || !toZip || !weight) {
      alert("Please enter From ZIP, To ZIP, and Weight")
      return
    }

    const baseRate = parseFloat(weight) * 0.5
    const dimensionCharge = (parseInt(length || "0") + parseInt(width || "0") + parseInt(height || "0")) * 0.01

    const calculatedRates = [
      {
        id: "standard",
        name: "Swift Standard",
        price: baseRate + dimensionCharge,
        delivery: "3-5 business days",
        icon: Truck,
      },
      {
        id: "express",
        name: "Swift Express",
        price: (baseRate + dimensionCharge) * 1.75,
        delivery: "1-2 business days",
        icon: Zap,
      },
      {
        id: "overnight",
        name: "Swift Overnight",
        price: (baseRate + dimensionCharge) * 2.5,
        delivery: "Next business day",
        icon: Clock,
      },
    ]

    const filtered = serviceType === "all" 
      ? calculatedRates 
      : calculatedRates.filter(r => r.id === serviceType)

    setRates(filtered)
    setShowRates(true)
  }

  const handleSelectService = (rateId: string) => {
    // Redirect to checkout or shipping page
    window.location.href = `/shipping/create?service=${rateId}`
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Calculate Shipping Rates</h1>
          <p className="text-gray-600">Get instant rates for your packages and select the service that works best for you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Rate Calculator</CardTitle>
                <CardDescription>Enter your shipment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Origin */}
                <div>
                  <Label htmlFor="fromZip">From ZIP Code *</Label>
                  <Input
                    id="fromZip"
                    value={fromZip}
                    onChange={(e) => setFromZip(e.target.value)}
                    placeholder="10001"
                    className="mt-1"
                  />
                </div>

                {/* Destination */}
                <div>
                  <Label htmlFor="toZip">To ZIP Code *</Label>
                  <Input
                    id="toZip"
                    value={toZip}
                    onChange={(e) => setToZip(e.target.value)}
                    placeholder="90210"
                    className="mt-1"
                  />
                </div>

                {/* Weight */}
                <div>
                  <Label htmlFor="weight">Weight (lbs) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="5"
                    className="mt-1"
                  />
                </div>

                {/* Dimensions */}
                <div>
                  <Label>Package Dimensions (inches)</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <Input
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      placeholder="Length"
                      type="number"
                    />
                    <Input
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      placeholder="Width"
                      type="number"
                    />
                    <Input
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Height"
                      type="number"
                    />
                  </div>
                </div>

                {/* Service Filter */}
                <div>
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger id="serviceType" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="standard">Standard Only</SelectItem>
                      <SelectItem value="express">Express Only</SelectItem>
                      <SelectItem value="overnight">Overnight Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={calculateRates} className="w-full" size="lg">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Calculate Rates
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {showRates && rates.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Available Rates</h2>
                
                {rates.map((rate) => {
                  const Icon = rate.icon
                  return (
                    <Card key={rate.id} className="hover:shadow-lg transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                              <Icon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{rate.name}</h3>
                              <p className="text-gray-600 flex items-center mt-1">
                                <Clock className="h-4 w-4 mr-1" />
                                {rate.delivery}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-blue-600">${rate.price.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t">
                          <div>
                            <p className="text-sm text-gray-600">Distance</p>
                            <p className="font-semibold">
                              {fromZip} → {toZip}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Weight</p>
                            <p className="font-semibold">{weight} lbs</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-6">
                          <div className="flex items-center text-green-700">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            <span className="text-sm">Tracking included</span>
                          </div>
                          <div className="flex items-center text-green-700">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            <span className="text-sm">Insurance available</span>
                          </div>
                        </div>

                        <Button 
                          onClick={() => handleSelectService(rate.id)} 
                          className="w-full"
                        >
                          Select This Service
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}

                {/* Additional Services */}
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-700 mb-3">
                      <strong>Add Optional Services:</strong>
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>✓ Signature Confirmation: +$2.50</li>
                      <li>✓ Package Insurance: +$2.50</li>
                      <li>✓ Priority Handling: +$5.00</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Enter your shipment details and click "Calculate Rates" to see available options</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
