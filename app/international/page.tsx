"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Globe, FileText, AlertTriangle, Calculator, Truck, Shield } from "lucide-react"

export default function InternationalPage() {
  const [countries, setCountries] = useState<any[]>([])
  const [selectedCountry, setSelectedCountry] = useState("")
  const [customsForm, setCustomsForm] = useState({
    description: "",
    value: "",
    weight: "",
    quantity: "",
    hsCode: "",
    countryOfOrigin: "US",
  })

  useEffect(() => {
    const controller = new AbortController()
    // Fetch countries data
    fetch("/api/international/countries", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCountries(data.countries)
        }
      })
      .catch((err) => {
        if ((err as any)?.name === "AbortError") return
        console.error("Failed to load countries:", err)
      })

    return () => controller.abort()
  }, [])

  const selectedCountryData = countries.find((c) => c.code === selectedCountry)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">International Shipping</h1>
          <p className="text-gray-600">Ship worldwide with Swift Courier's international services</p>
        </div>

        {/* Service Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="mb-2">200+ Countries</CardTitle>
              <CardDescription>Worldwide delivery to over 200 countries and territories</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="mb-2">Customs Support</CardTitle>
              <CardDescription>Complete customs documentation and clearance assistance</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="mb-2">Insurance Available</CardTitle>
              <CardDescription>Protect your international shipments with comprehensive coverage</CardDescription>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calculator">Rate Calculator</TabsTrigger>
            <TabsTrigger value="customs">Customs Forms</TabsTrigger>
            <TabsTrigger value="restrictions">Restrictions</TabsTrigger>
            <TabsTrigger value="tracking">Track International</TabsTrigger>
          </TabsList>

          {/* Rate Calculator */}
          <TabsContent value="calculator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>International Rate Calculator</CardTitle>
                  <CardDescription>Get shipping rates for international destinations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Destination Country</label>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Weight (lbs)</label>
                      <Input placeholder="0.0" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Value (USD)</label>
                      <Input placeholder="0.00" />
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

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="insurance" />
                      <label htmlFor="insurance" className="text-sm">
                        Add insurance coverage
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="signature" />
                      <label htmlFor="signature" className="text-sm">
                        Require signature on delivery
                      </label>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate Rates
                  </Button>
                </CardContent>
              </Card>

              {selectedCountryData && (
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping to {selectedCountryData.name}</CardTitle>
                    <CardDescription>Available services and delivery times</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Available Services</h4>
                      <div className="space-y-2">
                        {selectedCountryData.services.map((service: string) => (
                          <div key={service} className="flex justify-between items-center p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">Swift {service}</p>
                              <p className="text-sm text-gray-600">
                                {selectedCountryData.estimatedDays[service.toLowerCase()]} business days
                              </p>
                            </div>
                            <Badge variant="outline">Available</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Shipping Restrictions</h4>
                      <div className="space-y-1">
                        {selectedCountryData.restrictions.map((restriction: string, index: number) => (
                          <div key={index} className="flex items-start">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{restriction}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Required Forms</h4>
                      <div className="flex gap-2">
                        {selectedCountryData.customsForms.map((form: string) => (
                          <Badge key={form} variant="secondary">
                            {form}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Customs Forms */}
          <TabsContent value="customs">
            <Card>
              <CardHeader>
                <CardTitle>Customs Declaration Form</CardTitle>
                <CardDescription>Complete customs information for international shipments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                    <div>
                      <h4 className="font-medium text-blue-800">Customs Declaration Required</h4>
                      <p className="text-sm text-blue-700">
                        All international shipments require accurate customs declarations. Providing false information
                        is illegal.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Item Description</label>
                      <Textarea
                        placeholder="Detailed description of contents"
                        value={customsForm.description}
                        onChange={(e) => setCustomsForm({ ...customsForm, description: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Declared Value (USD)</label>
                      <Input
                        placeholder="0.00"
                        value={customsForm.value}
                        onChange={(e) => setCustomsForm({ ...customsForm, value: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Weight (lbs)</label>
                      <Input
                        placeholder="0.0"
                        value={customsForm.weight}
                        onChange={(e) => setCustomsForm({ ...customsForm, weight: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Quantity</label>
                      <Input
                        placeholder="1"
                        value={customsForm.quantity}
                        onChange={(e) => setCustomsForm({ ...customsForm, quantity: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">HS Code (Optional)</label>
                      <Input
                        placeholder="Enter HS code if known"
                        value={customsForm.hsCode}
                        onChange={(e) => setCustomsForm({ ...customsForm, hsCode: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Country of Origin</label>
                      <Select
                        value={customsForm.countryOfOrigin}
                        onValueChange={(value) => setCustomsForm({ ...customsForm, countryOfOrigin: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CN">China</SelectItem>
                          <SelectItem value="MX">Mexico</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Content Type</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {["Gift", "Merchandise", "Documents", "Sample"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox id={type} />
                        <label htmlFor={type} className="text-sm">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Customs Form
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Restrictions */}
          <TabsContent value="restrictions">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Prohibited Items</CardTitle>
                  <CardDescription>Items that cannot be shipped internationally</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Hazardous materials",
                      "Weapons and ammunition",
                      "Illegal drugs",
                      "Counterfeit goods",
                      "Live animals",
                      "Human remains",
                      "Radioactive materials",
                      "Explosive devices",
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Restricted Items</CardTitle>
                  <CardDescription>Items with special requirements or limitations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Lithium batteries (special packaging required)",
                      "Perfumes and cosmetics (quantity limits)",
                      "Food items (country-specific restrictions)",
                      "Electronics (customs duties may apply)",
                      "Tobacco products (age verification required)",
                      "Alcohol (licensing requirements)",
                      "Medications (prescription required)",
                      "Plant materials (phytosanitary certificate)",
                    ].map((item, index) => (
                      <div key={index} className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Country-Specific Information</CardTitle>
                <CardDescription>Check restrictions for specific destinations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <Select>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline">View Restrictions</Button>
                </div>
                <p className="text-sm text-gray-600">
                  Select a destination country to view specific shipping restrictions and requirements.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* International Tracking */}
          <TabsContent value="tracking">
            <Card>
              <CardHeader>
                <CardTitle>International Package Tracking</CardTitle>
                <CardDescription>Track packages shipped internationally</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Enter international tracking number" className="flex-1" />
                  <Button>
                    <Truck className="mr-2 h-4 w-4" />
                    Track Package
                  </Button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                    <div>
                      <h4 className="font-medium text-yellow-800">International Tracking Notice</h4>
                      <p className="text-sm text-yellow-700">
                        International packages may experience delays at customs. Tracking updates may be limited once
                        packages enter the destination country's postal system.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Sample Tracking: SC-INT-123456</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge variant="secondary">In Transit</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Destination:</span>
                        <span>London, UK</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Update:</span>
                        <span>Customs clearance in progress</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Delivery Estimate</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <span>Swift Express International</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Delivery:</span>
                        <span>Dec 25-27, 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Customs Status:</span>
                        <Badge variant="outline">Processing</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
