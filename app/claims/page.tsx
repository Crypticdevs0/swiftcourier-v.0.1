"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Clock, FileText, Loader2 } from "lucide-react"

export default function ClaimsPage() {
  const [activeTab, setActiveTab] = useState("file")
  const [isLoading, setIsLoading] = useState(false)
  const [claimSubmitted, setClaimSubmitted] = useState(false)
  const [claimNumber, setClaimNumber] = useState("")

  const [formData, setFormData] = useState({
    trackingNumber: "",
    claimType: "",
    packageValue: "",
    itemDescription: "",
    issueDescription: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  const [myClaims] = useState([
    {
      id: "CLM-2024-001234",
      date: "Dec 15, 2024",
      status: "approved",
      amount: 150.00,
      description: "Package damaged in transit",
      packageValue: 200,
    },
    {
      id: "CLM-2024-001235",
      date: "Dec 10, 2024",
      status: "pending",
      amount: 75.50,
      description: "Item missing from package",
      packageValue: 125,
    },
    {
      id: "CLM-2024-001236",
      date: "Dec 5, 2024",
      status: "investigating",
      amount: 300.00,
      description: "Package lost in transit",
      packageValue: 500,
    },
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmitClaim = async () => {
    if (!formData.trackingNumber || !formData.claimType || !formData.packageValue || !formData.firstName || !formData.lastName || !formData.email) {
      alert("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    const newClaimNumber = `CLM-${new Date().getFullYear()}-${Math.floor(Math.random() * 999999).toString().padStart(6, "0")}`
    setClaimNumber(newClaimNumber)
    setClaimSubmitted(true)
    setIsLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "investigating":
        return "bg-blue-100 text-blue-800"
      case "denied":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "investigating":
        return <FileText className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  if (claimSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Claim Submitted Successfully!</h1>
              <p className="text-gray-600 mb-8">We've received your claim and will review it shortly.</p>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <p className="text-sm text-gray-600 mb-2">Claim Number</p>
                <p className="font-bold text-2xl text-blue-600">{claimNumber}</p>
                <p className="text-sm text-gray-500 mt-2">Keep this number for your records</p>
              </div>

              <div className="space-y-3 text-left mb-8 bg-gray-50 p-4 rounded-lg">
                <p><span className="font-semibold">Tracking #:</span> {formData.trackingNumber}</p>
                <p><span className="font-semibold">Claim Type:</span> {formData.claimType}</p>
                <p><span className="font-semibold">Package Value:</span> ${parseFloat(formData.packageValue).toFixed(2)}</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-gray-700">
                  <strong>Next Steps:</strong> We'll investigate your claim and send updates to {formData.email}. Most claims are reviewed within 5 business days.
                </p>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => window.location.href = "/"}>
                  Back to Home
                </Button>
                <Button className="flex-1" onClick={() => setActiveTab("my-claims")}>
                  View My Claims
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">File a Claim</h1>
          <p className="text-gray-600">Report lost, damaged, or missing packages and track your claims</p>
        </div>

        <Tabs defaultValue="file" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="file">File a Claim</TabsTrigger>
            <TabsTrigger value="my-claims">My Claims</TabsTrigger>
          </TabsList>

          {/* File Claim Tab */}
          <TabsContent value="file">
            <Card>
              <CardHeader>
                <CardTitle>Claim Information</CardTitle>
                <CardDescription>Please provide details about your claim. Claims must be filed within 30 days of delivery.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Shipment Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Shipment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="trackingNumber">Tracking Number *</Label>
                      <Input
                        id="trackingNumber"
                        name="trackingNumber"
                        value={formData.trackingNumber}
                        onChange={handleInputChange}
                        placeholder="SC1234567890"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="claimType">Claim Type *</Label>
                      <Select value={formData.claimType} onValueChange={(value) => handleSelectChange("claimType", value)}>
                        <SelectTrigger id="claimType" className="mt-1">
                          <SelectValue placeholder="Select claim type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lost">Lost Package</SelectItem>
                          <SelectItem value="damaged">Damaged Package</SelectItem>
                          <SelectItem value="missing">Item Missing from Package</SelectItem>
                          <SelectItem value="late">Late Delivery</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="packageValue">Package Value ($) *</Label>
                      <Input
                        id="packageValue"
                        name="packageValue"
                        type="number"
                        value={formData.packageValue}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="itemDescription">Item Description *</Label>
                      <Input
                        id="itemDescription"
                        name="itemDescription"
                        value={formData.itemDescription}
                        onChange={handleInputChange}
                        placeholder="What was in the package?"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Issue Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Issue Description</h3>
                  <Label htmlFor="issueDescription">Please describe what happened *</Label>
                  <Textarea
                    id="issueDescription"
                    name="issueDescription"
                    value={formData.issueDescription}
                    onChange={handleInputChange}
                    placeholder="Provide detailed information about the issue, including date delivered and condition upon receipt..."
                    className="mt-1 min-h-32"
                  />
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Your Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    ℹ️ <strong>Claim Limits:</strong> Standard coverage is up to $100. For higher-value items, purchased insurance coverage may apply.
                  </p>
                </div>

                <Button size="lg" className="w-full" onClick={handleSubmitClaim} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Claim...
                    </>
                  ) : (
                    "Submit Claim"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Claims Tab */}
          <TabsContent value="my-claims">
            <div className="space-y-4">
              {myClaims.length > 0 ? (
                myClaims.map((claim) => (
                  <Card key={claim.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{claim.id}</h3>
                          <p className="text-sm text-gray-600">{claim.date}</p>
                        </div>
                        <Badge className={getStatusColor(claim.status)}>
                          <span className="mr-1">{getStatusIcon(claim.status)}</span>
                          {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-3">{claim.description}</p>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Claim Amount</p>
                          <p className="font-semibold">${claim.amount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Package Value</p>
                          <p className="font-semibold">${claim.packageValue.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <Button size="sm" variant="outline">View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-500">You haven't filed any claims yet.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
