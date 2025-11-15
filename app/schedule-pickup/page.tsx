"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Package, Calendar, Clock, MapPin, Phone, Loader2 } from "lucide-react"

export default function SchedulePickupPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    contactName: "",
    email: "",
    phone: "",
    companyName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    pickupDate: "",
    pickupTime: "",
    packageCount: "",
    estimatedWeight: "",
    specialInstructions: "",
    signatureRequired: false,
    insurance: false,
    pickupType: "standard",
  })

  const [confirmationData, setConfirmationData] = useState<any>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked })
  }

  const handleContinue = () => {
    if (step === 1) {
      if (formData.contactName && formData.email && formData.phone && formData.address && formData.city && formData.state && formData.zip) {
        setStep(2)
      }
    } else if (step === 2) {
      if (formData.pickupDate && formData.pickupTime && formData.packageCount && formData.estimatedWeight) {
        setStep(3)
      }
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    const confirmation = {
      pickupNumber: `PK-${Date.now()}`,
      scheduledDate: formData.pickupDate,
      scheduledTime: formData.pickupTime,
      address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
      estimatedWeight: formData.estimatedWeight,
      packageCount: formData.packageCount,
    }
    
    setConfirmationData(confirmation)
    setIsLoading(false)
  }

  if (confirmationData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Pickup Scheduled!</h1>
              <p className="text-gray-600 mb-8">Your pickup has been confirmed. Keep this confirmation number for your records.</p>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Pickup Number</p>
                    <p className="font-bold text-lg text-blue-600">{confirmationData.pickupNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Scheduled Date</p>
                    <p className="font-bold">{confirmationData.scheduledDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pickup Time</p>
                    <p className="font-bold">{confirmationData.scheduledTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Package Count</p>
                    <p className="font-bold">{confirmationData.packageCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-4 mb-8 text-left">
                <p className="text-sm text-gray-600 mb-2">Pickup Location</p>
                <p className="text-gray-900 font-medium">{confirmationData.address}</p>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => window.location.href = "/"}>
                  Back to Home
                </Button>
                <Button className="flex-1">
                  View My Pickups
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
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Schedule a Pickup</h1>
          <p className="text-gray-600">Have our courier pick up your packages at your convenience</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex-1 flex items-center">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold ${
                step >= stepNum ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                {stepNum}
              </div>
              {stepNum < 3 && (
                <div className={`flex-1 h-1 mx-2 ${step > stepNum ? "bg-blue-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <Card>
          <CardContent className="p-8">
            {/* Step 1: Contact & Address */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactName">Full Name *</Label>
                      <Input
                        id="contactName"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
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
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyName">Company Name (Optional)</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Your Company"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-6">Pickup Address</h2>
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select value={formData.state} onValueChange={(value) => handleSelectChange("state", value)}>
                        <SelectTrigger id="state" className="mt-1">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                          <SelectItem value="PA">Pennsylvania</SelectItem>
                          <SelectItem value="IL">Illinois</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code *</Label>
                      <Input
                        id="zip"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        placeholder="10001"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Pickup Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-6">Pickup Schedule</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pickupDate">Preferred Date *</Label>
                      <Input
                        id="pickupDate"
                        name="pickupDate"
                        type="date"
                        value={formData.pickupDate}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pickupTime">Preferred Time *</Label>
                      <Select value={formData.pickupTime} onValueChange={(value) => handleSelectChange("pickupTime", value)}>
                        <SelectTrigger id="pickupTime" className="mt-1">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM</SelectItem>
                          <SelectItem value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</SelectItem>
                          <SelectItem value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</SelectItem>
                          <SelectItem value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</SelectItem>
                          <SelectItem value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-6">Package Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="packageCount">Number of Packages *</Label>
                      <Input
                        id="packageCount"
                        name="packageCount"
                        type="number"
                        value={formData.packageCount}
                        onChange={handleInputChange}
                        placeholder="1"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="estimatedWeight">Estimated Total Weight (lbs) *</Label>
                      <Input
                        id="estimatedWeight"
                        name="estimatedWeight"
                        type="number"
                        value={formData.estimatedWeight}
                        onChange={handleInputChange}
                        placeholder="10"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="pickupType">Pickup Type</Label>
                    <Select value={formData.pickupType} onValueChange={(value) => handleSelectChange("pickupType", value)}>
                      <SelectTrigger id="pickupType" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Pickup</SelectItem>
                        <SelectItem value="express">Express Pickup (Within 2 hours)</SelectItem>
                        <SelectItem value="scheduled">Scheduled Recurring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                  <Textarea
                    id="specialInstructions"
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    placeholder="Leave with front desk, ring doorbell, etc."
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Review & Confirm */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Review Your Pickup</h2>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p><span className="text-gray-600">Name:</span> {formData.contactName}</p>
                      <p><span className="text-gray-600">Email:</span> {formData.email}</p>
                      <p><span className="text-gray-600">Phone:</span> {formData.phone}</p>
                      <p><span className="text-gray-600">Company:</span> {formData.companyName || "N/A"}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Pickup Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p><span className="text-gray-600">Date:</span> {formData.pickupDate}</p>
                      <p><span className="text-gray-600">Time:</span> {formData.pickupTime}</p>
                      <p><span className="text-gray-600">Packages:</span> {formData.packageCount}</p>
                      <p><span className="text-gray-600">Weight:</span> {formData.estimatedWeight} lbs</p>
                      <p className="col-span-2"><span className="text-gray-600">Address:</span> {formData.address}, {formData.city}, {formData.state} {formData.zip}</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={true}
                      disabled
                    />
                    <Label htmlFor="terms" className="font-normal">I agree to the pickup terms and conditions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notification"
                      checked={true}
                      disabled
                    />
                    <Label htmlFor="notification" className="font-normal">Send me SMS and email confirmations</Label>
                  </div>
                </div>

                <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                  ℹ️ Our courier will arrive during your selected time window. Please ensure packages are ready for pickup.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(step - 1)}
                  disabled={isLoading}
                >
                  Back
                </Button>
              )}
              {step < 3 && (
                <Button
                  className="flex-1"
                  onClick={handleContinue}
                  disabled={isLoading}
                >
                  Continue
                </Button>
              )}
              {step === 3 && (
                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Pickup"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
