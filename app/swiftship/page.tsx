"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Package, Calculator, CreditCard, Printer, Truck, Loader2 } from "lucide-react"

export default function SwiftShipPage() {
  const [fromAddress, setFromAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  })

  const [toAddress, setToAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  })

  const [packageDetails, setPackageDetails] = useState({
    weight: "",
    length: "",
    width: "",
    height: "",
    value: "",
  })

  const [shippingOptions, setShippingOptions] = useState<any[]>([])
  const [selectedOption, setSelectedOption] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)

  const calculateRates = async () => {
    setIsCalculating(true)
    // Simulate API call
    setTimeout(() => {
      setShippingOptions([
        {
          id: "standard",
          name: "Swift Standard",
          price: 12.95,
          delivery: "3-5 business days",
          description: "Reliable ground delivery",
        },
        {
          id: "express",
          name: "Swift Express",
          price: 24.95,
          delivery: "1-2 business days",
          description: "Fast delivery with tracking",
        },
        {
          id: "overnight",
          name: "Swift Overnight",
          price: 45.95,
          delivery: "Next business day",
          description: "Guaranteed next-day delivery",
        },
      ])
      setIsCalculating(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">SwiftShip - Online Shipping Tool</h1>
          <p className="text-gray-600">Calculate rates, print labels, and schedule pickups all in one place</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* From Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  From Address
                </CardTitle>
                <CardDescription>Enter the sender's information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name"
                    value={fromAddress.name}
                    onChange={(e) => setFromAddress({ ...fromAddress, name: e.target.value })}
                  />
                  <Input placeholder="Company (Optional)" />
                </div>
                <Input
                  placeholder="Street Address"
                  value={fromAddress.address}
                  onChange={(e) => setFromAddress({ ...fromAddress, address: e.target.value })}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="City"
                    value={fromAddress.city}
                    onChange={(e) => setFromAddress({ ...fromAddress, city: e.target.value })}
                  />
                  <Select onValueChange={(value) => setFromAddress({ ...fromAddress, state: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="ZIP Code"
                    value={fromAddress.zip}
                    onChange={(e) => setFromAddress({ ...fromAddress, zip: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* To Address */}
            <Card>
              <CardHeader>
                <CardTitle>To Address</CardTitle>
                <CardDescription>Enter the recipient's information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name"
                    value={toAddress.name}
                    onChange={(e) => setToAddress({ ...toAddress, name: e.target.value })}
                  />
                  <Input placeholder="Company (Optional)" />
                </div>
                <Input
                  placeholder="Street Address"
                  value={toAddress.address}
                  onChange={(e) => setToAddress({ ...toAddress, address: e.target.value })}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="City"
                    value={toAddress.city}
                    onChange={(e) => setToAddress({ ...toAddress, city: e.target.value })}
                  />
                  <Select onValueChange={(value) => setToAddress({ ...toAddress, state: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="ZIP Code"
                    value={toAddress.zip}
                    onChange={(e) => setToAddress({ ...toAddress, zip: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Package Details */}
            <Card>
              <CardHeader>
                <CardTitle>Package Details</CardTitle>
                <CardDescription>Enter package dimensions and weight</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium">Weight (lbs)</label>
                    <Input
                      placeholder="0.0"
                      value={packageDetails.weight}
                      onChange={(e) => setPackageDetails({ ...packageDetails, weight: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Length (in)</label>
                    <Input
                      placeholder="0.0"
                      value={packageDetails.length}
                      onChange={(e) => setPackageDetails({ ...packageDetails, length: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Width (in)</label>
                    <Input
                      placeholder="0.0"
                      value={packageDetails.width}
                      onChange={(e) => setPackageDetails({ ...packageDetails, width: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Height (in)</label>
                    <Input
                      placeholder="0.0"
                      value={packageDetails.height}
                      onChange={(e) => setPackageDetails({ ...packageDetails, height: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Declared Value ($)</label>
                  <Input
                    placeholder="0.00"
                    value={packageDetails.value}
                    onChange={(e) => setPackageDetails({ ...packageDetails, value: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="signature" />
                  <label htmlFor="signature" className="text-sm">
                    Require signature on delivery
                  </label>
                </div>
              </CardContent>
            </Card>

            <Button onClick={calculateRates} disabled={isCalculating} className="w-full" size="lg">
              {isCalculating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Calculator className="mr-2 h-4 w-4" />
              )}
              {isCalculating ? "Calculating Rates..." : "Calculate Shipping Rates"}
            </Button>
          </div>

          {/* Shipping Options & Summary */}
          <div className="space-y-6">
            {shippingOptions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Options</CardTitle>
                  <CardDescription>Select your preferred shipping method</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {shippingOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedOption === option.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedOption(option.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{option.name}</h4>
                        <span className="font-bold text-lg">${option.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{option.description}</p>
                      <Badge variant="secondary">{option.delivery}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {selectedOption && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${shippingOptions.find((o) => o.id === selectedOption)?.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insurance</span>
                      <span>$2.50</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>
                        $
                        {(
                          Number.parseFloat(shippingOptions.find((o) => o.id === selectedOption)?.price || "0") + 2.5
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay & Print Label
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Printer className="mr-2 h-4 w-4" />
                      Print Label Only
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Truck className="mr-2 h-4 w-4" />
                      Schedule Pickup
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Measure packages accurately for best rates</p>
                <p>• Add insurance for valuable items</p>
                <p>• Schedule pickup to save time</p>
                <p>• Save addresses for future use</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
