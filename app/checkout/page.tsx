"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Lock, Package, Truck, Shield, CheckCircle } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState({
    type: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
  })

  // Mock cart data
  const cartItems = [
    {
      id: 1,
      type: "shipping",
      description: "Swift Express Shipping",
      details: "New York, NY to Los Angeles, CA",
      price: 24.95,
    },
    {
      id: 2,
      type: "insurance",
      description: "Package Insurance",
      details: "Coverage up to $100",
      price: 2.5,
    },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      const response = await fetch("/api/payments/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          paymentMethod: {
            type: paymentMethod.type,
            last4: paymentMethod.cardNumber.slice(-4),
          },
          items: cartItems,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setPaymentComplete(true)
        // Store receipt data
        localStorage.setItem("lastReceipt", JSON.stringify(data.receipt))
      } else {
        alert("Payment failed: " + data.error)
      }
    } catch (error) {
      alert("Payment processing error")
    } finally {
      setIsProcessing(false)
    }
  }

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">Your shipping label has been created and is ready to print.</p>

              <div className="space-y-3 mb-6">
                <Button className="w-full">
                  <Package className="mr-2 h-4 w-4" />
                  Print Shipping Label
                </Button>
                <Button variant="outline" className="w-full">
                  <Truck className="mr-2 h-4 w-4" />
                  Schedule Pickup
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard")}>
                  View in Dashboard
                </Button>
              </div>

              <div className="text-sm text-gray-500">
                <p>Tracking number: SC{Date.now()}</p>
                <p>Receipt sent to your email</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
          <p className="text-gray-600">Complete your shipping purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Information
                </CardTitle>
                <CardDescription>Enter your payment details securely</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Payment Method</label>
                  <Select
                    value={paymentMethod.type}
                    onValueChange={(value) => setPaymentMethod({ ...paymentMethod, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="apple">Apple Pay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod.type === "card" && (
                  <>
                    <div>
                      <label className="text-sm font-medium">Cardholder Name</label>
                      <Input
                        placeholder="John Doe"
                        value={paymentMethod.name}
                        onChange={(e) => setPaymentMethod({ ...paymentMethod, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Card Number</label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={paymentMethod.cardNumber}
                        onChange={(e) => setPaymentMethod({ ...paymentMethod, cardNumber: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Expiry Date</label>
                        <Input
                          placeholder="MM/YY"
                          value={paymentMethod.expiryDate}
                          onChange={(e) => setPaymentMethod({ ...paymentMethod, expiryDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">CVV</label>
                        <Input
                          placeholder="123"
                          value={paymentMethod.cvv}
                          onChange={(e) => setPaymentMethod({ ...paymentMethod, cvv: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox id="save-payment" />
                  <label htmlFor="save-payment" className="text-sm">
                    Save payment method for future use
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First Name" />
                  <Input placeholder="Last Name" />
                </div>
                <Input placeholder="Street Address" />
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="City" />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input placeholder="ZIP Code" />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-gray-600">{item.details}</p>
                    </div>
                    <span className="font-medium">${item.price.toFixed(2)}</span>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security & Trust</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Lock className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">256-bit SSL encryption</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm">PCI DSS compliant</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Money-back guarantee</span>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handlePayment} disabled={isProcessing} className="w-full" size="lg">
              {isProcessing ? "Processing Payment..." : `Pay $${total.toFixed(2)}`}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By completing this purchase, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
