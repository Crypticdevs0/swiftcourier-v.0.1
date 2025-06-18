"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Phone, Mail, Search, FileText, AlertCircle, CheckCircle, Clock } from "lucide-react"

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const faqs = [
    {
      question: "How do I track my package?",
      answer:
        "You can track your package by entering your tracking number on our tracking page or by logging into your Swift Courier account. You'll receive real-time updates on your package's location and delivery status.",
    },
    {
      question: "What are your shipping rates?",
      answer:
        "Our shipping rates vary based on package size, weight, destination, and delivery speed. Use our SwiftShip tool to calculate exact rates for your shipment. Business customers receive volume discounts.",
    },
    {
      question: "How do I schedule a package pickup?",
      answer:
        "You can schedule a free package pickup through your online account, our mobile app, or by calling customer service. Pickups are available Monday through Saturday during regular business hours.",
    },
    {
      question: "What is Swift Preview?",
      answer:
        "Swift Preview is our free service that provides digital previews of your incoming mail. You'll receive email notifications with images of letter-sized mailpieces before they're delivered to your address.",
    },
    {
      question: "How do I file a claim for a lost or damaged package?",
      answer:
        "You can file a claim online through your account or by contacting customer service. You'll need your tracking number and proof of value. Claims are typically processed within 5-7 business days.",
    },
  ]

  const serviceStatus = [
    { service: "Package Delivery", status: "operational", message: "All services running normally" },
    { service: "SwiftShip Online", status: "operational", message: "All services running normally" },
    { service: "Tracking System", status: "operational", message: "All services running normally" },
    { service: "Swift Preview", status: "maintenance", message: "Scheduled maintenance 2:00-4:00 AM EST" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Customer Support</h1>
          <p className="text-gray-600">We're here to help with all your shipping needs</p>
        </div>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="mb-2">Live Chat</CardTitle>
              <CardDescription className="mb-4">Get instant help from our support team</CardDescription>
              <Badge variant="default">Available 24/7</Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="mb-2">Phone Support</CardTitle>
              <CardDescription className="mb-4">Call us at 1-800-SWIFT-01</CardDescription>
              <Badge variant="secondary">Mon-Fri 8AM-8PM EST</Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="mb-2">Email Support</CardTitle>
              <CardDescription className="mb-4">Send us a detailed message</CardDescription>
              <Badge variant="outline">Response within 24 hours</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Support Content */}
        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
            <TabsTrigger value="claims">File a Claim</TabsTrigger>
            <TabsTrigger value="status">Service Status</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Find quick answers to common questions</CardDescription>

                {/* Search FAQ */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search FAQ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Our Support Team</CardTitle>
                <CardDescription>Send us a message and we'll get back to you soon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <Input placeholder="Enter your first name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <Input placeholder="Enter your last name" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Email Address</label>
                  <Input type="email" placeholder="Enter your email" />
                </div>

                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tracking">Package Tracking</SelectItem>
                      <SelectItem value="shipping">Shipping Questions</SelectItem>
                      <SelectItem value="billing">Billing & Payments</SelectItem>
                      <SelectItem value="technical">Technical Issues</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Tracking Number (if applicable)</label>
                  <Input placeholder="Enter tracking number" />
                </div>

                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea placeholder="Describe your issue or question..." className="min-h-32" />
                </div>

                <Button className="w-full">Send Message</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Claims Tab */}
          <TabsContent value="claims">
            <Card>
              <CardHeader>
                <CardTitle>File a Claim</CardTitle>
                <CardDescription>Report lost, damaged, or missing packages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Before filing a claim</h4>
                      <p className="text-sm text-yellow-700">
                        Please wait 7 business days after the expected delivery date before filing a claim for missing
                        packages.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Tracking Number</label>
                  <Input placeholder="Enter tracking number" />
                </div>

                <div>
                  <label className="text-sm font-medium">Claim Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select claim type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lost">Lost Package</SelectItem>
                      <SelectItem value="damaged">Damaged Package</SelectItem>
                      <SelectItem value="missing">Missing Contents</SelectItem>
                      <SelectItem value="delay">Delivery Delay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Package Value</label>
                  <Input type="number" placeholder="Enter package value" />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea placeholder="Describe the issue in detail..." className="min-h-32" />
                </div>

                <Button className="w-full">Submit Claim</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service Status Tab */}
          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
                <CardDescription>Current status of Swift Courier services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceStatus.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        {service.status === "operational" ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500 mr-3" />
                        )}
                        <div>
                          <h4 className="font-medium">{service.service}</h4>
                          <p className="text-sm text-gray-600">{service.message}</p>
                        </div>
                      </div>
                      <Badge variant={service.status === "operational" ? "default" : "secondary"}>
                        {service.status === "operational" ? "Operational" : "Maintenance"}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                    <div>
                      <h4 className="font-medium text-blue-800">Service Updates</h4>
                      <p className="text-sm text-blue-700">
                        Subscribe to receive notifications about service updates and maintenance schedules.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Subscribe to Updates
                      </Button>
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
